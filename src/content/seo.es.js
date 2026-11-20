/**
 * Textos de SEO da página em espanhol (/es/). O que não muda com o idioma (imagem de
 * compartilhamento, logo, cor da barra do navegador) fica em src/content/seo.js.
 * Title ideal: até ~60 caracteres. Description: entre 120 e 160 caracteres.
 */
import { site } from '../config/site.js';

const { cidade, bairro, uf } = site.endereco;

export const seoEs = {
  home: {
    title: `${site.nome} | Reparación de Celulares en ${cidade}`,
    description: `Reparación de celulares en ${cidade}, barrio ${bairro}: cambio de pantalla, batería y placa, con 90 días de garantía. Presupuesto por WhatsApp.`,
  },
  notFound: {
    title: `Página no encontrada | ${site.nome}`,
    description: `Esta página no existe. Vuelve a la página de inicio de ${site.nome}.`,
  },
  /** A imagem de compartilhamento é a mesma das duas versões: o texto dela está em português. */
  ogImageAlt: `Logo de ${site.nome} sobre fondo azul, con el texto en portugués: Assistência técnica de celulares, bairro ${bairro}, ${cidade} (${uf}), WhatsApp ${site.whatsapp.exibicao}.`,
  catalogo: 'Servicios de reparación de celulares',
  businessDescription: `Servicio técnico de celulares desde ${site.anoFundacao}, con 90 días de garantía en los servicios. Reparación de iPhone, Samsung, Motorola y otras marcas. Tienda en el barrio ${bairro}, en ${cidade} (${uf}).`,
};
