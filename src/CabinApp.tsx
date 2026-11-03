import React, { useState, useEffect, useMemo } from 'react';
import {
  CABIN_SCALES,
  CABIN_ITEMS,
  CABIN_LIKERT_OPTIONS,
  SETPOINT_DIMENSIONS,
  calculateCabinScores,
  DEMO_PROFILE_TECH_LEAD,
  DEMO_PROFILE_HEALTH_PEOPLE,
  SetpointCode,
  CabinScores
} from './cabinData';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Printer,
  Sparkles,
  Info,
  HelpCircle,
  BarChart3,
  Search,
  Filter,
  Layers,
  Award,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sliders,
  ShieldAlert,
  Brain
} from 'lucide-react';

const STORAGE_KEY = 'comet_cabin_v1';
const ITEMS_PER_PAGE = 15;
const TOTAL_PAGES = Math.ceil(CABIN_ITEMS.length / ITEMS_PER_PAGE); // 11 pages

interface CabinAppProps {
  onBackToMain?: () => void;
  initialStep?: 'intro' | 'instructions' | 'test' | 'review' | 'report';
  integratedInfo?: {
    currentStepNumber: number;
    totalSteps: number;
    nextModuleName?: string;
    onProceedNext?: () => void;
  };
}

export const CabinApp: React.FC<CabinAppProps> = ({
  onBackToMain,
  initialStep,
  integratedInfo,
}) => {
  const [step, setStep] = useState<'intro' | 'instructions' | 'test' | 'review' | 'processing' | 'report'>(
    initialStep || 'intro'
  );
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'setpoint' | 'scales' | 'clusters' | 'applied'>('setpoint');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDimensionFilter, setSelectedDimensionFilter] = useState<string>('ALL');
  const [expandedScaleId, setExpandedScaleId] = useState<number | null>(null);

  // Sync initialStep if passed from parent
  useEffect(() => {
    if (initialStep) {
      setStep(initialStep);
    }
  }, [initialStep]);

  // Restore saved answers from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.answers === 'object') {
          setAnswers(parsed.answers);
          if (!initialStep && parsed.step && ['test', 'review', 'report'].includes(parsed.step)) {
            // Keep user on their saved step if they had progressed
            setStep(parsed.step);
          }
          if (parsed.currentPage) {
            setCurrentPage(parsed.currentPage);
          }
        }
      }
    } catch (e) {
      console.error('Error loading CABIN storage', e);
    }
  }, [initialStep]);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          answers,
          step,
          currentPage,
          updatedAt: new Date().toISOString()
        })
      );
    } catch (e) {
      console.error('Error saving CABIN storage', e);
    }
  }, [answers, step, currentPage]);

  const scores: CabinScores = useMemo(() => {
    return calculateCabinScores(answers);
  }, [answers]);

  const answeredCount = useMemo(() => {
    return Object.keys(answers).length;
  }, [answers]);

  const completionPercentage = Math.round((answeredCount / CABIN_ITEMS.length) * 100);

  // Pagination for test questions
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return CABIN_ITEMS.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage]);

  const isCurrentPageComplete = useMemo(() => {
    return currentItems.every((item) => typeof answers[item.id] === 'number');
  }, [currentItems, answers]);

  const handleSelectAnswer = (itemId: number, val: number) => {
    setAnswers((prev) => ({
      ...prev,
      [itemId]: val
    }));
  };

  const handleLoadDemo = (profile: 'tech' | 'health') => {
    const demoAnswers = profile === 'tech' ? DEMO_PROFILE_TECH_LEAD : DEMO_PROFILE_HEALTH_PEOPLE;
    setAnswers({ ...demoAnswers });
    setStep('processing');
    setTimeout(() => {
      setStep('report');
    }, 600);
  };

  const handleResetTest = () => {
    if (window.confirm('Deseja reiniciar a avaliação CABIN? Todas as respostas atuais serão limpas.')) {
      setAnswers({});
      setCurrentPage(1);
      setStep('intro');
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    }
  };

  const handleFinishToReview = () => {
    setStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProcessResults = () => {
    setStep('processing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setStep('report');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  // Helper for score interpretation
  const getScoreBadge = (score: number) => {
    if (score >= 4.0) {
      return {
        label: 'Muito Elevado',
        color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
      };
    }
    if (score >= 3.5) {
      return {
        label: 'Elevado',
        color: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30'
      };
    }
    if (score >= 2.8) {
      return {
        label: 'Intermediário',
        color: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
      };
    }
    return {
      label: 'Menor Presença',
      color: 'bg-neutral-500/15 text-neutral-600 dark:text-neutral-400 border-neutral-500/30'
    };
  };

  // Sorted scales for reporting
  const sortedScales = useMemo(() => {
    return [...CABIN_SCALES].sort((a, b) => {
      const scoreA = scores.scales[a.id] || 0;
      const scoreB = scores.scales[b.id] || 0;
      return scoreB - scoreA;
    });
  }, [scores]);

  // Filtered scales in Report Section C
  const filteredScales = useMemo(() => {
    return sortedScales.filter((scale) => {
      const matchesSearch =
        scale.namePt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scale.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scale.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDim = selectedDimensionFilter === 'ALL' || scale.dimension === selectedDimensionFilter;
      return matchesSearch && matchesDim;
    });
  }, [sortedScales, searchQuery, selectedDimensionFilter]);

  // SETPOINT radar chart SVG coordinates
  const radarPoints = useMemo(() => {
    const totalDims = SETPOINT_DIMENSIONS.length;
    const center = 150;
    const radius = 100;

    const coords = SETPOINT_DIMENSIONS.map((dim, index) => {
      const angle = (Math.PI * 2 / totalDims) * index - Math.PI / 2;
      const score = scores.dimensions[dim.code] || 1;
      const normalizedScore = (score - 1) / 4; // 0 to 1
      const r = 20 + normalizedScore * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return { x, y, dim, score, angle };
    });

    const polygonPoints = coords.map((c) => `${c.x},${c.y}`).join(' ');
    return { coords, polygonPoints, center };
  }, [scores]);

  // -------------------------------------------------------------
  // VIEW: INTRO
  // -------------------------------------------------------------
  if (step === 'intro') {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Banner CABIN */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 text-white p-8 sm:p-12 border border-indigo-500/20 shadow-2xl mb-8">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-400/20 text-teal-300 border border-teal-400/30 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Área Mentalidade • Perfil Profissional (Escolhas e Direcionamento)</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
              CABIN <span className="text-teal-400 font-light">| Interesses Básicos</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed mb-6">
              *Comprehensive Assessment of Basic Interests* (Su et al., 2019). O instrumento científico mais completo
              para mapear suas afinidades vocacionais em <strong>41 interesses básicos</strong> agrupados nas <strong>8 macrodimensões SETPOINT</strong>.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setStep('instructions')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Iniciar Avaliação CABIN</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="dropdown relative inline-block group">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-medium text-sm sm:text-base border border-slate-700 transition-all"
                >
                  <Brain className="w-4 h-4 text-indigo-400" />
                  <span>Ver Demonstração Fictícia</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
                  <div className="text-xs text-slate-400 px-3 py-1 font-semibold uppercase tracking-wider">
                    Selecione um Perfil Pronto
                  </div>
                  <button
                    onClick={() => handleLoadDemo('tech')}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-800 hover:text-teal-400 transition-colors flex flex-col"
                  >
                    <span className="font-semibold">Liderança Tecnológica & Negócios</span>
                    <span className="text-xs text-slate-400">TI, Engenharia, Estratégia, Gestão</span>
                  </button>
                  <button
                    onClick={() => handleLoadDemo('health')}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-800 hover:text-teal-400 transition-colors flex flex-col mt-1"
                  >
                    <span className="font-semibold">Ciências da Saúde & Pessoas</span>
                    <span className="text-xs text-slate-400">Medicina, Cuidados, Apoio Social, Ensino</span>
                  </button>
                </div>
              </div>

              {answeredCount > 0 && (
                <button
                  onClick={() => setStep('test')}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 font-medium text-sm border border-indigo-500/30 transition-all"
                >
                  <span>Continuar Teste Salvo ({completionPercentage}%)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Pilares do Instrumento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">41 Interesses Básicos</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Supera os 6 tipos genéricos do modelo RIASEC tradicional, oferecendo precisão analítica cirúrgica em 41 áreas vocacionais específicas.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">8 Dimensões SETPOINT</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Organização taxonômica superior: <em>Health Science, Creative Expression, Technology, People, Organization, Influence, Nature</em> e <em>Things</em>.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Rigor Psicométrico</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              164 atividades balanceadas (4 itens por interesse) com validação empírica publicada no <em>Journal of Applied Psychology</em> (2019).
            </p>
          </div>
        </div>

        {/* Modelo SETPOINT Preview */}
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              As 8 Macrodimensões do Modelo SETPOINT
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {SETPOINT_DIMENSIONS.map((dim) => (
              <div
                key={dim.code}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-sm text-slate-900 dark:text-slate-100">{dim.letter}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {dim.scaleIds.length} escalas
                    </span>
                  </div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{dim.nameEn}</div>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                  {dim.namePt.split('(')[0].trim()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: INSTRUCTIONS
  // -------------------------------------------------------------
  if (step === 'instructions') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Instruções Oficiais de Preenchimento</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
            Como responder ao questionário CABIN
          </h1>

          <div className="prose dark:prose-invert text-slate-600 dark:text-slate-300 text-sm sm:text-base space-y-4 mb-8">
            <p className="leading-relaxed">
              O questionário a seguir apresenta <strong>164 atividades profissionais e cotidianas</strong>. Para cada atividade,
              indique o quanto você gostaria ou desgostaria de realizá-la.
            </p>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
              <p className="font-semibold flex items-center gap-2 mb-1">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Regra Psicométrica Fundamental:
              </p>
              <p className="text-xs sm:text-sm leading-relaxed">
                Responda <strong>EXCLUSIVAMENTE</strong> com base em como você se sente em relação a engajar-se na atividade.
                <strong> NÃO</strong> pense sobre se você possui ou não as habilidades técnicas, formação prévia ou quanto dinheiro ganharia fazendo-a.
              </p>
            </div>

            <p className="font-medium text-slate-900 dark:text-slate-100 pt-2">
              Você responderá utilizando a escala original de 5 pontos:
            </p>

            <div className="space-y-2.5 pt-1">
              {CABIN_LIKERT_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-700 dark:text-teal-300 font-black flex items-center justify-center shrink-0 text-sm">
                    {opt.value}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{opt.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{opt.description}</div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 pt-3">
              * Nota: Em conformidade com o método psicométrico de Su et al. (2019), os nomes das escalas e dimensões não serão exibidos
              durante o questionário para evitar viés de resposta ou desejabilidade social.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setStep('intro')}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            <button
              onClick={() => {
                setStep('test');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
            >
              <span>Entendido, Começar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: QUESTIONNAIRE (TEST)
  // -------------------------------------------------------------
  if (step === 'test') {
    const pageStartNum = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const pageEndNum = Math.min(currentPage * ITEMS_PER_PAGE, CABIN_ITEMS.length);

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Banner de Jornada Integrada se ativo */}
        {integratedInfo && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-teal-500/15 via-indigo-500/10 to-teal-500/15 border border-teal-500/30 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-teal-500 text-slate-950 font-black text-[11px] uppercase tracking-wider">
                Jornada Integrada
              </span>
              <div>
                <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  Etapa {integratedInfo.currentStepNumber} de {integratedInfo.totalSteps}: CABIN Interesses Básicos
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block sm:inline sm:ml-2">
                  (Atividades e Tarefas Reais)
                </span>
              </div>
            </div>
            {integratedInfo.nextModuleName && (
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                Próxima Etapa: {integratedInfo.nextModuleName} →
              </span>
            )}
          </div>
        )}

        {/* Barra superior de status & navegação */}
        <div className="sticky top-20 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-xs">
                Etapa {currentPage} de {TOTAL_PAGES}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Itens {pageStartNum} a {pageEndNum} de {CABIN_ITEMS.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {answeredCount} de {CABIN_ITEMS.length} respondidas ({completionPercentage}%)
              </span>
              <button
                onClick={handleFinishToReview}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Revisar Respostas
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Lista de itens da página atual */}
        <div className="space-y-4 mb-8">
          {currentItems.map((item) => {
            const currentVal = answers[item.id];
            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  typeof currentVal === 'number'
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    : 'bg-white dark:bg-slate-900 border-amber-300/60 dark:border-amber-500/40 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500 shrink-0">
                      #{item.id}
                    </span>
                    <h3 className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-snug">
                      {item.textPt}
                    </h3>
                  </div>

                  {typeof currentVal === 'number' && (
                    <span className="shrink-0 text-teal-500 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Respondido</span>
                    </span>
                  )}
                </div>

                {/* Opções Likert 1 a 5 */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-1">
                  {CABIN_LIKERT_OPTIONS.map((opt) => {
                    const isSelected = currentVal === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelectAnswer(item.id, opt.value)}
                        className={`group flex flex-col items-center justify-center py-2.5 px-1 sm:px-2 rounded-xl text-center transition-all ${
                          isSelected
                            ? 'bg-teal-500 text-slate-950 font-black shadow-md shadow-teal-500/25 scale-[1.02]'
                            : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/50'
                        }`}
                      >
                        <span className="text-base sm:text-lg font-black leading-none mb-1">{opt.value}</span>
                        <span className="text-[10px] sm:text-xs leading-tight line-clamp-1 font-medium opacity-90">
                          {opt.shortLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Barra de navegação inferior */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <button
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage((p) => p - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                setStep('instructions');
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentPage === 1 ? 'Instruções' : 'Etapa Anterior'}</span>
          </button>

          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {isCurrentPageComplete ? (
              <span className="text-teal-600 dark:text-teal-400 font-medium">Todos os itens desta etapa foram respondidos!</span>
            ) : (
              <span>Responda a todas as perguntas para avançar com precisão</span>
            )}
          </div>

          {currentPage < TOTAL_PAGES ? (
            <button
              onClick={() => {
                setCurrentPage((p) => p + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-bold shadow-md transition-all hover:scale-[1.02]"
            >
              <span>Próxima Etapa</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinishToReview}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
            >
              <span>Revisar e Finalizar</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: REVIEW ANSWERS
  // -------------------------------------------------------------
  if (step === 'review') {
    const unAnsweredCount = CABIN_ITEMS.length - answeredCount;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Auditoria e Revisão Geral</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                Revisão das 164 Questões
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep('test')}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Voltar ao Questionário
              </button>
              <button
                onClick={handleProcessResults}
                disabled={answeredCount === 0}
                className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md"
              >
                Gerar Relatório Oficial
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 mb-6">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Total de Questões</div>
              <div className="text-xl font-black text-slate-900 dark:text-slate-100">{CABIN_ITEMS.length}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Respondidas</div>
              <div className="text-xl font-black text-teal-600 dark:text-teal-400">{answeredCount}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Pendentes</div>
              <div className={`text-xl font-black ${unAnsweredCount > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                {unAnsweredCount}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Completude</div>
              <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">{completionPercentage}%</div>
            </div>
          </div>

          {unAnsweredCount > 0 && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3 mb-6">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Atenção: existem {unAnsweredCount} questões sem resposta.</p>
                <p className="text-xs opacity-90 mt-0.5">
                  Para máxima fidedignidade psicométrica, recomendamos responder a todos os 164 itens antes de gerar o relatório.
                </p>
              </div>
            </div>
          )}

          {/* Tabela de itens para conferência rápida */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
            {CABIN_ITEMS.map((item) => {
              const currentVal = answers[item.id];
              return (
                <div
                  key={item.id}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-baseline gap-2.5 min-w-0">
                    <span className="font-mono text-xs font-bold text-slate-400 shrink-0">#{item.id}</span>
                    <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate">{item.textPt}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleSelectAnswer(item.id, val)}
                        className={`w-7 h-7 rounded-lg text-xs font-black transition-all ${
                          currentVal === val
                            ? 'bg-teal-500 text-slate-950 scale-105 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-3 pt-6">
            <button
              onClick={handleProcessResults}
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.02]"
            >
              Confirmar e Gerar Relatório Executivo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: PROCESSING
  // -------------------------------------------------------------
  if (step === 'processing') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 animate-ping" />
          <div className="relative w-20 h-20 rounded-full border-4 border-teal-500 border-t-transparent animate-spin flex items-center justify-center">
            <Compass className="w-8 h-8 text-teal-500" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2">
          Calculando Resultados Psicométricos
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Processando médias das 41 escalas e agregando as 8 dimensões do modelo dimensional SETPOINT (Su et al., 2019)...
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: EXECUTIVE REPORT
  // -------------------------------------------------------------
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Banner de Avanço na Jornada Integrada se ativo */}
      {integratedInfo?.onProceedNext && (
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-500/15 via-indigo-500/15 to-teal-500/15 border-2 border-teal-500/40 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500 text-slate-950 font-black text-xs uppercase tracking-wide">
                Etapa {integratedInfo.currentStepNumber} de {integratedInfo.totalSteps} Concluída!
              </span>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                Relatório CABIN Salvo com Sucesso
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium">
              Você pode analisar seu relatório completo abaixo ou avançar agora para a próxima etapa da jornada: <strong>{integratedInfo.nextModuleName}</strong>.
            </p>
          </div>
          <button
            onClick={integratedInfo.onProceedNext}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer shrink-0 hover:scale-105 active:scale-95"
          >
            <span>Avançar para {integratedInfo.nextModuleName}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header do Relatório */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm mb-8 print:border-none print:shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                <span>Assessment COMET • Relatório Individual</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                Perfil de Interesses Básicos CABIN
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={handleResetTest}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Novo Teste</span>
            </button>
          </div>
        </div>

        {/* Métricas Centrais */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Média Geral de Interesses</div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-0.5 font-mono">
              {scores.overallMean.toFixed(2)}{' '}
              <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Índice de Diferenciação</div>
            <div className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-0.5 font-mono">
              {scores.differentiationIndex.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Interesses Predominantes</div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
              {scores.highestInterestIds.length}{' '}
              <span className="text-xs text-slate-400 font-normal">escalas</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Completude do Teste</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {completionPercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Navegação por Abas do Relatório */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 print:hidden overflow-x-auto">
        <button
          onClick={() => setActiveTab('setpoint')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'setpoint'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Dimensões SETPOINT (8)</span>
        </button>
        <button
          onClick={() => setActiveTab('scales')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'scales'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Ranking das 41 Escalas</span>
        </button>
        <button
          onClick={() => setActiveTab('clusters')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'clusters'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Predominância & Sinergias</span>
        </button>
        <button
          onClick={() => setActiveTab('applied')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'applied'
              ? 'border-teal-500 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Aplicações Práticas de Carreira</span>
        </button>
      </div>

      {/* ABA 1: DIMENSÕES SETPOINT */}
      {(activeTab === 'setpoint' || typeof window === 'undefined') && (
        <div className="space-y-8">
          {/* Radar e Resumo */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Gráfico Radar SVG */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">
                Mapeamento Poligonal SETPOINT
              </h3>

              <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
                <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
                  {/* Círculos concêntricos de escala (1 a 5) */}
                  {[0.25, 0.5, 0.75, 1.0].map((level, i) => (
                    <circle
                      key={i}
                      cx={radarPoints.center}
                      cy={radarPoints.center}
                      r={level * 100}
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="3 3"
                      className="text-slate-200 dark:text-slate-800"
                    />
                  ))}

                  {/* Eixos radiais */}
                  {radarPoints.coords.map((c, i) => {
                    const angle = (Math.PI * 2 / SETPOINT_DIMENSIONS.length) * i - Math.PI / 2;
                    const endX = radarPoints.center + 105 * Math.cos(angle);
                    const endY = radarPoints.center + 105 * Math.sin(angle);
                    return (
                      <line
                        key={i}
                        x1={radarPoints.center}
                        y1={radarPoints.center}
                        x2={endX}
                        y2={endY}
                        stroke="currentColor"
                        className="text-slate-200 dark:text-slate-800"
                      />
                    );
                  })}

                  {/* Polígono dos resultados */}
                  <polygon
                    points={radarPoints.polygonPoints}
                    fill="rgba(20, 184, 166, 0.25)"
                    stroke="#14b8a6"
                    strokeWidth="2.5"
                    className="transition-all duration-500"
                  />

                  {/* Pontos nos vértices */}
                  {radarPoints.coords.map((c, i) => (
                    <circle
                      key={i}
                      cx={c.x}
                      cy={c.y}
                      r="4"
                      fill="#0f766e"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  ))}

                  {/* Rótulos dos vértices */}
                  {radarPoints.coords.map((c, i) => {
                    const angle = (Math.PI * 2 / SETPOINT_DIMENSIONS.length) * i - Math.PI / 2;
                    const labelR = 125;
                    const lx = radarPoints.center + labelR * Math.cos(angle);
                    const ly = radarPoints.center + labelR * Math.sin(angle);
                    return (
                      <text
                        key={i}
                        x={lx}
                        y={ly}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-[11px] font-black fill-slate-800 dark:fill-slate-200"
                      >
                        {c.dim.letter}
                      </text>
                    );
                  })}
                </svg>
              </div>

              <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
                Escala de 1.0 (mínimo) a 5.0 (máximo). Cada vértice reflete a média das escalas da dimensão.
              </div>
            </div>

            {/* Barras Horizontais das 8 Dimensões */}
            <div className="lg:col-span-7 space-y-3">
              {SETPOINT_DIMENSIONS.map((dim) => {
                const score = scores.dimensions[dim.code] || 1;
                const badge = getScoreBadge(score);
                const percentage = ((score - 1) / 4) * 100;

                return (
                  <div
                    key={dim.code}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-7 h-7 rounded-lg text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm"
                          style={{ backgroundColor: dim.colorHex }}
                        >
                          {dim.letter}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{dim.namePt}</h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {dim.scaleIds.length} interesses básicos vinculados
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-base font-black text-slate-900 dark:text-slate-100 mr-2">
                          {score.toFixed(2)}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>

                    {/* Barra de progresso */}
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(5, percentage)}%`,
                          backgroundColor: dim.colorHex
                        }}
                      />
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {dim.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: RANKING DAS 41 ESCALAS */}
      {(activeTab === 'scales' || typeof window === 'undefined') && (
        <div className="space-y-6">
          {/* Barra de Busca e Filtro */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nome do interesse ou palavra-chave..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedDimensionFilter}
                onChange={(e) => setSelectedDimensionFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">Todas as 8 Dimensões SETPOINT</option>
                {SETPOINT_DIMENSIONS.map((dim) => (
                  <option key={dim.code} value={dim.code}>
                    {dim.letter} - {dim.namePt.split('(')[0]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lista de Escalas com Ranking */}
          <div className="space-y-3">
            {filteredScales.map((scale, index) => {
              const score = scores.scales[scale.id] || 0;
              const badge = getScoreBadge(score);
              const isExpanded = expandedScaleId === scale.id;
              const dim = SETPOINT_DIMENSIONS.find((d) => d.code === scale.dimension);

              return (
                <div
                  key={scale.id}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all"
                >
                  <div
                    onClick={() => setExpandedScaleId(isExpanded ? null : scale.id)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                        {index + 1}º
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                            {scale.namePt}
                          </h4>
                          <span className="text-xs text-slate-400 font-normal hidden sm:inline">
                            ({scale.nameEn})
                          </span>
                          {dim && (
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-bold text-white shrink-0"
                              style={{ backgroundColor: dim.colorHex }}
                            >
                              {dim.letter} • {dim.nameEn}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {scale.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-mono text-lg font-black text-slate-900 dark:text-slate-100">
                          {score.toFixed(2)}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>

                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Detalhes expandidos */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-xs sm:text-sm space-y-4">
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                          Definição do Interesse:
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {scale.description}
                        </p>
                      </div>

                      {/* As 4 atividades avaliadas com as respostas dadas */}
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                          As 4 Atividades Avaliadas no Instrumento:
                        </div>
                        <div className="space-y-1.5">
                          {scale.itemIds.map((itemId) => {
                            const itemObj = CABIN_ITEMS.find((it) => it.id === itemId);
                            const val = answers[itemId];
                            return (
                              <div
                                key={itemId}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60"
                              >
                                <span className="text-slate-700 dark:text-slate-300 text-xs">
                                  {itemObj?.textPt}
                                </span>
                                <span className="font-mono font-bold text-xs px-2 py-1 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0 ml-2">
                                  Nota: {typeof val === 'number' ? val : 'N/A'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                          <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                            Ambientes de Trabalho Típicos:
                          </div>
                          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 text-xs space-y-0.5">
                            {scale.environments.map((env, i) => (
                              <li key={i}>{env}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                          <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                            Aplicações e Contextos Reais:
                          </div>
                          <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 text-xs space-y-0.5">
                            {scale.sampleActivities.map((act, i) => (
                              <li key={i}>{act}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ABA 3: PREDOMINÂNCIA & SINERGIAS */}
      {(activeTab === 'clusters' || typeof window === 'undefined') && (
        <div className="space-y-8">
          {/* Segmentação em 3 Clusters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cluster 1: Elevados */}
            <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Interesses Mais Elevados (Top)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                Pontuações acima de 3.75. Representam suas maiores fontes de energia e satisfação intrínseca.
              </p>

              <div className="space-y-2">
                {scores.highestInterestIds.length === 0 ? (
                  <div className="text-xs text-slate-400 italic">Nenhum interesse atingiu a faixa muito elevada.</div>
                ) : (
                  scores.highestInterestIds.map((id) => {
                    const sc = CABIN_SCALES.find((s) => s.id === id);
                    const score = scores.scales[id] || 0;
                    return (
                      <div
                        key={id}
                        className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-500/20 flex items-center justify-between"
                      >
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{sc?.namePt}</span>
                        <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                          {score.toFixed(2)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Cluster 2: Intermediários */}
            <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm mb-2">
                <Sliders className="w-4 h-4" />
                <span>Interesses Intermediários</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                Pontuações entre 2.25 e 3.75. Representam competências de apoio e versatilidade em equipes multidisciplinares.
              </p>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {scores.intermediateInterestIds.slice(0, 8).map((id) => {
                  const sc = CABIN_SCALES.find((s) => s.id === id);
                  const score = scores.scales[id] || 0;
                  return (
                    <div
                      key={id}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-500/20 flex items-center justify-between"
                    >
                      <span className="text-xs text-slate-800 dark:text-slate-200">{sc?.namePt}</span>
                      <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {score.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cluster 3: Menos Presentes */}
            <div className="p-6 rounded-3xl bg-slate-500/5 border border-slate-500/20">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-bold text-sm mb-2">
                <Info className="w-4 h-4" />
                <span>Menor Presença Vocacional</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                Pontuações abaixo de 2.25. Áreas que tendem a gerar desmotivação ou esgotamento se executadas continuamente.
              </p>

              <div className="space-y-2">
                {scores.lowestInterestIds.length === 0 ? (
                  <div className="text-xs text-slate-400 italic">Perfil com ampla distribuição de afinidades.</div>
                ) : (
                  scores.lowestInterestIds.map((id) => {
                    const sc = CABIN_SCALES.find((s) => s.id === id);
                    const score = scores.scales[id] || 0;
                    return (
                      <div
                        key={id}
                        className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-500/20 flex items-center justify-between"
                      >
                        <span className="text-xs text-slate-700 dark:text-slate-300">{sc?.namePt}</span>
                        <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {score.toFixed(2)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Sinergias Vocacionais Relevantes */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              Sinergias e Combinações de Alto Potencial
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              A verdadeira riqueza do CABIN surge no cruzamento entre interesses de diferentes macrodimensões:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-sm text-indigo-600 dark:text-indigo-400 mb-1">
                  Ponte Tecnologia + Negócios (Inovação Digital)
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Quando escalas de TI/Engenharia se associam a Iniciativas de Negócios e Gestão, surge o perfil ideal para
                  Product Management, fundação de startups tecnológicas e liderança de transformação digital corporativa.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-sm text-teal-600 dark:text-teal-400 mb-1">
                  Ponte Saúde + Educação (Promoção Humana)
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  A união de Ciências Médicas e Cuidados com Ensino/Apoio Social capacita para docência em saúde, liderança comunitária,
                  educação médica continuada e desenvolvimento de programas preventivos em escala populacional.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-sm text-purple-600 dark:text-purple-400 mb-1">
                  Ponte Criação + Oratória (Comunicação e Mídia)
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Conexão entre Escrita, Audiovisual e Comunicação Pública viabiliza carreiras de porta-voz institucional,
                  produção de podcasts de autoridade, jornalismo investigativo e direção criativa em grandes campanhas.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-sm text-amber-600 dark:text-amber-400 mb-1">
                  Ponte Organização + Direito (Governança & Compliance)
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Finanças e Contabilidade associadas a Direito e Política formam a espinha dorsal de órgãos reguladores,
                  estruturação societária de fusões & aquisições (M&A) e controladorias de auditoria internacional.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: APLICAÇÕES PRÁTICAS */}
      {(activeTab === 'applied' || typeof window === 'undefined') && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Recomendações Práticas para seu Desenvolvimento de Carreira
            </h3>

            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/20">
                <h4 className="font-bold text-teal-700 dark:text-teal-300 mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  1. Otimize seus Projetos Diários para suas Escalas de Pico
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed">
                  As atividades com notas acima de 4.0 são propulsoras de alto engajamento. Busque voluntariar-se em sua empresa para projetos
                  que demandem especificamente as competências de suas principais escalas (ex.: modelagem analítica, mentoria de pares ou estruturação de negócios).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <h4 className="font-bold text-amber-700 dark:text-amber-300 mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  2. Estabeleça Blindagem contra Atividades de Baixo Interesse
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed">
                  Escalas com notas inferiores a 2.0 não devem se tornar sua responsabilidade central. Em sua evolução de carreira, priorize
                  delegação, automação ou parcerias complementares com colegas cujos interesses sejam exatamente opostos aos seus.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
                <h4 className="font-bold text-indigo-700 dark:text-indigo-300 mb-1 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  3. Cruzamento com Âncoras de Carreira (Assessment COMET)
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed">
                  Enquanto o CABIN revela <strong>o que você tem paixão por fazer</strong> no dia a dia (tarefas, ambientes e atividades), o instrumento Âncoras de Carreira
                  revela <strong>o que você valoriza no contrato de trabalho</strong> (autonomia, segurança, desafio ou liderança geral). A integração dessas duas lentes
                  produz um direcionamento vocacional definitivo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEÇÃO F: DIREITOS AUTORAIS E CITAÇÃO OFICIAL */}
      <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-3">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                Referência Bibliográfica & Origem Científica:
              </h4>
              <p className="font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                Su, R., Tay, L., Liao, H.-Y., Zhang, Q., & Rounds, J. (2019). Toward a dimensional model of vocational interests.
                <em> Journal of Applied Psychology</em>, 104(5), 690–714. https://doi.org/10.1037/apl0000373
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
              <strong>Aviso Obrigatório de Propriedade Intelectual:</strong> O instrumento CABIN (*Comprehensive Assessment of Basic Interests*)
              foi formulado para avanço acadêmico e pesquisa empírica pelos autores originais. A disponibilização pública de artigos científicos não
              constitui licença comercial irrestrita. Caso este módulo venha a ser disponibilizado em produtos comerciais ou soluções corporativas
              pagas, é de responsabilidade da organização obter as devidas autorizações formais junto aos autores e detentores de direitos.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CabinApp;
