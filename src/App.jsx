import { SiteLayout } from './layouts/SiteLayout.jsx';
import { conteudoDoIdioma } from './lib/conteudo.js';
import { IdiomaContext } from './lib/idioma.js';
import { HomePage } from './pages/HomePage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

/**
 * Raiz do site. Há três páginas estáticas, geradas no build:
 * - 'home' em português → dist/index.html
 * - 'home' em espanhol  → dist/es/index.html
 * - '404' (português)   → dist/404.html
 * @param {{ page: 'home' | '404', idioma?: 'pt' | 'es' }} props
 */
export default function App({ page, idioma = 'pt' }) {
  return (
    <IdiomaContext value={conteudoDoIdioma(idioma)}>
      <SiteLayout page={page}>{page === '404' ? <NotFoundPage /> : <HomePage />}</SiteLayout>
    </IdiomaContext>
  );
}
