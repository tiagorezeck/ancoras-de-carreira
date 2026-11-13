/**
 * @license
 * Assessment COMET - Central Unificada de Relatórios
 * Escolhas e Direcionamento de Carreira
 * Reúne em uma página exclusiva:
 * 1. Relatório Integrado (Dossiê Estratégico)
 * 2. Âncoras de Carreira (Edgar Schein)
 * 3. CABIN Interesses Básicos (Su et al.)
 * 4. RIASEC Holland
 */

import React, { useState, useEffect } from 'react';
import IntegratedReportApp from './IntegratedReportApp';
import AncorasReportView from './AncorasReportView';
import CabinApp from './CabinApp';
import RiasecApp from './RiasecApp';
import {
  BookOpen,
  Anchor,
  Compass,
  Target,
  ArrowLeft,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
} from 'lucide-react';
import { TestAnswers as RiasecAnswers } from './riasecData';

export type ReportTab = 'integrated' | 'ancoras' | 'cabin' | 'riasec';

interface ReportsPageProps {
  theme: 'light' | 'dark';
  initialTab?: ReportTab;
  activeTab?: ReportTab;
  onBackToAssessments: () => void;
  onStartTest?: (test: 'ancoras' | 'cabin' | 'riasec') => void;
  ancorasRatings: Record<number, number>;
  ancorasBonus: number[];
  cabinAnswers?: Record<number, number>;
  riasecAnswers?: RiasecAnswers;
  onFillAllDemos?: () => void;
  onResetAllData?: () => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  theme,
  initialTab = 'integrated',
  activeTab: controlledActiveTab,
  onBackToAssessments,
  onStartTest,
  ancorasRatings,
  ancorasBonus,
  cabinAnswers: propCabinAnswers,
  riasecAnswers: propRiasecAnswers,
  onFillAllDemos,
  onResetAllData,
}) => {
  const [currentTab, setCurrentTab] = useState<ReportTab>(
    controlledActiveTab || initialTab
  );

  useEffect(() => {
    if (controlledActiveTab) {
      setCurrentTab(controlledActiveTab);
    }
  }, [controlledActiveTab]);

  // Recupera respostas de CABIN e RIASEC do storage se não fornecidas diretamente
  const cabinAnswers: Record<number, number> = propCabinAnswers || (() => {
    try {
      const saved = localStorage.getItem('comet_cabin_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  })();

  const riasecAnswers: RiasecAnswers = propRiasecAnswers || (() => {
    try {
      const saved = localStorage.getItem('comet_riasec_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.answers || {};
      }
    } catch {}
    return {};
  })();

  const activeTab = currentTab;
  const setActiveTab = (tab: ReportTab) => setCurrentTab(tab);

  // Status de conclusão de cada teste
  const ancorasDone = Object.keys(ancorasRatings).length >= 40 && ancorasBonus.length > 0;
  const cabinDone = Object.keys(cabinAnswers).length >= 164;
  const riasecDone = Object.keys(riasecAnswers).length >= 12;
  const completedCount = (ancorasDone ? 1 : 0) + (cabinDone ? 1 : 0) + (riasecDone ? 1 : 0);

  const tabs = [
    {
      id: 'integrated' as ReportTab,
      label: 'Relatório Integrado',
      shortLabel: 'Integrado',
      badge: 'Dossiê Estratégico',
      icon: <BookOpen className="w-4 h-4" />,
      isRecommended: true,
      ready: completedCount === 3,
    },
    {
      id: 'ancoras' as ReportTab,
      label: 'Âncoras de Carreira',
      shortLabel: 'Âncoras',
      badge: 'Valores e Motivações',
      icon: <Anchor className="w-4 h-4" />,
      ready: ancorasDone,
    },
    {
      id: 'cabin' as ReportTab,
      label: 'CABIN Interesses',
      shortLabel: 'CABIN',
      badge: 'Atividades e Rotinas',
      icon: <Compass className="w-4 h-4" />,
      ready: cabinDone,
    },
    {
      id: 'riasec' as ReportTab,
      label: 'RIASEC Holland',
      shortLabel: 'RIASEC',
      badge: 'Ambientes Vocacionais',
      icon: <Target className="w-4 h-4" />,
      ready: riasecDone,
    },
  ];

  return (
    <div className="min-h-screen pb-16">
      {/* BARRA SUPERIOR DE CONTROLE DA CENTRAL DE RELATÓRIOS */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3 px-4 sm:px-6 no-print">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Título & Voltar */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToAssessments}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar aos Questionários</span>
            </button>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <div>
              <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                Central de Relatórios
              </h1>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Assessment COMET • Escolhas e Direcionamento de Carreira
              </span>
            </div>
          </div>

          {/* Abas dos Relatórios */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 overflow-x-auto text-xs">
            {tabs.map((tab) => {
              const isCur = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isCur
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.isRecommended && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase tracking-wider font-black ${
                        isCur ? 'bg-white/20 text-white' : 'bg-indigo-500/10 text-indigo-500'
                      }`}
                    >
                      Dossiê
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL DO RELATÓRIO SELECIONADO */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* 1. RELATÓRIO INTEGRADO */}
        {activeTab === 'integrated' && (
          <IntegratedReportApp
            theme={theme}
            onBackToMain={onBackToAssessments}
            ancorasRatings={ancorasRatings}
            ancorasBonus={ancorasBonus}
            cabinAnswers={cabinAnswers}
            riasecAnswers={riasecAnswers}
            onNavigateToModule={(mod) => {
              if (mod === 'ancoras') setActiveTab('ancoras');
              else if (mod === 'cabin') setActiveTab('cabin');
              else if (mod === 'riasec') setActiveTab('riasec');
            }}
          />
        )}

        {/* 2. ÂNCORAS DE CARREIRA (INDIVIDUAL) */}
        {activeTab === 'ancoras' && (
          <div className="space-y-6">
            {!ancorasDone && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-xs no-print">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Você ainda não concluiu o teste Âncoras de Carreira.
                    </span>
                    <p className="text-slate-500 dark:text-slate-400">
                      Os dados exibidos abaixo são valores padrão ou parciais.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => (onStartTest ? onStartTest('ancoras') : onBackToAssessments())}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shrink-0 transition cursor-pointer"
                >
                  Responder Âncoras
                </button>
              </div>
            )}

            <AncorasReportView
              ratings={ancorasRatings}
              bonus={ancorasBonus}
              theme={theme}
              onStartNew={() => (onStartTest ? onStartTest('ancoras') : onBackToAssessments())}
              onGoToIntegrated={() => setActiveTab('integrated')}
            />
          </div>
        )}

        {/* 3. CABIN INTERESSES BÁSICOS (INDIVIDUAL) */}
        {activeTab === 'cabin' && (
          <div className="space-y-6">
            {!cabinDone && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-xs no-print">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Você ainda não concluiu o teste CABIN (164 atividades).
                    </span>
                    <p className="text-slate-500 dark:text-slate-400">
                      Você pode responder ao questionário para gerar seu resultado real.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => (onStartTest ? onStartTest('cabin') : onBackToAssessments())}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shrink-0 transition cursor-pointer"
                >
                  Responder CABIN
                </button>
              </div>
            )}

            <CabinApp
              onBackToMain={onBackToAssessments}
              initialStep="report"
            />
          </div>
        )}

        {/* 4. RIASEC HOLLAND (INDIVIDUAL) */}
        {activeTab === 'riasec' && (
          <div className="space-y-6">
            {!riasecDone && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-xs no-print">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Você ainda não concluiu o teste RIASEC (12 blocos).
                    </span>
                    <p className="text-slate-500 dark:text-slate-400">
                      Responda o teste para identificar suas 3 letras dominantes de Holland.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => (onStartTest ? onStartTest('riasec') : onBackToAssessments())}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shrink-0 transition cursor-pointer"
                >
                  Responder RIASEC
                </button>
              </div>
            )}

            <RiasecApp
              theme={theme}
              onBackToMain={onBackToAssessments}
              initialScreen="result"
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportsPage;
