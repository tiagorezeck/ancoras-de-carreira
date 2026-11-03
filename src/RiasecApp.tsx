/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  RiasecType,
  RiasecResult,
  TestAnswers,
  BlockAnswer,
  RIASEC_TYPE_LABELS,
  RIASEC_COLORS,
  DEFAULT_BLOCKS,
  PROFILES_DETAIL,
  DEMO_RIASEC_PROFILES,
  RIASEC_BENCHMARK_PERCENTAGES,
  calculateRiasecResult,
  STORAGE_KEY_RIASEC,
  getTypeShortDesc,
} from './riasecData';
import {
  Compass,
  Sparkles,
  Award,
  CheckCircle2,
  RotateCcw,
  Printer,
  Share2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Briefcase,
  GraduationCap,
  BookOpen,
  BarChart3,
  ListChecks,
  Eye,
  Info,
  Wrench,
  Microscope,
  Palette,
  HeartHandshake,
  TrendingUp,
  ClipboardCheck,
  Check,
  Copy,
  Layers,
  HelpCircle,
  AlertCircle,
  Building,
} from 'lucide-react';

interface RiasecAppProps {
  theme?: 'light' | 'dark';
  onBackToMain?: () => void;
  initialScreen?: 'home' | 'quiz' | 'result';
  integratedInfo?: {
    currentStepNumber: number;
    totalSteps: number;
    nextModuleName?: string;
    onProceedNext?: () => void;
  };
}

type RiasecScreen = 'home' | 'quiz' | 'result';
type ResultTab = 'overview' | 'dimensions' | 'careers' | 'audit';

interface SavedRiasecState {
  answers: TestAnswers;
  currentBlock: number;
}

export default function RiasecApp({
  theme = 'dark',
  onBackToMain,
  initialScreen,
  integratedInfo,
}: RiasecAppProps) {
  const [screen, setScreen] = useState<RiasecScreen>(initialScreen || 'home');
  const [currentBlock, setCurrentBlock] = useState<number>(1);
  const [answers, setAnswers] = useState<TestAnswers>({});
  const [resultTab, setResultTab] = useState<ResultTab>('overview');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [activeDemoId, setActiveDemoId] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedDimensionModal, setSelectedDimensionModal] = useState<RiasecType | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState<boolean>(false);

  // Sync initialScreen if changed by parent
  useEffect(() => {
    if (initialScreen) {
      setScreen(initialScreen);
    }
  }, [initialScreen]);

  // Restore saved state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RIASEC);
      if (saved) {
        const parsed: SavedRiasecState = JSON.parse(saved);
        if (parsed.answers && Object.keys(parsed.answers).length > 0) {
          setAnswers(parsed.answers);
          if (parsed.currentBlock) {
            setCurrentBlock(Math.min(Math.max(parsed.currentBlock, 1), 12));
          }
        }
      }
    } catch (e) {
      console.warn('Erro ao restaurar progresso RIASEC:', e);
    }
  }, []);

  // Save progress unless in demo mode
  const persistProgress = (newAnswers: TestAnswers, blockNum: number) => {
    if (isDemoMode) return;
    try {
      const stateToSave: SavedRiasecState = {
        answers: newAnswers,
        currentBlock: blockNum,
      };
      localStorage.setItem(STORAGE_KEY_RIASEC, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Erro ao salvar progresso RIASEC:', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Completed count (12 total blocks)
  const completedBlocksCount = useMemo(() => {
    let count = 0;
    for (let i = 1; i <= 12; i++) {
      const b = answers[i];
      if (b && b.first && b.second && b.third) {
        count++;
      }
    }
    return count;
  }, [answers]);

  const isTestComplete = completedBlocksCount === 12;

  // Active result calculation
  const computedResult: RiasecResult | null = useMemo(() => {
    if (completedBlocksCount < 12 && !isDemoMode) return null;
    return calculateRiasecResult(answers);
  }, [answers, completedBlocksCount, isDemoMode]);

  // Handlers for starting, resuming, or loading demo
  const handleStartTest = () => {
    setIsDemoMode(false);
    setActiveDemoId('');
    if (completedBlocksCount === 12) {
      setCurrentBlock(1);
    }
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResumeTest = () => {
    setIsDemoMode(false);
    setActiveDemoId('');
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadDemo = (demoId: string) => {
    const demo = DEMO_RIASEC_PROFILES.find((p) => p.id === demoId) || DEMO_RIASEC_PROFILES[0];
    setIsDemoMode(true);
    setActiveDemoId(demo.id);
    setAnswers(demo.answers);
    setCurrentBlock(1);
    setScreen('result');
    setResultTab('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Carregado perfil demonstrativo: ${demo.name}`);
  };

  const handleClearTest = () => {
    localStorage.removeItem(STORAGE_KEY_RIASEC);
    setAnswers({});
    setCurrentBlock(1);
    setIsDemoMode(false);
    setActiveDemoId('');
    setConfirmResetOpen(false);
    setScreen('home');
    showToast('Avaliação RIASEC reiniciada.');
  };

  // Ranking action in current block
  const handleSelectRank = (questionId: string, rank: 'first' | 'second' | 'third') => {
    const curBlockAnswer: BlockAnswer = { ...(answers[currentBlock] || {}) };

    // If already set to this rank, remove it
    if (curBlockAnswer[rank] === questionId) {
      delete curBlockAnswer[rank];
    } else {
      // If question was already in another rank, remove from that rank
      if (curBlockAnswer.first === questionId) delete curBlockAnswer.first;
      if (curBlockAnswer.second === questionId) delete curBlockAnswer.second;
      if (curBlockAnswer.third === questionId) delete curBlockAnswer.third;

      // Assign to this rank
      curBlockAnswer[rank] = questionId;
    }

    const updated = {
      ...answers,
      [currentBlock]: curBlockAnswer,
    };
    setAnswers(updated);
    persistProgress(updated, currentBlock);
  };

  const handleNextBlock = () => {
    const cur = answers[currentBlock];
    if (!cur?.first || !cur?.second || !cur?.third) {
      showToast('Por favor, defina suas 3 escolhas (1º, 2º e 3º lugar) antes de avançar.');
      return;
    }

    if (currentBlock < 12) {
      const nextB = currentBlock + 1;
      setCurrentBlock(nextB);
      persistProgress(answers, nextB);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Completed all 12 blocks
      persistProgress(answers, 12);
      setScreen('result');
      setResultTab('overview');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Avaliação RIASEC concluída com sucesso!');
    }
  };

  const handlePrevBlock = () => {
    if (currentBlock > 1) {
      const prevB = currentBlock - 1;
      setCurrentBlock(prevB);
      persistProgress(answers, prevB);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/95 text-white shadow-2xl border border-slate-700 backdrop-blur-md text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Reset Modal */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className={`w-full max-w-md p-6 rounded-2xl shadow-2xl border ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Reiniciar Teste RIASEC?</h3>
            <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Todas as 12 respostas e escolhas salvas neste módulo serão apagadas. Os outros testes (Âncoras e CABIN) não serão afetados.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition ${
                  theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleClearTest}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition shadow-sm cursor-pointer"
              >
                Sim, reiniciar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dimension Detail Modal */}
      {selectedDimensionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div
            className={`w-full max-w-2xl max-h-[88vh] overflow-y-auto p-6 md:p-8 rounded-2xl shadow-2xl border ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {(() => {
              const detail = PROFILES_DETAIL[selectedDimensionModal];
              const colorObj = RIASEC_COLORS[selectedDimensionModal];
              return (
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md"
                        style={{ backgroundColor: colorObj.primary }}
                      >
                        {selectedDimensionModal}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          {detail.name}
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold border" style={{ borderColor: colorObj.border, color: colorObj.primary }}>
                            {detail.tagline}
                          </span>
                        </h3>
                        <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          {detail.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedDimensionModal(null)}
                      className={`p-2 rounded-lg text-slate-400 hover:text-white transition cursor-pointer ${
                        theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-6 space-y-6 text-sm">
                    {/* Personality Traits */}
                    <div>
                      <h4 className="font-semibold text-xs tracking-wider uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Traços Marcantes
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {detail.personalityTraits.map((trait, idx) => (
                          <span
                            key={idx}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                              theme === 'dark' ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Work Preferences & Ideal Environments */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-400 mb-2">Preferências de Trabalho</h4>
                        <ul className="space-y-1.5 text-xs">
                          {detail.workPreferences.map((wp, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-blue-400 shrink-0 mt-0.5">•</span>
                              <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{wp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-400 mb-2">Ambientes Favoráveis</h4>
                        <ul className="space-y-1.5 text-xs">
                          {detail.idealEnvironments.map((env, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 shrink-0 mt-0.5">•</span>
                              <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{env}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Recommended Careers */}
                    <div>
                      <h4 className="font-semibold text-xs tracking-wider uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-blue-400" /> Carreiras Típicas
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {detail.recommendedCareers.map((cat, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border text-xs ${
                              theme === 'dark' ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-100/70 border-slate-200'
                            }`}
                          >
                            <span className="font-semibold text-indigo-400 block mb-1">{cat.category}</span>
                            <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>
                              {cat.jobs.join(', ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Courses */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-xs tracking-wider uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-purple-400" /> Cursos Superiores
                        </h4>
                        <ul className="space-y-1 text-xs">
                          {detail.higherEducationCourses.map((c, idx) => (
                            <li key={idx} className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs tracking-wider uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-teal-400" /> Cursos Técnicos
                        </h4>
                        <ul className="space-y-1 text-xs">
                          {detail.technicalCourses.map((c, idx) => (
                            <li key={idx} className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Demo Banner Notification if Active */}
      {isDemoMode && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-amber-200 text-sm">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-semibold text-amber-300">Modo Demonstrativo Ativo:</span>{' '}
              <span>Você está visualizando um perfil fictício para análise técnica imediata do RIASEC.</span>
            </div>
          </div>
          <button
            onClick={() => {
              setIsDemoMode(false);
              setActiveDemoId('');
              setScreen('home');
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition cursor-pointer"
          >
            Sair da Demonstração
          </button>
        </div>
      )}

      {/* SCREEN 1: HOME / INTRO VIEW */}
      {screen === 'home' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Hero Banner */}
          <div
            className={`p-6 sm:p-10 rounded-3xl border transition ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 border-slate-800'
                : 'bg-gradient-to-br from-indigo-50/60 via-white to-slate-50 border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" /> Módulo 3 — Ambientes e Tipologias Vocacionais
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/60 text-slate-300 border border-slate-700/60">
                12 Blocos • 72 Itens • Código Holland
              </span>
              {completedBlocksCount > 0 && !isTestComplete && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Em andamento ({completedBlocksCount}/12 blocos)
                </span>
              )}
              {isTestComplete && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Concluído
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Teste RIASEC <span className="text-indigo-400 font-light">— Teoria de John Holland</span>
            </h1>
            <p className={`mt-3 max-w-3xl text-sm sm:text-base leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              O modelo RIASEC é o instrumento psicométrico de orientação vocacional mais consagrado do mundo. Ele categoriza a afinidade humana e profissional em seis dimensões fundamentais, identificando seu <strong>Código Holland de 3 letras</strong> para orientar decisões de carreira, desenvolvimento de competências e satisfação no trabalho.
            </p>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {completedBlocksCount === 0 ? (
                <button
                  onClick={handleStartTest}
                  className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4" /> Iniciar Teste RIASEC
                </button>
              ) : isTestComplete ? (
                <button
                  onClick={() => {
                    setScreen('result');
                    setResultTab('overview');
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Award className="w-4 h-4" /> Ver Meu Relatório RIASEC
                </button>
              ) : (
                <button
                  onClick={handleResumeTest}
                  className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <ArrowRight className="w-4 h-4" /> Continuar Avaliação (Bloco {currentBlock})
                </button>
              )}

              {completedBlocksCount > 0 && (
                <button
                  onClick={() => setConfirmResetOpen(true)}
                  className={`px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reiniciar Teste
                </button>
              )}
            </div>

            {/* Demo Profiles Dropdown / Selector */}
            <div className={`mt-8 pt-6 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 block mb-1">
                    Visualização Imediata (Sem preenchimento)
                  </span>
                  <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Carregue um perfil fictício completo com gráficos e relatório instantâneo:
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {DEMO_RIASEC_PROFILES.map((demo) => (
                    <button
                      key={demo.id}
                      onClick={() => handleLoadDemo(demo.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-slate-800/80 hover:bg-indigo-950/60 hover:border-indigo-500/50 border-slate-700 text-slate-200'
                          : 'bg-white hover:bg-indigo-50 hover:border-indigo-300 border-slate-200 text-slate-700 shadow-xs'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{demo.name.split(' ')[0]} ({demo.role.match(/\((.*?)\)/)?.[1] || 'Demo'})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Explanation of the 6 Dimensions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">As 6 Dimensões do Modelo Hexagonal (Holland)</h2>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Clique em qualquer dimensão para explorar traços, preferências e carreiras associadas.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(['R', 'I', 'A', 'S', 'E', 'C'] as RiasecType[]).map((type) => {
                const detail = PROFILES_DETAIL[type];
                const color = RIASEC_COLORS[type];
                return (
                  <div
                    key={type}
                    onClick={() => setSelectedDimensionModal(type)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] ${
                      theme === 'dark'
                        ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                        style={{ backgroundColor: color.primary }}
                      >
                        {type}
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold border" style={{ borderColor: color.border, color: color.primary }}>
                        {detail.tagline}
                      </span>
                    </div>
                    <h3 className="mt-3 text-base font-bold">{detail.name}</h3>
                    <p className={`mt-1 text-xs line-clamp-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      {getTypeShortDesc(type)}
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-800/40 flex items-center justify-between text-[11px] font-semibold text-indigo-400">
                      <span>Ver detalhes e cursos</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test Instructions Card */}
          <div
            className={`p-6 rounded-2xl border ${
              theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" /> Como funciona a aplicação do RIASEC
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
              <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold inline-flex items-center justify-center mb-2">1</span>
                <p className="font-semibold text-slate-200">12 Blocos de Decisão</p>
                <p className={`mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Cada bloco apresenta 6 afirmativas profissionais representativas de cada uma das 6 dimensões.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold inline-flex items-center justify-center mb-2">2</span>
                <p className="font-semibold text-slate-200">Ranqueamento 3-2-1</p>
                <p className={`mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Em cada bloco, escolha o 1º lugar (3 pontos), 2º lugar (2 pontos) e 3º lugar (1 ponto) com o qual mais se identifica.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold inline-flex items-center justify-center mb-2">3</span>
                <p className="font-semibold text-slate-200">Código Holland Gerado</p>
                <p className={`mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  O algoritmo apura as 3 letras dominantes, traçando sua matriz vocacional e recomendações educacionais.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 2: QUIZ / TEST VIEW */}
      {screen === 'quiz' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
          {/* Banner de Jornada Integrada se ativo */}
          {integratedInfo && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-indigo-500/15 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-black text-[11px] uppercase tracking-wider">
                  Jornada Integrada
                </span>
                <div>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    Etapa {integratedInfo.currentStepNumber} de {integratedInfo.totalSteps}: RIASEC Holland
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block sm:inline sm:ml-2">
                    (Ambientes e Tipos Vocacionais)
                  </span>
                </div>
              </div>
              {integratedInfo.nextModuleName ? (
                <span className="text-xs font-semibold text-indigo-400">
                  Próxima Etapa: {integratedInfo.nextModuleName} →
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-400">
                  Etapa Final da Jornada
                </span>
              )}
            </div>
          )}

          {/* Progress Header */}
          <div
            className={`p-5 rounded-2xl border ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Compass className="w-4 h-4" /> Bloco {currentBlock} de 12
              </span>
              <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                {completedBlocksCount} de 12 blocos respondidos ({Math.round((completedBlocksCount / 12) * 100)}%)
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${(completedBlocksCount / 12) * 100}%` }}
              />
            </div>

            {/* Block Jump Pills */}
            <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
              {DEFAULT_BLOCKS.map((b) => {
                const bAns = answers[b.blockNumber];
                const isDone = bAns?.first && bAns?.second && bAns?.third;
                const isCurrent = b.blockNumber === currentBlock;
                return (
                  <button
                    key={b.blockNumber}
                    onClick={() => {
                      setCurrentBlock(b.blockNumber);
                      persistProgress(answers, b.blockNumber);
                    }}
                    className={`w-7 h-7 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400/50 scale-105'
                        : isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : theme === 'dark'
                        ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {b.blockNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Block Content */}
          {(() => {
            const blockData = DEFAULT_BLOCKS[currentBlock - 1];
            const blockAnswer: BlockAnswer = answers[currentBlock] || {};
            const isBlockComplete = Boolean(blockAnswer.first && blockAnswer.second && blockAnswer.third);

            return (
              <div
                className={`p-6 sm:p-8 rounded-3xl border transition ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
                }`}
              >
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">
                    Etapa {currentBlock} de 12
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold mt-1">
                    {blockData.title}
                  </h2>
                  <p className={`mt-2 text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Analise as 6 afirmações abaixo e selecione na ordem de preferência:{' '}
                    <strong className="text-amber-400"> 1º Lugar (3 pts)</strong>,{' '}
                    <strong className="text-slate-300"> 2º Lugar (2 pts)</strong> e{' '}
                    <strong className="text-amber-600"> 3º Lugar (1 pt)</strong>.
                  </p>
                </div>

                {/* 6 Questions in Block */}
                <div className="space-y-3">
                  {blockData.questions.map((q) => {
                    const isFirst = blockAnswer.first === q.id;
                    const isSecond = blockAnswer.second === q.id;
                    const isThird = blockAnswer.third === q.id;
                    const color = RIASEC_COLORS[q.letter];

                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isFirst
                            ? 'bg-indigo-500/10 border-indigo-500/50 shadow-sm'
                            : isSecond
                            ? 'bg-blue-500/10 border-blue-500/40 shadow-sm'
                            : isThird
                            ? 'bg-emerald-500/10 border-emerald-500/40 shadow-sm'
                            : theme === 'dark'
                            ? 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <span
                              className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs text-white shadow-xs mt-0.5"
                              style={{ backgroundColor: color.primary }}
                            >
                              {q.letter}
                            </span>
                            <div>
                              <p className="text-sm font-medium leading-snug">{q.title}</p>
                              <span className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                {RIASEC_TYPE_LABELS[q.letter]}
                              </span>
                            </div>
                          </div>

                          {/* 1st, 2nd, 3rd Selection Buttons */}
                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                            <button
                              onClick={() => handleSelectRank(q.id, 'first')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                                isFirst
                                  ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50 font-bold'
                                  : theme === 'dark'
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {isFirst && <Check className="w-3.5 h-3.5" />}
                              1º (3 pts)
                            </button>

                            <button
                              onClick={() => handleSelectRank(q.id, 'second')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                                isSecond
                                  ? 'bg-slate-300 text-slate-900 shadow-md ring-2 ring-slate-400/50 font-bold'
                                  : theme === 'dark'
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {isSecond && <Check className="w-3.5 h-3.5" />}
                              2º (2 pts)
                            </button>

                            <button
                              onClick={() => handleSelectRank(q.id, 'third')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                                isThird
                                  ? 'bg-amber-700 text-white shadow-md ring-2 ring-amber-600/50 font-bold'
                                  : theme === 'dark'
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {isThird && <Check className="w-3.5 h-3.5" />}
                              3º (1 pt)
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Validation Status Bar */}
                <div className="mt-6 pt-5 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs">
                    {isBlockComplete ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> As 3 posições foram atribuídas corretamente.
                      </span>
                    ) : (
                      <span className="text-amber-400 font-medium flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" /> Atribua 1º, 2º e 3º lugar para avançar.
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePrevBlock}
                      disabled={currentBlock === 1}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                        currentBlock === 1
                          ? 'opacity-40 cursor-not-allowed text-slate-500'
                          : theme === 'dark'
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" /> Anterior
                    </button>

                    <button
                      onClick={handleNextBlock}
                      disabled={!isBlockComplete}
                      className={`px-6 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md cursor-pointer ${
                        !isBlockComplete
                          ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-500'
                          : currentBlock === 12
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 font-bold'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                      }`}
                    >
                      {currentBlock === 12 ? (
                        <>
                          Finalizar e Ver Relatório <Sparkles className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Próximo Bloco <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* SCREEN 3: EXECUTIVE REPORT (RESULT VIEW) */}
      {screen === 'result' && computedResult && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Banner de Conclusão / Avanço na Jornada Integrada se ativo */}
          {integratedInfo && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-indigo-500/15 to-emerald-500/15 border-2 border-emerald-500/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wide">
                    {integratedInfo.nextModuleName
                      ? `Etapa ${integratedInfo.currentStepNumber} de ${integratedInfo.totalSteps} Concluída!`
                      : `🎉 Jornada Integrada Concluída!`}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Relatório RIASEC Salvo com Sucesso
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium">
                  {integratedInfo.nextModuleName ? (
                    <>
                      Você concluiu o teste RIASEC. Avance agora para a próxima etapa da sua jornada: <strong>{integratedInfo.nextModuleName}</strong>.
                    </>
                  ) : (
                    <>
                      Parabéns! Todos os testes da sua Jornada Integrada no Assessment COMET foram finalizados com êxito. Todos os relatórios individuais permanecem disponíveis para consulta a qualquer momento.
                    </>
                  )}
                </p>
              </div>
              {integratedInfo.onProceedNext && (
                <button
                  onClick={integratedInfo.onProceedNext}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0 hover:scale-105 active:scale-95"
                >
                  <span>
                    {integratedInfo.nextModuleName ? `Avançar para ${integratedInfo.nextModuleName}` : 'Concluir Jornada e Ver Hub'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Top Result Banner */}
          <div
            className={`p-6 sm:p-10 rounded-3xl border transition ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border-slate-800'
                : 'bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Relatório Executivo Oficial • Assessment COMET
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(computedResult.completedAt).toLocaleDateString('pt-BR')}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
                  }`}
                >
                  <Printer className="w-3.5 h-3.5" /> Imprimir / PDF
                </button>

                <button
                  onClick={() => {
                    const text = `Meu Código Holland no Teste RIASEC (Assessment COMET): ${computedResult.hollandCode} (${PROFILES_DETAIL[computedResult.primaryType].name} / ${PROFILES_DETAIL[computedResult.secondaryType].name} / ${PROFILES_DETAIL[computedResult.tertiaryType].name})`;
                    if (navigator.share) {
                      navigator.share({ title: 'Resultado RIASEC', text }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(text);
                      showToast('Resultado copiado para a área de transferência!');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-xs'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" /> Compartilhar
                </button>

                <button
                  onClick={() => setConfirmResetOpen(true)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition text-rose-400 hover:text-rose-300 cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-slate-800 hover:bg-slate-700 border-slate-700'
                      : 'bg-white hover:bg-slate-100 border-slate-200 shadow-xs'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Refazer
                </button>
              </div>
            </div>

            {/* Holland Code Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400">
                  Seu Código Vocacional de Holland
                </span>
                <div className="mt-2 flex items-baseline gap-3">
                  <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-md">
                    {computedResult.hollandCode}
                  </h1>
                  <span className="text-sm sm:text-base font-semibold text-slate-400">
                    Tríade de Orientação Ocupacional
                  </span>
                </div>

                <p className={`mt-4 text-sm sm:text-base leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  Seu perfil vocacional combina predominantemente o foco{' '}
                  <strong className="text-white">{PROFILES_DETAIL[computedResult.primaryType].name}</strong> (
                  {computedResult.scores[computedResult.primaryType].points} pts), seguido por{' '}
                  <strong className="text-white">{PROFILES_DETAIL[computedResult.secondaryType].name}</strong> (
                  {computedResult.scores[computedResult.secondaryType].points} pts) e{' '}
                  <strong className="text-white">{PROFILES_DETAIL[computedResult.tertiaryType].name}</strong> (
                  {computedResult.scores[computedResult.tertiaryType].points} pts).
                </p>

                {/* Badges of 3 Types */}
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <span
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5"
                    style={{ backgroundColor: RIASEC_COLORS[computedResult.primaryType].primary }}
                  >
                    1º {computedResult.primaryType} — {PROFILES_DETAIL[computedResult.primaryType].name} ({computedResult.scores[computedResult.primaryType].percentage}%)
                  </span>
                  <span
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5"
                    style={{ backgroundColor: RIASEC_COLORS[computedResult.secondaryType].primary }}
                  >
                    2º {computedResult.secondaryType} — {PROFILES_DETAIL[computedResult.secondaryType].name} ({computedResult.scores[computedResult.secondaryType].percentage}%)
                  </span>
                  <span
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5"
                    style={{ backgroundColor: RIASEC_COLORS[computedResult.tertiaryType].primary }}
                  >
                    3º {computedResult.tertiaryType} — {PROFILES_DETAIL[computedResult.tertiaryType].name} ({computedResult.scores[computedResult.tertiaryType].percentage}%)
                  </span>
                </div>
              </div>

              {/* Quick Summary Pill Card */}
              <div className="lg:col-span-5">
                <div
                  className={`p-5 rounded-2xl border ${
                    theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
                  }`}
                >
                  <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3">
                    Distribuição dos 72 Pontos
                  </h3>
                  <div className="space-y-2">
                    {computedResult.sortedScores.map((sc, rankIdx) => (
                      <div key={sc.type} className="flex items-center gap-2.5 text-xs">
                        <span className="w-5 font-bold text-slate-500">{rankIdx + 1}º</span>
                        <span
                          className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] text-white shrink-0"
                          style={{ backgroundColor: sc.color }}
                        >
                          {sc.type}
                        </span>
                        <span className="w-28 font-medium truncate">{sc.label}</span>
                        <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${(sc.points / 36) * 100}%`, backgroundColor: sc.color }}
                          />
                        </div>
                        <span className="w-12 text-right font-semibold text-slate-300">
                          {sc.points} pts ({sc.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className={`mt-8 pt-4 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'} flex flex-wrap gap-2`}>
              <button
                onClick={() => setResultTab('overview')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  resultTab === 'overview'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : theme === 'dark'
                    ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" /> Visão Geral & Radar
              </button>

              <button
                onClick={() => setResultTab('dimensions')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  resultTab === 'dimensions'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : theme === 'dark'
                    ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Detalhamento das 6 Dimensões
              </button>

              <button
                onClick={() => setResultTab('careers')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  resultTab === 'careers'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : theme === 'dark'
                    ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" /> Carreiras & Cursos
              </button>

              <button
                onClick={() => setResultTab('audit')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  resultTab === 'audit'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : theme === 'dark'
                    ? 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <ListChecks className="w-3.5 h-3.5" /> Auditoria de Respostas
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & RADAR */}
          {resultTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Radar Hexagon SVG Chart */}
                <div
                  className={`lg:col-span-7 p-6 rounded-3xl border ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-base">Radar Hexagonal de Afinidade</h3>
                      <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        Compara suas pontuações percentuais com o benchmark de mercado (linha tracejada).
                      </p>
                    </div>
                  </div>

                  {/* SVG Radar Chart Implementation */}
                  <div className="relative flex justify-center py-4">
                    {(() => {
                      const size = 380;
                      const center = size / 2;
                      const maxR = size * 0.35;
                      const axisKeys: RiasecType[] = ['R', 'I', 'A', 'S', 'E', 'C'];
                      const angleStep = (Math.PI * 2) / axisKeys.length;
                      const startAngle = -Math.PI / 2;

                      // Concentric rings
                      const rings = [0.25, 0.5, 0.75, 1.0];

                      // Polygon points for User
                      const userPoints = axisKeys.map((key, i) => {
                        const val = computedResult.scores[key]?.percentage || 0;
                        const r = maxR * Math.min(Math.max(val / 35, 0.05), 1);
                        const angle = startAngle + i * angleStep;
                        return {
                          x: center + r * Math.cos(angle),
                          y: center + r * Math.sin(angle),
                        };
                      });
                      const userPath = userPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

                      // Polygon points for Benchmark
                      const benchmarkPoints = axisKeys.map((key, i) => {
                        const val = RIASEC_BENCHMARK_PERCENTAGES[key] || 16;
                        const r = maxR * Math.min(Math.max(val / 35, 0.05), 1);
                        const angle = startAngle + i * angleStep;
                        return {
                          x: center + r * Math.cos(angle),
                          y: center + r * Math.sin(angle),
                        };
                      });
                      const benchmarkPath = benchmarkPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

                      return (
                        <svg width={size} height={size} className="overflow-visible max-w-full drop-shadow-sm">
                          {/* Concentric Polygons */}
                          {rings.map((ring, idx) => {
                            const pts = axisKeys.map((_, i) => {
                              const r = maxR * ring;
                              const angle = startAngle + i * angleStep;
                              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
                            }).join(' ');
                            return (
                              <polygon
                                key={idx}
                                points={pts}
                                fill={idx % 2 === 1 ? (theme === 'dark' ? 'rgba(30, 41, 59, 0.3)' : 'rgba(241, 245, 249, 0.6)') : 'none'}
                                stroke={theme === 'dark' ? '#334155' : '#E2E8F0'}
                                strokeWidth={idx === rings.length - 1 ? 1.5 : 1}
                              />
                            );
                          })}

                          {/* Axis Spokes */}
                          {axisKeys.map((key, i) => {
                            const angle = startAngle + i * angleStep;
                            const x2 = center + maxR * Math.cos(angle);
                            const y2 = center + maxR * Math.sin(angle);
                            return (
                              <line
                                key={key}
                                x1={center}
                                y1={center}
                                x2={x2}
                                y2={y2}
                                stroke={theme === 'dark' ? '#334155' : '#CBD5E1'}
                                strokeWidth={1}
                              />
                            );
                          })}

                          {/* Benchmark Polygon */}
                          <path
                            d={benchmarkPath}
                            fill="rgba(148, 163, 184, 0.15)"
                            stroke="#64748B"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                          />

                          {/* User Polygon */}
                          <path
                            d={userPath}
                            fill="rgba(79, 70, 229, 0.35)"
                            stroke="#6366F1"
                            strokeWidth={2.5}
                          />

                          {/* User Points */}
                          {userPoints.map((p, i) => (
                            <circle
                              key={i}
                              cx={p.x}
                              cy={p.y}
                              r={4.5}
                              fill="#6366F1"
                              stroke="#FFFFFF"
                              strokeWidth={2}
                            />
                          ))}

                          {/* Outer Axis Labels */}
                          {axisKeys.map((key, i) => {
                            const angle = startAngle + i * angleStep;
                            const labelDistance = maxR + 32;
                            const lx = center + labelDistance * Math.cos(angle);
                            const ly = center + labelDistance * Math.sin(angle);
                            const score = computedResult.scores[key];

                            return (
                              <g key={key} transform={`translate(${lx}, ${ly})`}>
                                <circle r={14} fill={score.color} />
                                <text
                                  textAnchor="middle"
                                  dominantBaseline="central"
                                  fill="#FFFFFF"
                                  fontSize={11}
                                  fontWeight="bold"
                                >
                                  {key}
                                </text>
                                <text
                                  y={18}
                                  textAnchor="middle"
                                  fontSize={11}
                                  fontWeight="bold"
                                  fill={theme === 'dark' ? '#E2E8F0' : '#1E293B'}
                                >
                                  {score.percentage}%
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      );
                    })()}
                  </div>

                  {/* Legend */}
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-3 rounded-xs bg-indigo-600 inline-block shadow-xs" />
                      <span>Seu Perfil RIASEC</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-0.5 border-t-2 border-dashed border-slate-400 inline-block" />
                      <span className="text-slate-400">Benchmark Geral</span>
                    </div>
                  </div>
                </div>

                {/* Top 3 Dominant Breakdown Cards */}
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="font-bold text-base">Composição da sua Tríade Vocacional</h3>

                  {[
                    { type: computedResult.primaryType, label: '1º — Tipo Dominante', rank: 'Primário' },
                    { type: computedResult.secondaryType, label: '2º — Tipo Complementar', rank: 'Secundário' },
                    { type: computedResult.tertiaryType, label: '3º — Tipo de Apoio', rank: 'Terciário' },
                  ].map(({ type, label, rank }) => {
                    const detail = PROFILES_DETAIL[type];
                    const color = RIASEC_COLORS[type];
                    const score = computedResult.scores[type];

                    return (
                      <div
                        key={type}
                        className={`p-5 rounded-2xl border transition-all ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs uppercase tracking-wider font-bold text-indigo-400">
                            {label}
                          </span>
                          <span
                            className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-xs"
                            style={{ backgroundColor: color.primary }}
                          >
                            {score.points} pts • {score.percentage}%
                          </span>
                        </div>
                        <h4 className="text-base font-bold flex items-center gap-2">
                          {detail.name}
                          <span className="text-xs font-normal text-slate-400">({type})</span>
                        </h4>
                        <p className={`mt-1 text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          {detail.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED DIMENSIONS */}
          {resultTab === 'dimensions' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(['R', 'I', 'A', 'S', 'E', 'C'] as RiasecType[]).map((type) => {
                  const detail = PROFILES_DETAIL[type];
                  const color = RIASEC_COLORS[type];
                  const score = computedResult.scores[type];
                  const isTop3 =
                    type === computedResult.primaryType ||
                    type === computedResult.secondaryType ||
                    type === computedResult.tertiaryType;

                  return (
                    <div
                      key={type}
                      className={`p-6 rounded-3xl border transition-all ${
                        isTop3
                          ? 'ring-1 ring-indigo-500/30'
                          : ''
                      } ${
                        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md"
                          style={{ backgroundColor: color.primary }}
                        >
                          {type}
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-extrabold block text-slate-100">{score.points} pts</span>
                          <span className="text-xs font-semibold text-indigo-400">{score.percentage}% do total</span>
                        </div>
                      </div>

                      <h3 className="mt-4 text-lg font-bold">{detail.name}</h3>
                      <p className={`mt-1 text-xs leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        {detail.description}
                      </p>

                      <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-3">
                        <div>
                          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                            Competências-Chave:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {detail.keySkills.map((sk, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                                  theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                            Ambientes Ideais:
                          </span>
                          <p className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            {detail.idealEnvironments.join(' • ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CAREERS & EDUCATION */}
          {resultTab === 'careers' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div
                className={`p-6 sm:p-8 rounded-3xl border ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
                }`}
              >
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-400" /> Carreiras Alinhadas ao seu Código {computedResult.hollandCode}
                </h3>
                <p className={`mt-1 text-xs sm:text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Mapeamento de funções e ocupações no mercado onde suas 3 dimensões dominantes encontram máxima sinergia.
                </p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[computedResult.primaryType, computedResult.secondaryType, computedResult.tertiaryType].map((type) => {
                    const detail = PROFILES_DETAIL[type];
                    const color = RIASEC_COLORS[type];

                    return (
                      <div
                        key={type}
                        className={`p-5 rounded-2xl border ${
                          theme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 mb-3">
                          <span
                            className="w-7 h-7 rounded-lg text-white font-bold text-xs flex items-center justify-center shadow-xs"
                            style={{ backgroundColor: color.primary }}
                          >
                            {type}
                          </span>
                          <span className="font-bold text-sm">{detail.name}</span>
                        </div>

                        <div className="space-y-3">
                          {detail.recommendedCareers.map((rc, idx) => (
                            <div key={idx} className="text-xs">
                              <span className="font-semibold text-indigo-400 block mb-0.5">{rc.category}</span>
                              <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>
                                {rc.jobs.join(', ')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Education recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className={`p-6 rounded-3xl border ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
                  }`}
                >
                  <h4 className="font-bold text-base flex items-center gap-2 mb-3">
                    <GraduationCap className="w-5 h-5 text-purple-400" /> Cursos Superiores Recomendados
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {[
                      ...PROFILES_DETAIL[computedResult.primaryType].higherEducationCourses,
                      ...PROFILES_DETAIL[computedResult.secondaryType].higherEducationCourses.slice(0, 3),
                    ].map((course, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                        <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}>{course}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`p-6 rounded-3xl border ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
                  }`}
                >
                  <h4 className="font-bold text-base flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-teal-400" /> Cursos Técnicos & Tecnológicos
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {[
                      ...PROFILES_DETAIL[computedResult.primaryType].technicalCourses,
                      ...PROFILES_DETAIL[computedResult.secondaryType].technicalCourses.slice(0, 3),
                    ].map((course, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                        <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}>{course}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT */}
          {resultTab === 'audit' && (
            <div
              className={`p-6 rounded-3xl border ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
              }`}
            >
              <h3 className="text-base font-bold mb-4">Auditoria Completa de Respostas (12 Blocos)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                      <th className="py-2.5 px-3 font-semibold">Bloco</th>
                      <th className="py-2.5 px-3 font-semibold text-amber-400">1º Lugar (3 pts)</th>
                      <th className="py-2.5 px-3 font-semibold text-slate-300">2º Lugar (2 pts)</th>
                      <th className="py-2.5 px-3 font-semibold text-amber-600">3º Lugar (1 pt)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {DEFAULT_BLOCKS.map((b) => {
                      const ans = answers[b.blockNumber];
                      const q1 = b.questions.find((q) => q.id === ans?.first);
                      const q2 = b.questions.find((q) => q.id === ans?.second);
                      const q3 = b.questions.find((q) => q.id === ans?.third);

                      return (
                        <tr key={b.blockNumber} className="hover:bg-slate-800/20 transition">
                          <td className="py-3 px-3 font-bold text-slate-400">Bloco {b.blockNumber}</td>
                          <td className="py-3 px-3">
                            {q1 ? (
                              <span className="flex items-center gap-1.5">
                                <span className="w-4 h-4 rounded-xs text-[10px] font-bold text-white flex items-center justify-center shrink-0" style={{ backgroundColor: RIASEC_COLORS[q1.letter].primary }}>
                                  {q1.letter}
                                </span>
                                <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{q1.title}</span>
                              </span>
                            ) : '-'}
                          </td>
                          <td className="py-3 px-3">
                            {q2 ? (
                              <span className="flex items-center gap-1.5">
                                <span className="w-4 h-4 rounded-xs text-[10px] font-bold text-white flex items-center justify-center shrink-0" style={{ backgroundColor: RIASEC_COLORS[q2.letter].primary }}>
                                  {q2.letter}
                                </span>
                                <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{q2.title}</span>
                              </span>
                            ) : '-'}
                          </td>
                          <td className="py-3 px-3">
                            {q3 ? (
                              <span className="flex items-center gap-1.5">
                                <span className="w-4 h-4 rounded-xs text-[10px] font-bold text-white flex items-center justify-center shrink-0" style={{ backgroundColor: RIASEC_COLORS[q3.letter].primary }}>
                                  {q3.letter}
                                </span>
                                <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{q3.title}</span>
                              </span>
                            ) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
