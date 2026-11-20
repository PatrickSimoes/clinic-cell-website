import { SiteLayout } from './layouts/SiteLayout.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

/**
 * Raiz do site. Há duas páginas estáticas, geradas no build:
 * - 'home' → dist/index.html
 * - '404'  → dist/404.html
 * @param {{ page: 'home' | '404' }} props
 */
export default function App({ page }) {
  return <SiteLayout page={page}>{page === '404' ? <NotFoundPage /> : <HomePage />}</SiteLayout>;
}
