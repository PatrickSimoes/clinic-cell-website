/**
 * Verificação do build de produção (dist/), sem navegador. Roda no CI antes de cada deploy.
 *
 * Confere: dados editados à mão, arquivos obrigatórios, title/description, canonical, Open
 * Graph (inclusive se a og-image está atualizada), CSS embutido e preload da fonte, hierarquia
 * de títulos, imagens, âncoras internas, links do WhatsApp e do mapa, dados estruturados,
 * sitemap, robots, manifest, página 404 e a regra de não publicar serviços sem confirmação.
 *
 * Uso: npm run verify   (usa SITE_URL e BASE_PATH, como o build)
 * Sai com código 1 se algum item falhar. Avisos (!) não reprovam.
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { parse } from 'node-html-parser';
import sharp from 'sharp';
import { resolveDeployEnv } from './deploy-env.mjs';
import { DADOS_DA_OG_IMAGE, dadosDaOgImage, sha256Curto } from './lib/og-image-dados.mjs';
import { site } from '../src/config/site.js';
import { areasDeServico } from '../src/content/servicos.js';
import { seo } from '../src/content/seo.js';
import { whatsappUrl, mapsUrl, mapaIncorporadoUrl, directionsUrl, wazeUrl } from '../src/lib/contact.js';
import { problemasNosDados } from '../src/lib/validar-site.js';

/** Mesmo limite de scripts/prerender.mjs: CSS até este tamanho deve sair embutido no HTML. */
const INLINE_CSS_LIMIT = 60 * 1024;
/** Fonte com preload (subconjunto latino da DM Sans, usada no H1). */
const PRELOAD_FONT_PATTERN = /\/assets\/dm-sans-latin-opsz-normal-[\w-]+\.woff2$/;
/**
 * Sinais de dado mal preenchido que chegou ao texto publicado: "9h às NaNh", "2011NaN",
 * "undefinedh", "[object Object]". Basta uma borda de palavra de um dos lados, assim um
 * identificador que contenha essas letras no meio (Place ID) não reprova o build por engano.
 * Os nomes de arquivo com hash do Vite (alfabeto com "-", ex. "sobre-BQEoMNaN.jpg") saem do
 * JSON-LD antes do teste.
 */
const TEXTO_QUEBRADO = /\bNaN|NaN\b|\bundefined|undefined\b|\[object Object\]/;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const deploy = resolveDeployEnv();

let failures = 0;
let warnings = 0;
const ok = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg) => {
  failures++;
  console.log(`  ✗ ${msg}`);
};
const warn = (msg) => {
  warnings++;
  console.log(`  ! ${msg}`);
};
const check = (cond, msg, detail = '') => (cond ? ok(msg) : fail(detail ? `${msg} — ${detail}` : msg));
const section = (title) => console.log(`\n${title}`);

/** Caminho público (com base path) → arquivo em dist/, ou null se for externo. */
function distFileFor(url) {
  let p = url.split('#')[0].split('?')[0];
  if (p.startsWith(deploy.siteUrl)) p = deploy.base + p.slice(deploy.siteUrl.length);
  if (!p.startsWith(deploy.base)) return null;
  p = decodeURIComponent(p.slice(deploy.base.length));
  if (p === '' || p.endsWith('/')) p += 'index.html';
  return path.join(dist, p);
}

// ---------------------------------------------------------------------------
section('Dados editados à mão (site.js e servicos.js)');
{
  const problemas = problemasNosDados(site, areasDeServico);
  for (const p of problemas) fail(p);
  if (problemas.length === 0) ok('WhatsApp, endereço, horários, redes sociais e serviços bem preenchidos');
}

// ---------------------------------------------------------------------------
section('Arquivos obrigatórios');
const required = [
  'index.html', '404.html', 'robots.txt', 'sitemap.xml', 'site.webmanifest',
  'favicon.ico', 'favicon-96.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png',
  'icon-maskable-512.png', seo.ogImage.path, seo.logoPath,
];
for (const f of required) check(existsSync(path.join(dist, f)), f);
if (!existsSync(path.join(dist, 'index.html'))) {
  console.log('\nBuild não encontrado. Rode `npm run build` antes.');
  process.exit(1);
}

const html = await readFile(path.join(dist, 'index.html'), 'utf8');
const doc = parse(html, { comment: false });
const metaContent = (sel) => doc.querySelector(sel)?.getAttribute('content') ?? null;

// ---------------------------------------------------------------------------
section('Página inicial — metadados');
check(doc.querySelector('html')?.getAttribute('lang') === 'pt-BR', 'html lang="pt-BR"');
check(!html.includes('<!--app-head-->') && !html.includes('<!--app-html-->'), 'marcadores de pré-renderização substituídos');
const viewport = metaContent('meta[name="viewport"]') ?? '';
check(viewport.includes('width=device-width') && !/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/.test(viewport),
  'viewport responsivo e sem bloqueio de zoom', viewport);

const title = doc.querySelector('title')?.text.trim() ?? '';
check(title.length > 0, `title: "${title}"`);
if (title.length > 70) fail(`title com ${title.length} caracteres (máx. 70)`);
else if (title.length > 60) warn(`title com ${title.length} caracteres — pode ser truncado no Google (~60)`);

const description = metaContent('meta[name="description"]') ?? '';
check(description.length >= 70 && description.length <= 160, `meta description com ${description.length} caracteres (70–160)`);

const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href');
check(canonical === deploy.siteUrl, `canonical = ${deploy.siteUrl}`, `encontrado: ${canonical}`);
check((metaContent('meta[name="robots"]') ?? '').includes('index') && !(metaContent('meta[name="robots"]') ?? '').includes('noindex'), 'robots meta permite indexação');

for (const prop of ['og:type', 'og:locale', 'og:site_name', 'og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt']) {
  check(Boolean(metaContent(`meta[property="${prop}"]`)), `Open Graph ${prop}`);
}
check(metaContent('meta[property="og:url"]') === deploy.siteUrl, 'og:url igual ao canonical');
const ogImage = metaContent('meta[property="og:image"]') ?? '';
check(/^https?:\/\//.test(ogImage), 'og:image com URL absoluta', ogImage);
const ogFile = distFileFor(ogImage);
if (ogFile && existsSync(ogFile)) {
  const m = await sharp(ogFile).metadata();
  check(m.width === seo.ogImage.width && m.height === seo.ogImage.height,
    `og:image ${m.width}x${m.height} confere com as meta tags`);
  const size = (await stat(ogFile)).size;
  if (size > 300 * 1024) warn(`og:image com ${(size / 1024).toFixed(0)} KB (WhatsApp prefere < 300 KB)`);
} else fail(`og:image aponta para arquivo inexistente: ${ogImage}`);
{
  // A imagem mostra telefone e endereço: precisa ter sido gerada com os dados atuais.
  const esperado = await dadosDaOgImage(site);
  let gravado = null;
  try {
    gravado = JSON.parse(await readFile(path.join(root, DADOS_DA_OG_IMAGE), 'utf8'));
  } catch {
    // sem registro: a imagem nunca foi gerada pelo script atual
  }
  const diferencas = Object.keys(esperado).filter((k) => gravado?.[k] !== esperado[k]);
  check(diferencas.length === 0, 'og-image.jpg atualizada (telefone, endereço e logo)',
    `desatualizada em: ${diferencas.join(', ')} — rode \`npm run og:image\` e commite public/og-image.jpg e ${DADOS_DA_OG_IMAGE}`);
  // O registro só vale se for o da imagem publicada (ex.: o JSON foi commitado sem a imagem nova).
  const imagem = ogFile && existsSync(ogFile) ? sha256Curto(await readFile(ogFile)) : null;
  check(Boolean(gravado?.imagemSha256) && imagem === gravado.imagemSha256, 'og-image.jpg é a imagem registrada',
    `a imagem não corresponde a ${DADOS_DA_OG_IMAGE} — rode \`npm run og:image\` e commite os dois arquivos`);
}

if (deploy.isPublicUrl) check(!html.includes('localhost'), 'nenhuma referência a localhost');
else warn('SITE_URL local: URLs absolutas apontam para este computador (normal em teste local)');
check(!/fonts\.googleapis|fonts\.gstatic/.test(html), 'fontes auto-hospedadas (sem Google Fonts externo)');

// ---------------------------------------------------------------------------
section('Página inicial — carregamento');
{
  // O prerender embute o CSS pequeno; se o formato do HTML do Vite mudar, isso pararia em silêncio.
  const styles = doc.querySelectorAll('head style');
  const cssLinks = doc.querySelectorAll('link').filter((l) => (l.getAttribute('rel') ?? '').toLowerCase() === 'stylesheet');
  for (const link of cssLinks) {
    const file = distFileFor(link.getAttribute('href') ?? '');
    const size = file && existsSync(file) ? (await stat(file)).size : 0;
    if (size <= INLINE_CSS_LIMIT) fail(`CSS não embutido: ${link.getAttribute('href')} (${(size / 1024).toFixed(1)} KB) — o formato do <link> do Vite mudou?`);
    else warn(`CSS com ${(size / 1024).toFixed(0)} KB carregado por <link> (acima do limite para embutir)`);
  }
  check(styles.length > 0 || cssLinks.length > 0, cssLinks.length ? 'CSS carregado por <link>' : 'CSS embutido no HTML');
  const fontPreload = doc.querySelectorAll('link[rel="preload"][as="font"]')
    .map((l) => l.getAttribute('href') ?? '')
    .find((href) => PRELOAD_FONT_PATTERN.test(href));
  check(Boolean(fontPreload) && existsSync(distFileFor(fontPreload) ?? ''), 'preload da fonte principal (DM Sans, latino)', fontPreload ?? 'não encontrado');
  const imagePreloadsInRoot = doc.querySelectorAll('#root link[rel="preload"]').length;
  check(imagePreloadsInRoot === 0, 'preloads de imagem movidos para o <head>', `${imagePreloadsInRoot} dentro de #root`);
}

// ---------------------------------------------------------------------------
section('Página inicial — estrutura');
const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
const h1s = headings.filter((h) => h.tagName === 'H1');
check(h1s.length === 1, `exatamente um H1 (${h1s.length})`, h1s.map((h) => h.text.trim()).join(' | '));
let prev = 0;
const skips = [];
for (const h of headings) {
  const level = Number(h.tagName[1]);
  if (prev && level > prev + 1) skips.push(`${h.tagName} "${h.text.trim().slice(0, 40)}" após H${prev}`);
  prev = level;
}
check(skips.length === 0, 'hierarquia de títulos sem saltos', skips.join('; '));
check(headings[0]?.tagName === 'H1', 'primeiro título da página é o H1');

for (const tag of ['header', 'main', 'footer', 'nav']) check(Boolean(doc.querySelector(tag)), `landmark <${tag}>`);

const ids = doc.querySelectorAll('[id]').map((el) => el.getAttribute('id'));
const dupIds = ids.filter((id, i) => ids.indexOf(id) !== i);
check(dupIds.length === 0, 'ids únicos', [...new Set(dupIds)].join(', '));

// Imagens
const imgs = doc.querySelectorAll('img');
for (const img of imgs) {
  const src = img.getAttribute('src') ?? '';
  const label = path.basename(src.split('?')[0]) || '(sem src)';
  if (img.getAttribute('alt') === undefined) fail(`imagem sem atributo alt: ${label}`);
  if (!img.getAttribute('width') || !img.getAttribute('height')) fail(`imagem sem width/height (evita CLS): ${label}`);
  const files = [src, ...(img.getAttribute('srcset') ?? '').split(',').map((s) => s.trim().split(/\s+/)[0])].filter(Boolean);
  for (const f of files) {
    const file = distFileFor(f);
    if (file && !existsSync(file)) fail(`imagem inexistente: ${f}`);
  }
}
check(true, `${imgs.length} imagens conferidas (alt, dimensões, arquivos)`);
for (const foto of doc.querySelectorAll('img.about-photo__img')) {
  // A foto real nunca é decorativa: precisa descrever o que mostra.
  check((foto.getAttribute('alt') ?? '').trim().length > 0, 'foto real com descrição (alt)',
    'preencha textos.sobre.foto.alt em src/content/textos.js');
}

// Rede de segurança: dado mal preenchido que virou texto ("NaNh", "undefined"...).
{
  const visivel = (doc.querySelector('#root')?.text ?? '').replace(/\s+/g, ' ');
  const ld = doc
    .querySelectorAll('script[type="application/ld+json"]')
    .map((s) => s.text)
    .join(' ')
    // Arquivos gerados pelo Vite (foto do Sobre): o hash é aleatório e pode ter "-NaN" ou "NaN.".
    .replace(/\/assets\/[\w.-]+/g, '/assets/…');
  const trecho = (s) => s.match(new RegExp(`.{0,40}(?:${TEXTO_QUEBRADO.source}).{0,40}`))?.[0];
  check(!TEXTO_QUEBRADO.test(visivel), 'texto da página sem "NaN", "undefined" ou "[object Object]"', trecho(visivel));
  check(!TEXTO_QUEBRADO.test(ld), 'dados estruturados sem "NaN", "undefined" ou "[object Object]"', trecho(ld));
}

// ---------------------------------------------------------------------------
section('Links');
const anchors = doc.querySelectorAll('a');
const allowedWhatsApp = new Set([
  ...Object.values(site.whatsapp.mensagens).map((m) => whatsappUrl(m)),
  ...areasDeServico.map((a) => whatsappUrl(a.mensagemWhatsApp)),
]);
let waCount = 0;
let internal = 0;
const external = new Set();
for (const a of anchors) {
  const href = a.getAttribute('href');
  const imgAlts = a.querySelectorAll('img').map((img) => img.getAttribute('alt') ?? '').join(' ');
  const name = (a.getAttribute('aria-label') || `${a.text} ${imgAlts}`).replace(/\s+/g, ' ').trim();
  if (!href) { fail(`link sem href: "${name}"`); continue; }
  if (!name) fail(`link sem texto acessível: ${href}`);
  if (a.getAttribute('target') === '_blank' && !(a.getAttribute('rel') ?? '').includes('noopener')) {
    fail(`target=_blank sem rel="noopener": ${href}`);
  }
  if (href.startsWith('#')) {
    internal++;
    if (href === '#' || !doc.querySelector(`[id="${href.slice(1)}"]`)) fail(`âncora sem destino: ${href} ("${name}")`);
  } else if (href.startsWith('https://wa.me/')) {
    waCount++;
    const u = new URL(href);
    if (u.pathname !== `/${site.whatsapp.numero}`) fail(`WhatsApp com número errado: ${href}`);
    const text = u.searchParams.get('text') ?? '';
    if (!text.trim()) fail(`WhatsApp sem mensagem pré-preenchida: "${name}"`);
    if (!allowedWhatsApp.has(href)) warn(`mensagem de WhatsApp fora das configuradas: "${text}"`);
    if (a.getAttribute('target') !== '_blank') warn(`WhatsApp abre na mesma aba: "${name}"`);
  } else if (/^https?:\/\//.test(href)) {
    external.add(href);
  } else {
    const file = distFileFor(href);
    if (!file) fail(`link relativo fora do base path: ${href}`);
    else if (!existsSync(file)) fail(`link interno quebrado: ${href}`);
    else internal++;
  }
}
check(waCount > 0, `${waCount} links de WhatsApp válidos (número ${site.whatsapp.numero}, com mensagem)`);
check(internal > 0, `${internal} links internos com destino existente`);
check(external.has(mapsUrl()), 'link "Abrir no Google Maps" presente');
check(external.has(directionsUrl()), 'link "Traçar rota" presente');
if (!external.has(wazeUrl())) warn('link "Abrir no Waze" não encontrado');
const knownExternal = new Set([mapsUrl(), directionsUrl(), wazeUrl(), ...site.redesSociais.map((r) => r.url)]);
const unexpected = [...external].filter((h) => !knownExternal.has(h));
if (unexpected.length) warn(`links externos adicionais: ${unexpected.join(', ')}`);

// O mapa do Google só recebe o endereço pelo JavaScript, perto da Localização: no HTML, sem src.
const iframes = doc.querySelectorAll('iframe');
const mapa = doc.querySelector('iframe.location__map-frame');
check(iframes.length === 1 && Boolean(mapa), 'mapa do Google na Localização (único iframe da página)');
if (mapa) {
  check(Boolean(mapa.getAttribute('title')?.trim()), 'mapa com título (leitores de tela)');
  check(!mapa.hasAttribute('src'), 'mapa sem src no HTML (não carrega na abertura da página)');
}
check(/^https:\/\/maps\.google\.com\/maps\?cid=\d+&/.test(mapaIncorporadoUrl()), 'endereço do mapa aponta para o ponto da loja (CID)', mapaIncorporadoUrl());

// ---------------------------------------------------------------------------
section('Serviços — regra de publicação');
const confirmed = areasDeServico.filter((a) => a.confirmado);
const pending = areasDeServico.filter((a) => !a.confirmado);
const servicosConfirmados = confirmed.flatMap((a) => a.servicos);
console.log(
  `  · ${confirmed.length} área(s) confirmada(s), com ${servicosConfirmados.length} serviço(s); ${pending.length} aguardando confirmação`,
);
for (const a of confirmed) {
  const linha = doc.querySelector(`[id="servico-${a.id}"]`);
  check(Boolean(linha), `publicada: ${a.nome}`);
  if (!linha) continue;
  const imagem = linha.querySelector('img.service__image')?.getAttribute('src') ?? '';
  const arquivoDaImagem = imagem && distFileFor(imagem);
  check(Boolean(arquivoDaImagem && existsSync(arquivoDaImagem)), `${a.nome}: imagem da área publicada`, imagem || '(sem src)');
  const itens = linha.querySelectorAll('.service__item').map((li) => li.text.trim());
  check(JSON.stringify(itens) === JSON.stringify(a.servicos), `${a.nome}: ${a.servicos.length} serviço(s), na ordem do cadastro`, itens.join(' | '));
}
for (const a of pending) {
  const leaked = doc.querySelector(`[id="servico-${a.id}"]`) || html.includes(whatsappUrl(a.mensagemWhatsApp).replace(/&/g, '&amp;'));
  check(!leaked, `não publicada (aguardando confirmação): ${a.nome}`);
}

// ---------------------------------------------------------------------------
section('Dados estruturados (JSON-LD)');
const ldScripts = doc.querySelectorAll('script[type="application/ld+json"]');
check(ldScripts.length === 1, 'um bloco JSON-LD');
let graph = [];
try {
  const data = JSON.parse(ldScripts[0]?.text ?? '');
  check(data['@context'] === 'https://schema.org', '@context schema.org');
  graph = data['@graph'] ?? [data];
} catch (e) {
  fail(`JSON-LD inválido: ${e.message}`);
}
const biz = graph.find((n) => n['@type'] === 'LocalBusiness');
check(Boolean(biz), 'entidade LocalBusiness');
if (biz) {
  check(biz.name === site.nome, `name = ${site.nome}`);
  check(biz.url === deploy.siteUrl, 'url = canonical');
  check(biz.telephone === site.whatsapp.internacional, `telephone = ${site.whatsapp.internacional}`);
  const a = biz.address ?? {};
  check(a['@type'] === 'PostalAddress' && a.streetAddress && a.addressLocality === site.endereco.cidade && a.addressRegion === site.endereco.uf && a.addressCountry === 'BR',
    'endereço completo (rua, cidade, UF, país)');
  check(typeof biz.geo?.latitude === 'number' && typeof biz.geo?.longitude === 'number', 'coordenadas geográficas');
  check(Boolean(biz.image) && Boolean(biz.logo), 'image e logo');
  for (const u of [biz.logo, ...(Array.isArray(biz.image) ? biz.image : [biz.image])]) {
    const f = distFileFor(u);
    if (!f || !existsSync(f)) fail(`imagem do JSON-LD inexistente: ${u}`);
  }
  check(Boolean(biz.openingHoursSpecification) === Boolean(site.horarios?.length),
    site.horarios?.length ? 'horários confirmados publicados' : 'horários ausentes (ainda não confirmados)');
  const catalogos = biz.hasOfferCatalog?.itemListElement ?? [];
  check(JSON.stringify(catalogos.map((c) => c.name)) === JSON.stringify(confirmed.map((a) => a.nome)),
    'áreas no JSON-LD = áreas confirmadas', `JSON-LD: [${catalogos.map((c) => c.name).join(', ')}]`);
  const offered = catalogos.flatMap((c) => c.itemListElement ?? []).map((o) => o.itemOffered?.name).sort();
  check(JSON.stringify(offered) === JSON.stringify([...servicosConfirmados].sort()),
    'serviços no JSON-LD = serviços das áreas confirmadas', `JSON-LD: [${offered.join(', ')}]`);
  if (!site.endereco.cep) warn('CEP não informado (src/config/site.js) — recomendado para SEO local');
}
check(graph.some((n) => n['@type'] === 'WebSite'), 'entidade WebSite');

// ---------------------------------------------------------------------------
section('Página 404');
const html404 = await readFile(path.join(dist, '404.html'), 'utf8');
const doc404 = parse(html404);
check((doc404.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '').includes('noindex'), '404 com noindex');
check(!doc404.querySelector('link[rel="canonical"]'), '404 sem canonical');
check(doc404.querySelectorAll('h1').length === 1, '404 com um H1');
check(doc404.querySelectorAll('a').some((a) => a.getAttribute('href') === deploy.base), `404 com link para a página inicial (${deploy.base})`);
check(doc404.querySelector('#root')?.getAttribute('data-page') === '404', '404 hidrata a página correta');

// ---------------------------------------------------------------------------
section('robots.txt, sitemap.xml e manifest');
const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
check(robots.includes(`Sitemap: ${deploy.siteUrl}sitemap.xml`), 'robots.txt aponta para o sitemap');
check(!/^Disallow:\s*\/\s*$/m.test(robots), 'robots.txt não bloqueia o site');
if (deploy.base !== '/') {
  warn(`site em subcaminho (${deploy.base}): o Google só lê robots.txt na raiz do domínio — envie o sitemap pelo Search Console`);
}
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
check(sitemap.startsWith('<?xml') && sitemap.includes('http://www.sitemaps.org/schemas/sitemap/0.9'), 'sitemap.xml bem formado');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
check(locs.length === 1 && locs[0] === deploy.siteUrl, 'sitemap lista a página canônica', locs.join(', '));
try {
  const manifest = JSON.parse(await readFile(path.join(dist, 'site.webmanifest'), 'utf8'));
  check(manifest.start_url === deploy.base, 'manifest start_url = base path');
  for (const icon of manifest.icons ?? []) {
    const f = distFileFor(icon.src);
    if (!f || !existsSync(f)) fail(`ícone do manifest inexistente: ${icon.src}`);
  }
} catch (e) {
  fail(`manifest inválido: ${e.message}`);
}

// ---------------------------------------------------------------------------
section('Peso');
const assetsDir = path.join(dist, 'assets');
const assetFiles = existsSync(assetsDir) ? await readdir(assetsDir) : [];
let jsGz = 0;
for (const f of assetFiles.filter((f) => f.endsWith('.js'))) jsGz += gzipSync(await readFile(path.join(assetsDir, f))).length;
const htmlGz = gzipSync(html).length;
const htmlLabel = doc.querySelector('head style') ? 'HTML (com CSS embutido)' : 'HTML';
console.log(`  · ${htmlLabel}: ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB (${(htmlGz / 1024).toFixed(1)} KB gzip)`);
console.log(`  · JavaScript: ${(jsGz / 1024).toFixed(1)} KB gzip`);
if (jsGz > 110 * 1024) warn('JavaScript acima de 110 KB gzip');
if (htmlGz > 50 * 1024) warn('HTML acima de 50 KB gzip');

// ---------------------------------------------------------------------------
console.log(`\n${failures ? `✗ ${failures} falha(s)` : '✓ Tudo certo'}${warnings ? `, ${warnings} aviso(s)` : ''}.`);
process.exit(failures ? 1 : 0);
