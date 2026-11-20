/**
 * Resolve a URL pública e o base path do site a partir de variáveis de ambiente.
 *
 *   SITE_URL   Origem pública, ex.: https://usuario.github.io  ou  https://www.cliniccell.com.br
 *   BASE_PATH  Caminho do site, ex.: /nome-do-repositorio/  (repositório de projeto)  ou  /  (domínio próprio)
 *
 * No GitHub Actions os dois vêm de `actions/configure-pages` (ver .github/workflows/deploy.yml),
 * então trocar para um domínio próprio não exige mudança de código.
 * Se SITE_URL vier com caminho (ex.: https://usuario.github.io/repo) e BASE_PATH não for
 * informado, o caminho vira o base path.
 *
 * Uma URL pública precisa ser https (canonical, Open Graph, sitemap e dados estruturados).
 * Endereços locais — localhost, IPs de rede local, *.local — podem usar http.
 */

/** Hosts tratados como locais (máquina ou rede local): não são o endereço publicado. */
const HOST_LOCAL =
  /^(localhost|127(?:\.\d{1,3}){3}|\[::1\]|10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}|[\w-]+\.local)$/i;

export function resolveDeployEnv(env = process.env) {
  const raw = (env.SITE_URL || 'http://localhost:4173').trim();
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`SITE_URL inválida: "${raw}". Use algo como https://usuario.github.io`);
  }

  const basePathInput = env.BASE_PATH ?? (url.pathname !== '/' ? url.pathname : '/');
  if (/[:\\]/.test(basePathInput)) {
    // No Git Bash do Windows, "/repo/" pode ser convertido em "C:/Program Files/Git/repo/".
    throw new Error(
      `BASE_PATH inválido: "${basePathInput}". Use algo como /nome-do-repo/ ` +
        '(no Git Bash do Windows, informe sem a barra inicial: BASE_PATH=nome-do-repo/).',
    );
  }
  const trimmed = basePathInput.trim().replace(/^\/+|\/+$/g, '');
  const base = trimmed ? `/${trimmed}/` : '/';
  const origin = url.origin;
  const isPublicUrl = !HOST_LOCAL.test(url.hostname);

  if (isPublicUrl && url.protocol !== 'https:') {
    // Ex.: domínio próprio com "Enforce HTTPS" desligado faz o configure-pages devolver http://.
    throw new Error(
      `SITE_URL "${raw}" não usa https. O endereço publicado precisa ser https: o GitHub Pages ` +
        'emite o certificado sozinho (Settings → Pages → Enforce HTTPS).',
    );
  }

  return {
    /** Base path com barras nas duas pontas: "/" ou "/repo/". */
    base,
    /** URL absoluta da raiz do site, com barra final: "https://usuario.github.io/repo/". */
    siteUrl: `${origin}${base}`,
    /** `false` quando a URL aponta para a máquina ou a rede local (build sem SITE_URL, testes). */
    isPublicUrl,
  };
}
