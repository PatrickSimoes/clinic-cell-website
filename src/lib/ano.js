/**
 * Ano atual para o copyright do rodapé e a régua do Sobre.
 *
 * O HTML pré-renderizado sai com o ano do build. No navegador, se o ano já virou e o
 * site ainda não foi republicado (a republicação anual pode atrasar ou estar desativada),
 * o React corrige o valor logo depois da hidratação — sem erro de hidratação, porque o
 * valor do servidor é o mesmo do HTML (getServerSnapshot).
 */
import { useSyncExternalStore } from 'react';
import { anoDoBuild } from '../config/build.js';

const semAssinatura = () => () => {};
const anoNoNavegador = () => Math.max(anoDoBuild, new Date().getFullYear());
const anoNoBuild = () => anoDoBuild;

export function useAnoAtual() {
  return useSyncExternalStore(semAssinatura, anoNoNavegador, anoNoBuild);
}
