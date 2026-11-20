import { useCallback, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { useIdioma } from '../lib/idioma.js';
import { Icon } from '../components/Icon.jsx';
import { StackedLabel } from '../components/StackedLabel.jsx';
import { WhatsAppLink } from '../components/WhatsAppLink.jsx';

/** O elemento está, ao menos em parte, dentro da janela? */
function naTela(element) {
  const r = element.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
}

/**
 * Botão fixo do WhatsApp (celular): barra de largura total na parte de baixo da tela, na zona
 * do polegar. Aparece quando o botão principal do hero sai da tela por cima; some no CTA final,
 * no rodapé e com o menu aberto. Renderiza oculto no HTML (sem JS, nunca aparece).
 * No desktop não existe: o header fixo já tem o WhatsApp.
 *
 * @param {object} props
 * @param {boolean} props.menuOpen
 * @param {boolean} props.inert
 */
export function FloatingWhatsApp({ menuOpen, inert }) {
  const { textos, mensagens } = useIdioma();
  const fabRef = useRef(/** @type {HTMLElement | null} */ (null));
  const menuOpenRef = useRef(menuOpen);
  // Botão do hero, #contato e rodapé: buscados uma vez (no efeito abaixo). O update() roda a
  // cada quadro de rolagem, então nada de buscas no DOM nem de escrita repetida nele.
  const alvos = useRef(/** @type {{ heroCta: Element, fins: Element[] } | null} */ (null));

  // Decide pela posição atual dos elementos (e não pelo último aviso dos observadores): um
  // salto por âncora pode passar por cima do botão do hero sem que ele "entre" ou "saia" da tela.
  const update = useCallback(() => {
    const fab = fabRef.current;
    const a = alvos.current;
    if (!fab || !a) return;
    const visivel = !menuOpenRef.current && a.heroCta.getBoundingClientRect().bottom <= 0 && !a.fins.some(naTela);
    const valor = String(visivel);
    if (fab.dataset.visible !== valor) fab.dataset.visible = valor;
  }, []);

  useEffect(() => {
    const heroCta = document.querySelector('[data-hero-cta]');
    if (!heroCta) return undefined;
    alvos.current = { heroCta, fins: [...document.querySelectorAll('#contato, .site-footer')] };

    // Rolagem e mudança de tamanho: no máximo uma conta por quadro.
    let quadro = 0;
    const agendar = () => {
      if (!quadro) {
        quadro = requestAnimationFrame(() => {
          quadro = 0;
          update();
        });
      }
    };
    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar);

    // Mudanças de posição sem rolagem (ex.: a fonte web chegando) também reavaliam.
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(update) : null;
    [heroCta, ...alvos.current.fins].forEach((el) => observer?.observe(el));
    update();

    return () => {
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', agendar);
      cancelAnimationFrame(quadro);
      observer?.disconnect();
    };
  }, [update]);

  // A faixa que a barra ocupa embaixo (altura com a área segura) vira a folga de rolagem da
  // página: âncoras e foco não param atrás dela.
  // Só grava quando a folga do CSS (--fab-h, o caso comum) não serve: a primeira
  // mudança no style do <html> faz o navegador recalcular o estilo da página inteira.
  useEffect(() => {
    const fab = fabRef.current;
    if (!fab || !('ResizeObserver' in window)) return undefined;
    const root = document.documentElement;
    const medir = () => {
      const altura = fab.offsetHeight;
      if (altura === 0) {
        // Sem botão (desktop, tela muito baixa): a regra do CSS volta a valer.
        if (root.style.scrollPaddingBottom) root.style.scrollPaddingBottom = '';
        return;
      }
      const estilo = getComputedStyle(root);
      // altura da barra + distância da borda de baixo (0) + --space-4 (1rem)
      const folga = Math.ceil(altura + parseFloat(getComputedStyle(fab).bottom) + parseFloat(estilo.fontSize));
      if (Math.abs(parseFloat(estilo.scrollPaddingBottom) - folga) >= 1) {
        root.style.scrollPaddingBottom = `${folga}px`;
      }
    };
    const observer = new ResizeObserver(medir);
    observer.observe(fab);
    window.addEventListener('orientationchange', medir); // a área segura muda ao girar
    return () => {
      observer.disconnect();
      window.removeEventListener('orientationchange', medir);
      if (root.style.scrollPaddingBottom) root.style.scrollPaddingBottom = '';
    };
  }, []);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
    update();
  }, [menuOpen, update]);

  return (
    <aside className="whatsapp-fab" ref={fabRef} inert={inert} aria-label={textos.flutuante.aria}>
      <WhatsAppLink
        className="button button--whatsapp button--block whatsapp-fab__link"
        mensagem={mensagens.orcamento}
      >
        <Icon icon={MessageCircle} />
        <StackedLabel sub={textos.global.peloWhatsApp}>{textos.flutuante.botao}</StackedLabel>
      </WhatsAppLink>
    </aside>
  );
}
