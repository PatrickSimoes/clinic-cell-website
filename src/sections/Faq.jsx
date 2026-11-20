import { Plus } from 'lucide-react';
import { site } from '../config/site.js';
import { nomeDaSecao } from '../content/secoes.js';
import { textos } from '../content/textos.js';
import { formatClosedDays, formatHours } from '../lib/contact.js';
import { areasPublicadas } from '../lib/services.js';
import { Icon } from '../components/Icon.jsx';
import { SectionLabel } from '../components/SectionLabel.jsx';
import { WhatsAppLink } from '../components/WhatsAppLink.jsx';

const t = textos.duvidas;

/**
 * Dúvidas frequentes: perguntas que abrem e fecham (<details>), sem depender de JavaScript.
 * A pergunta sobre os serviços some se nenhum estiver publicado.
 * No computador, duas colunas independentes (metade das perguntas em cada): abrir uma resposta
 * só empurra as perguntas da mesma coluna. No celular, as colunas viram uma lista só.
 */
export function Faq() {
  const dados = {
    areas: areasPublicadas,
    totalServicos: areasPublicadas.reduce((total, area) => total + area.servicos.length, 0),
    endereco: site.endereco,
    horarios: formatHours(),
    fechados: formatClosedDays(),
  };
  const perguntas = t.perguntas.filter((p) => p.id !== 'servicos' || dados.totalServicos > 0);
  const metade = Math.ceil(perguntas.length / 2);
  const colunas = [perguntas.slice(0, metade), perguntas.slice(metade)];

  return (
    <section className="section faq has-spine" id="duvidas" aria-labelledby="faq-title" tabIndex={-1}>
      <div className="container grid">
        <SectionLabel>{nomeDaSecao('duvidas')}</SectionLabel>
        <h2 className="section-title" id="faq-title">
          {t.titulo}
        </h2>
        <div className="faq__list">
          {colunas.map((coluna, i) => (
            <div className="faq__col" key={i}>
              {coluna.map((p) => (
                <details className="faq__item" key={p.id} id={`duvida-${p.id}`}>
                  <summary className="faq__question">
                    <span>{p.pergunta}</span>
                    <Icon icon={Plus} className="faq__toggle" />
                  </summary>
                  <p className="faq__answer">
                    {typeof p.resposta === 'function' ? p.resposta(dados) : p.resposta}
                    {p.link ? (
                      <>
                        {' '}
                        <FaqLink link={p.link} />
                      </>
                    ) : null}
                  </p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** @param {{ link: { rotulo: string, whatsapp?: string, secao?: string } }} props */
function FaqLink({ link }) {
  if (link.whatsapp) {
    return (
      <WhatsAppLink
        className="link link--whatsapp"
        mensagem={site.whatsapp.mensagens[link.whatsapp]}
      >
        {link.rotulo}
      </WhatsAppLink>
    );
  }
  return (
    <a className="link" href={`#${link.secao}`}>
      {link.rotulo}
    </a>
  );
}
