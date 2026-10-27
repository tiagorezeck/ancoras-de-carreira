// Conteúdo do Teste Âncoras de Carreira (Edgar Schein), reproduzido fielmente
// a partir do PDF do CEFET-MG/DCSA:
// https://www.dcsa.cefetmg.br/wp-content/uploads/sites/35/2018/09/Teste-ancora-de-carreira.pdf
// Cruzado item a item com a planilha de referência do usuário.

export type AnchorLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';

export interface CareerAnchor {
  letter: AnchorLetter;
  name: string;
  summary: string;
  description: string;
  badge: string;
  iconName: string;
  motivators: string[];
  idealEnvironment: string;
  demotivators: string;
  careerTip: string;
  interviewQuestion: string;
}

export interface Question {
  number: number;
  anchor: AnchorLetter;
  text: string;
}

export const ANCHOR_LETTERS: AnchorLetter[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const CAREER_ANCHORS: Record<AnchorLetter, CareerAnchor> = {
  A: {
    letter: 'A',
    name: 'Competência técnico-funcional',
    summary: 'Quer ser cada vez mais especialista na sua área de atuação.',
    description:
      'Pessoas tecnicamente ancoradas comprometem-se com uma carreira de especialização. Elas ficam motivadas quando são especialistas em um determinado assunto, buscam trabalhos desafiadores, querem testar o conhecimento e a habilidade que possuem em sua área de atuação. São pessoas que não visam altos cargos administrativos (essas normalmente são mais generalistas) e sim cargos de especialista em uma determinada área.',
    badge: 'Mestria & Especialização',
    iconName: 'Cpu',
    motivators: [
      'Aprofundamento contínuo em seu nicho de conhecimento',
      'Ser procurado como autoridade e referência técnica',
      'Resolução de problemas de alta complexidade e precisão',
    ],
    idealEnvironment:
      'Centros de pesquisa, tecnologia, engenharias, consultorias de nicho e empresas com trilha de Carreira em Y bem consolidada.',
    demotivators:
      'Ser promovido forçadamente para funções administrativas de gestão de pessoas e burocracia, distanciando-se da prática.',
    careerTip:
      'Negocie progressão como Especialista Principal, Tech Lead ou Fellow, garantindo remuneração executiva sem abandonar o domínio técnico.',
    interviewQuestion:
      'Como a empresa estrutura a progressão na Carreira em Y para profissionais técnicos que não desejam migrar para gestão de pessoas?',
  },
  B: {
    letter: 'B',
    name: 'Competência administrativa geral',
    summary: 'Busca liderar e assumir os mais altos níveis de responsabilidade.',
    description:
      'Quem tem como âncora de carreira a competência administrativa geral busca, ao longo de sua vida profissional, atingir os mais altos níveis de responsabilidade na organização. São pessoas que visam a liderança e têm como motivação atingir o topo da hierarquia corporativa. Para elas, a especialização é uma armadilha: entendem a importância de conhecer as áreas funcionais, mas não buscam se aprofundar tecnicamente, pois querem a função de gerência geral.',
    badge: 'Liderança & Estratégia',
    iconName: 'Briefcase',
    motivators: [
      'Integrar equipes multifuncionais e articular estratégias',
      'Tomar decisões de grande impacto financeiro e organizacional',
      'Alcançar posições de diretoria executiva e presidência',
    ],
    idealEnvironment:
      'Grandes corporações, consultorias de estratégia de negócios e empresas com estrutura organizacional meritocrática.',
    demotivators:
      'Trabalhar isolado em tarefas operacionais sem poder de decisão ou autoridade para direcionar times.',
    careerTip:
      'Desenvolva forte visão financeira (P&L), inteligência interpessoal e capacidade de comunicação executiva assertiva.',
    interviewQuestion:
      'Quais são os principais canais e expectativas de crescimento para quem busca papéis de liderança executiva e gestão geral de negócios?',
  },
  C: {
    letter: 'C',
    name: 'Autonomia e independência',
    summary: 'Quer fazer as coisas do seu próprio jeito, com liberdade de decisão.',
    description:
      'Pessoas com essa âncora vão buscar, com o passar do tempo, uma carreira que possibilite maior independência, que permite impor suas próprias condições. A autonomia é inerente a qualquer ser humano, em níveis diferentes, mas quem possui fortemente essa âncora sente a necessidade de ser dono de seu próprio destino, fazer as coisas do seu jeito, e por isso vai organizar sua vida profissional em torno de trabalhos que lhe proporcionem mais escolha e poder de decisão.',
    badge: 'Liberdade & Autogestão',
    iconName: 'Compass',
    motivators: [
      'Definir seus próprios métodos, horários e prioridades',
      'Trabalhar orientado a entregas em vez de controle de jornada',
      'Sentimento de posse e liberdade sobre o fluxo de execução',
    ],
    idealEnvironment:
      'Trabalho remoto assíncrono, empresas com cultura de confiança, consultoria independente e organizações orientadas a resultados.',
    demotivators:
      'Microgerenciamento, controle de ponto rígido, burocracias sem utilidade prática e reuniões excessivas.',
    careerTip:
      'Construa alta previsibilidade de entrega para que lideranças e clientes confiem plenamente na sua gestão autônoma.',
    interviewQuestion:
      'Como funciona o modelo de autonomia da empresa na definição de horários e metodologia de entrega no dia a dia?',
  },
  D: {
    letter: 'D',
    name: 'Segurança e estabilidade',
    summary: 'Valoriza previsibilidade, estabilidade e segurança financeira.',
    description:
      'Aqui se enquadram pessoas que precisam se sentir seguras no ambiente de trabalho. Elas buscam maior previsibilidade do futuro, querem "saber onde pisam". São atraídas por empregos em empresas que oferecem essa estabilidade, com bons planos de aposentadoria e boa reputação. É essa estabilidade, principalmente financeira, que vai guiar a carreira desses profissionais.',
    badge: 'Previsibilidade & Proteção',
    iconName: 'ShieldCheck',
    motivators: [
      'Contratos estáveis, benefícios sólidos e plano de previdência',
      'Clareza no plano de carreira e estabilidade no segmento',
      'Tranquilidade sobre o futuro financeiro e da organização',
    ],
    idealEnvironment:
      'Carreiras públicas, grandes multinacionais consolidadas, cooperativas de crédito e indústrias essenciais e reguladas.',
    demotivators:
      'Startups em estágio inicial incerto, ameaça frequente de demissões ou reestruturações bruscas sem aviso.',
    careerTip:
      'Concentre esforços em setores resilientes e certifique-se de manter uma reserva de emergência para manter a paz mental.',
    interviewQuestion:
      'Qual é o histórico de estabilidade financeira e retenção de colaboradores da empresa nos últimos cinco anos?',
  },
  E: {
    letter: 'E',
    name: 'Criatividade empreendedora',
    summary: 'Tem motivação pra criar e construir negócios próprios.',
    description:
      'Nessa âncora estão os profissionais com tino para a criação de novos negócios e organizações. Não são pessoas necessariamente com criatividade artística, mas sim com um espírito empreendedor, que querem estabelecer ou reestruturar negócios próprios. Possuem motivação para, desde cedo, iniciar empreendimentos para ganhar dinheiro. Vale ressaltar que o enfoque aqui não é a busca por autonomia e sim pela criação de negócios.',
    badge: 'Inovação & Empreendedorismo',
    iconName: 'Rocket',
    motivators: [
      'Transformar ideias em projetos e negócios reais e lucrativos',
      'Construir algo autoral e ver o impacto financeiro direto',
      'Identificar oportunidades onde outros enxergam dificuldades',
    ],
    idealEnvironment:
      'Empreendedorismo próprio, ventures corporativos, cargos de intraempreendedorismo e startups em expansão acelerada.',
    demotivators:
      'Ambientes estagnados onde nenhuma proposta nova é aprovada ou onde não há retorno pelo crescimento gerado.',
    careerTip:
      'Aprenda a delegar as operações repetitivas logo que o negócio estabilizar, mantendo sua energia focada na expansão.',
    interviewQuestion:
      'Há incentivos reais ou equity para líderes de novos produtos e autonomia para pilotar projetos do zero?',
  },
  F: {
    letter: 'F',
    name: 'Dedicação a uma causa',
    summary: 'Quer que o trabalho sirva a um valor ou causa maior.',
    description:
      'Pessoas com essa âncora são orientadas em sua carreira por valores que querem imprimir em seu trabalho. Elas se voltam para os valores e se dedicam a causas, mais do que aos seus talentos e competências. São profissionais que querem, de alguma forma, contribuir para um mundo melhor por meio de seu trabalho.',
    badge: 'Propósito & Impacto Social',
    iconName: 'HeartHandshake',
    motivators: [
      'Saber que sua dedicação melhora a vida de pessoas ou do planeta',
      'Coerência ética entre os valores da empresa e os valores pessoais',
      'Legado duradouro além do retorno financeiro',
    ],
    idealEnvironment:
      'Organizações do terceiro setor, empresas B (certificação B-Corp), saúde, educação, tecnologia social e sustentabilidade.',
    demotivators:
      'Práticas comerciais antiéticas, falta de responsabilidade social ou contradição entre discurso e prática.',
    careerTip:
      'Busque organizações cuja causa ressoe com você no dia a dia, e una competência de gestão para amplificar o impacto social.',
    interviewQuestion:
      'Quais métricas de impacto socioambiental a organização acompanha com a mesma seriedade dos resultados financeiros?',
  },
  G: {
    letter: 'G',
    name: 'Desafio puro',
    summary: 'Define sucesso como superar obstáculos cada vez mais difíceis.',
    description:
      'Nessa âncora se encaixam profissionais que definem sucesso como a superação de obstáculos impossíveis ou como a capacidade de solucionar problemas insolúveis. São pessoas que necessitam sentir que podem conquistar qualquer coisa. A busca por desafios permeia a carreira da maioria das pessoas, mas para quem é ancorado no desafio puro, é o que norteia a sua trajetória – todas as suas decisões profissionais vão sempre ser com o objetivo de superar desafios cada vez maiores.',
    badge: 'Superação & Resiliência',
    iconName: 'Target',
    motivators: [
      'Resolver desafios que outros consideram impossíveis',
      'Competição sadia e superação de recordes pessoais',
      'Testar seus próprios limites intelectuais ou operacionais',
    ],
    idealEnvironment:
      'Gestão de crises e turnarounds, expansões pioneiras de mercado, projetos de alta incerteza e consultorias de alto impacto.',
    demotivators:
      'Tarefas rotineiras, processos fáceis sem curva de aprendizado e ausência de metas desafiadoras.',
    careerTip:
      'Evite o esgotamento (burnout) estabelecendo ciclos claros de intensidade máxima seguidos por períodos de recuperação.',
    interviewQuestion:
      'Quais são os problemas mais difíceis e complexos que a equipe ainda não conseguiu solucionar até hoje?',
  },
  H: {
    letter: 'H',
    name: 'Estilo de vida',
    summary: 'Busca equilibrar carreira, família e vida pessoal.',
    description:
      'Muitas vezes interpretam essa âncora como sendo a de pessoas que não dão prioridade a sua carreira. Mas não se trata disso. A questão é que pessoas ancoradas pelo estilo de vida buscam encontrar uma forma de integrar todas as suas necessidades: individuais, de família e de carreira. Podem ser altamente motivadas pelo trabalho, mas entendem que ele deve se integrar a sua vida como um todo. São pessoas que querem, acima de tudo, flexibilidade. Por isso olham mais para a atitude da empresa do que para o programa de trabalho propriamente dito. A diferença para a âncora da autonomia é que elas se adaptam bem ao ambiente organizacional, com suas regras e restrições, mas querem ter opções mais flexíveis de trabalho.',
    badge: 'Equilíbrio & Harmonia',
    iconName: 'SunMedium',
    motivators: [
      'Harmonia equilibrada entre dedicação profissional e vida pessoal',
      'Políticas reais de flexibilidade geográfica e de jornada',
      'Cultura corporativa que respeita fins de semana, férias e família',
    ],
    idealEnvironment:
      'Empresas com jornada flexível, modelo híbrido inteligente, foco em saúde integral e liderança humanizada.',
    demotivators:
      'Cultura tóxica de horas extras não remuneradas, glorificação do cansaço e falta de respeito aos limites pessoais.',
    careerTip:
      'Seja claro sobre suas prioridades e procure empresas que valorizem produtividade e eficiência em vez de horas presenciais.',
    interviewQuestion:
      'Como a cultura da empresa realmente reage quando alguém desliga o celular nas férias ou precisa flexibilizar a rotina por motivos familiares?',
  },
};

export const QUESTION_TEXTS: string[] = [
  'Sonho em ser tão bom no que faço que minha opinião de especialista seja sempre solicitada.',
  'Me sinto mais realizado em meu trabalho quando sou capaz de integrar e gerenciar o trabalho dos outros.',
  'Sonho em ter uma carreira que me dê a liberdade de fazer o trabalho do meu jeito e no tempo por mim programado.',
  'Segurança e estabilidade são mais importantes para mim do que liberdade e autonomia.',
  'Estou sempre procurando ideias que me permitam iniciar meu próprio negócio.',
  'Sentirei sucesso na minha carreira se sentir que contribuí verdadeiramente para o bem-estar da sociedade.',
  'Sonho com uma carreira na qual eu possa solucionar problemas ou vencer em situações extremamente desafiadoras.',
  'Prefiro deixar meu emprego a ser colocado em um trabalho que comprometa minha capacidade de satisfazer meus interesses pessoais e familiares.',
  'Só me sentirei bem-sucedido em minha carreira se puder desenvolver minhas habilidades técnicas e funcionais até o mais alto nível de competência.',
  'Sonho em dirigir uma organização complexa e tomar decisões que afetem muitas pessoas.',
  'Me sinto mais realizado em meu trabalho quando tenho total liberdade de definir minhas próprias tarefas, horários e procedimentos.',
  'Prefiro manter minha atividade atual a aceitar outra tarefa que possa colocar em risco minha segurança na empresa.',
  'Montar meu próprio negócio é mais importante para mim do que atingir uma alta posição gerencial como funcionário.',
  'Me sinto mais realizado em minha carreira quando posso utilizar meus talentos a serviço dos outros.',
  'Me sinto realizado em minha carreira apenas quando enfrento e supero desafios extremamente difíceis.',
  'Sonho com uma carreira que me permita integrar minhas necessidades pessoais, familiares e de trabalho.',
  'Me tornar um gerente técnico em minha área de especialização é mais atraente para mim do que me tornar um gerente geral em alguma organização.',
  'Me sentirei bem-sucedido em minha carreira apenas quando me tornar um gerente geral em alguma organização.',
  'Me sentirei bem-sucedido em minha carreira apenas quando alcançar total autonomia e liberdade.',
  'Procuro trabalhos em organizações que me deem senso de segurança e estabilidade.',
  'Me sinto realizado em minha carreira quando sou capaz de construir alguma coisa que seja inteiramente resultado de minhas ideias e esforços.',
  'Utilizar minhas habilidades para tornar o mundo um lugar melhor para se viver e trabalhar é mais importante para mim do que alcançar uma posição gerencial de alto nível.',
  'Me sinto mais realizado em minha carreira quando soluciono problemas aparentemente insolúveis ou venço o que aparentemente era impossível de ser vencido.',
  'Me sinto bem-sucedido na vida apenas quando sou capaz de equilibrar minhas necessidades pessoais, familiares e de carreira.',
  'Prefiro sair da empresa onde estou a aceitar uma tarefa em esquema rotativo que me afaste da minha área de experiência.',
  'Me tornar um diretor geral é mais atraente para mim do que me tornar um diretor técnico em minha área de especialização.',
  'Para mim, poder fazer um trabalho do meu jeito, livre de regras e restrições, é mais importante do que segurança.',
  'Me sinto mais realizado em meu trabalho quando percebo que tenho total segurança financeira e estabilidade no trabalho.',
  'Me sinto bem-sucedido em meu trabalho apenas quando posso criar ou construir alguma coisa que seja inteiramente de minha autoria.',
  'Sonho em ter uma carreira que faça uma real contribuição à humanidade e à sociedade.',
  'Procuro oportunidades de trabalho que desafiem fortemente minhas habilidades para solucionar problemas.',
  'Equilibrar as exigências da minha vida pessoal e profissional é mais importante do que alcançar alta posição gerencial.',
  'Me sinto plenamente realizado em meu trabalho quando sou capaz de empregar minhas habilidades e talentos especiais.',
  'Prefiro sair da empresa onde estou a aceitar um cargo que me afaste do caminho da diretoria geral.',
  'Prefiro sair da empresa onde estou a aceitar um cargo que reduza minha autonomia e liberdade.',
  'Sonho em ter uma carreira que me dê senso de segurança e estabilidade.',
  'Sonho em iniciar e montar meu próprio negócio.',
  'Prefiro sair da empresa onde estou a aceitar um cargo que prejudique minha capacidade de ser útil aos outros.',
  'Trabalhar em problemas praticamente insolúveis para mim é mais importante do que alcançar uma posição gerencial de alto nível.',
  'Sempre procurei oportunidades de trabalho que minimizassem interferências com assuntos pessoais e familiares.',
];

export const QUESTIONS: Question[] = QUESTION_TEXTS.map((text, index) => {
  const number = index + 1;
  return {
    number,
    anchor: ANCHOR_LETTERS[(number - 1) % 8],
    text,
  };
});

export const SCALE_DESCRIPTIONS: Record<number, { label: string; detail: string }> = {
  1: { label: 'Nunca é verdade', detail: 'Discordo totalmente; não se aplica a mim.' },
  2: { label: 'Raramente', detail: 'Dificilmente reflete minhas preferências.' },
  3: { label: 'Ocasionalmente', detail: 'Às vezes relevante, mas não prioritário.' },
  4: { label: 'Frequentemente', detail: 'Tem bom peso nas minhas escolhas.' },
  5: { label: 'Quase sempre', detail: 'Muito importante para meu bem-estar.' },
  6: { label: 'Sempre é verdade', detail: 'Pilar inegociável; guia minha trajetória.' },
};

export function getSynergyAnalysis(dominant: AnchorLetter, secondary?: AnchorLetter): {
  profileTitle: string;
  summary: string;
  recommendations: string[];
} {
  if (!secondary || dominant === secondary) {
    const anchor = CAREER_ANCHORS[dominant];
    return {
      profileTitle: `Foco Puro em ${anchor.name}`,
      summary: `Seu perfil apresenta uma predominância nítida da âncora ${dominant} (${anchor.name}). Suas escolhas profissionais tendem a ser muito consistentes em torno desse pilar central.`,
      recommendations: [
        anchor.careerTip,
        'Mantenha clareza nas entrevistas sobre o que é inegociável para você.',
        'Avalie com frequência se sua posição atual continua alimentando este pilar.',
      ],
    };
  }

  const pairKey = [dominant, secondary].sort().join('');
  const synergyMap: Record<string, { profileTitle: string; summary: string; recommendations: string[] }> = {
    AB: {
      profileTitle: 'O Líder Técnico-Estratégico (CTO / Head Especialista)',
      summary: 'Você combina a paixão pelo domínio técnico profundo (A) com a habilidade de orquestrar equipes e processos (B). É o perfil ideal para liderança de engenharia, arquitetura corporativa e direção técnica.',
      recommendations: [
        'Atue como ponte entre a equipe técnica profunda e a diretoria de negócios.',
        'Delegue a implementação diária para focar em decisões técnicas de alta arquitetura.',
      ],
    },
    AC: {
      profileTitle: 'O Especialista Autônomo e Consultor',
      summary: 'Grande maestria técnica (A) aliada à necessidade de liberdade de métodos e horários (C). Você floresce onde pode criar soluções complexas sem ser microgerenciado.',
      recommendations: [
        'Estruture sua carreira como consultor sênior, pesquisador ou especialista remoto.',
        'Foque em entregas de alto valor para negociar contratos com autonomia irrestrita.',
      ],
    },
    AD: {
      profileTitle: 'O Especialista Sólido e Institucional',
      summary: 'Você busca o aprimoramento técnico contínuo (A) dentro de um ambiente seguro e previsível (D). Ideal para grandes corporações estáveis ou centros tecnológicos de excelência.',
      recommendations: [
        'Busque empresas tradicionais que ofereçam planos de previdência e carreira técnica estável.',
        'Evite ambientes voláteis que forcem constantes mudanças de área ou demissões.',
      ],
    },
    AE: {
      profileTitle: 'O Inovador Tecnológico / Criador de Soluções',
      summary: 'Capacidade técnica aguçada (A) somada ao espírito empreendedor (E). Você gosta de desenvolver novos produtos, patentes ou startups tecnológicas a partir do seu próprio conhecimento.',
      recommendations: [
        'Busque co-fundadores com perfil comercial para complementar sua força de produto.',
        'Proteja sua propriedade intelectual e foque em validar necessidades de mercado.',
      ],
    },
    AF: {
      profileTitle: 'O Especialista de Causa e Impacto',
      summary: 'Você utiliza seu conhecimento técnico especialista (A) a serviço de uma causa ética, social ou científica nobre (F).',
      recommendations: [
        'Procure projetos de pesquisa em saúde, clima, energia limpa ou tecnologia assistiva.',
        'Use sua autoridade técnica para dar credibilidade às causas que você apoia.',
      ],
    },
    AG: {
      profileTitle: 'O Solucionador de Problemas Impossíveis',
      summary: 'A maestria técnica (A) é seu instrumento para encarar os enigmas mais complexos e desafiadores do mercado (G).',
      recommendations: [
        'Posicione-se em projetos de troubleshooting crítico e desafios de engenharia complexos.',
        'Celebre cada entrega complexa para manter a motivação em alta.',
      ],
    },
    AH: {
      profileTitle: 'O Especialista com Equilíbrio de Vida',
      summary: 'Você quer ser excelente no que faz tecnicamente (A), mas não à custa da sua família, saúde ou interesses pessoais (H).',
      recommendations: [
        'Procure equipes técnicas com forte cultura assíncrona e respeito aos horários.',
        'Evite plantões ou funções de emergência contínua que comprometam seu tempo livre.',
      ],
    },
    BC: {
      profileTitle: 'O Gestor Emancipado / Diretor com Autonomia',
      summary: 'Você gosta de gerenciar e assumir responsabilidades (B), desde que tenha carta branca para agir sem interferências desnecessárias (C).',
      recommendations: [
        'Busque cargos de liderança com autonomia orçamentária e poder de decisão real.',
        'Reporte diretamente para conselhos ou fundadores em vez de estruturas engessadas.',
      ],
    },
    BD: {
      profileTitle: 'O Administrador Corporativo Institucional',
      summary: 'Visão de liderança e crescimento organizacional (B) alinhada à estabilidade e solidez (D). Muito comum em executivos de grandes multinacionais e setor financeiro tradicional.',
      recommendations: [
        'Invista em governança corporativa, compliance e relacionamentos a longo prazo.',
        'Construa lealdade institucional em organizações consolidadas.',
      ],
    },
    BE: {
      profileTitle: 'O Empreendedor Corporativo / Scale-Up Leader',
      summary: 'A ambição gerencial (B) une-se à garra de construir novos negócios (E). Você é ideal para escalar novas unidades de negócios ou gerir empresas em rápida expansão.',
      recommendations: [
        'Negocie participação nos resultados ou equity nas novas frentes criadas.',
        'Equilibre a ousadia da criação com processos gerenciais escaláveis.',
      ],
    },
    BF: {
      profileTitle: 'O Líder de Impacto e Governança Social',
      summary: 'Capacidade de gestão em alta escala (B) direcionada à transformação ética e social (F). Ideal para liderar grandes ONGs ou diretorias de sustentabilidade/ESG.',
      recommendations: [
        'Aplique as melhores práticas do mundo executivo para profissionalizar iniciativas de propósito.',
        'Mantenha a transparência e métricas de impacto no centro da gestão.',
      ],
    },
    BG: {
      profileTitle: 'O Comandante de Viradas (Turnaround Specialist)',
      summary: 'Você quer liderar grandes times (B) para superar crises épicas e metas aparentemente impossíveis (G).',
      recommendations: [
        'Especialize-se em reestruturação e recuperação operacional de empresas em crise.',
        'Lidere pelo exemplo com determinação e clareza nos momentos de tempestade.',
      ],
    },
    BH: {
      profileTitle: 'O Líder Sustentável e Humanizado',
      summary: 'Você busca o topo da gestão (B), mas entende que a liderança saudável exige equilíbrio integral entre vida pessoal e corporativa (H).',
      recommendations: [
        'Construa equipes com cultura de delegação eficiente para não concentrar tudo em você.',
        'Seja referência de equilíbrio e saúde mental para seus liderados.',
      ],
    },
    CD: {
      profileTitle: 'O Profissional Equilibrado e Previsível',
      summary: 'Você valoriza a estabilidade (D), mas necessita de autonomia no dia a dia (C). Costuma se destacar em cargos públicos de carreira técnica ou contratos corporativos estáveis.',
      recommendations: [
        'Busque posições com estabilidade jurídica e baixa supervisão cotidiana.',
        'Estabeleça rotinas consistentes de entrega.',
      ],
    },
    CE: {
      profileTitle: 'O Empreendedor Independente (Solopreneur / Founder)',
      summary: 'A união máxima da liberdade (C) com a criação de novos negócios (E). Você não quer ter chefe nem limites para suas ideias empreendedoras.',
      recommendations: [
        'Construa negócios digitais, consultorias próprias ou startups ágeis.',
        'Automatize rotinas para preservar sua independência de tempo.',
      ],
    },
    CF: {
      profileTitle: 'O Ativista Autônomo',
      summary: 'Você quer defender causas justas (F) com total liberdade e autonomia para falar e agir como achar melhor (C).',
      recommendations: [
        'Atue em movimentos independentes, advocacia social ou consultorias comunitárias.',
        'Mantenha sua integridade sem se prender a aparelhos burocráticos.',
      ],
    },
    CG: {
      profileTitle: 'O Aventureiro de Desafios',
      summary: 'Você gosta de resolver problemas complexos (G) pelas suas próprias regras e métodos (C).',
      recommendations: [
        'Encare projetos como consultor especialista em desafios pontuais.',
        'Evite contratos engessados de permanência longa sem novos desafios.',
      ],
    },
    CH: {
      profileTitle: 'O Nomadismo e Qualidade de Vida',
      summary: 'Autonomia total (C) combinada com estilo de vida pleno (H). O trabalho deve se adaptar à sua vida, permitindo flexibilidade geográfica e pessoal.',
      recommendations: [
        'Adote o modelo de trabalho remoto global, trabalho assíncrono ou contratos sob demanda.',
        'Defina metas semanais para manter alto rendimento sem comprometer a vida pessoal.',
      ],
    },
    DE: {
      profileTitle: 'O Empreendedor Prudente',
      summary: 'Desejo de criar negócios (E), mas com muita cautela e gestão de risco (D). Prefere franquias consagradas ou negócios com fluxo de caixa previsível.',
      recommendations: [
        'Inicie novos empreendimentos em paralelo enquanto mantém a segurança principal.',
        'Opte por modelos de negócio com demanda validada e baixo risco de capital.',
      ],
    },
    DF: {
      profileTitle: 'O Guardião Social Institucional',
      summary: 'Trabalho voltado ao bem-estar coletivo (F) dentro de instituições sólidas e perenes (D), como universidades públicas, órgãos de saúde ou fundações tradicionais.',
      recommendations: [
        'Conecte-se a carreiras públicas ou fundações com financiamento garantido.',
        'Promova melhorias consistentes de longo prazo com segurança institucional.',
      ],
    },
    DG: {
      profileTitle: 'O Especialista em Missões Críticas',
      summary: 'Gosta de segurança e estrutura (D), mas se realiza ao ser acionado para lidar com crises e desafios difíceis (G) dentro da empresa.',
      recommendations: [
        'Atue em áreas de segurança da informação, resposta a incidentes ou infraestrutura crítica.',
        'Aproveite a estabilidade da instituição como base para enfrentar desafios.',
      ],
    },
    DH: {
      profileTitle: 'O Profissional da Tranquilidade',
      summary: 'Previsibilidade e segurança financeira (D) unidas ao equilíbrio e harmonia pessoal (H). Para você, o trabalho é meio de sustento digno e tranquilo.',
      recommendations: [
        'Priorize empresas com políticas consolidadas de descanso e benefícios para família.',
        'Evite ambientes instáveis ou com metas agressivas que ameacem sua paz.',
      ],
    },
    EF: {
      profileTitle: 'O Empreendedor Social',
      summary: 'Criação de novos negócios (E) que tenham como cerne a resolução de problemas sociais, ambientais ou comunitários (F).',
      recommendations: [
        'Estruture negócios de impacto social e capte investimentos de venture filantropia / ESG.',
        'Alinhe retorno financeiro com indicadores reais de impacto positivo.',
      ],
    },
    EG: {
      profileTitle: 'O Empreendedor de Fronteira e Risco',
      summary: 'Motivado por mercados inexplorados e desafios audaciosos (G) na criação de novas empresas revolucionárias (E).',
      recommendations: [
        'Empreenda em mercados de tecnologia emergente, inovação profunda (deep tech) ou disrupção.',
        'Cerque-se de conselheiros experientes para dosar a ousadia.',
      ],
    },
    EH: {
      profileTitle: 'O Criador com Equilíbrio de Vida',
      summary: 'Gosta de construir seus próprios negócios (E), mas projetados para respeitar sua rotina, tempo de lazer e família (H).',
      recommendations: [
        'Crie modelos de negócios com alta automação, infoprodutos ou serviços com margem alta.',
        'Não caia na armadilha de trabalhar 80 horas por semana só por ser seu negócio.',
      ],
    },
    FG: {
      profileTitle: 'O Lutador por Causas Difíceis',
      summary: 'Enfrenta as batalhas mais difíceis e complexas (G) pela defesa dos valores e causas em que acredita (F).',
      recommendations: [
        'Atue em direitos humanos, combate à crise climática ou saúde pública em regiões vulneráveis.',
        'Cuide da saúde emocional para não absorver toda a dor das causas.',
      ],
    },
    FH: {
      profileTitle: 'O Humanista Consciente',
      summary: 'Contribuição positiva para o mundo (F) sem sacrificar o equilíbrio com sua própria família e saúde (H).',
      recommendations: [
        'Atue em organizações sociais maduras que respeitam a integridade física e mental da equipe.',
        'Lembre-se de que cuidar de si mesmo é o primeiro passo para ajudar os outros.',
      ],
    },
    GH: {
      profileTitle: 'O Maratonista do Desafio Sustentável',
      summary: 'Busca a emoção de vencer desafios difíceis (G), mas sabe quando parar para recompor as energias e viver a vida pessoal (H).',
      recommendations: [
        'Trabalhe por sprints ou projetos com início, meio e fim desafiador, tirando períodos sabáticos ou de folga entre eles.',
        'Separe com clareza o momento de alta intensidade do descanso.',
      ],
    },
  };

  if (synergyMap[pairKey]) {
    return synergyMap[pairKey];
  }

  const first = CAREER_ANCHORS[dominant];
  const second = CAREER_ANCHORS[secondary];
  return {
    profileTitle: `${first.name} combinada com ${second.name}`,
    summary: `Seu perfil equilibra os anseios de ${first.name} com a força complementar de ${second.name}. Essa dualidade oferece flexibilidade e capacidade de atuar em papéis multifacetados.`,
    recommendations: [
      first.careerTip,
      second.careerTip,
      'Procure funções que ofereçam um ponto de encontro entre estes dois pilares.',
    ],
  };
}

export interface AnchorTutorialItem {
  letter: AnchorLetter;
  title: string;
  badge: string;
  simpleMeaning: string;
  responsibility: string;
  howToAcquire: string[];
  realLifeExample: string;
  warningSign: string;
}

export const ANCHOR_TUTORIAL_DATA: Record<AnchorLetter, AnchorTutorialItem> = {
  A: {
    letter: 'A',
    title: 'Competência Técnico-Funcional',
    badge: 'Mestre do Ofício & Especialista',
    simpleMeaning:
      'Você ama ser o "mestre" ou a referência naquilo que faz. O seu brilho nos olhos vem de dominar profundamente uma habilidade, ferramenta ou área do saber e ser consultado quando surge um problema complexo.',
    responsibility:
      'Garantir a excelência técnica, a precisão e a qualidade profunda das entregas. Essa âncora é responsável por evitar que o trabalho seja feito de forma rasa ou amadora.',
    howToAcquire: [
      'Invista continuamente em cursos especializados, certificações de ponta e leitura técnica aprofundada.',
      'Resolva problemas difíceis que a maioria dos colegas não sabe como solucionar na prática.',
      'Busque mentores que sejam lendas técnicas no seu mercado e aprenda a metodologia deles.',
      'Negocie planos de Carreira em Y (crescer como Especialista Sênior / Consultor sem precisar virar chefe administrativo).',
    ],
    realLifeExample:
      'O cirurgião que dedica a vida a aprimorar uma técnica cirúrgica rara; o programador que projeta arquiteturas de software complexas; o mecânico mestre que diagnostica o motor só ouvindo o barulho.',
    warningSign:
      'Sentir profundo desânimo ao ser promovido para um cargo de chefia puramente burocrática, passando o dia em reuniões de planilha e se afastando da sua arte.',
  },
  B: {
    letter: 'B',
    title: 'Competência Administrativa Geral',
    badge: 'Maestro & Líder Estratégico',
    simpleMeaning:
      'Você é o maestro da orquestra. Mais do que tocar um instrumento sozinho, o que te realiza é unir pessoas, departamentos e recursos para alcançar grandes metas e ver a organização inteira vencer.',
    responsibility:
      'Dar direção, liderar pessoas, tomar decisões difíceis sob pressão, mediar conflitos e garantir que a empresa dê lucro, resultados e tenha um futuro sólido.',
    howToAcquire: [
      'Desenvolva visão 360° do negócio: aprenda o básico de finanças, vendas, marketing, operações e gestão de pessoas.',
      'Pratique a escuta ativa e a comunicação executiva: um líder de verdade sabe ouvir antes de comandar.',
      'Aprenda a delegar: resista ao impulso de fazer tudo com as próprias mãos e confie tarefas à sua equipe.',
      'Ofereça-se para liderar projetos transversais ou comitês na empresa para treinar sua habilidade de coordenação.',
    ],
    realLifeExample:
      'O Diretor de Operações que alinha logística, vendas e atendimento; o Gerente Geral que coordena uma fábrica inteira; o Diretor Executivo (CEO) que define a estratégia da empresa com os sócios.',
    warningSign:
      'Ficar confinado em uma tarefa técnica isolada, sem autoridade formal para mudar processos ou liderar pessoas.',
  },
  C: {
    letter: 'C',
    title: 'Autonomia e Independência',
    badge: 'Dono do Próprio Destino',
    simpleMeaning:
      'Você valoriza fazer as coisas do seu jeito, no seu ritmo e com as suas próprias regras. Para você, liberdade de escolha e ausência de microgerenciamento valem muito mais do que status ou regras engessadas.',
    responsibility:
      'Inovar em métodos de trabalho, simplificar burocracias inúteis e provar que confiança e foco no resultado geram mais produtividade do que controle obsessivo de ponto.',
    howToAcquire: [
      'Desenvolva autodisciplina de ferro: para conquistar liberdade, você precisa entregar resultados impecáveis nos prazos combinados.',
      'Aprenda a negociar contratos e rotinas orientadas a entregas concretas, e não a horas sentado na cadeira.',
      'Domine ferramentas de autogestão do tempo e organização pessoal (como blocos de foco e listas de prioridades).',
      'Considere modelos como trabalho remoto flexível, consultoria independente, freelancing ou cargos com gestão por resultados.',
    ],
    realLifeExample:
      'O consultor autônomo que define sua própria agenda e atende clientes pelo mundo; o redator que produz melhor de madrugada no seu quarto; o analista que trabalha 100% focado em metas.',
    warningSign:
      'Sensação de sufoco e revolta com chefes controladores ("microgerentes"), relógios de ponto rígidos e relatórios burocráticos sem valor real.',
  },
  D: {
    letter: 'D',
    title: 'Segurança e Estabilidade',
    badge: 'Alicerce Seguro & Previsibilidade',
    simpleMeaning:
      'Você valoriza saber onde pisa. Dormir em paz sabendo que o salário está garantido, que a empresa é sólida e que o amanhã é previsível traz a tranquilidade que você precisa para render o seu melhor.',
    responsibility:
      'Trazer consistência, zelar pelo patrimônio, criar procedimentos seguros e proteger a família e a organização contra riscos desnecessários e volatilidades irresponsáveis.',
    howToAcquire: [
      'Construa uma reputação de alta lealdade e pontualidade: torne-se o profissional em quem todos confiam cegamente.',
      'Monte uma reserva de emergência financeira sólida (6 a 12 meses de despesas pagas) para manter sua paz mental inabalável.',
      'Busque carreiras em setores essenciais e consolidados: setor público, grandes multinacionais tradicionais, cooperativas ou saúde.',
      'Aprofunde-se em processos de governança, conformidade (compliance) e gestão de riscos.',
    ],
    realLifeExample:
      'O servidor público concursado; o bancário de instituição centenária com plano de saúde e previdência estruturados; o engenheiro de segurança que garante a proteção das instalações.',
    warningSign:
      'Crises de ansiedade em empresas que vivem trocando de rumo, com boatos constantes de demissão em massa ou em startups instáveis que podem quebrar no mês seguinte.',
  },
  E: {
    letter: 'E',
    title: 'Criatividade Empreendedora',
    badge: 'Criador & Construtor de Negócios',
    simpleMeaning:
      'Você tem comichão para criar coisas do zero! Sua paixão não é seguir uma trilha pronta, mas sim abrir uma nova estrada: criar produtos, abrir empresas, inventar negócios e ver suas ideias gerando riqueza.',
    responsibility:
      'Gerar novos postos de trabalho, trazer inovação ao mercado, transformar problemas em soluções lucrativas e fazer a economia se movimentar.',
    howToAcquire: [
      'Acostume-se a calcular riscos: comece testando pequenos projetos ou negócios paralelos ("side projects") com pouco investimento.',
      'Aprenda a ouvir clientes reais: descubra dores que as pessoas estão dispostas a pagar para resolver antes de criar o produto.',
      'Desenvolva resistência a frustrações: no empreendedorismo, você vai ouvir dezenas de "não" até encontrar o primeiro cliente fiel.',
      'Monte parcerias complementares: se você é o criativo das ideias, una-se a quem gosta de cuidar das finanças e da operação diária.',
    ],
    realLifeExample:
      'O fundador de uma startup de tecnologia; o dono de uma rede de franquias; o profissional que cria uma nova área de novos negócios dentro da empresa onde trabalha (intraempreendedor).',
    warningSign:
      'Sentir-se desvitalizado e desanimado em empresas onde qualquer ideia nova precisa de 10 carimbos e 6 meses de espera para ser testada.',
  },
  F: {
    letter: 'F',
    title: 'Dedicação a uma Causa',
    badge: 'Propósito & Impacto Social',
    simpleMeaning:
      'Você trabalha com o coração. Para você, trabalhar não é só pagar boletos: é uma oportunidade sagrada de tornar a sociedade mais justa, salvar vidas, proteger o planeta ou ajudar quem mais precisa.',
    responsibility:
      'Manter os valores éticos vivos no mercado, combater injustiças, defender o bem comum e lembrar a todos que as pessoas e a natureza importam mais do que números frios.',
    howToAcquire: [
      'Mapeie com clareza quais causas movem a sua alma: infância, educação, meio ambiente, saúde, direitos humanos ou inclusão.',
      'Procure organizações sérias do Terceiro Setor, empresas com certificação B-Corp ou negócios sociais de impacto comprovado.',
      'Adquira habilidades profissionais de gestão e dados: causas nobres precisam de gestão profissional de alta performance para gerar impacto real.',
      'Participe de trabalhos voluntários e comitês de responsabilidade social para exercitar sua vocação desde já.',
    ],
    realLifeExample:
      'A médica que atende em regiões isoladas; o professor que transforma a vida de jovens vulneráveis; o advogado pro-bono que defende comunidades; o diretor de sustentabilidade que reduz a poluição.',
    warningSign:
      'Decepção amarga ao descobrir que a empresa para a qual trabalha tem discursos lindos de marketing ("greenwashing"), mas adota práticas predatórias e antiéticas por trás dos panos.',
  },
  G: {
    letter: 'G',
    title: 'Desafio Puro',
    badge: 'Conquistador de Obstáculos Impossíveis',
    simpleMeaning:
      'Você é movido a adrenalina e superação. Se a tarefa é fácil, você se entedia e perde a energia; mas se alguém disser "ninguém conseguiu resolver isso até hoje", seus olhos brilham e você não descansa até vencer.',
    responsibility:
      'Desatar nós que parecem impossíveis, tirar empresas da falência, resolver crises graves e levar equipes a quebrar recordes que ninguém acreditava possíveis.',
    howToAcquire: [
      'Aprenda a ver erros como dados: encare cada obstáculo como um quebra-cabeça desafiador, e não como uma derrota pessoal.',
      'Candidate-se voluntariamente para liderar os projetos mais complexos e as tarefas mais espinhosas da sua equipe.',
      'Defina metas audaciosas e desafie a si mesmo constantemente contra os seus próprios recordes anteriores.',
      'Crie momentos obrigatórios de descanso e recuperação para evitar o esgotamento físico e mental (burnout).',
    ],
    realLifeExample:
      'O consultor de "turnaround" que assume empresas falidas para salvá-las; o negociador de crises diplomáticas; o atleta de alta performance; o engenheiro convocado para apagar o fogo de um servidor em colapso.',
    warningSign:
      'Tédio profundo e perda de rendimento quando o trabalho entra em rotina fácil, sem novidades, sem concorrência e sem problemas de alta complexidade.',
  },
  H: {
    letter: 'H',
    title: 'Estilo de Vida',
    badge: 'Equilíbrio Integral de Vida & Carreira',
    simpleMeaning:
      'Você quer ter sucesso profissional, mas sem sacrificar sua saúde mental, sua família, seus hobbies e sua paz. O trabalho deve se encaixar na sua vida com harmonia, e não engolir quem você é.',
    responsibility:
      'Lembrar que o ser humano é completo, prevenir o estresse crônico, criar culturas corporativas humanizadas e provar que pessoas descansadas e felizes produzem com muito mais qualidade.',
    howToAcquire: [
      'Estabeleça limites sagrados: termine o expediente na hora certa e desligue notificações de trabalho fora do horário.',
      'Priorize empresas que ofereçam jornadas flexíveis, modelo híbrido/remoto de verdade e respeito real às férias e licenças.',
      'Trate a sua saúde física, sono de qualidade e tempo com pessoas queridas como compromissos inegociáveis na sua agenda.',
      'Negocie sempre com base em produtividade e metas cumpridas, e nunca em horas de presença física sem propósito.',
    ],
    realLifeExample:
      'O profissional que recusa promoção com viagens semanais para poder jantar com os filhos todas as noites; o desenvolvedor remoto que organiza sua rotina para praticar esportes de dia; quem sabe a hora de fechar a tampa do notebook.',
    warningSign:
      'Esgotamento físico e mental ao cair em culturas tóxicas que glorificam a exaustão ("viva para trabalhar") e onde pedir folga é visto como falta de comprometimento.',
  },
};

