/**
 * Textos de SEO (title, description, Open Graph) por página.
 * Title ideal: até ~60 caracteres. Description: entre 120 e 160 caracteres.
 * A versão em espanhol fica em src/content/seo.es.js; imagem, logo e cor são as mesmas.
 */
import { site } from '../config/site.js';

const { cidade, bairro, uf } = site.endereco;

export const seo = {
  home: {
    title: `${site.nome} | Assistência Técnica de Celulares em ${cidade}`,
    description: `Conserto de celular em ${cidade}, no bairro ${bairro}: troca de tela, bateria e reparo em placa, com garantia de 90 dias. Orçamento pelo WhatsApp.`,
  },
  notFound: {
    title: `Página não encontrada | ${site.nome}`,
    description: `Esta página não existe. Volte para a página inicial da ${site.nome}.`,
  },
  /**
   * Imagem de compartilhamento (public/og-image.jpg, gerada por `npm run og:image`).
   * O alt descreve o texto desenhado na imagem: se mudar telefone ou endereço, gere a
   * imagem de novo — o verify reprova a imagem desatualizada.
   */
  ogImage: {
    path: 'og-image.jpg',
    width: 1200,
    height: 630,
    alt: `Logo da ${site.nome} sobre fundo azul, com o texto: Assistência técnica de celulares, bairro ${bairro}, ${cidade} (${uf}), WhatsApp ${site.whatsapp.exibicao}.`,
  },
  /** Logo quadrada original, pública, usada nos dados estruturados (public/brand/cliniccell-logo.png). */
  logoPath: 'brand/cliniccell-logo.png',
  /** Nome do catálogo de serviços nos dados estruturados. */
  catalogo: 'Serviços de assistência técnica de celulares',
  /** Descrição da empresa nos dados estruturados. */
  businessDescription: `Assistência técnica de celulares desde ${site.anoFundacao}, com garantia de 90 dias nos serviços. Conserto de iPhone, Samsung, Motorola e outras marcas. Loja no bairro ${bairro}, em ${cidade} (${uf}).`,
  /** Cor da barra do navegador no celular — branca, como o header. */
  themeColor: '#FFFFFF',
};
