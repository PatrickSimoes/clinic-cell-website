/**
 * Seções da página, na ordem em que aparecem.
 * Um único lugar gera a navegação do header, o menu e o rodapé.
 * Os ids viram âncoras (#servicos) — sem acentos.
 */
export const secoes = [
  { id: 'servicos', nome: 'Serviços' },
  { id: 'sobre', nome: 'Sobre' },
  { id: 'diferenciais', nome: 'Diferenciais' },
  { id: 'localizacao', nome: 'Localização' },
  { id: 'duvidas', nome: 'Dúvidas' },
  { id: 'contato', nome: 'Contato' },
];

/** Nome da seção pelo id. */
export function nomeDaSecao(id) {
  return secoes.find((s) => s.id === id)?.nome ?? '';
}
