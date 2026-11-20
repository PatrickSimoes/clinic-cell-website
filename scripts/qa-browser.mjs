/**
 * QA no navegador (Chrome/Edge instalado na máquina) sobre o build de produção.
 *
 *   npm run build && npm run qa
 *
 * Confere em várias larguras de tela: overflow horizontal, erros de console/hidratação,
 * requisições a terceiros, acessibilidade (axe-core em vários estados da página), alvos de
 * toque, link "pular para o conteúdo", menu mobile (foco, Esc, âncoras, rotação do tablet e
 * do celular), links do WhatsApp, topo da página, "Copiar endereço", página 404, renderização
 * sem JavaScript, com o JavaScript bloqueado ou atrasado (foco e deslocamentos quando o React
 * assume), espaçamento de texto (WCAG 1.4.12, inclusive o foco com o header fixo e o botão
 * flutuante), texto ampliado, zoom de 400%, tradução automática do navegador, fontes aplicadas e
 * CLS com a fonte chegando atrasada.
 * A página em espanhol (/es/) passa pelas larguras de tela, pelo axe, pelos links do WhatsApp
 * (mensagem em espanhol, botões verdes) e pela troca de idioma nos dois sentidos.
 * Screenshots e relatório ficam em qa-output/ (ignorado pelo git).
 *
 * Navegador: defina CHROME_PATH se ele não for encontrado automaticamente.
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { chromium } from 'playwright-core';
import { AxeBuilder } from '@axe-core/playwright';
import { site } from '../src/config/site.js';
import { areasDeServico } from '../src/content/servicos.js';
import { textos } from '../src/content/textos.js';
import { textos as textosEs } from '../src/content/textos.es.js';
import { avaliarNoGoogleUrl } from '../src/lib/contact.js';
import { findBrowser } from './lib/browser.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'qa-output');

const VIEWPORTS = [
  { name: 'mobile-320', width: 320, height: 640, mobile: true },
  { name: 'mobile-360', width: 360, height: 780, mobile: true },
  { name: 'mobile-390', width: 390, height: 844, mobile: true },
  { name: 'mobile-430', width: 430, height: 932, mobile: true },
  { name: 'tablet-768', width: 768, height: 1024, mobile: true },
  { name: 'tablet-1024', width: 1024, height: 768, mobile: false },
  { name: 'desktop-1280', width: 1280, height: 800, mobile: false },
  { name: 'desktop-1440', width: 1440, height: 900, mobile: false },
  { name: 'desktop-1920', width: 1920, height: 1080, mobile: false },
];
const MOBILE = VIEWPORTS[2];
const DESKTOP = VIEWPORTS[6];
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
/** Espaçamento de texto do critério WCAG 1.4.12. */
const ESPACAMENTO_1_4_12 =
  '* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }';
/** Bundle JavaScript do site (para segurar ou bloquear o React). */
const BUNDLE_JS = /\/assets\/[^/]+\.js(\?.*)?$/;
/** Mapa do Google incorporado na Localização (src/lib/contact.js → mapaIncorporadoUrl). */
const MAPA_GOOGLE = /^https:\/\/maps\.google\.com\/maps\?/;
/** Mensagens do WhatsApp de cada idioma (gerais e das áreas): o cliente envia no idioma que lê. */
const MENSAGENS = {
  pt: new Set([...Object.values(site.whatsapp.mensagens), ...areasDeServico.map((a) => a.mensagemWhatsApp)]),
  es: new Set([...Object.values(site.whatsapp.mensagensEs), ...areasDeServico.map((a) => a.es.mensagemWhatsApp)]),
};

/** Espera dois quadros: dá tempo às reações à rolagem (ex.: o botão flutuante do WhatsApp). */
const doisQuadros = (page) => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

const results = [];
let failures = 0;
function record(ok, msg, detail) {
  results.push({ ok, msg, detail });
  if (!ok) failures++;
  console.log(`  ${ok ? '✓' : '✗'} ${msg}${!ok && detail ? ` — ${typeof detail === 'string' ? detail : JSON.stringify(detail)}` : ''}`);
}
const note = (msg) => console.log(`  · ${msg}`);

/**
 * Abre uma página coletando erros de console e requisições externas.
 * Com JavaScript, espera o React assumir a página (html.is-hydrated).
 */
async function openPage(
  browser,
  url,
  { width, height, mobile = false, javaScriptEnabled = true, reducedMotion, permissions, waitHydration = javaScriptEnabled } = {},
) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
    javaScriptEnabled,
    reducedMotion,
    locale: 'pt-BR',
  });
  if (permissions) await context.grantPermissions(permissions, { origin: new URL(url).origin });
  // Mapa do Google: no lugar dele, uma página local mínima. O QA não depende da rede nem do
  // conteúdo do Google (o axe auditaria o mapa deles), e a requisição continua registrada.
  await context.route(MAPA_GOOGLE, (route) =>
    route.fulfill({ contentType: 'text/html', body: '<!doctype html><html lang="pt-BR"><title>Mapa</title></html>' }),
  );
  const page = await context.newPage();
  const errors = [];
  const external = [];
  const failed = [];
  const origin = new URL(url).origin;
  page.on('console', (m) => {
    // Erros, avisos de hidratação e o aviso do Chrome de foco dentro de aria-hidden.
    if (m.type() === 'error' || (m.type() === 'warning' && /hydrat|aria-hidden/i.test(m.text()))) errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('request', (r) => {
    if (!r.url().startsWith(origin) && !r.url().startsWith('data:')) external.push(r.url());
  });
  page.on('requestfailed', (r) => failed.push(`${r.url()} (${r.failure()?.errorText})`));
  page.on('response', (r) => {
    if (r.status() >= 400 && r.url().startsWith(origin)) failed.push(`${r.url()} (${r.status()})`);
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  if (waitHydration) {
    await page.waitForFunction(() => document.documentElement.classList.contains('is-hydrated'), null, { timeout: 15000 });
  }
  return { context, page, errors, external, failed };
}

/** Roda o axe e devolve as violações resumidas. */
async function axeViolations(page) {
  const axe = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  return {
    raw: axe,
    violations: axe.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
    })),
  };
}

/** Rola até o botão flutuante do WhatsApp aparecer (celular). */
async function mostrarBotaoFlutuante(page) {
  await page.evaluate(() => document.querySelector('#sobre')?.scrollIntoView());
  await page.waitForFunction(() => document.querySelector('.whatsapp-fab')?.dataset.visible === 'true', null, { timeout: 5000 });
  await page.waitForTimeout(300);
}

async function main() {
  await rm(out, { recursive: true, force: true });
  await mkdir(path.join(out, 'screens'), { recursive: true });

  const server = await preview({ preview: { port: 4317, strictPort: false, open: false }, logLevel: 'error' });
  const baseUrl = server.resolvedUrls?.local[0];
  if (!baseUrl) throw new Error('Servidor de prévia não iniciou.');
  const browser = await chromium.launch({ executablePath: findBrowser() });
  console.log(`QA em ${baseUrl}\n`);

  try {
    // 1. Larguras de tela ------------------------------------------------------
    console.log('Larguras de tela');
    for (const vp of VIEWPORTS) {
      const { context, page, errors, external, failed } = await openPage(browser, baseUrl, vp);
      // Compara com a largura configurada: no celular emulado, a viewport de layout cresce
      // quando algo transborda, e window.innerWidth esconderia o problema.
      const overflow = await page.evaluate((width) => {
        const doc = document.documentElement;
        if (doc.scrollWidth <= width) return null;
        const culprits = [...document.querySelectorAll('body *')]
          .filter((el) => el.getBoundingClientRect().right > width + 1)
          .slice(0, 5)
          .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`);
        return { scrollWidth: doc.scrollWidth, culprits };
      }, vp.width);
      record(!overflow, `${vp.name}: sem rolagem horizontal`, overflow);
      record(errors.length === 0, `${vp.name}: sem erros de console/hidratação`, errors.slice(0, 3));
      record(failed.length === 0, `${vp.name}: sem requisições com falha`, failed.slice(0, 3));
      record(external.length === 0, `${vp.name}: nenhuma requisição a terceiros`, external.slice(0, 3));
      await page.screenshot({ path: path.join(out, 'screens', `${vp.name}.png`), fullPage: true });
      await context.close();
    }

    // 2. Acessibilidade (axe-core) -------------------------------------------
    console.log('\nAcessibilidade (axe-core, WCAG 2.2 AA + boas práticas)');
    for (const vp of [MOBILE, DESKTOP]) {
      const { context, page } = await openPage(browser, baseUrl, vp);
      const { raw, violations } = await axeViolations(page);
      record(violations.length === 0, `${vp.name}: 0 violações axe (topo da página)`, violations);
      await writeFile(path.join(out, `axe-${vp.name}.json`), JSON.stringify(raw, null, 2));
      await context.close();
    }
    {
      // Estados que só existem depois de interagir: botão flutuante visível, menu aberto, endereço copiado.
      const { context, page, errors } = await openPage(browser, baseUrl, {
        ...MOBILE,
        reducedMotion: 'reduce',
        permissions: ['clipboard-read', 'clipboard-write'],
      });
      const axeState = async (label) => {
        const { violations } = await axeViolations(page);
        record(violations.length === 0, `${MOBILE.name}: 0 violações axe ${label}`, violations);
      };
      await mostrarBotaoFlutuante(page);
      await axeState('com o botão flutuante do WhatsApp visível');
      await page.locator('header button[aria-controls]').click();
      await page.waitForTimeout(300);
      await axeState('com o menu aberto');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);

      // "Copiar endereço": região de anúncio sempre presente; cópia repetida é anunciada de novo;
      // nem a confirmação nem a volta do rótulo (4 s depois, sem toque) deslocam a página.
      const status = page.locator('.location__status');
      record(await status.evaluate((el) => getComputedStyle(el).display !== 'none'),
        '"Copiar endereço": região de anúncio já existe antes do clique');
      const copy = page.locator('.location__more button');
      await copy.scrollIntoViewIfNeeded();
      const posicoes = () => page.evaluate(() => {
        const caixa = (sel) => document.querySelector(sel)?.getBoundingClientRect();
        return {
          mapa: Math.round(caixa('.location__map').top + window.scrollY),
          waze: Math.round(caixa('.location__more a').left),
          botao: Math.round(caixa('.location__more button').width),
        };
      });
      const antes = await posicoes();
      await copy.click();
      await page.waitForFunction(() => (document.querySelector('.location__status')?.textContent ?? '').trim().length > 0);
      record(/copiado/i.test(await status.textContent()), '"Copiar endereço" confirma a cópia', await status.textContent());
      record(/copiado/i.test(await copy.innerText()), 'botão mostra "Copiado"', await copy.innerText());
      await page.evaluate(() => {
        window.__statusAdded = 0;
        new MutationObserver((records) => {
          for (const r of records) window.__statusAdded += r.addedNodes.length;
        }).observe(document.querySelector('.location__status'), { childList: true, subtree: true });
      });
      await copy.click();
      const segundoClique = Date.now();
      await page.waitForTimeout(400);
      const added = await page.evaluate(() => window.__statusAdded);
      record(added >= 1, 'segunda cópia é anunciada de novo (mensagem nova na região)', added);
      const confirmado = await posicoes();
      await axeState('depois do "Copiar endereço"');
      await page.waitForTimeout(Math.max(0, 4400 - (Date.now() - segundoClique)));
      const voltou = await posicoes();
      record(/copiar endere/i.test(await copy.innerText()), 'rótulo volta a "Copiar endereço" depois de 4 s', await copy.innerText());
      record(JSON.stringify(antes) === JSON.stringify(confirmado) && JSON.stringify(antes) === JSON.stringify(voltou),
        '"Copiar endereço" não desloca a página (confirmação e volta do rótulo)', { antes, confirmado, voltou });
      record(errors.length === 0, 'interações sem erros de console', errors.slice(0, 3));
      await context.close();
    }

    // 3. Celular: teclado, menu, alvos de toque, âncoras ---------------------
    console.log('\nInteração no celular (390x844)');
    {
      const { context, page } = await openPage(browser, baseUrl, MOBILE);

      // Pular para o conteúdo
      await page.keyboard.press('Tab');
      const first = await page.evaluate(() => ({
        text: document.activeElement?.textContent?.trim(),
        href: document.activeElement?.getAttribute('href'),
        visible: (() => {
          const r = document.activeElement?.getBoundingClientRect();
          return Boolean(r && r.width > 0 && r.height > 0 && r.top >= 0);
        })(),
      }));
      record(/pular/i.test(first.text ?? '') && first.visible, 'primeiro Tab foca o link "pular para o conteúdo" (visível)', first);
      await page.keyboard.press('Enter');
      const afterSkip = await page.evaluate(() => {
        const main = document.querySelector('main');
        return Boolean(main && (document.activeElement === main || main.contains(document.activeElement)));
      });
      record(afterSkip, '"pular para o conteúdo" leva o foco ao <main>');

      // Alvos de toque (WCAG 2.5.8: ≥ 24 px; recomendado ≥ 44 px fora de textos)
      const targets = await page.evaluate(() =>
        [...document.querySelectorAll('a[href], button')]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            return r.width > 0 && r.height > 0 && style.visibility !== 'hidden' && !el.closest('p, li p') && !el.classList.contains('skip-link');
          })
          .map((el) => {
            const r = el.getBoundingClientRect();
            return { label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40), w: Math.round(r.width), h: Math.round(r.height) };
          }),
      );
      const tooSmall = targets.filter((t) => t.w < 24 || t.h < 24);
      const belowComfort = targets.filter((t) => (t.w < 44 || t.h < 44) && !(t.w < 24 || t.h < 24));
      record(tooSmall.length === 0, `alvos de toque ≥ 24 px (${targets.length} conferidos)`, tooSmall);
      if (belowComfort.length) note(`abaixo de 44 px (aceitável em WCAG AA, revise): ${belowComfort.map((t) => `"${t.label}" ${t.w}x${t.h}`).join('; ')}`);

      // Menu mobile
      const toggle = page.locator('header button[aria-controls]').first();
      if ((await toggle.count()) && (await toggle.isVisible())) {
        await toggle.click();
        await page.waitForTimeout(350);
        const menuId = await toggle.getAttribute('aria-controls');
        const menu = page.locator(`[id="${menuId}"]`);
        record(await menu.isVisible(), 'menu mobile abre ao tocar no botão');
        record((await toggle.getAttribute('aria-expanded')) === 'true', 'botão do menu informa estado aberto (aria-expanded)');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(350);
        record(!(await menu.isVisible()), 'Esc fecha o menu');
        const focusBack = await page.evaluate((id) => document.activeElement?.getAttribute('aria-controls') === id, menuId);
        record(focusBack, 'foco volta ao botão do menu após fechar');

        // Navegação por âncora a partir do menu
        await toggle.click();
        await page.waitForTimeout(350);
        const links = menu.locator('a[href^="#"]');
        const n = await links.count();
        record(n >= 3, `menu tem links de navegação (${n})`);
        for (let i = 0; i < n; i++) {
          if (!(await menu.isVisible())) {
            await page.locator('header button[aria-controls]').click();
            await page.waitForTimeout(350);
          }
          const link = links.nth(i);
          const href = await link.getAttribute('href');
          await link.click();
          await page.waitForTimeout(900);
          const state = await page.evaluate((hash) => {
            const target = document.querySelector(hash);
            const header = document.querySelector('header');
            const headerBottom = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
            const top = target?.getBoundingClientRect().top ?? -1;
            return {
              exists: Boolean(target),
              top: Math.round(top),
              headerBottom: Math.round(headerBottom),
              hash: location.hash,
              focus: document.activeElement === target,
            };
          }, href);
          record(state.exists && state.hash === href && state.top >= state.headerBottom - 2 && state.top < 400,
            `menu → ${href}: rola até a seção, sem ficar sob o header`, state);
          record(!(await menu.isVisible()), `menu fecha após escolher ${href}`);
          record(state.focus, `menu → ${href}: o foco vai para a seção (leitores de tela acompanham)`, state);
        }
      } else {
        record(false, 'botão do menu mobile visível em 390 px');
      }
      await context.close();
    }
    {
      // Topo da página: a logo e o "Voltar ao topo" levam a scrollY 0 (o header não é fixo no celular).
      for (const vp of [MOBILE, { ...VIEWPORTS[4] }, DESKTOP]) {
        const { context, page } = await openPage(browser, baseUrl, { ...vp, reducedMotion: 'reduce' });
        await page.locator('.site-header__brand').click();
        await page.waitForTimeout(200);
        const afterLogo = await page.evaluate(() => Math.round(window.scrollY));
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await page.locator('.site-footer__top-link').click();
        await page.waitForTimeout(200);
        const afterTop = await page.evaluate(() => Math.round(window.scrollY));
        record(afterLogo === 0 && afterTop === 0, `${vp.name}: logo e "Voltar ao topo" levam ao topo (scrollY 0)`, { afterLogo, afterTop });
        await context.close();
      }
    }

    // 4. Desktop: navegação visível, sem botão de menu -----------------------
    console.log('\nDesktop (1280x800)');
    {
      const { context, page } = await openPage(browser, baseUrl, DESKTOP);
      const toggleVisible = await page.locator('header button[aria-controls]').first().isVisible().catch(() => false);
      record(!toggleVisible, 'botão de menu oculto no desktop');
      const navLinks = await page.locator('header nav a[href^="#"]').evaluateAll((els) => els.filter((e) => e.getBoundingClientRect().width > 0).length);
      record(navLinks >= 3, `links de navegação visíveis no header (${navLinks})`);
      await context.close();
    }
    {
      // Tablet girado com o menu aberto: o menu de celular fecha e o foco não se perde.
      const { context, page } = await openPage(browser, baseUrl, { width: 820, height: 1180 });
      await page.locator('header button[aria-controls]').click();
      await page.waitForTimeout(300);
      await page.setViewportSize({ width: 1180, height: 820 });
      await page.waitForTimeout(400);
      const state = await page.evaluate(() => ({
        menuHidden: document.getElementById('menu')?.hidden,
        locked: document.documentElement.classList.contains('is-menu-open'),
        focus: document.activeElement?.tagName,
      }));
      record(state.menuHidden && !state.locked && state.focus !== 'BODY',
        'tablet girado para o desktop com o menu aberto: menu fecha e o foco fica na página', state);
      await context.close();
    }
    {
      // O mesmo giro no meio da página: com o menu (tela cheia) aberto o navegador não ancora a
      // rolagem; ao fechar, a página volta ao trecho que a pessoa lia.
      const { context, page } = await openPage(browser, baseUrl, { width: 820, height: 1180, reducedMotion: 'reduce' });
      await page.evaluate(() => document.querySelector('#diferenciais')?.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await page.locator('header button[aria-controls]').click();
      await page.waitForTimeout(300);
      await page.setViewportSize({ width: 1180, height: 820 });
      await page.waitForTimeout(400);
      const st = await page.evaluate(() => ({
        topoDaSecao: Math.round(document.querySelector('#diferenciais').getBoundingClientRect().top),
        foco: document.activeElement === document.body ? 'BODY' : document.activeElement?.id || document.activeElement?.className,
      }));
      record(st.foco !== 'BODY' && st.topoDaSecao > -20 && st.topoDaSecao < 200,
        'tablet girado no meio da página com o menu aberto: a página continua no trecho lido', st);
      await context.close();
    }
    {
      const { context, page } = await openPage(browser, baseUrl, { width: 844, height: 390, mobile: true, reducedMotion: 'reduce' });
      // Salto direto (sem rolagem suave) por cima do botão do hero, que começa abaixo da dobra
      // no celular deitado: o botão nunca "entra" na tela, e mesmo assim o WhatsApp flutuante
      // precisa aparecer.
      await page.evaluate(() => {
        const contato = document.querySelector('#contato');
        window.scrollTo(0, contato.getBoundingClientRect().top + window.scrollY - window.innerHeight - 60);
      });
      const apareceu = await page
        .waitForFunction(() => document.querySelector('.whatsapp-fab')?.dataset.visible === 'true', null, { timeout: 3000 })
        .then(() => true, () => false);
      record(apareceu, 'celular deitado: o botão flutuante do WhatsApp aparece depois de um salto por cima do botão do hero');
      // Celular girado com o menu aberto pelo header fixo: o foco volta ao botão "Menu", sem a
      // página pular.
      await page.locator('header button[aria-controls]').click();
      await page.waitForTimeout(300);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(300);
      const antes = await page.evaluate(() => Math.round(window.scrollY));
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      const state = await page.evaluate(() => ({
        y: Math.round(window.scrollY),
        foco: document.activeElement === document.body ? 'BODY' : document.activeElement?.className,
      }));
      record(/site-header__menu/.test(state.foco ?? '') && Math.abs(state.y - antes) <= 1,
        'celular girado com o menu aberto: o foco volta ao botão "Menu" sem a página pular', { antes, ...state });
      await context.close();
    }

    // 5. Links do WhatsApp -----------------------------------------------------
    console.log('\nWhatsApp');
    {
      const { context, page } = await openPage(browser, baseUrl, MOBILE);
      const wa = await page.$$eval('a[href^="https://wa.me/"]', (els) => els.map((a) => ({
        href: a.href,
        target: a.target,
        rel: a.rel,
        text: (a.getAttribute('aria-label') || a.textContent || '').replace(/\s+/g, ' ').trim(),
        visible: a.getBoundingClientRect().width > 0,
      })));
      record(wa.length > 0, `${wa.length} links de WhatsApp`);
      for (const l of wa) {
        const u = new URL(l.href);
        const okLink = u.pathname === `/${site.whatsapp.numero}` && MENSAGENS.pt.has(u.searchParams.get('text') ?? '') && l.target === '_blank' && l.rel.includes('noopener');
        record(okLink, `"${l.text.slice(0, 50)}" → mensagem: "${(u.searchParams.get('text') ?? '').slice(0, 60)}…"`, l);
      }
      // Acesso ao WhatsApp em qualquer ponto da rolagem (celular)
      const positions = [0.25, 0.5, 0.75, 1];
      for (const p of positions) {
        await page.evaluate((f) => window.scrollTo(0, (document.documentElement.scrollHeight - window.innerHeight) * f), p);
        await page.waitForTimeout(300);
        const reachable = await page.evaluate(() =>
          [...document.querySelectorAll('a[href^="https://wa.me/"]')].some((a) => {
            const r = a.getBoundingClientRect();
            return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
          }),
        );
        record(reachable, `WhatsApp ao alcance com ${Math.round(p * 100)}% da página rolada`);
      }
      await context.close();
    }

    // 6. Sem JavaScript e com o JavaScript bloqueado ---------------------------
    console.log('\nSem JavaScript / JavaScript bloqueado');
    const fallbackState = () => {
      const visible = (el) =>
        Boolean(el) &&
        getComputedStyle(el).display !== 'none' &&
        getComputedStyle(el).visibility === 'visible' &&
        el.getBoundingClientRect().width > 0;
      return {
        hydrated: document.documentElement.classList.contains('is-hydrated'),
        button: visible(document.querySelector('button.site-header__menu')),
        link: visible(document.querySelector('a.site-header__menu--fallback')),
        copy: visible(document.querySelector('.requires-js')),
      };
    };
    {
      const { context, page } = await openPage(browser, baseUrl, { ...MOBILE, javaScriptEnabled: false });
      const h1 = await page.locator('h1').first().textContent().catch(() => null);
      record(Boolean(h1), 'conteúdo aparece sem JavaScript (HTML pré-renderizado)', h1);
      const waCount = await page.locator('a[href^="https://wa.me/"]').count();
      record(waCount > 0, `links de WhatsApp funcionam sem JavaScript (${waCount})`);
      const st = await page.evaluate(fallbackState);
      record(st.link && !st.button && !st.copy, 'sem JavaScript: link "Menu" visível; botão "Menu" e "Copiar endereço" ocultos', st);
      await page.screenshot({ path: path.join(out, 'screens', 'sem-javascript-390.png'), fullPage: false });
      await context.close();
    }
    {
      // Rede lenta ou script bloqueado: até o React assumir, nada pode parecer funcionar sem funcionar.
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
      const page = await context.newPage();
      await page.route(BUNDLE_JS, (route) => route.abort());
      await page.goto(baseUrl, { waitUntil: 'load' });
      const st = await page.evaluate(fallbackState);
      record(!st.hydrated && st.link && !st.button && !st.copy,
        'JavaScript bloqueado: link "Menu" visível; botão "Menu" e "Copiar endereço" ocultos', st);
      await page.locator('a.site-header__menu--fallback').click();
      await page.waitForTimeout(300);
      const nav = await page.evaluate(() => ({ hash: location.hash, foco: document.activeElement?.id }));
      record(nav.hash === '#rodape-navegacao' && nav.foco === 'rodape-navegacao',
        'link "Menu" leva à navegação do rodapé (com o foco)', nav);
      await context.close();
    }
    for (const largura of [320, 390]) {
      // Rede lenta: a página aparece antes do React. Quando ele assume, nada se desloca na
      // Localização (o "Copiar endereço" já tinha o lugar reservado).
      const context = await browser.newContext({ viewport: { width: largura, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
      const page = await context.newPage();
      let liberar = () => {};
      const segurar = new Promise((resolve) => {
        liberar = resolve;
      });
      await page.route(BUNDLE_JS, async (route) => {
        await segurar;
        await route.continue();
      });
      await page.addInitScript(() => {
        window.__shifts = [];
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) if (!e.hadRecentInput) window.__shifts.push({ t: e.startTime, v: e.value });
        }).observe({ type: 'layout-shift', buffered: true });
      });
      await page.goto(baseUrl, { waitUntil: 'commit' });
      await page.waitForSelector('.location__more');
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => document.querySelector('.location__more')?.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForTimeout(300);
      const caixas = () => page.evaluate(() => ({
        waze: JSON.stringify(document.querySelector('.location__more a')?.getBoundingClientRect()),
        mapa: Math.round(document.querySelector('.location__map')?.getBoundingClientRect().top ?? -1),
      }));
      const t0 = await page.evaluate(() => performance.now());
      const antes = await caixas();
      liberar();
      await page.waitForFunction(() => document.documentElement.classList.contains('is-hydrated'), null, { timeout: 15000 });
      // As entradas de layout-shift chegam ao observador com atraso: espera antes de somar.
      await page.waitForTimeout(1200);
      await doisQuadros(page);
      const depois = await caixas();
      const cls = await page.evaluate((t) => window.__shifts.filter((s) => s.t > t).reduce((soma, s) => soma + s.v, 0), t0);
      record(antes.waze === depois.waze && antes.mapa === depois.mapa && cls < 0.001,
        `${largura} px: o React assume a página sem deslocar a Localização (CLS ${cls.toFixed(4)})`, { antes, depois });
      await context.close();
    }
    {
      // Foco do teclado no link "Menu" antes do React: quando ele assume, o foco passa ao botão.
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
      const page = await context.newPage();
      let liberar = () => {};
      const segurar = new Promise((resolve) => {
        liberar = resolve;
      });
      await page.route(BUNDLE_JS, async (route) => {
        await segurar;
        await route.continue();
      });
      await page.goto(baseUrl, { waitUntil: 'commit' });
      await page.waitForSelector('a.site-header__menu--fallback');
      let noLink = false;
      for (let i = 0; i < 6 && !noLink; i++) {
        await page.keyboard.press('Tab');
        noLink = await page.evaluate(() => document.activeElement?.matches('a.site-header__menu--fallback') ?? false);
      }
      liberar();
      await page.waitForFunction(() => document.documentElement.classList.contains('is-hydrated'), null, { timeout: 15000 });
      await page.waitForTimeout(200);
      const foco = await page.evaluate(() => ({
        botao: document.activeElement?.matches('button.site-header__menu') ?? false,
        visivel: document.activeElement?.matches(':focus-visible') ?? false,
      }));
      record(noLink && foco.botao && foco.visivel, 'foco no link "Menu" passa ao botão quando o React assume a página', { noLink, ...foco });
      await context.close();
    }

    // 7. Movimento reduzido -----------------------------------------------------
    console.log('\nMovimento reduzido');
    {
      const { context, page } = await openPage(browser, baseUrl, { ...MOBILE, reducedMotion: 'reduce' });
      const behavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
      record(behavior !== 'smooth', 'rolagem suave desativada com prefers-reduced-motion', behavior);
      await context.close();
    }

    // 8. Texto: espaçamento ampliado, fonte ampliada, zoom de 400% -------------
    console.log('\nTexto ampliado e zoom');
    for (const vp of [VIEWPORTS[0], MOBILE, DESKTOP]) {
      // WCAG 1.4.12: nada pode ser cortado ou sobreposto com o espaçamento de texto ampliado.
      const { context, page } = await openPage(browser, baseUrl, vp);
      await page.addStyleTag({ content: ESPACAMENTO_1_4_12 });
      await page.waitForTimeout(200);
      const r = await page.evaluate((width) => {
        const year = document.querySelector('.about__year')?.getBoundingClientRect();
        const text = document.querySelector('.about__text')?.getBoundingClientRect();
        const overlap = Boolean(year && text && !(year.right <= text.left || year.left >= text.right || year.bottom <= text.top || year.top >= text.bottom));
        return { scrollWidth: document.documentElement.scrollWidth, width, overlap };
      }, vp.width);
      record(r.scrollWidth <= vp.width && !r.overlap, `${vp.name}: espaçamento de texto ampliado (1.4.12) sem corte nem sobreposição`, r);
      await context.close();
    }
    {
      // Com o espaçamento 1.4.12 em 320 px, Tab e Shift+Tab pela página inteira: nenhum foco pode
      // ficar todo escondido atrás do header fixo, do botão flutuante ou abaixo da janela (2.4.11).
      const { context, page } = await openPage(browser, baseUrl, { ...VIEWPORTS[0], reducedMotion: 'reduce' });
      await page.addStyleTag({ content: ESPACAMENTO_1_4_12 });
      await page.waitForTimeout(200);
      const escondidos = [];
      let paradas = 0;
      let comBotao = 0;
      for (const tecla of ['Tab', 'Shift+Tab']) {
        for (let i = 0; i < 150; i++) {
          await page.keyboard.press(tecla);
          await doisQuadros(page);
          const st = await page.evaluate((volta) => {
            const el = document.activeElement;
            if (!el || el === document.body) return { fim: true };
            const fab = document.querySelector('.whatsapp-fab');
            const header = document.querySelector('.site-header');
            const r = el.getBoundingClientRect();
            const f = fab.getBoundingClientRect();
            const h = header.getBoundingClientRect();
            const botao = fab.dataset.visible === 'true' && !fab.contains(el);
            const dentro = (a, b) => a.top >= b.top && a.bottom <= b.bottom && a.left >= b.left && a.right <= b.right;
            // Quem está por cima no centro do elemento (o "pular para o conteúdo" fica sobre o header).
            const noCentro = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
            const porCima = Boolean(noCentro && (noCentro === el || el.contains(noCentro)));
            const coberto =
              r.bottom <= 0 ||
              r.top >= window.innerHeight ||
              (!porCima && ((botao && dentro(r, f)) || (!header.contains(el) && r.bottom <= h.bottom)));
            return {
              fim: volta ? Boolean(el.closest('.site-header')) : Boolean(el.closest('.site-footer__bottom')),
              botao,
              coberto,
              alvo: (el.getAttribute('aria-label') || el.textContent || el.tagName).replace(/\s+/g, ' ').trim().slice(0, 40),
              topo: Math.round(r.top),
            };
          }, tecla === 'Shift+Tab');
          if (st.fim) break;
          paradas++;
          if (st.botao) comBotao++;
          if (st.coberto) escondidos.push({ tecla, ...st });
        }
      }
      record(comBotao > 0 && escondidos.length === 0,
        `320 px com espaçamento 1.4.12: nenhum foco escondido pelo header fixo ou pelo botão flutuante (${paradas} paradas, ${comBotao} com o botão)`,
        escondidos.slice(0, 3));
      await context.close();
    }
    {
      // Fonte padrão do navegador em 24 px ("Muito grande"): o botão flutuante não sai da tela.
      const { context, page } = await openPage(browser, baseUrl, { ...MOBILE, reducedMotion: 'reduce' });
      const cdp = await context.newCDPSession(page);
      await cdp.send('Page.setFontSizes', { fontSizes: { standard: 24, fixed: 20 } });
      await page.waitForTimeout(300);
      await mostrarBotaoFlutuante(page);
      const b = await page.evaluate(() => {
        const r = document.querySelector('.whatsapp-fab__link').getBoundingClientRect();
        return { left: Math.round(r.left), right: Math.round(r.right), top: Math.round(r.top), bottom: Math.round(r.bottom) };
      });
      record(b.left >= 0 && b.right <= MOBILE.width && b.bottom <= MOBILE.height + 1,
        'fonte do navegador em 24 px: botão flutuante do WhatsApp inteiro na tela', b);
      await context.close();
    }
    for (const [largura, fonte] of [[1280, 20], [1280, 32], [1100, 24]]) {
      // Fonte padrão do navegador ampliada no computador: os pontos de quebra (em em) acompanham
      // a fonte, e a página passa ao layout de celular em vez de transbordar ou espremer a logo.
      const { context, page } = await openPage(browser, baseUrl, { width: largura, height: 800 });
      const cdp = await context.newCDPSession(page);
      await cdp.send('Page.setFontSizes', { fontSizes: { standard: fonte, fixed: Math.round(fonte * 0.8125) } });
      await page.waitForTimeout(300);
      const st = await page.evaluate(() => {
        const img = document.querySelector('.site-header__logo');
        const r = img.getBoundingClientRect();
        return {
          scrollWidth: document.documentElement.scrollWidth,
          botaoMenu: getComputedStyle(document.querySelector('button.site-header__menu')).display !== 'none',
          logo: Math.round(r.width),
          proporcao: +(r.width / r.height / (img.naturalWidth / img.naturalHeight)).toFixed(3),
        };
      });
      const celular = largura < 64 * fonte;
      record(st.scrollWidth <= largura && st.botaoMenu === celular && st.logo >= 70 && Math.abs(st.proporcao - 1) < 0.02,
        `${largura} px com fonte do navegador em ${fonte} px: layout de ${celular ? 'celular' : 'desktop'}, sem transbordo, logo inteira`, st);
      await context.close();
    }
    {
      // 1280x800 com zoom de 400% = 320x200: header fixo e botão flutuante tomariam a tela.
      const { context, page } = await openPage(browser, baseUrl, { width: 320, height: 200 });
      await page.evaluate(() => document.querySelector('#sobre')?.scrollIntoView());
      await page.waitForTimeout(300);
      const st = await page.evaluate(() => ({
        botao: getComputedStyle(document.querySelector('.whatsapp-fab')).display,
        header: getComputedStyle(document.querySelector('.site-header')).position,
      }));
      record(st.botao === 'none' && st.header !== 'sticky',
        '320x200 (zoom de 400%): header rola com a página e o botão flutuante some', st);
      await context.close();
    }

    // 9. Robustez ---------------------------------------------------------------
    console.log('\nRobustez');
    {
      // Tradução automática do navegador: os nós de texto viram <font>. Tocar em
      // "Copiar endereço" não pode derrubar o React (a página ficaria em branco).
      const { context, page, errors } = await openPage(browser, baseUrl, {
        ...MOBILE,
        permissions: ['clipboard-read', 'clipboard-write'],
      });
      await page.evaluate(() => {
        const walker = document.createTreeWalker(document.getElementById('root'), NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) nodes.push(walker.currentNode);
        for (const node of nodes) {
          const outer = document.createElement('font');
          const inner = document.createElement('font');
          inner.textContent = node.nodeValue;
          outer.append(inner);
          node.replaceWith(outer);
        }
      });
      const copy = page.locator('.location__more button');
      await copy.scrollIntoViewIfNeeded();
      await copy.click();
      await page.waitForTimeout(500);
      const alive = await page.evaluate(() => ({
        rootChildren: document.getElementById('root')?.childElementCount ?? 0,
        whatsapp: document.querySelectorAll('a[href^="https://wa.me/"]').length,
      }));
      record(alive.rootChildren > 0 && alive.whatsapp > 0 && errors.length === 0,
        'página traduzida pelo navegador: "Copiar endereço" funciona sem quebrar a página', { ...alive, errors: errors.slice(0, 2) });
      await context.close();
    }
    {
      // Cópia que falha (área de transferência bloqueada): o endereço aparece por escrito e à
      // vista (o botão flutuante do WhatsApp não a cobre), e o botão não muda de largura.
      const { context, page } = await openPage(browser, baseUrl, { ...MOBILE, reducedMotion: 'reduce' });
      await page.evaluate(() => {
        navigator.clipboard.writeText = () => Promise.reject(new Error('bloqueado'));
        document.execCommand = () => false;
      });
      const copy = page.locator('.location__more button');
      // Botão de copiar perto da borda de baixo: a mensagem, que aparece embaixo dele, ficaria escondida.
      await page.evaluate(() => {
        const b = document.querySelector('.location__more button').getBoundingClientRect();
        window.scrollBy({ top: b.bottom - (window.innerHeight - 90), behavior: 'instant' });
      });
      await page.waitForFunction(() => document.querySelector('.whatsapp-fab')?.dataset.visible === 'true', null, { timeout: 3000 }).catch(() => {});
      const larguraAntes = await copy.evaluate((b) => Math.round(b.getBoundingClientRect().width));
      await copy.click();
      await page.waitForSelector('.location__status-texto', { timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(300);
      const st = await page.evaluate(() => {
        const msg = document.querySelector('.location__status-texto');
        const botao = document.querySelector('.whatsapp-fab');
        const r = msg?.getBoundingClientRect();
        const limite = botao?.dataset.visible === 'true' ? botao.getBoundingClientRect().top : window.innerHeight;
        return {
          mensagem: msg?.textContent ?? null,
          aVista: Boolean(r && r.top >= 0 && r.bottom <= limite),
          rotulo: document.querySelector('.location__more button').innerText,
          largura: Math.round(document.querySelector('.location__more button').getBoundingClientRect().width),
        };
      });
      record(/Anneliese/.test(st.mensagem ?? '') && st.aVista && /falha/i.test(st.rotulo) && st.largura === larguraAntes,
        '"Copiar endereço" com falha: endereço por escrito e à vista, botão com a mesma largura', { larguraAntes, ...st });
      await context.close();
    }
    for (const [vp, url] of [
      [MOBILE, baseUrl],
      [DESKTOP, baseUrl],
      [DESKTOP, `${baseUrl}404.html`],
      [MOBILE, `${baseUrl}es/`],
      [DESKTOP, `${baseUrl}es/`],
    ]) {
      // Todo botão ou link que abre o WhatsApp é verde: fundo verde nos botões, texto verde nos
      // links (o verde claro sobre o campo azul).
      const { context, page } = await openPage(browser, url, vp);
      const st = await page.evaluate(() => {
        const VERDES = ['rgb(0, 128, 105)', 'rgb(37, 211, 102)'];
        const links = [...document.querySelectorAll('a[href^="https://wa.me/"]')];
        const fora = links
          .filter((a) => {
            const c = getComputedStyle(a);
            return a.classList.contains('button') ? c.backgroundColor !== VERDES[0] : !VERDES.includes(c.color);
          })
          .map((a) => `${a.className}: ${a.textContent.trim().slice(0, 30)}`);
        return { total: links.length, fora };
      });
      record(st.total > 0 && st.fora.length === 0,
        `${vp.name}${url.endsWith('404.html') ? ' (404)' : url.endsWith('/es/') ? ' (espanhol)' : ''}: todos os ${st.total} botões e links do WhatsApp em verde`, st.fora.slice(0, 4));
      await context.close();
    }
    for (const vp of [MOBILE, DESKTOP]) {
      // Mapa do Google: com título, no ponto da ClinicCell, e só carrega quando a Localização chega
      // perto (nem na abertura, nem a duas telas de distância).
      const { context, page, external } = await openPage(browser, baseUrl, vp);
      const doMapa = () => external.filter((u) => MAPA_GOOGLE.test(u)).length;
      const noTopo = doMapa();
      await page.evaluate(() => {
        const r = document.querySelector('.location__map').getBoundingClientRect();
        window.scrollBy({ top: r.top - 2.5 * window.innerHeight, behavior: 'instant' });
      });
      await page.waitForTimeout(500);
      const longe = doMapa();
      const pedido = page.waitForRequest(MAPA_GOOGLE, { timeout: 5000 }).catch(() => null);
      await page.evaluate(() => document.querySelector('#localizacao').scrollIntoView({ behavior: 'instant' }));
      await pedido;
      await page.waitForTimeout(300);
      const quadro = await page.evaluate(() => {
        const f = document.querySelector('.location__map-frame');
        return f && { titulo: f.title, src: f.src, altura: Math.round(f.getBoundingClientRect().height) };
      });
      const carregou = doMapa();
      record(
        Boolean(quadro?.titulo) && /[?&]cid=\d+/.test(quadro.src) && quadro.altura >= 300 && noTopo === 0 && longe === 0 && carregou === 1,
        `${vp.name}: mapa do Google com título, no ponto da loja, carregado só perto da Localização`,
        { ...quadro, noTopo, longe, carregou },
      );
      await context.close();
    }
    {
      // Fontes web realmente aplicadas (nenhum texto caindo na fonte de reserva).
      for (const vp of [MOBILE, VIEWPORTS[7]]) {
        const { context, page } = await openPage(browser, baseUrl, vp);
        const cdp = await context.newCDPSession(page);
        await cdp.send('DOM.enable');
        await cdp.send('CSS.enable');
        const { root: doc } = await cdp.send('DOM.getDocument', { depth: -1 });
        const expected = [
          ['h1', /DM Sans/],
          ['.hero__lead', /DM Sans/],
          ['.diff__title', /DM Sans/],
          ['.site-footer__heading', /Red Hat Mono/],
        ];
        const wrong = [];
        for (const [selector, family] of expected) {
          const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: doc.nodeId, selector });
          const { fonts } = nodeId ? await cdp.send('CSS.getPlatformFontsForNode', { nodeId }) : { fonts: [] };
          if (!fonts.length || !fonts.every((f) => f.isCustomFont && family.test(f.familyName))) {
            wrong.push({ selector, fonts: fonts.map((f) => `${f.familyName}${f.isCustomFont ? '' : ' (sistema)'}`) });
          }
        }
        record(wrong.length === 0, `${vp.name}: textos com as fontes web (DM Sans e Red Hat Mono)`, wrong);
        await context.close();
      }
    }
    {
      // CLS com a fonte chegando 2,5 s depois (rede lenta): as medidas de linha não podem mudar na troca.
      for (const vp of [VIEWPORTS[4], DESKTOP]) {
        const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
        const page = await context.newPage();
        await page.route(/dm-sans-[\w-]+\.woff2$/, async (route) => {
          await new Promise((resolve) => setTimeout(resolve, 2500));
          await route.continue();
        });
        await page.addInitScript(() => {
          window.__cls = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__cls += entry.value;
          }).observe({ type: 'layout-shift', buffered: true });
        });
        await page.goto(baseUrl, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(500);
        const cls = await page.evaluate(() => window.__cls);
        // A fonte de reserva calibrada (src/styles/font-fallbacks.css) usa a Arial do sistema.
        // Sem ela (ex.: Linux do CI), a troca de fonte desloca o texto e o teste não se aplica.
        const temArial = await page.evaluate(() => new FontFace('qa-arial', 'local("Arial")').load().then(() => true, () => false));
        if (temArial) record(cls < 0.005, `${vp.name}: CLS ${cls.toFixed(4)} com a fonte chegando 2,5 s depois (< 0,005)`, cls);
        else note(`${vp.name}: Arial ausente neste sistema — CLS com fonte atrasada não avaliado (${cls.toFixed(4)})`);
        await context.close();
      }
    }

    // 10. Página em espanhol, troca de idioma e avaliações ----------------------
    console.log('\nVersão em espanhol (/es/) e troca de idioma');
    const urlEs = `${baseUrl}es/`;
    for (const vp of [VIEWPORTS[0], MOBILE, VIEWPORTS[4], VIEWPORTS[5], DESKTOP]) {
      const { context, page, errors, external, failed } = await openPage(browser, urlEs, vp);
      const st = await page.evaluate((width) => ({
        lang: document.documentElement.lang,
        h1: document.querySelector('h1')?.textContent.trim(),
        scrollWidth: document.documentElement.scrollWidth,
        largura: width,
      }), vp.width);
      record(st.lang === 'es' && st.h1 === textosEs.hero.titulo && st.scrollWidth <= vp.width,
        `${vp.name} (espanhol): página em espanhol, sem rolagem horizontal`, st);
      record(errors.length === 0, `${vp.name} (espanhol): sem erros de console/hidratação`, errors.slice(0, 3));
      record(failed.length === 0 && external.length === 0, `${vp.name} (espanhol): sem requisições com falha nem a terceiros`,
        [...failed, ...external].slice(0, 3));
      await page.screenshot({ path: path.join(out, 'screens', `es-${vp.name}.png`), fullPage: true });
      await context.close();
    }
    for (const vp of [MOBILE, DESKTOP]) {
      const { context, page } = await openPage(browser, urlEs, vp);
      const { violations } = await axeViolations(page);
      record(violations.length === 0, `${vp.name} (espanhol): 0 violações axe (topo da página)`, violations);
      await context.close();
    }
    {
      // Menu aberto e botão flutuante, em espanhol.
      const { context, page } = await openPage(browser, urlEs, { ...MOBILE, reducedMotion: 'reduce' });
      await mostrarBotaoFlutuante(page);
      let { violations } = await axeViolations(page);
      record(violations.length === 0, `${MOBILE.name} (espanhol): 0 violações axe com o botão flutuante visível`, violations);
      await page.locator('header button[aria-controls]').click();
      await page.waitForTimeout(300);
      ({ violations } = await axeViolations(page));
      record(violations.length === 0, `${MOBILE.name} (espanhol): 0 violações axe com o menu aberto`, violations);
      await context.close();
    }
    {
      // Todo link do WhatsApp da página em espanhol leva a mensagem em espanhol.
      const { context, page } = await openPage(browser, urlEs, MOBILE);
      const naPagina = await page.$$eval('a[href^="https://wa.me/"]', (els) => els.map((a) => new URL(a.href).searchParams.get('text') ?? ''));
      const fora = naPagina.filter((t) => !MENSAGENS.es.has(t));
      record(naPagina.length > 0 && fora.length === 0, `espanhol: os ${naPagina.length} links do WhatsApp com mensagem em espanhol`,
        fora.slice(0, 3).map((t) => t.slice(0, 60)));
      await context.close();
    }
    for (const vp of [VIEWPORTS[0], DESKTOP]) {
      // "ES" no header leva à página em espanhol, e "PT" de lá volta à em português.
      const { context, page } = await openPage(browser, baseUrl, vp);
      const paraEs = page.locator('header a[hreflang="es"]');
      const visivelEs = await paraEs.isVisible();
      await Promise.all([page.waitForURL(/\/es\/$/), paraEs.click()]);
      await page.waitForFunction(() => document.documentElement.classList.contains('is-hydrated'));
      const naEs = await page.evaluate(() => ({ lang: document.documentElement.lang, h1: document.querySelector('h1')?.textContent.trim() }));
      const paraPt = page.locator('header a[hreflang="pt-BR"]');
      const visivelPt = await paraPt.isVisible();
      await Promise.all([page.waitForURL((u) => !u.pathname.endsWith('/es/')), paraPt.click()]);
      const naPt = await page.evaluate(() => ({ lang: document.documentElement.lang, h1: document.querySelector('h1')?.textContent.trim() }));
      record(visivelEs && visivelPt && naEs.lang === 'es' && naEs.h1 === textosEs.hero.titulo && naPt.lang === 'pt-BR' && naPt.h1 === textos.hero.titulo,
        `${vp.name}: "ES" no header abre a página em espanhol e "PT" volta à em português`, { visivelEs, visivelPt, naEs, naPt });
      await context.close();
    }
    for (const url of [baseUrl, urlEs]) {
      // Header do computador numa linha: o botão do WhatsApp não quebra, nas larguras mais apertadas.
      for (const largura of [1024, 1100, 1280]) {
        const { context, page } = await openPage(browser, url, { width: largura, height: 800 });
        // O botão pequeno tem 44 px com uma linha de texto; com duas, passa de 55 px.
        const st = await page.evaluate(() => ({
          alturaDoBotao: Math.round(document.querySelector('.site-header__cta').getBoundingClientRect().height),
          scrollWidth: document.documentElement.scrollWidth,
        }));
        record(st.alturaDoBotao <= 48 && st.scrollWidth <= largura,
          `${largura} px${url === urlEs ? ' (espanhol)' : ''}: header numa linha, com o botão do WhatsApp sem quebrar`, st);
        await context.close();
      }
    }
    {
      // Avaliações: convite com o link de avaliação da loja no Google (nova aba, não é WhatsApp).
      const { context, page } = await openPage(browser, baseUrl, MOBILE);
      const st = await page.evaluate(() => {
        const secao = document.querySelector('#avaliacoes');
        const links = secao ? [...secao.querySelectorAll('a')].map((a) => ({ href: a.href, target: a.target, rel: a.rel })) : [];
        return { existe: Boolean(secao), links, noMenu: Boolean(document.querySelector('#menu a[href="#avaliacoes"]')) };
      });
      const link = st.links.find((l) => l.href === avaliarNoGoogleUrl());
      record(st.existe && st.noMenu && link?.target === '_blank' && link.rel.includes('noopener'),
        'Avaliações: seção no menu, com o link "Avaliar no Google" da loja (nova aba)', st);
      await context.close();
    }

    // 11. Página 404 --------------------------------------------------------------
    console.log('\nPágina 404');
    {
      const { context, page, errors } = await openPage(browser, `${baseUrl}404.html`, VIEWPORTS[7]);
      record((await page.locator('h1').count()) === 1, '404 renderiza um H1');
      record(errors.length === 0, '404 sem erros de console/hidratação', errors.slice(0, 3));
      const home = page.locator(`main a[href="${new URL(baseUrl).pathname}"]`).first();
      record((await home.count()) > 0, '404 tem link para a página inicial');
      record((await page.locator('.site-footer.has-spine, .site-footer__terminal').count()) === 0,
        '404 sem espinha nem terminal no rodapé (não há seções acima)');
      await page.screenshot({ path: path.join(out, 'screens', '404-1440.png'), fullPage: true });
      await context.close();
    }
    {
      const { context, page } = await openPage(browser, `${baseUrl}404.html`, { ...MOBILE, reducedMotion: 'reduce' });
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.locator('.site-footer__top-link').click();
      await page.waitForTimeout(200);
      const y = await page.evaluate(() => Math.round(window.scrollY));
      record(y === 0, '404: "Voltar ao topo" leva ao topo (scrollY 0)', y);
      await page.screenshot({ path: path.join(out, 'screens', '404-390.png'), fullPage: true });
      await context.close();
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.httpServer.close(resolve));
  }

  await writeFile(path.join(out, 'relatorio.json'), JSON.stringify(results, null, 2));
  console.log(`\n${failures ? `✗ ${failures} falha(s)` : '✓ Tudo certo'} — screenshots em qa-output/screens`);
  process.exit(failures ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
