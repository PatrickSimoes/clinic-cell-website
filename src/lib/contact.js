/**
 * Links e formatações de contato derivados de `site`.
 * Componentes nunca montam URLs de WhatsApp ou mapa à mão: usam estas funções.
 */
import { site } from '../config/site.js';

/**
 * Link do WhatsApp com mensagem pré-preenchida.
 * Usa encodeURIComponent (espaço vira %20, quebra de linha vira %0A).
 * @param {string} [mensagem] Texto inicial da conversa. Padrão: mensagem geral.
 */
export function whatsappUrl(mensagem = site.whatsapp.mensagens.geral) {
  const base = `https://wa.me/${site.whatsapp.numero}`;
  return mensagem ? `${base}?text=${encodeURIComponent(mensagem)}` : base;
}

/** Endereço em linhas prontas para exibição. */
export function formatAddress() {
  const e = site.endereco;
  // Só para exibição: o número fica preso à última palavra da rua (espaço não separável),
  // para nunca sobrar sozinho numa linha ("Rua ... Gellert" / "Krigsner, 2884").
  return {
    /** "Rua Anneliese Gellert Krigsner, 2884" */
    rua: `${e.logradouro},\u00a0${e.numero}`,
    /** "São José dos Pinhais — PR" (trecho que não deve quebrar linha) */
    cidadeUf: `${e.cidade} — ${e.uf}`,
    cep: e.cep ? `CEP ${e.cep}` : null,
    /** Texto copiado pelo botão "Copiar endereço". */
    copia: `${e.logradouro}, ${e.numero} - ${e.bairro}, ${e.cidade} - ${e.uf}${e.cep ? `, ${e.cep}` : ''}`,
  };
}

/** Ponto da ClinicCell no Google Maps (link fornecido pela empresa). */
export function mapsUrl() {
  return site.mapa.link;
}

/**
 * Mapa do Google para incorporar na página (iframe), centrado no ponto da ClinicCell.
 * Usa o CID do ponto (mostra a ficha "ClinicCell"); sem ele, nome + endereço. Não precisa de chave de API.
 * @param {'pt' | 'es'} [idioma]  Idioma dos textos do mapa.
 */
export function mapaIncorporadoUrl(idioma = 'pt') {
  const e = site.endereco;
  const alvo = site.mapa.cid
    ? `cid=${site.mapa.cid}`
    : `q=${encodeURIComponent(`${site.nome}, ${e.logradouro}, ${e.numero} - ${e.bairro}, ${e.cidade} - ${e.uf}`)}`;
  return `https://maps.google.com/maps?${alvo}&z=16&hl=${idioma === 'es' ? 'es' : 'pt-BR'}&output=embed`;
}

/**
 * Página do Google onde o cliente escreve uma avaliação da loja (precisa do Place ID), ou `null`.
 * É o mesmo link que o proprietário pode mandar pelo WhatsApp depois de cada atendimento.
 */
export function avaliarNoGoogleUrl() {
  const placeId = site.mapa.placeId;
  return placeId ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}` : null;
}

/**
 * Rota até a loja no Google Maps (abre o app no celular).
 * O destino é nome + endereço, para a rota mostrar "ClinicCell" e não só coordenadas.
 * Com `site.mapa.placeId` preenchido, o Google usa o ponto exato (o texto vira só reserva).
 */
export function directionsUrl() {
  const e = site.endereco;
  const destino = `${site.nome}, ${e.logradouro}, ${e.numero} - ${e.bairro}, ${e.cidade} - ${e.uf}`;
  const placeId = site.mapa.placeId ? `&destination_place_id=${encodeURIComponent(site.mapa.placeId)}` : '';
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}${placeId}`;
}

/** Navegação pelo Waze até as coordenadas da loja. */
export function wazeUrl() {
  const { latitude, longitude } = site.geo;
  return `https://waze.com/ul?ll=${latitude}%2C${longitude}&navigate=yes`;
}

/** [id, rótulo, nome no Schema.org] — a ordem é a da semana. */
export const DIAS = /** @type {const} */ ([
  ['segunda', 'Segunda', 'Monday'],
  ['terca', 'Terça', 'Tuesday'],
  ['quarta', 'Quarta', 'Wednesday'],
  ['quinta', 'Quinta', 'Thursday'],
  ['sexta', 'Sexta', 'Friday'],
  ['sabado', 'Sábado', 'Saturday'],
  ['domingo', 'Domingo', 'Sunday'],
]);

/**
 * Índice do dia em DIAS, aceitando a grafia natural: "Terça", "terça" e "terca" valem o mesmo.
 * Retorna -1 se o dia não existir (o build falha antes disso: ver src/lib/validar-site.js).
 */
export function indiceDoDia(dia) {
  const id = String(dia).trim().toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
  return DIAS.findIndex(([d]) => d === id);
}

/** Nomes dos dias em espanhol, na ordem de DIAS. */
const DIAS_ES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

/**
 * Como cada idioma escreve dias e horas.
 * pt: "Segunda a sexta", "Sábado e domingo", "9h às 19h", "9h30"
 * es: "Lunes a viernes", "Sábado y domingo", "9:00 a 19:00", "9:30"
 */
const FORMATO = {
  pt: {
    dia: (i) => DIAS[i][1],
    e: 'e',
    hora: (h, m) => `${h}h${m !== '00' ? m : ''}`,
    faixa: (abre, fecha) => `${abre} às ${fecha}`,
  },
  es: {
    dia: (i) => DIAS_ES[i],
    e: 'y',
    hora: (h, m) => `${h}:${m}`,
    faixa: (abre, fecha) => `${abre} a ${fecha}`,
  },
};

/** "09:00" → "9h" (pt) ou "9:00" (es); "09:30" → "9h30" ou "9:30" */
function formatTime(hhmm, f) {
  const [h, m = '00'] = hhmm.split(':');
  return f.hora(Number(h), m);
}

/** ['segunda', ..., 'sexta'] → "Segunda a sexta"; ['sabado', 'domingo'] → "Sábado e domingo" */
function formatDays(dias, f) {
  const order = dias
    .map(indiceDoDia)
    .filter((i) => i >= 0)
    .sort((a, b) => a - b);
  const consecutive = order.every((v, i) => i === 0 || v === order[i - 1] + 1);
  if (order.length >= 3 && consecutive) {
    return `${f.dia(order[0])} a ${f.dia(order.at(-1)).toLowerCase()}`;
  }
  const names = order.map((i, n) => (n === 0 ? f.dia(i) : f.dia(i).toLowerCase()));
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} ${f.e} ${names.at(-1)}` : (names[0] ?? '');
}

/**
 * Horários formatados para exibição, ou `null` se ainda não foram confirmados.
 * Nunca calcule "aberto agora": o site é estático e o horário pode ter exceções.
 * @param {'pt' | 'es'} [idioma]
 * @returns {{ dias: string, horario: string }[] | null}
 */
export function formatHours(idioma = 'pt') {
  if (!site.horarios?.length) return null;
  const f = FORMATO[idioma] ?? FORMATO.pt;
  return site.horarios.map((h) => ({
    dias: formatDays(h.dias, f),
    horario: f.faixa(formatTime(h.abre, f), formatTime(h.fecha, f)),
  }));
}

/**
 * Dias sem horário (fechados), já formatados ("Domingo"), ou `null` se todo dia abre ou se os
 * horários ainda não foram informados.
 * @param {'pt' | 'es'} [idioma]
 */
export function formatClosedDays(idioma = 'pt') {
  if (!site.horarios?.length) return null;
  const abertos = new Set(site.horarios.flatMap((h) => h.dias.map(indiceDoDia)));
  const fechados = DIAS.filter((_, i) => !abertos.has(i)).map(([id]) => id);
  return fechados.length ? formatDays(fechados, FORMATO[idioma] ?? FORMATO.pt) : null;
}

/** Horários no formato Schema.org (OpeningHoursSpecification), ou `null`. */
export function openingHoursSpecification() {
  if (!site.horarios?.length) return null;
  return site.horarios.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.dias.map((d) => DIAS[indiceDoDia(d)]?.[2]).filter(Boolean),
    opens: h.abre,
    closes: h.fecha,
  }));
}
