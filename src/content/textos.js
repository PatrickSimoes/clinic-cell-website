/**
 * Textos institucionais do site (PT-BR), por seção.
 *
 * Regras de conteúdo (valem para qualquer edição):
 * - Não afirmar nem insinuar o que não foi confirmado pelo proprietário: prazos, preços,
 *   "peças originais", "orçamento grátis", avaliações, número de clientes, certificações,
 *   "a melhor", "líder", "aberto agora". Horários: só os de src/config/site.js.
 * - Confirmado pela própria loja (descrição do Perfil da Empresa no Google, recebida em
 *   20/11/2026): garantia de 90 dias; conserto de iPhone, Samsung, Motorola e outras marcas;
 *   loja física; acessórios; parcelamento no cartão.
 * - "Especialista" aparece só no botão da chamada final (definido no briefing).
 * - Nome, cidade, bairro e ano vêm de src/config/site.js — não digite esses dados aqui.
 */
import { site } from '../config/site.js';

const { nome, anoFundacao: ano } = site;
const { cidade, bairro, uf } = site.endereco;

export const textos = {
  global: {
    pularParaConteudo: 'Pular para o conteúdo',
    /** Sufixo lido por leitores de tela em todo link que abre outra aba. */
    novaAba: 'abre em nova aba',
    menu: 'Menu',
    fechar: 'Fechar',
    peloWhatsApp: 'pelo WhatsApp',
  },

  logoAlt: {
    header: `${nome}, início`,
    plano: `${nome}, desde ${ano}`,
    simples: nome,
  },

  header: {
    navegacaoAria: 'Principal',
    cta: 'Orçamento pelo WhatsApp',
  },

  menu: {
    aria: 'Menu',
    rotulo: 'Sumário',
    navegacaoAria: 'Seções',
    orcamento: 'Solicitar orçamento',
    rota: 'Traçar rota',
  },

  /** Botão fixo do WhatsApp na parte de baixo da tela (celular). */
  flutuante: {
    /** Nome da região do botão (leitores de tela). */
    aria: 'Atalho para o WhatsApp',
    botao: 'Solicitar orçamento',
  },

  hero: {
    rotulo: { linha1: `Desde ${ano} · Bairro ${bairro}`, linha2: `${cidade} — ${uf}` },
    titulo: 'Seu celular merece cuidado especializado.',
    subtitulo: `Assistência técnica de celulares em ${cidade}. Atendimento próximo, experiência e compromisso com cada reparo.`,
    cta: 'Solicitar orçamento',
    nota: 'Abre o WhatsApp com uma mensagem pronta.',
    secundario: 'Conhecer serviços',
    /** Usado quando ainda não há serviços publicados. */
    secundarioSemServicos: 'Ver localização',
  },

  /**
   * Faixa logo abaixo do topo. Só fatos confirmados. Nota no Google e número de aparelhos
   * atendidos entram quando o proprietário passar os valores.
   * `valor` pode ser uma função: recebe o total de serviços publicados.
   */
  destaques: {
    /** Título só para leitores de tela. */
    titulo: `A ${nome} em resumo`,
    itens: [
      { id: 'garantia', icone: 'ShieldCheck', valor: '90 dias de garantia', texto: 'Nos serviços realizados' },
      { id: 'marcas', icone: 'Smartphone', valor: 'iPhone e Android', texto: 'Samsung, Motorola e outras marcas' },
      {
        id: 'servicos',
        icone: 'Wrench',
        valor: (total) => (total === 1 ? '1 serviço' : `${total} serviços`),
        texto: 'Da troca de tela ao reparo em placa',
      },
      { id: 'pagamento', icone: 'CreditCard', valor: 'Parcelamento no cartão', texto: 'Pergunte as condições' },
    ],
  },

  servicos: {
    titulo: `Conserto de celular em ${cidade}`,
    introducao:
      'Escolha a área do problema para pedir orçamento pelo WhatsApp. A mensagem já vai pronta; é só completar com o modelo do aparelho e o que aconteceu.',
    tabela: { area: 'Área', servicos: 'Serviços', acao: 'Orçamento' },
    linkItem: 'Pedir orçamento',
    mais: { pergunta: 'Seu caso não está na lista?', link: 'Descreva o defeito pelo WhatsApp' },
    vazio: {
      titulo: 'Conte o que aconteceu com o seu celular',
      texto: 'Mande o modelo do aparelho e o que aconteceu; os próximos passos são combinados na conversa.',
      botao: 'Descrever o defeito',
    },
  },

  sobre: {
    kicker: 'Desde',
    hoje: 'Hoje',
    texto: `Desde ${ano}, a ${nome} trabalha com o compromisso de oferecer soluções para quem precisa cuidar do seu celular. Nossa proposta é unir experiência, atenção aos detalhes e atendimento próximo.`,
    /**
     * Foto real opcional: coloque o arquivo em src/assets/fotos/sobre.(webp|jpg|png).
     * Sem arquivo, nada é exibido. Escreva alt e legenda descrevendo só o que aparece na foto.
     */
    foto: { alt: '', legenda: '' },
  },

  /**
   * "Por que escolher": quatro motivos concretos, todos confirmados (lista de serviços e o que a
   * loja escreveu no Google). "Desde 2011" fica no topo e no Sobre.
   */
  diferenciais: {
    titulo: `Por que escolher a ${nome}`,
    introducao: `Conserto com garantia, do simples ao avançado, numa loja de verdade no bairro ${bairro}.`,
    itens: [
      {
        id: 'garantia',
        icone: 'ShieldCheck',
        titulo: 'Garantia de 90 dias',
        texto: `Os serviços feitos na ${nome} têm 90 dias de garantia.`,
      },
      {
        id: 'avancado',
        icone: 'CircuitBoard',
        titulo: 'Do simples ao avançado',
        texto:
          'Em iPhone e Android: da troca de tela à microsoldagem e ao reparo em placa-mãe, inclusive celular que não liga ou que molhou.',
      },
      {
        id: 'loja',
        icone: 'Store',
        titulo: `Loja física no ${bairro}`,
        texto: `Você leva o aparelho a uma loja de verdade, em ${cidade}, para a sua segurança.`,
        link: { rotulo: 'Ver como chegar', secao: 'localizacao' },
      },
      {
        id: 'whatsapp',
        icone: 'MessageCircle',
        titulo: 'Orçamento pelo WhatsApp',
        texto: 'Mande o modelo do aparelho e o que aconteceu, direto para a loja:',
        telefone: true,
      },
    ],
  },

  localizacao: {
    titulo: `Assistência técnica de celular no bairro ${bairro}`,
    ficha: { whatsapp: 'WhatsApp', horario: 'Horário' },
    horarioNaoInformado: 'Consulte pelo WhatsApp antes de vir.',
    confirmarHorario: 'Confirmar horário',
    confirmarHorarioOculto: ' de atendimento pelo WhatsApp',
    horarioExcecoes: 'Feriados e exceções: confirme pelo WhatsApp.',
    /** "Domingo · fechado" (dias que não estão em site.horarios). */
    fechado: 'fechado',
    abrirMaps: 'Abrir no Google Maps',
    rota: 'Traçar rota',
    rotaOculto: ' no Google Maps',
    waze: 'Abrir no Waze',
    copiar: {
      // Os três rótulos do botão ficam empilhados (só um visível): os curtos não alargam o
      // botão. O anúncio para leitores de tela é o texto completo.
      rotulo: 'Copiar endereço',
      sucesso: 'Copiado',
      sucessoAnuncio: 'Endereço copiado.',
      falha: 'Falha ao copiar',
      falhaAnuncio: 'Não foi possível copiar. Endereço:',
    },
    mapa: {
      titulo: 'Mapa do Google com a localização da ClinicCell',
    },
  },

  /**
   * Dúvidas frequentes. Só respostas com fatos confirmados (serviços, endereço, WhatsApp e o
   * que a loja escreveu no Google). Prazo e preço entram quando o proprietário confirmar.
   * - `resposta` pode ser uma função: recebe { areas, totalServicos, endereco, horarios, fechados }.
   * - `link.whatsapp`: chave da mensagem em src/config/site.js; `link.secao`: id da seção.
   */
  duvidas: {
    titulo: 'Dúvidas frequentes',
    perguntas: [
      {
        id: 'orcamento',
        pergunta: 'Como peço um orçamento?',
        resposta:
          'Pelo WhatsApp. A mensagem já vai pronta; é só completar com o modelo do aparelho e o que aconteceu.',
        link: { rotulo: 'Pedir orçamento pelo WhatsApp', whatsapp: 'orcamento' },
      },
      {
        id: 'garantia',
        pergunta: 'O conserto tem garantia?',
        resposta: `Sim. A ${nome} oferece garantia de 90 dias nos serviços.`,
      },
      {
        id: 'marcas',
        pergunta: 'Quais marcas vocês consertam?',
        resposta: 'iPhone e Android: Samsung, Motorola e outras marcas. Pergunte informando o modelo do aparelho.',
        link: { rotulo: 'Perguntar pelo WhatsApp', whatsapp: 'orcamento' },
      },
      {
        id: 'pagamento',
        pergunta: 'Dá para parcelar?',
        resposta: `Sim. A ${nome} parcela no cartão.`,
      },
      {
        id: 'servicos',
        pergunta: `Quais serviços a ${nome} faz?`,
        resposta: ({ areas, totalServicos }) => {
          const nomes = areas.map((a) => a.nome.toLowerCase());
          const lista = nomes.length > 1 ? `${nomes.slice(0, -1).join('; ')}; e ${nomes.at(-1)}` : nomes[0];
          const servicos = totalServicos === 1 ? '1 serviço' : `${totalServicos} serviços`;
          const emAreas = areas.length === 1 ? '1 área' : `${areas.length} áreas`;
          return `São ${servicos}, em ${emAreas}: ${lista}.`;
        },
        link: { rotulo: 'Ver a lista completa', secao: 'servicos' },
      },
      {
        id: 'molhou',
        pergunta: 'Vocês consertam celular que molhou?',
        resposta: `A ${nome} faz reparo por oxidação e contato com líquido. Mande o modelo do aparelho e o que aconteceu.`,
        link: { rotulo: 'Descrever o defeito pelo WhatsApp', whatsapp: 'defeito' },
      },
      {
        id: 'nao-liga',
        pergunta: 'Meu celular não liga. Vocês consertam?',
        resposta: `A ${nome} faz recuperação de aparelhos que não ligam e diagnóstico de defeitos. Conte o modelo e o que aconteceu antes de ele parar de ligar.`,
        link: { rotulo: 'Descrever o defeito pelo WhatsApp', whatsapp: 'defeito' },
      },
      {
        id: 'vidro',
        pergunta: 'Dá para trocar só o vidro da tela?',
        resposta: 'Quando possível, sim: a troca do vidro pode ser feita separadamente. Pergunte informando o modelo do aparelho.',
        link: { rotulo: 'Perguntar pelo WhatsApp', whatsapp: 'orcamento' },
      },
      {
        id: 'acessorios',
        pergunta: 'Vocês vendem acessórios?',
        resposta: `Sim. A ${nome} também trabalha com acessórios. Pergunte pelo que você procura.`,
        link: { rotulo: 'Perguntar pelo WhatsApp', whatsapp: 'acessorios' },
      },
      {
        id: 'onde',
        pergunta: `Onde fica a ${nome}?`,
        resposta: ({ endereco: e }) =>
          `A loja fica na ${e.logradouro}, ${e.numero}, no bairro ${e.bairro}, em ${e.cidade} — ${e.uf}.`,
        link: { rotulo: 'Ver como chegar', secao: 'localizacao' },
      },
      {
        id: 'horario',
        pergunta: 'Qual é o horário de atendimento?',
        resposta: ({ horarios, fechados }) => {
          if (!horarios) return 'Confirme pelo WhatsApp antes de vir.';
          // "Segunda a sexta, das 9h às 19h, e sábado, das 9h às 16h. Domingo, fechado."
          const faixas = horarios.map((h, i) => `${i === 0 ? h.dias : h.dias.toLowerCase()}, das ${h.horario}`);
          const lista = faixas.length > 1 ? `${faixas.slice(0, -1).join('; ')}, e ${faixas.at(-1)}` : faixas[0];
          return `${lista}.${fechados ? ` ${fechados}, fechado.` : ''} Em feriados, confirme antes de vir.`;
        },
        link: { rotulo: 'Confirmar horário pelo WhatsApp', whatsapp: 'horario' },
      },
    ],
  },

  cta: {
    titulo: 'Precisa de ajuda com seu celular?',
    texto: `Entre em contato com a ${nome} e consulte as opções de atendimento.`,
    botao: 'Falar com um especialista',
    linhaTelefone: 'WhatsApp',
  },

  rodape: {
    frase: `${nome} — assistência técnica de celulares em ${cidade} (${uf}), desde ${ano}.`,
    titulos: { endereco: 'Endereço', whatsapp: 'WhatsApp', navegacao: 'Navegação' },
    navegacaoAria: 'Rodapé',
    abrirMaps: 'Abrir no Google Maps',
    direitos: (anoAtual) => `© ${anoAtual} ${nome}. Todos os direitos reservados.`,
    voltarAoTopo: 'Voltar ao topo',
  },

  naoEncontrada: {
    rotulo: 'Erro 404',
    titulo: 'Página não encontrada',
    texto: `Esta página não existe ou foi removida. Volte para a página inicial ou fale com a ${nome} pelo WhatsApp.`,
    inicio: 'Ir para a página inicial',
    whatsapp: 'Falar pelo WhatsApp',
  },
};
