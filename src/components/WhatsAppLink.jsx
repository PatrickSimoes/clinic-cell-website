import { whatsappUrl } from '../lib/contact.js';
import { useIdioma } from '../lib/idioma.js';
import { ExternalLink } from './ExternalLink.jsx';

/**
 * Link para o WhatsApp da ClinicCell com mensagem pré-preenchida (abre em nova aba).
 *
 * @param {object} props
 * @param {string} [props.mensagem]  Texto inicial da conversa. Padrão: mensagem geral, no idioma da página.
 * @param {string} [props.className]
 * @param {string} [props.srText]
 * @param {import('react').ReactNode} [props.after]
 * @param {import('react').ReactNode} props.children
 */
export function WhatsAppLink({ mensagem, ...rest }) {
  const { mensagens } = useIdioma();
  return <ExternalLink href={whatsappUrl(mensagem ?? mensagens.geral)} {...rest} />;
}
