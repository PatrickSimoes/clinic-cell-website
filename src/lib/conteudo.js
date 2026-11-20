/**
 * Conteúdo de cada idioma num lugar só: textos, SEO, seções, mensagens do WhatsApp e serviços.
 * Os componentes leem daqui pelo hook useIdioma() (src/lib/idioma.js); o build (head.js,
 * dados estruturados) e as verificações (verify-dist, qa) chamam conteudoDoIdioma() direto.
 * JavaScript puro, sem import.meta: pode ser importado pelo Node.
 */
import { site } from '../config/site.js';
import { idiomas } from '../content/idiomas.js';
import { secoes } from '../content/secoes.js';
import { seo } from '../content/seo.js';
import { seoEs } from '../content/seo.es.js';
import { textos as textosPt } from '../content/textos.js';
import { textos as textosEs } from '../content/textos.es.js';
import { mostrarAvaliacoes } from './avaliacoes.js';
import { areasDoIdioma } from './services.js';

/** Seções que existem na página (a de Avaliações pode não existir: src/lib/avaliacoes.js). */
const secoesDaPagina = secoes.filter((s) => s.id !== 'avaliacoes' || mostrarAvaliacoes);

/** @param {'pt' | 'es'} id */
function montar(id) {
  const textos = id === 'es' ? textosEs : textosPt;
  return {
    idioma: idiomas[id],
    textos,
    seo: id === 'es' ? { ...seo, ...seoEs, ogImage: { ...seo.ogImage, alt: seoEs.ogImageAlt } } : seo,
    /** Seções na ordem da página, com o nome no idioma. */
    secoes: secoesDaPagina.map((s) => ({ ...s, nome: textos.secoes[s.id] })),
    /** Mensagens pré-preenchidas do WhatsApp (src/config/site.js). */
    mensagens: id === 'es' ? site.whatsapp.mensagensEs : site.whatsapp.mensagens,
    /** Áreas de serviço publicadas, traduzidas. */
    areas: areasDoIdioma(id),
  };
}

/** Montado uma vez por idioma: o mesmo objeto em toda renderização. */
const CONTEUDO = { pt: montar('pt'), es: montar('es') };

/**
 * @param {'pt' | 'es'} [id]
 * @returns {ReturnType<typeof montar>}
 */
export function conteudoDoIdioma(id = 'pt') {
  return CONTEUDO[id] ?? CONTEUDO.pt;
}
