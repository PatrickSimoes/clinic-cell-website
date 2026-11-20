/**
 * Regra de publicação das avaliações (os dados ficam em src/content/avaliacoes.js): só aparecem
 * as que têm a permissão do cliente. A seção existe quando há avaliação publicada ou, sem
 * nenhuma, quando há o link para avaliar no Google (que precisa do Place ID).
 */
import { avaliacoes } from '../content/avaliacoes.js';
import { avaliarNoGoogleUrl } from './contact.js';

/** Avaliações com permissão do cliente, as mais recentes primeiro (sem data, por último). */
export const avaliacoesPublicadas = avaliacoes
  .filter((a) => a.permissao === true)
  .sort((a, b) => (b.data ?? '').localeCompare(a.data ?? ''));

/** A seção "Avaliações" aparece na página (e na navegação)? */
export const mostrarAvaliacoes = avaliacoesPublicadas.length > 0 || Boolean(avaliarNoGoogleUrl());
