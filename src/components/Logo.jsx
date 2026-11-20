/**
 * Logo ClinicCell (lockup completo) em WebP responsivo.
 * Arquivos gerados por `npm run brand:assets` a partir da logo original — nunca redesenhe a arte.
 *
 * - variant="white": sobre fundos azuis (versão original da marca)
 * - variant="blue":  sobre fundos claros
 */
import { site } from '../config/site.js';

const SOURCES = {
  white: import.meta.glob('../assets/brand/generated/logo-white-*.webp', { eager: true, import: 'default' }),
  blue: import.meta.glob('../assets/brand/generated/logo-blue-*.webp', { eager: true, import: 'default' }),
};

/** Proporção do lockup (altura / largura do arquivo master 1413x786). */
const RATIO = 786 / 1413;

/** @param {Record<string, string>} files */
function byWidth(files) {
  return Object.entries(files)
    .map(([file, url]) => [Number(file.match(/-(\d+)\.webp$/)?.[1]), url])
    .filter(([w]) => w > 0)
    .sort((a, b) => a[0] - b[0]);
}

const LISTS = { white: byWidth(SOURCES.white), blue: byWidth(SOURCES.blue) };

/**
 * @param {object} props
 * @param {'white' | 'blue'} [props.variant]
 * @param {number} props.width      Largura de exibição em px (define width/height e evita CLS).
 * @param {string} [props.sizes]    Atributo sizes; padrão: a largura fixa.
 * @param {string} [props.alt]
 * @param {'eager' | 'lazy'} [props.loading]
 * @param {string} [props.className]
 */
export function Logo({ variant = 'white', width, sizes, alt = site.nome, loading = 'eager', className }) {
  const list = LISTS[variant];
  const fallback = (list.find(([w]) => w >= width * 2) ?? list.at(-1))[1];
  return (
    <img
      className={className}
      src={fallback}
      srcSet={list.map(([w, url]) => `${url} ${w}w`).join(', ')}
      sizes={sizes ?? `${width}px`}
      width={width}
      height={Math.round(width * RATIO)}
      alt={alt}
      loading={loading}
      decoding="async"
    />
  );
}
