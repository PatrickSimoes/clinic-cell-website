/**
 * Monta as tags do <head> de cada página: title, description, canonical, versões em outros
 * idiomas (hreflang), Open Graph, ícones, manifest e dados estruturados.
 *
 * É executado no build (pré-renderização) e no `npm run dev`, nunca no navegador.
 */
import { site } from '../config/site.js';
import { idiomas, listaDeIdiomas } from '../content/idiomas.js';
import { conteudoDoIdioma } from './conteudo.js';
import { buildStructuredData, ogImageUrl as buildOgImageUrl } from './structured-data.js';

/** Escapa texto para uso em atributos e conteúdo HTML. */
function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** JSON seguro dentro de <script>: impede o fechamento prematuro da tag. */
function safeJson(data) {
  // "<" vira a sequência de escape JSON u003c precedida de barra invertida (6 caracteres),
  // que o parser JSON lê de volta como "<". Evita que o conteúdo feche a tag <script>.
  const escapedLessThan = String.fromCharCode(92) + 'u003c';
  return JSON.stringify(data).replaceAll('<', escapedLessThan);
}

/** URL absoluta da página inicial de um idioma: "https://.../" ou "https://.../es/". */
export function urlDoIdioma(siteUrl, id) {
  return `${siteUrl}${idiomas[id].caminho}`;
}

/**
 * Versões da página inicial em cada idioma (hreflang), e o português como padrão (x-default).
 * As duas páginas listam as mesmas versões: o Google só aceita a ligação se ela for recíproca.
 */
function alternates(siteUrl) {
  return [
    ...listaDeIdiomas.map((i) => [i.lang, urlDoIdioma(siteUrl, i.id)]),
    ['x-default', urlDoIdioma(siteUrl, 'pt')],
  ];
}

/**
 * @param {'home' | '404'} page
 * @param {{ siteUrl: string, base: string, ogImageVersion?: string }} deploy
 *   URL absoluta da raiz (com barra final), base path e, no build, o hash da og-image.
 * @param {'pt' | 'es'} [idioma]  Idioma da página (a 404 é só em português).
 * @returns {string} HTML das tags do <head>
 */
export function renderHead(page, { siteUrl, base, ogImageVersion }, idioma = 'pt') {
  const isHome = page === 'home';
  const { seo, idioma: atual } = conteudoDoIdioma(idioma);
  const meta = isHome ? seo.home : seo.notFound;
  const pageUrl = urlDoIdioma(siteUrl, atual.id);
  const ogImageUrl = buildOgImageUrl(siteUrl, ogImageVersion);

  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}">`,
    isHome ? `<link rel="canonical" href="${esc(pageUrl)}">` : null,
    ...(isHome
      ? alternates(siteUrl).map(([lang, href]) => `<link rel="alternate" hreflang="${lang}" href="${esc(href)}">`)
      : []),
    `<meta name="robots" content="${isHome ? 'index, follow, max-image-preview:large' : 'noindex, follow'}">`,
    `<meta name="theme-color" content="${esc(seo.themeColor)}">`,
    `<meta name="color-scheme" content="light">`,
    `<meta name="format-detection" content="telephone=no">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:locale" content="${atual.ogLocale}">`,
    ...(isHome
      ? listaDeIdiomas
          .filter((i) => i.id !== atual.id)
          .map((i) => `<meta property="og:locale:alternate" content="${i.ogLocale}">`)
      : []),
    `<meta property="og:site_name" content="${esc(site.nome)}">`,
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    isHome ? `<meta property="og:url" content="${esc(pageUrl)}">` : null,
    `<meta property="og:image" content="${esc(ogImageUrl)}">`,
    `<meta property="og:image:type" content="image/jpeg">`,
    `<meta property="og:image:width" content="${seo.ogImage.width}">`,
    `<meta property="og:image:height" content="${seo.ogImage.height}">`,
    `<meta property="og:image:alt" content="${esc(seo.ogImage.alt)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<link rel="icon" href="${base}favicon.ico" sizes="48x48">`,
    `<link rel="icon" href="${base}favicon-96.png" type="image/png" sizes="96x96">`,
    `<link rel="apple-touch-icon" href="${base}apple-touch-icon.png">`,
    `<link rel="manifest" href="${base}site.webmanifest">`,
    isHome
      ? `<script type="application/ld+json">${safeJson(buildStructuredData({ pageUrl, siteUrl, ogImageVersion, idioma: atual.id }))}</script>`
      : null,
  ];

  return tags.filter(Boolean).join('\n    ');
}
