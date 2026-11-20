import { MessageCircle } from 'lucide-react';
import { site } from '../config/site.js';
import { nomeDaSecao } from '../content/secoes.js';
import { textos } from '../content/textos.js';
import { Icon } from '../components/Icon.jsx';
import { SectionLabel } from '../components/SectionLabel.jsx';
import { StackedLabel } from '../components/StackedLabel.jsx';
import { WhatsAppLink } from '../components/WhatsAppLink.jsx';

const t = textos.cta;

/** Chamada final: o segundo plano azul, com o contato direto pelo WhatsApp. */
export function FinalCta() {
  const mensagem = site.whatsapp.mensagens.contato;
  return (
    <section className="section cta has-spine on-field" id="contato" aria-labelledby="cta-title" tabIndex={-1}>
      <div className="container grid">
        <SectionLabel>{nomeDaSecao('contato')}</SectionLabel>
        <h2 className="cta__title" id="cta-title">
          {t.titulo}
        </h2>
        <div className="cta__side">
          <p className="cta__text">{t.texto}</p>
          <div className="cta__actions">
            <WhatsAppLink className="button button--whatsapp" mensagem={mensagem}>
              <Icon icon={MessageCircle} />
              <StackedLabel sub={textos.global.peloWhatsApp}>{t.botao}</StackedLabel>
            </WhatsAppLink>
          </div>
          <p className="cta__phone">
            {t.linhaTelefone}{' '}
            <WhatsAppLink className="link link--tap link--whatsapp phone" mensagem={mensagem}>
              {site.whatsapp.exibicao}
            </WhatsAppLink>
          </p>
        </div>
      </div>
    </section>
  );
}
