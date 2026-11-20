import { ArrowUpRight, MessageCircle, MessageCircleQuestionMark } from 'lucide-react';
import { site } from '../config/site.js';
import { nomeDaSecao } from '../content/secoes.js';
import { textos } from '../content/textos.js';
import { imagensDeServico } from '../lib/imagens-de-servico.js';
import { areasPublicadas } from '../lib/services.js';
import { Icon } from '../components/Icon.jsx';
import { Pad } from '../components/Pad.jsx';
import { SectionLabel } from '../components/SectionLabel.jsx';
import { StackedLabel } from '../components/StackedLabel.jsx';
import { WhatsAppLink } from '../components/WhatsAppLink.jsx';

const t = textos.servicos;

/**
 * Serviços: tabela de linhas (não cards), uma linha por área com a lista dos serviços dela.
 * Só lista áreas confirmadas (src/content/servicos.js); sem nenhuma, mostra o convite para
 * descrever o defeito.
 */
export function Services() {
  const lista = areasPublicadas;

  return (
    <section className="section services has-spine" id="servicos" aria-labelledby="servicos-title" tabIndex={-1}>
      <div className="container grid">
        <SectionLabel>{nomeDaSecao('servicos')}</SectionLabel>
        <h2 className="section-title" id="servicos-title">
          {t.titulo}
        </h2>

        {lista.length === 0 ? (
          <ServicesEmpty />
        ) : (
          <>
            <p className="section-intro services__intro">{t.introducao}</p>
            <div className="services__table-head" aria-hidden="true">
              <span />
              <span>{t.tabela.area}</span>
              <span>{t.tabela.servicos}</span>
              <span className="services__th-action">{t.tabela.acao}</span>
            </div>
            <ol className="services__list" role="list">
              {lista.map((area) => (
                <ServiceRow key={area.id} area={area} />
              ))}
            </ol>
            <div className="services__more">
              <Icon icon={MessageCircleQuestionMark} className="services__more-icon" />
              <p className="services__more-text">
                <span className="services__more-question">{t.mais.pergunta}</span>{' '}
                <WhatsAppLink className="link link--whatsapp" mensagem={site.whatsapp.mensagens.defeito}>
                  {t.mais.link}
                </WhatsAppLink>
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/** @param {{ area: import('../content/servicos.js').AreaDeServico }} props */
function ServiceRow({ area }) {
  return (
    <li className="service" id={`servico-${area.id}`}>
      {/* Imagem decorativa: o título ao lado já diz o que é. */}
      <img
        className="service__image"
        src={imagensDeServico[area.id]}
        alt=""
        width={480}
        height={300}
        loading="lazy"
        decoding="async"
      />
      <h3 className="service__title">{area.nome}</h3>
      <ul className="service__items" role="list">
        {area.servicos.map((nome) => (
          <li className="service__item" key={nome}>
            {nome}
          </li>
        ))}
      </ul>
      <WhatsAppLink
        className="service__link"
        mensagem={area.mensagemWhatsApp}
        srText={` de ${area.nome.toLowerCase()} pelo WhatsApp (${textos.global.novaAba})`}
        after={<Icon icon={ArrowUpRight} />}
      >
        {t.linkItem}
      </WhatsAppLink>
    </li>
  );
}

/** Estado sem serviços publicados: texto perene, voltado à ação (nada de "em breve"). */
function ServicesEmpty() {
  return (
    <div className="services-empty">
      <div className="services-empty__head">
        <Pad />
        <h3 className="services-empty__title">{t.vazio.titulo}</h3>
      </div>
      <p className="services-empty__text">{t.vazio.texto}</p>
      <div className="services-empty__action">
        <WhatsAppLink className="button button--whatsapp" mensagem={site.whatsapp.mensagens.defeito}>
          <Icon icon={MessageCircle} />
          <StackedLabel sub={textos.global.peloWhatsApp}>{t.vazio.botao}</StackedLabel>
        </WhatsAppLink>
      </div>
    </div>
  );
}
