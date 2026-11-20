import { mostrarAvaliacoes } from '../lib/avaliacoes.js';
import { areasPublicadas } from '../lib/services.js';
import { About } from '../sections/About.jsx';
import { Differentials } from '../sections/Differentials.jsx';
import { Faq } from '../sections/Faq.jsx';
import { FinalCta } from '../sections/FinalCta.jsx';
import { Hero } from '../sections/Hero.jsx';
import { Highlights } from '../sections/Highlights.jsx';
import { Location } from '../sections/Location.jsx';
import { Reviews } from '../sections/Reviews.jsx';
import { Services } from '../sections/Services.jsx';

/**
 * Página inicial: Hero → Destaques → Serviços → Sobre → Diferenciais → Avaliações → Localização →
 * Dúvidas → Contato. A mesma página serve aos dois idiomas (o texto vem de useIdioma()).
 */
export function HomePage() {
  return (
    <>
      <Hero hasServices={areasPublicadas.length > 0} />
      <Highlights />
      <Services />
      <About />
      <Differentials hrefFor={(id) => `#${id}`} />
      {mostrarAvaliacoes ? <Reviews /> : null}
      <Location />
      <Faq />
      <FinalCta />
    </>
  );
}
