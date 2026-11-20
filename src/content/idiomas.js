/**
 * Idiomas do site. O português é o principal e fica na raiz (<base>/); o espanhol ganha uma
 * página própria em <base>/es/, para o público venezuelano e de outros países hispânicos.
 *
 * Os textos de cada idioma ficam em arquivos com a mesma estrutura:
 *   português  src/content/textos.js     src/content/seo.js
 *   espanhol   src/content/textos.es.js  src/content/seo.es.js
 * Os serviços e as mensagens do WhatsApp em espanhol ficam ao lado dos em português
 * (src/content/servicos.js → `es`; src/config/site.js → `whatsapp.mensagensEs`).
 * O build falha se faltar um texto em um dos idiomas (src/lib/validar-site.js).
 */

/**
 * @typedef {'pt' | 'es'} IdIdioma
 *
 * @typedef {object} Idioma
 * @property {IdIdioma} id
 * @property {string} lang      Atributo lang do <html> e hreflang.
 * @property {string} caminho   Pasta da página, depois do base path ("" ou "es/").
 * @property {string} ogLocale  Open Graph (og:locale).
 */

/** @type {Record<IdIdioma, Idioma>} */
export const idiomas = {
  pt: { id: 'pt', lang: 'pt-BR', caminho: '', ogLocale: 'pt_BR' },
  es: { id: 'es', lang: 'es', caminho: 'es/', ogLocale: 'es_LA' },
};

export const IDIOMA_PADRAO = 'pt';

/** Idiomas na ordem em que aparecem (o padrão primeiro). */
export const listaDeIdiomas = Object.values(idiomas);

/** Idioma de uma página pelo atributo lang do <html>: "es" → espanhol; qualquer outro → português. */
export function idiomaPeloLang(lang) {
  return String(lang ?? '').toLowerCase().startsWith('es') ? 'es' : IDIOMA_PADRAO;
}

/** O outro idioma (o do link de troca no header). */
export function outroIdioma(id) {
  return id === 'es' ? 'pt' : 'es';
}
