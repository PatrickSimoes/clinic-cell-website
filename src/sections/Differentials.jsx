import { CircuitBoard, MessageCircle, ShieldCheck, Store } from 'lucide-react';
import { site } from '../config/site.js';
import { useIdioma } from '../lib/idioma.js';
import { Icon } from '../components/Icon.jsx';
import { Pad } from '../components/Pad.jsx';
import { SectionLabel } from '../components/SectionLabel.jsx';
import { WhatsAppLink } from '../components/WhatsAppLink.jsx';

const ICONES = { CircuitBoard, MessageCircle, ShieldCheck, Store };

/**
 * Diferenciais: só afirmações verificáveis, ligadas por um barramento de circuito.
 * @param {{ hrefFor: (id: string) => string }} props
 */
export function Differentials({ hrefFor }) {
  const { textos } = useIdioma();
  const t = textos.diferenciais;
  return (
    <section className="section diffs has-spine" id="diferenciais" aria-labelledby="dif-title" tabIndex={-1}>
      <div className="container grid">
        <SectionLabel>{textos.secoes.diferenciais}</SectionLabel>
        <h2 className="section-title diffs__title" id="dif-title">
          {t.titulo}
        </h2>
        <p className="section-intro diffs__intro">{t.introducao}</p>
        <ul className="diffs__list" role="list">
          {t.itens.map((item) => (
            <li className="diff" key={item.id}>
              <Pad className="diff__pad" />
              <div className="diff__head">
                <Icon icon={ICONES[item.icone] ?? MessageCircle} className="diff__icon" />
                <h3 className="diff__title">{item.titulo}</h3>
              </div>
              <p className="diff__text">
                {item.texto}
                {item.link ? (
                  <>
                    {' '}
                    <a className="link" href={hrefFor(item.link.secao)}>
                      {item.link.rotulo}
                    </a>
                  </>
                ) : null}
                {item.telefone ? (
                  <>
                    {' '}
                    <WhatsAppLink className="link link--whatsapp phone">{site.whatsapp.exibicao}</WhatsAppLink>.
                  </>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
