import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { site } from '../config/site.js';
import { secoes } from '../content/secoes.js';
import { textos } from '../content/textos.js';
import { useAnoAtual } from '../lib/ano.js';
import { formatAddress, mapsUrl } from '../lib/contact.js';
import { cx } from '../lib/cx.js';
import { ExternalLink } from '../components/ExternalLink.jsx';
import { Icon } from '../components/Icon.jsx';
import { Logo } from '../components/Logo.jsx';
import { Pad } from '../components/Pad.jsx';
import { WhatsAppLink } from '../components/WhatsAppLink.jsx';

const t = textos.rodape;

/**
 * Rodapé (colofão): marca, endereço, WhatsApp, navegação e direitos autorais.
 * A navegação daqui (#rodape-navegacao) é o destino do "Menu" quando não há JavaScript.
 *
 * @param {object} props
 * @param {(id: string) => string} props.hrefFor
 * @param {string} props.topHref
 * @param {boolean} [props.spine]  Liga o rodapé à espinha das seções (só na home; a 404 não tem espinha).
 * @param {boolean} props.inert
 */
export function Footer({ hrefFor, topHref, spine = true, inert }) {
  const endereco = formatAddress();
  const anoAtual = useAnoAtual();
  return (
    <footer className={cx('site-footer', spine && 'has-spine')} inert={inert}>
      <div className="container grid">
        {spine ? <Pad solid className="site-footer__terminal" /> : null}

        <div className="site-footer__brand">
          <Logo
            variant="blue"
            width={101}
            sizes="101px"
            className="site-footer__logo"
            alt={textos.logoAlt.simples}
            loading="lazy"
          />
          <p className="site-footer__about">{t.frase}</p>
        </div>

        <div className="site-footer__col site-footer__col--address">
          <h2 className="site-footer__heading">{t.titulos.endereco}</h2>
          <address>
            {endereco.rua}
            <br />
            {site.endereco.bairro} · <span className="nowrap">{endereco.cidadeUf}</span>
            {endereco.cep ? (
              <>
                <br />
                <span className="nowrap">{endereco.cep}</span>
              </>
            ) : null}
          </address>
          <ExternalLink className="link site-footer__link" href={mapsUrl()} after={<Icon icon={ArrowUpRight} />}>
            {t.abrirMaps}
          </ExternalLink>
        </div>

        <div className="site-footer__col site-footer__col--phone">
          <h2 className="site-footer__heading">{t.titulos.whatsapp}</h2>
          <WhatsAppLink className="link link--whatsapp phone site-footer__link">{site.whatsapp.exibicao}</WhatsAppLink>
        </div>

        <nav
          className="site-footer__col site-footer__col--nav"
          id="rodape-navegacao"
          aria-label={t.navegacaoAria}
          tabIndex={-1}
        >
          <h2 className="site-footer__heading">{t.titulos.navegacao}</h2>
          <ul className="site-footer__nav-list" role="list">
            {secoes.map((secao) => (
              <li key={secao.id}>
                <a className="site-footer__nav-link" href={hrefFor(secao.id)}>
                  {secao.nome}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer__bottom">
          <p>{t.direitos(anoAtual)}</p>
          <a className="site-footer__top-link" href={topHref}>
            {t.voltarAoTopo}
            <Icon icon={ArrowUp} />
          </a>
        </div>
      </div>
    </footer>
  );
}
