import { useEffect, useRef } from 'react';
import { MessageCircle, Navigation, X } from 'lucide-react';
import { site } from '../config/site.js';
import { directionsUrl, formatAddress } from '../lib/contact.js';
import { useIdioma } from '../lib/idioma.js';
import { ExternalLink } from '../components/ExternalLink.jsx';
import { Icon } from '../components/Icon.jsx';
import { Logo } from '../components/Logo.jsx';
import { Pad } from '../components/Pad.jsx';
import { SectionLabel } from '../components/SectionLabel.jsx';
import { StackedLabel } from '../components/StackedLabel.jsx';
import { WhatsAppLink } from '../components/WhatsAppLink.jsx';

/**
 * Menu do celular: diálogo modal de tela cheia.
 * Ao abrir, o foco vai para "Fechar"; o resto da página fica `inert` (SiteLayout);
 * Tab fica preso no diálogo; Esc ou um link fecham.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {(options?: { restoreFocus?: boolean }) => void} props.onClose
 * @param {(id: string) => string} props.hrefFor
 */
export function MobileMenu({ open, onClose, hrefFor }) {
  const { textos, secoes, mensagens } = useIdioma();
  const dialogRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const closeRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
  const endereco = formatAddress();

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  /** Reforço do foco preso (além do inert no resto da página). */
  function trapTab(event) {
    if (event.key !== 'Tab' || !dialogRef.current) return;
    const focusables = [...dialogRef.current.querySelectorAll('a[href], button')];
    const first = focusables[0];
    const last = focusables.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return (
    <div
      className="menu"
      id="menu"
      role="dialog"
      aria-modal="true"
      aria-label={textos.menu.aria}
      hidden={!open}
      ref={dialogRef}
      onKeyDown={trapTab}
    >
      <div className="container menu__top">
        <Logo variant="blue" width={80} sizes="80px" className="menu__logo" alt={textos.logoAlt.simples} loading="lazy" />
        <button className="menu__close" type="button" ref={closeRef} onClick={() => onClose()}>
          <Icon icon={X} />
          {textos.global.fechar}
        </button>
      </div>

      <div className="container">
        <SectionLabel solid className="menu__label">
          {textos.menu.rotulo}
        </SectionLabel>
        <nav aria-label={textos.menu.navegacaoAria}>
          <ol className="menu__list" role="list">
            {secoes.map((secao) => (
              <li className="menu__item" key={secao.id}>
                <a className="menu__link" href={hrefFor(secao.id)} onClick={() => onClose({ restoreFocus: false })}>
                  <Pad />
                  {secao.nome}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="container menu__foot">
        <WhatsAppLink className="button button--whatsapp button--block" mensagem={mensagens.orcamento}>
          <Icon icon={MessageCircle} />
          <StackedLabel sub={textos.global.peloWhatsApp}>{textos.menu.orcamento}</StackedLabel>
        </WhatsAppLink>
        <ExternalLink
          className="button button--secondary button--block"
          href={directionsUrl()}
          srText={`${textos.localizacao.rotaOculto} (${textos.global.novaAba})`}
        >
          <Icon icon={Navigation} />
          {textos.menu.rota}
        </ExternalLink>
        <p className="menu__address">
          {endereco.rua}
          <br />
          {site.endereco.bairro} · <span className="nowrap">{endereco.cidadeUf}</span>
        </p>
      </div>
    </div>
  );
}
