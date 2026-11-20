/**
 * Pré-renderização: transforma o build do Vite em páginas HTML completas.
 *
 * - dist/index.html     página inicial com todo o conteúdo no HTML (SEO e carregamento rápido)
 * - dist/es/index.html  a mesma página em espanhol (src/content/idiomas.js)
 * - dist/404.html       página de erro (o GitHub Pages a usa automaticamente)
 * - dist/sitemap.xml, dist/robots.txt, dist/site.webmanifest
 *
 * Também:
 * - confere os dados editados à mão (src/lib/validar-site.js) e interrompe o build se houver erro;
 * - embute o CSS no HTML quando ele é pequeno (evita uma requisição que bloqueia a renderização);
 * - faz preload da fonte principal (subconjunto latino);
 * - versiona a URL da imagem de compartilhamento (og-image.jpg?v=<hash>).
 *
 * Executado por `npm run build`. Lê SITE_URL e BASE_PATH (ver scripts/deploy-env.mjs).
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolveDeployEnv } from './deploy-env.mjs';
import { site } from '../src/config/site.js';
import { avaliacoes } from '../src/content/avaliacoes.js';
import { idiomas, listaDeIdiomas } from '../src/content/idiomas.js';
import { seo } from '../src/content/seo.js';
import { areasDeServico } from '../src/content/servicos.js';
import { textos } from '../src/content/textos.js';
import { textos as textosEs } from '../src/content/textos.es.js';
import { validarSite } from '../src/lib/validar-site.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');
const deploy = resolveDeployEnv();

/** CSS até este tamanho é embutido no HTML (verify-dist.mjs confere com o mesmo limite). */
const INLINE_CSS_LIMIT = 60 * 1024;
/**
 * Fontes com preload: só a DM Sans (subconjunto latino, eixo opsz), usada no H1 — o elemento
 * de LCP. A Red Hat Mono não aparece na primeira dobra do celular e fica sem preload.
 */
const PRELOAD_FONT_PATTERN = /^dm-sans-latin-opsz-normal-[\w-]+\.woff2$/;

const { render, renderHead, idsComImagem } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
);

// 0. Dados editados à mão ---------------------------------------------------------
validarSite(site, areasDeServico, { imagens: idsComImagem, avaliacoes, textos: { pt: textos, es: textosEs } });

let template = await readFile(path.join(dist, 'index.html'), 'utf8');

/** O <html> do index.html: o idioma de cada página entra aqui. */
const HTML_LANG = '<html lang="pt-BR">';
for (const marker of ['<!--app-head-->', '<!--app-html-->', HTML_LANG]) {
  if (!template.includes(marker)) throw new Error(`Marcador ${marker} não encontrado em dist/index.html`);
}

/** Valor de um atributo numa tag HTML, com aspas duplas, simples ou sem aspas. */
function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`, 'i'));
  return m ? (m[1] ?? m[2] ?? m[3]) : undefined;
}

/** Caminho em dist/ de uma URL do build ("/repo/assets/x.css" → dist/assets/x.css). */
function distPath(href) {
  const relative = href.startsWith(deploy.base) ? href.slice(deploy.base.length) : href.replace(/^\//, '');
  return path.join(dist, relative);
}

// 1. CSS embutido -------------------------------------------------------------
// Procura <link> de stylesheet com os atributos em qualquer ordem: uma atualização do Vite
// que mude o formato da tag não pode desligar a otimização em silêncio.
const cssLinks = [...template.matchAll(/<link\b[^>]*>/gi)]
  .map((m) => m[0])
  .filter((tag) => attr(tag, 'rel')?.toLowerCase() === 'stylesheet');
if (cssLinks.length === 0) {
  throw new Error('CSS do Vite não encontrado em dist/index.html: o formato do <link rel="stylesheet"> mudou?');
}
for (const tag of cssLinks) {
  const href = attr(tag, 'href');
  if (!href?.endsWith('.css')) throw new Error(`Não foi possível ler o href de ${tag}`);
  const file = distPath(href);
  const css = await readFile(file, 'utf8');
  if (Buffer.byteLength(css) <= INLINE_CSS_LIMIT) {
    template = template.replace(tag, () => `<style>${css}</style>`);
    await rm(file);
  }
}

// 2. Preload das fontes ------------------------------------------------------
const assets = await readdir(path.join(dist, 'assets'));
const fontPreloads = assets
  .filter((f) => PRELOAD_FONT_PATTERN.test(f))
  .map((f) => `<link rel="preload" href="${deploy.base}assets/${f}" as="font" type="font/woff2" crossorigin>`)
  .join('\n    ');

// 3. Imagem de compartilhamento ----------------------------------------------
// O hash entra na URL: quando a imagem muda, WhatsApp e Facebook buscam a nova em vez da do cache.
const ogImageVersion = createHash('sha256')
  .update(await readFile(path.join(dist, seo.ogImage.path)))
  .digest('hex')
  .slice(0, 8);

// 4. Páginas -------------------------------------------------------------------
/**
 * O React 19 emite <link rel="preload" as="image"> para imagens não-lazy no início do HTML
 * renderizado. Elas são movidas para o <head> (descoberta mais cedo, fora da área hidratada).
 * Os atributos são reconhecidos em qualquer ordem.
 * @param {string} appHtml
 */
function extractImagePreloads(appHtml) {
  const links = [];
  const body = appHtml.replace(/<link\b[^>]*>/gi, (tag) => {
    if (attr(tag, 'rel')?.toLowerCase() !== 'preload' || attr(tag, 'as')?.toLowerCase() !== 'image') return tag;
    links.push(
      tag
        .replace(/\simageSrcSet=/i, ' imagesrcset=')
        .replace(/\simageSizes=/i, ' imagesizes=')
        .replace(/\s*\/>$/, '>'),
    );
    return '';
  });
  return { body, links };
}

/**
 * @param {'home' | '404'} page
 * @param {'pt' | 'es'} [idioma]  O navegador sabe o idioma pelo <html lang> (src/main.jsx).
 */
function buildPage(page, idioma = 'pt') {
  const { body, links } = extractImagePreloads(render(page, idioma));
  const head = [fontPreloads, ...links, renderHead(page, { ...deploy, ogImageVersion }, idioma)]
    .filter(Boolean)
    .join('\n    ');
  let html = template
    .replace(HTML_LANG, () => `<html lang="${idiomas[idioma].lang}">`)
    .replace('<!--app-head-->', () => head)
    .replace('<!--app-html-->', () => body);
  if (page === '404') html = html.replace('<div id="root">', '<div id="root" data-page="404">');
  return html;
}

for (const { id, caminho } of listaDeIdiomas) {
  await mkdir(path.join(dist, caminho), { recursive: true });
  await writeFile(path.join(dist, caminho, 'index.html'), buildPage('home', id));
}
await writeFile(path.join(dist, '404.html'), buildPage('404'));

// 5. Sitemap, robots e manifest ---------------------------------------------
// Sem <lastmod>: a data do build mudaria a cada push e na republicação anual do copyright,
// e o Google ignora lastmod que não reflete mudanças reais de conteúdo.
// Cada página lista as versões nos dois idiomas (as mesmas do <link rel="alternate"> do head).
const urlDe = (i) => `${deploy.siteUrl}${i.caminho}`;
const versoes = [
  ...listaDeIdiomas.map((i) => `    <xhtml:link rel="alternate" hreflang="${i.lang}" href="${urlDe(i)}"/>`),
  `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlDe(idiomas.pt)}"/>`,
].join('\n');
await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${listaDeIdiomas.map((i) => `  <url>\n    <loc>${urlDe(i)}</loc>\n${versoes}\n  </url>`).join('\n')}
</urlset>
`,
);

await writeFile(
  path.join(dist, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${deploy.siteUrl}sitemap.xml
`,
);

await writeFile(
  path.join(dist, 'site.webmanifest'),
  `${JSON.stringify(
    {
      name: `${site.nome} — ${site.segmento}`,
      short_name: site.nome,
      lang: 'pt-BR',
      start_url: deploy.base,
      scope: deploy.base,
      display: 'browser',
      background_color: '#ffffff',
      theme_color: seo.themeColor,
      icons: [
        { src: `${deploy.base}icon-192.png`, sizes: '192x192', type: 'image/png' },
        { src: `${deploy.base}icon-512.png`, sizes: '512x512', type: 'image/png' },
        { src: `${deploy.base}icon-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2,
  )}\n`,
);

await rm(ssrDir, { recursive: true, force: true });

console.log(`Pré-renderização concluída para ${deploy.siteUrl}`);
if (!deploy.isPublicUrl) {
  console.warn(
    'Aviso: SITE_URL local — canonical, Open Graph e sitemap apontam para este computador.\n' +
      '       No GitHub Actions isso é configurado automaticamente. Para simular o endereço publicado,\n' +
      '       veja "Simular o endereço publicado" no README.',
  );
}
