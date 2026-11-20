import { Star } from 'lucide-react';
import { avaliacoesPublicadas } from '../lib/avaliacoes.js';
import { avaliarNoGoogleUrl } from '../lib/contact.js';
import { useIdioma } from '../lib/idioma.js';
import { ExternalLink } from '../components/ExternalLink.jsx';
import { Icon } from '../components/Icon.jsx';
import { SectionLabel } from '../components/SectionLabel.jsx';

/**
 * Avaliações: só as reais, com a permissão do cliente (src/content/avaliacoes.js), em linhas
 * com fio (sem cards), duas colunas no computador. Sem nenhuma, a seção é só o convite para
 * avaliar a loja no Google. O texto sai como o cliente escreveu, em português: na página em
 * espanhol ele é marcado com lang="pt-BR", para os leitores de tela lerem com a voz certa.
 */
export function Reviews() {
  const { textos } = useIdioma();
  const t = textos.avaliacoes;
  const lista = avaliacoesPublicadas;
  const cabecalho = lista.length ? t : t.semAvaliacoes;
  const avaliar = avaliarNoGoogleUrl();

  return (
    <section className="section reviews has-spine" id="avaliacoes" aria-labelledby="avaliacoes-title" tabIndex={-1}>
      <div className="container grid">
        <SectionLabel>{textos.secoes.avaliacoes}</SectionLabel>
        <h2 className="section-title" id="avaliacoes-title">
          {cabecalho.titulo}
        </h2>
        <p className="section-intro">{cabecalho.introducao}</p>

        {lista.length ? (
          <ul className="reviews__list" role="list">
            {lista.map((avaliacao) => (
              <Review key={avaliacao.id} avaliacao={avaliacao} />
            ))}
          </ul>
        ) : null}

        {avaliar ? (
          <div className="reviews__action">
            <ExternalLink className="button button--secondary" href={avaliar}>
              <Icon icon={Star} />
              {t.avaliar}
            </ExternalLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** @param {{ avaliacao: import('../content/avaliacoes.js').Avaliacao }} props */
function Review({ avaliacao: a }) {
  const { textos, idioma } = useIdioma();
  const t = textos.avaliacoes;
  // "2026-03" → "março de 2026" / "marzo de 2026"
  const [ano, mes] = a.data ? a.data.split('-').map(Number) : [];
  const data = a.data ? t.data(t.meses[mes - 1], ano) : null;

  return (
    <li className="review">
      <figure>
        {a.nota ? (
          <p className="review__stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <Icon key={n} icon={Star} className={n <= a.nota ? 'review__star review__star--on' : 'review__star'} />
            ))}
            <span className="visually-hidden">{t.nota(a.nota)}</span>
          </p>
        ) : null}
        <blockquote className="review__quote" lang={idioma.id === 'pt' ? undefined : 'pt-BR'}>
          <p>{a.texto}</p>
        </blockquote>
        <figcaption className="review__meta">
          <span className="review__name">{a.nome}</span>
          <span>
            {t.origem[a.origem]}
            {data ? ` · ${data}` : null}
          </span>
        </figcaption>
      </figure>
    </li>
  );
}
