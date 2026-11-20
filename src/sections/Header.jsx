import { Menu, MessageCircle } from 'lucide-react';
import { site } from '../config/site.js';
import { secoes } from '../content/secoes.js';
import { textos } from '../content/textos.js';
import { Icon } from '../components/Icon.jsx';
import { Logo } from '../components/Logo.jsx';
import { WhatsAppLink } from '../components/WhatsAppLink.jsx';

/**
 * Header: logo + navegação + "Orçamento pelo WhatsApp" (desktop) / botão "Menu" (celular).
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
            {secoes.map((secao) => (
              <li key={secao.id}>
                <a className="site-header__nav-link" href={hrefFor(secao.id)}>
                  {secao.nome}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <WhatsAppLink
          className="button button--whatsapp button--small site-header__cta"
          mensagem={site.whatsapp.mensagens.orcamento}
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
