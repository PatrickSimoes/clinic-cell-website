/**
 * Gera as variações da logo ClinicCell a partir do arquivo original fornecido
 * (src/assets/brand/clinic-cell-logo-original.png — branco sobre azul, 640x640).
 *
 * Nada é redesenhado: a arte é a mesma, apenas separada do fundo.
 * O fundo da logo é azul puro (canal vermelho ~0) e a arte é branca (R ~255),
 * então o canal vermelho funciona como máscara de transparência fiel, incluindo
 * antialiasing e os traços de circuito dentro do celular.
 *
 * Saídas (commitadas no repositório; rode de novo só se a logo mudar):
 *   src/assets/brand/logo-white.png       logo completa, branca, fundo transparente (3x) — também usada na og-image
 *   src/assets/brand/logo-blue.png        versão positiva (azul) para fundos claros (3x) — master para uso fora do site
 *   src/assets/brand/symbol-white.png     símbolo (celular + cruz) isolado, branco (3x) — master; o site usa só nos ícones
 *   src/assets/brand/generated/*.webp     logo branca e azul em várias larguras (srcset do componente <Logo>)
 *   public/favicon.ico                    16/32/48 px
 *   public/favicon-96.png                 96 px (Google Search exige múltiplos de 48)
 *   public/apple-touch-icon.png           180 px
 *   public/icon-192.png, icon-512.png     ícones do manifest
 *   public/icon-maskable-512.png          ícone com área segura para Android
 *
 * Uso: npm run brand:assets
 */
import sharp from 'sharp';
import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'src/assets/brand/clinic-cell-logo-original.png');
const OUT_ASSETS = path.join(root, 'src/assets/brand');
const OUT_PUBLIC = path.join(root, 'public');

/** Cor das superfícies dos ícones e da versão positiva (tokens do site). */
const BRAND_BLUE = { r: 0x07, g: 0x50, b: 0xa5 }; // --color-blue-600 (#0750A5)
const BRAND_DEEP = { r: 0x06, g: 0x37, b: 0x77 }; // --color-blue-800 (#063777)

const SCALE = 3; // fator de ampliação dos masters (nitidez em telas de alta densidade)
const PAD = 6; // respiro em px (escala original) ao redor da arte

// ---------------------------------------------------------------------------
// 1. Máscara de transparência a partir do canal vermelho
// ---------------------------------------------------------------------------
const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const C = info.channels;

const R_BG = 2; // ruído do fundo azul no canal vermelho
const R_FG = 250; // branco da arte
const alpha = new Float32Array(W * H);
for (let i = 0, p = 0; i < alpha.length; i++, p += C) {
  alpha[i] = Math.min(1, Math.max(0, (data[p] - R_BG) / (R_FG - R_BG)));
}

const idx = (x, y) => y * W + x;
const solid = (x, y) => alpha[idx(x, y)] >= 0.5;

// Caixa delimitadora da arte sólida
let minX = W, minY = H, maxX = 0, maxY = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (solid(x, y)) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
}

// Separação símbolo x texto: primeira coluna vazia depois do contorno do celular
let symbolMaxX = minX;
for (let x = minX; x <= maxX; x++) {
  let any = false;
  for (let y = minY; y <= maxY; y++) if (solid(x, y)) { any = true; break; }
  if (!any) break;
  symbolMaxX = x;
}

// Interior da tela do celular (flood fill a partir de um ponto interno, sobre pixels não sólidos)
const interior = new Uint8Array(W * H);
{
  const seedX = minX + 14;
  const seedY = minY + 14;
  if (solid(seedX, seedY)) throw new Error('Semente do flood fill caiu sobre a arte; ajuste seedX/seedY.');
  const stack = [[seedX, seedY]];
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < minX || x > symbolMaxX || y < minY || y > maxY) continue;
    const i = idx(x, y);
    if (interior[i] || solid(x, y)) continue;
    interior[i] = 1;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
}

// Mantém: arte sólida + borda de antialiasing (dilatação de 3 px) + traços dentro da tela.
// Remove: traços de circuito do fundo da imagem original.
const keep = new Uint8Array(W * H);
const DIL = 3;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (!solid(x, y)) continue;
    for (let dy = -DIL; dy <= DIL; dy++) {
      for (let dx = -DIL; dx <= DIL; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx >= 0 && yy >= 0 && xx < W && yy < H) keep[idx(xx, yy)] = 1;
      }
    }
  }
}
for (let i = 0; i < keep.length; i++) if (interior[i]) keep[i] = 1;

// Dentro da tela, zera o ruído de compressão do arquivo original (alfa < 4%, invisível),
// preservando os traços de circuito (alfa ~5–15%). Reduz bastante o peso das imagens.
const NOISE_FLOOR = 0.04;
for (let i = 0; i < alpha.length; i++) {
  if (interior[i] && alpha[i] < NOISE_FLOOR) alpha[i] = 0;
}

// ---------------------------------------------------------------------------
// 2. Ampliação com bordas nítidas (Lanczos + reconstrução da rampa de antialiasing)
// ---------------------------------------------------------------------------
/**
 * Recorta a máscara, amplia SCALE vezes e reconstrói bordas nítidas:
 * a curva de contraste é aplicada só perto da arte sólida (o contorno em 50% é preservado,
 * então a forma não muda); os traços sutis de circuito ficam como estão.
 */
async function buildMatte(x0, y0, x1, y1) {
  const cw = x1 - x0 + 1;
  const ch = y1 - y0 + 1;
  const crop = Buffer.alloc(cw * ch);
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const sx = x0 + x, sy = y0 + y;
      const inside = sx >= 0 && sy >= 0 && sx < W && sy < H;
      const a = inside && keep[idx(sx, sy)] ? alpha[idx(sx, sy)] : 0;
      crop[y * cw + x] = Math.round(a * 255);
    }
  }
  const outW = cw * SCALE;
  const outH = ch * SCALE;
  const { data: up, info: upInfo } = await sharp(crop, { raw: { width: cw, height: ch, channels: 1 } })
    .resize(outW, outH, { kernel: 'lanczos3' })
    .extractChannel(0)
    .raw()
    .toBuffer({ resolveWithObject: true });
  if (upInfo.channels !== 1 || upInfo.width !== outW || upInfo.height !== outH) {
    throw new Error(`Ampliação inesperada: ${upInfo.width}x${upInfo.height}x${upInfo.channels}`);
  }
  const a = new Float32Array(outW * outH);
  for (let i = 0; i < a.length; i++) a[i] = up[i] / 255;

  // máximo local (separável) para saber o que é "perto da arte sólida"
  const rad = SCALE * 2;
  const tmp = new Float32Array(a.length);
  const near = new Float32Array(a.length);
  for (let y = 0; y < outH; y++) {
    for (let x = 0; x < outW; x++) {
      let m = 0;
      for (let k = Math.max(0, x - rad); k <= Math.min(outW - 1, x + rad); k++) m = Math.max(m, a[y * outW + k]);
      tmp[y * outW + x] = m;
    }
  }
  for (let x = 0; x < outW; x++) {
    for (let y = 0; y < outH; y++) {
      let m = 0;
      for (let k = Math.max(0, y - rad); k <= Math.min(outH - 1, y + rad); k++) m = Math.max(m, tmp[k * outW + x]);
      near[y * outW + x] = m;
    }
  }
  const K = SCALE / 1.25; // rampa final de ~1,25 px
  const out = new Uint8Array(outW * outH);
  for (let i = 0; i < a.length; i++) {
    let v = Math.min(1, Math.max(0, a[i]));
    if (near[i] > 0.75) {
      const sharp = Math.min(1, Math.max(0, (v - 0.5) * K + 0.5));
      // transição suave entre região de traço sutil e região de borda sólida
      const t = Math.min(1, (near[i] - 0.75) / 0.2);
      v = v * (1 - t) + sharp * t;
    }
    out[i] = Math.round(v * 255);
  }
  return { matte: out, width: outW, height: outH };
}

function colorize({ matte, width, height }, { r, g, b }) {
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < matte.length; i++) {
    rgba[i * 4] = r;
    rgba[i * 4 + 1] = g;
    rgba[i * 4 + 2] = b;
    rgba[i * 4 + 3] = matte[i];
  }
  return sharp(rgba, { raw: { width, height, channels: 4 } });
}

const WHITE = { r: 255, g: 255, b: 255 };
const full = await buildMatte(minX - PAD, minY - PAD, maxX + PAD, maxY + PAD);
const symbol = await buildMatte(minX - PAD, minY - PAD, symbolMaxX + PAD, maxY + PAD);

await mkdir(OUT_ASSETS, { recursive: true });
await mkdir(OUT_PUBLIC, { recursive: true });
const png = { compressionLevel: 9, effort: 10, palette: false };
const masters = {
  'logo-white': await colorize(full, WHITE).png(png).toBuffer(),
  'logo-blue': await colorize(full, BRAND_DEEP).png(png).toBuffer(),
  'symbol-white': await colorize(symbol, WHITE).png(png).toBuffer(),
};
for (const [name, buffer] of Object.entries(masters)) {
  await writeFile(path.join(OUT_ASSETS, `${name}.png`), buffer);
}

// Variações WebP para srcset (o componente <Logo> as encontra pelo padrão de nome).
const OUT_GENERATED = path.join(OUT_ASSETS, 'generated');
await rm(OUT_GENERATED, { recursive: true, force: true });
await mkdir(OUT_GENERATED, { recursive: true });
const WIDTHS = {
  'logo-white': [160, 240, 320, 400, 480, 640, 800, 960, 1280],
  'logo-blue': [160, 240, 320, 400, 480, 640, 800, 960, 1280],
};
// Arte de duas cores: quantizar em paleta de 256 cores e codificar em WebP sem perdas
// gera arquivos ~2–4x menores que WebP com perdas, sem diferença visível.
for (const [name, widths] of Object.entries(WIDTHS)) {
  for (const w of widths) {
    const resized = await sharp(masters[name]).resize({ width: w, kernel: 'lanczos3' }).png().toBuffer();
    const indexed = await sharp(resized).png({ palette: true, quality: 90, effort: 10 }).toBuffer();
    await sharp(indexed)
      .webp({ lossless: true, quality: 100, effort: 6 })
      .toFile(path.join(OUT_GENERATED, `${name}-${w}.webp`));
  }
}

// Logo quadrada original, sem alterações, em URL pública estável (dados estruturados).
await mkdir(path.join(OUT_PUBLIC, 'brand'), { recursive: true });
await copyFile(SRC, path.join(OUT_PUBLIC, 'brand', 'cliniccell-logo.png'));

// ---------------------------------------------------------------------------
// 3. Ícones (símbolo branco centralizado sobre o azul institucional)
// ---------------------------------------------------------------------------
const symbolPng = masters['symbol-white'];

/** @param {number} size @param {number} heightRatio altura do símbolo relativa ao ícone */
async function icon(size, heightRatio, { radius = 0 } = {}) {
  const h = Math.round(size * heightRatio);
  const mark = await sharp(symbolPng).resize({ height: h, kernel: 'lanczos3' }).toBuffer();
  const bg = radius
    ? Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="rgb(${BRAND_BLUE.r},${BRAND_BLUE.g},${BRAND_BLUE.b})"/></svg>`,
      )
    : { create: { width: size, height: size, channels: 4, background: { ...BRAND_BLUE, alpha: 1 } } };
  return sharp(bg).composite([{ input: mark, gravity: 'center' }]).png(png).toBuffer();
}

await writeFile(path.join(OUT_PUBLIC, 'favicon-96.png'), await icon(96, 0.8, { radius: 18 }));
await writeFile(path.join(OUT_PUBLIC, 'apple-touch-icon.png'), await icon(180, 0.66));
await writeFile(path.join(OUT_PUBLIC, 'icon-192.png'), await icon(192, 0.7, { radius: 36 }));
await writeFile(path.join(OUT_PUBLIC, 'icon-512.png'), await icon(512, 0.7, { radius: 96 }));
await writeFile(path.join(OUT_PUBLIC, 'icon-maskable-512.png'), await icon(512, 0.52));

// favicon.ico com PNGs embutidos (16, 32, 48)
const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(icoSizes.map((s) => icon(s, s <= 16 ? 0.94 : 0.84, { radius: Math.round(s * 0.18) })));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(icoSizes.length, 4);
const dir = Buffer.alloc(16 * icoSizes.length);
let offset = 6 + dir.length;
icoSizes.forEach((s, i) => {
  const o = i * 16;
  dir.writeUInt8(s, o);
  dir.writeUInt8(s, o + 1);
  dir.writeUInt8(0, o + 2);
  dir.writeUInt8(0, o + 3);
  dir.writeUInt16LE(1, o + 4);
  dir.writeUInt16LE(32, o + 6);
  dir.writeUInt32LE(icoImages[i].length, o + 8);
  dir.writeUInt32LE(offset, o + 12);
  offset += icoImages[i].length;
});
await writeFile(path.join(OUT_PUBLIC, 'favicon.ico'), Buffer.concat([header, dir, ...icoImages]));

console.log(
  `Arte: x ${minX}–${maxX}, y ${minY}–${maxY} (símbolo até x ${symbolMaxX}).`,
  `Masters: logo ${full.width}x${full.height}, símbolo ${symbol.width}x${symbol.height}.`,
);
