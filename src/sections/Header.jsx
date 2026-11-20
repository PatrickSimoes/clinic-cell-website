import { Menu, MessageCircle } from 'lucide-react';
import { useIdioma } from '../lib/idioma.js';
import { Icon } from '../components/Icon.jsx';
import { LanguageLink } from '../components/LanguageLink.jsx';
import { Logo } from '../components/Logo.jsx';
import { WhatsAppLink } from '../components/WhatsAppLink.jsx';

/**
 * Header: logo + navegação + idioma + "Orçamento pelo WhatsApp" (desktop) / idioma + botão
 * "Menu" (celular). O link de idioma ("ES" na página em português, "PT" na em espanhol) fica
 * sempre à vista: o header é fixo.
 * Até o React assumir a página (html.is-hydrated) — ou sem JavaScript — o botão "Menu"
 * dá lugar a um link com o mesmo visual para a navegação do rodapé.
 *
 * @param {object} props
 * @param {string} props.homeHref
 * @param {(id: string) => string} props.hrefFor
 * @param {boolean} props.menuOpen
 * @param {(event: import('react').MouseEvent<HTMLButtonElement>) => void} props.onOpenMenu
 * @param {boolean} props.inert
 */
export function Header({ homeHref, hrefFor, menuOpen, onOpenMenu, inert }) {
  const { textos, secoes, mensagens } = useIdioma();
  return (
    <header className="site-header" inert={inert}>
      <div className="container site-header__inner">
        <a className="site-header__brand" href={homeHref}>
          <Logo
            variant="blue"
            width={80}
            sizes="(min-width: 64em) 94px, 80px"
            className="site-header__logo"
            alt={textos.logoAlt.header}
          />
        </a>

        <nav className="site-header__nav" aria-label={textos.header.navegacaoAria}>
          <ul className="site-header__nav-list" role="list">
            {secoes
              .filter((secao) => !secao.foraDoHeader)
              .map((secao) => (
                <li key={secao.id} className={secao.headerLargo ? 'site-header__nav-item--largo' : undefined}>
                  <a className="site-header__nav-link" href={hrefFor(secao.id)}>
                    {secao.nome}
                  </a>
                </li>
              ))}
          </ul>
        </nav>

        <LanguageLink className="site-header__lang" />

        <WhatsAppLink
          className="button button--whatsapp button--small site-header__cta"
          mensagem={mensagens.orcamento}
        >
          <Icon icon={MessageCircle} />
          {textos.header.cta}
        </WhatsAppLink>

        <button
          className="site-header__menu"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="menu"
          onClick={onOpenMenu}
        >
          <Icon icon={Menu} />
          {textos.global.menu}
        </button>
        <a className="site-header__menu site-header__menu--fallback" href="#rodape-navegacao">
          <Icon icon={Menu} />
          {textos.global.menu}
        </a>
      </div>
    </header>
  );
}
