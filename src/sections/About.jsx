import { site } from '../config/site.js';
import { nomeDaSecao } from '../content/secoes.js';
import { textos } from '../content/textos.js';
import { useAnoAtual } from '../lib/ano.js';
import { fotoSobreUrl as fotoUrl } from '../lib/foto-sobre.js';
import { Pad } from '../components/Pad.jsx';
import { SectionLabel } from '../components/SectionLabel.jsx';

const t = textos.sobre;

/** Sobre: "Desde 2011" em escala + régua com um traço por ano até hoje. */
export function About() {
  const anos = Math.max(1, useAnoAtual() - site.anoFundacao);

  return (
    <section className="section about has-spine" id="sobre" aria-labelledby="sobre-title" tabIndex={-1}>
      <div className="container grid">
        <SectionLabel>{nomeDaSecao('sobre')}</SectionLabel>
        <h2 className="about__title" id="sobre-title">
          <span className="about__kicker">{t.kicker} </span>
          <span className="about__year">{site.anoFundacao}</span>
        </h2>
        <div className="ruler about__ruler" style={{ '--years': anos }} aria-hidden="true">
          <Pad solid />
          <Pad />
          <span className="ruler__end">{t.hoje}</span>
        </div>
        <div className="about__body">
          <p className="about__text">{t.texto}</p>
        </div>
        {fotoUrl ? (
          <figure className="about-photo">
            <div className="about-photo__frame">
              <img
                className="about-photo__img"
                src={fotoUrl}
                alt={t.foto.alt}
                width="1200"
                height="900"
                loading="lazy"
                decoding="async"
              />
            </div>
            {t.foto.legenda ? <figcaption className="about-photo__caption">{t.foto.legenda}</figcaption> : null}
          </figure>
        ) : null}
      </div>
    </section>
  );
}
