/**
 * Regra de publicação dos serviços (os dados ficam em src/content/servicos.js):
 * só aparecem as áreas confirmadas pelo proprietário, igual em `npm run dev` e no site publicado.
 */
import { areasDeServico } from '../content/servicos.js';

/** Áreas confirmadas: as únicas exibidas na página e nos dados estruturados. */
export const areasPublicadas = areasDeServico.filter((a) => a.confirmado);
