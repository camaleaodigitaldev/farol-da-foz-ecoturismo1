// ---------------------------------------------------------------------------
// Content model for the whole site. A single JSONB document is stored in the
// Supabase `site_content` table and edited through the admin panel. The object
// below is both the TypeScript shape and the default seed used when the DB is
// empty or offline.
// ---------------------------------------------------------------------------

export interface Settings {
  logoLight: string
  logoDark: string
  whatsapp: string // digits only, e.g. "5582999751975"
  email: string
}

export interface Hero {
  label: string
  titleLine1: string
  titleLine2: string
  subtitle: string
  background: string
}

export interface About {
  label: string
  title: string
  image: string
  paragraphs: string[] // first 2 always shown, rest revealed by "Ver mais"
}

export interface Feature {
  title: string
  text: string
  accent: 'gold' | 'eco'
}

export interface Tour {
  id: string
  title: string
  tag: string
  image: string
  featured: boolean
  price: string // "a partir de R$"
  priceCard: string
  duration: string
  group: string
  schedule: string
  min: string
  short: string
  long: string
  stops: string[]
  includes: string[]
}

export interface FleetVehicle {
  id: string
  name: string
  capacity: string
  text: string
  images: string[]
}

export interface Review {
  id: string
  name: string
  meta: string
  color: string
  text: string
  visit: string
  trip: string
}

export interface Reviews {
  score: string
  total: string
  tripadvisorUrl: string
  items: Review[]
}

export interface GalleryItem {
  id: string
  src: string
  cat: 'dunas' | 'rio' | 'frota' | 'base'
  alt: string
}

export interface Director {
  name: string
  role: string
  bio: string
  photo: string
}

export interface Base {
  intro: string
  structure: string[]
  safety: string[]
  images: string[]
  director: Director
}

export interface Contact {
  whatsapp: string
  email: string
  address: string
  instagram: string
  facebook: string
}

export interface SiteContent {
  settings: Settings
  hero: Hero
  about: About
  features: Feature[]
  tours: Tour[]
  fleet: FleetVehicle[]
  reviews: Reviews
  gallery: GalleryItem[]
  base: Base
  contact: Contact
}

const A = (f: string) => `/assets/${f}`

export const defaultContent: SiteContent = {
  settings: {
    logoLight: A('logo-branca.png'),
    logoDark: A('logo-dark.png'),
    whatsapp: '5582999751975',
    email: 'faroldafoztur@hotmail.com',
  },
  hero: {
    label: 'Foz do Rio São Francisco · Piaçabuçu · Alagoas',
    titleLine1: 'Viva a Foz do',
    titleLine2: 'São Francisco',
    subtitle:
      'Onde o Velho Chico encontra o mar. Dunas, ilhas e cultura em passeios com condutores certificados pela ABETA e pelo SEBRAE.',
    background: A('hero-buggy.png'),
  },
  about: {
    label: 'Nossa História',
    title: 'Uma experiência além do que os olhos podem ver',
    image: A('casal-praia.jpeg'),
    paragraphs: [
      'Imagine conhecer a foz do Rio São Francisco de um jeito que vai muito além do que os olhos podem ver. Com a Farol da Foz Ecoturismo, você não faz apenas um passeio… você vive uma experiência completa.',
      'Somos uma empresa pioneira, com anos de história e profundo conhecimento da região. Nossos condutores são capacitados e apaixonados pelo que fazem, prontos para te guiar por cada detalhe desse lugar tão único.',
      'Aqui, você não apenas contempla paisagens deslumbrantes… você entende a importância do Velho Chico, sente a força da natureza e se conecta com a cultura local de forma verdadeira.',
      'E para que sua experiência seja completa do início ao fim, oferecemos toda a estrutura que você merece: base de apoio com estacionamento privativo gratuito, duchas reservadas, sanitários, além de loja de moda praia e conveniência para seu total comodidade.',
      'Escolher a Farol da Foz é escolher segurança, qualidade e uma vivência inesquecível. Porque a foz do Rio São Francisco não é só um destino… é uma história esperando para ser sentida.',
    ],
  },
  features: [
    {
      title: 'Pioneiros na Foz',
      text: 'Fomos os primeiros a estruturar passeios de ecoturismo na foz do rio São Francisco.',
      accent: 'gold',
    },
    {
      title: 'ABETA & SEBRAE',
      text: 'Condutores capacitados pela ABETA Nacional e pelo SEBRAE, com padrão técnico e segurança.',
      accent: 'gold',
    },
    {
      title: 'Experientes em Dunas',
      text: 'Vasta experiência na condução off-road sobre as dunas da região.',
      accent: 'gold',
    },
    {
      title: 'Ecoturismo Responsável',
      text: 'Uma atividade que respeita e preserva o ecossistema único da foz.',
      accent: 'eco',
    },
    {
      title: 'Grupos Pequenos',
      text: 'Atendimento personalizado em grupos reduzidos, com mais atenção e segurança.',
      accent: 'gold',
    },
    {
      title: 'Piaçabuçu · Alagoas',
      text: 'A 140 km de Maceió, na porta de entrada da foz do São Francisco.',
      accent: 'eco',
    },
  ],
  tours: [
    {
      id: 'rota-dourada',
      title: 'Rota Dourada',
      tag: 'Superbuggy · L-200',
      image: A('rota-dourada.png'),
      featured: false,
      price: '200',
      priceCard: 'R$ 210',
      duration: 'Aprox. 3h',
      group: 'Grupos pequenos',
      schedule: '09h e 14h',
      min: '3 pessoas (ou valor equivalente)',
      short:
        'Incursão por mata de restinga, coqueiral, ~9 km de dunas, ski bunda e comunidade quilombola — um dos cenários mais surpreendentes de Alagoas.',
      long:
        'Realizado em superbuggy, Ranger ou L-200, a Rota Dourada é uma excelente opção para conhecer a foz do rio São Francisco e sua área de influência. Uma incursão por mata de restinga, coqueiral, dunas com paradas para skis e comunidade quilombola, revelando um dos cenários mais surpreendentes de Alagoas — com banho nas piscinas naturais formadas pela água da chuva e um bate-papo leve com condutor capacitado pela ABETA e SEBRAE.',
      stops: ['Mata de restinga', 'Coqueiral interpretado', '~9 km de dunas', 'Ski bunda', 'Comunidade quilombola', 'Piscinas naturais'],
      includes: ['Condutor capacitado pela ABETA e SEBRAE', 'Pranchas para ski bunda', 'Estacionamento privativo gratuito', 'Duchas para banho após o passeio'],
    },
    {
      id: 'rota-dourada-plus',
      title: 'Rota Dourada Plus',
      tag: 'Buggy + volta de barco',
      image: A('rota-dourada-plus.png'),
      featured: true,
      price: '200',
      priceCard: 'R$ 210',
      duration: 'Aprox. 3h30',
      group: 'Grupos pequenos',
      schedule: '09h e 14h',
      min: '6 pessoas (ou valor equivalente)',
      short:
        'A opção mais completa: vá por terra em superbuggy ou L-200 e volte por água em barco (ou vice-versa), navegando os últimos quilômetros do Velho Chico entre ilhas.',
      long:
        'A melhor e mais completa opção para conhecer, de fato, a foz do rio São Francisco e sua área de influência: indo por terra em superbuggy ou L-200 e voltando por água em barco (ou vice-versa). Passa por mata de restinga, coqueiral interpretado e aproximadamente 9 km sobre dunas, com paradas para banho nas piscinas naturais, ski bunda, comunidade tradicional quilombola, banho de rio, visita ao encontro das águas e navegando os últimos quilômetros do Velho Chico entre ilhas.',
      stops: ['Ida por terra em buggy', 'Volta de barco', '~9 km de dunas', 'Comunidade quilombola', 'Encontro das águas', 'Navegação entre ilhas'],
      includes: ['Condutor capacitado pela ABETA e SEBRAE', 'Passeio de barco incluso', 'Pranchas para ski bunda', 'Estacionamento privativo gratuito', 'Duchas para banho após o passeio'],
    },
    {
      id: 'passeio-de-barco',
      title: 'Passeio de Barco',
      tag: 'Passeio de Barco',
      image: A('passeio-barco.png'),
      featured: false,
      price: '110',
      priceCard: 'R$ 115',
      duration: 'Aprox. 3h30',
      group: 'Grupos pequenos',
      schedule: '09h e 14h ou a combinar',
      min: '3 pessoas (ou valor equivalente)',
      short:
        'Navegue os últimos 13 km do Velho Chico em barco típico, entre ilhas, coqueirais e mangues, com parada de até 1h para banho perto do encontro das águas.',
      long:
        'Passeio à foz do rio São Francisco em barco típico, percorrendo os últimos 13 km do maior rio genuinamente brasileiro, passando por ilhas, coqueirais e mangues — compondo o mais belo e poético trecho do Velho Chico. Desembarcamos próximo ao encontro das águas, no lado alagoano, onde permanecemos por até 1 hora para banho e apreciação do local.',
      stops: ['Últimos 13 km do Velho Chico', 'Ilhas e coqueirais', 'Mangues', 'Encontro das águas', '1h para banho'],
      includes: ['Barco típico da região', 'Parada de até 1h para banho', 'Condutor experiente', 'Coletes salva-vidas'],
    },
  ],
  fleet: [
    {
      id: 'carcara',
      name: 'Carcará Superbuggy',
      capacity: 'Até 6 passageiros',
      text: 'Veículo aberto, potente e ideal para encarar as dunas com adrenalina e segurança.',
      images: [A('carcara-superbuggy.jpeg'), A('hero-buggy.png'), A('opt-1.png')],
    },
    {
      id: 'cabrita',
      name: 'Cabrita L-200',
      capacity: 'Até 6 passageiros',
      text: 'Robustez e estabilidade para os trechos de areia fofa e o acesso à restinga.',
      images: [A('cabrita-l200.jpeg')],
    },
    {
      id: 'capivara',
      name: 'Capivara Ranger',
      capacity: 'Até 10 pessoas',
      text: 'Espaçoso e confortável para grupos maiores que querem viver a foz juntos.',
      images: [A('capivara-ranger.jpeg')],
    },
  ],
  reviews: {
    score: '4,9',
    total: '1.164',
    tripadvisorUrl:
      'https://www.tripadvisor.com.br/Attraction_Review-g2529360-d2333778-Reviews-Farol_da_Foz_Ecoturismo-Piacabucu_State_of_Alagoas.html',
    items: [
      { id: 'r1', name: 'alan', meta: '7 contribuições', color: '#8a94a6', text: 'Confesso que não fui com alta expectativa, imaginei ser como dunas do Rio Grande do Norte, em menor proporção, mas fui surpreendido de forma positiva. Percebi que seria diferente logo no briefing com o senhor Robério. Meu passeio começou muito bem e superou tudo que eu esperava.', visit: 'dezembro de 2025', trip: 'com amigos' },
      { id: 'r2', name: 'Nayane C', meta: '1 contribuição', color: '#c9885f', text: 'Passeio inesquecível na foz do rio São Francisco. A paisagem é simplesmente deslumbrante, com o encontro do rio com o mar formando um cenário único e cheio de beleza natural. A experiência é tranquila, bem organizada e enriquecedora, com condutores atenciosos.', visit: 'dezembro de 2025', trip: 'com a família' },
      { id: 'r3', name: 'Leticia O', meta: '1 contribuição', color: '#5f9c7a', text: 'Foi uma experiência incrível. Tivemos um imprevisto e quase não conseguimos chegar a tempo, o que seria um pecado perder esse passeio. Todo o caminho é lindo, as informações que recebemos enriquece ainda mais. Valeu super a pena!', visit: 'dezembro de 2025', trip: 'com a família' },
      { id: 'r4', name: 'Fabricio T', meta: '5 contribuições', color: '#6a8fbf', text: 'Um passeio sensacional. Onde tivemos o privilégio de ver dunas lindas, o encontro do rio São Francisco com o mar, um banho de rio delicioso e um pôr do sol lindo. O senhor Roberio é quem cuida de tudo, um senhor que faz de tudo para preservar tudo isso.', visit: 'novembro de 2025', trip: 'com a família' },
      { id: 'r5', name: 'Gabriela Amorim', meta: '2 contribuições', color: '#b56f9e', text: 'Eu estava extremamente ansiosa pelo passeio, por tudo que eu já tinha lido, e sinceramente, superou todas as minhas expectativas e sem dúvidas foi o melhor passeio que fiz em Alagoas. Foi além de um passeio, foi uma aula, uma experiência completa.', visit: 'junho de 2026', trip: 'com a família' },
      { id: 'r6', name: 'Nathalia A', meta: '5 contribuições', color: '#7c8a5f', text: 'Uma experiência incrível, atendimento excelente do início ao fim. Minha família foi muito bem atendida. O local é de fácil localização, limpo, organizado, oferece ducha, cooler para levarmos bebidas. O passeio foi maravilhoso, os guias muito educados.', visit: 'março de 2026', trip: 'com a família' },
      { id: 'r7', name: 'Tamara E', meta: '1 contribuição', color: '#a67f5f', text: 'Foi uma experiência ótima! O ponto de saída tem toda uma estrutura com banheiro, chuveiro, loja de roupas de banho e acessórios. Pegamos um dia que estava nublado, então o clima estava favorável (não estava o calorão). Chuviscou um pouco, mas valeu muito.', visit: 'outubro de 2025', trip: 'em casal' },
      { id: 'r8', name: 'RHDornelles', meta: 'Piraí do Sul, PR • 408 contribuições', color: '#9c6f5f', text: 'Experiência única. Negociação transparente, com o cliente podendo escolher o roteiro e o meio de transporte de ida e de volta. Informes precisos. Perfeita atenção ao cliente, destacando o aspecto ecológico da experiência. Demonstram muito cuidado.', visit: 'janeiro de 2026', trip: 'com a família' },
    ],
  },
  gallery: [
    { id: 'g1', src: A('skibunda.jpeg'), cat: 'dunas', alt: 'Ski bunda nas dunas' },
    { id: 'g2', src: A('hero-buggy.png'), cat: 'dunas', alt: 'Buggy nas dunas' },
    { id: 'g3', src: A('casal-praia.jpeg'), cat: 'dunas', alt: 'Casal nas Dunas Douradas' },
    { id: 'g4', src: A('opt-5.png'), cat: 'dunas', alt: 'Placa Dunas Douradas Piaçabuçu' },
    { id: 'g5', src: A('opt-4.png'), cat: 'dunas', alt: 'Caminhada nas dunas ao pôr do sol' },
    { id: 'g6', src: A('opt-1.png'), cat: 'dunas', alt: 'Buggy na base' },
    { id: 'g7', src: A('passeio-barco.png'), cat: 'rio', alt: 'Passeio de barco no Velho Chico' },
    { id: 'g8', src: A('passeio-lancha.png'), cat: 'rio', alt: 'Passeio de lancha' },
    { id: 'g9', src: A('opt-6.png'), cat: 'rio', alt: 'Barco entre os coqueiros' },
    { id: 'g10', src: A('hero-aerea.jpeg'), cat: 'rio', alt: 'Vista aérea da foz' },
    { id: 'g11', src: A('hero-foz.png'), cat: 'rio', alt: 'Foz do São Francisco' },
    { id: 'g12', src: A('rota-dourada.png'), cat: 'rio', alt: 'Rota Dourada' },
    { id: 'g13', src: A('carcara-superbuggy.jpeg'), cat: 'frota', alt: 'Carcará Superbuggy' },
    { id: 'g14', src: A('cabrita-l200.jpeg'), cat: 'frota', alt: 'Cabrita L-200' },
    { id: 'g15', src: A('capivara-ranger.jpeg'), cat: 'frota', alt: 'Capivara Ranger' },
    { id: 'g16', src: A('base-1.jpeg'), cat: 'base', alt: 'Fachada da base' },
    { id: 'g17', src: A('base-2.jpeg'), cat: 'base', alt: 'Estrutura da base' },
    { id: 'g18', src: A('base-3.jpeg'), cat: 'base', alt: 'Estrutura da base' },
    { id: 'g19', src: A('base-4.jpeg'), cat: 'base', alt: 'Estrutura da base' },
  ],
  base: {
    intro:
      'Toda a estrutura que você merece antes e depois do passeio: base de apoio completa, com conforto e segurança para a sua família aproveitar a foz do São Francisco sem preocupações.',
    structure: [
      'Estacionamento privativo gratuito',
      'Vestiários com chuveiros',
      'Sanitários e redário',
      'Loja de moda praia e conveniência',
    ],
    safety: [
      'Condutores capacitados pela ABETA Nacional e pelo SEBRAE.',
      'Orientação e acompanhamento em todas as etapas do passeio.',
      'Embarcações em conformidade com a Capitania dos Portos.',
      'Coletes salva-vidas e equipamentos revisados para cada saída.',
    ],
    images: [A('base-1.jpeg'), A('base-2.jpeg'), A('base-3.jpeg'), A('base-4.jpeg')],
    director: {
      name: 'Robério Góes',
      role: 'Fundador e Diretor',
      bio: 'Pioneiro no ecoturismo da foz do rio São Francisco, Robério lidera a Farol da Foz com foco em acolhimento, conhecimento da região e experiências seguras em contato com a natureza.',
      photo: A('base-1.jpeg'),
    },
  },
  contact: {
    whatsapp: '5582999751975',
    email: 'faroldafoztur@hotmail.com',
    address: 'Piaçabuçu · Alagoas — a ~140 km de Maceió',
    instagram: 'https://www.instagram.com/faroldafozecoturismo',
    facebook: 'https://www.facebook.com/faroldafozecoturismo',
  },
}
