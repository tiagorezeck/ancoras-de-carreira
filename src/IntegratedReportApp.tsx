/**
 * @license
 * Assessment COMET - Relatório Integrado de Perfil Profissional
 * Escolhas e Direcionamento de Carreira
 * Integração Interpretativa dos Instrumentos: RIASEC, CABIN e Âncoras de Carreira
 */

import React, { useState, useMemo } from 'react';
import {
  IntegratedProfileAnalysis,
  IntegratedDemoProfile,
  INTEGRATED_DEMO_PROFILES,
  generateIntegratedAnalysis,
} from './integratedReportEngine';
import { TestAnswers as RiasecAnswers, PROFILES_DETAIL, RIASEC_COLORS } from './riasecData';
import { SETPOINT_DIMENSIONS, CABIN_SCALES } from './cabinData';
import { CAREER_ANCHORS, AnchorLetter } from './data';
import {
  Printer,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Compass,
  Briefcase,
  Layers,
  ArrowRight,
  HelpCircle,
  BarChart3,
  Building,
  Target,
  FileText,
  Calendar,
  Share2,
  Eye,
  Check,
  ChevronRight,
  ShieldCheck,
  Rocket,
  Info,
} from 'lucide-react';

interface IntegratedReportAppProps {
  theme?: 'light' | 'dark';
  onBackToMain?: () => void;
  ancorasRatings?: Record<number, number>;
  ancorasBonus?: number[];
  cabinAnswers?: Record<number, number>;
  riasecAnswers?: RiasecAnswers;
  onNavigateToModule?: (module: 'ancoras' | 'cabin' | 'riasec') => void;
}

type TabKey = 'overview' | 'maps' | 'cross_analysis' | 'exploration' | 'action_plan' | 'full_document';
type MapSubTab = 'riasec' | 'cabin' | 'ancoras';

export const IntegratedReportApp: React.FC<IntegratedReportAppProps> = ({
  theme = 'dark',
  onBackToMain,
  ancorasRatings = {},
  ancorasBonus = [],
  cabinAnswers = {},
  riasecAnswers = {},
  onNavigateToModule,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [activeMapSubTab, setActiveMapSubTab] = useState<MapSubTab>('riasec');
  const [activeDemoId, setActiveDemoId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check if user currently has real data in all 3
  const userHasAncoras = Object.keys(ancorasRatings).length >= 40 && ancorasBonus.length > 0;
  const userHasCabin = Object.keys(cabinAnswers).length >= 164;
  const userHasRiasec = Object.keys(riasecAnswers).length >= 12;
  const userIsFullyComplete = userHasAncoras && userHasCabin && userHasRiasec;

  // Active dataset: demo profile OR user state
  const activeData = useMemo(() => {
    if (activeDemoId) {
      const demo = INTEGRATED_DEMO_PROFILES.find((p) => p.id === activeDemoId) || INTEGRATED_DEMO_PROFILES[0];
      return {
        isDemo: true,
        demoProfile: demo,
        name: demo.name,
        role: demo.role,
        ancorasRatings: demo.ancorasRatings,
        ancorasBonus: demo.ancorasBonus,
        cabinAnswers: demo.cabinAnswers,
        riasecAnswers: demo.riasecAnswers,
      };
    }

    return {
      isDemo: false,
      demoProfile: null,
      name: 'Participante COMET',
      role: 'Avaliação Profissional',
      ancorasRatings,
      ancorasBonus,
      cabinAnswers,
      riasecAnswers,
    };
  }, [activeDemoId, ancorasRatings, ancorasBonus, cabinAnswers, riasecAnswers]);

  // Compute full integrated analysis
  const analysis: IntegratedProfileAnalysis = useMemo(() => {
    return generateIntegratedAnalysis(
      activeData.ancorasRatings,
      activeData.ancorasBonus,
      activeData.cabinAnswers,
      activeData.riasecAnswers,
      {
        name: activeData.name,
        role: activeData.role,
        evaluationDate: new Date().toLocaleDateString('pt-BR'),
      }
    );
  }, [activeData]);

  const cabinScaleEntries = useMemo(() => {
    return CABIN_SCALES.map((scale) => ({
      scale,
      score: analysis.cabinScores.scales[scale.id] || 3.0,
    })).sort((a, b) => b.score - a.score);
  }, [analysis.cabinScores.scales]);

  const topCabinScales = useMemo(() => cabinScaleEntries.slice(0, 5), [cabinScaleEntries]);
  const bottomCabinScales = useMemo(() => [...cabinScaleEntries].reverse().slice(0, 5), [cabinScaleEntries]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'text-slate-100' : 'text-slate-900'} no-print-bg`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl border border-slate-700/40 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP REPORT TOOLBAR (Navigation, Demo selector, Print) */}
      <div className="sticky top-16 z-30 backdrop-blur-md border-b transition-colors duration-200 no-print"
        style={{
          backgroundColor: isDark ? 'rgba(11, 15, 25, 0.92)' : 'rgba(255, 255, 255, 0.94)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Breadcrumb & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-teal-500 to-amber-500 text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                  Assessment COMET • Área Mentalidade
                </span>
                <span className="text-slate-400 dark:text-slate-600 text-xs">/</span>
                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                  Relatório Integrado
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight truncate">
                Perfil Profissional: Escolhas e Direcionamento de Carreira
              </h1>
            </div>
          </div>

          {/* Action buttons (Demo profiles switcher & Print) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Demo profile switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 px-1.5 hidden sm:inline">
                Fonte:
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveDemoId(null);
                  showToast('Exibindo dados reais do participante');
                }}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                  activeDemoId === null
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Dados Pessoais
              </button>

              {INTEGRATED_DEMO_PROFILES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setActiveDemoId(d.id);
                    showToast(`Carregado perfil demonstrativo: ${d.name}`);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer hidden md:inline-flex items-center gap-1 ${
                    activeDemoId === d.id
                      ? 'bg-teal-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>{d.name.split(' ')[0]} ({d.role.split(' ')[0]})</span>
                </button>
              ))}
            </div>

            {/* Print button */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold shadow-xs transition cursor-pointer"
              title="Imprimir ou Salvar em PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Executive Chapter Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-200/60 dark:border-slate-800/60">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold whitespace-nowrap shrink-0 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>📋 1. Visão Geral & Capa</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('maps')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold whitespace-nowrap shrink-0 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'maps'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>🧭 2. Três Mapas Fundamentais</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cross_analysis')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold whitespace-nowrap shrink-0 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cross_analysis'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>⚡ 3. Análise Cruzada COMET</span>
            <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-indigo-500/10 text-indigo-500">
              Essencial
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('exploration')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold whitespace-nowrap shrink-0 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'exploration'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>🎯 4. Campos & Direcionamento</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('action_plan')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold whitespace-nowrap shrink-0 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'action_plan'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>🚀 5. Plano de Ação & Conclusão</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('full_document')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold whitespace-nowrap shrink-0 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'full_document'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>📄 Dossiê Completo (Contínuo)</span>
          </button>
        </div>
      </div>

      {/* AUDIT READINESS BANNER (If real user has incomplete tests and is not viewing a demo) */}
      {!activeData.isDemo && !userIsFullyComplete && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 no-print">
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 dark:text-amber-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold">
                  Status de Prontidão da Tríade COMET ({analysis.completionStatus.completedCount} de 3 Concluídos)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Para gerar o relatório com 100% dos seus dados reais, complete os instrumentos pendentes. Ou clique ao lado para testar com um perfil demonstrativo completo.
                </p>

                {/* Progress Indicators */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    userHasAncoras
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  }`}>
                    {userHasAncoras ? '✓ Âncoras Concluído' : 'Pendente: Âncoras'}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    userHasCabin
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  }`}>
                    {userHasCabin ? '✓ CABIN Concluído' : 'Pendente: CABIN'}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    userHasRiasec
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  }`}>
                    {userHasRiasec ? '✓ RIASEC Concluído' : 'Pendente: RIASEC'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveDemoId(INTEGRATED_DEMO_PROFILES[0].id);
                  showToast('Carregado perfil demonstrativo completo para visualização');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition cursor-pointer"
              >
                Carregar Exemplo Completo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE DEMO NOTICE */}
      {activeData.isDemo && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 no-print">
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-between text-xs text-teal-800 dark:text-teal-200">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-teal-500 shrink-0" />
              <span>
                Visualizando perfil fictício: <strong>{activeData.name}</strong> ({activeData.role})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveDemoId(null)}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
            >
              Voltar aos meus dados
            </button>
          </div>
        </div>
      )}

      {/* MAIN REPORT BODY */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 print:p-0 print:max-w-none">
        {/* ========================================================================= */}
        {/* TAB 1: CAPA & VISÃO GERAL */}
        {/* ========================================================================= */}
        {(activeTab === 'overview' || activeTab === 'full_document') && (
          <section className="space-y-8 mb-12 animate-in fade-in duration-200">
            {/* CAPA OFICIAL COMET */}
            <div className="p-8 sm:p-12 rounded-3xl border shadow-sm relative overflow-hidden bg-gradient-to-br from-indigo-900/20 via-slate-900/10 to-teal-900/20 border-slate-200 dark:border-slate-800">
              <div className="max-w-3xl space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 uppercase tracking-widest">
                  <span>Assessment COMET</span>
                  <span>·</span>
                  <span>Área Mentalidade</span>
                  <span>·</span>
                  <span>Dossiê Executivo</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  Perfil Profissional Integrado
                </h1>
                <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
                  Escolhas, Interesses e Direcionamento de Carreira
                </p>

                {/* Participant Metadata Block */}
                <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block">Participante</span>
                    <strong className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {analysis.participant.name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block">Data de Emissão</span>
                    <strong className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {analysis.participant.evaluationDate}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block">Código Holland</span>
                    <strong className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                      {analysis.riasecResult.hollandCode}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block">Âncora Dominante</span>
                    <strong className="text-sm font-extrabold text-teal-600 dark:text-teal-400">
                      {CAREER_ANCHORS[analysis.ancorasDominant].name}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 1: APRESENTAÇÃO DO PERFIL */}
            <div className="p-6 sm:p-8 rounded-3xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-500">
                <span>Capítulo I</span>
                <span>·</span>
                <span>Apresentação & Fundamentos</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                A Tríade Psicométrica do Assessment COMET
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {analysis.executiveIntroduction}
              </p>

              {/* Princípio de Integração Pedagógica (Ciclo da Narrativa) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <h3 className="font-bold text-sm text-indigo-900 dark:text-indigo-300">
                      RIASEC — Descoberta
                    </h3>
                  </div>
                  <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Onde estão minhas afinidades profissionais?
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Identifica os grandes climas organizacionais e os ambientes vocacionais nos quais a pessoa se sente mais naturalmente atraída e produtiva.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-500/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                      2
                    </span>
                    <h3 className="font-bold text-sm text-teal-900 dark:text-teal-300">
                      CABIN — Exploração
                    </h3>
                  </div>
                  <div className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                    Quais tarefas e rotinas me atraem?
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Aprofunda em 41 áreas práticas e 8 dimensões dimensionais do modelo SETPOINT (Su et al.), medindo a atração por atividades reais do trabalho.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                      3
                    </span>
                    <h3 className="font-bold text-sm text-amber-900 dark:text-amber-300">
                      Âncoras — Direcionamento
                    </h3>
                  </div>
                  <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    O que preciso encontrar na carreira?
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Revela valores inegociáveis, motivações nucleares e condições de trabalho (autonomia, estabilidade, desafio, etc.) essenciais para satisfação.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: OS TRÊS MAPAS FUNDAMENTAIS */}
        {/* ========================================================================= */}
        {(activeTab === 'maps' || activeTab === 'full_document') && (
          <section className="space-y-8 mb-12 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                  Capítulo II
                </div>
                <h2 className="text-xl sm:text-2xl font-black">
                  Os Três Mapas Psicométricos Fundamentais
                </h2>
              </div>

              {activeTab === 'maps' && (
                <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveMapSubTab('riasec')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      activeMapSubTab === 'riasec'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    🎯 RIASEC
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMapSubTab('cabin')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      activeMapSubTab === 'cabin'
                        ? 'bg-teal-500 text-slate-950 font-black shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    🧭 CABIN
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMapSubTab('ancoras')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      activeMapSubTab === 'ancoras'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    ⚓ Âncoras
                  </button>
                </div>
              )}
            </div>

            {/* SUB-MAPA 1: RIASEC */}
            {(activeTab === 'full_document' || activeMapSubTab === 'riasec') && (
              <div className="p-6 sm:p-8 rounded-3xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                      🎯
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                        John Holland • Teoria Vocacional
                      </span>
                      <h3 className="text-lg font-bold">1. Mapa de Afinidades Profissionais (RIASEC)</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Código Predominante:</span>
                    <span className="text-base font-black px-3 py-1 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-mono border border-indigo-500/30">
                      {analysis.riasecResult.hollandCode}
                    </span>
                  </div>
                </div>

                {/* Bars for 6 RIASEC dimensions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                  <div className="space-y-3">
                    {analysis.riasecResult.sortedScores.map((score, idx) => (
                      <div key={score.type} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-black"
                              style={{ backgroundColor: RIASEC_COLORS[score.type].primary }}
                            >
                              {score.type}
                            </span>
                            <span>{score.label}</span>
                            {idx === 0 && (
                              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                (Primário)
                              </span>
                            )}
                          </span>
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                            {score.points} pts ({score.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.max(score.percentage, 4)}%`,
                              backgroundColor: RIASEC_COLORS[score.type].primary,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Qualitative interpretation */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-3">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">
                      Interpretação das Letras Dominantes: {analysis.riasecResult.hollandCode}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      Sua primeira letra ({analysis.riasecResult.primaryType}) indica atração predominante por{' '}
                      <strong>{PROFILES_DETAIL[analysis.riasecResult.primaryType].tagline.toLowerCase()}</strong>.
                      Combinada à segunda letra ({analysis.riasecResult.secondaryType}), revela afinidade com ambientes caracterizados por{' '}
                      {PROFILES_DETAIL[analysis.riasecResult.primaryType].idealEnvironments.slice(0, 3).join(', ')}.
                    </p>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500">
                      💡 <em>Nota psicométrica:</em> O RIASEC mapeia atração vocacional por climas organizacionais, não devendo ser confundido com capacidade técnica comprovada ou habilidade inata.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-MAPA 2: CABIN */}
            {(activeTab === 'full_document' || activeMapSubTab === 'cabin') && (
              <div className="p-6 sm:p-8 rounded-3xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-lg">
                      🧭
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        Su et al. (2019) • Journal of Applied Psychology
                      </span>
                      <h3 className="text-lg font-bold">2. Mapa de Interesses Específicos por Atividades (CABIN)</h3>
                    </div>
                  </div>

                  <span className="text-xs text-slate-500 font-mono">
                    164 atividades • 41 escalas • 8 SETPOINT
                  </span>
                </div>

                {/* SETPOINT 8 Dimensions Grid */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Distribuição nas 8 Dimensões Superiores (Modelo SETPOINT):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {SETPOINT_DIMENSIONS.map((dim) => {
                      const score = analysis.cabinScores.dimensions[dim.code] || 0;
                      return (
                        <div
                          key={dim.code}
                          className="p-3.5 rounded-2xl border bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-xs flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between font-bold mb-1">
                              <span className="truncate pr-1">{dim.namePt.split('(')[0]}</span>
                              <span className="font-mono text-teal-600 dark:text-teal-400">{score.toFixed(1)}/5</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                              {dim.description}
                            </p>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 mt-2.5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-teal-500"
                              style={{ width: `${(score / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top 5 High and Bottom 3 Low Interest Scales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs space-y-2">
                    <span className="font-extrabold text-teal-700 dark:text-teal-300 uppercase tracking-wider text-[11px] block">
                      ★ Interesses Mais Elevados (Exploração Prioritária):
                    </span>
                    <ul className="space-y-1.5">
                      {topCabinScales.map((s) => (
                        <li key={s.scale.id} className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {s.scale.namePt}
                          </span>
                          <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                            {s.score.toFixed(1)} / 5
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                    <span className="font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] block">
                      Interesses Menos Presentes (Baixa Atração Cotidiana):
                    </span>
                    <ul className="space-y-1.5">
                      {bottomCabinScales.map((s) => (
                        <li key={s.scale.id} className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                          <span>{s.scale.namePt}</span>
                          <span className="font-mono">{s.score.toFixed(1)} / 5</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-MAPA 3: ÂNCORAS DE CARREIRA */}
            {(activeTab === 'full_document' || activeMapSubTab === 'ancoras') && (
              <div className="p-6 sm:p-8 rounded-3xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                      ⚓
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                        Edgar Schein • Sloan School of Management (MIT)
                      </span>
                      <h3 className="text-lg font-bold">3. Mapa de Valores e Motivações Profissionais (Âncoras)</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Âncora Primária:</span>
                    <span className="text-xs font-black px-3 py-1 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      {CAREER_ANCHORS[analysis.ancorasDominant].name} ({analysis.ancorasScores[analysis.ancorasDominant].toFixed(1)}/10)
                    </span>
                  </div>
                </div>

                {/* Bars for 8 Anchors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as AnchorLetter[]).map((letter) => {
                    const anchor = CAREER_ANCHORS[letter];
                    const score = analysis.ancorasScores[letter] || 0;
                    const isDom = letter === analysis.ancorasDominant;
                    const isSec = letter === analysis.ancorasSecondary;

                    return (
                      <div
                        key={letter}
                        className={`p-3.5 rounded-2xl border text-xs transition ${
                          isDom
                            ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/20'
                            : isSec
                            ? 'bg-indigo-500/10 border-indigo-500/30'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span className="flex items-center gap-1.5">
                            <span className="font-mono text-indigo-500">{letter}.</span>
                            <span>{anchor.name}</span>
                            {isDom && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-amber-500 text-slate-950 uppercase">
                                Dominante
                              </span>
                            )}
                            {isSec && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-indigo-500 text-white uppercase">
                                Secundária
                              </span>
                            )}
                          </span>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {score.toFixed(1)}/10
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                          {anchor.summary}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ANÁLISE INTEGRADA CRUZADA (CONVERGÊNCIAS, COMPLEMENTARIDADES, TENSÕES) */}
        {/* ========================================================================= */}
        {(activeTab === 'cross_analysis' || activeTab === 'full_document') && (
          <section className="space-y-8 mb-12 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                Capítulo III • O Núcleo do Relatório
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                Análise Integrada dos Três Instrumentos
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
                Cruzamento interpretativo profundo entre afinidades (RIASEC), tarefas cotidianas (CABIN) e valores norteadores (Âncoras).
              </p>
            </div>

            {/* A. CONVERGÊNCIAS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                  A. Convergências
                </span>
                <span className="text-xs text-slate-500">
                  Onde os instrumentos apontam na mesma direção
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {analysis.convergences.map((conv) => (
                  <div
                    key={conv.id}
                    className="p-5 sm:p-6 rounded-2xl border bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-500/30 space-y-2 text-xs sm:text-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-extrabold text-emerald-900 dark:text-emerald-300">
                        {conv.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        {conv.instrumentsInvolved.map((inst, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            {inst}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                      {conv.explanation}
                    </p>

                    <div className="pt-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <span><strong>Implicação Prática:</strong> {conv.practicalImplication}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* B. COMPLEMENTARIDADES */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs">
                  B. Complementaridades
                </span>
                <span className="text-xs text-slate-500">
                  Traços diferentes que se equilibram e enriquecem o perfil
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {analysis.complementarities.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-5 sm:p-6 rounded-2xl border bg-indigo-50/30 dark:bg-indigo-950/10 border-indigo-500/30 space-y-2 text-xs sm:text-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-extrabold text-indigo-900 dark:text-indigo-300">
                        {comp.title}
                      </h3>
                      <span className="text-xs font-mono text-slate-500">
                        {comp.dimensionA} ⟷ {comp.dimensionB}
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                      {comp.explanation}
                    </p>

                    <div className="pt-2 text-xs text-indigo-800 dark:text-indigo-300 font-medium flex items-start gap-1.5">
                      <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
                      <span><strong>Estratégia de Harmonização:</strong> {comp.harmonizationStrategy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* C. DIVERGÊNCIAS E TENSÕES */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-extrabold text-xs">
                  C. Divergências e Tensões Estruturais
                </span>
                <span className="text-xs text-slate-500">
                  Não são contradições nem defeitos — são pontos essenciais para investigação
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {analysis.tensions.map((tens) => (
                  <div
                    key={tens.id}
                    className="p-5 sm:p-6 rounded-2xl border bg-amber-50/30 dark:bg-amber-950/10 border-amber-500/30 space-y-3 text-xs sm:text-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-extrabold text-amber-900 dark:text-amber-300">
                        {tens.title}
                      </h3>
                      <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
                        Fonte: {tens.tensionSource}
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                      {tens.description}
                    </p>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-amber-300/60 dark:border-amber-700/60 space-y-1.5">
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                        Perguntas para Investigação Pessoal:
                      </span>
                      <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1">
                        {tens.investigationQuestions.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-1 text-xs text-slate-600 dark:text-slate-300">
                      <strong>Caminho de Conciliação:</strong> {tens.reconciliationPath}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* D. SÍNTESE DA IDENTIDADE PROFISSIONAL */}
            <div className="p-6 sm:p-8 rounded-3xl border bg-slate-900 text-white dark:bg-slate-800/80 border-slate-700 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400">
                <span>D. Síntese da Identidade Profissional</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold">
                O Perfil Integrado em Seis Respostas Fundamentadas
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-slate-400 block font-semibold">1. O que mais desperta interesse?</span>
                  <p className="font-medium text-slate-200">{analysis.identitySynthesis.coreInterests}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-slate-400 block font-semibold">2. Que atividades merecem exploração?</span>
                  <p className="font-medium text-slate-200">{analysis.identitySynthesis.priorityActivities}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-slate-400 block font-semibold">3. Que ambientes favorecem sua satisfação?</span>
                  <p className="font-medium text-slate-200">{analysis.identitySynthesis.favorableEnvironments}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-slate-400 block font-semibold">4. Quais condições de trabalho são vitais?</span>
                  <p className="font-medium text-slate-200">{analysis.identitySynthesis.essentialWorkConditions}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-slate-400 block font-semibold">5. Que fatores geram insatisfação rápida?</span>
                  <p className="font-medium text-slate-200">{analysis.identitySynthesis.dissatisfactionTriggers}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-slate-400 block font-semibold">6. Critério decisivo antes de aceitar uma vaga?</span>
                  <p className="font-medium text-slate-200">{analysis.identitySynthesis.decisionCriteria}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CAMPOS & DIRECIONAMENTO DE CARREIRA */}
        {/* ========================================================================= */}
        {(activeTab === 'exploration' || activeTab === 'full_document') && (
          <section className="space-y-8 mb-12 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                Capítulos IV & V
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                Campos de Exploração & Direcionamento Profissional
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
                Hipóteses reais de exploração em 3 níveis e avaliação dos 6 caminhos de carreira.
              </p>
            </div>

            {/* SEÇÃO 6: OS 3 NÍVEIS DE AFINIDADE */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Afinidades e Campos de Exploração (3 Níveis de Aderência)
              </h3>

              <div className="space-y-4">
                {analysis.explorationFields.map((field) => (
                  <div
                    key={field.id}
                    className={`p-6 rounded-2xl border transition text-xs sm:text-sm space-y-3 ${
                      field.level === 1
                        ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-500/40 shadow-xs'
                        : field.level === 2
                        ? 'bg-indigo-50/20 dark:bg-indigo-950/10 border-indigo-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-90'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          field.level === 1
                            ? 'bg-emerald-500 text-slate-950'
                            : field.level === 2
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                        }`}>
                          Nível {field.level} — {field.level === 1 ? 'Alta Afinidade' : field.level === 2 ? 'A Explorar' : 'Pontos de Atenção'}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                          {field.fieldTitle}
                        </h4>
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong>Justificativa Psicométrica:</strong> {field.justification}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                        <strong className="text-slate-900 dark:text-slate-100 block mb-1">
                          Atividades Concretas para Experimentar:
                        </strong>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
                          {field.concreteActivities.map((act, i) => (
                            <li key={i}>{act}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                        <strong className="text-slate-900 dark:text-slate-100 block mb-1">
                          Ambientes de Trabalho Compatíveis:
                        </strong>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
                          {field.compatibleEnvironments.map((env, i) => (
                            <li key={i}>{env}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {field.conditionsToObserve && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                        <strong>Condições a Observar:</strong> {field.conditionsToObserve}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* SEÇÃO 7: AVALIAÇÃO DOS 6 CAMINHOS DE CARREIRA */}
            <div className="space-y-4 pt-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Avaliação de Caminhos Profissionais (Modalidades de Trabalho)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysis.careerPaths.map((path) => (
                  <div
                    key={path.pathType}
                    className={`p-5 rounded-2xl border text-xs flex flex-col justify-between ${
                      path.affinityLevel === 'ALTA'
                        ? 'bg-emerald-50/30 dark:bg-emerald-950/15 border-emerald-500/40'
                        : path.affinityLevel === 'MODERADA'
                        ? 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                        : 'bg-amber-50/20 dark:bg-amber-950/10 border-amber-500/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {path.title}
                        </h4>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          path.affinityLevel === 'ALTA'
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            : path.affinityLevel === 'MODERADA'
                            ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                            : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                        }`}>
                          {path.affinityLevel}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                        {path.analysis}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px]">
                      <div>
                        <strong className="text-emerald-600 dark:text-emerald-400">Condições Favoráveis:</strong>{' '}
                        <span className="text-slate-600 dark:text-slate-400">{path.favorableConditions.join(' · ')}</span>
                      </div>
                      <div>
                        <strong className="text-rose-500">Atenção / Riscos:</strong>{' '}
                        <span className="text-slate-600 dark:text-slate-400">{path.risksOrIncompatibilities.join(' · ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: PLANO DE AÇÃO & CONCLUSÃO EXECUTIVA */}
        {/* ========================================================================= */}
        {(activeTab === 'action_plan' || activeTab === 'full_document') && (
          <section className="space-y-8 mb-12 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                Capítulos VI & VII
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                Plano de Exploração, Reflexão e Conclusão Executiva
              </h2>
            </div>

            {/* SEÇÃO 8: PLANO DE AÇÃO EM 3 HORIZONTES */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Plano de Ação Estruturado (3 Horizontes Temporais)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysis.actionPlan.map((step) => (
                  <div
                    key={step.horizon}
                    className="p-5 rounded-2xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-xs space-y-3 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{step.periodLabel}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-2">
                        {step.focusArea}
                      </h4>
                      <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                        {step.actions.map((act, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-indigo-500 font-bold">›</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                      <strong className="text-slate-900 dark:text-slate-100">Entrega esperada:</strong>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">{step.expectedOutput}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SEÇÃO 9: PERGUNTAS DE REFLEXÃO PERSONALIZADAS */}
            <div className="p-6 sm:p-8 rounded-3xl border bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                <HelpCircle className="w-4 h-4" />
                <span>Perguntas de Reflexão para Mentoria ou Autoanálise</span>
              </div>
              <h3 className="text-lg font-bold">
                Provocações Estratégicas para Clareza Vocacional
              </h3>
              <div className="grid grid-cols-1 gap-2.5 text-xs sm:text-sm">
                {analysis.reflectionQuestions.map((q, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-black text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-slate-700 dark:text-slate-200 font-medium pt-0.5">{q}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SEÇÃO 10: CONCLUSÃO EXECUTIVA */}
            <div className="p-6 sm:p-8 rounded-3xl border bg-gradient-to-br from-indigo-900/15 via-teal-900/15 to-slate-900/15 border-indigo-500/30 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-500">
                <CheckCircle2 className="w-4 h-4" />
                <span>Conclusão Executiva COMET</span>
              </div>

              <h3 className="text-xl font-black">
                Síntese em 5 Respostas para Decisão de Carreira
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <strong className="text-indigo-600 dark:text-indigo-400 block mb-0.5">
                    1. Quais são as principais afinidades vocacionais?
                  </strong>
                  <p className="text-slate-700 dark:text-slate-200">{analysis.executiveConclusion.mainAffinities}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <strong className="text-teal-600 dark:text-teal-400 block mb-0.5">
                    2. Quais atividades merecem exploração prática?
                  </strong>
                  <p className="text-slate-700 dark:text-slate-200">{analysis.executiveConclusion.priorityActivitiesToInvestigate}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <strong className="text-amber-600 dark:text-amber-400 block mb-0.5">
                    3. Quais valores e condições precisam ser respeitados?
                  </strong>
                  <p className="text-slate-700 dark:text-slate-200">{analysis.executiveConclusion.nonNegotiableValues}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <strong className="text-emerald-600 dark:text-emerald-400 block mb-0.5">
                    4. Quais caminhos de carreira são mais promissores?
                  </strong>
                  <p className="text-slate-700 dark:text-slate-200">{analysis.executiveConclusion.promisingPaths}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <strong className="text-indigo-600 dark:text-indigo-400 block mb-0.5">
                    5. Qual deve ser o próximo passo imediato?
                  </strong>
                  <p className="text-slate-700 dark:text-slate-200">{analysis.executiveConclusion.immediateNextStep}</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default IntegratedReportApp;
