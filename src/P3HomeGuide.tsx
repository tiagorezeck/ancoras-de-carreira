import React, { useState, useEffect } from 'react';
import {
  Play,
  ArrowRight,
  ChevronRight,
  X,
  Briefcase,
  GraduationCap,
  BookOpen,
  Lightbulb,
  Target,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Compass,
  Anchor,
  GitMerge,
  Info,
} from 'lucide-react';
import {
  RiasecType,
  PROFILES_DETAIL,
  RIASEC_COLORS,
  getTypeShortDesc,
} from './riasecData';
import {
  SETPOINT_DIMENSIONS,
  CABIN_SCALES,
  SetpointCode,
} from './cabinData';
import {
  AnchorLetter,
  ANCHOR_LETTERS,
  CAREER_ANCHORS,
  ANCHOR_TUTORIAL_DATA,
} from './data';

export type HomeGuideTab = 'riasec' | 'cabin' | 'ancoras' | 'interrelacoes';

interface ModuleStatusSummary {
  riasec: { label: string; isCompleted: boolean; inProgress: boolean };
  cabin: { label: string; isCompleted: boolean; inProgress: boolean };
  ancoras: { label: string; isCompleted: boolean; inProgress: boolean };
}

interface P3HomeGuideProps {
  theme: 'light' | 'dark';
  summary: ModuleStatusSummary;
  completedCount: number;
  hasAnyProgress: boolean;
  onOpenStartModal: () => void;
  onStartIndividualTest: (mod: 'riasec' | 'cabin' | 'ancoras') => void;
  onOpenSelfHistory: () => void;
}

const ANCHOR_COLORS: Record<AnchorLetter, string> = {
  A: '#4f46e5',
  B: '#0284c7',
  C: '#0d9488',
  D: '#2563eb',
  E: '#e11d48',
  F: '#10b981',
  G: '#d97706',
  H: '#7c3aed',
};

const SETPOINT_SIMPLE_EXPLANATIONS: Record<SetpointCode, {
  simpleTitle: string;
  plainSummary: string;
  howItFeels: string;
}> = {
  HEALTH_SCIENCE: {
    simpleTitle: 'Ciências da Saúde',
    plainSummary: 'Atividades ligadas a cuidar da saúde, entender doenças, fazer exames ou pesquisar tratamentos e medicamentos.',
    howItFeels: 'Faz sentido para quem tem curiosidade sobre o corpo humano e gosta da ideia de ajudar a recuperar a saúde das pessoas.',
  },
  CREATIVE_EXPRESSION: {
    simpleTitle: 'Expressão Criativa',
    plainSummary: 'Atividades de design, artes visuais, música, escrita, vídeo, gastronomia e criação de ideias originais.',
    howItFeels: 'Combina com quem sente energia ao inventar algo novo, comunicar com estética e sair de rotinas padronizadas.',
  },
  TECHNOLOGY: {
    simpleTitle: 'Tecnologia e Exatas',
    plainSummary: 'Software, programação, engenharia, matemática, dados e investigação lógica de sistemas e fenômenos.',
    howItFeels: 'Ideal para quem gosta de resolver problemas complexos, lidar com tecnologia e entender como as coisas funcionam por dentro.',
  },
  PEOPLE: {
    simpleTitle: 'Pessoas e Desenvolvimento',
    plainSummary: 'Ensinar, acolher, orientar, atender pessoas, apoiar comunidades e estudar o comportamento humano.',
    howItFeels: 'Atrai quem se realiza vendo outras pessoas aprenderem, evoluírem ou serem bem atendidas no dia a dia.',
  },
  ORGANIZATION: {
    simpleTitle: 'Organização e Processos',
    plainSummary: 'Finanças, contabilidade, administração de rotinas, controle de dados, RH e organização detalhada de tarefas.',
    howItFeels: 'Combina com quem gosta de ordem, clareza nos números, planejamento e segurança de processos bem feitos.',
  },
  INFLUENCE: {
    simpleTitle: 'Influência, Negócios e Liderança',
    plainSummary: 'Vendas, marketing, empreendedorismo, gestão de equipes, direito, oratória e negociação estratégica.',
    howItFeels: 'Faz sentido para quem gosta de convencer, liderar projetos, falar em público ou fazer negócios acontecerem.',
  },
  NATURE: {
    simpleTitle: 'Natureza e Agropecuária',
    plainSummary: 'Trabalho com plantas, cultivo agrícola, meio ambiente, preservação florestal e cuidados com animais.',
    howItFeels: 'Combina com quem prefere contato com áreas verdes, animais, sustentabilidade e atividades fora de escritórios fechados.',
  },
  T_THINGS: {
    simpleTitle: 'Práticas Manuais e Operações',
    plainSummary: 'Mecânica, eletrônica, construção, transporte, operação de equipamentos, esportes e segurança prática.',
    howItFeels: 'Ideal para quem prefere colocar a mão na massa, operar ferramentas, se movimentar e ver resultados físicos concretos.',
  },
};

interface InterrelationCardItem {
  id: string;
  code: string;
  color: string;
  tag: string;
  title: string;
  shortDesc: string;
  plainExplanation: string;
  practicalExampleTitle: string;
  practicalExample: string;
  takeaway: string;
}

const INTERRELATION_ITEMS: InterrelationCardItem[] = [
  {
    id: 'convergencia',
    code: '01',
    color: '#4f46e5',
    tag: 'Alinhamento total',
    title: 'Convergência: quando os 3 apontam juntos',
    shortDesc: 'Seu perfil de ambiente, suas atividades preferidas e seus valores caminham na mesma direção.',
    plainExplanation:
      'Acontece quando o ambiente que você gosta (RIASEC), as tarefas do dia a dia (CABIN) e o que você busca na carreira (Âncoras) se reforçam naturalmente. É o sinal mais claro de escolha profissional sustentável.',
    practicalExampleTitle: 'Exemplo na prática',
    practicalExample:
      'Imagine alguém com perfil Investigativo no RIASEC (gosta de analisar), forte interesse em Tecnologia no CABIN (gosta de sistemas e dados) e Âncora Técnico-Funcional (quer ser especialista). Tudo aponta para carreiras como Engenharia, Ciência de Dados ou Arquitetura de Software sem conflito interno.',
    takeaway: 'Quando há convergência, você aprende mais rápido e sente menos desgaste na rotina.',
  },
  {
    id: 'complementaridade',
    code: '02',
    color: '#0d9488',
    tag: 'Do geral ao detalhe',
    title: 'Complementaridade: um teste refina o outro',
    shortDesc: 'O RIASEC mostra o cenário amplo, o CABIN escolhe a área específica e a Âncora define o formato.',
    plainExplanation:
      'Dois profissionais podem ter exatamente o mesmo resultado no RIASEC e precisarem de carreiras completamente diferentes. É aí que o CABIN e as Âncoras entram para dar precisão à escolha.',
    practicalExampleTitle: 'Exemplo na prática',
    practicalExample:
      'Duas pessoas têm perfil Social no RIASEC (gostam de lidar com gente). Pelo CABIN, uma prefere Ciências da Saúde (cuidar de pacientes) e a outra prefere Ensino (dar aulas). Depois, a Âncora define o formato: quem valoriza Estabilidade prefere um hospital ou escola pública; quem valoriza Autonomia prefere consultório próprio ou mentoria.',
    takeaway: 'RIASEC aponta a direção geral, CABIN escolhe a atividade e Âncoras define onde e como trabalhar.',
  },
  {
    id: 'tensoes',
    code: '03',
    color: '#d97706',
    tag: 'Pontos de atenção',
    title: 'Tensões saudáveis: quando há exigências opostas',
    shortDesc: 'Às vezes o que você gosta de fazer pede algo que entra em atrito com o seu estilo de vida ou segurança.',
    plainExplanation:
      'Nem sempre os três resultados combinam sem esforço. Identificar essas diferenças antes de escolher um emprego evita frustrações silenciosas — quando você até gosta da tarefa, mas detesta a pressão, a rotina ou a falta de liberdade da vaga.',
    practicalExampleTitle: 'Exemplo na prática',
    practicalExample:
      'Alguém pode ter alto interesse em Empreendedorismo e Vendas (RIASEC Empreendedor + CABIN Influência), mas ter Âncora forte de Segurança e Estabilidade ou Estilo de Vida. Abrir uma startup arriscada trabalhando 12h por dia geraria ansiedade. A solução equilibrada é atuar com novos negócios dentro de uma empresa sólida (intraempreendedorismo).',
    takeaway: 'Conflito não significa erro: significa que você precisa ajustar o formato da vaga, não abandonar o que gosta.',
  },
  {
    id: 'decisao',
    code: '04',
    color: '#7c3aed',
    tag: 'Decisão prática',
    title: 'Da teoria à escolha: como usar o resultado final',
    shortDesc: 'Ao concluir os 3 testes, o Histórico cruza tudo para sugerir campos, ambientes e próximos passos.',
    plainExplanation:
      'Você não precisa fazer contas nem tentar interpretar gráficos sozinho. Assim que os 3 testes são concluídos, o sistema gera o Resumo dos 3 e Interrelações na aba Histórico, preservando também os três relatórios completos separados.',
    practicalExampleTitle: 'O que você ganha ao concluir os 3',
    practicalExample:
      'No Histórico você vê em um só lugar: 1) Suas principais convergências entre os 3 testes; 2) Alertas práticos sobre o que evitar em vagas; 3) Áreas profissionais e ambientes mais compatíveis com o seu conjunto completo; 4) Cada relatório completo (RIASEC, CABIN e Âncoras) para consultar quando quiser.',
    takeaway: 'Use os três resultados juntos como filtro na hora de escolher curso, transição de carreira ou nova vaga.',
  },
];

export const P3HomeGuide: React.FC<P3HomeGuideProps> = ({
  theme,
  summary,
  completedCount,
  hasAnyProgress,
  onOpenStartModal,
  onStartIndividualTest,
  onOpenSelfHistory,
}) => {
  const [activeGuideTab, setActiveGuideTab] = useState<HomeGuideTab>('interrelacoes');

  // Detail modal state (standardized across all 4 guide tabs)
  const [selectedRiasecModal, setSelectedRiasecModal] = useState<RiasecType | null>(null);
  const [selectedCabinModal, setSelectedCabinModal] = useState<SetpointCode | null>(null);
  const [selectedAnchorModal, setSelectedAnchorModal] = useState<AnchorLetter | null>(null);
  const [selectedInterrelationModal, setSelectedInterrelationModal] = useState<InterrelationCardItem | null>(null);

  const anyModalOpen =
    selectedRiasecModal !== null ||
    selectedCabinModal !== null ||
    selectedAnchorModal !== null ||
    selectedInterrelationModal !== null;

  useEffect(() => {
    if (!anyModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedRiasecModal(null);
        setSelectedCabinModal(null);
        setSelectedAnchorModal(null);
        setSelectedInterrelationModal(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [anyModalOpen]);

  const topCards: Array<{
    id: HomeGuideTab;
    stepLabel: string;
    title: string;
    question: string;
    statusText: string;
    statusTone: 'neutral' | 'amber' | 'emerald' | 'indigo';
    author: string;
    actionLabel: string;
    accentColor: string;
  }> = [
    {
      id: 'riasec',
      stepLabel: '1º RELATÓRIO P³',
      title: 'RIASEC | Descoberta',
      question: '“Onde estão minhas afinidades profissionais?”',
      statusText: summary.riasec.isCompleted
        ? 'Concluído'
        : summary.riasec.inProgress
        ? summary.riasec.label
        : 'Disponível',
      statusTone: summary.riasec.isCompleted
        ? 'emerald'
        : summary.riasec.inProgress
        ? 'amber'
        : 'neutral',
      author: 'John Holland',
      actionLabel: 'Ver explicação',
      accentColor: '#4f46e5',
    },
    {
      id: 'cabin',
      stepLabel: '2º RELATÓRIO P³',
      title: 'CABIN | Exploração',
      question: '“Quais atividades e campos despertam meu interesse?”',
      statusText: summary.cabin.isCompleted
        ? 'Concluído'
        : summary.cabin.inProgress
        ? summary.cabin.label
        : 'Disponível',
      statusTone: summary.cabin.isCompleted
        ? 'emerald'
        : summary.cabin.inProgress
        ? 'amber'
        : 'neutral',
      author: 'Su et al. (2019)',
      actionLabel: 'Ver explicação',
      accentColor: '#0d9488',
    },
    {
      id: 'ancoras',
      stepLabel: '3º RELATÓRIO P³',
      title: 'Âncoras | Direcionamento',
      question: '“O que preciso encontrar na minha carreira?”',
      statusText: summary.ancoras.isCompleted
        ? 'Concluído'
        : summary.ancoras.inProgress
        ? summary.ancoras.label
        : 'Disponível',
      statusTone: summary.ancoras.isCompleted
        ? 'emerald'
        : summary.ancoras.inProgress
        ? 'amber'
        : 'neutral',
      author: 'Edgar Schein (MIT)',
      actionLabel: 'Ver explicação',
      accentColor: '#7c3aed',
    },
    {
      id: 'interrelacoes',
      stepLabel: '4º SÍNTESE P³',
      title: 'Integrado P³ | Interrelações',
      question: '“Como os 3 testes se conectam na prática?”',
      statusText: completedCount === 3 ? 'Pronto no Histórico' : 'Guia em página única',
      statusTone: completedCount === 3 ? 'emerald' : 'indigo',
      author: 'Tríade P³',
      actionLabel: 'Ver interrelações',
      accentColor: '#2563eb',
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 animate-in fade-in duration-200">
      {/* ================= TOP HERO + LAUNCH BANNER (IMAGE 1 PATTERN) ================= */}
      <section className="space-y-5">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            P³ — PERFIL PROFISSIONAL POTENCIAL
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
            Sistema de Avaliação, Autoconhecimento e Direcionamento Profissional.
          </p>
        </div>

        {/* Hero Launch Box */}
        <div
          className={`rounded-3xl p-5 sm:p-7 border transition-colors ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-indigo-950/60 via-slate-900 to-teal-950/50 border-indigo-500/25'
              : 'bg-gradient-to-r from-indigo-50/90 via-white to-teal-50/80 border-indigo-200/80 shadow-sm'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                    Realizar Avaliação P³
                  </h2>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Individual ou Integrado
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  Escolha realizar a <strong>jornada integrada</strong> (os 3 testes em sequência guiada) ou um <strong>teste individual</strong> de forma isolada.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {hasAnyProgress && (
                <button
                  type="button"
                  onClick={onOpenSelfHistory}
                  className={`px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    theme === 'dark'
                      ? 'bg-slate-900/80 border-slate-700 text-slate-200 hover:bg-slate-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  Minha Avaliação ({completedCount}/3)
                </button>
              )}

              <button
                type="button"
                onClick={onOpenStartModal}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all cursor-pointer whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Realizar Teste / Iniciar Avaliação</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Explanatory Selector Cards (Image 1 grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topCards.map((card) => {
            const isSelected = activeGuideTab === card.id;
            const statusClass =
              card.statusTone === 'emerald'
                ? 'text-emerald-600 dark:text-emerald-400'
                : card.statusTone === 'amber'
                ? 'text-amber-600 dark:text-amber-400'
                : card.statusTone === 'indigo'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 dark:text-slate-400';

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => setActiveGuideTab(card.id)}
                className={`text-left p-5 rounded-2xl border transition-all duration-150 flex flex-col justify-between gap-4 cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'hover:border-indigo-400/60'
                }`}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: isSelected ? undefined : 'var(--border-color)',
                }}
              >
                <div className="space-y-3 w-full">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {card.stepLabel}
                    </span>
                    <span className={`text-[11px] font-semibold ${statusClass}`}>
                      {card.statusText}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-xs shrink-0"
                      style={{ backgroundColor: card.accentColor }}
                    >
                      {card.id === 'riasec' ? (
                        <Compass className="w-4 h-4" />
                      ) : card.id === 'cabin' ? (
                        <Layers className="w-4 h-4" />
                      ) : card.id === 'ancoras' ? (
                        <Anchor className="w-4 h-4" />
                      ) : (
                        <GitMerge className="w-4 h-4" />
                      )}
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                      {card.title}
                    </h3>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                      Pergunta central:
                    </div>
                    <p className="text-xs sm:text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed">
                      {card.question}
                    </p>
                  </div>
                </div>

                <div
                  className="pt-3 border-t flex items-center justify-between text-xs w-full"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <span className="text-slate-500 dark:text-slate-400">{card.author}</span>
                  <span
                    className={`inline-flex items-center gap-1 font-bold ${
                      isSelected
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span>{card.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= STANDARDIZED EXPLANATION PANEL BELOW ================= */}

      {/* 1. TAB: INTERRELAÇÕES DOS 3 TESTES (PÁGINA ÚNICA, LINGUAGEM SIMPLES) */}
      {activeGuideTab === 'interrelacoes' && (
        <section className="space-y-8 animate-in fade-in duration-200">
          {/* Intro Banner */}
          <div
            className="p-6 sm:p-8 rounded-3xl border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
              Visão Geral do Sistema P³ · 3 Instrumentos Complementares · Linguagem Simples
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Como os 3 Testes se Interrelacionam
            </h2>
            <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Nenhum teste sozinho conta toda a história da sua carreira. No P³, cada avaliação responde a uma pergunta simples — <strong>Onde</strong> você rende melhor, <strong>O quê</strong> gosta de fazer no dia a dia e <strong>Por quê</strong> escolhe um caminho — para que suas decisões sejam coerentes na prática.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenStartModal}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Iniciar Avaliação Completa P³</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveGuideTab('riasec')}
                className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Explorar cada teste individualmente →
              </button>
            </div>
          </div>

          {/* Como os 3 se conectam (4 Cards padrão com seta > e modal) */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Os 4 Pontos de Conexão entre RIASEC, CABIN e Âncoras
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Clique em qualquer card para ver um exemplo prático em linguagem simples.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INTERRELATION_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedInterrelationModal(item)}
                  className="text-left p-5 rounded-2xl border transition-all cursor-pointer hover:border-indigo-500/60 flex flex-col justify-between gap-4"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="space-y-2.5 w-full">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {item.tag}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.shortDesc}
                    </p>
                  </div>

                  <div
                    className="pt-3 border-t flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 w-full"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <span>Ver exemplo prático</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* A Lógica em 3 Passos (Standard bottom 3-step block) */}
          <div
            className="p-6 rounded-2xl border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> Em resumo: o papel de cada teste na sua escolha
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm leading-relaxed">
              <div
                className="p-4 rounded-xl border"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <span className="w-6 h-6 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold inline-flex items-center justify-center mb-2 text-xs">
                  1
                </span>
                <p className="font-bold text-slate-900 dark:text-white">
                  RIASEC — Onde você se encaixa?
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Mostra o tipo de ambiente e estilo de trabalho em que você rende melhor (prático, analítico, criativo, humano, liderança ou organizado).
                </p>
              </div>

              <div
                className="p-4 rounded-xl border"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <span className="w-6 h-6 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400 font-bold inline-flex items-center justify-center mb-2 text-xs">
                  2
                </span>
                <p className="font-bold text-slate-900 dark:text-white">
                  CABIN — O que gosta de fazer?
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Detalha as 41 atividades reais do dia a dia para apontar exatamente quais campos e tarefas despertam sua energia.
                </p>
              </div>

              <div
                className="p-4 rounded-xl border"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <span className="w-6 h-6 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold inline-flex items-center justify-center mb-2 text-xs">
                  3
                </span>
                <p className="font-bold text-slate-900 dark:text-white">
                  Âncoras — O que é inegociável?
                </p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  Revela seus valores de carreira (estabilidade, liberdade, especialização, propósito, liderança ou equilíbrio) para você acertar na vaga e na empresa.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. TAB: RIASEC (IMAGES 2 & 3 PATTERN) */}
      {activeGuideTab === 'riasec' && (
        <section className="space-y-8 animate-in fade-in duration-200">
          {/* Intro Banner */}
          <div
            className="p-6 sm:p-8 rounded-3xl border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
              1º Instrumento · Ambientes e Tipologias Vocacionais · 12 Blocos · 72 Itens · Código Holland
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Teste RIASEC <span className="font-light text-indigo-600 dark:text-indigo-400">— Teoria de John Holland</span>
            </h2>
            <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              O modelo RIASEC é um dos instrumentos de orientação vocacional mais usados no mundo. Ele identifica em quais das 6 dimensões você tem maior afinidade, gerando seu <strong>Código Holland de 3 letras</strong> para indicar ambientes de trabalho e caminhos profissionais mais compatíveis com seu jeito de ser.
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => onStartIndividualTest('riasec')}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Iniciar Teste RIASEC</span>
              </button>
            </div>
          </div>

          {/* 6 Dimensões Grid with arrow > */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                As 6 Dimensões do Modelo Hexagonal (Holland)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Clique em qualquer dimensão para explorar traços, preferências, carreiras e cursos associados.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(['R', 'I', 'A', 'S', 'E', 'C'] as RiasecType[]).map((type) => {
                const detail = PROFILES_DETAIL[type];
                const color = RIASEC_COLORS[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedRiasecModal(type)}
                    className="text-left p-5 rounded-2xl border transition-all cursor-pointer hover:border-indigo-500/60 flex flex-col justify-between gap-4"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="space-y-3 w-full">
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                          style={{ backgroundColor: color.primary }}
                        >
                          {type}
                        </div>
                        <span
                          className="text-[11px] font-semibold text-right leading-snug"
                          style={{ color: color.primary }}
                        >
                          {detail.tagline}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {detail.name}
                        </h4>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {getTypeShortDesc(type)}
                        </p>
                      </div>
                    </div>

                    <div
                      className="pt-3 border-t flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 w-full"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <span>Ver detalhes e cursos</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Como funciona o RIASEC (3 steps) */}
          <div
            className="p-6 rounded-2xl border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> Como funciona a aplicação do RIASEC
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
              <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
                <span className="w-6 h-6 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold inline-flex items-center justify-center mb-2">
                  1
                </span>
                <p className="font-bold text-slate-900 dark:text-white">12 Blocos de Decisão</p>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  Cada bloco apresenta 6 frases curtas representando cada uma das 6 dimensões do perfil profissional.
                </p>
              </div>

              <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
                <span className="w-6 h-6 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold inline-flex items-center justify-center mb-2">
                  2
                </span>
                <p className="font-bold text-slate-900 dark:text-white">Escolha 1º, 2º e 3º lugar</p>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  Em cada grupo, você marca a opção que mais combina com você em 1º lugar (3 pts), 2º lugar (2 pts) e 3º lugar (1 pt).
                </p>
              </div>

              <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
                <span className="w-6 h-6 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold inline-flex items-center justify-center mb-2">
                  3
                </span>
                <p className="font-bold text-slate-900 dark:text-white">Código Holland Gerado</p>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  O sistema soma seus pontos e aponta as 3 letras mais fortes, junto com ambientes favoráveis e sugestões de carreira.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. TAB: CABIN (STANDARDIZED TO IMAGES 2 & 3 PATTERN + MUCH BETTER EXPLAINED) */}
      {activeGuideTab === 'cabin' && (
        <section className="space-y-8 animate-in fade-in duration-200">
          {/* Intro Banner */}
          <div
            className="p-6 sm:p-8 rounded-3xl border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 mb-2">
              2º Instrumento · Interesses Básicos (Su et al., 2019) · 164 Atividades · 41 Interesses · 8 Dimensões SETPOINT
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Teste CABIN <span className="font-light text-teal-600 dark:text-teal-400">— Exploração de Interesses Reais</span>
            </h2>
            <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Enquanto o RIASEC olha para 6 grandes perfis gerais, o <strong>CABIN</strong> vai muito mais fundo: ele avalia o quanto você gosta de <strong>164 atividades práticas do dia a dia</strong>, agrupadas em <strong>41 interesses específicos</strong> (como Finanças, Programação, Cuidados Médicos, Gastronomia ou Ensino) e organizados em <strong>8 grandes áreas (modelo SETPOINT)</strong>.
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => onStartIndividualTest('cabin')}
                className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Iniciar Teste CABIN</span>
              </button>
            </div>
          </div>

          {/* 8 Dimensões SETPOINT Grid with arrow > */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                As 8 Grandes Áreas SETPOINT e os 41 Interesses Básicos
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Clique em qualquer área abaixo para ver todas as especialidades incluídas nela e exemplos de tarefas do dia a dia.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SETPOINT_DIMENSIONS.map((dim) => {
                const simple = SETPOINT_SIMPLE_EXPLANATIONS[dim.code];
                return (
                  <button
                    key={dim.code}
                    type="button"
                    onClick={() => setSelectedCabinModal(dim.code)}
                    className="text-left p-5 rounded-2xl border transition-all cursor-pointer hover:border-teal-500/60 flex flex-col justify-between gap-4"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="space-y-3 w-full">
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                          style={{ backgroundColor: dim.colorHex }}
                        >
                          {dim.letter}
                        </div>
                        <span
                          className="text-[11px] font-semibold tabular-nums"
                          style={{ color: dim.colorHex }}
                        >
                          {dim.scaleIds.length} interesses básicos
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {simple.simpleTitle}
                        </h4>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                          {simple.plainSummary}
                        </p>
                      </div>
                    </div>

                    <div
                      className="pt-3 border-t flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400 w-full"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <span>Ver {dim.scaleIds.length} áreas e tarefas</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Como funciona o CABIN (3 steps) */}
          <div
            className="p-6 rounded-2xl border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> Como funciona a aplicação do CABIN
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
              <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
                <span className="w-6 h-6 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400 font-bold inline-flex items-center justify-center mb-2">
                  1
                </span>
                <p className="font-bold text-slate-900 dark:text-white">164 Atividades Concretas</p>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  Você avalia tarefas reais (4 exemplos para cada um dos 41 interesses básicos), sem termos vagos ou confusos.
                </p>
              </div>

              <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
                <span className="w-6 h-6 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400 font-bold inline-flex items-center justify-center mb-2">
                  2
                </span>
                <p className="font-bold text-slate-900 dark:text-white">Escala simples de 1 a 5</p>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  Para cada tarefa, responda o quanto você gostaria de fazê-la (de “Detestaria” a “Adoraria”), pensando no interesse e não se já sabe fazer.
                </p>
              </div>

              <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
                <span className="w-6 h-6 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400 font-bold inline-flex items-center justify-center mb-2">
                  3
                </span>
                <p className="font-bold text-slate-900 dark:text-white">Mapa Detalhado SETPOINT</p>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  O resultado mostra seu ranking completo das 41 áreas específicas e um gráfico com suas 8 macrodimensões mais fortes.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. TAB: ÂNCORAS DE CARREIRA (STANDARDIZED TO IMAGES 2 & 3 PATTERN + MUCH BETTER EXPLAINED) */}
      {activeGuideTab === 'ancoras' && (
        <section className="space-y-8 animate-in fade-in duration-200">
          {/* Intro Banner */}
          <div
            className="p-6 sm:p-8 rounded-3xl border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
              3º Instrumento · Edgar Schein (MIT) · 40 Afirmações · 8 Pilares · Bônus de Priorização
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Âncoras de Carreira <span className="font-light text-purple-600 dark:text-purple-400">— O Que Você Não Abre Mão</span>
            </h2>
            <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Criada por Edgar Schein no MIT, esta avaliação descobre qual é o seu <strong>valor central de carreira</strong> — aquilo que você jamais abriria mão em uma mudança de emprego (como estabilidade, liberdade, especialização técnica, liderança ou equilíbrio de vida). É a bússola que evita arrependimentos ao escolher uma empresa ou cargo.
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => onStartIndividualTest('ancoras')}
                className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Iniciar Teste Âncoras</span>
              </button>
            </div>
          </div>

          {/* 8 Pilares Grid with arrow > */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Os 8 Pilares de Edgar Schein
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Clique em qualquer âncora para entender em palavras simples o que ela significa, exemplos reais e sinais de alerta.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ANCHOR_LETTERS.map((letter) => {
                const anchor = CAREER_ANCHORS[letter];
                const tutorial = ANCHOR_TUTORIAL_DATA[letter];
                const color = ANCHOR_COLORS[letter];
                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => setSelectedAnchorModal(letter)}
                    className="text-left p-5 rounded-2xl border transition-all cursor-pointer hover:border-purple-500/60 flex flex-col justify-between gap-4"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="space-y-3 w-full">
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                          style={{ backgroundColor: color }}
                        >
                          {letter}
                        </div>
                        <span
                          className="text-[11px] font-semibold text-right leading-snug"
                          style={{ color }}
                        >
                          {anchor.badge}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {anchor.name}
                        </h4>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                          {tutorial.simpleMeaning}
                        </p>
                      </div>
                    </div>

                    <div
                      className="pt-3 border-t flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400 w-full"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <span>Ver explicação e exemplos</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Como funciona o inventário Âncoras (3 steps) */}
          <div
            className="p-6 rounded-2xl border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> Como funciona a aplicação das Âncoras
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
              <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
                <span className="w-6 h-6 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold inline-flex items-center justify-center mb-2">
                  1
                </span>
                <p className="font-bold text-slate-900 dark:text-white">40 Afirmações Práticas</p>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  Responda em 10 blocos rápidos de 4 perguntas, dando nota de 1 (nunca é verdade) a 6 (sempre é verdade para mim).
                </p>
              </div>

              <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
                <span className="w-6 h-6 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold inline-flex items-center justify-center mb-2">
                  2
                </span>
                <p className="font-bold text-slate-900 dark:text-white">Bônus dos 3 Pilares (+4 pts)</p>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  Ao final, você revisa suas notas mais altas e marca as 3 afirmações mais importantes da sua vida, que recebem +4 pontos extras.
                </p>
              </div>

              <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
                <span className="w-6 h-6 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold inline-flex items-center justify-center mb-2">
                  3
                </span>
                <p className="font-bold text-slate-900 dark:text-white">Ranking, Sinergia e Perguntas</p>
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                  O sistema calcula sua âncora dominante e secundária, analisa a combinação entre elas e sugere perguntas para entrevistas.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= MODAL 1: DETALHES RIASEC ================= */}
      {selectedRiasecModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedRiasecModal(null);
          }}
        >
          <div
            className="w-full max-w-2xl max-h-[88vh] overflow-y-auto p-6 md:p-8 rounded-2xl shadow-2xl border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
            role="dialog"
            aria-modal="true"
          >
            {(() => {
              const detail = PROFILES_DETAIL[selectedRiasecModal];
              const colorObj = RIASEC_COLORS[selectedRiasecModal];
              return (
                <div className="space-y-6">
                  <div
                    className="flex items-center justify-between pb-4 border-b"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0"
                        style={{ backgroundColor: colorObj.primary }}
                      >
                        {selectedRiasecModal}
                      </div>
                      <div>
                        <div className="text-xs font-semibold" style={{ color: colorObj.primary }}>
                          {detail.tagline}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {detail.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {detail.description}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedRiasecModal(null)}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                      aria-label="Fechar detalhes"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Traços Marcantes */}
                  <div>
                    <h4 className="font-bold text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-2">
                      Traços Marcantes
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {detail.personalityTraits.map((trait, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Preferências & Ambientes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className="p-4 rounded-xl border"
                      style={{
                        backgroundColor: 'var(--bg-surface-elevated)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Preferências de Trabalho
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {detail.workPreferences.map((wp, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-indigo-500 shrink-0">•</span>
                            <span>{wp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div
                      className="p-4 rounded-xl border"
                      style={{
                        backgroundColor: 'var(--bg-surface-elevated)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Ambientes Favoráveis
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {detail.idealEnvironments.map((env, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 shrink-0">•</span>
                            <span>{env}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Carreiras */}
                  <div>
                    <h4 className="font-bold text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-500" /> Carreiras Típicas
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {detail.recommendedCareers.map((cat, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border text-xs"
                          style={{
                            backgroundColor: 'var(--bg-surface-elevated)',
                            borderColor: 'var(--border-color)',
                          }}
                        >
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                            {cat.category}
                          </span>
                          <span className="text-slate-700 dark:text-slate-300">
                            {cat.jobs.join(', ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cursos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-purple-500" /> Cursos Superiores
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                        {detail.higherEducationCourses.map((c, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-teal-500" /> Cursos Técnicos
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                        {detail.technicalCourses.map((c, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ================= MODAL 2: DETALHES CABIN (SETPOINT + INTERESSES BÁSICOS) ================= */}
      {selectedCabinModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedCabinModal(null);
          }}
        >
          <div
            className="w-full max-w-2xl max-h-[88vh] overflow-y-auto p-6 md:p-8 rounded-2xl shadow-2xl border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
            role="dialog"
            aria-modal="true"
          >
            {(() => {
              const dim = SETPOINT_DIMENSIONS.find((d) => d.code === selectedCabinModal);
              if (!dim) return null;
              const simple = SETPOINT_SIMPLE_EXPLANATIONS[dim.code];
              const scales = CABIN_SCALES.filter((s) => s.dimension === dim.code);

              return (
                <div className="space-y-6">
                  <div
                    className="flex items-center justify-between pb-4 border-b"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0"
                        style={{ backgroundColor: dim.colorHex }}
                      >
                        {dim.letter}
                      </div>
                      <div>
                        <div className="text-xs font-semibold" style={{ color: dim.colorHex }}>
                          SETPOINT · {scales.length} interesses básicos incluídos
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {dim.namePt}
                        </h3>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCabinModal(null)}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                      aria-label="Fechar detalhes"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Em palavras simples */}
                  <div className="p-4 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-800/40 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                      <Lightbulb className="w-4 h-4" />
                      <span>O que é na prática</span>
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {simple.plainSummary}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {simple.howItFeels}
                    </p>
                  </div>

                  {/* Ambientes Típicos */}
                  <div>
                    <h4 className="font-bold text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400 mb-2">
                      Onde costuma atuar
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {dim.typicalEnvironments.map((env, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200"
                        >
                          {env}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Lista completa dos Interesses Básicos desta dimensão */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs tracking-wider uppercase text-slate-500 dark:text-slate-400">
                      Interesses Básicos avaliados dentro desta área ({scales.length})
                    </h4>
                    <div className="space-y-3">
                      {scales.map((scale) => (
                        <div
                          key={scale.id}
                          className="p-4 rounded-xl border space-y-2"
                          style={{
                            backgroundColor: 'var(--bg-surface-elevated)',
                            borderColor: 'var(--border-color)',
                          }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                              {scale.number}. {scale.namePt}
                            </h5>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {scale.description}
                          </p>
                          <div className="pt-1 text-xs text-slate-500 dark:text-slate-400">
                            <strong className="text-slate-700 dark:text-slate-200">Exemplos de atividades: </strong>
                            {scale.sampleActivities.join(' · ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ================= MODAL 3: DETALHES ÂNCORAS DE CARREIRA ================= */}
      {selectedAnchorModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedAnchorModal(null);
          }}
        >
          <div
            className="w-full max-w-2xl max-h-[88vh] overflow-y-auto p-6 md:p-8 rounded-2xl shadow-2xl border"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
            role="dialog"
            aria-modal="true"
          >
            {(() => {
              const anchor = CAREER_ANCHORS[selectedAnchorModal];
              const tutorial = ANCHOR_TUTORIAL_DATA[selectedAnchorModal];
              const color = ANCHOR_COLORS[selectedAnchorModal];

              return (
                <div className="space-y-5">
                  <div
                    className="flex items-center justify-between pb-4 border-b"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0"
                        style={{ backgroundColor: color }}
                      >
                        {selectedAnchorModal}
                      </div>
                      <div>
                        <div className="text-xs font-semibold" style={{ color }}>
                          Âncora {selectedAnchorModal} · {anchor.badge}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {anchor.name}
                        </h3>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedAnchorModal(null)}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                      aria-label="Fechar detalhes"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Em palavras simples */}
                  <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
                      <Lightbulb className="w-4 h-4" />
                      <span>Em palavras simples</span>
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      {tutorial.simpleMeaning}
                    </p>
                  </div>

                  {/* Pelo que é responsável */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Pelo que esta âncora é responsável</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {tutorial.responsibility}
                    </p>
                  </div>

                  {/* Exemplo na prática e Sinal de alerta */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div
                      className="p-4 rounded-xl border space-y-1.5"
                      style={{
                        backgroundColor: 'var(--bg-surface-elevated)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Exemplo na vida real</span>
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {tutorial.realLifeExample}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/25 border border-rose-200/60 dark:border-rose-900/40 space-y-1.5">
                      <h4 className="font-bold text-xs text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Sinal de alerta</span>
                      </h4>
                      <p className="text-xs text-rose-800/90 dark:text-rose-200/90 leading-relaxed">
                        {tutorial.warningSign}
                      </p>
                    </div>
                  </div>

                  {/* Como desenvolver */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Como fortalecer e aplicar na sua carreira</span>
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {tutorial.howToAcquire.map((tip, idx) => (
                        <li
                          key={idx}
                          className="p-3 rounded-xl border flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
                          style={{
                            backgroundColor: 'var(--bg-surface-elevated)',
                            borderColor: 'var(--border-color)',
                          }}
                        >
                          <span className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pergunta de entrevista */}
                  <div
                    className="p-4 rounded-xl border text-xs"
                    style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <strong className="text-slate-900 dark:text-white block mb-1">
                      Pergunta útil para fazer em entrevistas:
                    </strong>
                    <span className="italic text-slate-600 dark:text-slate-300">
                      “{anchor.interviewQuestion}”
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ================= MODAL 4: DETALHES INTERRELAÇÕES P³ ================= */}
      {selectedInterrelationModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedInterrelationModal(null);
          }}
        >
          <div
            className="w-full max-w-xl max-h-[88vh] overflow-y-auto p-6 md:p-8 rounded-2xl shadow-2xl border space-y-5"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="flex items-center justify-between pb-4 border-b"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0"
                  style={{ backgroundColor: selectedInterrelationModal.color }}
                >
                  {selectedInterrelationModal.code}
                </div>
                <div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: selectedInterrelationModal.color }}
                  >
                    Interrelação P³ · {selectedInterrelationModal.tag}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {selectedInterrelationModal.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInterrelationModal(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                aria-label="Fechar detalhes"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {selectedInterrelationModal.plainExplanation}
            </p>

            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
                {selectedInterrelationModal.practicalExampleTitle}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {selectedInterrelationModal.practicalExample}
              </p>
            </div>

            <div
              className="p-4 rounded-xl border flex items-start gap-2.5 text-xs sm:text-sm"
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                borderColor: 'var(--border-color)',
              }}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-slate-700 dark:text-slate-200 font-medium">
                {selectedInterrelationModal.takeaway}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default P3HomeGuide;
