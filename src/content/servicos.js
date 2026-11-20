/**
 * Serviços exibidos na seção "Serviços", agrupados por área.
 * Os nomes são os da lista enviada pelo proprietário; o agrupamento serve só para organizar.
 *
 * REGRA: uma área só aparece no site publicado quando `confirmado: true`.
 *
 * - Com zero áreas confirmadas, a seção mostra um convite para descrever o defeito
 *   pelo WhatsApp (nada de lista vazia).
 * - `npm run dev` mostra exatamente o que vai para o ar: só as áreas confirmadas.
 * - Os serviços das áreas confirmadas também entram nos dados estruturados (Schema.org).
 * - Atenção: as áreas não confirmadas não aparecem na página, mas o texto delas vai junto no
 *   JavaScript público do site. Não escreva aqui nada que não possa ser lido por qualquer pessoa.
 * - O build confere este arquivo (id, textos, imagem, serviço repetido): ver src/lib/validar-site.js.
 *
 * Para incluir um serviço: escreva o nome na lista `servicos` da área certa.
 * Para criar uma área: copie uma e troque `id` (sem acentos/espaços), `nome`, `servicos` e
 * `mensagemWhatsApp`, e coloque a imagem dela em src/assets/servicos/<id>.svg (ou uma foto
 * <id>.webp/.jpg, que tem prioridade): ver src/lib/imagens-de-servico.js.
 * Escreva como a loja fala, sem prometer prazo, preço ou garantia.
 */

/**
 * @typedef {object} AreaDeServico
 * @property {string} id                Identificador único (vira âncora: #servico-<id>).
 * @property {string} nome              Nome da área (vira H3).
 * @property {string[]} servicos        Serviços da área, na ordem em que aparecem.
 * @property {string} mensagemWhatsApp  Mensagem pré-preenchida do link "Pedir orçamento" da área.
 * @property {boolean} confirmado       `true` somente após confirmação do proprietário.
 */

/** @type {AreaDeServico[]} */
export const areasDeServico = [
  {
    id: 'tela-e-carcaca',
    nome: 'Tela e carcaça',
    servicos: [
      'Troca de tela / display',
      'Troca de vidro (quando possível separadamente)',
      'Troca de tampa traseira',
      'Troca de aro / carcaça',
      'Reparo de botões físicos',
    ],
    mensagemWhatsApp: 'Olá! Gostaria de um orçamento de tela ou carcaça do meu celular.\nModelo do aparelho e o serviço: ',
    confirmado: true,
  },
  {
    id: 'bateria-e-carga',
    nome: 'Bateria e carga',
    servicos: [
      'Troca de bateria',
      'Reparo de conector de carga',
      'Reparo de placa de carga',
      'Reparo de problemas de carregamento',
    ],
    mensagemWhatsApp:
      'Olá! Gostaria de um orçamento de bateria ou carregamento do meu celular.\nModelo do aparelho e o que aconteceu: ',
    confirmado: true,
  },
  {
    id: 'camera-som-e-sensores',
    nome: 'Câmera, som e sensores',
    servicos: [
      'Troca de câmera frontal',
      'Troca de câmera traseira',
      'Reparo de câmera',
      'Troca de alto-falante e microfone',
      'Troca de auricular',
      'Reparo de sensores e proximidade',
    ],
    mensagemWhatsApp:
      'Olá! Gostaria de um orçamento de câmera, som ou sensores do meu celular.\nModelo do aparelho e o que aconteceu: ',
    confirmado: true,
  },
  {
    id: 'placa-e-reparos-avancados',
    nome: 'Placa e reparos avançados',
    servicos: [
      'Recuperação de aparelhos que não ligam',
      'Reparo por oxidação / contato com líquido',
      'Reparo de curto-circuito',
      'Microsoldagem',
      'Reparo em placa-mãe',
      'Diagnóstico de defeitos',
    ],
    mensagemWhatsApp:
      'Olá! Gostaria de um orçamento para o meu celular (placa, contato com líquido ou aparelho que não liga).\nModelo do aparelho e o que aconteceu: ',
    confirmado: true,
  },
  {
    id: 'sistema-e-software',
    nome: 'Sistema e software',
    servicos: [
      'Remoção de vírus e aplicativos maliciosos',
      'Reinstalação de sistema',
      'Formatação / restauração de sistema',
      'Atualização de software',
    ],
    mensagemWhatsApp:
      'Olá! Gostaria de um orçamento de sistema ou software do meu celular.\nModelo do aparelho e o que aconteceu: ',
    confirmado: true,
  },
];
