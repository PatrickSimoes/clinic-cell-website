/**
 * Regra de publicação dos serviços (os dados ficam em src/content/servicos.js):
 * só aparecem as áreas confirmadas pelo proprietário, igual em `npm run dev` e no site publicado.
 */
import { areasDeServico } from '../content/servicos.js';

/** Áreas confirmadas: as únicas exibidas na página e nos dados estruturados. */
export const areasPublicadas = areasDeServico.filter((a) => a.confirmado);

/**
 * Áreas confirmadas com nome, serviços e mensagem do WhatsApp no idioma da página.
 * @param {'pt' | 'es'} idioma
 * @returns {{ id: string, nome: string, servicos: string[], mensagemWhatsApp: string }[]}
 */
export function areasDoIdioma(idioma) {
  return areasPublicadas.map((a) => {
    const { nome, servicos, mensagemWhatsApp } = idioma === 'es' && a.es ? a.es : a;
    return { id: a.id, nome, servicos, mensagemWhatsApp };
  });
}

/** Total de serviços publicados (todas as áreas confirmadas). */
export const totalDeServicos = areasPublicadas.reduce((total, area) => total + area.servicos.length, 0);
