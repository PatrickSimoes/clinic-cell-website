import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './styles/fonts.css'; // fontes auto-hospedadas, só com os pesos usados (scripts/fonts.py)
import './styles/index.css';
import App from './App.jsx';

const container = document.getElementById('root');

// A página vem pré-renderizada do build (home ou 404). Em `npm run dev`,
// use ?pagina=404 para visualizar a página de erro.
const devPage = import.meta.env.DEV ? new URLSearchParams(window.location.search).get('pagina') : null;
const page = container.dataset.page === '404' || devPage === '404' ? '404' : 'home';

const app = (
  <StrictMode>
    <App page={page} />
  </StrictMode>
);

if (container.firstElementChild) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
