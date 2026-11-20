/**
 * Dados estruturados (Schema.org, JSON-LD) da página inicial.
 *
 * Tipo: LocalBusiness — o Schema.org não tem um subtipo específico para
 * assistência técnica de celulares (MobilePhoneStore significa loja que VENDE
 * aparelhos, o que não está confirmado). Os serviços das áreas confirmadas entram em
 * `hasOfferCatalog` (um catálogo por área), o que deixa claro o tipo de negócio.
 *
 * Só entram dados confirmados: horários, CEP, redes sociais e serviços aparecem
 * aqui automaticamente quando forem preenchidos/confirmados em src/config e src/content.
 */
import { site } from '../config/site.js';
import { areasPublicadas } from './services.js';
import { seo } from '../content/seo.js';
import { openingHoursSpecification, whatsappUrl } from './contact.js';
import { fotoSobreUrl } from './foto-sobre.js';

/**
 * URL absoluta da imagem de compartilhamento. Com `version` (hash do arquivo, calculado
 * no prerender), vira `og-image.jpg?v=<hash>`: quando a imagem muda, a URL muda e
 * WhatsApp/Facebook deixam de reaproveitar a prévia antiga do cache.
 * @param {string} siteUrl
 * @param {string} [version]
 */
export function ogImageUrl(siteUrl, version) {
  const url = new URL(seo.ogImage.path, siteUrl);
  if (version) url.searchParams.set('v', version);
  return url.href;
}

/**
 * @param {object} params
 * @param {string} params.pageUrl  URL absoluta e canônica da página (com barra final).
 * @param {string} params.siteUrl  URL absoluta da raiz do site (com barra final).
 * @param {string} [params.ogImageVersion]  Hash da og-image (ver ogImageUrl).
 */
export function buildStructuredData({ pageUrl, siteUrl, ogImageVersion }) {
  const businessId = `${siteUrl}#empresa`;
  const websiteId = `${siteUrl}#site`;
  const logoUrl = new URL(seo.logoPath, siteUrl).href;
  const imageUrl = ogImageUrl(siteUrl, ogImageVersion);
  // A foto real do Sobre, quando existir, é a imagem mais representativa do negócio.
  const fotoUrl = fotoSobreUrl ? new URL(fotoSobreUrl, siteUrl).href : null;
  const e = site.endereco;
  const hours = openingHoursSpecification();

  /** @type {Record<string, unknown>} */
  const business = {
    '@type': 'LocalBusiness',
    '@id': businessId,
    name: site.nome,
    alternateName: site.nomeAlternativo,
    description: seo.businessDescription,
    url: siteUrl,
    logo: logoUrl,
    image: fotoUrl ? [fotoUrl, imageUrl, logoUrl] : [imageUrl, logoUrl],
    telephone: site.whatsapp.internacional,
    foundingDate: String(site.anoFundacao),
    address: {
      '@type': 'PostalAddress',
      // O Schema.org não tem campo de bairro; no Brasil ele vai junto da rua.
      streetAddress: `${e.logradouro}, ${e.numero} - ${e.bairro}`,
      addressLocality: e.cidade,
      addressRegion: e.uf,
      addressCountry: e.pais,
      ...(e.cep ? { postalCode: e.cep } : {}),
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    hasMap: `https://maps.google.com/?cid=${site.mapa.cid}`,
    areaServed: {
      '@type': 'City',
      name: e.cidade,
      containedInPlace: { '@type': 'State', name: e.estado },
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: site.whatsapp.internacional,
      url: whatsappUrl(),
      availableLanguage: 'Portuguese',
    },
  };

  if (hours) business.openingHoursSpecification = hours;
  if (site.redesSociais.length) business.sameAs = site.redesSociais.map((r) => r.url);
  if (areasPublicadas.length) {
    business.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Serviços de assistência técnica de celulares',
      itemListElement: areasPublicadas.map((area) => ({
        '@type': 'OfferCatalog',
        name: area.nome,
        itemListElement: area.servicos.map((nome) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: nome,
            areaServed: { '@type': 'City', name: e.cidade },
            provider: { '@id': businessId },
          },
        })),
      })),
    };
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      business,
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: siteUrl,
        name: site.nome,
        // Nome do site nos resultados do Google (só vale com o site na raiz de um domínio).
        alternateName: site.nomeAlternativo,
        inLanguage: 'pt-BR',
        publisher: { '@id': businessId },
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#pagina`,
        url: pageUrl,
        name: seo.home.title,
        description: seo.home.description,
        inLanguage: 'pt-BR',
        isPartOf: { '@id': websiteId },
        about: { '@id': businessId },
        primaryImageOfPage: { '@type': 'ImageObject', url: imageUrl },
      },
    ],
  };
}
