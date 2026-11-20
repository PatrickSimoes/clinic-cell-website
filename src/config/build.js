/**
 * Ano do build — definido pelo Vite (vite.config.js → define.__BUILD_YEAR__).
 * É o ano do copyright e da régua "2011 → hoje" no HTML pré-renderizado. O navegador começa
 * com o mesmo valor (sem erro de hidratação) e, depois da virada do ano, useAnoAtual
 * (src/lib/ano.js) mostra o ano atual. De 1 a 3 de janeiro, o workflow
 * .github/workflows/republicacao-anual.yml dispara o deploy.yml, que refaz o HTML.
 */
export const anoDoBuild = __BUILD_YEAR__;
