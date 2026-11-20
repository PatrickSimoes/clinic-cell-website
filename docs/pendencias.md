# Pendências com o proprietário

Informações que o site **não** afirma enquanto não forem confirmadas, e dados públicos já conferidos que valem uma confirmação rápida. Cada item diz onde alterar. Detalhes de edição estão no [README](../README.md#2-editar-o-conteúdo).

Conferências feitas em 19/11/2026 no Perfil da Empresa no Google (ponto "ClinicCell" no Maps) e nos Correios (ViaCEP). Em 20/11/2026, o proprietário enviou a lista de serviços e a descrição que a loja escreveu no Perfil da Empresa no Google.

## Já confirmado

### Serviços (resolvido em 20/11/2026)

**Situação:** o proprietário enviou a lista dos serviços da loja. Os **25 serviços** estão publicados com os nomes exatamente como ele escreveu, em **5 áreas**:
- tela e carcaça (5);
- bateria e carga (4);
- câmera, som e sensores (6);
- placa e reparos avançados (6);
- sistema e software (4).

O agrupamento em áreas e a ordem dentro de cada uma são só organização da página. Os 5 serviços provisórios do briefing, que nunca foram publicados, e as descrições que esperavam confirmação saíram do cadastro. Cada área tem uma ilustração feita para o site; fotos reais são opcionais (item 14).

**Onde alterar:** `src/content/servicos.js` (como incluir um serviço ou criar uma área: [README, seção 2](../README.md#serviços-áreas-e-lista-do-proprietário)).

### Descrição da loja no Google (recebida em 20/11/2026)

Texto que a própria loja escreveu no Perfil da Empresa no Google:

> "A Clinic Cell é uma assistência técnica especializada em celulares em São José dos Pinhais. Realizamos troca de telas, substituição de baterias, reparos em placas, conserto de iPhone, Samsung, Motorola e outras marcas. Oferecemos atendimento rápido, garantia de 90 dias e loja física para sua segurança. Também trabalhamos com acessórios e parcelamos no cartão. Se você procura conserto de celular em São José dos Pinhais com qualidade e confiança, fale com a Clinic Cell."

Com ela, ficam confirmados e já aparecem no site:
- **garantia de 90 dias:** faixa de destaques, Dúvidas, description da página e descrição nos dados estruturados;
- **iPhone, Samsung, Motorola e outras marcas:** faixa de destaques, Dúvidas e descrição nos dados estruturados;
- **loja física:** Dúvidas ("Onde fica a ClinicCell?");
- **acessórios:** Dúvidas ("Vocês vendem acessórios?");
- **parcelamento no cartão:** faixa de destaques e Dúvidas ("Dá para parcelar?").

O site **não** usa "atendimento rápido": é uma promessa de prazo (ver item 11).

## Antes de publicar

### 1. Número do WhatsApp

**Pergunta:** o número é **(41) 99507-9359**, como aparece no Perfil da Empresa no Google?

**Situação:**
- O briefing trouxe `+55 41 9507-9359`, com 8 dígitos depois do DDD. Esse formato não existe mais: celulares do Paraná têm 9 dígitos desde 2016.
- O Perfil no Google mostra **(41) 99507-9359**. Por isso o site exibe esse formato, e os dados estruturados usam `+55 41 99507-9359`.
- O link do WhatsApp continua exatamente o fornecido, `wa.me/554195079359`: em DDDs a partir de 31, a conta do WhatsApp costuma ficar registrada sem o 9 extra.

**Teste no celular:** toque em qualquer botão de WhatsApp do site e confira se abre a conversa da ClinicCell.

**Onde alterar:** `src/config/site.js` → `whatsapp.numero`, `whatsapp.exibicao` e `whatsapp.internacional`. Depois, rode `npm run og:image` (a imagem de compartilhamento mostra o número) e commite os dois arquivos que ele gera: `public/og-image.jpg` e `scripts/og-image.dados.json`.

### 2. Horário de atendimento — resolvido em 20/11/2026

Confirmado pelo print do Perfil da Empresa no Google:
- segunda a sexta, das 9h às 19h;
- sábado, das 9h às 16h;
- domingo, fechado.

Já aparece na Localização, na resposta sobre horário das Dúvidas e nos dados estruturados (`src/config/site.js` → `horarios`). Se o horário mudar no Google, mude também no site: o cliente vê os dois.

### 3. Endereço do site

**Decidir antes de cadastrar o site no Perfil da Empresa no Google.**

O Google só mostra o ícone e o nome "ClinicCell" nos resultados para sites na **raiz** de um endereço. Em `https://<usuario>.github.io/<repositorio>/`, o resultado aparece com ícone genérico e o nome do servidor. Opções, todas sem mudar código:

- **domínio próprio**, como `cliniccell.com.br` (recomendado): [README, seção 3](../README.md#domínio-próprio-ex-wwwcliniccellcombr);
- **sem custo**: publicar a partir de um repositório chamado `<conta>.github.io`, de preferência numa organização do GitHub com o nome da marca;
- **repositório comum**: funciona, com a limitação acima. Trocar depois obriga a atualizar o Perfil e as citações.

## Recomendado (SEO local)

### 4. Perfil da Empresa no Google (ponto "ClinicCell" no Maps)

**Estado em 19/11/2026:**
- **Categoria principal:** "Loja de celulares".
- **Site:** nenhum ("Adicionar website").
- **Avaliações:** nenhuma.
- **Telefone:** (41) 99507-9359. Igual ao site; é o formato correto e não deve ser trocado.
- **Endereço:** "R Annelise Gellert krisgner 2884 - Iná, São José dos Pinhais - PR, 83065-470". Tem dois erros de grafia (ver item 5).

**A fazer no painel do Perfil:**
1. Definir como **categoria principal** a de conserto ou assistência de celulares (busque "celular" no seletor; em inglês é "Mobile phone repair shop"). Como a loja trabalha com acessórios (confirmado em 20/11/2026), uma categoria de acessórios para celular pode entrar como secundária (busque "acessórios" no seletor). "Loja de celulares" fica como secundária só se a loja também vender aparelhos (ver item 13).
2. Corrigir o endereço para **R. Anneliese Gellert Krigsner, 2884 - Iná**.
3. Preencher o site com o endereço definitivo (item 3).

### 5. Grafia da rua

**Situação:**
- Nos Correios e no Google Maps, o nome oficial da rua é **Anneliese Gellert Krigsner**. O site adotou essa grafia.
- O briefing trazia "Annelise"; o Perfil no Google traz "Annelise ... krisgner".

**A confirmar:** pela placa da rua ou por uma conta de consumo.

**Onde alterar:** `src/config/site.js` → `endereco.logradouro`.

### 6. CEP e Place ID (já preenchidos)

- **CEP 83065-470:** CEP único da rua nos Correios, igual ao do Perfil.
- **Place ID `ChIJXWmYfJrx3JQRzvMjdIG0urE`:** corresponde ao mesmo ponto do link do Maps, e com ele o botão "Traçar rota" aponta exatamente para a loja. O Google pode renovar Place IDs: confira uma vez por ano. Se ficar inválido, a rota volta a usar nome e endereço, sem quebrar.

**Onde alterar:** `src/config/site.js` → `endereco.cep` e `mapa.placeId`.

### 7. Avaliações no Google: nota e link

**Pergunta:** qual é a nota atual e qual é o link das avaliações no Google?

**Situação:** na conferência de 19/11/2026, o Perfil não tinha avaliações. O site não mostra nota nem número de avaliações até o proprietário passar os valores.
- Com os valores, a nota pode entrar na faixa de destaques (`src/content/textos.js` → `destaques`), com link para as avaliações. A faixa foi desenhada para 4 itens: um quinto pede rever o layout.
- O site é estático: a nota não se atualiza sozinha. Ela precisa ser revista de tempos em tempos.
- A nota fica só na página, não nos dados estruturados: o Google não mostra estrelas de avaliações que o próprio negócio publica sobre si.

**Para conseguir avaliações:** depois de cada atendimento, o proprietário pode enviar pelo WhatsApp:

`https://search.google.com/local/writereview?placeid=ChIJXWmYfJrx3JQRzvMjdIG0urE`

Não ofereça desconto ou brinde em troca e não peça só a clientes satisfeitos: as regras do Google proíbem.

## Para a página (só entra se confirmado)

### 8. Número de aparelhos atendidos

**Pergunta:** quantos aparelhos a loja já atendeu? Precisa ser um número que a loja possa comprovar (por exemplo, pelas ordens de serviço).

**Situação:** o site não cita número de aparelhos nem de clientes.

**Onde entraria:** na faixa de destaques (`src/content/textos.js` → `destaques`). Como a nota (item 7), um quinto item pede rever o layout da faixa.

### 9. "Laboratório próprio"

**Pergunta:** a loja tem laboratório próprio, ou seja, os reparos são feitos na própria loja?

**Situação:** o site não usa a expressão. Se for confirmado, pode entrar nos destaques ou numa resposta das Dúvidas (`src/content/textos.js` → `destaques` ou `duvidas`).

### 10. Avaliações de clientes no site

**Pergunta:** há avaliações de clientes que a loja queira mostrar no site?

**A confirmar, para cada avaliação:**
- o texto real, sem edição (pode vir do Google ou do WhatsApp);
- a permissão do cliente para publicar;
- como o nome deve aparecer (nome completo, só o primeiro nome ou iniciais);
- se o cliente quer aparecer com foto, enviada por ele mesmo.

**Situação:** o site não mostra nenhuma avaliação de cliente e ainda não tem seção para isso. Ela entra quando houver textos confirmados.

### 11. Prazo e preço nas Dúvidas

**Pergunta:** a loja quer responder no site "Quanto tempo leva o conserto?" e "Quanto custa?"?

**Situação:** o site não promete prazo nem preço, nem "atendimento rápido" (que é prazo). Também não usa "orçamento grátis" nem "peças originais" sem confirmação. Hoje o orçamento é sempre pelo WhatsApp.

**Onde alterar:** `src/content/textos.js` → `duvidas` (as perguntas e o formato das respostas estão no [README](../README.md#destaques-e-dúvidas-frequentes)).

## Opcional

### 12. Ligações de voz

**A confirmar:** se o número aceita ligações de voz.

Hoje todo número exibido abre o WhatsApp. Se aceitar ligações, dá para acrescentar um botão "Ligar" (`tel:`).

### 13. Redes sociais e venda de aparelhos

- **Redes sociais:** quais são os perfis oficiais, como Instagram ou Facebook? Onde alterar: `src/config/site.js` → `redesSociais`. Os perfis entram também em `sameAs` nos dados estruturados.
- **Venda de aparelhos:** a loja vende celulares? A venda de **acessórios** já está confirmada (descrição do Google, 20/11/2026); a de aparelhos, não. Se vender, os dados estruturados podem incluir o tipo `MobilePhoneStore`, além de `LocalBusiness` (em `src/lib/structured-data.js`).

### 14. Fotos reais

**A confirmar:** se haverá fotos da loja, nunca de banco de imagens.

- **Sobre (fachada ou bancada):** salve em `src/assets/fotos/sobre.webp` e preencha `alt` e legenda em `src/content/textos.js` → `sobre.foto`. O `alt` é obrigatório (o `verify` reprova a foto sem descrição e o site não é publicado) e deve descrever só o que aparece na foto.
- **Serviços (uma foto por área, no lugar da ilustração):** salve em `src/assets/servicos/<id da área>.webp`, por exemplo `tela-e-carcaca.webp`, em proporção 16:10 (cerca de 960 × 600 px). A foto tem prioridade sobre a ilustração. Detalhes no [README](../README.md#imagens-das-áreas).
