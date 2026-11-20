/**
 * Seções da página, na ordem em que aparecem.
 * Um único lugar gera a navegação do header, o menu e o rodapé.
 * Os ids viram âncoras (#servicos) — sem acentos, iguais nos dois idiomas.
 * Os nomes ficam nos textos de cada idioma (textos.js e textos.es.js → `secoes`).
 *
 * O header do computador tem pouco espaço (logo, navegação, idioma e o botão do WhatsApp):
 * - `foraDoHeader`: a seção fica no menu do celular e no rodapé, mas não no header;
 * - `headerLargo`: no header, só a partir de 1280 px (80em). Entre 1024 e 1279 px ela sai, e o
 *   botão do WhatsApp ao lado faz o papel dela.
 */
export const secoes = [
  { id: 'servicos' },
  { id: 'sobre' },
  { id: 'diferenciais' },
  { id: 'avaliacoes', foraDoHeader: true },
  { id: 'localizacao' },
  { id: 'duvidas' },
  { id: 'contato', headerLargo: true },
];
