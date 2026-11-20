/**
 * Gera as 5 ilustrações das áreas de serviço (src/assets/servicos/<id>.svg), no estilo da marca:
 * traço azul, fundo #EEF4FB e trilhas de circuito nos cantos (sempre ligadas a um terminal).
 *
 * Uso: npm run servicos:ilustracoes (sobrescreve os .svg). Depois, confira o resultado no site.
 * Uma foto real (<id>.webp/.jpg na mesma pasta) tem prioridade sobre a ilustração e não é
 * tocada por este script: ver src/lib/imagens-de-servico.js.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('../src/assets/servicos/', import.meta.url));
mkdirSync(DIR, { recursive: true });

const BG = '#EEF4FB';
const TRACE = '#C6D7EC';
const BLUE = '#0750A5';
const NAVY = '#0B356A';
const TINT = '#D6E4F7';
const LIGHT = '#7FA8DB';
const WHITE = '#FFFFFF';

// Trilhas de circuito nos cantos (sempre ligando a um terminal), escolhidas por ilustração
// para nunca encostar no desenho.
const TRILHAS = {
  A: ['M0 56H40L64 80V112', [64, 118]],
  B: ['M0 244H36L56 224H76', [82, 224]],
  C: ['M480 60H452L432 80V104', [432, 110]],
  D: ['M480 240H420', [414, 240]],
  E: ['M0 272H44', [50, 272]],
};

function fundo(cantos) {
  const caminhos = cantos.map((c) => `<path d="${TRILHAS[c][0]}"/>`).join('');
  const pads = cantos.map((c) => `<circle cx="${TRILHAS[c][1][0]}" cy="${TRILHAS[c][1][1]}" r="5"/>`).join('');
  return `<rect width="480" height="300" fill="${BG}"/>
<g fill="none" stroke="${TRACE}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${caminhos}</g>
<g fill="${BG}" stroke="${TRACE}" stroke-width="2">${pads}</g>`;
}

const svg = (titulo, corpo) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 300" width="480" height="300" role="img" aria-label="${titulo}">
${corpo}
</svg>
`;

/** Ícone Lucide (24×24) desenhado grande, com traço de largura fixa. */
const lucide = (paths, cx, cy, escala, { stroke = BLUE, fill = 'none', largura = 3 } = {}) =>
  `<g transform="translate(${cx - 12 * escala} ${cy - 12 * escala}) scale(${escala})" fill="${fill}" stroke="${stroke}" stroke-width="${largura / escala}" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`;

const lente = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${NAVY}" stroke="${BLUE}" stroke-width="2.5"/>
<circle cx="${cx}" cy="${cy}" r="${(r * 0.62).toFixed(1)}" fill="#1C4F8F"/>
<circle cx="${cx}" cy="${cy}" r="${(r * 0.3).toFixed(1)}" fill="#3D7BC6"/>
<circle cx="${(cx - r * 0.32).toFixed(1)}" cy="${(cy - r * 0.32).toFixed(1)}" r="${(r * 0.16).toFixed(1)}" fill="${WHITE}" opacity=".85"/>`;

// 1. Tela e carcaça: aparelho com a tela trincada e a tela nova ao lado
const tela = svg(
  'Ilustração: celular com a tela trincada e uma tela nova ao lado',
  `${fundo(['A', 'B', 'C', 'D'])}
<rect x="108" y="34" width="124" height="232" rx="22" fill="${WHITE}" stroke="${BLUE}" stroke-width="3"/>
<rect x="118" y="46" width="104" height="208" rx="13" fill="${NAVY}"/>
<rect x="156" y="53" width="28" height="4" rx="2" fill="#2A5B95"/>
<g fill="none" stroke="${WHITE}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".9">
  <path d="M184 104 160 80 150 62"/>
  <path d="M184 104 214 92"/>
  <path d="M184 104 196 132 190 160 202 196"/>
  <path d="M184 104 150 118 128 112"/>
  <path d="M184 104 166 140 140 158"/>
  <path d="M196 132 218 142"/>
  <path d="M190 160 172 176"/>
  <circle cx="184" cy="104" r="4"/>
</g>
<g transform="rotate(8 326 151)">
  <rect x="266" y="40" width="120" height="222" rx="21" fill="${WHITE}" stroke="${BLUE}" stroke-width="3"/>
  <rect x="276" y="52" width="100" height="198" rx="12" fill="#DCE8F8"/>
  <rect x="312" y="59" width="28" height="4" rx="2" fill="#B9CDE8"/>
  <path d="M290 132 344 78" stroke="${WHITE}" stroke-width="12" stroke-linecap="round"/>
  <path d="M296 162 360 98" stroke="${WHITE}" stroke-width="5" stroke-linecap="round"/>
</g>
<g stroke="${BLUE}" stroke-linecap="round">
  <path d="M410 172v18M401 181h18" stroke-width="2.5"/>
  <path d="M392 222v12M386 228h12" stroke-width="2"/>
</g>`,
);

// 2. Bateria e carga: aparelho aberto com a bateria, plugue chegando e selo de carga
const bateria = svg(
  'Ilustração: celular aberto mostrando a bateria, com o carregador sendo conectado',
  `${fundo(['A', 'B', 'C', 'D'])}
<rect x="150" y="22" width="132" height="226" rx="22" fill="${WHITE}" stroke="${BLUE}" stroke-width="3"/>
<rect x="200" y="46" width="32" height="10" rx="3" fill="${BLUE}"/>
<rect x="172" y="54" width="88" height="150" rx="10" fill="${TINT}" stroke="${BLUE}" stroke-width="2.5"/>
<rect x="184" y="68" width="64" height="24" rx="4" fill="#B5CBEA"/>
<rect x="184" y="100" width="64" height="24" rx="4" fill="${BLUE}"/>
<rect x="184" y="132" width="64" height="24" rx="4" fill="${BLUE}"/>
<rect x="184" y="164" width="64" height="24" rx="4" fill="${BLUE}"/>
<rect x="200" y="232" width="32" height="6" rx="3" fill="${BLUE}"/>
<path d="M188 258v12M244 258v12" stroke="${LIGHT}" stroke-width="2.5" stroke-linecap="round"/>
<rect x="206" y="254" width="20" height="10" rx="3" fill="#9DB6D8" stroke="${BLUE}" stroke-width="2"/>
<rect x="198" y="264" width="36" height="24" rx="7" fill="${WHITE}" stroke="${BLUE}" stroke-width="3"/>
<path d="M216 288v14" stroke="${BLUE}" stroke-width="5" stroke-linecap="round"/>
<circle cx="352" cy="96" r="38" fill="${WHITE}" stroke="${BLUE}" stroke-width="3"/>
${lucide('<path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"/>', 352, 96, 2.2, { fill: BLUE, largura: 2 })}`,
);

// 3. Câmera, som e sensores: traseira com o módulo de câmeras, alto-falante e microfone
const camera = svg(
  'Ilustração: traseira de celular com as câmeras, ao lado de um alto-falante e um microfone',
  `${fundo(['A', 'C', 'D'])}
<rect x="96" y="30" width="140" height="240" rx="24" fill="${WHITE}" stroke="${BLUE}" stroke-width="3"/>
<rect x="112" y="46" width="78" height="96" rx="20" fill="${TINT}" stroke="${BLUE}" stroke-width="2.5"/>
${lente(140, 74, 17)}
${lente(140, 115, 17)}
${lente(172, 98, 10)}
<circle cx="172" cy="64" r="5" fill="${WHITE}" stroke="${BLUE}" stroke-width="2"/>
<rect x="270" y="62" width="94" height="40" rx="20" fill="${WHITE}" stroke="${BLUE}" stroke-width="3"/>
<g fill="${BLUE}">
  <circle cx="290" cy="82" r="3"/><circle cx="303" cy="82" r="3"/><circle cx="316" cy="82" r="3"/>
  <circle cx="329" cy="82" r="3"/><circle cx="342" cy="82" r="3"/>
</g>
<g fill="none" stroke-linecap="round" stroke-width="3">
  <path d="M378 68c8 8 8 20 0 28" stroke="${BLUE}"/>
  <path d="M390 58c14 14 14 34 0 48" stroke="${LIGHT}"/>
</g>
<rect x="302" y="134" width="30" height="50" rx="15" fill="${WHITE}" stroke="${BLUE}" stroke-width="3"/>
<path d="M309 150h16M309 159h16M309 168h16" stroke="${LIGHT}" stroke-width="2" stroke-linecap="round"/>
<path d="M294 162v6a23 23 0 0 0 46 0v-6M317 191v16M305 207h24" fill="none" stroke="${BLUE}" stroke-width="3" stroke-linecap="round"/>`,
);

// 4. Placa e reparos avançados: placa com chips e o ferro de solda no ponto de reparo
const pinos = (x, y, w, h, passo, lado) => {
  const linhas = [];
  for (let i = passo; i < (lado === 'h' ? h : w); i += passo) {
    if (lado === 'h') linhas.push(`M${x - 7} ${y + i}h7M${x + w} ${y + i}h7`);
    else linhas.push(`M${x + i} ${y - 7}v7M${x + i} ${y + h}v7`);
  }
  return `<path d="${linhas.join('')}" stroke="${BLUE}" stroke-width="2.5" stroke-linecap="round"/>`;
};
const placa = svg(
  'Ilustração: placa de celular com chips e um ferro de solda fazendo um reparo',
  `${fundo(['D', 'E'])}
<rect x="70" y="58" width="250" height="184" rx="14" fill="${TINT}" stroke="${BLUE}" stroke-width="3"/>
<g fill="${BG}" stroke="${BLUE}" stroke-width="2">
  <circle cx="88" cy="76" r="6"/><circle cx="302" cy="76" r="6"/><circle cx="88" cy="224" r="6"/><circle cx="302" cy="224" r="6"/>
</g>
<g fill="none" stroke="${LIGHT}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M104 212H168L184 196V186"/>
  <path d="M206 112V96H262L276 82H284"/>
  <path d="M258 172H270L284 186V214"/>
  <path d="M132 102V86H170"/>
</g>
<g fill="${WHITE}" stroke="${LIGHT}" stroke-width="2">
  <circle cx="104" cy="212" r="4"/><circle cx="288" cy="82" r="4"/><circle cx="284" cy="218" r="4"/><circle cx="174" cy="86" r="4"/>
</g>
${pinos(118, 110, 72, 60, 12, 'h')}
${pinos(118, 110, 72, 60, 14, 'v')}
<rect x="118" y="110" width="72" height="60" rx="6" fill="${NAVY}"/>
<circle cx="129" cy="121" r="3" fill="#3D7BC6"/>
${pinos(214, 124, 44, 34, 11, 'h')}
<rect x="214" y="124" width="44" height="34" rx="4" fill="${NAVY}"/>
<g fill="${WHITE}" stroke="${BLUE}" stroke-width="2">
  <rect x="128" y="190" width="12" height="16" rx="2"/><rect x="148" y="190" width="12" height="16" rx="2"/>
</g>
<circle cx="276" cy="168" r="14" fill="${WHITE}" opacity=".6"/>
<circle cx="276" cy="168" r="5" fill="${WHITE}" stroke="${BLUE}" stroke-width="2"/>
<g stroke="#3D7BC6" stroke-width="2.5" stroke-linecap="round">
  <path d="M258 160l-9-4M262 182l-6 8M286 186l4 8"/>
</g>
<path d="M484 -14 372 86" stroke="${BLUE}" stroke-width="20" stroke-linecap="round"/>
<path d="M436 29l-13 12M418 45l-13 12" stroke="#2E6BB5" stroke-width="20" stroke-linecap="butt" opacity=".55"/>
<path d="M372 86 356 100" stroke="#9DB6D8" stroke-width="10" stroke-linecap="round"/>
<path d="M356 100 288 158" stroke="#9DB6D8" stroke-width="5" stroke-linecap="round"/>
<path d="M288 158 279 166" stroke="#5E7FA8" stroke-width="3" stroke-linecap="round"/>`,
);

// 5. Sistema e software: tela com engrenagem e progresso, atualização e proteção
const sistema = svg(
  'Ilustração: celular atualizando o sistema, com símbolos de restauração e de proteção',
  `${fundo(['A', 'B', 'C', 'D'])}
<rect x="172" y="24" width="136" height="252" rx="24" fill="${WHITE}" stroke="${BLUE}" stroke-width="3"/>
<rect x="182" y="36" width="116" height="228" rx="14" fill="${NAVY}"/>
<rect x="226" y="43" width="28" height="4" rx="2" fill="#2A5B95"/>
${lucide('<path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/>', 240, 120, 3, { stroke: TINT })}
<rect x="200" y="186" width="80" height="8" rx="4" fill="#244F86"/>
<rect x="200" y="186" width="56" height="8" rx="4" fill="#7FB0EA"/>
<rect x="212" y="208" width="56" height="5" rx="2.5" fill="#2E5E99"/>
<rect x="222" y="220" width="36" height="5" rx="2.5" fill="#2E5E99"/>
<circle cx="110" cy="164" r="44" fill="${WHITE}" stroke="${BLUE}" stroke-width="3"/>
${lucide('<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>', 110, 164, 2.4)}
${lucide('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" fill="#FFFFFF"/><path d="m9 12 2 2 4-4"/>', 362, 150, 3.4)}`,
);

const arquivos = {
  'tela-e-carcaca': tela,
  'bateria-e-carga': bateria,
  'camera-som-e-sensores': camera,
  'placa-e-reparos-avancados': placa,
  'sistema-e-software': sistema,
};
for (const [id, conteudo] of Object.entries(arquivos)) writeFileSync(`${DIR}${id}.svg`, conteudo);
console.log('ok', Object.keys(arquivos).length);
