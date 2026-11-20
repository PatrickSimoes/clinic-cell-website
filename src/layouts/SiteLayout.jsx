import { useCallback, useEffect, useRef, useState } from 'react';
import { textos } from '../content/textos.js';
import { FloatingWhatsApp } from '../sections/FloatingWhatsApp.jsx';
import { Footer } from '../sections/Footer.jsx';
import { Header } from '../sections/Header.jsx';
import { MobileMenu } from '../sections/MobileMenu.jsx';

const BASE = import.meta.env.BASE_URL;

/**
 * Âncora do topo da página. A logo (na home) e o "Voltar ao topo" levam para cá: com ela a
 * rolagem vai a 0 em qualquer largura (uma âncora no hero ou no <main> pararia abaixo do
 * header fixo, ou com o header rolando junto em telas muito baixas).
 */
const TOPO = 'topo';

/**
 * A partir desta largura vale o layout de desktop (sem botão fixo do WhatsApp nem menu de celular).
 * Em em, como os pontos de quebra do CSS: 64em = 1024 px com a fonte padrão do navegador.
 */
const DESKTOP = '(min-width: 64em)';

/**
 * Elemento que pode receber o foco agora: exibido e visível (um elemento com
 * visibility: hidden continua com caixa, e o focus() nele falharia em silêncio).
 */
function podeFocar(element) {
  return Boolean(
    element?.isConnected && element.getClientRects().length > 0 && getComputedStyle(element).visibility === 'visible',
  );
}

/** O elemento aparece, ao menos em parte, na janela? */
function naTela(element) {
  const r = element.getBoundingClientRect();
  return r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
}

/**
 * Lugar de leitura ao abrir o menu: o primeiro trecho (seção ou rodapé) que chega abaixo do
 * topo da janela. Com o menu (tela cheia, fixo) aberto, o Chrome não ancora a rolagem: se o
 * aparelho girar, a página fica no mesmo scrollY com o layout novo, centenas de px fora do lugar.
 */
function lugarDeLeitura() {
  const el = [...document.querySelectorAll('main > section, .site-footer')].find(
    (e) => e.getBoundingClientRect().bottom > 0,
  );
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { el, top: r.top, height: r.height };
}

/** Volta ao lugar de leitura depois do giro: a mesma fração do trecho já passada. */
function voltarAoLugar(lugar) {
  if (!lugar?.el.isConnected) return;
  const r = lugar.el.getBoundingClientRect();
  const alvo = lugar.top >= 0 || !lugar.height ? lugar.top : (lugar.top * r.height) / lugar.height;
  const delta = Math.round(r.top - alvo);
  if (delta) window.scrollBy({ top: delta, behavior: 'instant' });
}

/**
 * Estrutura comum das páginas: link "pular para o conteúdo", header fixo, conteúdo, rodapé,
 * botão fixo do WhatsApp (celular) e menu (diálogo).
 *
 * Controla o menu: com ele aberto, o resto da página fica `inert` (fora do foco e dos
 * leitores de tela); ao fechar, o foco volta para o botão que o abriu.
 *
 * @param {object} props
 * @param {'home' | '404'} props.page  Na 404 os links de seção apontam para a página inicial.
 * @param {import('react').ReactNode} props.children
 */
export function SiteLayout({ page, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const opener = useRef(/** @type {HTMLElement | null} */ (null));
  const lugar = useRef(/** @type {ReturnType<typeof lugarDeLeitura>} */ (null));
  const restoreFocus = useRef(true);

  const isHome = page === 'home';
  const hrefFor = useCallback((id) => (isHome ? `#${id}` : `${BASE}#${id}`), [isHome]);

  const openMenu = useCallback((event) => {
    opener.current = event.currentTarget;
    lugar.current = lugarDeLeitura();
    restoreFocus.current = true;
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(({ restoreFocus: restore = true } = {}) => {
    restoreFocus.current = restore;
    setMenuOpen(false);
  }, []);

  // O React assumiu a página: a partir daqui o botão "Menu" e o "Copiar endereço" funcionam.
  // Antes disso (rede lenta, JS bloqueado ou com erro), o CSS mostra o link "Menu" para a
  // navegação do rodapé, que funciona sem JavaScript. A classe fica no <html>, fora do #root,
  // então não interfere na hidratação.
  // Quem estava com o foco no link "Menu" (teclado, antes da hidratação) passa para o botão,
  // que ocupa o mesmo lugar: sem isso o foco cairia no <body> quando o link some.
  useEffect(() => {
    const noLinkDeReserva = document.activeElement?.matches?.('.site-header__menu--fallback');
    document.documentElement.classList.add('is-hydrated');
    if (noLinkDeReserva) document.querySelector('button.site-header__menu')?.focus({ preventScroll: true });
  }, []);

  // Trava a rolagem da página com o menu aberto e devolve o foco ao fechar.
  useEffect(() => {
    document.documentElement.classList.toggle('is-menu-open', menuOpen);
    if (!menuOpen && restoreFocus.current && opener.current) {
      if (podeFocar(opener.current)) {
        opener.current.focus();
      } else {
        // Quem abriu sumiu (ex.: o aparelho girou e o layout virou desktop, e o botão "Menu"
        // do header deixou de existir). Se o layout virou desktop, a página volta antes ao lugar de
        // leitura. O foco vai, sem rolar, para a seção na tela (de preferência a que começa
        // nela: o próximo Tab cai num link visível); sem nenhuma, para a marca.
        if (window.matchMedia(DESKTOP).matches) voltarAoLugar(lugar.current);
        const secoes = [...document.querySelectorAll('main section[tabindex="-1"], #rodape-navegacao')].filter(naTela);
        const alvo =
          secoes.find((el) => el.getBoundingClientRect().top >= 0) ??
          secoes[0] ??
          document.querySelector('.site-header__brand');
        alvo?.focus({ preventScroll: true });
      }
    }
    if (!menuOpen) {
      opener.current = null;
      lugar.current = null;
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    // Esc fecha o menu.
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', onKeyDown);

    // No Chrome do Android, o gesto/botão Voltar vira um pedido de fechamento:
    // fecha o menu em vez de tirar a pessoa do site. (Esc também passa por aqui.)
    let watcher = null;
    if ('CloseWatcher' in window) {
      try {
        watcher = new window.CloseWatcher();
        watcher.onclose = () => closeMenu();
      } catch {
        watcher = null;
      }
    }

    // Girou o tablet (ou redimensionou) para o layout de desktop: o menu de celular fecha.
    const desktop = window.matchMedia(DESKTOP);
    const onDesktop = (event) => {
      if (event.matches) closeMenu();
    };
    desktop.addEventListener('change', onDesktop);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      watcher?.destroy();
      desktop.removeEventListener('change', onDesktop);
    };
  }, [menuOpen, closeMenu]);

  return (
    <>
      <span id={TOPO} />
      <a className="skip-link" href="#conteudo" inert={menuOpen}>
        {textos.global.pularParaConteudo}
      </a>
      <Header
        homeHref={isHome ? `#${TOPO}` : BASE}
        hrefFor={hrefFor}
        menuOpen={menuOpen}
        onOpenMenu={openMenu}
        inert={menuOpen}
      />
      <main id="conteudo" tabIndex={-1} inert={menuOpen}>
        {children}
      </main>
      <Footer hrefFor={hrefFor} topHref={`#${TOPO}`} spine={isHome} inert={menuOpen} />
      <FloatingWhatsApp menuOpen={menuOpen} inert={menuOpen} />
      <MobileMenu open={menuOpen} onClose={closeMenu} hrefFor={hrefFor} />
    </>
  );
}
