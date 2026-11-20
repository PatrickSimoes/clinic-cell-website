import { useIdioma } from '../lib/idioma.js';

/**
 * Link que abre em nova aba (WhatsApp, Google Maps, Waze), com aviso para leitores de tela.
 * O texto visível vem primeiro no nome acessível (WCAG 2.5.3).
 *
 * @param {object} props
 * @param {string} props.href
 * @param {string} [props.className]
 * @param {string} [props.srText]  Complemento lido por leitores de tela. Padrão: " (abre em nova aba)", no idioma da página.
 * @param {import('react').ReactNode} [props.after]  Ícone depois do texto (ex.: seta ↗).
 * @param {import('react').ReactNode} props.children
 */
export function ExternalLink({ href, className, srText, after, children, ...rest }) {
  const { textos } = useIdioma();
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      <span className="visually-hidden">{srText ?? ` (${textos.global.novaAba})`}</span>
      {after}
    </a>
  );
}
