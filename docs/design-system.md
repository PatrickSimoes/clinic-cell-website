# ClinicCell · Design System final: "Folha técnica"

**Onde está implementado**
- Tokens (cores, tipografia, espaços, camadas, movimento): `src/styles/tokens.css`.
- Motivo de circuito: `src/styles/circuit.css` e os arquivos de cada seção em `src/styles/sections/`.
- Componentes React: `src/components/` e `src/sections/`.
- Ilustrações das áreas de serviço: `src/assets/servicos/`.
- Textos finais: `src/content/textos.js`, `src/content/servicos.js` e `src/config/site.js`, que são a fonte de verdade dos textos e prevalecem sobre exemplos deste documento.

Este documento resultou de um processo de direção de arte com três propostas independentes (editorial suíço, clínica de precisão e empresa de bairro), avaliadas por três critérios: marca; UX mobile e acessibilidade; viabilidade, SEO e honestidade de conteúdo. A versão final parte da proposta editorial e incorpora as melhores ideias das outras duas.

---

## 0. Base e enxertos

**Base: "editorial" (Folha técnica).** Ficou com média de 8,4 e o 1º lugar no juiz de marca. Foi mantido:
- papel branco com só dois planos azuis (hero e CTA);
- espinha de circuito ligando as seções;
- "2011" como o maior elemento da página;
- serviços em linhas de tabela, sem cards;
- header fixo com Menu e, no celular, barra fixa do WhatsApp na parte de baixo da tela;
- menu em diálogo modal.

**Enxertos de "clinica":**
- os planos azuis usam o centro medido do campo da logo (#003E87);
- régua com um traço por ano;
- a cruz sólida do símbolo na junção da espinha com o barramento;
- tabela de serviços em largura total no desktop;
- H2 com o termo local exato;
- Ficha com container query;
- nota "Abre o WhatsApp com uma mensagem pronta.";
- navegação sem JS.

**Enxertos de "local":**
- "Seu caso não está na lista?";
- estado vazio perene;
- "Modelo do aparelho:" nas mensagens;
- numeral "Nº 2884";
- kit Como chegar (rota, Waze, copiar);
- corpo de 17 px no celular;
- a palavra "WhatsApp" visível na barra fixa e nos outros botões;
- filete interno do contorno do celular, usado só na foto opcional.

---

## 1. Conceito e princípios

**Conceito.** A página é uma folha técnica bem diagramada. Papel branco, tinta escura e o azul do campo da logo aplicado em apenas dois planos sólidos:
- o plano da marca no hero, onde o lockup branco aparece grande como na arte original;
- o CTA final.

As trilhas do fundo da logo viram a espinha da página e ligam os rótulos das seções como pistas ligam componentes numa placa. O "DESDE 2011" vira sistema tipográfico: rótulos em caixa-alta espaçada e o ano como o maior elemento da página. O "Nº 2884" é o par desse ano na Localização.

| Elemento da logo | No site |
|---|---|
| Campo azul (#002F71 → #003E87 → #0254A8) | Dois planos sólidos em #003E87, o centro medido: plano da marca e CTA. Sem gradiente. |
| Traços de circuito (0°/90°/45°, terminais redondos) | Trilha de 2 px que só liga marcadores: espinha, portas, barramento, régua, sumário do menu. Na página, funciona como textura apenas no plano da marca; em tom bem claro, aparece também nas bordas das ilustrações dos serviços, dentro da própria imagem. |
| Contorno fino do celular | Fios de 1 px como estrutura (tabela, fichas, destaques, dúvidas). O raio do contorno reaparece só na moldura da foto opcional e nos celulares desenhados nas ilustrações. |
| Cruz sólida | Cruz sólida de 14 px na junção espinha × barramento dos Diferenciais. |
| "DESDE 2011" | Rótulos em caixa-alta com tracking de .16em a .34em e o numeral "2011" gigante. |
| "Clinic / Cell" empilhado | Títulos curtos em 2 ou 3 linhas, com entrelinha 1,02. |

**Princípios**
1. **Branco com dois planos azuis.** Papel branco dominante e só dois planos azuis por página, ambos na cor do campo da logo. O azul de ação (#0750A5) é usado só em botões, links, ícones, terminais e numerais.
2. **O circuito liga, não decora.** Toda trilha conecta marcadores. A única textura é o plano da marca, que reproduz o fundo da logo.
3. **Numerais como assinatura.** "2011" e "Nº 2884" são dados reais mostrados em escala.
4. **Tabelas e fios, não cards.** Raio de 2 px só nos botões. Sem sombras de elevação.
5. **WhatsApp a um toque.** Em qualquer ponto da rolagem, sempre com a palavra "WhatsApp" visível.
6. **Honestidade.** Nenhum texto, ícone ou desenho sugere o que não foi confirmado: rota desenhada, horários, prazos, preços, peças, nota no Google, número de aparelhos atendidos, avaliações. A garantia de 90 dias, as marcas atendidas, a loja física, os acessórios e o parcelamento no cartão estão confirmados (descrição do Perfil da Empresa no Google escrita pela loja, recebida em 20/11/2026).
7. **Mobile primeiro.** O celular tem composição própria (portas, plano que sangra, destaques em 2 × 2, barra fixa do WhatsApp), não é o desktop encolhido.

---

## 2. Tokens

### 2.1 Cor

| Token | Hex | Uso |
|---|---|---|
| `--color-field` | #003E87 | Campo da logo: plano da marca e CTA |
| `--color-blue` | #0750A5 | Ação (fora do WhatsApp): botão primário, links, ícones, terminais, numerais |
| `--color-blue-deep` | #063777 | Hover do primário |
| `--color-blue-night` | #002F71 | Active do primário |
| `--color-whatsapp` | #008069 | Tudo que abre o WhatsApp: fundo dos botões e texto dos links (verde do próprio WhatsApp) |
| `--color-whatsapp-deep` | #006D59 | Hover dos botões do WhatsApp |
| `--color-whatsapp-night` | #005C4B | Active dos botões do WhatsApp |
| `--color-whatsapp-on-field` | #25D366 | Links do WhatsApp sobre o campo azul (plano da marca e CTA) |
| `--color-ink` | #172B45 | Texto, títulos, borda do botão secundário |
| `--color-ink-2` | #4A5A70 | Texto secundário, rótulos, legendas (substitui o #64748B) |
| `--color-paper` | #FFFFFF | Fundo |
| `--color-paper-2` | #F5F8FC | Faixa de destaques, fundo do mapa e das imagens dos serviços enquanto carregam, hover de linha |
| `--color-rule` | #D3DCE8 | Fios de tabela, ficha, destaques e dúvidas; fio superior da barra fixa do WhatsApp |
| `--color-on-field` | #FFFFFF | Texto sobre o campo |
| `--color-on-field-2` | #D6E4F7 | Texto secundário e rótulos sobre o campo |
| `--color-trace` | #B9CBE3 | Espinha, portas, barramento, régua |
| `--color-trace-on-field` | #4F7DBD | Espinha e porta sobre o CTA |
| `--color-trace-faint` | #1C539A | Trilhas de fundo do plano da marca (cerca de 1,35:1, como na logo) |

Ficam de fora de propósito:
- #0D64C5: um único azul de ação basta.
- #64748B: dá 4,47:1 sobre #F5F8FC e reprova AA.

### 2.2 Contraste

Pares usados, calculados pela luminância relativa (WCAG 2.x).

| Primeiro plano | Fundo | Razão | Uso |
|---|---|---|---|
| #172B45 | #FFFFFF / #F5F8FC | 14,31 / 13,43 | texto |
| #4A5A70 | #FFFFFF / #F5F8FC | 7,03 / 6,60 | texto secundário |
| #0750A5 | #FFFFFF / #F5F8FC | 7,78 / 7,30 | links, ícones, numerais |
| #FFFFFF | #0750A5 / #063777 / #002F71 | 7,78 / 11,53 / 12,77 | primário: normal / hover / active |
| #FFFFFF | #008069 / #006D59 / #005C4B | 4,89 / 6,30 / 7,98 | botões do WhatsApp (texto e sublegenda "pelo WhatsApp"): normal / hover / active |
| #008069 | #FFFFFF / #F5F8FC | 4,89 / 4,59 | links do WhatsApp |
| #25D366 | #003E87 | 5,19 | links do WhatsApp sobre o campo |
| #FFFFFF | #003E87 | 10,30 | texto no plano e no CTA |
| #D6E4F7 | #003E87 | 7,99 | rótulos (dt), texto do CTA |
| borda #172B45 | #FFFFFF | 14,31 | botão secundário (mínimo 3:1) |
| anel #0750A5 / #FFFFFF | claro / campo | 7,78 / 10,30 | foco (mínimo 3:1) |
| decorativos | — | 1,35 a 2,45 | #D3DCE8, #B9CBE3, #4F7DBD, #1C539A: sempre `aria-hidden` e sem informação |

### 2.3 Tipografia

**Famílias** (2 no total, ambas variáveis e auto-hospedadas):

As duas vêm do `@fontsource-variable` e são **reduzidas ao que o design usa** por `scripts/fonts.py` (`npm run fonts:subset`). Os `.woff2` ficam em `src/assets/fonts/`, versionados, e são declarados em `src/styles/fonts.css`, com os mesmos `unicode-range` do fontsource (latin e latin-ext).

Todas as faces de uma família têm descritores **idênticos** (DM Sans `font-weight: 400 600`; Red Hat Mono `500`). Se um subconjunto declarar outro intervalo, o Chrome escolhe o grupo errado e o texto latino cai em Arial. Para usar outro peso: mude os limites em `scripts/fonts.py`, rode o script e ajuste o `fonts.css`.

**DM Sans**
- `font-family: 'DM Sans Variable'`.
- Eixos: opsz 9–40 (inteiro) e wght limitado a 400–600. Arquivo latin de 34,7 KB (o original, com wght 100–1000, tinha 62,7 KB); o subset latin cobre todo o português.
- Pesos usados: 400, 500 e 600. Usar `font-optical-sizing: auto`.
- Por que: é derivada da Poppins, o DNA geométrico do wordmark, mas tem contraste baixo e tamanho óptico. Conversa com a logo sem copiá-la e funciona de 12 px a 400 px.

**Red Hat Mono**
- `font-family: 'Red Hat Mono Variable'` (nome do fontsource mantido), instância estática no peso 500, arquivo latin de 10,1 KB.
- Por que: formas redondas que combinam com a DM Sans. É a camada de dados da folha técnica.
- Uso restrito a: rótulos de ficha (dt), títulos do rodapé, cabeçalho da tabela e "Hoje".

**Fontes descartadas**
- Inter: escolha automática.
- Outfit e Plus Jakarta: cara de template.
- Archivo wdth: CLS de 0,047 medido e cerca de 90 KB.
- Red Hat Display: é face display, ruim em texto corrido.

**Corte só com wght avaliado.** O arquivo `wght` do fontsource (36,9 KB, latin, sem o eixo opsz) foi testado e rejeitado como padrão, porque o display (H1 de 96 px, numeral de 400 px) é a assinatura e depende do corte opsz. Fica como plano B: trocar a origem em `scripts/fonts.py` e recalibrar o tracking dos displays (provavelmente cerca de 0,01em mais negativo, porque o corte de texto é mais aberto), conferindo no navegador.

Stacks:
- `--font-sans`: `'DM Sans Variable', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif`
- `--font-mono`: `'Red Hat Mono Variable', ui-monospace, 'Cascadia Mono', Consolas, Menlo, monospace`

**Escala.** Valores interpolados de 360 a 1440 px. Na tabela, "320 → 1440" e "390" são os px resultantes.

| Token | Uso | Valor | 320 / 390 → 1440 | Peso | Entrelinha | Tracking |
|---|---|---|---|---|---|---|
| `--fs-numeral` | "2011" | `min(52vw, 25rem)`; ≥768 `min(40vw, 25rem)`; ≥1024 `min(27vw, 25rem)` | 166 / 203 → 389 | 600 | .8 | −.06em; margem esquerda −.045em (óptico) |
| `--fs-number` | "2884" | `clamp(5.25rem, 3.6rem + 8vw, 10rem)` | 84 / 89 → 160 | 600 | .8 | −.06em |
| `--fs-h1` | H1 | `clamp(2.25rem, 1.179rem + 5.357vw, 6rem)`; ≥1024 `clamp(4.25rem, 6.7vw, 6rem)` | 36 / 40 → 96 | 600 | 1.02 | −.018em (≥1024: −.028em) |
| `--fs-display` | H2 do CTA | `clamp(2rem, 1.083rem + 4.63vw, 5.25rem)` | 32 / 35 → 84 | 600 | 1.02 | igual ao H1 |
| `--fs-h2` | H2 de seção | `clamp(1.875rem, 1.333rem + 2.407vw, 3.5rem)` | 30 → 56 | 600 | 1.08 | −.02em (≥1024: −.028em) |
| `--fs-h3` | H3, rua | `clamp(1.25rem, 1.167rem + .37vw, 1.5rem)` | 20 → 24 | 600 | 1.25 | −.012em |
| `--fs-stand` | texto do Sobre | `clamp(1.25rem, 1.083rem + .741vw, 1.75rem)` | 20 → 28 | 400 | 1.42 | −.012em |
| `--fs-lead` | subtítulo, texto do CTA, valor dos destaques, pergunta das Dúvidas (as duas últimas em 600, entrelinha 1.25) | `clamp(1.125rem, 1.042rem + .37vw, 1.375rem)` | 18 → 22 | 400 | 1.45 | 0 |
| `--fs-body` | corpo | `clamp(1.0625rem, 1.042rem + .093vw, 1.125rem)` | 17 → 18 | 400 | 1.6 | 0 |
| `--fs-button` / `--fs-data` | botões, valores de ficha | 1.0625rem | 17 | 500 / 400 | 1.2 / 1.5 | 0 |
| `--fs-menu` | itens do menu | 1.75rem | 28 | 500 | — | −.02em |
| `--fs-small` | notas, legendas, rodapé, texto dos destaques | .9375rem | 15 | 400 | 1.5 | 0 |
| `--fs-legal` | sublegenda de botão, linha legal | .875rem | 14 | 400 | 1.2–1.5 | 0 |
| `--fs-label` | rótulo de seção (sans, caixa-alta) | .8125rem | 13 | 500 | 24px | .16em |
| `--fs-data-label` | dt, cabeçalho da tabela (mono) | .75rem | 12 | 500 | 24px | .08em |
| `--fs-kicker` | "DESDE", "Nº" | `clamp(.875rem, .8rem + .3vw, 1.125rem)` | 14 → 18 | 500–600 | 1 | .34em ("DESDE"); .04em ("Nº") |

**Regras tipográficas**
- A mono nunca aparece em texto corrido, títulos, botões ou telefones.
- Telefones usam DM Sans com `font-variant-numeric: tabular-nums` e `white-space: nowrap` (classe `.phone`).
- `text-wrap: balance` em H1, H2, H3 dos Diferenciais e do estado vazio, texto do CTA, valor dos destaques e pergunta das Dúvidas; `text-wrap: pretty` nos demais parágrafos, notas, valores de ficha e itens da lista de serviços.
- Medidas de linha em `em`, equivalentes ao `ch` da DM Sans: lead e Sobre 23,5em (≈ 34ch), texto 30,2em (≈ 44ch), Diferenciais 26,1em (≈ 38ch), título do CTA 10,3em (≈ 15ch), frase do rodapé 20,55em (≈ 30ch), título do estado vazio 18,3em (≈ 26ch). Não usar `ch`: ele mede o "0" da fonte carregada e muda ~19% quando a DM Sans substitui a fonte de reserva, deslocando o layout.
- Sem hifenização.

### 2.4 Espaço

- Escala de 4 px: `--space-1` 4, `-2` 8, `-3` 12, `-4` 16, `-5` 20, `-6` 24, `-7` 28, `-8` 32, `-10` 40, `-12` 48, `-14` 56, `-16` 64, `-18` 72, `-22` 88, `-24` 96.
- Padding de seção: `--section-pad: clamp(4rem, 3rem + 4.444vw, 7rem)`, de 64 a 112 px. Fica no `.container` interno para a espinha não ter falhas.
- Ritmo dentro das seções:
  - rótulo → H2: 20 px;
  - H2 → introdução: 16 px;
  - cabeçalho → conteúdo: 32 px no celular e 56–72 px no desktop (40 px nas Dúvidas, onde a lista vem logo abaixo do H2).

### 2.5 Layout, grid e breakpoints

- Container: `max-width: 90rem`, centralizado, com `padding-inline: var(--ml) var(--mr)`.
- Margem: `--margin: clamp(1rem, 5.13vw, 4rem)`, ou seja, 16 px a 320, 20 a 390 e 64 a partir de 1248.
- A partir de 1024, a margem esquerda é larga: `--ml: clamp(6rem, 8.9vw, 8rem)`. É a coluna das trilhas.
- Grid: 4 colunas abaixo de 768, 8 colunas de 768 a 1023 e 12 colunas a partir de 1024. `--gap: clamp(1rem, .75rem + 1.11vw, 1.5rem)`.
- Eixo das trilhas: `--axis` vale 0 abaixo de 1024 e −4.5rem a partir de 1024. `--spine-x = --ml + --axis + 5px` concentra toda a geometria da espinha num só token.
- Breakpoints. No CSS e no JS eles são escritos em `em` (768 = 48em, 1024 = 64em, 1200 = 75em, 1280 = 80em), que acompanham a fonte padrão do navegador. Com 16 px (o padrão) valem exatamente os px da tabela. Com a fonte ampliada nas configurações, a página muda de layout mais cedo, como no zoom: com 20 px, o desktop começa em 1280 px, e com 32 px um notebook de 1280 px recebe o layout de celular, sem transbordar. Exceção: o `386px` do `sizes` da logo do plano continua em px, porque vem de 232 px = 60vw.

| Largura | O que muda |
|---|---|
| 768 (48em) | Ações do hero em linha; rótulo do hero em 1 linha; logo do plano com 320 px; linha de serviço com a imagem à esquerda e os serviços em 1 coluna embaixo; Diferenciais em 2×2; mapa com borda, em 16:10; rodapé em 3 colunas; botões com padding 24. |
| 1024 (64em) | Grid de 12; espinha; header com navegação e WhatsApp; destaques em 4 colunas; tabela de serviços com cabeçalho (serviços em 1 coluna); Diferenciais com introdução nas colunas 9–12; Dúvidas em 2 colunas; sem a barra fixa do WhatsApp. |
| 1200 (75em) | Trilha "mid" do plano da marca volta a aparecer (oculta de 1024 a 1199). |
| 1280 (80em) | Trilhas "low" do plano da marca; ícone dos destaques à esquerda do valor; serviços da tabela em 2 colunas; na Localização, "Abrir no Google Maps" e "Traçar rota" voltam a ficar lado a lado (de 1024 a 1279 ficam empilhados). |

### 2.6 Raios, fios, sombras, camadas, movimento e tamanhos

- **Raios:**
  - 2 px nos botões (`--radius-button`);
  - 0 em tudo o mais, inclusive na barra fixa do WhatsApp e nas imagens dos serviços;
  - 50% só em terminais;
  - 14 px só na foto opcional, com filete interno de 6 px.
- **Fios:**
  - 1 px #D3DCE8 entre linhas (tabela, ficha, destaques, dúvidas) e no topo da barra fixa do WhatsApp;
  - cabeçalho da tabela com 1 px #172B45.
- **Sombras:** nenhuma. O único box-shadow é técnica de desenho, não elevação: o fundo da linha de serviço que sangra 16 px para cada lado no hover, a partir de 1024.
- **Camadas:** header 30, barra fixa do WhatsApp 40, menu 50, skip link 60.
- **Movimento:**
  - `--dur-fast: 150ms` (cores, seta do serviço, "+" das Dúvidas);
  - `--dur-fab: 200ms` com `cubic-bezier(.2, .7, .2, 1)` (barra fixa do WhatsApp);
  - com `prefers-reduced-motion: reduce`, as duas durações vão a 0s, sem usar `!important`.
- **Tamanhos:**
  - `--target`: 44 px;
  - `--button-h`: 56 px;
  - botão "Menu" do header e botões do menu: 48 px (`--button-h-compact`);
  - `--header-h`: 72 px no celular e 80 px a partir de 1024;
  - barra fixa do WhatsApp: `--fab-h` = fio de 1 px + 12 + botão de duas linhas (padding 8 + 8, borda 1 + 1, 17 × 1,2 + 2 + 14 × 1,2 = 57,2) + 12 ≈ 82 px, calculado no CSS a partir dos tokens; `--fab-bottom` = área segura do iPhone embaixo (`env(safe-area-inset-bottom, 0px)`), somada ao respiro de baixo;
  - faixa do header fixo para âncoras e foco (`--scroll-top`): header + 16 px no celular e header + 24 px a partir de 1024;
  - logo do header: 44 px de altura (52 a partir de 1024);
  - logo do plano: `min(232px, 60vw)`, 20rem a partir de 768 e `clamp(17.5rem, 28vw, 26rem)` a partir de 1024, sempre abaixo de 470 px;
  - logo do rodapé: 56 px de altura;
  - ícones: UI 20, link 18, rótulo 16, conteúdo 24 (`--icon-diff`: Diferenciais, destaques, "Seu caso não está na lista?" e o "+" das Dúvidas);
  - imagem da área de serviço: 16:10, largura total da coluna no celular, até 13rem (208 px) a partir de 768 e até 12rem (192 px) a partir de 1024.

---

## 3. Motivo de circuito

**Anatomia**
- **Trilha:** 2 px, só em 0°, 90° e 45°, com chanfro de 45° e nunca curva.
- **Terminal (pad):** círculo de 12 px com anel de 2 px #0750A5.
  - Miolo da cor do fundo: terminal aberto.
  - Miolo #0750A5: terminal sólido, para origem ou fim.
  - Sobre o campo: anel branco com miolo #003E87.
- **Cruz sólida:** quadrado de 14 px com dois gradientes de braço (34% de espessura). Só na junção dos Diferenciais.

**Usos** (são os únicos permitidos):
1. **Espinha (a partir de 1024).** `.has-spine > .container::before` com `top: var(--spine-top, 0)`, `bottom: 0`, `left: var(--spine-x)`, 2 px de largura.
   - Nasce no terminal sólido do rótulo do hero: `--spine-top = padding-top do hero + --label-h / 2`.
   - Desce sem falhas pela faixa de destaques, que não tem rótulo (a faixa também é `.has-spine`).
   - Atravessa o CTA em #4F7DBD.
   - Termina num terminal sólido 40 px abaixo do topo do rodapé (só na home: na 404 não há espinha, nem no rodapé).
2. **Portas (abaixo de 1024).** `.section-label::before`: segmento de 2 px da borda da tela até o terminal do rótulo (largura = `--ml`).
3. **Rótulo de seção.** Terminal no eixo. A partir de 1024 ele fica absoluto na margem, e o texto alinha com a coluna.
4. **Barramento dos Diferenciais.**
   - Abaixo de 768: vertical, ligando os 4 terminais.
   - De 768 a 1023: não existe (2×2).
   - A partir de 1024: horizontal sobre as 4 colunas, com ramificação em T vinda da espinha e a cruz sólida na junção.
5. **Régua do Sobre.** Terminal sólido (2011) ── trilha ── terminal aberto ("Hoje").
   - `::before` é a linha.
   - `::after` faz os traços com `repeating-linear-gradient(90deg, trace 0 2px, transparent 2px calc(100% / var(--years)))`: um traço de 10 px por ano.
   - `--years` = ano do build − 2011, passado por `style` a partir de dados.
6. **Sumário do menu.** Trilha vertical ligando os terminais das seções.
7. **Plano da marca.** É o único uso "de fundo" na página e o único SVG decorativo desenhado no HTML.
8. **Marcador da lista de serviços.** Cada serviço começa com um terminal aberto pequeno (7 px, anel de 1,5 px #0750A5), centrado na primeira linha, sem trilha.

As ilustrações das áreas de serviço são imagens à parte (ver "Ilustrações das áreas de serviço" na seção 4). As trilhas claras nas bordas delas seguem as mesmas regras de desenho (só 0°, 90° e 45°, terminal no fim), mas ficam dentro da imagem, nunca na página.

**Como construir o SVG do plano**
- SVG inline com `aria-hidden="true"` e `focusable="false"`, `viewBox="0 0 640 820"` e `preserveAspectRatio="xMaxYMin slice"`.
- Abaixo de 1024, o SVG **não** escala com o plano: mantém a geometria aprovada em 390 px, ancorado no canto superior direito (`width: min(100%, 24.375rem)`, `aspect-ratio: 640 / 820`). Assim as trilhas nunca encostam na logo em 412–430 px ou em tablets.
- A partir de 1024, posição absoluta cobrindo o plano, com largura `calc(100% + var(--mr) + var(--bleed))` para chegar à borda da janela; o `.hero` recorta com `overflow-x: hidden` seguido de `overflow-x: clip`.
- Traço: `stroke: #1C539A; stroke-width: 1.5; vector-effect: non-scaling-stroke; fill: none`.
- Terminais: `<circle r="5">` com preenchimento #003E87 e o mesmo traço.
- Caminhos atuais:
  - sempre visíveis:
    - `M640 60H596L564 92V170` + círculo (564,176);
    - `M500 0V24L524 48H584` + (590,48);
  - grupo `brand-plate__traces-mid`, oculto de 1024 a 1199 (o plano estreito o faria passar rente à logo):
    - `M640 136H620L604 152V292L580 316H512` + (506,316);
  - grupo `brand-plate__traces-low`, só a partir de 1280:
    - `M640 400H584L556 428V500` + (556,506);
    - `M440 0V48L464 72V128` + (464,134).
  - Removido: `M640 460H616L600 476V560L576 584H520` + (514,584), que pousava no fio superior da antiga ficha do plano entre 1350 e 1560 px.
- Regras para desenhar novos caminhos:
  - começar na borda direita ou superior;
  - usar só H, V e diagonais com Δx = Δy;
  - terminar num terminal 6 px depois do fim do segmento;
  - ficar com x ≥ 440 (terço direito), para nunca passar atrás da logo ou do texto;
  - o que tiver y > 380 vai para o grupo "low" (só a partir de 1280);
  - conferir com uma varredura de 320 a 1920 px (passo de 20 px): nenhuma trilha ou terminal a menos de 12 px da logo.

**Não fazer**
- Trilhas como textura em seções brancas.
- Trilhas animadas ou que "desenham" no scroll.
- Brilho, glow ou neon.
- Ângulos livres.
- Mais de uma espinha.
- Ruas ou rota inventadas no mapa.
- A cruz como ícone decorativo solto.

---

## 4. Componentes e estados

### Botão (`.button`)

**Base:**
- `inline-flex`, gap 12, altura mínima de 56 px;
- padding de 8/16 abaixo de 768 e 8/24 a partir de 768;
- borda de 1 px transparente, raio de 2 px;
- 17 px/500, entrelinha 1.2;
- transição de cor, fundo e borda em 150 ms.

**Variantes:**
- **primary:** fundo #0750A5, texto branco. Hover #063777, active #002F71.
- **secondary (contorno):** borda de 1 px #172B45, texto ink. Hover #F5F8FC.
- **whatsapp:** todo botão que abre o WhatsApp. Fundo #008069, texto e sublegenda brancos. Hover #006D59, active #005C4B. Também sobre o campo azul (CTA final).
- **small:** 44 px, padding 0/16, 15 px. É o botão do header no desktop.
- **block:** largura total. Usado no menu e na barra fixa do WhatsApp.
- **stacked (CTAs de WhatsApp):**
  - estrutura: ícone `MessageCircle` + `.button__label` em coluna, com a linha principal (17/500) e `.button__sub` "pelo WhatsApp" (14/400, branco);
  - o texto visível ("Solicitar orçamento pelo WhatsApp") é o começo do nome acessível, e o restante fica oculto: " (abre em nova aba)";
  - usado no hero, no CTA final, no menu, na barra fixa do WhatsApp e no estado vazio, sempre com `.button--whatsapp`.

**Estados:**
- hover só dentro de `@media (hover: hover)`;
- `:active` escurece;
- foco com anel de 3 px;
- não há estado desabilitado (o site não tem formulários).

### Links

- **`.text-link`** (ação secundária do hero): texto ink 17/500, sublinhado de 1 px com offset de .3em, ícone azul, altura mínima de 56 px. Hover: sublinhado de 2 px.
- **`.link`**: #0750A5, 500, sublinhado de 1 px com offset de .25em. Fica branco dentro de `.on-field`. Link externo textual leva `ArrowUpRight` de 16 px.
- **`.link--whatsapp`**: todo link que abre o WhatsApp (telefones, "Confirmar horário", "Descreva o defeito pelo WhatsApp", links do WhatsApp nas respostas das Dúvidas, "Falar pelo WhatsApp" da 404) fica #008069, inclusive o ícone. Dentro de `.on-field`, #25D366 (`--whatsapp-link-color`). O "Pedir orçamento" de cada serviço (`.service__link`) também é verde. O QA confere que todo `a[href^="https://wa.me/"]` da página está verde.
- **`.link--tap`**: `inline-block` com `padding-block: 2px 11px` e margem negativa igual, que devolve o espaço. Alvo de ~38 px (2.5.8 AA) sem mudar a altura da linha. Cresce para baixo, não para cima: esses links vêm logo abaixo de outro texto, e um alvo que subisse capturaria toques dados nele. O anel de foco fica num `::after` que abraça o texto (3 px + 3 px de afastamento), sem riscar a linha de cima nem pousar no fio da ficha. Por ser `inline-block`, se o link quebrar em duas linhas (fonte muito ampliada em tela estreita), o anel contorna as duas.
- **`.text-button`**: botão com aparência de link azul sublinhado, altura mínima de 44 px e ícone de 18 px ("Abrir no Waze", "Copiar endereço"). No "Copiar endereço", os rótulos "Copiar endereço", "Copiado" e "Falha ao copiar" ficam empilhados no mesmo lugar (`.text-button__rotulos`, só um visível, alinhados ao início): o botão tem sempre a largura do maior, e nenhuma troca desloca o que está ao redor, nem a da confirmação, que some sozinha depois de 4 s. Os rótulos curtos não alargam o botão; o leitor de tela ouve a frase completa ("Endereço copiado.").

### Foco

- `:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 3px }`. Dentro de `.on-field`, o anel fica branco.
- Na linha de serviço, o anel vai para o `<li>` inteiro via `@supports selector(:has(a))`, com `.service:has(.service__link:focus-visible)` e offset de 2 px. Sem `:has`, o anel fica no próprio link.
- Nunca remover o outline.

### Rótulo de seção (`.section-label`, um `<p>`)

- Composição: terminal + nome da seção.
- Texto de 13/500 em caixa-alta, tracking .16em, #4A5A70.
- Sobre o campo: texto #D6E4F7.
- O hero usa a mesma peça com terminal sólido.

### Ficha (`<dl class="ficha">`)

- `container-type: inline-size`.
- Linhas: grid com `align-items: start`, fio superior e padding de 12 px. A ficha fecha com fio inferior.
- A partir de 26rem de largura da própria ficha: rótulo de 7.5rem + valor, gap 16 e padding 16. Abaixo disso, rótulo sobre o valor.
- `dt`: mono 12/500 em caixa-alta, .08em, #4A5A70. Ícone opcional de 16 px. A altura mínima do dt é a da 1ª linha do valor.
- `dd`: 17/1.5 com `text-wrap: pretty`.
- Usada só na Localização (WhatsApp e Horário), sempre sobre o papel branco: não há variante sobre o campo azul.

### Header

- **Em todas as larguras:** fixo no topo (`position: sticky; top: 0`), fundo branco, fio inferior. Os links e botões do header têm `scroll-margin` que anula o `scroll-padding-top`: sem isso, cada foco neles (Shift+Tab) rolaria a página. Com altura útil de até 20em (zoom de 300–400%), ele volta a rolar com a página: fixo, tomaria um terço da tela.
- **Abaixo de 1024:**
  - 72 px;
  - logo azul com 44 px de altura dentro de um link para `#topo` (alt "ClinicCell, início"). `#topo` é uma âncora vazia no início da página: com ela a rolagem vai a 0 em qualquer largura (uma âncora no hero ou no `<main>` pararia abaixo do header). O "Voltar ao topo" do rodapé usa a mesma âncora;
  - botão "Menu" com 48 px de altura, `aria-expanded` e `aria-controls="menu"`;
  - até o React assumir a página (rede lenta, JS bloqueado ou com erro), o botão fica escondido e aparece o link "Menu" para `#rodape-navegacao` (focável, `tabindex="-1"`), com o mesmo visual e a mesma caixa. A troca é controlada pela classe `html.is-hydrated`, que o `SiteLayout` adiciona depois da hidratação. Se o foco do teclado estiver no link nessa hora, ele passa para o botão;
  - o "Copiar endereço" (`.requires-js`) também espera o React, mas oculto com `visibility: hidden`: o lugar fica reservado e nada se desloca quando ele aparece. Sem JavaScript nenhum (`@media (scripting: none)`), nem o lugar fica.
- **Com a fonte do navegador ampliada:** os pontos de quebra em `em` (ver 2.5) passam a página ao layout de celular antes de o header de desktop ficar apertado. A logo nunca encolhe (`flex-shrink: 0`).
- **A partir de 1024:**
  - 80 px;
  - logo com 52 px, alinhada ao eixo das trilhas;
  - navegação com as 6 seções (Serviços, Sobre, Diferenciais, Localização, Dúvidas, Contato): nomes de 15/500, alvo de 44 px, espaço entre eles de `clamp(1.125rem, 2.2vw, 2.25rem)`;
  - botão small verde "Orçamento pelo WhatsApp".

### Menu (celular)

- Diálogo de tela cheia: `role="dialog"`, `aria-modal="true"`, `aria-label="Menu"`, fundo branco.
- Topo: logo + botão "Fechar" (`X`).
- Corpo: "SUMÁRIO" com terminal sólido e a lista das 6 seções em linhas de 64 px, com nomes de 28/500 e uma trilha ligando os terminais.
- Pé, na zona do polegar: verde stacked "Solicitar orçamento / pelo WhatsApp", secundário "Traçar rota" e o endereço em duas linhas (rua / bairro · cidade).
- Comportamento:
  - ao abrir, o foco vai para "Fechar";
  - `inert` em header, main, footer, barra fixa do WhatsApp e skip link;
  - Tab preso no diálogo como reforço;
  - Esc, o gesto ou botão Voltar do Android (`CloseWatcher`, onde existir) ou um clique num link fecham;
  - o foco volta para quem abriu; se quem abriu não estiver mais visível (ex.: tablet girado para o layout de desktop, que também fecha o menu e esconde o botão "Menu"), o foco vai, sem rolar, para a seção na tela (de preferência a que começa nela), ou para o link da marca se não houver nenhuma. Ao abrir o menu, o `SiteLayout` guarda o trecho que a pessoa lia: com o menu (tela cheia) aberto o navegador não ancora a rolagem, e se o layout virar desktop a página volta a esse trecho;
  - ao escolher uma seção, o foco vai para a própria seção (`tabindex="-1"`, sem contorno), e o leitor de tela acompanha;
  - a rolagem trava com `html.is-menu-open { overflow: hidden }`.

### Barra fixa do WhatsApp (abaixo de 1024)

Componente `FloatingWhatsApp` (`src/sections/FloatingWhatsApp.jsx`, classe `.whatsapp-fab`). Substitui o antigo botão flutuante em pílula do canto direito.

- `<aside aria-label="Atalho para o WhatsApp">` fixo na parte de baixo da tela, de borda a borda (`inset-inline: 0; bottom: 0`), na zona do polegar.
- Faixa: fundo branco, fio superior de 1 px #D3DCE8 e padding de 12 px em cima, `--margin` nas laterais e 12 px + área segura (`--fab-bottom`) embaixo. Sem raio e sem sombra.
- Conteúdo: botão verde stacked de largura total (`.button--whatsapp.button--block`), com cerca de 57 px de altura (duas linhas): `MessageCircle` + "Solicitar orçamento" / "pelo WhatsApp".
  - Fundo #008069 (`--color-whatsapp`) com texto branco (4,89:1). Hover #006D59 (só com hover), active #005C4B.
- Nome acessível: "Solicitar orçamento pelo WhatsApp (abre em nova aba)"; abre a mensagem de orçamento.
- Só o WhatsApp: o "Menu" fica sempre à mão no header fixo.
- Aparece só quando todas as condições valem (a mesma lógica do antigo botão), conferidas pela posição atual dos elementos a cada rolagem (no máximo uma vez por quadro), mudança de tamanho ou aviso do IntersectionObserver:
  - o CTA do hero saiu da tela por cima, inclusive num salto por âncora que passe por cima dele;
  - nem `#contato` nem o rodapé estão visíveis (os dois já têm WhatsApp);
  - o menu está fechado.
- Oculta: `transform: translateY(100%)` (abaixo da janela) + `visibility: hidden`, então não recebe foco. Sobe em 200 ms.
- Folga de rolagem: `html { scroll-padding-bottom: calc(var(--fab-h) + var(--fab-bottom) + 1rem) }` (≈ 98 px sem área segura): âncoras e foco param acima da barra. O `FloatingWhatsApp` mede a barra com `ResizeObserver` (e ao girar o aparelho) e só grava outra folga no `scroll-padding-bottom` do `<html>` quando a altura real difere da do CSS (fonte do navegador muito ampliada). Gravar sempre custaria caro: a primeira mudança no `style` do `<html>` recalcula o estilo da página inteira.
- Some com altura útil de até 20em (zoom de 300–400%) e no desktop, onde o header fixo já tem o WhatsApp.
- Sem JS, nunca aparece.

### Acesso ao WhatsApp

**Onde está:**
- CTA do hero;
- cada área da tabela de serviços ("Pedir orçamento");
- "Seu caso não está na lista?";
- número do diferencial 4;
- ficha da Localização (número e "Confirmar horário");
- respostas das Dúvidas (orçamento, marcas, celular que molhou, celular que não liga, vidro, acessórios, horário);
- botão e número do CTA final;
- rodapé;
- header no desktop;
- barra fixa no celular;
- menu.

**Regras de todos os links:**
- URL `https://wa.me/554195079359?text=…`, com `target="_blank"` e `rel="noopener noreferrer"`;
- " (abre em nova aba)" oculto no nome acessível;
- ícone `MessageCircle` nos botões e a palavra "WhatsApp" visível no rótulo, na sublegenda ou no texto ao lado. Os links dentro de frases (Dúvidas, "Seu caso…") não levam ícone; o "Pedir orçamento ↗" da tabela leva a seta, e a introdução da seção diz que o pedido é pelo WhatsApp.

### Linha de serviço e tabela

Uma linha por **área** (5 áreas, 25 serviços), não por serviço. `<ol class="services__list" role="list">` com um `<li class="service" id="servico-<id>">` por área, contendo:
- a imagem da área (`.service__image`, decorativa, `alt=""`, `width="480" height="300"`, `loading="lazy"`): proporção 16:10 fixa (`aspect-ratio: 480 / 300`, `object-fit: cover`) e fundo #F5F8FC enquanto carrega, sem salto de layout;
- o H3 com o nome da área, de 20 a 24/600;
- a lista dos serviços (`<ul class="service__items" role="list">`): texto do corpo com entrelinha 1.5, cada item com o terminal aberto de 7 px centrado na primeira linha (padding esquerdo de 20) e sem quebrar entre colunas;
- o link verde "Pedir orçamento ↗" (`.service__link`, #008069, 500, sublinhado de 1 px), com 44 px de alvo e `::after { inset: 0 }`, de modo que a linha inteira é o alvo. Nome acessível: "Pedir orçamento de <área> pelo WhatsApp (abre em nova aba)". Cada área tem a sua mensagem pronta.

**Layout por largura:**

| Largura | Colunas da linha | Arranjo |
|---|---|---|
| Abaixo de 768 | 1 coluna | Imagem em largura total; embaixo, H3 (20 px acima), serviços (12 px acima, 4 px entre eles) e o link (8 px acima). Padding 24/8 e fio superior; a lista fecha com fio inferior. |
| 768 | `minmax(0, 13rem) \| 1fr \| auto`, gap 24 | Áreas `"image title link" "image items items"`: imagem à esquerda ocupando as duas linhas; H3 e link na primeira linha, o H3 centrado na altura de 44 px do link; serviços embaixo, em 1 coluna (em 2, as colunas de ~200 px quebravam metade dos nomes). Padding 24, tudo alinhado ao topo. |
| A partir de 1024 | `minmax(0, 12rem) \| 3fr \| 5fr \| 10.5rem`, gap 24 | Tabela de verdade, área `"image title items link"` numa linha só. Padding 28. Serviços em 1 coluna, com a primeira linha centrada na altura de 44 px do link (alinha com o H3). A primeira linha não tem fio superior (o cabeçalho já fecha em cima). |
| A partir de 1280 | igual a 1024 | Serviços em 2 colunas (gap 24). |

- A última coluna tem largura fixa (10.5rem, cabe o "Pedir orçamento ↗") porque o cabeçalho e cada linha são grades separadas: com `auto`, ela mediria ~73 px no cabeçalho e ~165 px nas linhas, e o rótulo SERVIÇOS ficaria ~35 px fora da coluna. "ORÇAMENTO" e o link ficam alinhados à direita (`justify-self: end`).

- **Cabeçalho da tabela (a partir de 1024):** `aria-hidden`, nas mesmas colunas das linhas, em mono 12/500 com caixa-alta, .08em, #4A5A70 e fio inferior de 1 px ink, 56 px abaixo do H2: (imagem, sem texto) · Área · Serviços · Orçamento (alinhado à direita).
- **Hover** (só com hover): fundo #F5F8FC na linha, sublinhado de 2 px no link e seta deslocada 2 px. A partir de 1024, o fundo sangra 16 px para cada lado via box-shadow.
- **"Seu caso não está na lista?":** fecha a tabela, 20 px abaixo. Ícone `MessageCircleQuestionMark` de 24 px (traço 1,5, #0750A5), depois a pergunta em 500 e o link verde "Descreva o defeito pelo WhatsApp" ao lado; quando falta espaço, o link desce para a linha de baixo. Pergunta e link com 44 px de altura.
- **Qualquer número de áreas:** a mesma tabela, na ordem de `src/content/servicos.js`; os serviços de cada área na ordem da lista.
- **Só as confirmadas:** a tabela lista apenas as áreas com `confirmado: true`, igual em `npm run dev` e no site publicado.
- **Estado vazio (0 publicados):**
  - substitui a introdução, a tabela e o "Seu caso…"; o rótulo, o H2 e `#servicos` continuam. Os destaques perdem o item com a contagem e as Dúvidas perdem a pergunta sobre os serviços;
  - bloco com fio superior e inferior e padding de 28/32;
  - terminal aberto + H3 "Conte o que aconteceu com o seu celular" + texto + stacked "Descrever o defeito / pelo WhatsApp";
  - a partir de 1024, texto e botão ficam em 2 colunas.

### Ilustrações das áreas de serviço

- **Arquivos:** uma imagem por área em `src/assets/servicos/<id da área>.svg`, ligadas às áreas por `src/lib/imagens-de-servico.js`. Uma foto com o mesmo nome (`.webp`, `.jpg`, `.jpeg`, `.png` ou `.avif`) tem prioridade sobre a ilustração. O build falha se uma área ficar sem imagem (`src/lib/validar-site.js`).
- **Estilo:** feitas para o site, 480 × 300 (16:10), sem texto e sem marca de fabricante.
  - fundo azul-claro #EEF4FB;
  - desenho em traço #0750A5, com preenchimentos em branco e em tons de azul (#D6E4F7 nas peças, azul-escuro nas telas);
  - trilhas de circuito claras (#C6D7EC, com terminais) nas bordas, longe do desenho.
- **O que cada uma mostra:** só o tipo de serviço, sem prometer nada.
  - Tela e carcaça: celular com a tela trincada e uma tela nova ao lado;
  - Bateria e carga: celular aberto mostrando a bateria, com o carregador sendo conectado;
  - Câmera, som e sensores: traseira com as câmeras, alto-falante e microfone;
  - Placa e reparos avançados: placa com chips e um ferro de solda;
  - Sistema e software: celular atualizando o sistema, com símbolos de restauração e de proteção.
- **Na página:** decorativas (`alt=""`; o título ao lado diz a área). O `aria-label` dentro de cada SVG só vale quando o arquivo é aberto sozinho. Sem raio, borda ou sombra, recortadas em 16:10.
- **Foto real no lugar:** proporção 16:10 (cerca de 960 × 600 px), da própria loja, nunca de banco de imagens. Uma foto em outra proporção é cortada no centro.

### Faixa de destaques (`.highlights`)

- Logo abaixo do hero, antes dos Serviços. `<section>` sem rótulo e fora da navegação, com H2 só para leitores de tela ("A ClinicCell em resumo") e uma lista (`<ul role="list">`) de fatos curtos.
- Fundo #F5F8FC e fio inferior de 1 px #D3DCE8. Padding vertical de 24 px no celular e 32 px a partir de 1024. A espinha passa por ela a partir de 1024.
- Item: ícone de 24 px (traço 1,5, #0750A5), 8 px acima do valor; valor em `--fs-lead`/600, entrelinha 1.25, `text-wrap: balance`; texto em `--fs-small`, entrelinha 1.5, #4A5A70. 4 px entre as linhas.
- Itens (`textos.destaques`), todos confirmados:

| Ícone | Valor | Texto |
|---|---|---|
| `ShieldCheck` | 90 dias de garantia | Nos serviços realizados |
| `Smartphone` | iPhone e Android | Samsung, Motorola e outras marcas |
| `Wrench` | 25 serviços (contados das áreas publicadas) | Da troca de tela ao reparo em placa |
| `CreditCard` | Parcelamento no cartão | Pergunte as condições |

- "Desde 2011" fica fora da faixa: já aparece no rótulo do hero e na logo do plano, logo acima.

- Layout:

| Largura | Arranjo |
|---|---|
| Abaixo de 1024 | 2 × 2, com fio vertical entre as colunas e fio horizontal entre as fileiras; padding de 16 px (a 1ª coluna sem padding à esquerda) |
| A partir de 1024 | 4 colunas separadas por fios verticais; padding 8/24 (o 1º item sem padding à esquerda) |
| A partir de 1280 | ícone à esquerda do valor (gap 12), centrado na primeira linha dele; o texto alinha com o valor |

- Feita para 4 itens. Um quinto (por exemplo, a nota no Google, quando confirmada) pede rever o layout.
- Sem serviços publicados, o item da contagem sai: nunca "0 serviços".

### Dúvidas frequentes (`#duvidas`)

- Seção com rótulo "Dúvidas", H2 "Dúvidas frequentes" e uma lista de perguntas que abrem e fecham com `<details>`/`<summary>` nativos: funcionam sem JavaScript e com teclado (Enter ou Espaço), e o leitor de tela anuncia se a resposta está aberta ou fechada. Todas começam fechadas. Cada uma tem a âncora `#duvida-<id>`.
- Lista: 32 px abaixo do H2 no celular, numa coluna só. A partir de 1024, 40 px abaixo, em 2 colunas independentes (`.faq__col`, gap 48): metade das perguntas em cada, na ordem (6 + 5). Abrir uma resposta só empurra as perguntas da mesma coluna. Fio superior de 1 px #D3DCE8 em cada pergunta; a lista (no celular) e cada coluna (no computador) fecham com fio inferior.
- **Pergunta (`summary`):** `--fs-lead`/600, entrelinha 1.25, `text-wrap: balance`, padding vertical de 20 px e alvo mínimo de 44 px. O marcador do navegador sai. À direita, o ícone `Plus` de 24 px em #0750A5, centrado na primeira linha, gira 45° e vira "×" quando a resposta abre (150 ms). Hover (só com hover): a pergunta fica #0750A5.
- **Resposta:** texto #4A5A70 até 30,2em (≈ 44ch), `text-wrap: pretty`, com 40 px livres à direita (não passa por baixo do ícone) e 24 px abaixo. Pode terminar num link: verde (`.link--whatsapp`) quando abre o WhatsApp, azul (`.link`) quando leva a uma seção.
- **11 perguntas** (`textos.duvidas`): orçamento, garantia, marcas, parcelamento, serviços, celular que molhou, celular que não liga, troca só do vidro, acessórios, endereço e horário.
- **Respostas que se atualizam sozinhas:**
  - serviços: total e nomes das áreas publicadas ("São 25 serviços, em 5 áreas: …");
  - endereço: de `src/config/site.js`;
  - horário: mostra os horários quando `horarios` for preenchido; até lá, "Confirme pelo WhatsApp antes de vir.".
- Sem serviços publicados, a pergunta sobre os serviços sai.
- Só fatos confirmados. Prazo e preço entram quando o proprietário confirmar.

### Endereço com numeral (Localização)

- O "Nº" (kicker de 14 a 18 px) e o "2884" (`--fs-number`) ficam em #0750A5, peso 600, com `aria-hidden`.
- Depois vêm a rua (`--fs-h3`/600) com ", 2884" oculto para leitores de tela e o bairro e a cidade em #4A5A70.
- Por fim, quando preenchido, o CEP em linha própria (#4A5A70, sem quebra): no meio da frase ele quebraria no hífen.
- Onde a rua aparece com o número ("Rua Anneliese Gellert Krigsner, 2884": rodapé e menu), o número fica preso à última palavra por um espaço não separável: nunca sobra sozinho numa linha.
- Kit "Como chegar", nesta ordem: "Abrir no Google Maps" e "Traçar rota" (botões), depois "Abrir no Waze" e "Copiar endereço" (`.text-button`). O "Copiar endereço" vem por último: ele só aparece com o React e muda de rótulo sozinho, e assim nunca empurra o Waze.
- A confirmação da cópia é anunciada só para leitores de tela (o botão já mostra "Copiado"); a falha aparece por escrito, com o endereço, até a próxima tentativa, e a página rola o mínimo para ela não ficar atrás da barra fixa do WhatsApp.

### Mapa do Google (`.location__map-frame`)

- **Estrutura:** `<div class="location__map requires-js">` com um `<iframe>` do Google Maps, com tela cheia permitida (`allowFullScreen`).
- **Endereço:** `mapaIncorporadoUrl()` em `src/lib/contact.js`. Usa o CID do ponto (`site.mapa.cid`), que mostra a ficha "ClinicCell"; sem CID, nome + endereço. Não precisa de chave de API.
- **Título:** "Mapa do Google com a localização da ClinicCell" (`textos.localizacao.mapa.titulo`).
- **Carregamento:** no HTML o iframe sai sem `src`. O endereço só entra quando a caixa chega a uma tela de distância (`IntersectionObserver` com `rootMargin: '100% 0px'`): nenhuma requisição a terceiros na abertura da página. O `loading="lazy"` do navegador não basta: no computador, ou no celular com 3G, o Chrome já carregaria o mapa na abertura.
- **Sem JavaScript:** a caixa não aparece (`.requires-js` e `@media (scripting: none)`). Até o React assumir, fica oculta, ocupando o lugar. O botão "Abrir no Google Maps" continua sendo o caminho para o mapa.
- **Fundo:** #F5F8FC enquanto o mapa carrega.
- **Geometria por largura:**

| Largura | Moldura |
|---|---|
| Abaixo de 768 | sangra até as bordas, 4:3, altura mínima de 20rem, fios de 1 px #D3DCE8 em cima e embaixo |
| 768 | dentro das margens, 16:10, borda de 1 px #D3DCE8 |
| 1024 | colunas 7–12, estica até a altura da coluna, mínimo de 30rem |

### CTA final

- Plano `.on-field` em #003E87.
- Rótulo "Contato" com porta em #4F7DBD.
- H2 display branco, até 10,3em (≈ 15ch).
- Texto #D6E4F7.
- Botão verde stacked "Falar com um especialista / pelo WhatsApp".
- Linha "WhatsApp" + número como link verde claro (#25D366).

### Rodapé (colofão)

- Fio superior, padding 56/28.
- Logo azul com 56 px de altura e a frase descritiva.
- Blocos com títulos mono em `<h2>`: ENDEREÇO (com "Abrir no Google Maps ↗" e o CEP em linha própria), WHATSAPP e NAVEGAÇÃO (as 6 seções em 2 colunas, linhas de 44 px). A navegação é `<nav aria-label="Rodapé" id="rodape-navegacao">`.
- Barra final: "© {ano} ClinicCell…" e "Voltar ao topo ↑".

### Foto real opcional (Sobre)

- Só renderiza se o arquivo existir. Detectar no build com `import.meta.glob`.
- Proporção 4:3, `object-fit: cover`, raio de 14 px.
- Filete interno de 2 px branco a 8 px da borda, com raio de 6 px: é o contorno do celular do símbolo, a única exceção de arredondado.
- `loading="lazy"`, `width` e `height` declarados.
- `figcaption` factual, escrito pelo proprietário.
- Sem arquivo, nada é renderizado: nem placeholder nem espaço.

---

## 5. Layout por seção

O celular (390 px) vem primeiro; depois 768 e por fim a partir de 1024 (referência em 1440).

### 5.1 Hero

**390 px**
- Padding de 40/48.
- Rótulo com terminal sólido e porta, em 2 linhas: "DESDE 2011 · BAIRRO INÁ" / "SÃO JOSÉ DOS PINHAIS — PR".
- H1 de cerca de 40 px em 3 linhas ("Seu celular / merece cuidado / especializado.").
- Lead em 4 linhas.
- CTA verde stacked de largura total.
- Nota de 15 px.
- "Conhecer serviços ↓" (ou "Ver localização ↓" se nenhuma área de serviço estiver publicada).
- **Plano da marca:** sangra até as bordas, padding 40/margem, só a logo de 232 px e as trilhas no canto superior direito. Endereço, rota e WhatsApp não ficam no plano: estão na Localização, no menu, no rodapé e na barra fixa do WhatsApp.
- **Primeira dobra (390 × 844):**
  - o quê: H1 + lead;
  - onde: rótulo com bairro e cidade;
  - como chamar: botão com "pelo WhatsApp";
  - e o topo do plano com a logo.
- Em 320 × 640, o CTA principal fica inteiro na dobra.

**768**
- Rótulo em 1 linha e H1 em 2 linhas.
- Botão e "Conhecer serviços" (ou "Ver localização") lado a lado, com a nota embaixo.
- Logo com 320 px.

**A partir de 1024**
- Grid de 12. Texto nas colunas 1–7, com padding de 88/88. H1 de 68 a 96 px em 3 linhas.
- Plano nas colunas 8–12, da altura do texto, sangrando até a borda direita da janela:
  - padding 56/0/56/56;
  - logo de 280 a 416 px, centrada na altura do plano;
  - trilhas ocupando o terço direito.
- A espinha nasce no terminal do rótulo.

### 5.2 Destaques

**390 px**
- Faixa #F5F8FC logo abaixo do plano, com padding vertical de 24 px.
- 4 itens em 2 × 2, separados por fios: ícone, valor e texto em coluna.

**A partir de 1024**
- 4 colunas separadas por fios verticais, padding vertical de 32 px. A espinha atravessa a faixa.
- A partir de 1280, o ícone passa para a esquerda do valor.

### 5.3 Serviços

**390 px**
- Rótulo, H2 "Conserto de celular em São José dos Pinhais" e introdução.
- Tabela-lista, 32 px abaixo: uma linha por área, com a imagem em cima, o H3, a lista dos serviços e "Pedir orçamento".
- "Seu caso não está na lista?".

**768**
- Imagem de até 13rem à esquerda; H3 e link na primeira linha; serviços em 1 coluna embaixo.

**A partir de 1024**
- H2 nas colunas 1–7 e introdução nas colunas 9–12, alinhada à base do H2.
- Cabeçalho da tabela (Área · Serviços · Orçamento) 56 px abaixo.
- Tabela em largura total: imagem (até 12rem) · área · serviços (1 coluna; 2 a partir de 1280) · orçamento.

### 5.4 Sobre

**390 px**
- Rótulo.
- H2 = kicker "DESDE" + numeral "2011" (cerca de 203 px).
- Régua 32 px abaixo, com "HOJE" na ponta.
- Texto do briefing em `--fs-stand`, 40 px abaixo.

**A partir de 1024**
- Numeral nas colunas 1–7.
- Texto nas colunas 8–12, alinhado à base do numeral.
- Régua em largura total na linha 3, 48 px abaixo.
- Foto opcional: depois do texto no celular; nas colunas 8–12 numa linha nova no desktop.

### 5.5 Diferenciais

**390 px**
- Rótulo, H2 "Por que escolher a ClinicCell" e introdução ("Conserto com garantia, do simples ao avançado, numa loja de verdade no bairro Iná.").
- Lista com barramento vertical. Quatro motivos, todos confirmados (`textos.diferenciais`): garantia de 90 dias; do simples ao avançado (iPhone e Android, da troca de tela à placa-mãe); loja física no Iná (com "Ver como chegar"); orçamento pelo WhatsApp (com o número em verde). "Desde 2011" não entra: já está no hero, na logo e no Sobre.
- Cabeça do item: ícone de 24 + H3 em linha.
- Texto até 26,1em (≈ 38ch).

**768:** 2×2, sem barramento. Cada item usa duas linhas da lista (`grid-template-rows: subgrid`): os títulos da mesma fileira ficam com a mesma altura e os textos começam juntos, mesmo quando só um título quebra. Sem suporte a subgrid, cada item segue sozinho.

**A partir de 1024**
- H2 "Por que escolher a ClinicCell" nas colunas 1–7 e introdução nas colunas 9–12, alinhada à base do H2 (como em Serviços).
- 4 colunas 72 px abaixo, com barramento horizontal, T vindo da espinha e cruz sólida na junção.
- Ícone acima do H3. Títulos com altura mínima de 2 linhas e o mesmo subgrid: os quatro textos começam na mesma linha.

### 5.6 Localização

**390 px**
- Rótulo e H2 "Assistência técnica de celular no bairro Iná".
- Nº 2884, rua, bairro/cidade e CEP (quando preenchido).
- Ficha: WhatsApp e Horário.
- "Abrir no Google Maps" (primário) e "Traçar rota" (secundário) empilhados.
- "Abrir no Waze" e "Copiar endereço".
- Região de anúncio (sem altura; só a falha da cópia aparece por escrito).
- Mapa do Google que sangra até as bordas, em 4:3 (mínimo de 20rem).

**768**
- Botões em linha.
- Mapa dentro das margens, com borda, em 16:10.

**A partir de 1024**
- H2 nas colunas 1–9.
- Informações nas colunas 1–5.
- Mapa nas colunas 7–12, esticado (mínimo de 30rem).

### 5.7 Dúvidas frequentes

**390 px**
- Rótulo "Dúvidas" e H2 "Dúvidas frequentes".
- Lista de perguntas 32 px abaixo, em linhas com fio, todas fechadas; o "+" fica à direita da pergunta.

**A partir de 1024**
- H2 em largura total.
- Lista em 2 colunas (6 + 5 perguntas), 40 px abaixo do H2.

### 5.8 CTA

**390 px**
- Plano azul.
- H2 de 32 a 35 px em 2 linhas.
- Texto.
- Botão verde de largura total.
- Linha com o número.

**A partir de 1024**
- Rótulo e H2 nas colunas 1–7.
- Bloco lateral nas colunas 8–12, ocupando as linhas 1–2 e alinhado pela base ao H2.

### 5.9 Rodapé

- **390 px:** blocos empilhados.
- **768:** marca em largura total, depois endereço (3), WhatsApp (2) e navegação (3).
- **A partir de 1024:** marca 1–3, endereço 4–7, WhatsApp 8–9, navegação 10–12. A espinha termina no terminal sólido.

### 5.10 Página 404

- Mesmo header e rodapé.
- Bloco com o padding do hero:
  - rótulo "ERRO 404" com terminal sólido;
  - H1 "Página não encontrada";
  - texto;
  - primário "Ir para a página inicial" (`House`);
  - link-texto "Falar pelo WhatsApp" (`MessageCircle`).
- Sem plano azul nem espinha, inclusive no rodapé (sem trilha nem terminal). O terminal do rótulo "ERRO 404" fica como no hero.
- `<meta name="robots" content="noindex">`.

---

## 6. Iconografia

Todos os ícones vêm de `lucide-react` 1.76, com `aria-hidden` e cor `currentColor` ou #0750A5. Traço 2 na UI (inclusive o "+" das Dúvidas); traço 1,5 nos ícones de conteúdo (24 px). As áreas de serviço não têm ícone: cada uma tem uma ilustração (ver "Ilustrações das áreas de serviço").

| Uso | Ícone |
|---|---|
| WhatsApp (todos os CTAs, barra fixa, ficha) | `MessageCircle` |
| Menu / Fechar | `Menu` / `X` |
| Conhecer serviços, Ver localização | `ArrowDown` |
| Link externo, "Pedir orçamento" | `ArrowUpRight` |
| Voltar ao topo | `ArrowUp` |
| Abrir no Google Maps | `MapPin` |
| Traçar rota | `Navigation` |
| Abrir no Waze | `CarFront` |
| Copiar endereço / copiado | `Copy` → `Check` (o ícone fica num `<span>` fixo e os rótulos em outros: a troca nunca usa um nó de texto solto, que o tradutor automático do navegador substitui) |
| Horário | `Clock` |
| Seu caso não está na lista? | `MessageCircleQuestionMark` |
| Destaque "90 dias de garantia" | `ShieldCheck` |
| Destaque "iPhone e Android" | `Smartphone` |
| Destaque com o total de serviços | `Wrench` |
| Destaque "Parcelamento no cartão" | `CreditCard` |
| Dúvidas: abrir / fechar | `Plus` (gira 45° e vira "×") |
| Diferencial "Garantia de 90 dias" | `ShieldCheck` |
| Diferencial "Do simples ao avançado" | `CircuitBoard` |
| Diferencial "Loja física no Iná" | `Store` |
| Diferencial "Orçamento pelo WhatsApp" | `MessageCircle` |
| 404: página inicial | `House` |

O Lucide não tem logos de marca. O WhatsApp é sempre `MessageCircle` acompanhado da palavra "WhatsApp".

---

## 7. Movimento

- Cores de botões, links e linhas mudam em 150 ms.
- A seta do serviço desloca 2 px no hover.
- O "+" das Dúvidas gira 45° em 150 ms; a resposta abre sem animação.
- A barra fixa do WhatsApp sobe em 200 ms.
- `scroll-behavior: smooth` só com `prefers-reduced-motion: no-preference`.
- Com `reduce`, as durações vão a 0s.
- Sem animação de entrada, parallax, contador, carrossel, trilha "desenhando" ou biblioteca de animação.

---

## 8. Acessibilidade (WCAG 2.2 AA)

**Verificado no site (`npm run qa`):**
- axe-core (A/AA 2.0–2.2 + best-practice): 0 violações em 390 e 1280, e também com a barra fixa do WhatsApp visível, com o menu aberto e depois do "Copiar endereço".
- Um H1, um H2 por seção e H3 por item; títulos do rodapé em H2. A faixa de destaques tem um H2 só para leitores de tela.
- Alvos de toque ≥ 44 px, exceto os `.link--tap` (~38 px, dentro do 2.5.8) e os links dentro de frases.
- Sem rolagem horizontal de 320 a 1920, nem com o espaçamento de texto ampliado (1.4.12), nem com a fonte do navegador ampliada no desktop.
- Com o espaçamento 1.4.12 a 320 px, Tab e Shift+Tab pela página inteira: nenhum foco fica escondido atrás do header fixo ou da barra fixa do WhatsApp (2.4.11).
- O foco volta ao "Menu" depois do Esc e vai para a seção escolhida no menu. Girando o aparelho com o menu aberto, o foco não cai no `<body>` e a página continua no trecho que a pessoa lia.
- O foco no link "Menu" de antes da hidratação passa ao botão quando o React assume.
- Tab preso no diálogo.
- A barra fixa do WhatsApp fica oculta sem JS, no topo da página e no zoom de 400% (quando o header também deixa de ser fixo).

Testes automáticos não substituem uma auditoria manual com leitores de tela reais.

**Regras:**
- Landmarks: `header`, `nav` "Principal", `main#conteudo`, `aside` "Atalho para o WhatsApp" (barra fixa), `footer` com `nav` "Rodapé". Skip link "Pular para o conteúdo".
- Destinos de âncora (`main`, as seções do menu e a navegação do rodapé) têm `tabindex="-1"` e não desenham contorno ao receber foco.
- A região `aria-live` do "Copiar endereço" fica sempre renderizada (sem altura): uma região que nasce junto com a mensagem não é anunciada. Cada anúncio entra num nó novo, então a mesma mensagem repetida é anunciada de novo.
- Hover nunca carrega informação e só existe com `(hover: hover)`.
- Elementos decorativos ficam com `aria-hidden`: terminais, régua e trilhas. As imagens das áreas de serviço têm `alt=""`: o H3 ao lado já diz a área.
- O link "Pedir orçamento" de cada área diz qual é a área no nome acessível ("Pedir orçamento de tela e carcaça pelo WhatsApp (abre em nova aba)"): uma lista de links iguais não ajudaria quem navega por links.
- As Dúvidas usam `<details>`/`<summary>` nativos, sem `role` nem `aria-expanded` próprios: o navegador já dá teclado e estado aberto/fechado.
- O iframe do mapa tem `title` ("Mapa do Google com a localização da ClinicCell").
- Links externos levam "(abre em nova aba)".
- Listas estilizadas levam `role="list"`, porque o WebKit remove a semântica quando há `list-style: none`.
- `scroll-padding-top` = header + 16 px abaixo de 1024 e header + 24 px a partir de 1024 (16 px quando o header não é fixo, em telas muito baixas). `scroll-padding-bottom` = altura da barra fixa do WhatsApp (`--fab-h`, ≈ 82 px) + área segura + 1rem abaixo de 1024 (≈ 98 px sem área segura; ou a medida, quando a barra muda de altura) e 1rem a partir de 1024, para o anel de foco não ser cortado na borda da janela (2.4.11).
- Contraste forçado (Windows): as logos mantêm o fundo da marca (`forced-color-adjust: none`), senão a branca some nos temas claros e a azul nos escuros.
- `lang="pt-BR"`.
- `color-scheme: light`.

---

## 9. O que NÃO fazer

- Cards arredondados, tiles de ícone, ícones em círculos ou steppers.
- Gradientes, glassmorphism, glow ou sombras de elevação.
- Um terceiro plano azul, ou uso do #0D64C5 ou do #64748B.
- Mono em texto corrido, títulos, botões ou telefone.
- Logo redesenhada, recolorida, distorcida, cortada ou com mais de 470 px de largura.
- Fotos de banco de imagens ou placeholder de foto em produção (as ilustrações dos serviços são desenhos feitos para o site, não placeholders).
- Nota no Google, número de aparelhos atendidos, "laboratório próprio", avaliações, prazos ou preços antes de confirmados pelo proprietário (`docs/pendencias.md`).
- Mapa com ruas, rota ou rosa dos ventos inventadas.
- Iframe do Google Maps na carga inicial.
- Barra fixa do WhatsApp sobre o CTA final ou sobre o rodapé.
- Hover obrigatório para entender qualquer coisa.
- Animações de entrada.
- Textos de marketing genéricos, ou "aberto agora".
