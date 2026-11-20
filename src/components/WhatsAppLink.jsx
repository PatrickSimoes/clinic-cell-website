import { site } from '../config/site.js';
import { whatsappUrl } from '../lib/contact.js';
import { ExternalLink } from './ExternalLink.jsx';

/**
 * Link para o WhatsApp da ClinicCell com mensagem pré-preenchida (abre em nova aba).
 *
 * @param {object} props
 * @param {string} [props.mensagem]  Texto inicial da conversa. Padrão: mensagem geral.
 * @param {string} [props.className]
 * @param {string} [props.srText]
 * @param {import('react').ReactNode} [props.after]
 * @param {import('react').ReactNode} props.children
 */
export function WhatsAppLink({ mensagem = site.whatsapp.mensagens.geral, ...rest }) {
  return <ExternalLink href={whatsappUrl(mensagem)} {...rest} />;
}
