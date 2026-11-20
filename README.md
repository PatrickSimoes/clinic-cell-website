# Site da ClinicCell

Site institucional da **ClinicCell**, assistência técnica de celulares desde 2011, com atendimento no bairro Iná, em São José dos Pinhais (PR).

O site é uma página única, pensada primeiro para o celular. O objetivo é levar o visitante ao WhatsApp e aparecer nas buscas locais. Ele é publicado de graça no **GitHub Pages**, sem servidor e sem banco de dados.

- **Stack:** React 19 + JavaScript + Vite 8.
- **HTML pronto no build.** O HTML de cada página é gerado no build, com o conteúdo completo, para o Google e para as prévias de link do WhatsApp. Depois, o React assume a página no navegador (hidratação).
- **Qualidade medida:**
  - Lighthouse 100 em acessibilidade, boas práticas e SEO. Em desempenho, 100 no desktop e mediana de 100 no celular. Entre rodadas no celular a nota varia de 95 a 100, conforme a primeira montagem da página caia antes ou depois da primeira pintura.
  - Acessibilidade: 0 violações no axe-core (regras WCAG 2.0–2.2 A/AA e boas práticas) em vários estados da página, mais testes automatizados de teclado, foco, menu, zoom e espaçamento de texto. Testes automáticos não substituem uma auditoria manual.
  - Nenhuma requisição a serviços de terceiros na abertura da página. O mapa do Google só carrega quando a Localização chega perto.

---

## Sumário

1. [Rodar no computador](#1-rodar-no-computador)
2. [Editar o conteúdo](#2-editar-o-conteúdo)
3. [Publicar no GitHub Pages](#3-publicar-no-github-pages)
4. [Publicar atualizações](#4-publicar-atualizações)
5. [Depois de publicar: SEO local](#5-depois-de-publicar-seo-local)
6. [Verificações de qualidade](#6-verificações-de-qualidade)
7. [Estrutura do projeto](#7-estrutura-do-projeto)
8. [Marca e design](#8-marca-e-design)

---

## 1. Rodar no computador

Requisito: Node.js 22.22+ ou 24.8+ (recomendado: 24, como em `.nvmrc`).

```bash
npm install        # instala as dependências (uma vez)
npm run dev        # abre o site em http://localhost:5173 com recarga automática
```

No modo `dev`:
- a página é exatamente a que vai para o ar: só aparecem as áreas de serviço com `confirmado: true`;
- para ver a página de erro, acesse `http://localhost:5173/?pagina=404`;
- erros nos dados de `src/config/site.js` e `src/content/servicos.js` (dia da semana inválido, telefone incoerente, área de serviço sem imagem...) aparecem no terminal.

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/`, com HTML pré-renderizado, 404, sitemap, robots e manifest |
| `npm run check` | Lint + build + verify: o mesmo que o CI faz antes de publicar (exceto o endereço público) |
| `npm run preview` | Serve o `dist/` localmente. Se o build usou `BASE_PATH`, rode o preview com o mesmo `BASE_PATH` |
| `npm run lint` | Confere o código (ESLint) |
| `npm run verify` | Confere o build: dados do site, SEO, links do WhatsApp, dados estruturados, sitemap, robots, HTML válido |
| `npm run qa` | Testa o build no Chrome. Detalhes na [seção 6](#6-verificações-de-qualidade) |
| `npm run lighthouse` | Lighthouse no celular e no desktop, com relatórios em `qa-output/lighthouse/` |
| `npm run brand:assets` | Gera de novo as versões da logo, os favicons e os ícones a partir da logo original |
| `npm run og:image` | Gera de novo a imagem de compartilhamento (`public/og-image.jpg`) |
| `npm run fonts:fallbacks` | Gera de novo as fontes de reserva com métricas ajustadas (evita "pulo" de layout) |
| `npm run fonts:subset` | Gera de novo as fontes do site (`src/assets/fonts/`) só com os pesos usados. Precisa de Python 3.10+ e `pip install fonttools brotli`; os arquivos ficam versionados, o build e o CI não precisam de Python |

Os comandos `npm run ...` funcionam em qualquer terminal (PowerShell, cmd ou Git Bash). Só os exemplos com variáveis de ambiente, como `SITE_URL=... npm run build`, são de bash; o equivalente em PowerShell aparece ao lado.

`qa`, `lighthouse` e `og:image` usam o Chrome ou o Edge instalado. Se não for encontrado, defina `CHROME_PATH`.

---

## 2. Editar o conteúdo

Todos os textos e dados ficam em **dois lugares**, `src/config/` e `src/content/`; as imagens, em `src/assets/`. Não há telefone, endereço ou nome da empresa espalhados pelo código.

| O que mudar | Onde |
|---|---|
| Nome, WhatsApp, endereço, CEP, coordenadas, mapa, horários, redes sociais | `src/config/site.js` |
| Mensagens pré-preenchidas do WhatsApp (por contexto) | `src/config/site.js` → `whatsapp.mensagens` |
| Serviços (áreas, lista de serviços, mensagem do WhatsApp, confirmação) | `src/content/servicos.js` |
| Imagem de cada área de serviço | `src/assets/servicos/<id da área>.svg` (ou uma foto `.webp`/`.jpg`) |
| Textos das seções (hero, destaques, serviços, sobre, diferenciais, localização, dúvidas, CTA, rodapé, 404) | `src/content/textos.js` |
| Title e description | `src/content/seo.js` |
| Seções do menu (ordem e nomes) | `src/content/secoes.js` |

**O build confere o preenchimento desses dados.** Estes erros fazem o build falhar com uma mensagem dizendo o que corrigir, e o site não é publicado:
- um dia da semana inválido ou repetido;
- dois horários que se sobrepõem no mesmo dia;
- um horário fora do formato `"HH:MM"`;
- um CEP sem hífen;
- um telefone com um dígito trocado entre os campos;
- uma área de serviço com `id` fora do formato (só letras minúsculas sem acento, números e hífens) ou repetido;
- uma área sem nome, sem mensagem do WhatsApp ou com a lista de serviços vazia;
- o mesmo serviço escrito duas vezes, na mesma área ou em áreas diferentes;
- `confirmado` com aspas (`'true'` em vez de `true`);
- uma área sem imagem em `src/assets/servicos/`.

O build não sabe se um dado está **certo**: um número errado digitado igual nos três campos passa. Confira telefone e horários antes de publicar.

### WhatsApp e imagem de compartilhamento

O número aparece em três campos de `site.whatsapp`:
- `numero`: o link `wa.me`;
- `exibicao`: o que o visitante vê;
- `internacional`: os dados estruturados.

O build confere se os três são o mesmo número. A diferença de um 9 entre o link e a exibição é aceita de propósito (ver o comentário no arquivo).

A imagem que aparece ao compartilhar o link (`public/og-image.jpg`) **mostra o telefone e o endereço**. Depois de mudar qualquer um deles:

```bash
npm run og:image
```

Commite os dois arquivos gerados: `public/og-image.jpg` e `scripts/og-image.dados.json`. Se a imagem ficar desatualizada, ou se um dos dois for commitado sem o outro, o `verify` reprova o build. A URL publicada leva um código da versão (`og-image.jpg?v=...`), então WhatsApp e Facebook buscam a imagem nova em vez de reaproveitar a antiga.

### Serviços: áreas e lista do proprietário

Os serviços ficam em `src/content/servicos.js` → `areasDeServico`. São os **25 serviços** da lista enviada pelo proprietário (confirmada em 20/11/2026), com os nomes exatamente como ele escreveu, agrupados em **5 áreas**:

| Área (`id`) | Serviços |
|---|---|
| Tela e carcaça (`tela-e-carcaca`) | 5 |
| Bateria e carga (`bateria-e-carga`) | 4 |
| Câmera, som e sensores (`camera-som-e-sensores`) | 6 |
| Placa e reparos avançados (`placa-e-reparos-avancados`) | 6 |
| Sistema e software (`sistema-e-software`) | 4 |

O agrupamento e a ordem dentro de cada área são só organização da página. Cada área tem:
- `id`: só letras minúsculas sem acento, números e hífens. Vira a âncora `#servico-<id>` e o nome da imagem;
- `nome`: o título da linha na tabela (H3);
- `servicos`: a lista dos serviços, na ordem em que aparecem;
- `mensagemWhatsApp`: a mensagem pronta do link "Pedir orçamento" da área;
- `confirmado`: `true` só depois de confirmado pelo proprietário. Hoje as 5 áreas estão com `true`.

**Para incluir um serviço**, escreva o nome na lista `servicos` da área certa. **Para criar uma área**, copie uma, troque `id`, `nome`, `servicos` e `mensagemWhatsApp` e coloque a imagem dela em `src/assets/servicos/` (ver abaixo).

O que acontece com cada valor de `confirmado`:
- **`true`**: a área aparece na tabela de serviços, com a imagem, a lista e o link verde "Pedir orçamento", e entra nos dados estruturados (um catálogo `OfferCatalog` por área, dentro de `hasOfferCatalog`, com os serviços dela). A contagem da faixa de destaques ("25 serviços") e a resposta "Quais serviços a ClinicCell faz?" das Dúvidas se atualizam sozinhas.
- **`false`**: a área não aparece na página nem nos dados estruturados. O texto dela continua no JavaScript público do site, então não escreva ali nada que não possa ser lido por qualquer pessoa.
- **Nenhuma área confirmada:** a seção mostra um convite para descrever o defeito pelo WhatsApp; o botão secundário do topo troca "Conhecer serviços" por "Ver localização"; o item com a contagem sai dos destaques e a pergunta sobre os serviços sai das Dúvidas. Tudo volta sozinho quando uma área for confirmada.

`npm run dev` mostra exatamente o que vai para o ar: só as áreas com `confirmado: true`.

Escreva os nomes como a loja fala. Não prometa prazo, preço nem "peças originais" sem confirmação (ver [o que já está confirmado](#o-que-já-está-confirmado)).

#### Imagens das áreas

Cada área tem uma imagem em `src/assets/servicos/<id da área>.svg`, mostrada ao lado do título (ligada à área por `src/lib/imagens-de-servico.js`). Hoje são **ilustrações feitas para o site** (`.svg`, 480 × 300, proporção 16:10). A imagem é decorativa (`alt=""`): o título ao lado já diz o que é.

Para trocar a ilustração de uma área por uma **foto real**:
1. Salve a foto na mesma pasta, com o `id` da área como nome: por exemplo, `src/assets/servicos/tela-e-carcaca.webp`. Também são aceitos `.jpg`, `.jpeg`, `.png` e `.avif`.
2. Use proporção 16:10, com cerca de 960 × 600 px. Uma foto em outra proporção é cortada no centro.

A foto tem prioridade sobre a ilustração: o `.svg` pode continuar na pasta. Use foto da própria loja, nunca de banco de imagens. Se uma área ficar sem imagem nenhuma, o build falha.

### O que já está confirmado

Além dos dados de `src/config/site.js`, dos textos do briefing e da lista de serviços, o site só afirma o que a própria loja escreveu na descrição do Perfil da Empresa no Google (recebida em 20/11/2026):
- garantia de 90 dias;
- conserto de iPhone, Samsung, Motorola e outras marcas;
- loja física;
- acessórios;
- parcelamento no cartão.

A descrição também fala em "atendimento rápido". O site não usa essa expressão, porque é uma promessa de prazo.

Os horários também estão confirmados (os do Perfil no Google, em `src/config/site.js`). Ainda **não** podem aparecer: prazos, preços, "peças originais", "orçamento grátis", nota no Google, número de aparelhos atendidos, "laboratório próprio" e avaliações de clientes. Cada um está em `docs/pendencias.md`.

### Destaques e Dúvidas frequentes

**Destaques** (faixa logo abaixo do topo): `src/content/textos.js` → `destaques`. São 4 itens, cada um com ícone, valor e uma linha de texto:
- "90 dias de garantia";
- "iPhone e Android" (Samsung, Motorola e outras marcas);
- "25 serviços". Esse total é contado a partir das áreas publicadas, não digitado;
- "Parcelamento no cartão".

"Desde 2011" não entra na faixa: já aparece duas vezes logo acima (rótulo do topo e logo).

O ícone é o nome de um ícone do `lucide-react`; um ícone novo também precisa entrar no mapa `ICONES` de `src/sections/Highlights.jsx`. A faixa foi desenhada para 4 itens (2 × 2 no celular, 4 colunas no computador): um quinto item, como a nota no Google, pede rever o layout.

**Dúvidas frequentes** (seção "Dúvidas", entre Localização e Contato): `src/content/textos.js` → `duvidas`. São 11 perguntas, que abrem e fecham sem JavaScript: orçamento, garantia, marcas, parcelamento, serviços, celular que molhou, celular que não liga, troca só do vidro, acessórios, endereço e horário.
- Só respostas com fatos confirmados. Prazo e preço entram quando o proprietário confirmar.
- Três respostas se atualizam sozinhas: a dos serviços (total e áreas, de `servicos.js`), a do endereço (de `site.js`) e a do horário ("Segunda a sexta, das 9h às 19h, e sábado, das 9h às 16h. Domingo, fechado.", montada a partir de `horarios`; com `horarios: null`, "Confirme pelo WhatsApp antes de vir.").
- O link no fim de uma resposta é `link.whatsapp`, com o nome de uma mensagem de `site.whatsapp.mensagens` (link verde), ou `link.secao`, com o `id` de uma seção da página.

### Horários e redes sociais

Os horários estão em `src/config/site.js`, iguais aos do Perfil da Empresa no Google (conferidos em 20/11/2026). Se mudarem no Google, mude aqui também:

```js
horarios: [
  { dias: ['segunda', 'terca', 'quarta', 'quinta', 'sexta'], abre: '09:00', fecha: '19:00' },
  { dias: ['sabado'], abre: '09:00', fecha: '16:00' },
],
```

- Os dias podem ser escritos com ou sem acento (`'terça'` ou `'terca'`).
- Os horários usam o formato 24 h com dois dígitos (`'09:00'`, não `'9h'`).

- Dia que não aparece na lista é mostrado como fechado ("Domingo · fechado").

Com isso, o site mostra "Segunda a sexta · 9h às 19h", "Sábado · 9h às 16h" e "Domingo · fechado" na Localização, a resposta sobre horário das Dúvidas mostra os mesmos horários e o Schema.org recebe `openingHoursSpecification`. Com `horarios: null`, o site orienta a consultar o horário pelo WhatsApp e não publica horário nos dados estruturados. O site **nunca** mostra "aberto agora": ele é estático e o horário pode ter exceções.

As redes sociais (`redesSociais`) ficam vazias até serem confirmadas.

### Foto real no Sobre (opcional)

Para incluir uma foto real na seção "Sobre" (as fotos dos serviços estão em [Imagens das áreas](#imagens-das-áreas)):
1. Salve o arquivo como `src/assets/fotos/sobre.webp`. Também são aceitos `.jpg`, `.png` e `.avif`. Use proporção 4:3, com cerca de 1200 × 900 px.
2. Preencha `alt` (obrigatório: o `verify` reprova a foto sem descrição) e `legenda` em `src/content/textos.js` → `sobre.foto`, descrevendo só o que aparece na foto.

Sem o arquivo, nada é exibido. Com ele, a foto também entra nos dados estruturados. Não use foto de banco de imagens.

---

## 3. Publicar no GitHub Pages

A publicação é automática pelo GitHub Actions (`.github/workflows/deploy.yml`).

### Antes: em que endereço o site vai ficar

O Google só mostra o ícone (favicon) e o nome "ClinicCell" nos resultados para sites na **raiz** de um endereço. Num subcaminho, como `https://<usuario>.github.io/clinic-cell/`, o resultado aparece com ícone genérico e o nome do servidor. Decida o endereço **antes** de cadastrá-lo no Perfil da Empresa no Google:

- **Domínio próprio** (ex.: `www.cliniccell.com.br`), configurado como em [Domínio próprio](#domínio-próprio-ex-wwwcliniccellcombr). É a melhor opção.
- **Sem custo:** publicar a partir de um repositório chamado `<conta>.github.io`, de preferência numa organização do GitHub com o nome da marca (ex.: `cliniccell.github.io`). O site fica na raiz, sem mudar código.
- **Repositório comum** (ex.: `clinic-cell`): funciona, com a limitação acima.

### Primeira publicação

1. **Crie o repositório** no GitHub. Pode ser público ou privado, se o plano permitir Pages privado.
2. **Ative o Pages pelo Actions:** no repositório, vá em **Settings → Pages → Build and deployment → Source** e escolha **GitHub Actions**.
3. **Envie o código** pela branch `main`, a partir desta pasta:
   ```bash
   git init
   git add .
   git commit -m "Site institucional da ClinicCell"
   git branch -M main
   git remote add origin https://github.com/<usuario>/<repositorio>.git
   git push -u origin main
   ```
4. **Acompanhe o deploy** na aba **Actions**. O workflow "Publicar no GitHub Pages" roda lint, build, verificações, QA e publicação.
   - Se o push foi feito antes do passo 2, a primeira execução falha com "Get Pages site failed". É esperado: ative o Pages e rode de novo em Actions → Publicar no GitHub Pages → **Run workflow**.
5. **Acesse o site** no endereço que o GitHub mostra.

### Base path: nada a configurar

O workflow descobre sozinho o endereço público e o base path (`/<repositorio>/` ou nenhum) com `actions/configure-pages`. Com isso, links, canonical, Open Graph, sitemap e dados estruturados saem certos em qualquer caso, sempre em `https`.

#### Simular o endereço publicado

Para simular localmente um repositório de projeto:

```bash
# Git Bash / macOS / Linux (no Git Bash, escreva o BASE_PATH sem a barra inicial)
SITE_URL=https://usuario.github.io BASE_PATH=nome-do-repo/ npm run build
BASE_PATH=nome-do-repo/ npm run preview
```

```powershell
# PowerShell
$env:SITE_URL='https://usuario.github.io'; $env:BASE_PATH='/nome-do-repo/'
npm run build; npm run preview
Remove-Item Env:SITE_URL, Env:BASE_PATH   # as variáveis continuam valendo na janela até serem removidas
```

O Git Bash converte `/nome` em um caminho do Windows, e o build avisa se isso acontecer. O endereço público precisa ser `https`; endereços locais (`localhost`, IP da rede) podem usar `http`.

### Domínio próprio (ex.: `www.cliniccell.com.br`)

Siga nesta ordem, para o site não ficar quebrado durante a troca:

1. **Verifique o domínio na sua conta** do GitHub (Settings da conta ou da organização → Pages → Add a domain, com um registro `TXT`). Isso impede que outra pessoa use o domínio no GitHub Pages.
2. **Crie o DNS** no provedor do domínio:
   - para `www`: `CNAME` apontando para `<usuario>.github.io`;
   - para o domínio sem `www`: os registros `A`/`AAAA` do GitHub Pages.
3. **Salve o domínio** no repositório: **Settings → Pages → Custom domain**.
4. **Rode o workflow na hora** (Actions → Publicar no GitHub Pages → Run workflow). Até isso, o domínio serve a versão antiga, feita para o subcaminho: sem logo, sem JavaScript e com as fontes de reserva.
5. **Marque Enforce HTTPS** quando a opção aparecer. O certificado pode levar até 24 h e não exige novo deploy.

**Não é preciso mudar código.** O workflow passa a usar o domínio novo, sem base path e sempre em `https`. Também não é preciso arquivo `CNAME`: em publicações pelo Actions, o GitHub o ignora.

### Cache e compressão

O GitHub Pages não permite configurar cabeçalhos:
- os arquivos ficam em cache por 10 minutos;
- são enviados com gzip, sem brotli.

O efeito é pequeno: cerca de 13 KB a mais na primeira visita e uma revalidação rápida para quem volta.

Com domínio próprio, dá para colocar o Cloudflare (plano gratuito) na frente:
1. Deixe o DNS em "DNS only" até o Pages emitir o certificado e o Enforce HTTPS estar marcado.
2. Só então ligue o proxy, com SSL "Full (strict)".
3. Ative o brotli.
4. Crie uma regra de cache de 1 ano **só** para `/assets/*`, arquivos que têm código de versão no nome.

---

## 4. Publicar atualizações

1. Edite os arquivos de conteúdo ([seção 2](#2-editar-o-conteúdo)).
2. Confira localmente:
   ```bash
   npm run dev      # visual
   npm run check    # lint + build + verify, como o CI
   ```
3. Envie para a branch `main`:
   ```bash
   git add .
   git commit -m "Atualiza horários de atendimento"
   git push
   ```
4. O GitHub Actions publica em alguns minutos. Se alguma verificação falhar, o site **não** é publicado e a versão anterior continua no ar. O motivo aparece no log do Actions.

Mudanças só em arquivos `.md` ou em `docs/` não republicam o site.

**Pull requests** para a `main` passam pelas mesmas verificações, sem publicar. O **Dependabot** (`.github/dependabot.yml`) abre uma vez por mês pull requests agrupados com atualizações das dependências e das actions.

**Republicação anual:** de 1º a 3 de janeiro, o workflow "Republicação anual" (`.github/workflows/republicacao-anual.yml`) dispara a publicação para atualizar o ano do copyright e a régua "2011 → hoje" no HTML. No navegador, o ano já é corrigido sozinho depois da virada, mesmo sem republicar.
- Em repositórios públicos sem commits por 60 dias, o GitHub desativa workflows agendados. Ele fica num arquivo separado justamente para isso: só ele é desativado, nunca a publicação a cada push.
- Para reativar: **Actions → Republicação anual → Enable workflow**. Depois, se quiser, **Run workflow**.

---

## 5. Depois de publicar: SEO local

1. **Google Search Console** ([search.google.com/search-console](https://search.google.com/search-console)):
   - **Com domínio próprio:** crie uma propriedade do tipo **Domínio** e verifique pelo DNS.
   - **Sem domínio próprio** (`<conta>.github.io` ou `<usuario>.github.io/<repositorio>/`): a propriedade Domínio exige um registro no DNS, que o `github.io` não permite. Crie uma propriedade do tipo **Prefixo do URL** com o endereço completo do site (ex.: `https://cliniccell.github.io/`) e escolha o método **Arquivo HTML**:
     1. salve o arquivo baixado (`google....html`) em `public/`, sem renomear;
     2. faça push e espere o deploy;
     3. clique em **Verificar**.
   - Depois, envie o sitemap: `https://<endereço-do-site>/sitemap.xml`.

   O Google só lê o `robots.txt` na raiz do endereço (ex.: `https://cliniccell.github.io/robots.txt`). Num subcaminho ele não vale, mas o envio do sitemap pelo Search Console resolve.
2. **Perfil da Empresa no Google** do ponto "ClinicCell". Detalhes do estado atual em `docs/pendencias.md`, item 4:
   - informe o endereço do site e escolha como categoria principal a de **conserto/assistência de celulares**;
   - mantenha nome, endereço e telefone **iguais** aos do site. A consistência ajuda o ranqueamento local. O telefone certo é o de 9 dígitos, **(41) 99507-9359**: nunca troque o do Perfil por um formato antigo.
3. **Avaliações:** depois de cada atendimento, o proprietário pode enviar pelo WhatsApp o link de avaliação no Google:
   `https://search.google.com/local/writereview?placeid=ChIJXWmYfJrx3JQRzvMjdIG0urE`.
   Não ofereça desconto ou brinde em troca e não peça só a clientes satisfeitos: as regras do Google proíbem.
   Nota e avaliações só aparecem no site depois de confirmadas (`docs/pendencias.md`, itens 7 e 10).
4. **Valide os dados estruturados** em [Rich Results Test](https://search.google.com/test/rich-results) e [validator.schema.org](https://validator.schema.org) com a URL publicada.
5. **Teste a prévia de link:** mande o endereço numa conversa do WhatsApp. A imagem e o título devem aparecer.

---

## 6. Verificações de qualidade

**Em todo deploy e pull request (CI):**
- `npm run lint`;
- `npm run build`, que interrompe o build se os dados de `site.js` ou `servicos.js` estiverem mal preenchidos, inclusive se uma área de serviço estiver sem imagem;
- `npm run verify`, que confere:
  - dados editados à mão (WhatsApp, endereço, CEP, horários, redes sociais, serviços);
  - title e description;
  - canonical e Open Graph com URL absoluta, imagem existente, atualizada (telefone e endereço) e igual à registrada em `scripts/og-image.dados.json`;
  - CSS embutido e preload da fonte principal;
  - um único H1 e hierarquia de títulos;
  - `alt`, `width` e `height` das imagens (e descrição obrigatória na foto real);
  - texto sem "NaN", "undefined" ou "[object Object]";
  - âncoras internas;
  - todos os links do WhatsApp (número e mensagem);
  - links do Maps, da rota e do Waze;
  - mapa do Google: único iframe da página, com título e sem `src` no HTML (não carrega na abertura), com endereço apontando para o CID do ponto;
  - JSON-LD (LocalBusiness com endereço, telefone e coordenadas; um catálogo por área, com os mesmos nomes de área e de serviço das áreas confirmadas);
  - serviços: cada área confirmada publicada, com os serviços na ordem do cadastro, e nenhuma área não confirmada no HTML;
  - 404 com `noindex`;
  - sitemap, robots e manifest;
  - HTML válido (html-validate).
- `npm run qa` com o Chrome do servidor do GitHub. Por enquanto é **informativo**: uma falha aparece no log, mas não bloqueia a publicação.

**Localmente, antes de mudanças grandes:**
- `npm run qa` testa no Chrome:
  - 9 larguras de tela, de 320 a 1920 px, sem rolagem horizontal;
  - erros de console ou de hidratação e requisições a terceiros na abertura da página;
  - mapa do Google, trocado por uma página local mínima (o QA não depende da rede): com título, no ponto da loja (CID) e carregado só perto da Localização, nem na abertura nem a duas telas de distância;
  - todo botão ou link que abre o WhatsApp em verde (home e 404);
  - axe-core no topo da página, com a barra fixa do WhatsApp visível, com o menu aberto e depois do "Copiar endereço";
  - teclado, "pular para o conteúdo" e alvos de toque;
  - menu mobile: abrir, Esc, devolução do foco, âncoras, foco na seção escolhida e tablet e celular girados com o menu aberto, sem perder o trecho que se lia;
  - logo e "Voltar ao topo" levando ao topo;
  - "Copiar endereço" com anúncio para leitores de tela, sem deslocar a página, inclusive com a página traduzida pelo navegador e com a cópia bloqueada (o endereço aparece por escrito, à vista);
  - WhatsApp ao alcance em toda a rolagem;
  - página sem JavaScript, com o JavaScript bloqueado e com o JavaScript atrasado (foco e deslocamentos quando o React assume);
  - `prefers-reduced-motion`, espaçamento de texto ampliado (WCAG 1.4.12, inclusive o foco com o header fixo e a barra fixa do WhatsApp), fonte do navegador ampliada (24 px no celular; 20, 24 e 32 px no computador) e zoom de 400%;
  - fontes web realmente aplicadas e deslocamento de layout (CLS) com a fonte chegando atrasada;
  - 404.

  Gera screenshots em `qa-output/screens/`.
- `npm run lighthouse`: desempenho, acessibilidade, boas práticas e SEO.

Para rodar `qa` e `lighthouse` com o mesmo base path do build, use `BASE_PATH=nome-do-repo/ npm run qa` (Git Bash) ou `$env:BASE_PATH='/nome-do-repo/'; npm run qa` (PowerShell).

---

## 7. Estrutura do projeto

```
.github/
  workflows/deploy.yml               verificações e publicação no GitHub Pages
  workflows/republicacao-anual.yml   republica todo começo de ano (ano do copyright)
  dependabot.yml                     atualizações mensais de dependências e actions
docs/                          briefing original, design system, pendências com o proprietário
public/                        favicons, ícones, og-image.jpg, logo pública (copiados como estão)
scripts/
  prerender.mjs                valida os dados e gera o HTML final, 404, sitemap, robots e manifest
  deploy-env.mjs               URL pública e base path (SITE_URL / BASE_PATH)
  verify-dist.mjs              verificações do build (CI)
  qa-browser.mjs, lighthouse.mjs   QA no navegador
  brand-assets.mjs, og-image.mjs, font-fallbacks.mjs, fonts.py   geração de ativos
  ilustracoes-servicos.mjs     desenha as 5 imagens de src/assets/servicos (npm run servicos:ilustracoes)
  og-image.dados.json          o que a og-image mostra (conferido pelo verify)
  lib/                         busca do Chrome/Edge e dados da og-image (compartilhados)
src/
  config/      dados comerciais (site.js) e ano do build
  content/     textos, serviços, seções e SEO
  lib/         links de contato, validação dos dados, áreas publicadas, imagens dos serviços, dados estruturados, <head>, ano atual
  components/  peças reutilizáveis (Logo, links, ficha, ícones, terminais do circuito)
  sections/    Header, Hero, Destaques, Serviços, Sobre, Diferenciais, Localização, Dúvidas, CTA, Rodapé, menu, barra fixa do WhatsApp
  layouts/     estrutura comum (header fixo, menu, foco, barra fixa do WhatsApp)
  pages/       página inicial e 404
  styles/      fontes, tokens, base, layout, motivo de circuito, componentes e um arquivo por seção
  assets/      logo original e versões geradas, fontes, imagens das áreas de serviço (servicos/), foto opcional
  main.jsx     entrada do navegador (hidratação)
  entry-server.jsx   entrada do build (pré-renderização)
```

**Como o build funciona:**
1. `vite build` gera JS e CSS para o navegador.
2. `vite build --ssr` gera o renderizador.
3. `scripts/prerender.mjs`:
   - confere os dados de `site.js` e `servicos.js`, inclusive se cada área de serviço tem imagem;
   - monta `dist/index.html` e `dist/404.html` com o conteúdo completo e o `<head>` de SEO;
   - embute o CSS (pequeno) no HTML e faz preload da fonte do título;
   - versiona a URL da imagem de compartilhamento.

Até o React assumir a página, o botão "Menu" funciona como link para a navegação do rodapé. Assim ele nunca parece funcionar sem funcionar, em rede lenta ou com o JavaScript bloqueado.

---

## 8. Marca e design

- **Logo original:** `src/assets/brand/clinic-cell-logo-original.png`.
  - As versões branca e azul, o símbolo, os favicons e os ícones são **extraídos** dela por `npm run brand:assets`, sem redesenho.
  - `logo-blue.png` e `symbol-white.png` ficam como masters para uso fora do site.
  - O fundo azul é separado da arte branca pelo canal de cor, preservando o antialiasing e os traços de circuito do símbolo.
  - Não distorça, recorte nem redesenhe a logo. A largura máxima de exibição é cerca de 470 px.
- **Design system:** `docs/design-system.md`, conceito "Folha técnica".
  - Fontes: DM Sans (eixo opsz, pesos 400–600) e Red Hat Mono (500), auto-hospedadas e reduzidas por `scripts/fonts.py` ao que o design usa.
  - Cores e contrastes medidos.
  - Motivo de circuito com regras de uso.
  - O que **não** fazer.
- **Pendências com o proprietário:** `docs/pendencias.md`.
