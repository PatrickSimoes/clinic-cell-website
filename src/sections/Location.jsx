import { useCallback, useEffect, useRef, useState } from 'react';
import { CarFront, Check, Clock, Copy, MapPin, MessageCircle, Navigation } from 'lucide-react';
import { site } from '../config/site.js';
import { nomeDaSecao } from '../content/secoes.js';
import { textos } from '../content/textos.js';
import {
  directionsUrl,
  formatAddress,
  formatClosedDays,
  formatHours,
  mapaIncorporadoUrl,
  mapsUrl,
  wazeUrl,
} from '../lib/contact.js';
import { ExternalLink } from '../components/ExternalLink.jsx';
import { Ficha, FichaRow } from '../components/Ficha.jsx';
import { Icon } from '../components/Icon.jsx';
import { SectionLabel } from '../components/SectionLabel.jsx';
import { WhatsAppLink } from '../components/WhatsAppLink.jsx';

const t = textos.localizacao;
const novaAba = textos.global.novaAba;

/** Localização: endereço com "Nº 2884", ficha, kit "como chegar" e mapa do Google. */
export function Location() {
  const endereco = formatAddress();
  const horarios = formatHours();
  const fechados = formatClosedDays();
  // Mensagem da região de anúncio. Cada anúncio ganha um número novo (n): o nó é trocado
  // e o leitor de tela anuncia de novo, mesmo com o texto repetido.
  const [anuncio, setAnuncio] = useState({ texto: '', visivel: false, n: 0 });
  const anunciar = useCallback(
    (texto, { visivel = false } = {}) => setAnuncio((atual) => ({ texto, visivel, n: atual.n + 1 })),
    [],
  );
  // A mensagem de falha (com o endereço) aparece embaixo do botão: no celular, o botão fixo do WhatsApp
  // do WhatsApp pode cobri-la. Traz para a vista só o necessário (a folga de rolagem desconta o botão).
  const mensagem = useRef(/** @type {HTMLSpanElement | null} */ (null));
  useEffect(() => {
    if (anuncio.visivel) mensagem.current?.scrollIntoView({ block: 'nearest' });
  }, [anuncio]);

  return (
    <section className="section location has-spine" id="localizacao" aria-labelledby="loc-title" tabIndex={-1}>
      <div className="container grid">
        <SectionLabel>{nomeDaSecao('localizacao')}</SectionLabel>
        <h2 className="section-title location__title" id="loc-title">
          {t.titulo}
        </h2>

        <div className="location__info">
          <address>
            <span className="location__number" aria-hidden="true">
              <span className="location__number-kicker">Nº</span>
              <span className="location__number-value">{site.endereco.numero}</span>
            </span>
            <span className="location__street">
              {site.endereco.logradouro}
              <span className="visually-hidden">, {site.endereco.numero}</span>
            </span>
            <span className="location__district">
              {site.endereco.bairro} · <span className="nowrap">{endereco.cidadeUf}</span>
            </span>
            {/* CEP em linha própria: no meio da frase ele quebraria no hífen ("83065-" / "470"). */}
            {endereco.cep ? <span className="location__cep">{endereco.cep}</span> : null}
          </address>

          <Ficha className="location__ficha">
            <FichaRow icon={MessageCircle} term={t.ficha.whatsapp}>
              <WhatsAppLink className="link link--tap link--whatsapp phone" srText={` (WhatsApp, ${novaAba})`}>
                {site.whatsapp.exibicao}
              </WhatsAppLink>
            </FichaRow>
            <FichaRow icon={Clock} term={t.ficha.horario}>
              {horarios ? (
                <>
                  {horarios.map((h, i) => (
                    <span key={`${h.dias} ${h.horario}`} className={i === 0 ? undefined : 'ficha__note'}>
                      {h.dias} · <span className="phone">{h.horario}</span>
                    </span>
                  ))}
                  {fechados ? (
                    <span className="ficha__note">
                      {fechados} · {t.fechado}
                    </span>
                  ) : null}
                  <span className="ficha__note">{t.horarioExcecoes}</span>
                </>
              ) : (
                <>
                  {t.horarioNaoInformado}
                  <br />
                  <WhatsAppLink
                    className="link link--tap link--whatsapp"
                    mensagem={site.whatsapp.mensagens.horario}
                    srText={`${t.confirmarHorarioOculto} (${novaAba})`}
                  >
                    {t.confirmarHorario}
                  </WhatsAppLink>
                </>
              )}
            </FichaRow>
          </Ficha>

          <div className="location__actions">
            <ExternalLink className="button button--primary" href={mapsUrl()}>
              <Icon icon={MapPin} />
              {t.abrirMaps}
            </ExternalLink>
            <ExternalLink
              className="button button--secondary"
              href={directionsUrl()}
              srText={`${t.rotaOculto} (${novaAba})`}
            >
              <Icon icon={Navigation} />
              {t.rota}
            </ExternalLink>
          </div>

          {/* O "Copiar endereço" vem por último: ele só aparece com o React (até lá o lugar
              fica reservado); assim nunca empurra o Waze. */}
          <ul className="location__more" role="list">
            <li>
              <ExternalLink className="text-button" href={wazeUrl()}>
                <Icon icon={CarFront} />
                {t.waze}
              </ExternalLink>
            </li>
            <li className="requires-js">
              <CopyAddressButton texto={endereco.copia} onAnuncio={anunciar} />
            </li>
          </ul>
          {/* Região de anúncio: fica sempre na árvore de acessibilidade. A confirmação é só para
              leitores de tela (o botão já mostra "Copiado") e não ocupa espaço; a falha aparece
              por escrito, com o endereço, até a próxima tentativa. */}
          <p className="location__status" role="status" aria-live="polite">
            {anuncio.texto ? (
              <span
                key={anuncio.n}
                ref={mensagem}
                className={anuncio.visivel ? 'location__status-texto' : 'visually-hidden'}
              >
                {anuncio.texto}
              </span>
            ) : null}
          </p>
        </div>

        <GoogleMap />
      </div>
    </section>
  );
}

/**
 * Copia o texto para a área de transferência. Usa a Clipboard API e, se ela não existir
 * ou falhar (alguns navegadores internos de aplicativos), o método antigo com execCommand.
 * @param {string} texto
 * @returns {Promise<boolean>} se a cópia funcionou
 */
async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const anterior = document.activeElement;
    const area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.append(area);
    try {
      area.focus({ preventScroll: true });
      area.select();
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      area.remove();
      if (anterior instanceof HTMLElement) anterior.focus({ preventScroll: true });
    }
  }
}

/**
 * Botão "Copiar endereço". Sucesso ou falha são anunciados na região aria-live; na falha,
 * o endereço aparece por escrito e fica até a próxima tentativa.
 *
 * Ícone e rótulos ficam em <span> fixos: assim nenhuma troca usa um nó de texto solto como
 * referência — o tradutor automático do navegador troca esses nós e o React quebraria a
 * página inteira ao inserir o novo ícone.
 *
 * Os rótulos "Copiar endereço", "Copiado" e "Falha ao copiar" ficam empilhados no mesmo lugar
 * (só um visível): o botão tem sempre a largura do maior, e nenhuma troca — nem a da
 * confirmação, que some sozinha depois de 4 s — desloca o que está ao redor.
 *
 * @param {{ texto: string, onAnuncio: (mensagem: string, opcoes?: { visivel?: boolean }) => void }} props
 */
function CopyAddressButton({ texto, onAnuncio }) {
  const [estado, setEstado] = useState(/** @type {'idle' | 'ok' | 'erro'} */ ('idle'));
  const timer = useRef(/** @type {ReturnType<typeof setTimeout> | undefined} */ (undefined));
  const ultimoPedido = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copiar() {
    const pedido = ++ultimoPedido.current;
    clearTimeout(timer.current);
    const copiou = await copiarTexto(texto);
    if (pedido !== ultimoPedido.current) return; // um clique mais novo já assumiu
    if (copiou) {
      setEstado('ok');
      onAnuncio(t.copiar.sucessoAnuncio);
      timer.current = setTimeout(() => {
        setEstado('idle');
        onAnuncio('');
      }, 4000);
    } else {
      setEstado('erro');
      onAnuncio(`${t.copiar.falhaAnuncio} ${texto}`, { visivel: true });
    }
  }

  return (
    <button className="text-button" type="button" onClick={copiar}>
      <span className="text-button__icon">{estado === 'ok' ? <Icon icon={Check} /> : <Icon icon={Copy} />}</span>
      <span className="text-button__rotulos">
        <span className={estado === 'idle' ? undefined : 'is-inativo'}>{t.copiar.rotulo}</span>
        <span className={estado === 'ok' ? undefined : 'is-inativo'}>{t.copiar.sucesso}</span>
        <span className={estado === 'erro' ? undefined : 'is-inativo'}>{t.copiar.falha}</span>
      </span>
    </button>
  );
}

/**
 * Mapa do Google com o ponto da ClinicCell. O endereço do mapa só entra no iframe quando a
 * caixa chega a uma tela de distância: o mapa pesa (centenas de KB do Google) e não deve
 * disputar a abertura da página. O loading="lazy" do navegador não basta: no computador, ou
 * no celular com 3G, o Chrome já carregaria o mapa na abertura.
 * Sem JavaScript a caixa não aparece (o botão "Abrir no Google Maps" continua ali).
 */
function GoogleMap() {
  const caixa = useRef(/** @type {HTMLDivElement | null} */ (null));
  const [perto, setPerto] = useState(false);

  useEffect(() => {
    const el = caixa.current;
    if (!el || perto) return undefined;
    const observer = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) setPerto(true);
      },
      { rootMargin: '100% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [perto]);

  return (
    <div className="location__map requires-js" ref={caixa}>
      <iframe
        className="location__map-frame"
        src={perto ? mapaIncorporadoUrl() : undefined}
        title={t.mapa.titulo}
        allowFullScreen
      />
    </div>
  );
}
