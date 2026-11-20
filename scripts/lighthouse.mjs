/**
 * Lighthouse (celular e desktop) sobre o build de produção servido localmente.
 *
 *   npm run build && npm run lighthouse
 *
 * Relatórios HTML/JSON em qa-output/lighthouse/. Usa o Chrome/Edge instalado
 * (defina CHROME_PATH se necessário). O Lighthouse é baixado sob demanda via npx.
 */
import { mkdir, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { findBrowser } from './lib/browser.mjs';

const LIGHTHOUSE = 'lighthouse@13.6.0';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'qa-output', 'lighthouse');

/** Executa um comando pelo shell (necessário para o npx no Windows), com argumentos entre aspas. */
function run(cmd, args, env) {
  const quote = (a) => (/[\s"]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a);
  const command = [cmd, ...args].map(quote).join(' ');
  return new Promise((resolve, reject) => {
    const child = spawn(command, { stdio: ['ignore', 'inherit', 'inherit'], env, shell: true });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} saiu com código ${code}`))));
  });
}

await mkdir(out, { recursive: true });
const chrome = findBrowser();
const server = await preview({ preview: { port: 4318, strictPort: false, open: false }, logLevel: 'error' });
const url = server.resolvedUrls?.local[0];
console.log(`Lighthouse em ${url}\n`);

const summary = [];
try {
  for (const profile of ['mobile', 'desktop']) {
    const base = path.join(out, profile);
    const args = [
      '--yes', LIGHTHOUSE, url,
      '--quiet',
      '--output=json', '--output=html',
      `--output-path=${base}`,
      '--chrome-flags=--headless=new --no-sandbox',
      '--only-categories=performance,accessibility,best-practices,seo',
      ...(profile === 'desktop' ? ['--preset=desktop'] : []),
    ];
    await run('npx', args, { ...process.env, CHROME_PATH: chrome });
    const report = JSON.parse(await readFile(`${base}.report.json`, 'utf8'));
    const score = (k) => Math.round((report.categories[k]?.score ?? 0) * 100);
    const metric = (id) => report.audits[id]?.displayValue ?? '–';
    summary.push({
      perfil: profile,
      desempenho: score('performance'),
      acessibilidade: score('accessibility'),
      'boas práticas': score('best-practices'),
      SEO: score('seo'),
      LCP: metric('largest-contentful-paint'),
      CLS: metric('cumulative-layout-shift'),
      TBT: metric('total-blocking-time'),
      FCP: metric('first-contentful-paint'),
    });
  }
} finally {
  await new Promise((resolve) => server.httpServer.close(resolve));
}

console.table(summary);
console.log(`Relatórios: ${path.relative(root, out)}`);
