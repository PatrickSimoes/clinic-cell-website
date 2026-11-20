import { House, MessageCircle } from 'lucide-react';
import { textos } from '../content/textos.js';
import { Icon } from '../components/Icon.jsx';
import { SectionLabel } from '../components/SectionLabel.jsx';
import { WhatsAppLink } from '../components/WhatsAppLink.jsx';

const t = textos.naoEncontrada;

/** Página 404 (dist/404.html): o GitHub Pages a exibe para endereços inexistentes. */
export function NotFoundPage() {
  return (
    <section className="not-found" aria-labelledby="nf-title">
      <div className="container grid">
        <div className="not-found__content">
          <SectionLabel solid className="not-found__label">
            {t.rotulo}
          </SectionLabel>
          <h1 className="not-found__title" id="nf-title">
            {t.titulo}
          </h1>
          <p className="not-found__text">{t.texto}</p>
          <div className="not-found__actions">
            <a className="button button--primary not-found__home" href={import.meta.env.BASE_URL}>
              <Icon icon={House} />
              {t.inicio}
            </a>
            <WhatsAppLink className="text-link link--whatsapp">
              <Icon icon={MessageCircle} />
              {t.whatsapp}
            </WhatsAppLink>
          </div>
        </div>
      </div>
    </section>
  );
}
