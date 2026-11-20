# Continuar o site da ClinicCell em outra máquina

Atualizado em 20/11/2026. Leia isto antes de mexer no projeto na máquina nova.
Se for usar o Claude lá, peça primeiro: "leia o CONTINUAR.md e o docs/pendencias.md".

Os detalhes técnicos estão no [README](README.md), no [design system](docs/design-system.md) e nas
[pendências](docs/pendencias.md). Aqui fica só o essencial e o que **não** está escrito em lugar nenhum.

---

## 1. Levar o projeto

- **A pasta não é um repositório git.** Nada está salvo no GitHub ainda: a única cópia é esta pasta.
- Copie a pasta `website` inteira, **sem** `node_modules`, `dist`, `dist-ssr` e `qa-output`. Essas quatro são geradas de novo.
- Não esqueça os arquivos ocultos (começam com ponto). `.github/` tem a publicação automática; `.nvmrc`, `.gitignore` e `.htmlvalidate.json` também vão junto. O `CLAUDE.md` (regras para o Claude) também.
- **Recomendado:** aproveitar a troca para criar o repositório no GitHub. Ele vai ser necessário para publicar no GitHub Pages ([README, seção 3](README.md#3-publicar-no-github-pages)). Assim o projeto deixa de existir numa máquina só.

## 2. Preparar a máquina nova

1. Instale o **Node 24** (está no `.nvmrc`; também serve 22.22 ou mais novo).
2. Tenha o **Chrome ou o Edge** instalado: os testes no navegador e a imagem de compartilhamento usam um deles. Se estiver num lugar diferente do normal, informe o caminho em `CHROME_PATH`.
3. Python só é necessário se for refazer as fontes (`npm run fonts:subset`).
4. Na pasta do projeto:

   ```bash
   npm ci           # instala exatamente as versões do package-lock
   npm run check    # lint + build + verificação do site pronto
   npm run qa       # testes no navegador (uns 3 minutos)
   npm run dev      # site em http://localhost:5173
   ```

5. Resultado esperado:
   - `check`: **"✓ Tudo certo, 2 aviso(s)"**. Os 2 avisos são normais: o título tem 69 caracteres, e o SITE_URL é local fora do GitHub.
   - `qa`: **"✓ Tudo certo"**.

## 3. Regras que não estão no código

- **Nada inventado.** Só entra no site o que a loja confirmou. Até agora estão confirmados:
  - os dados de `src/config/site.js`: nome, WhatsApp, endereço e "desde 2011";
  - a lista de 25 serviços, enviada em 20/11/2026;
  - o texto da loja no Perfil do Google (20/11/2026): garantia de 90 dias, conserto de iPhone, Samsung, Motorola e outras marcas, loja física, acessórios e parcelamento no cartão;
  - os horários do Google (20/11/2026): segunda a sexta 9h–19h, sábado 9h–16h, domingo fechado.
- **Ainda não pode aparecer:**
  - nota no Google;
  - número de aparelhos atendidos;
  - "laboratório próprio";
  - avaliações de clientes;
  - prazo e preço;
  - "atendimento rápido": a loja escreveu no Google, mas é promessa de prazo e ficou de fora.
- **Todo botão ou link que abre o WhatsApp é verde.** O teste no navegador reprova se algum não for.
- **Tecnologia:** React + JavaScript + Vite, decisão do Patrick. Não migrar para TypeScript, Next ou Astro.
- **Commits e PRs só no nome do Patrick:** Patrick Simões <patricksimoes25@gmail.com>. Nada de "Co-Authored-By: Claude" nem menção a IA.
- **Conversa:** português simples, sem termos técnicos. O Patrick repassa ao dono da loja o que mudou na tela.

> Essas regras também estão no [CLAUDE.md](CLAUDE.md), que o Claude lê sozinho ao abrir o projeto, inclusive na máquina nova. Na máquina nova, confira com `git config user.name` e `git config user.email` antes do primeiro commit; o CLAUDE.md tem os comandos para configurar.

## 4. Como o site está hoje

Página única, nesta ordem:

| Parte | O que tem |
|---|---|
| Topo | Título, botão verde "Solicitar orçamento" e o bloco azul só com a logo (sem endereço nem telefone, a pedido). |
| Faixa de destaques | 90 dias de garantia · iPhone e Android · 25 serviços · Parcelamento no cartão. |
| Serviços | 5 áreas e 25 serviços, cada área com uma ilustração e o link verde "Pedir orçamento" com mensagem própria. |
| Sobre | "Desde 2011". |
| Diferenciais | "Por que escolher a ClinicCell": garantia, do simples ao avançado, loja física no Iná, orçamento pelo WhatsApp. |
| Localização | Endereço, WhatsApp, horários, botões de rota e o mapa do Google, que só carrega quando a pessoa chega perto. |
| Dúvidas | 11 perguntas que abrem e fecham; 2 colunas no computador. |
| Contato | Chamada final com botão verde. |

No celular, uma **barra verde fixa embaixo** ("Solicitar orçamento pelo WhatsApp") aparece depois que a pessoa passa do botão do topo e some no final da página.

## 5. Onde mudar cada coisa

| Quero mudar | Arquivo |
|---|---|
| Telefone, endereço, horários, mensagens do WhatsApp | `src/config/site.js` |
| Serviços (nomes, áreas, mensagem de cada área) | `src/content/servicos.js` |
| Textos (topo, destaques, diferenciais, dúvidas…) | `src/content/textos.js` |
| Título e descrição para o Google | `src/content/seo.js` |
| Imagem de uma área de serviço | `src/assets/servicos/<id>.svg`. Uma foto real `<id>.webp` na mesma pasta tem prioridade. |

Cuidados:
- **Mudou o telefone?** Rode `npm run og:image` (a imagem de compartilhamento mostra o número).
- **Mudou o horário no Google?** Mude também em `site.js`: o cliente vê os dois.
- **Ilustrações dos serviços:** são desenhadas por `npm run servicos:ilustracoes` (`scripts/ilustracoes-servicos.mjs`). Rodar de novo sobrescreve os `.svg`.
- `npm run qa` apaga e recria a pasta `qa-output/` (fotos das telas dos testes).
- O build falha, com mensagem em português, se `site.js` ou `servicos.js` estiver mal preenchido. Por exemplo: dia da semana errado, horário fora do formato, serviço repetido ou área sem imagem.

## 6. O que falta

Detalhes e "onde alterar" de cada item em [docs/pendencias.md](docs/pendencias.md).

**Antes de publicar**
- [ ] Testar no celular se os botões de WhatsApp abrem a conversa da ClinicCell (número `wa.me/554195079359`).
- [ ] Decidir o endereço do site. Domínio próprio, como `cliniccell.com.br`, é o recomendado. Decida antes de cadastrar o site no Perfil do Google.
- [ ] Criar o repositório no GitHub e fazer a primeira publicação ([README, seção 3](README.md#3-publicar-no-github-pages)).

**Pedir à loja**
- [ ] Nota e link das avaliações no Google, para entrar na faixa de destaques.
- [ ] Quantos aparelhos já foram atendidos (aproximado, como "+5.000").
- [ ] Se tem "laboratório próprio".
- [ ] Avaliações reais de clientes: nome e texto, com permissão (e foto, se quiserem). A seção de avaliações ainda **não existe**: será feita quando chegarem.
- [ ] Prazo e preço, se quiserem nas Dúvidas.
- [ ] Fotos reais dos serviços (opcional): substituem as ilustrações.
- [ ] Redes sociais oficiais (Instagram etc.).

**Ideias em aberto**
- A faixa de destaques foi feita para 4 itens. Para a nota do Google entrar, um item sai ou o layout muda.
- Se o dono quiser a barra do WhatsApp visível o tempo todo no celular, é uma mudança pequena em `src/sections/FloatingWhatsApp.jsx`.

## 7. O que foi feito em 20/11/2026

- Os 25 serviços reais entraram, em 5 áreas com ilustração. O modo "rascunho" foi removido: o `npm run dev` mostra exatamente o que vai para o ar.
- Garantia, marcas, parcelamento, loja física e acessórios entraram, a partir do texto da loja no Google.
- Horários do Google publicados (Localização, Dúvidas e dados para o Google).
- Mapa desenhado trocado pelo mapa real do Google.
- Endereço e telefone tirados do bloco azul do topo.
- Números 01–05 tirados das seções.
- Todo botão e link de WhatsApp ficou verde.
- Botão do WhatsApp no celular virou barra fixa embaixo.
- Novas seções: faixa de destaques, "Por que escolher a ClinicCell" (reescrita) e Dúvidas frequentes.
- Revisão independente feita e corrigida. Todos os testes passando no fim do dia.
