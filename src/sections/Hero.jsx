import { ArrowDown, MessageCircle } from 'lucide-react';
import { site } from '../config/site.js';
import { textos } from '../content/textos.js';
import { Icon } from '../components/Icon.jsx';
import { Logo } from '../components/Logo.jsx';
import { Pad } from '../components/Pad.jsx';
import { StackedLabel } from '../components/StackedLabel.jsx';
import { WhatsAppLink } from '../components/WhatsAppLink.jsx';

const t = textos.hero;

/**
 * Primeira dobra: o quê (H1 + subtítulo), onde (rótulo com bairro e cidade) e como
 * chamar (WhatsApp). À direita/abaixo, o plano da marca com a logo.
 *
 * @param {{ hasServices: boolean }} props  Sem serviços publicados, o link secundário leva à Localização.
 */
export function Hero({ hasServices }) {
  return (
    <section className="hero has-spine" id="inicio" aria-labelledby="hero-title">
      <div className="container grid hero__grid">
        <div className="hero__content">
          <p className="section-label hero__label">
            <Pad solid />
            <span>
              {t.rotulo.linha1}
              <span className="hero__label-sep"> · </span>
              <span className="hero__label-city">{t.rotulo.linha2}</span>
            </span>
          </p>
          <h1 className="hero__title" id="hero-title">
            {t.titulo}
          </h1>
          <p className="hero__lead">{t.subtitulo}</p>

          <div className="hero__actions">
            <WhatsAppLink
              className="button button--whatsapp hero__cta"
              mensagem={site.whatsapp.mensagens.orcamento}
              data-hero-cta=""
            >
              <Icon icon={MessageCircle} />
              <StackedLabel sub={textos.global.peloWhatsApp}>{t.cta}</StackedLabel>
            </WhatsAppLink>
            <p className="hero__note">{t.nota}</p>
            <a className="text-link hero__secondary" href={hasServices ? '#servicos' : '#localizacao'}>
              {hasServices ? t.secundario : t.secundarioSemServicos}
              <Icon icon={ArrowDown} />
            </a>
          </div>
        </div>

        <BrandPlate />
      </div>
    </section>
  );
}

/** Plano da marca: o azul do campo da logo, com a logo original e as trilhas de circuito. */
function BrandPlate() {
  return (
    <div className="brand-plate">
      <BrandTraces />
      <div className="brand-plate__logo-area">
        {/* sizes acompanha --logo-plate-w (tokens.css): min(232px, 60vw) no celular, 20rem a
            partir de 48em (768 px) e clamp(17.5rem, 28vw, 26rem) a partir de 64em (1024 px).
            Os pontos de quebra seguem o CSS (em); o de 386px não, porque vem de 232px = 60vw. */}
        <Logo
          variant="white"
          width={232}
          sizes="(min-width: 92.875rem) 26rem, (min-width: 64em) 28vw, (min-width: 48em) 20rem, (max-width: 386px) 60vw, 232px"
          className="brand-plate__logo"
          alt={textos.logoAlt.plano}
        />
      </div>
    </div>
  );
}

/**
 * Trilhas de fundo do plano da marca — reproduzem o fundo da logo (único uso "de textura").
 * Regras para novos caminhos: só horizontais, verticais e diagonais de 45°, começando na
 * borda direita/superior, x ≥ 440 e terminando num terminal. y > 380 vai para o grupo "low".
 * Nenhuma trilha ou terminal pode ficar a menos de 12 px da logo: confira com uma
 * varredura de 320 a 1920 px ao mexer aqui ou no tamanho do plano.
 *
 * - grupo "mid": some entre 1024 e 1199 px (passaria rente à logo);
 * - grupo "low": só a partir de 1280 px.
 */
function BrandTraces() {
  return (
    <svg
      className="brand-plate__traces"
      viewBox="0 0 640 820"
      preserveAspectRatio="xMaxYMin slice"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M640 60H596L564 92V170" />
      <circle cx="564" cy="176" r="5" />
      <path d="M500 0V24L524 48H584" />
      <circle cx="590" cy="48" r="5" />
      <g className="brand-plate__traces-mid">
        <path d="M640 136H620L604 152V292L580 316H512" />
        <circle cx="506" cy="316" r="5" />
      </g>
      <g className="brand-plate__traces-low">
        <path d="M640 400H584L556 428V500" />
        <circle cx="556" cy="506" r="5" />
        <path d="M440 0V48L464 72V128" />
        <circle cx="464" cy="134" r="5" />
      </g>
    </svg>
  );
}
