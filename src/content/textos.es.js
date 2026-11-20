/**
 * Textos institucionais do site em espanhol (página /es/), com a mesma estrutura de
 * src/content/textos.js. Valem as mesmas regras de conteúdo de lá: nada que a loja não tenha
 * confirmado. O build falha se faltar ou sobrar um texto em relação ao português.
 *
 * Espanhol neutro da América Latina, tratando o visitante por "tú" (como o "você" do
 * português). Palavras comuns na Venezuela: "celular", "equipo" (o aparelho), "falla" (o defeito),
 * "presupuesto" (o orçamento).
 * Nome, cidade, bairro e ano vêm de src/config/site.js — não digite esses dados aqui.
 */
import { site } from '../config/site.js';

const { nome, anoFundacao: ano } = site;
const { cidade, bairro, uf } = site.endereco;

export const textos = {
  global: {
    pularParaConteudo: 'Saltar al contenido',
    novaAba: 'se abre en una pestaña nueva',
    menu: 'Menú',
    fechar: 'Cerrar',
    peloWhatsApp: 'por WhatsApp',
  },

  idioma: {
    sigla: 'ES',
    ver: 'Ver el sitio en español',
  },

  secoes: {
    servicos: 'Servicios',
    sobre: 'Nosotros',
    diferenciais: 'Ventajas',
    avaliacoes: 'Reseñas',
    localizacao: 'Ubicación',
    duvidas: 'Preguntas',
    contato: 'Contacto',
  },

  logoAlt: {
    header: `${nome}, inicio`,
    plano: `${nome}, desde ${ano}`,
    simples: nome,
  },

  header: {
    navegacaoAria: 'Principal',
    cta: 'Presupuesto por WhatsApp',
  },

  menu: {
    aria: 'Menú',
    rotulo: 'Índice',
    navegacaoAria: 'Secciones',
    orcamento: 'Pedir presupuesto',
    rota: 'Cómo llegar',
  },

  flutuante: {
    aria: 'Acceso directo a WhatsApp',
    botao: 'Pedir presupuesto',
  },

  hero: {
    rotulo: { linha1: `Desde ${ano} · Barrio ${bairro}`, linha2: `${cidade} — ${uf}` },
    titulo: 'Tu celular merece un cuidado especializado.',
    subtitulo: `Servicio técnico de celulares en ${cidade}. Atención cercana, experiencia y compromiso con cada reparación.`,
    cta: 'Pedir presupuesto',
    nota: 'Abre WhatsApp con un mensaje listo.',
    secundario: 'Ver servicios',
    secundarioSemServicos: 'Ver ubicación',
  },

  destaques: {
    titulo: `${nome} en resumen`,
    itens: [
      { id: 'garantia', icone: 'ShieldCheck', valor: '90 días de garantía', texto: 'En los servicios realizados' },
      { id: 'marcas', icone: 'Smartphone', valor: 'iPhone y Android', texto: 'Samsung, Motorola y otras marcas' },
      {
        id: 'servicos',
        icone: 'Wrench',
        valor: (total) => (total === 1 ? '1 servicio' : `${total} servicios`),
        texto: 'Del cambio de pantalla a la reparación de placa',
      },
      { id: 'pagamento', icone: 'CreditCard', valor: 'Cuotas con tarjeta', texto: 'Pregunta por las condiciones' },
    ],
  },

  servicos: {
    titulo: `Reparación de celulares en ${cidade}`,
    introducao:
      'Elige el área del problema para pedir presupuesto por WhatsApp. El mensaje ya va listo; solo complétalo con el modelo del equipo y lo que pasó.',
    tabela: { area: 'Área', servicos: 'Servicios', acao: 'Presupuesto' },
    linkItem: 'Pedir presupuesto',
    linkItemOculto: (area) => ` de ${area.toLowerCase()} por WhatsApp`,
    mais: { pergunta: '¿Tu caso no está en la lista?', link: 'Describe la falla por WhatsApp' },
    vazio: {
      titulo: 'Cuéntanos qué le pasó a tu celular',
      texto: 'Envía el modelo del equipo y lo que pasó; los próximos pasos se acuerdan en la conversación.',
      botao: 'Describir la falla',
    },
  },

  sobre: {
    kicker: 'Desde',
    hoje: 'Hoy',
    texto: `Desde ${ano}, ${nome} trabaja con el compromiso de ofrecer soluciones a quienes necesitan cuidar su celular. Nuestra propuesta es unir experiencia, cuidado en los detalles y atención cercana.`,
    /** Foto real opcional (ver textos.js): o alt e a legenda em espanhol. */
    foto: { alt: '', legenda: '' },
  },

  diferenciais: {
    titulo: `Por qué elegir ${nome}`,
    introducao: `Reparaciones con garantía, de lo simple a lo avanzado, en una tienda de verdad en el barrio ${bairro}.`,
    itens: [
      {
        id: 'garantia',
        icone: 'ShieldCheck',
        titulo: 'Garantía de 90 días',
        texto: `Los servicios hechos en ${nome} tienen 90 días de garantía.`,
      },
      {
        id: 'avancado',
        icone: 'CircuitBoard',
        titulo: 'De lo simple a lo avanzado',
        texto:
          'En iPhone y Android: del cambio de pantalla a la microsoldadura y la reparación de placa base, incluso celulares que no encienden o que se mojaron.',
      },
      {
        id: 'loja',
        icone: 'Store',
        titulo: `Tienda física en ${bairro}`,
        texto: `Llevas tu equipo a una tienda de verdad, en ${cidade}, para tu seguridad.`,
        link: { rotulo: 'Ver cómo llegar', secao: 'localizacao' },
      },
      {
        id: 'whatsapp',
        icone: 'MessageCircle',
        titulo: 'Presupuesto por WhatsApp',
        texto: 'Envía el modelo del equipo y lo que pasó, directo a la tienda:',
        telefone: true,
      },
    ],
  },

  /** As avaliações são publicadas no idioma original (português), como o cliente escreveu. */
  avaliacoes: {
    titulo: `Lo que dicen los clientes de ${nome}`,
    introducao: 'Reseñas reales, en portugués, publicadas con el permiso de cada cliente.',
    semAvaliacoes: {
      titulo: `¿Ya eres cliente de ${nome}?`,
      introducao: 'Cuenta en Google cómo fue tu experiencia. Tu reseña ayuda a otras personas a conocer la tienda.',
    },
    avaliar: 'Escribir una reseña en Google',
    origem: { google: 'Reseña en Google', whatsapp: 'Mensaje por WhatsApp' },
    nota: (n) => `Calificación: ${n} de 5`,
    meses: [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
    ],
    data: (mes, ano) => `${mes} de ${ano}`,
  },

  localizacao: {
    titulo: `Servicio técnico de celulares en el barrio ${bairro}`,
    numero: 'N.º',
    ficha: { whatsapp: 'WhatsApp', horario: 'Horario' },
    horarioNaoInformado: 'Consulta por WhatsApp antes de venir.',
    confirmarHorario: 'Confirmar horario',
    confirmarHorarioOculto: ' de atención por WhatsApp',
    horarioExcecoes: 'Feriados y excepciones: confirma por WhatsApp.',
    fechado: 'cerrado',
    abrirMaps: 'Abrir en Google Maps',
    rota: 'Cómo llegar',
    rotaOculto: ' en Google Maps',
    waze: 'Abrir en Waze',
    copiar: {
      rotulo: 'Copiar dirección',
      sucesso: 'Copiada',
      sucessoAnuncio: 'Dirección copiada.',
      falha: 'No se pudo copiar',
      falhaAnuncio: 'No se pudo copiar. Dirección:',
    },
    mapa: {
      titulo: `Mapa de Google con la ubicación de ${nome}`,
    },
  },

  duvidas: {
    titulo: 'Preguntas frecuentes',
    perguntas: [
      {
        id: 'orcamento',
        pergunta: '¿Cómo pido un presupuesto?',
        resposta:
          'Por WhatsApp. El mensaje ya va listo; solo complétalo con el modelo del equipo y lo que pasó.',
        link: { rotulo: 'Pedir presupuesto por WhatsApp', whatsapp: 'orcamento' },
      },
      {
        id: 'garantia',
        pergunta: '¿La reparación tiene garantía?',
        resposta: `Sí. ${nome} ofrece 90 días de garantía en los servicios.`,
      },
      {
        id: 'marcas',
        pergunta: '¿Qué marcas reparan?',
        resposta: 'iPhone y Android: Samsung, Motorola y otras marcas. Pregunta indicando el modelo del equipo.',
        link: { rotulo: 'Preguntar por WhatsApp', whatsapp: 'orcamento' },
      },
      {
        id: 'pagamento',
        pergunta: '¿Se puede pagar en cuotas?',
        resposta: `Sí. En ${nome} puedes pagar en cuotas con tarjeta.`,
      },
      {
        id: 'servicos',
        pergunta: `¿Qué servicios hace ${nome}?`,
        resposta: ({ areas, totalServicos }) => {
          const nomes = areas.map((a) => a.nome.toLowerCase());
          const lista = nomes.length > 1 ? `${nomes.slice(0, -1).join('; ')}; y ${nomes.at(-1)}` : nomes[0];
          const servicos = totalServicos === 1 ? '1 servicio' : `${totalServicos} servicios`;
          const emAreas = areas.length === 1 ? '1 área' : `${areas.length} áreas`;
          return `Son ${servicos}, en ${emAreas}: ${lista}.`;
        },
        link: { rotulo: 'Ver la lista completa', secao: 'servicos' },
      },
      {
        id: 'molhou',
        pergunta: '¿Reparan celulares que se mojaron?',
        resposta: `${nome} hace reparaciones por oxidación y contacto con líquidos. Envía el modelo del equipo y lo que pasó.`,
        link: { rotulo: 'Describir la falla por WhatsApp', whatsapp: 'defeito' },
      },
      {
        id: 'nao-liga',
        pergunta: 'Mi celular no enciende. ¿Lo reparan?',
        resposta: `${nome} recupera equipos que no encienden y hace diagnóstico de fallas. Cuenta el modelo y qué pasó antes de que dejara de encender.`,
        link: { rotulo: 'Describir la falla por WhatsApp', whatsapp: 'defeito' },
      },
      {
        id: 'vidro',
        pergunta: '¿Se puede cambiar solo el vidrio de la pantalla?',
        resposta: 'Cuando es posible, sí: el vidrio se puede cambiar por separado. Pregunta indicando el modelo del equipo.',
        link: { rotulo: 'Preguntar por WhatsApp', whatsapp: 'orcamento' },
      },
      {
        id: 'acessorios',
        pergunta: '¿Venden accesorios?',
        resposta: `Sí. ${nome} también trabaja con accesorios. Pregunta por lo que buscas.`,
        link: { rotulo: 'Preguntar por WhatsApp', whatsapp: 'acessorios' },
      },
      {
        id: 'onde',
        pergunta: `¿Dónde queda ${nome}?`,
        resposta: ({ endereco: e }) =>
          `La tienda queda en ${e.logradouro}, ${e.numero}, en el barrio ${e.bairro}, en ${e.cidade} — ${e.uf}.`,
        link: { rotulo: 'Ver cómo llegar', secao: 'localizacao' },
      },
      {
        id: 'horario',
        pergunta: '¿Cuál es el horario de atención?',
        resposta: ({ horarios, fechados }) => {
          if (!horarios) return 'Confirma por WhatsApp antes de venir.';
          // "Lunes a viernes, de 9:00 a 19:00, y sábado, de 9:00 a 16:00. Domingo, cerrado."
          const faixas = horarios.map((h, i) => `${i === 0 ? h.dias : h.dias.toLowerCase()}, de ${h.horario}`);
          const lista = faixas.length > 1 ? `${faixas.slice(0, -1).join('; ')}, y ${faixas.at(-1)}` : faixas[0];
          return `${lista}.${fechados ? ` ${fechados}, cerrado.` : ''} En feriados, confirma antes de venir.`;
        },
        link: { rotulo: 'Confirmar horario por WhatsApp', whatsapp: 'horario' },
      },
    ],
  },

  cta: {
    titulo: '¿Necesitas ayuda con tu celular?',
    texto: `Comunícate con ${nome} y consulta las opciones de atención.`,
    botao: 'Hablar con un especialista',
    linhaTelefone: 'WhatsApp',
  },

  rodape: {
    frase: `${nome} — servicio técnico de celulares en ${cidade} (${uf}), desde ${ano}.`,
    titulos: { endereco: 'Dirección', whatsapp: 'WhatsApp', navegacao: 'Navegación' },
    navegacaoAria: 'Pie de página',
    abrirMaps: 'Abrir en Google Maps',
    direitos: (anoAtual) => `© ${anoAtual} ${nome}. Todos los derechos reservados.`,
    voltarAoTopo: 'Volver arriba',
  },

  /** A página 404 do site é uma só, em português; este texto fica pronto para uma 404 em espanhol. */
  naoEncontrada: {
    rotulo: 'Error 404',
    titulo: 'Página no encontrada',
    texto: `Esta página no existe o fue eliminada. Vuelve a la página de inicio o habla con ${nome} por WhatsApp.`,
    inicio: 'Ir a la página de inicio',
    whatsapp: 'Hablar por WhatsApp',
  },
};
