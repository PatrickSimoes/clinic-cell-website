/**
 * O que a imagem de compartilhamento (public/og-image.jpg) mostra.
 *
 * O mesmo módulo é usado para DESENHAR a imagem (scripts/og-image.mjs, que também grava
 * scripts/og-image.dados.json) e para CONFERIR se ela está atualizada (scripts/verify-dist.mjs):
 * se telefone, endereço ou logo mudarem sem `npm run og:image`, o verify reprova o build.
 */
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Logo usada na imagem (gerada por `npm run brand:assets`). */
export const LOGO_DA_OG_IMAGE = 'src/assets/brand/logo-white.png';
/**
 * Registro do que foi desenhado na última geração (versionado junto com a imagem): os campos
 * de dadosDaOgImage() e, em imagemSha256, a impressão digital da própria imagem gerada.
 */
export const DADOS_DA_OG_IMAGE = 'scripts/og-image.dados.json';

/** Impressão digital curta (16 caracteres do SHA-256) de um arquivo. */
export function sha256Curto(conteudo) {
  return createHash('sha256').update(conteudo).digest('hex').slice(0, 16);
}

/**
 * Textos e logo que a imagem deve mostrar, a partir dos dados do site.
 * @param {typeof import('../../src/config/site.js').site} site
 */
export async function dadosDaOgImage(site) {
  const { bairro, cidade, uf } = site.endereco;
  const logo = await readFile(path.join(root, LOGO_DA_OG_IMAGE));
  return {
    titulo: 'Assistência técnica de celulares',
    local: `Bairro ${bairro} · ${cidade} — ${uf}`,
    rotuloContato: 'WhatsApp',
    telefone: site.whatsapp.exibicao,
    logoSha256: sha256Curto(logo),
  };
}
