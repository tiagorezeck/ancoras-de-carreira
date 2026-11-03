/**
 * @license
 * Assessment COMET - Motor Interpretativo de Integração do Perfil Profissional
 * Cruzamento Interpretativo de:
 *   1. RIASEC (John Holland) - Descoberta de Afinidades & Ambientes
 *   2. CABIN (Su et al., 2019) - Exploração de Atividades Específicas & 8 SETPOINT
 *   3. Âncoras de Carreira (Edgar Schein) - Direcionamento por Valores & Motivações
 *
 * RIGOR PSICOMÉTRICO:
 * Os três instrumentos preservam 100% de seus questionários, cálculos e relatórios individuais.
 * Não existe pontuação combinada ou ponderação arbitrária. A integração é puramente analítica.
 */

import {
  RiasecType,
  RiasecResult,
  calculateRiasecResult,
  TestAnswers as RiasecAnswers,
  PROFILES_DETAIL,
  RIASEC_COLORS,
  getTypeShortDesc,
} from './riasecData';

import {
  CabinScores,
  calculateCabinScores,
  CABIN_SCALES,
  SETPOINT_DIMENSIONS,
  SetpointCode,
  DEMO_PROFILE_TECH_LEAD,
  DEMO_PROFILE_HEALTH_PEOPLE,
} from './cabinData';

import {
  AnchorLetter,
  CAREER_ANCHORS,
  QUESTIONS as ANCORAS_QUESTIONS,
  SAMPLE_PROFILES as ANCORAS_SAMPLE_PROFILES,
} from './data';

// ---------------------------------------------------------------------------
// TIPOS E ESTRUTURAS DO RELATÓRIO INTEGRADO
// ---------------------------------------------------------------------------

export interface IntegratedParticipantData {
  name: string;
  role?: string;
  evaluationDate: string;
}

export interface ConvergenceItem {
  id: string;
  title: string;
  instrumentsInvolved: string[];
  explanation: string;
  practicalImplication: string;
}

export interface ComplementarityItem {
  id: string;
  dimensionA: string;
  dimensionB: string;
  title: string;
  explanation: string;
  harmonizationStrategy: string;
}

export interface TensionItem {
  id: string;
  title: string;
  tensionSource: string;
  description: string;
  investigationQuestions: string[];
  reconciliationPath: string;
}

export interface ExplorationField {
  id: string;
  level: 1 | 2 | 3; // 1 = Alta Afinidade, 2 = Possibilidades a Explorar, 3 = Pontos de Atenção
  fieldTitle: string;
  sectors: string[];
  concreteActivities: string[];
  compatibleEnvironments: string[];
  justification: string;
  conditionsToObserve?: string;
}

export interface CareerPathEvaluation {
  pathType: 'EMPREGO' | 'EMPREENDEDORISMO' | 'AUTONOMO' | 'GESTAO' | 'ESPECIALISTA' | 'ACADEMICO_CRIATIVO';
  title: string;
  affinityLevel: 'ALTA' | 'MODERADA' | 'CONDICIONADA';
  analysis: string;
  favorableConditions: string[];
  risksOrIncompatibilities: string[];
}

export interface ActionPlanStep {
  horizon: 'CURTO_PRAZO' | 'MEDIO_PRAZO' | 'LONGO_PRAZO';
  periodLabel: string; // "0 a 30 dias", "30 a 90 dias", "90 a 180 dias"
  focusArea: string;
  actions: string[];
  expectedOutput: string;
}

export interface IntegratedProfileAnalysis {
  participant: IntegratedParticipantData;
  isComplete: boolean;
  completionStatus: {
    ancoras: boolean;
    cabin: boolean;
    riasec: boolean;
    completedCount: number;
  };
  
  // Dados calculados de cada instrumento original
  riasecResult: RiasecResult;
  cabinScores: CabinScores;
  ancorasScores: Record<AnchorLetter, number>;
  ancorasDominant: AnchorLetter;
  ancorasSecondary?: AnchorLetter;

  // Capítulo 1: Apresentação
  executiveIntroduction: string;

  // Capítulo 5: Análise Integrada
  convergences: ConvergenceItem[];
  complementarities: ComplementarityItem[];
  tensions: TensionItem[];
  identitySynthesis: {
    coreInterests: string;
    priorityActivities: string;
    favorableEnvironments: string;
    essentialWorkConditions: string;
    dissatisfactionTriggers: string;
    decisionCriteria: string;
  };

  // Capítulo 6: Campos de Exploração
  explorationFields: ExplorationField[];

  // Capítulo 7: Direcionamento Profissional
  favorableEnvironmentsDetail: string[];
  concreteActivitiesToExplore: string[];
  importantChoiceConditions: string[];
  careerPaths: CareerPathEvaluation[];

  // Capítulo 8: Plano de Ação
  actionPlan: ActionPlanStep[];

  // Capítulo 9: Perguntas de Reflexão
  reflectionQuestions: string[];

  // Capítulo 10: Conclusão Executiva
  executiveConclusion: {
    mainAffinities: string;
    priorityActivitiesToInvestigate: string;
    nonNegotiableValues: string;
    promisingPaths: string;
    immediateNextStep: string;
  };
}

// ---------------------------------------------------------------------------
// HELPER PARA CÁLCULO DE ÂNCORAS (Edgar Schein)
// ---------------------------------------------------------------------------

export function calculateAncorasAverages(
  ratings: Record<number, number>,
  bonus: number[]
): Record<AnchorLetter, number> {
  const sums: Record<AnchorLetter, number> = {
    A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0,
  };
  ANCORAS_QUESTIONS.forEach((q) => {
    const base = ratings[q.number] || 0;
    const extra = bonus.includes(q.number) ? 4 : 0;
    sums[q.anchor] += base + extra;
  });
  const averages: Partial<Record<AnchorLetter, number>> = {};
  (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as AnchorLetter[]).forEach((l) => {
    averages[l] = sums[l] / 5;
  });
  return averages as Record<AnchorLetter, number>;
}

export function sortAncoras(averages: Record<AnchorLetter, number>): AnchorLetter[] {
  const order: AnchorLetter[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  return order.slice().sort((a, b) => {
    if (averages[b] !== averages[a]) return averages[b] - averages[a];
    return order.indexOf(a) - order.indexOf(b);
  });
}

// ---------------------------------------------------------------------------
// PERFIS DEMONSTRATIVOS INTEGRADOS (PRE-BUILT FICTITIOUS COMPREHENSIVE PROFILES)
// ---------------------------------------------------------------------------

export interface IntegratedDemoProfile {
  id: string;
  name: string;
  role: string;
  summary: string;
  ancorasRatings: Record<number, number>;
  ancorasBonus: number[];
  cabinAnswers: Record<number, number>;
  riasecAnswers: RiasecAnswers;
}

export const INTEGRATED_DEMO_PROFILES: IntegratedDemoProfile[] = [
  {
    id: 'demo_tech_architect',
    name: 'Carlos Mendes',
    role: 'Arquiteto de Software & Inovação Tecnológica',
    summary: 'Perfil altamente voltado para ciências exatas, tecnologia e inovação, guiado por competência técnico-funcional e autonomia.',
    ancorasRatings: ANCORAS_SAMPLE_PROFILES[0].ratings,
    ancorasBonus: ANCORAS_SAMPLE_PROFILES[0].bonus,
    cabinAnswers: DEMO_PROFILE_TECH_LEAD,
    riasecAnswers: {
      1: { first: 'b1_q2', second: 'b1_q1', third: 'b1_q3' }, // I, R, A
      2: { first: 'b2_q2', second: 'b2_q1', third: 'b2_q5' }, // I, R, E
      3: { first: 'b3_q2', second: 'b3_q1', third: 'b3_q3' },
      4: { first: 'b4_q2', second: 'b4_q1', third: 'b4_q5' },
      5: { first: 'b5_q2', second: 'b5_q1', third: 'b5_q6' },
      6: { first: 'b6_q2', second: 'b6_q1', third: 'b6_q3' },
      7: { first: 'b7_q2', second: 'b7_q1', third: 'b7_q5' },
      8: { first: 'b8_q2', second: 'b8_q1', third: 'b8_q6' },
      9: { first: 'b9_q2', second: 'b9_q1', third: 'b9_q3' },
      10: { first: 'b10_q2', second: 'b10_q1', third: 'b10_q5' },
      11: { first: 'b11_q2', second: 'b11_q1', third: 'b11_q6' },
      12: { first: 'b12_q2', second: 'b12_q1', third: 'b12_q3' },
    },
  },
  {
    id: 'demo_health_people',
    name: 'Dra. Beatriz Santos',
    role: 'Gestora de Saúde & Desenvolvimento Humano',
    summary: 'Perfil dedicado ao cuidado humano, ciências biomédicas e impacto social, conciliando gestão de pessoas com dedicação a uma causa.',
    ancorasRatings: ANCORAS_SAMPLE_PROFILES[2].ratings, // Dedicação a uma causa + Gerencial
    ancorasBonus: ANCORAS_SAMPLE_PROFILES[2].bonus,
    cabinAnswers: DEMO_PROFILE_HEALTH_PEOPLE,
    riasecAnswers: {
      1: { first: 'b1_q4', second: 'b1_q2', third: 'b1_q5' }, // S, I, E
      2: { first: 'b2_q4', second: 'b2_q2', third: 'b2_q5' },
      3: { first: 'b3_q4', second: 'b3_q2', third: 'b3_q5' },
      4: { first: 'b4_q4', second: 'b4_q2', third: 'b4_q5' },
      5: { first: 'b5_q4', second: 'b5_q2', third: 'b5_q5' },
      6: { first: 'b6_q4', second: 'b6_q2', third: 'b6_q5' },
      7: { first: 'b7_q4', second: 'b7_q2', third: 'b7_q5' },
      8: { first: 'b8_q4', second: 'b8_q2', third: 'b8_q5' },
      9: { first: 'b9_q4', second: 'b9_q2', third: 'b9_q5' },
      10: { first: 'b10_q4', second: 'b10_q2', third: 'b10_q5' },
      11: { first: 'b11_q4', second: 'b11_q2', third: 'b11_q5' },
      12: { first: 'b12_q4', second: 'b12_q2', third: 'b12_q5' },
    },
  },
  {
    id: 'demo_entrepreneur_lead',
    name: 'Rodrigo Alencar',
    role: 'Empreendedor & Diretor Estratégico',
    summary: 'Perfil comercial e realizador, com alta iniciativa de negócios, criação de empreendimentos e necessidade de autonomia e desafios.',
    ancorasRatings: ANCORAS_SAMPLE_PROFILES[1].ratings, // Autonomia + Empreendedora
    ancorasBonus: ANCORAS_SAMPLE_PROFILES[1].bonus,
    cabinAnswers: (() => {
      const ans: Record<number, number> = {};
      // Fill influence, organization, creative high
      for (let i = 1; i <= 164; i++) {
        ans[i] = 3;
      }
      // Boost influence scales (30-41)
      for (let i = 117; i <= 164; i++) {
        ans[i] = 5;
      }
      return ans;
    })(),
    riasecAnswers: {
      1: { first: 'b1_q5', second: 'b1_q6', third: 'b1_q4' }, // E, C, S
      2: { first: 'b2_q5', second: 'b2_q6', third: 'b2_q4' },
      3: { first: 'b3_q5', second: 'b3_q6', third: 'b3_q4' },
      4: { first: 'b4_q5', second: 'b4_q6', third: 'b4_q4' },
      5: { first: 'b5_q5', second: 'b5_q6', third: 'b5_q4' },
      6: { first: 'b6_q5', second: 'b6_q6', third: 'b6_q4' },
      7: { first: 'b7_q5', second: 'b7_q6', third: 'b7_q4' },
      8: { first: 'b8_q5', second: 'b8_q6', third: 'b8_q4' },
      9: { first: 'b9_q5', second: 'b9_q6', third: 'b9_q4' },
      10: { first: 'b10_q5', second: 'b10_q6', third: 'b10_q4' },
      11: { first: 'b11_q5', second: 'b11_q6', third: 'b11_q4' },
      12: { first: 'b12_q5', second: 'b12_q6', third: 'b12_q4' },
    },
  },
];

// ---------------------------------------------------------------------------
// ALGORITMO INTEGRATIVO DETERMINÍSTICO (MOTOR PSICOMÉTRICO)
// ---------------------------------------------------------------------------

export function generateIntegratedAnalysis(
  ancorasRatings: Record<number, number>,
  ancorasBonus: number[],
  cabinAnswers: Record<number, number>,
  riasecAnswers: RiasecAnswers,
  participantData: IntegratedParticipantData = { name: 'Participante', evaluationDate: new Date().toLocaleDateString('pt-BR') }
): IntegratedProfileAnalysis {
  // 1. Processar cada instrumento individualmente através de suas funções oficiais
  const ancorasScores = calculateAncorasAverages(ancorasRatings, ancorasBonus);
  const sortedAnchors = sortAncoras(ancorasScores);
  const ancorasDominant = sortedAnchors[0] || 'A';
  const ancorasSecondary = sortedAnchors[1] && ancorasScores[sortedAnchors[1]] !== ancorasScores[ancorasDominant]
    ? sortedAnchors[1]
    : undefined;

  const cabinScores = calculateCabinScores(cabinAnswers);
  const riasecResult = calculateRiasecResult(riasecAnswers);

  const cabinScaleEntries = CABIN_SCALES.map((scale) => ({
    scale,
    score: cabinScores.scales[scale.id] || 3.0,
  })).sort((a, b) => b.score - a.score);

  const topScales = cabinScaleEntries.slice(0, 10);
  const bottomScales = [...cabinScaleEntries].reverse().slice(0, 5);

  const ancorasCompleted = Object.keys(ancorasRatings).length >= 40 && ancorasBonus.length > 0;
  const cabinCompleted = Object.keys(cabinAnswers).length >= 164;
  const riasecCompleted = Object.keys(riasecAnswers).length >= 12;

  let completedCount = 0;
  if (ancorasCompleted) completedCount++;
  if (cabinCompleted) completedCount++;
  if (riasecCompleted) completedCount++;

  const isComplete = completedCount === 3;

  // 2. Extrair traços dominantes
  const primaryType = riasecResult.primaryType;
  const secondaryType = riasecResult.secondaryType;
  const hollandCode = riasecResult.hollandCode;

  // Top SETPOINT dimension
  const sortedSetpoints = [...SETPOINT_DIMENSIONS].sort((a, b) => {
    return (cabinScores.dimensions[b.code] || 0) - (cabinScores.dimensions[a.code] || 0);
  });
  const topSetpoint = sortedSetpoints[0];
  const secondSetpoint = sortedSetpoints[1];

  const dominantAnchorInfo = CAREER_ANCHORS[ancorasDominant];
  const secondaryAnchorInfo = ancorasSecondary ? CAREER_ANCHORS[ancorasSecondary] : undefined;

  // 3. Montar Apresentação Individualizada
  const executiveIntroduction = `Este Relatório Integrado consolida as três investigações da área Mentalidade do Assessment COMET para ${participantData.name}: o mapa de afinidades vocacionais (RIASEC — Código ${hollandCode}), a exploração de tarefas e rotinas reais (CABIN — destaque em ${topSetpoint?.namePt || 'dimensões fundamentais'}) e os valores norteadores de carreira (Âncoras de Schein — Âncora Dominante: ${dominantAnchorInfo.name}). A narrativa analítica aqui apresentada percorre o ciclo AFINIDADES ➔ INTERESSES ESPECÍFICOS ➔ VALORES E MOTIVAÇÕES, articulando convergências concretas e tensões saudáveis para fundamentar decisões profissionais autônomas e de longo prazo.`;

  // 4. Identificar Convergências (Onde os 3 ou 2 apontam na mesma direção)
  const convergences: ConvergenceItem[] = [];

  // Padrão A: Investigativo + Tecnologia/Ciência + Técnica/Especialização
  if (
    (primaryType === 'I' || secondaryType === 'I') &&
    (topSetpoint?.code === 'TECHNOLOGY' || secondSetpoint?.code === 'TECHNOLOGY' || topSetpoint?.code === 'HEALTH_SCIENCE') &&
    (ancorasDominant === 'A' || ancorasSecondary === 'A')
  ) {
    convergences.push({
      id: 'conv_tech_specialist',
      title: 'Sinergia de Maestria Técnica e Investigativa',
      instrumentsInvolved: ['RIASEC (Investigativo)', 'CABIN (Tecnologia/Ciências)', 'Âncoras (Competência Técnico-Funcional)'],
      explanation: 'Há uma forte coerência entre a atração por solucionar problemas complexos (Holland I), o interesse por tarefas de exatas e programação (CABIN) e a motivação central de ser especialista respeitado em seu nicho (Schein A).',
      practicalImplication: 'Ambientes que oferecem trilha de Carreira em Y, laboratórios de P&D ou empresas de engenharia/software onde o mérito é medido pela proficiência técnica gerarão alta realização.',
    });
  }

  // Padrão B: Social + People/Health + Causa ou Gestão de Pessoas
  if (
    (primaryType === 'S' || secondaryType === 'S') &&
    (topSetpoint?.code === 'PEOPLE' || topSetpoint?.code === 'HEALTH_SCIENCE' || secondSetpoint?.code === 'PEOPLE') &&
    (ancorasDominant === 'F' || ancorasDominant === 'B' || ancorasSecondary === 'F')
  ) {
    convergences.push({
      id: 'conv_social_purpose',
      title: 'Alinhamento em Propósito Humano e Impacto Coletivo',
      instrumentsInvolved: ['RIASEC (Social)', 'CABIN (Pessoas/Saúde)', 'Âncoras (Dedicação a uma Causa / Gestão)'],
      explanation: 'O participante demonstra congruência entre a facilidade de interação interpessoal (Holland S), o interesse por rotinas de cuidado/ensino (CABIN) e o valor inegociável de contribuir para uma causa social relevante (Schein F).',
      practicalImplication: 'Papéis em organizações de saúde, consultorias de desenvolvimento de pessoas, ONGs ou setores corporativos com forte pilar ESG conferem o melhor aproveitamento dessa tríade.',
    });
  }

  // Padrão C: Empreendedor + Influência/Negócios + Criatividade Empreendedora ou Autonomia
  if (
    (primaryType === 'E' || secondaryType === 'E') &&
    (topSetpoint?.code === 'INFLUENCE' || secondSetpoint?.code === 'INFLUENCE') &&
    (ancorasDominant === 'E' || ancorasDominant === 'C' || ancorasSecondary === 'E')
  ) {
    convergences.push({
      id: 'conv_enterprise_autonomy',
      title: 'Propulsão Empreendedora e Orientação para Resultados',
      instrumentsInvolved: ['RIASEC (Empreendedor)', 'CABIN (Influência & Negócios)', 'Âncoras (Criatividade Empreendedora/Autonomia)'],
      explanation: 'Identifica-se perfeita convergência entre o ambiente dinâmico de negociação e liderança (Holland E), as tarefas comerciais e executivas (CABIN) e a necessidade de criar algo novo sob sua própria responsabilidade (Schein E/C).',
      practicalImplication: 'Caminhos como fundação de novos negócios, liderança de unidades autônomas de expansão ou consultoria independente com participação nos resultados maximizam sua energia.',
    });
  }

  // Padrão D: Convencional + Organização + Segurança/Estabilidade
  if (
    (primaryType === 'C' || secondaryType === 'C') &&
    (topSetpoint?.code === 'ORGANIZATION' || secondSetpoint?.code === 'ORGANIZATION') &&
    (ancorasDominant === 'D' || ancorasSecondary === 'D')
  ) {
    convergences.push({
      id: 'conv_org_stability',
      title: 'Sinergia Estrutural em Processos, Rigor e Estabilidade',
      instrumentsInvolved: ['RIASEC (Convencional)', 'CABIN (Organização & Processos)', 'Âncoras (Segurança e Estabilidade)'],
      explanation: 'A preferência por regras claras, controle de dados e previsibilidade (Holland C) dialoga diretamente com as tarefas de contabilidade/administração (CABIN) e a prioridade de estabilidade institucional (Schein D).',
      practicalImplication: 'Organizações sólidas, órgãos públicos, auditorias corporativas e instituições financeiras estruturadas oferecem o contexto de previsibilidade necessário.',
    });
  }

  // Fallback garantido se os tipos forem atípicos
  if (convergences.length === 0) {
    convergences.push({
      id: 'conv_hybrid_focus',
      title: `Conexão entre ${PROFILES_DETAIL[primaryType].name} e ${topSetpoint.namePt}`,
      instrumentsInvolved: [`RIASEC (${primaryType})`, `CABIN (${topSetpoint.letter})`, `Âncoras (${dominantAnchorInfo.name})`],
      explanation: `Os interesses do participante em ambientes do tipo ${PROFILES_DETAIL[primaryType].name} encontram campo prático de aplicação nas escalas de ${topSetpoint.namePt}, operando sob a âncora motriz de ${dominantAnchorInfo.name}.`,
      practicalImplication: 'Essa configuração sugere que a satisfação profissional virá de aplicar suas atividades de interesse preferencial em organizações que respeitem a âncora dominante.',
    });
  }

  // 5. Identificar Complementaridades (Coexistência enriquecedora)
  const complementarities: ComplementarityItem[] = [];

  if (ancorasDominant === 'H' || ancorasSecondary === 'H') {
    complementarities.push({
      id: 'comp_lifestyle_balance',
      title: 'Harmonização de Alta Ambição com Estilo de Vida Equilibrado',
      dimensionA: `Atividades em ${topSetpoint.namePt}`,
      dimensionB: 'Âncora de Estilo de Vida (H)',
      explanation: 'O participante tem forte atração por atividades desafiadoras, mas valoriza acima de tudo a capacidade de integrar carreira, vida pessoal e flexibilidade de horários.',
      harmonizationStrategy: 'Buscar modelos de trabalho remoto, contratos por entregas ou empresas com políticas de equilíbrio consolidadas, evitando ambientes que exijam sacrifício contínuo do bem-estar.',
    });
  }

  if (ancorasDominant === 'C' && (primaryType === 'C' || primaryType === 'E')) {
    complementarities.push({
      id: 'comp_autonomy_leadership',
      title: 'Liderança Estratégica com Autonomia de Ação',
      dimensionA: `Perfil Vocacional ${primaryType}`,
      dimensionB: 'Âncora de Autonomia e Independência (C)',
      explanation: 'Há desejo de atuar com impacto e organização, porém sem a rigidez da burocracia corporativa ou microgerenciamento.',
      harmonizationStrategy: 'Atuação como consultor autônomo, líder de equipe ágil com delegação total ou intraempreendedor com autonomia de orçamento e decisões.',
    });
  }

  if (complementarities.length === 0) {
    complementarities.push({
      id: 'comp_versatility',
      title: 'Equilíbrio entre Exploração Prática e Segurança Operacional',
      dimensionA: `Afinidades ${hollandCode}`,
      dimensionB: `Âncora ${dominantAnchorInfo.name}`,
      explanation: 'A diversidade entre seus interesses específicos e suas necessidades de carreira cria uma flexibilidade que permite navegar por diferentes setores sem perder o foco essencial.',
      harmonizationStrategy: 'Construir projetos paralelos ou atribuições transversais na empresa para saciar interesses secundários sem comprometer o valor central da âncora.',
    });
  }

  // 6. Identificar Tensões / Divergências (Não são erros, são pontos de reflexão)
  const tensions: TensionItem[] = [];

  // Tensão: Criativo/Inovador com Âncora de Segurança
  if (
    (primaryType === 'A' || topSetpoint.code === 'CREATIVE_EXPRESSION') &&
    (ancorasDominant === 'D' || ancorasSecondary === 'D')
  ) {
    tensions.push({
      id: 'tens_creative_stability',
      title: 'Impulso Criativo vs. Necessidade de Segurança Financeira',
      tensionSource: 'Interesse por Expressão Criativa x Âncora de Segurança e Estabilidade',
      description: 'Existe forte atração por atividades artísticas, de design ou escrita, que frequentemente ocorrem em mercados voláteis de freelancing, mas a pessoa valoriza previsibilidade de renda e estabilidade institucional.',
      investigationQuestions: [
        'Você prefere trabalhar como criativo interno em uma grande empresa tradicional ou manter a arte como atividade autoral secundária?',
        'Qual o nível mínimo de previsibilidade financeira que você precisa antes de assumir riscos em projetos autorais?',
      ],
      reconciliationPath: 'Atuar em departamentos de design, comunicação corporativa ou inovação em empresas consolidadas, unindo criatividade diária com estabilidade salarial e benefícios.',
    });
  }

  // Tensão: Empreendedorismo de Risco vs. Desejo de Especialização Técnica Pura
  if (
    (primaryType === 'E') &&
    (ancorasDominant === 'A')
  ) {
    tensions.push({
      id: 'tens_business_vs_technical',
      title: 'Atração por Negócios vs. Apego à Profundidade Técnica',
      tensionSource: 'Ambiente Empreendedor/Comercial x Âncora de Competência Técnico-Funcional',
      description: 'O perfil tem energia para influenciar e fechar negócios, mas se afastar da execução técnica profunda (como código, engenharia ou análise) gera sensação de perda de identidade.',
      investigationQuestions: [
        'Você se sente realizado gerenciando pessoas e planilhas comerciais, ou sente falta do contato prático com o produto/análise?',
        'Como você reagiria se fosse promovido a diretor comercial e deixasse de programar ou projetar?',
      ],
      reconciliationPath: 'Cargos híbridos como Arquiteto de Soluções, Sales Engineer, CTO ou Product Lead, onde a visão de mercado é combinada com autoridade técnica.',
    });
  }

  // Tensão padrão se nenhuma específica disparar
  if (tensions.length === 0) {
    tensions.push({
      id: 'tens_breadth_vs_focus',
      title: 'Amplitude de Interesses vs. Critério Restritivo de Carreira',
      tensionSource: 'Múltiplos Interesses CABIN x Exigência da Âncora Dominante',
      description: `O CABIN revela atração por múltiplos grupos de atividades, mas a âncora de ${dominantAnchorInfo.name} exige condições muito específicas de trabalho que nem todo mercado oferece simultaneamente.`,
      investigationQuestions: [
        'Quais das suas atividades favoritas você aceitaria exercer apenas como hobby para proteger sua âncora profissional?',
        'O seu trabalho atual oferece espaço para expressar suas principais afinidades vocacionais?',
      ],
      reconciliationPath: 'Priorizar a âncora de carreira na escolha do contrato e cargo, complementando interesses secundários através de educação contínua ou projetos extracurriculares.',
    });
  }

  // 7. Síntese da Identidade Profissional
  const identitySynthesis = {
    coreInterests: `Predominância em ambientes ${PROFILES_DETAIL[primaryType].name} (${primaryType}) e ${PROFILES_DETAIL[secondaryType].name} (${secondaryType}), com forte atração por ${topSetpoint.namePt}.`,
    priorityActivities: `Tarefas vinculadas a ${topScales.slice(0, 3).map((s) => s.scale.namePt).join(', ')}.`,
    favorableEnvironments: `Organizações que proporcionam ${dominantAnchorInfo.idealEnvironment}`,
    essentialWorkConditions: `Autonomia metodológica, respeito ao princípio de ${dominantAnchorInfo.summary} e coerência com o Código Holland ${hollandCode}.`,
    dissatisfactionTriggers: `${dominantAnchorInfo.demotivators} ou atuação forçada em rotinas puramente opostas aos interesses primários.`,
    decisionCriteria: `Antes de aceitar qualquer oportunidade, validar se o ambiente permite expressar as competências de ${dominantAnchorInfo.badge} sem violar a condição inegociável de trabalho.`,
  };

  // 8. Campos de Exploração em 3 Níveis
  const explorationFields: ExplorationField[] = [
    {
      id: 'field_level_1',
      level: 1,
      fieldTitle: `${topSetpoint.namePt} com Foco em ${dominantAnchorInfo.badge}`,
      sectors: topSetpoint.typicalEnvironments,
      concreteActivities: topScales.slice(0, 4).map((s) => s.scale.sampleActivities[0] || s.scale.namePt),
      compatibleEnvironments: [dominantAnchorInfo.idealEnvironment, ...topSetpoint.typicalEnvironments.slice(0, 2)],
      justification: `Representa o ponto de maior convergência matemática e interpretativa: o participante gosta das atividades cotidianas (CABIN), identifica-se com o clima ocupacional (RIASEC ${primaryType}) e tem suas necessidades motivacionais atendidas (Âncora ${dominantAnchorInfo.letter}).`,
    },
    {
      id: 'field_level_2',
      level: 2,
      fieldTitle: `${secondSetpoint.namePt} Aplicada a ${PROFILES_DETAIL[secondaryType].name}`,
      sectors: secondSetpoint.typicalEnvironments,
      concreteActivities: topScales.slice(4, 7).map((s) => s.scale.sampleActivities[0] || s.scale.namePt),
      compatibleEnvironments: secondSetpoint.typicalEnvironments,
      justification: `Apresenta afinidade sólida nos interesses secundários do CABIN e no segundo pilar do RIASEC. Excelente território para ampliação de repertório ou transições estruturadas.`,
      conditionsToObserve: `Validar se a remuneração, nível de autonomia e previsibilidade atendem aos critérios da âncora dominante (${dominantAnchorInfo.name}).`,
    },
    {
      id: 'field_level_3',
      level: 3,
      fieldTitle: `Atividades em ${sortedSetpoints[sortedSetpoints.length - 1].namePt} ou Mercados de Risco`,
      sectors: sortedSetpoints[sortedSetpoints.length - 1].typicalEnvironments,
      concreteActivities: bottomScales.slice(0, 3).map((s) => s.scale.namePt),
      compatibleEnvironments: ['Setores com baixo alinhamento às âncoras'],
      justification: 'Campos que apresentaram menor pontuação no CABIN ou ambientes que colidem diretamente com os fatores desmotivadores da âncora.',
      conditionsToObserve: 'Não se trata de proibição, mas de alerta: atuar intensamente nessas áreas exigirá esforço compensatório e pode gerar desgaste motivacional rápido.',
    },
  ];

  // 9. Direcionamento Profissional - 6 Caminhos
  const careerPaths: CareerPathEvaluation[] = [
    {
      pathType: 'EMPREGO',
      title: 'Emprego Formal / Carreira Corporativa',
      affinityLevel: ancorasDominant === 'D' || ancorasDominant === 'B' ? 'ALTA' : ancorasDominant === 'C' ? 'CONDICIONADA' : 'MODERADA',
      analysis: 'Adequado para quem busca trilhas de progressão claras e benefícios estruturados, contanto que a empresa permita flexibilidade ou especialização.',
      favorableConditions: ['Planos de carreira transparentes', 'Autonomia no escopo de atuação'],
      risksOrIncompatibilities: ['Burocracias excessivas que barrem a autonomia', 'Ambientes tóxicos de microgerenciamento'],
    },
    {
      pathType: 'ESPECIALISTA',
      title: 'Especialização Técnica / Carreira em Y',
      affinityLevel: ancorasDominant === 'A' || primaryType === 'I' ? 'ALTA' : 'MODERADA',
      analysis: 'Foco no aprofundamento do saber, tornando-se referência incontestável em seu campo de atuação sem necessidade de gerir pessoas.',
      favorableConditions: ['Acesso a desafios técnicos complexos', 'Reconhecimento pela excelência do trabalho'],
      risksOrIncompatibilities: ['Promoções para cargos puramente administrativos que afastem da técnica'],
    },
    {
      pathType: 'GESTAO',
      title: 'Gestão Geral & Liderança Executiva',
      affinityLevel: ancorasDominant === 'B' || primaryType === 'E' ? 'ALTA' : 'MODERADA',
      analysis: 'Integração de funções diversas, coordenação de equipes, responsabilidade por resultados globais e visão estratégica de negócio.',
      favorableConditions: ['Poder de decisão orçamentária e de equipe', 'Visibilidade executiva'],
      risksOrIncompatibilities: ['Cobrança excessiva sem autonomia real de comando'],
    },
    {
      pathType: 'EMPREENDEDORISMO',
      title: 'Empreendedorismo / Novos Negócios',
      affinityLevel: ancorasDominant === 'E' || (primaryType === 'E' && ancorasDominant === 'C') ? 'ALTA' : ancorasDominant === 'D' ? 'CONDICIONADA' : 'MODERADA',
      analysis: 'Criação de novos produtos, empresas ou serviços com autonomia total e aceitação deliberada dos riscos de mercado.',
      favorableConditions: ['Disponibilidade de reserva financeira inicial', 'Alinhamento da ideia com interesses reais'],
      risksOrIncompatibilities: ['Insegurança de receita em momentos de crise para quem tem âncora de segurança'],
    },
    {
      pathType: 'AUTONOMO',
      title: 'Trabalho Autônomo & Consultoria Independente',
      affinityLevel: ancorasDominant === 'C' || ancorasDominant === 'H' ? 'ALTA' : 'MODERADA',
      analysis: 'Prestação de serviços especializados sem vínculo empregatício único, com controle total da agenda e clientes.',
      favorableConditions: ['Rede sólida de contatos profissionais', 'Disciplina para gestão do próprio tempo'],
      risksOrIncompatibilities: ['Necessidade contínua de prospecção comercial para manter fluxo de caixa'],
    },
    {
      pathType: 'ACADEMICO_CRIATIVO',
      title: 'Atuação Acadêmica, Pesquisa ou Produção Criativa',
      affinityLevel: primaryType === 'I' || primaryType === 'A' || topSetpoint.code === 'CREATIVE_EXPRESSION' ? 'ALTA' : 'MODERADA',
      analysis: 'Dedicação à produção do conhecimento científico, ensino superior ou criação artística autoral.',
      favorableConditions: ['Liberdade intelectual e de expressão', 'Tempo protegido para reflexão e elaboração'],
      risksOrIncompatibilities: ['Pressão burocrática institucional de publicações a qualquer custo'],
    },
  ];

  // 10. Plano de Ação em 3 Horizontes
  const actionPlan: ActionPlanStep[] = [
    {
      horizon: 'CURTO_PRAZO',
      periodLabel: 'Curto Prazo — 0 a 30 dias',
      focusArea: 'Ampliação do Autoconhecimento & Mapeamento de Oportunidades',
      actions: [
        `Pesquisar profundamente as 3 principais áreas de atuação identificadas em ${topSetpoint.namePt}.`,
        'Entrevistar 2 profissionais atuantes nos ambientes que você mais valoriza para conhecer o dia a dia real.',
        `Auditar sua rotina atual em relação à sua Âncora de ${dominantAnchorInfo.name}, listando fatores de motivação e desgaste.`,
      ],
      expectedOutput: 'Dossiê pessoal com lista de dúvidas essenciais e mapeamento de setores de interesse prioritário.',
    },
    {
      horizon: 'MEDIO_PRAZO',
      periodLabel: 'Médio Prazo — 30 a 90 dias',
      focusArea: 'Experimentação Prática & Validação de Hipóteses',
      actions: [
        `Realizar um curso rápido ou projeto prático em uma das escalas top do CABIN (${topScales[0]?.scale.namePt}).`,
        'Participar de comunidades, workshops ou eventos do setor escolhido.',
        'Desenvolver uma entrega concreta (artigo, código, proposta comercial ou consultoria piloto) para testar sua atração real pela atividade.',
      ],
      expectedOutput: 'Validação na prática se o interesse teórico se sustenta na execução concreta da rotina profissional.',
    },
    {
      horizon: 'LONGO_PRAZO',
      periodLabel: 'Longo Prazo — 90 a 180 dias',
      focusArea: 'Direcionamento Estruturado & Plano de Carreira / Transição',
      actions: [
        'Definir a meta profissional prioritária para os próximos 2 anos, fundamentada na convergência dos 3 testes.',
        'Mapear eventuais lacunas de capacitação formal ou certificações necessárias para o novo patamar.',
        'Construir um cronograma de transição ou de reposicionamento interno dentro da sua organização atual.',
      ],
      expectedOutput: 'Plano de carreira estruturado com objetivos claros, prazos e métricas de satisfação vocacional.',
    },
  ];

  // 11. Perguntas de Reflexão
  const reflectionQuestions: string[] = [
    `Nas tarefas do seu trabalho atual, quanto tempo você dedica a atividades similares às escalas de ${topSetpoint.namePt}?`,
    `Você já teve que abrir mão da sua âncora de ${dominantAnchorInfo.name} no passado? Qual foi a sensação psicológica e o custo para sua motivação?`,
    `O seu ambiente profissional de hoje tem mais traços do tipo ${PROFILES_DETAIL[primaryType].name} ou você precisa forçar um comportamento que não é natural?`,
    'Quais dos seus interesses identificados no CABIN você ainda não teve a oportunidade de experimentar no mundo real?',
    'Se você pudesse redesenhar 30% da sua rotina de trabalho na próxima semana, quais tarefas você adicionaria e quais eliminaria?',
  ];

  // 12. Conclusão Executiva
  const executiveConclusion = {
    mainAffinities: `Afinidades marcantes em ambientes ${PROFILES_DETAIL[primaryType].name} (${primaryType}) e ${PROFILES_DETAIL[secondaryType].name} (${secondaryType}), com foco em desafios investigativos e estruturados.`,
    priorityActivitiesToInvestigate: `Atividades em ${topScales.slice(0, 3).map((s) => s.scale.namePt).join(', ')}.`,
    nonNegotiableValues: `Ambientes e contratos que preservem a âncora de ${dominantAnchorInfo.name} (${dominantAnchorInfo.badge}), assegurando ${dominantAnchorInfo.summary}`,
    promisingPaths: `Caminhos de atuação em ${explorationFields[0].fieldTitle} e ${explorationFields[1].fieldTitle}, priorizando modelos de ${careerPaths.find((p) => p.affinityLevel === 'ALTA')?.title || 'atuação especializada'}.`,
    immediateNextStep: 'Executar o horizonte de 0 a 30 dias do Plano de Ação: conversar com dois profissionais de referência na área e alinhar as expectativas com a realidade.',
  };

  return {
    participant: participantData,
    isComplete,
    completionStatus: {
      ancoras: ancorasCompleted,
      cabin: cabinCompleted,
      riasec: riasecCompleted,
      completedCount,
    },
    riasecResult,
    cabinScores,
    ancorasScores,
    ancorasDominant,
    ancorasSecondary,
    executiveIntroduction,
    convergences,
    complementarities,
    tensions,
    identitySynthesis,
    explorationFields,
    favorableEnvironmentsDetail: [
      dominantAnchorInfo.idealEnvironment,
      ...topSetpoint.typicalEnvironments,
      ...PROFILES_DETAIL[primaryType].idealEnvironments.slice(0, 3),
    ],
    concreteActivitiesToExplore: topScales.slice(0, 8).map((s) => s.scale.namePt),
    importantChoiceConditions: [
      dominantAnchorInfo.summary,
      `Autonomia para conduzir rotinas alinhadas com o Código Holland ${hollandCode}`,
      `Clima organizacional compatível com ${topSetpoint.namePt}`,
      `Incentivo contínuo a competências do tipo ${dominantAnchorInfo.badge}`,
    ],
    careerPaths,
    actionPlan,
    reflectionQuestions,
    executiveConclusion,
  };
}
