import { Globe } from 'lucide-react';
import { outroIdioma } from '../content/idiomas.js';
import { conteudoDoIdioma } from '../lib/conteudo.js';
import { useIdioma } from '../lib/idioma.js';
import { Icon } from './Icon.jsx';

const BASE = import.meta.env.BASE_URL;

/**
 * Link para a página inicial no outro idioma: "ES" na página em português, "PT" na em espanhol.
 * O link fala o idioma de destino (lang e hreflang): a sigla e o complemento para leitores de
 * tela ("Ver el sitio en español") vêm dos textos do destino.
 * @param {{ className?: string }} props
 */
export function LanguageLink({ className }) {
  const { idioma } = useIdioma();
  const destino = conteudoDoIdioma(outroIdioma(idioma.id));
  const t = destino.textos.idioma;
  return (
    <a
      className={className}
      href={`${BASE}${destino.idioma.caminho}`}
      hrefLang={destino.idioma.lang}
      lang={destino.idioma.lang}
    >
      <Icon icon={Globe} />
      {t.sigla}
      <span className="visually-hidden"> – {t.ver}</span>
    </a>
  );
}
