/**
 * Gera public/og-image.jpg (1200x630): a imagem que aparece ao compartilhar o link
 * do site (WhatsApp, Facebook, etc.). Renderizada pelo Chrome a partir de um HTML com
 * as mesmas fontes, cores e logo do site.
 *
 * Uso: npm run og:image
 * Rode de novo sempre que mudar o WhatsApp, o endereço, a cidade ou a identidade visual, e
 * commite os dois arquivos gerados: public/og-image.jpg e scripts/og-image.dados.json.
 * O verify reprova o build se a imagem estiver desatualizada: ele compara o JSON (gravado
 * aqui, com a impressão digital da imagem) com os dados atuais do site e com a imagem.
 * Requer Chrome ou Edge instalado (defina CHROME_PATH se não for encontrado).
 */
import { readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { site } from '../src/config/site.js';
import { findBrowser } from './lib/browser.mjs';
import { DADOS_DA_OG_IMAGE, LOGO_DA_OG_IMAGE, dadosDaOgImage, sha256Curto } from './lib/og-image-dados.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public', 'og-image.jpg');
const dados = await dadosDaOgImage(site);
/** Arquivo local embutido como data URI (a página é criada em memória e não lê file://). */
const dataUrl = async (p, type) => `data:${type};base64,${(await readFile(path.join(root, p))).toString('base64')}`;
// As mesmas fontes do site (src/assets/fonts, geradas por scripts/fonts.py).
const fonts = {
  sans: await dataUrl('src/assets/fonts/dm-sans-latin-opsz-normal.woff2', 'font/woff2'),
  mono: await dataUrl('src/assets/fonts/red-hat-mono-latin-500-normal.woff2', 'font/woff2'),
};
const logo = await dataUrl(LOGO_DA_OG_IMAGE, 'image/png');
const browserPath = findBrowser();

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<style>
  @font-face { font-family: 'DM Sans'; font-weight: 400 600; src: url('${fonts.sans}') format('woff2'); }
  @font-face { font-family: 'Red Hat Mono'; font-weight: 500; src: url('${fonts.mono}') format('woff2'); }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; }
  body { position: relative; overflow: hidden; background: #003e87; color: #fff; font-family: 'DM Sans', sans-serif; font-optical-sizing: auto; -webkit-font-smoothing: antialiased; }
  .traces { position: absolute; inset: 0; width: 100%; height: 100%; }
  .traces path { fill: none; stroke: #1c539a; stroke-width: 2; }
  .traces circle { fill: #003e87; stroke: #1c539a; stroke-width: 2; }
  .logo { position: absolute; left: 88px; top: 50%; width: 452px; transform: translateY(-50%); }
  .rule { position: absolute; left: 604px; top: 120px; bottom: 120px; width: 1px; background: #4774a9; }
  .text { position: absolute; left: 652px; right: 72px; top: 50%; transform: translateY(-50%); }
  .label { font-family: 'Red Hat Mono', monospace; font-weight: 500; font-size: 16px; letter-spacing: .08em; text-transform: uppercase; color: #d6e4f7; }
  .title { font-weight: 600; font-size: 56px; line-height: 1.02; letter-spacing: -.024em; }
  .place { margin-top: 22px; font-size: 26px; line-height: 1.35; color: #d6e4f7; }
  .contact { margin-top: 34px; padding-top: 22px; border-top: 1px solid #4774a9; display: flex; gap: 20px; align-items: baseline; }
  .contact .label { font-size: 16px; }
  .phone { font-size: 28px; font-weight: 500; font-variant-numeric: tabular-nums; }
</style></head>
<body>
  <svg class="traces" viewBox="0 0 1200 630" aria-hidden="true">
    <path d="M1200 64H1156L1124 96V150"/><circle cx="1124" cy="157" r="7"/>
    <path d="M1060 0V24L1084 48H1132"/><circle cx="1139" cy="48" r="7"/>
    <path d="M1200 548H1168L1144 572V630"/>
  </svg>
  <img class="logo" src="${logo}" alt="">
  <div class="rule"></div>
  <div class="text">
    <p class="title">${dados.titulo}</p>
    <p class="place">${dados.local}</p>
    <div class="contact"><span class="label">${dados.rotuloContato}</span><span class="phone">${dados.telefone}</span></div>
  </div>
</body></html>`;

const browser = await chromium.launch({ executablePath: browserPath });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, type: 'jpeg', quality: 90 });
} finally {
  await browser.close();
}
const imagemSha256 = sha256Curto(await readFile(out));
await writeFile(path.join(root, DADOS_DA_OG_IMAGE), `${JSON.stringify({ ...dados, imagemSha256 }, null, 2)}\n`);
const { size } = await stat(out);
console.log(`Gerado ${path.relative(root, out)} (${(size / 1024).toFixed(0)} KB) e ${DADOS_DA_OG_IMAGE}`);
console.log('Commite os dois arquivos.');
