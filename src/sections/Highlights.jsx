import { CreditCard, ShieldCheck, Smartphone, Wrench } from 'lucide-react';
import { useIdioma } from '../lib/idioma.js';
import { totalDeServicos as totalServicos } from '../lib/services.js';
import { Icon } from '../components/Icon.jsx';

const ICONES = { CreditCard, ShieldCheck, Smartphone, Wrench };

/** Faixa de destaques logo abaixo do topo: fatos curtos, um por coluna. */
export function Highlights() {
  const t = useIdioma().textos.destaques;
  // Sem serviços publicados, o item com a contagem sai (nada de "0 serviços").
  const itens = t.itens.filter((item) => typeof item.valor !== 'function' || totalServicos > 0);

  return (
    <section className="highlights has-spine" aria-labelledby="destaques-title">
      <div className="container">
        <h2 className="visually-hidden" id="destaques-title">
          {t.titulo}
        </h2>
        <ul className="highlights__list" role="list">
          {itens.map((item) => {
            const valor = typeof item.valor === 'function' ? item.valor(totalServicos) : item.valor;
            return (
              <li className="highlight" key={item.id}>
                <Icon icon={ICONES[item.icone] ?? Wrench} className="highlight__icon" />
                <p className="highlight__value">{valor}</p>
                <p className="highlight__text">{item.texto}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
