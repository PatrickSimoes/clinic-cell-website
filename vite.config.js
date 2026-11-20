import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolveDeployEnv } from './scripts/deploy-env.mjs';

/**
 * Build em duas etapas + pré-renderização (ver scripts/prerender.mjs):
 *   1. `vite build`                              → dist/ (JS/CSS do navegador)
 *   2. `vite build --ssr src/entry-server.jsx`   → dist-ssr/ (renderizador usado só no build)
 *   3. `node scripts/prerender.mjs`              → HTML final, 404, sitemap, robots, manifest
 *
 * O base path vem de BASE_PATH (GitHub Pages de repositório de projeto: "/nome-do-repo/").
 */
/**
 * Ano do build (copyright e régua "2011 → hoje"), no fuso de Brasília.
 * Os dois `vite build` (navegador e SSR) precisam do mesmo ano, senão a hidratação falha:
 * o CI fixa BUILD_YEAR uma vez por execução (deploy.yml). No navegador, src/lib/ano.js
 * ainda corrige o ano se o site não for republicado depois da virada.
 */
const BUILD_YEAR =
  Number(process.env.BUILD_YEAR) ||
  Number(new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'America/Sao_Paulo' }).format(new Date()));

export default defineConfig(({ isSsrBuild }) => {
  const deploy = resolveDeployEnv();

  return {
    base: deploy.base,
    plugins: [react(), devHead()],
    define: {
      __BUILD_YEAR__: JSON.stringify(BUILD_YEAR),
    },
    build: {
      outDir: isSsrBuild ? 'dist-ssr' : 'dist',
      emptyOutDir: true,
      copyPublicDir: !isSsrBuild,
      // Nunca embutir imagens como base64: as variações da logo aparecem em vários srcset
      // e virariam cópias repetidas dentro do HTML e do JavaScript.
      assetsInlineLimit: 0,
      // Um único arquivo JS, sem import dinâmico: o polyfill de modulepreload seria peso morto.
      // Reavaliar se o projeto passar a dividir o código em vários chunks.
      modulePreload: { polyfill: false },
    },
    server: { port: 5173 },
    preview: { port: 4173 },
  };
});

/**
 * Em `npm run dev`, injeta no index.html o mesmo <head> gerado no build
 * (title, meta tags, Open Graph, JSON-LD), para conferir SEO localmente.
 * Em http://localhost:5173/es/ a página sai em espanhol (o <html lang> diz o idioma ao React).
 * @returns {import('vite').Plugin}
 */
function devHead() {
  /** @type {import('vite').ViteDevServer} */
  let server;
  return {
    name: 'cliniccell:dev-head',
    apply: 'serve',
    configureServer(s) {
      server = s;
    },
    async transformIndexHtml(html, ctx) {
      const { renderHead, problemasNosDados, site, areasDeServico, avaliacoes, textos, textosEs, idsComImagem } =
        await server.ssrLoadModule('/src/entry-server.jsx');
      // Avisa já no `npm run dev` o que faria o build falhar (dia inválido, telefone incoerente...).
      const opcoes = { imagens: idsComImagem, avaliacoes, textos: { pt: textos, es: textosEs } };
      for (const problema of problemasNosDados(site, areasDeServico, opcoes)) {
        server.config.logger.warn(`[dados] ${problema}`, { timestamp: true });
      }
      const port = server.config.server.port ?? 5173;
      const deploy = resolveDeployEnv({ ...process.env, SITE_URL: `http://localhost:${port}` });
      const caminho = new URL(ctx.originalUrl ?? ctx.path, 'http://x').pathname;
      const idioma = caminho.startsWith(`${server.config.base}es/`) ? 'es' : 'pt';
      return html
        .replace('<html lang="pt-BR">', idioma === 'es' ? '<html lang="es">' : '<html lang="pt-BR">')
        .replace('<!--app-head-->', renderHead('home', deploy, idioma));
    },
  };
}
