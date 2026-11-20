/**
 * Avaliações de clientes exibidas na seção "Avaliações".
 *
 * REGRA (nada inventado): só entra avaliação real, com o texto exatamente como o cliente
 * escreveu (no Google ou no WhatsApp) e com a permissão dele para publicar no site.
 * - Sem nenhuma avaliação com `permissao: true`, a seção mostra só o convite para avaliar a loja
 *   no Google.
 * - O texto é publicado em português, como foi escrito, também na página em espanhol (marcado
 *   como português para os leitores de tela).
 * - A nota não entra nos dados estruturados: o Google não mostra estrelas de avaliações que o
 *   próprio negócio publica sobre si.
 * - O build confere este arquivo (id repetido, nota fora de 1 a 5, data fora do formato...):
 *   ver src/lib/validar-site.js.
 *
 * Exemplo de preenchimento (troque pelos dados reais):
 *   {
 *     id: 'maria-2026-03',
 *     nome: 'Maria S.',
 *     texto: 'Texto exatamente como a cliente escreveu.',
 *     origem: 'google',
 *     nota: 5,
 *     data: '2026-03',
 *     permissao: true,
 *   },
 */

/**
 * @typedef {object} Avaliacao
 * @property {string} id          Identificador único: letras minúsculas sem acento, números e hífens.
 * @property {string} nome        Como o cliente autorizou aparecer: "Maria Silva", "Maria S." ou "M. S.".
 * @property {string} texto       Texto real, sem edição.
 * @property {'google' | 'whatsapp'} origem  Onde o cliente escreveu.
 * @property {number} [nota]      Estrelas dadas no Google, de 1 a 5 (só nas avaliações do Google).
 * @property {string} [data]      Mês da avaliação, no formato "AAAA-MM" (ex.: "2026-03").
 * @property {boolean} permissao  `true` só depois que o cliente autorizou a publicação no site.
 */

/** @type {Avaliacao[]} */
export const avaliacoes = [];
