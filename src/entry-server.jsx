/**
 * Entrada usada apenas no build (pré-renderização) e no `npm run dev` (geração do <head>).
 * Gera o HTML estático de cada página, que depois é hidratado no navegador por main.jsx.
 */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { imagensDeServico } from './lib/imagens-de-servico.js';

export { renderHead } from './lib/head.js';
// Para a validação dos dados no build e no `npm run dev` (src/lib/validar-site.js).
export { problemasNosDados } from './lib/validar-site.js';
export { site } from './config/site.js';
export { areasDeServico } from './content/servicos.js';

/** Áreas de serviço com imagem em src/assets/servicos (src/lib/imagens-de-servico.js). */
export const idsComImagem = Object.keys(imagensDeServico);

/** @param {'home' | '404'} page */
export function render(page) {
  return renderToString(
    <StrictMode>
      <App page={page} />
    </StrictMode>,
  );
}
