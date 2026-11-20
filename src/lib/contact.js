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
 */
export function mapaIncorporadoUrl() {
  const e = site.endereco;
  const alvo = site.mapa.cid
    ? `cid=${site.mapa.cid}`
    : `q=${encodeURIComponent(`${site.nome}, ${e.logradouro}, ${e.numero} - ${e.bairro}, ${e.cidade} - ${e.uf}`)}`;
  return `https://maps.google.com/maps?${alvo}&z=16&hl=pt-BR&output=embed`;
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

/** "09:00" → "9h"; "09:30" → "9h30" */
function formatTime(hhmm) {
  const [h, m] = hhmm.split(':');
  return `${Number(h)}h${m && m !== '00' ? m : ''}`;
}

/** ['segunda', ..., 'sexta'] → "Segunda a sexta"; ['sabado', 'domingo'] → "Sábado e domingo" */
function formatDays(dias) {
  const order = dias
    .map(indiceDoDia)
    .filter((i) => i >= 0)
    .sort((a, b) => a - b);
  const label = (i) => DIAS[i][1];
  const consecutive = order.every((v, i) => i === 0 || v === order[i - 1] + 1);
  if (order.length >= 3 && consecutive) {
    return `${label(order[0])} a ${label(order.at(-1)).toLowerCase()}`;
  }
  const names = order.map((i, n) => (n === 0 ? label(i) : label(i).toLowerCase()));
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} e ${names.at(-1)}` : (names[0] ?? '');
}

/**
 * Horários formatados para exibição, ou `null` se ainda não foram confirmados.
 * Nunca calcule "aberto agora": o site é estático e o horário pode ter exceções.
 * @returns {{ dias: string, horario: string }[] | null}
 */
export function formatHours() {
  if (!site.horarios?.length) return null;
  return site.horarios.map((h) => ({
    dias: formatDays(h.dias),
    horario: `${formatTime(h.abre)} às ${formatTime(h.fecha)}`,
  }));
}

/**
 * Dias sem horário (fechados), já formatados ("Domingo"), ou `null` se todo dia abre ou se os
 * horários ainda não foram informados.
 */
export function formatClosedDays() {
  if (!site.horarios?.length) return null;
  const abertos = new Set(site.horarios.flatMap((h) => h.dias.map(indiceDoDia)));
  const fechados = DIAS.filter((_, i) => !abertos.has(i)).map(([id]) => id);
  return fechados.length ? formatDays(fechados) : null;
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
