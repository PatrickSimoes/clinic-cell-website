import { areasPublicadas } from '../lib/services.js';
import { About } from '../sections/About.jsx';
import { Differentials } from '../sections/Differentials.jsx';
import { Faq } from '../sections/Faq.jsx';
import { FinalCta } from '../sections/FinalCta.jsx';
import { Hero } from '../sections/Hero.jsx';
import { Highlights } from '../sections/Highlights.jsx';
import { Location } from '../sections/Location.jsx';
import { Services } from '../sections/Services.jsx';

/** Página inicial: Hero → Destaques → Serviços → Sobre → Diferenciais → Localização → Dúvidas → Contato. */
export function HomePage() {
  return (
    <>
      <Hero hasServices={areasPublicadas.length > 0} />
      <Highlights />
      <Services />
      <About />
      <Differentials hrefFor={(id) => `#${id}`} />
      <Location />
      <Faq />
      <FinalCta />
    </>
  );
}
