/**
 * Dados comerciais da ClinicCell — fonte única de verdade.
 *
 * Tudo o que for nome, telefone, endereço, mapa ou horário deve ser lido daqui.
 * Não repita essas informações em componentes: importe `site`.
 *
 * Campos marcados como "a confirmar" ficam `null` (ou lista vazia) até o
 * proprietário confirmar. Enquanto estiverem vazios, o site mostra um texto
 * neutro e eles NÃO entram nos dados estruturados (Schema.org).
 *
 * O build confere este arquivo (src/lib/validar-site.js): dia da semana inválido,
 * horário fora do formato "HH:MM" ou telefone incoerente fazem o build falhar
 * com uma mensagem explicando o que corrigir.
 */

/**
 * @typedef {'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo'} DiaDaSemana
 *
 * @typedef {object} Horario
 * @property {DiaDaSemana[]} dias  Dias com o mesmo horário (com ou sem acento: "terça" ou "terca").
 * @property {string} abre         Formato 24h "HH:MM", ex.: "09:00".
 * @property {string} fecha        Formato 24h "HH:MM", ex.: "18:00".
 */

export const site = {
  nome: 'ClinicCell',
  /** Grafia usada na logo; ajuda buscas escritas com espaço. */
  nomeAlternativo: 'Clinic Cell',
  segmento: 'Assistência técnica de celulares',
  anoFundacao: 2011,

  whatsapp: {
    /**
     * Somente dígitos, com DDI e DDD — usado no link https://wa.me/<numero>.
     * É o link fornecido pela empresa. A diferença em relação à `exibicao` é intencional:
     * em DDDs a partir de 31, a conta do WhatsApp costuma ficar registrada sem o 9 extra.
     * Só troque para '5541995079359' se o teste no celular não abrir a conta da ClinicCell.
     */
    numero: '554195079359',
    /**
     * Como o número aparece para o visitante: formato atual, com 9 dígitos,
     * igual ao Perfil da Empresa no Google (verificado em 19/11/2026).
     * Depois de mudar, rode `npm run og:image` (a imagem de compartilhamento mostra o número).
     */
    exibicao: '(41) 99507-9359',
    /** Formato internacional para dados estruturados (mesmo número da exibição). */
    internacional: '+55 41 99507-9359',
    /**
     * Mensagens pré-preenchidas por contexto. "\n" vira quebra de linha no WhatsApp;
     * o espaço no fim deixa o cursor pronto para a pessoa completar.
     * (As mensagens de cada serviço ficam em src/content/servicos.js.)
     */
    mensagens: {
      /** Links gerais: Localização, Diferenciais, rodapé, 404. */
      geral:
        'Olá! Encontrei a ClinicCell pelo site e gostaria de informações sobre assistência técnica para meu celular.',
      /** Botão principal do hero, header (desktop), botão fixo do WhatsApp, menu e Dúvidas (orçamento, marcas, vidro). */
      orcamento:
        'Olá! Encontrei a ClinicCell pelo site e gostaria de solicitar um orçamento para o meu celular.\nModelo do aparelho: ',
      /** "Seu caso não está na lista?", estado sem serviços publicados e Dúvidas (molhou, não liga). Um campo só, no fim, onde fica o cursor. */
      defeito:
        'Olá! Encontrei a ClinicCell pelo site e quero descrever o defeito do meu celular.\nModelo do aparelho e o que aconteceu: ',
      /** "Confirmar horário" na Localização e Dúvidas (horário). */
      horario:
        'Olá! Vi o endereço da ClinicCell no site e gostaria de confirmar o horário de atendimento antes de ir.',
      /** Dúvidas (acessórios). */
      acessorios: 'Olá! Encontrei a ClinicCell pelo site e gostaria de saber sobre acessórios.\nO que procuro: ',
      /** Chamada final (Contato). */
      contato:
        'Olá! Encontrei a ClinicCell pelo site e preciso de ajuda com o meu celular.\nModelo do aparelho: ',
    },
  },

  endereco: {
    /**
     * Grafia oficial dos Correios (ViaCEP) e do Google Maps, conferida em 19/11/2026.
     * O briefing trazia "Annelise"; o Perfil no Google traz "Annelise Gellert krisgner".
     */
    logradouro: 'Rua Anneliese Gellert Krigsner',
    numero: '2884',
    bairro: 'Iná',
    cidade: 'São José dos Pinhais',
    uf: 'PR',
    estado: 'Paraná',
    /** CEP único da rua nos Correios (ViaCEP), igual ao do Perfil no Google. Formato "00000-000". */
    cep: /** @type {string | null} */ ('83065-470'),
    pais: 'BR',
  },

  /** Coordenadas do ponto "ClinicCell" no Google Maps. */
  geo: {
    latitude: -25.5032017,
    longitude: -49.1650781,
  },

  mapa: {
    /** Link do ponto no Google Maps fornecido pela empresa. */
    link: 'https://maps.app.goo.gl/MB3FU8HECsMP754W9',
    /** Identificador (CID) do ponto no Google Maps. */
    cid: '12806746958473720782',
    /**
     * Place ID do Google (começa com "ChIJ"): faz o "Traçar rota" apontar exatamente para o ponto.
     * Verificado em 19/11/2026 (corresponde ao mesmo CID acima). O Google pode renovar
     * Place IDs: confira uma vez por ano. Se ficar inválido, a rota volta a usar nome + endereço.
     * @type {string | null}
     */
    placeId: 'ChIJXWmYfJrx3JQRzvMjdIG0urE',
  },

  /**
   * Horários de atendimento, iguais aos do Perfil da Empresa no Google (print enviado em
   * 20/11/2026): segunda a sexta 9h–19h, sábado 9h–16h. Dia que não aparece aqui é mostrado
   * como fechado (hoje, domingo). Se mudar no Google, mude aqui também.
   * Com `null`, o site orienta o visitante a consultar pelo WhatsApp.
   * @type {Horario[] | null}
   */
  horarios: [
    { dias: ['segunda', 'terca', 'quarta', 'quinta', 'sexta'], abre: '09:00', fecha: '19:00' },
    { dias: ['sabado'], abre: '09:00', fecha: '16:00' },
  ],

  /**
   * Perfis oficiais — A CONFIRMAR. Ex.: [{ nome: 'Instagram', url: 'https://www.instagram.com/...' }]
   * @type {{ nome: string, url: string }[]}
   */
  redesSociais: [],
};
