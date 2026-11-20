/**
 * Gera src/styles/font-fallbacks.css: fontes de fallback com métricas ajustadas
 * (size-adjust, ascent/descent/line-gap-override) calculadas pelo Capsize a partir
 * das métricas reais das fontes. Enquanto a DM Sans / Red Hat Mono carregam, o texto
 * é desenhado numa fonte do sistema com as mesmas proporções → sem "pulo" de layout (CLS).
 *
 * Fallbacks por plataforma: Arial (Windows, macOS, iOS) e Roboto (Android, que não tem Arial).
 *
 * Uso: npm run fonts:fallbacks   (rode de novo só se trocar as fontes do site)
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createFontStack } from '@capsizecss/core';
import dmSans from '@capsizecss/metrics/dMSans';
import redHatMono from '@capsizecss/metrics/redHatMono';
import arial from '@capsizecss/metrics/arial';
import roboto from '@capsizecss/metrics/roboto';
import courierNew from '@capsizecss/metrics/courierNew';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'src/styles/font-fallbacks.css');

// Os pacotes @fontsource-variable registram as famílias com o sufixo "Variable".
const sans = createFontStack([{ ...dmSans, familyName: 'DM Sans Variable' }, arial, roboto], {
  fontFaceFormat: 'styleString',
});
const mono = createFontStack([{ ...redHatMono, familyName: 'Red Hat Mono Variable' }, courierNew], {
  fontFaceFormat: 'styleString',
});

/** Mantém a fonte principal e as faces de fallback ajustadas; as genéricas vêm depois. */
const adjusted = (stack) =>
  stack
    .split(',')
    .map((name) => name.trim())
    .filter((name, i) => i === 0 || name.includes('Fallback'))
    .join(', ');

const css = `/* Gerado por scripts/font-fallbacks.mjs — não edite à mão. */

${sans.fontFaces}

${mono.fontFaces}

:root {
  --font-sans: ${adjusted(sans.fontFamily)}, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  --font-mono: ${adjusted(mono.fontFamily)}, ui-monospace, 'Cascadia Mono', Consolas, Menlo, monospace;
}
`;

await writeFile(out, css);
console.log(`Gerado ${path.relative(root, out)}\n  sans: ${sans.fontFamily}\n  mono: ${mono.fontFamily}`);
