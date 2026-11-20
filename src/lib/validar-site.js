/**
 * Confere os dados editados à mão: src/config/site.js, src/content/servicos.js,
 * src/content/avaliacoes.js e a tradução para o espanhol (src/content/textos.es.js tem de ter a
 * mesma estrutura de textos.js; serviços e mensagens do WhatsApp, a tradução de cada um).
 *
 * Roda no build (scripts/prerender.mjs) e no verify (scripts/verify-dist.mjs): um erro
 * de digitação — dia "quartas", horário "9h", telefone com um dígito trocado, o mesmo dia em
 * dois horários que se sobrepõem — faz o build falhar com uma mensagem em português, em vez
 * de publicar "NaNh" ou um horário mal formatado. Confere formato e coerência, não se o dado
 * está certo: um número errado digitado igual nos três campos passa.
 * JavaScript puro, sem import.meta: pode ser importado pelo Node.
 */
import { DIAS, indiceDoDia } from './contact.js';

const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;
const ID_DE_SERVICO = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MES = /^\d{4}-(0[1-9]|1[0-2])$/;
const ORIGENS_DE_AVALIACAO = ['google', 'whatsapp'];
/**
 * Chaves dos textos que não são traduzidas: o valor precisa ser igual nos dois idiomas.
 * Nos links (`link`), `whatsapp` é a chave da mensagem e `secao` o id da seção de destino.
 */
const chaveFixa = (caminho, chave) =>
  chave === 'id' || chave === 'icone' || (caminho.endsWith('.link') && (chave === 'whatsapp' || chave === 'secao'));

const digitos = (texto) => String(texto ?? '').replace(/\D/g, '');

/**
 * Remove o 9 extra dos celulares brasileiros (55 + DDD + 9 + 8 dígitos), para comparar
 * o número do link (que pode estar sem o 9, como a conta do WhatsApp) com o exibido.
 */
const semNonoDigito = (d) => (d.length === 13 && d.startsWith('55') && d[4] === '9' ? d.slice(0, 4) + d.slice(5) : d);

const vazio = (valor) => typeof valor !== 'string' || !valor.trim();

const tipoDe = (v) => (Array.isArray(v) ? 'lista' : v === null ? 'null' : typeof v);
const NOME_DO_TIPO = { lista: 'uma lista', object: 'um grupo de textos', string: 'um texto', function: 'uma função', boolean: 'sim/não', number: 'um número', null: 'vazio', undefined: 'ausente' };

/**
 * Diferenças entre a estrutura dos textos em português e em espanhol: chave que falta ou sobra,
 * lista com outro número de itens, texto vazio só em espanhol, id diferente.
 * @returns {string[]}
 */
function diferencasDeEstrutura(pt, es, caminho) {
  const tPt = tipoDe(pt);
  const tEs = tipoDe(es);
  if (tPt !== tEs) return [`${caminho}: em português é ${NOME_DO_TIPO[tPt]}, em espanhol é ${NOME_DO_TIPO[tEs]}.`];
  if (tPt === 'lista') {
    const erros = pt.length !== es.length ? [`${caminho}: ${pt.length} item(ns) em português e ${es.length} em espanhol.`] : [];
    pt.slice(0, es.length).forEach((v, i) => erros.push(...diferencasDeEstrutura(v, es[i], `${caminho}[${i}]`)));
    return erros;
  }
  if (tPt === 'object') {
    const erros = [];
    for (const chave of Object.keys(pt)) {
      if (!(chave in es)) erros.push(`falta ${caminho}.${chave} em espanhol.`);
      else if (chaveFixa(caminho, chave) && pt[chave] !== es[chave]) {
        erros.push(`${caminho}.${chave}: "${es[chave]}" em espanhol, "${pt[chave]}" em português (precisa ser igual).`);
      } else erros.push(...diferencasDeEstrutura(pt[chave], es[chave], `${caminho}.${chave}`));
    }
    for (const chave of Object.keys(es)) {
      if (!(chave in pt)) erros.push(`${caminho}.${chave} existe só em espanhol.`);
    }
    return erros;
  }
  if (tPt === 'string' && !vazio(pt) && vazio(es)) return [`${caminho} está vazio em espanhol.`];
  return [];
}

/**
 * Lista os problemas encontrados (lista vazia = tudo certo).
 * @param {typeof import('../config/site.js').site} site
 * @param {typeof import('../content/servicos.js').areasDeServico} [areas]
 * @param {object} [opcoes]
 * @param {string[]} [opcoes.imagens]  ids com imagem em src/assets/servicos (src/lib/imagens-de-servico.js).
 * @param {typeof import('../content/avaliacoes.js').avaliacoes} [opcoes.avaliacoes]
 * @param {{ pt: object, es: object }} [opcoes.textos]  textos.js e textos.es.js, para comparar as estruturas.
 * @returns {string[]}
 */
export function problemasNosDados(site, areas = [], { imagens, avaliacoes = [], textos } = {}) {
  const erros = [];

  // WhatsApp: os três campos precisam descrever o mesmo número.
  const w = site.whatsapp ?? {};
  if (!/^55\d{10,11}$/.test(w.numero ?? '')) {
    erros.push(`whatsapp.numero "${w.numero}" inválido: use só dígitos, com 55 e o DDD (ex.: 554195079359).`);
  } else {
    const numero = semNonoDigito(w.numero);
    if (semNonoDigito(`55${digitos(w.exibicao)}`) !== numero) {
      erros.push(`whatsapp.exibicao "${w.exibicao}" não é o mesmo número de whatsapp.numero "${w.numero}".`);
    }
    if (semNonoDigito(digitos(w.internacional)) !== numero) {
      erros.push(`whatsapp.internacional "${w.internacional}" não é o mesmo número de whatsapp.numero "${w.numero}".`);
    }
  }
  for (const [chave, mensagem] of Object.entries(w.mensagens ?? {})) {
    if (vazio(mensagem)) erros.push(`whatsapp.mensagens.${chave} está vazia.`);
    if (vazio(w.mensagensEs?.[chave])) erros.push(`whatsapp.mensagensEs.${chave} (a mensagem em espanhol) está vazia ou faltando.`);
  }
  for (const chave of Object.keys(w.mensagensEs ?? {})) {
    if (!(chave in (w.mensagens ?? {}))) erros.push(`whatsapp.mensagensEs.${chave} existe só em espanhol (falta em whatsapp.mensagens).`);
  }

  // Endereço e mapa.
  const e = site.endereco ?? {};
  for (const chave of ['logradouro', 'numero', 'bairro', 'cidade', 'uf']) {
    if (vazio(e[chave])) erros.push(`endereco.${chave} está vazio.`);
  }
  if (e.cep != null && !/^\d{5}-\d{3}$/.test(e.cep)) {
    erros.push(`endereco.cep "${e.cep}" inválido: use o formato "00000-000" (ou null, se não souber).`);
  }
  const { latitude, longitude } = site.geo ?? {};
  if (!(Math.abs(latitude) <= 90) || !(Math.abs(longitude) <= 180)) {
    erros.push('geo: latitude ou longitude inválida.');
  }
  if (site.mapa?.placeId != null && !/^[\w-]{10,}$/.test(site.mapa.placeId)) {
    erros.push(`mapa.placeId "${site.mapa.placeId}" inválido: cole o Place ID do Google (ex.: "ChIJ…") ou use null.`);
  }

  // Horários.
  if (site.horarios != null) {
    if (!Array.isArray(site.horarios)) {
      erros.push('horarios precisa ser null ou uma lista (veja o exemplo em src/config/site.js).');
    } else {
      /** Faixas já vistas por dia da semana (índice em DIAS), para achar sobreposições. */
      const faixasDoDia = new Map();
      site.horarios.forEach((h, i) => {
        const onde = `horarios[${i}]`;
        const diasValidos = [];
        if (!Array.isArray(h?.dias) || h.dias.length === 0) {
          erros.push(`${onde}: "dias" precisa ser uma lista com pelo menos um dia.`);
        } else {
          for (const dia of h.dias) {
            const indice = indiceDoDia(dia);
            if (indice < 0) {
              erros.push(`${onde}: dia "${dia}" inválido. Use segunda, terca, quarta, quinta, sexta, sabado ou domingo.`);
            } else if (diasValidos.includes(indice)) {
              erros.push(`${onde}: o dia "${dia}" está repetido.`);
            } else {
              diasValidos.push(indice);
            }
          }
        }
        for (const chave of ['abre', 'fecha']) {
          if (!HORA.test(h?.[chave] ?? '')) {
            erros.push(`${onde}: ${chave} "${h?.[chave]}" inválido. Use o formato 24 h "HH:MM", ex.: "09:00".`);
          }
        }
        if (!HORA.test(h?.abre ?? '') || !HORA.test(h?.fecha ?? '')) return;
        if (h.abre >= h.fecha) {
          erros.push(`${onde}: o horário de abrir (${h.abre}) precisa ser antes do de fechar (${h.fecha}).`);
          return;
        }
        // O mesmo dia pode ter duas faixas (ex.: pausa para o almoço), mas sem sobreposição:
        // "sexta 09:00–19:00" e "sexta 09:00–16:00" publicariam dois horários contraditórios.
        for (const indice of diasValidos) {
          const anteriores = faixasDoDia.get(indice) ?? [];
          const conflito = anteriores.find((f) => h.abre < f.fecha && f.abre < h.fecha);
          if (conflito) {
            erros.push(
              `${onde}: ${DIAS[indice][1].toLowerCase()} ${h.abre}–${h.fecha} se sobrepõe a ${conflito.onde} (${conflito.abre}–${conflito.fecha}).`,
            );
          }
          faixasDoDia.set(indice, [...anteriores, { abre: h.abre, fecha: h.fecha, onde }]);
        }
      });
    }
  }

  // Redes sociais.
  (site.redesSociais ?? []).forEach((rede, i) => {
    if (vazio(rede?.nome)) erros.push(`redesSociais[${i}]: falta o nome (ex.: "Instagram").`);
    if (!/^https:\/\/\S+$/.test(rede?.url ?? '')) erros.push(`redesSociais[${i}]: url precisa começar com https://.`);
  });

  // Serviços (agrupados por área).
  const ids = new Set();
  /** Serviço → área onde apareceu primeiro, para achar o mesmo serviço em duas áreas. */
  const servicoVisto = new Map();
  areas.forEach((a, i) => {
    const onde = `areasDeServico[${i}]${a?.id ? ` (${a.id})` : ''}`;
    if (!ID_DE_SERVICO.test(a?.id ?? '')) {
      erros.push(`${onde}: o id precisa ter só letras minúsculas sem acento, números e hífens (ex.: "tela-e-carcaca").`);
    } else if (ids.has(a.id)) {
      erros.push(`${onde}: id repetido.`);
    } else {
      ids.add(a.id);
    }
    for (const chave of ['nome', 'mensagemWhatsApp']) {
      if (vazio(a?.[chave])) erros.push(`${onde}: ${chave} está vazio.`);
    }
    if (!Array.isArray(a?.servicos) || a.servicos.length === 0) {
      erros.push(`${onde}: "servicos" precisa ser uma lista com pelo menos um serviço.`);
    } else {
      a.servicos.forEach((nome, j) => {
        if (vazio(nome)) {
          erros.push(`${onde}: o serviço ${j + 1} está vazio.`);
          return;
        }
        const chave = nome.trim().toLowerCase();
        if (servicoVisto.has(chave)) {
          erros.push(`${onde}: o serviço "${nome}" está repetido (já aparece em ${servicoVisto.get(chave)}).`);
        } else {
          servicoVisto.set(chave, onde);
        }
      });
    }
    if (typeof a?.confirmado !== 'boolean') erros.push(`${onde}: confirmado precisa ser true ou false (sem aspas).`);
    // Tradução para o espanhol: mesmo número de serviços, na mesma ordem.
    if (!a?.es || typeof a.es !== 'object') {
      erros.push(`${onde}: falta a tradução para o espanhol (es: { nome, servicos, mensagemWhatsApp }).`);
    } else {
      for (const chave of ['nome', 'mensagemWhatsApp']) {
        if (vazio(a.es[chave])) erros.push(`${onde}: es.${chave} (em espanhol) está vazio.`);
      }
      const total = Array.isArray(a?.servicos) ? a.servicos.length : 0;
      if (!Array.isArray(a.es.servicos) || a.es.servicos.length !== total) {
        erros.push(`${onde}: es.servicos precisa ter a tradução de cada serviço, na mesma ordem (${total} serviço(s)).`);
      } else {
        a.es.servicos.forEach((nome, j) => {
          if (vazio(nome)) erros.push(`${onde}: a tradução do serviço ${j + 1} está vazia.`);
        });
      }
    }
    if (imagens && ID_DE_SERVICO.test(a?.id ?? '') && !imagens.includes(a.id)) {
      erros.push(`${onde}: falta a imagem src/assets/servicos/${a.id}.svg (ou .webp/.jpg).`);
    }
  });

  // Avaliações de clientes.
  const idsDeAvaliacao = new Set();
  (Array.isArray(avaliacoes) ? avaliacoes : []).forEach((a, i) => {
    const onde = `avaliacoes[${i}]${a?.id ? ` (${a.id})` : ''}`;
    if (!ID_DE_SERVICO.test(a?.id ?? '')) {
      erros.push(`${onde}: o id precisa ter só letras minúsculas sem acento, números e hífens (ex.: "maria-2026-03").`);
    } else if (idsDeAvaliacao.has(a.id)) {
      erros.push(`${onde}: id repetido.`);
    } else {
      idsDeAvaliacao.add(a.id);
    }
    if (vazio(a?.nome)) erros.push(`${onde}: falta o nome (como o cliente autorizou aparecer).`);
    if (vazio(a?.texto)) erros.push(`${onde}: falta o texto da avaliação.`);
    if (!ORIGENS_DE_AVALIACAO.includes(a?.origem)) erros.push(`${onde}: origem precisa ser 'google' ou 'whatsapp'.`);
    if (a?.nota != null) {
      if (!Number.isInteger(a.nota) || a.nota < 1 || a.nota > 5) erros.push(`${onde}: nota precisa ser um número inteiro de 1 a 5 (sem aspas).`);
      else if (a.origem !== 'google') erros.push(`${onde}: nota só existe nas avaliações do Google.`);
    }
    if (a?.data != null && !MES.test(a.data)) erros.push(`${onde}: data "${a.data}" inválida: use "AAAA-MM", ex.: "2026-03".`);
    if (typeof a?.permissao !== 'boolean') erros.push(`${onde}: permissao precisa ser true ou false (sem aspas).`);
  });

  // Textos em espanhol com a mesma estrutura dos em português.
  if (textos) {
    erros.push(...diferencasDeEstrutura(textos.pt, textos.es, 'textos').map((e) => `src/content/textos.es.js: ${e}`));
  }

  return erros;
}

/**
 * Lança um erro com todos os problemas, para interromper o build.
 * @param {Parameters<typeof problemasNosDados>} args
 */
export function validarSite(...args) {
  const erros = problemasNosDados(...args);
  if (erros.length) {
    throw new Error(
      'Dados inválidos em src/config/site.js, src/content/servicos.js, src/content/avaliacoes.js ou ' +
        `src/content/textos.es.js — corrija antes de publicar:\n  - ${erros.join('\n  - ')}`,
    );
  }
}
