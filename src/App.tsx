/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  AnchorLetter,
  CAREER_ANCHORS,
  QUESTIONS,
  Question,
  SCALE_DESCRIPTIONS,
  getSynergyAnalysis,
  ANCHOR_TUTORIAL_DATA,
} from './data';
import {
  Sun,
  Moon,
  RotateCcw,
  Share2,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Star,
  Award,
  Info,
  Briefcase,
  Cpu,
  Compass,
  ShieldCheck,
  Rocket,
  HeartHandshake,
  Target,
  SunMedium,
  BarChart3,
  Layers,
  ListChecks,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  Eye,
  SlidersHorizontal,
  BookOpen,
  Lightbulb,
  AlertTriangle,
} from 'lucide-react';

const STORAGE_KEY = 'ancora-carreira-progress-v1';
const THEME_STORAGE_KEY = 'ancora-carreira-theme';
const TOTAL_QUESTIONS = QUESTIONS.length;
const BLOCK_SIZE = 4;
const TOTAL_BLOCKS = Math.ceil(TOTAL_QUESTIONS / BLOCK_SIZE);
const BONUS_LIMIT = 3;
const BONUS_POINTS = 4;
const ANCHOR_ORDER: AnchorLetter[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const AUTO_ADVANCE_MS = 280;

export interface SampleProfile {
  id: string;
  name: string;
  roleExample: string;
  description: string;
  dominantLetter: AnchorLetter;
  secondaryLetter: AnchorLetter;
  ratings: Record<number, number>;
  bonus: number[];
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'tech-specialist',
    name: 'Especialista Técnico & Autônomo',
    roleExample: 'Tech Lead / Engenheiro Sênior / Pesquisador',
    description: 'Alta motivação por excelência técnica e domínio de ferramentas, com forte necessidade de liberdade metodológica.',
    dominantLetter: 'A',
    secondaryLetter: 'C',
    ratings: {
      1: 6, 2: 3, 3: 6, 4: 2, 5: 4, 6: 3, 7: 5, 8: 4,
      9: 6, 10: 2, 11: 5, 12: 3, 13: 4, 14: 3, 15: 4, 16: 3,
      17: 5, 18: 2, 19: 6, 20: 2, 21: 4, 22: 3, 23: 5, 24: 4,
      25: 6, 26: 2, 27: 5, 28: 2, 29: 4, 30: 3, 31: 4, 32: 3,
      33: 6, 34: 2, 35: 6, 36: 3, 37: 4, 38: 3, 39: 5, 40: 3,
    },
    bonus: [1, 9, 19],
  },
  {
    id: 'executive-leader',
    name: 'Líder Corporativo & Desafio Puro',
    roleExample: 'Diretor Geral / Head de Operações / Turnaround',
    description: 'Orientado para a gestão de grandes equipes, decisões executivas de alto impacto e conquista de metas difíceis.',
    dominantLetter: 'B',
    secondaryLetter: 'G',
    ratings: {
      1: 3, 2: 6, 3: 3, 4: 3, 5: 4, 6: 3, 7: 6, 8: 3,
      9: 2, 10: 6, 11: 3, 12: 3, 13: 4, 14: 4, 15: 6, 16: 2,
      17: 2, 18: 6, 19: 3, 20: 3, 21: 4, 22: 3, 23: 6, 24: 2,
      25: 2, 26: 6, 27: 3, 28: 4, 29: 3, 30: 3, 31: 6, 32: 2,
      33: 2, 34: 6, 35: 3, 36: 3, 37: 4, 38: 3, 39: 6, 40: 2,
    },
    bonus: [2, 10, 18],
  },
  {
    id: 'cause-lifestyle',
    name: 'Causa Social & Estilo de Vida',
    roleExample: 'Líder de Impacto / Gestor ESG / Educador',
    description: 'Pautado por valores éticos e impacto humano transformador, preservando o equilíbrio com saúde e família.',
    dominantLetter: 'F',
    secondaryLetter: 'H',
    ratings: {
      1: 3, 2: 3, 3: 4, 4: 3, 5: 3, 6: 6, 7: 4, 8: 6,
      9: 3, 10: 2, 11: 4, 12: 4, 13: 3, 14: 6, 15: 3, 16: 6,
      17: 2, 18: 2, 19: 4, 20: 4, 21: 3, 22: 6, 23: 3, 24: 6,
      25: 2, 26: 2, 27: 4, 28: 3, 29: 3, 30: 6, 31: 3, 32: 6,
      33: 3, 34: 2, 35: 4, 36: 4, 37: 3, 38: 6, 39: 3, 40: 6,
    },
    bonus: [6, 8, 30],
  },
];

interface SavedState {
  blockIndex: number;
  ratings: Record<number, number>;
  bonus: number[];
}

const safeStorage = {
  get(): SavedState | null {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set(data: SavedState): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage blocked (private mode, etc.)
    }
  },
  clear(): void {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  },
};

function isValidProgress(saved: unknown): saved is SavedState {
  if (!saved || typeof saved !== 'object') return false;
  const s = saved as Partial<SavedState>;
  return (
    typeof s.ratings === 'object' &&
    s.ratings !== null &&
    Array.isArray(s.bonus) &&
    Object.keys(s.ratings).length > 0 &&
    Object.keys(s.ratings).length <= TOTAL_QUESTIONS &&
    s.bonus.length <= BONUS_LIMIT
  );
}

function clampBlockIndex(value: unknown): number {
  const n = typeof value === 'number' && Number.isFinite(value) ? value : 0;
  return Math.min(Math.max(n, 0), TOTAL_BLOCKS);
}

function computeAverages(
  ratings: Record<number, number>,
  bonus: number[]
): Record<AnchorLetter, number> {
  const sums: Record<AnchorLetter, number> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0,
  };
  QUESTIONS.forEach((q) => {
    const base = ratings[q.number] || 0;
    const extra = bonus.includes(q.number) ? BONUS_POINTS : 0;
    sums[q.anchor] += base + extra;
  });
  const averages: Partial<Record<AnchorLetter, number>> = {};
  ANCHOR_ORDER.forEach((letter) => {
    averages[letter] = sums[letter] / 5;
  });
  return averages as Record<AnchorLetter, number>;
}

function sortAnchorsByScore(
  averages: Record<AnchorLetter, number>
): AnchorLetter[] {
  return ANCHOR_ORDER.slice().sort((a, b) => {
    if (averages[b] !== averages[a]) return averages[b] - averages[a];
    return ANCHOR_ORDER.indexOf(a) - ANCHOR_ORDER.indexOf(b);
  });
}

function AnchorIcon({
  letter,
  className = 'w-5 h-5',
}: {
  letter: AnchorLetter;
  className?: string;
}) {
  switch (letter) {
    case 'A':
      return <Cpu className={className} />;
    case 'B':
      return <Briefcase className={className} />;
    case 'C':
      return <Compass className={className} />;
    case 'D':
      return <ShieldCheck className={className} />;
    case 'E':
      return <Rocket className={className} />;
    case 'F':
      return <HeartHandshake className={className} />;
    case 'G':
      return <Target className={className} />;
    case 'H':
      return <SunMedium className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

export default function App() {
  type Screen = 'home' | 'quiz' | 'bonus' | 'result';
  type ResultTab = 'overview' | 'anchors' | 'synergy' | 'audit';

  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [screen, setScreen] = useState<Screen>('home');
  const [blockIndex, setBlockIndex] = useState<number>(0);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [bonus, setBonus] = useState<number[]>([]);
  const [savedProgress, setSavedProgress] = useState<SavedState | null>(null);
  const [resultTab, setResultTab] = useState<ResultTab>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [activeDemoId, setActiveDemoId] = useState<string>(SAMPLE_PROFILES[0].id);
  const [tutorialFilter, setTutorialFilter] = useState<'all' | 'top' | AnchorLetter>('all');
  const [expandedTutorialLetters, setExpandedTutorialLetters] = useState<Record<string, boolean>>({
    A: true,
    B: true,
    C: true,
    D: true,
    E: true,
    F: true,
    G: true,
    H: true,
  });

  const toggleTutorialCard = (letter: string) => {
    setExpandedTutorialLetters((prev) => ({
      ...prev,
      [letter]: !prev[letter],
    }));
  };

  const toggleAllTutorialCards = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    ANCHOR_ORDER.forEach((l) => {
      next[l] = expand;
    });
    setExpandedTutorialLetters(next);
  };

  const [dialog, setDialog] = useState<{
    open: boolean;
    title: string;
    body: string;
    confirmLabel?: string;
    onConfirm?: () => void;
  }>({
    open: false,
    title: '',
    body: '',
  });

  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as
      | 'light'
      | 'dark'
      | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      const initial = prefersDark ? 'dark' : 'light';
      setTheme(initial);
      document.documentElement.classList.toggle('dark', initial === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  // Check saved progress on initial load
  useEffect(() => {
    const saved = safeStorage.get();
    if (isValidProgress(saved)) {
      setSavedProgress(saved);
    }
  }, []);

  // Save progress whenever blockIndex, ratings, or bonus change (during real quiz/bonus)
  const saveCurrentProgress = (
    newBlockIndex: number,
    newRatings: Record<number, number>,
    newBonus: number[]
  ) => {
    if (isDemoMode) return;
    safeStorage.set({
      blockIndex: newBlockIndex,
      ratings: newRatings,
      bonus: newBonus,
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const openResetDialog = (onConfirm: () => void) => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setDialog({
      open: true,
      title: 'Reiniciar a avaliação?',
      body: 'Todas as suas respostas e escolhas de bônus serão apagadas. Essa ação não poderá ser desfeita.',
      confirmLabel: 'Sim, reiniciar',
      onConfirm: () => {
        setDialog((d) => ({ ...d, open: false }));
        onConfirm();
      },
    });
  };

  useEffect(() => {
    if (!dialog.open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDialog((d) => ({ ...d, open: false }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialog.open]);

  const handleStartNew = () => {
    setIsDemoMode(false);
    setBlockIndex(0);
    setRatings({});
    setBonus([]);
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResume = () => {
    if (!savedProgress) return;
    setIsDemoMode(false);
    const clampedIndex = clampBlockIndex(savedProgress.blockIndex);
    setRatings({ ...savedProgress.ratings });
    setBonus([...savedProgress.bonus]);
    setBlockIndex(clampedIndex);
    if (clampedIndex >= TOTAL_BLOCKS) {
      setScreen('bonus');
    } else {
      setScreen('quiz');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDiscardSaved = () => {
    openResetDialog(() => {
      safeStorage.clear();
      setSavedProgress(null);
      setBlockIndex(0);
      setRatings({});
      setBonus([]);
      setIsDemoMode(false);
      setScreen('home');
    });
  };

  // Load a fictitious demo profile
  const handleLoadDemo = (profileId: string) => {
    const profile =
      SAMPLE_PROFILES.find((p) => p.id === profileId) || SAMPLE_PROFILES[0];
    setIsDemoMode(true);
    setActiveDemoId(profile.id);
    setRatings({ ...profile.ratings });
    setBonus([...profile.bonus]);
    setScreen('result');
    setResultTab('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Carregado perfil de demonstração: ${profile.name}`);
  };

  // Helper functions for quiz
  const currentBlockQuestions = (): Question[] => {
    const start = blockIndex * BLOCK_SIZE;
    return QUESTIONS.slice(start, start + BLOCK_SIZE);
  };

  const isBlockComplete = (
    blockQuestions: Question[],
    currentRatings: Record<number, number>
  ): boolean => {
    return blockQuestions.every((q) => currentRatings[q.number] != null);
  };

  const handleRatingChange = (questionNumber: number, value: number) => {
    const updatedRatings = { ...ratings, [questionNumber]: value };
    setRatings(updatedRatings);

    const blockQuestions = currentBlockQuestions();
    const isComplete = isBlockComplete(blockQuestions, updatedRatings);

    saveCurrentProgress(blockIndex, updatedRatings, bonus);

    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    if (isComplete) {
      autoAdvanceTimerRef.current = setTimeout(() => {
        handleGoNext(updatedRatings);
      }, AUTO_ADVANCE_MS);
    }
  };

  const handleGoNext = (currentRatings = ratings) => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    const blockQuestions = currentBlockQuestions();
    if (!isBlockComplete(blockQuestions, currentRatings)) return;

    const nextIndex = blockIndex + 1;
    setBlockIndex(nextIndex);
    saveCurrentProgress(nextIndex, currentRatings, bonus);

    if (nextIndex >= TOTAL_BLOCKS) {
      setScreen('bonus');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (blockIndex === 0) return;
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    const prevIndex = blockIndex - 1;
    setBlockIndex(prevIndex);
    saveCurrentProgress(prevIndex, ratings, bonus);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Bonus logic
  const bonusCandidates = (): Question[] => {
    return QUESTIONS.filter((q) => (ratings[q.number] || 0) >= 4).sort(
      (a, b) => {
        const diff = (ratings[b.number] || 0) - (ratings[a.number] || 0);
        if (diff !== 0) return diff;
        return a.number - b.number;
      }
    );
  };

  const toggleBonus = (questionNumber: number, requiredBonus: number) => {
    let nextBonus = [...bonus];
    const idx = nextBonus.indexOf(questionNumber);
    if (idx >= 0) {
      nextBonus.splice(idx, 1);
    } else if (nextBonus.length < requiredBonus) {
      nextBonus.push(questionNumber);
    } else {
      showToast(`Você já selecionou o limite de ${requiredBonus} afirmações.`);
      return;
    }
    setBonus(nextBonus);
    saveCurrentProgress(blockIndex, ratings, nextBonus);
  };

  const handleFinishBonus = () => {
    const candidates = bonusCandidates();
    const requiredBonus = Math.min(BONUS_LIMIT, candidates.length);
    if (bonus.length !== requiredBonus) {
      showToast(`Por favor selecione exatamente ${requiredBonus} afirmações.`);
      return;
    }
    if (!isDemoMode) {
      safeStorage.clear();
      setSavedProgress(null);
    }
    setScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromBonus = () => {
    const lastBlockIndex = TOTAL_BLOCKS - 1;
    setBlockIndex(lastBlockIndex);
    saveCurrentProgress(lastBlockIndex, ratings, bonus);
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Share and export handlers
  const handleShare = async (
    dominant: AnchorLetter,
    secondary: AnchorLetter | undefined,
    averages: Record<AnchorLetter, number>
  ) => {
    const shareText = `🎯 Meu Resultado nas Âncoras de Carreira (Edgar Schein):\n• Âncora Dominante: ${
      CAREER_ANCHORS[dominant].name
    } (${averages[dominant].toFixed(1)}/10)\n${
      secondary && averages[secondary] !== averages[dominant]
        ? `• Âncora Secundária: ${CAREER_ANCHORS[secondary].name} (${averages[
            secondary
          ].toFixed(1)}/10)\n`
        : ''
    }\nDescubra suas âncoras profissionais de forma 100% gratuita!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu relatório de Âncoras de Carreira',
          text: shareText,
        });
        return;
      } catch (err: unknown) {
        if (
          err &&
          typeof err === 'object' &&
          'name' in err &&
          err.name === 'AbortError'
        ) {
          return;
        }
      }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(shareText);
        showToast('Resumo copiado para a área de transferência!');
        return;
      } catch {
        // Fallback to prompt
      }
    }
    window.prompt('Copie seu resultado:', shareText);
  };

  const handleCopyFullReport = (
    dominant: AnchorLetter,
    secondary: AnchorLetter | undefined,
    averages: Record<AnchorLetter, number>,
    sortedLetters: AnchorLetter[]
  ) => {
    const synergy = getSynergyAnalysis(dominant, secondary);
    const text = `=========================================
RELATÓRIO DE ÂNCORAS DE CARREIRA
Metodologia: Edgar Schein (MIT Sloan / CEFET-MG)
=========================================

1. ÂNCORA DOMINANTE:
${dominant} - ${CAREER_ANCHORS[dominant].name} (Média: ${averages[dominant].toFixed(
      1
    )})
"${CAREER_ANCHORS[dominant].summary}"

${
  secondary && averages[secondary] !== averages[dominant]
    ? `2. ÂNCORA SECUNDÁRIA:
${secondary} - ${CAREER_ANCHORS[secondary].name} (Média: ${averages[
        secondary
      ].toFixed(1)})
"${CAREER_ANCHORS[secondary].summary}"\n`
    : ''
}
3. ANÁLISE DE SINERGIA:
${synergy.profileTitle}
${synergy.summary}

Recomendações Práticas:
${synergy.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

4. RANKING COMPLETO DAS 8 ÂNCORAS:
${sortedLetters
  .map(
    (l, idx) =>
      `#${idx + 1} [${l}] ${CAREER_ANCHORS[l].name.padEnd(36, ' ')} : ${averages[
        l
      ].toFixed(1)} pts`
  )
  .join('\n')}

=========================================
Relatório confidencial gerado com base no instrumento de 40 afirmações.
`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Relatório completo copiado!');
      });
    } else {
      window.prompt('Copie o relatório:', text);
    }
  };

  // Keyboard shortcut for quiz numbers (1 to 6)
  useEffect(() => {
    if (screen !== 'quiz') return;
    const handleKey = (e: KeyboardEvent) => {
      const val = parseInt(e.key, 10);
      if (val >= 1 && val <= 6) {
        const blockQuestions = currentBlockQuestions();
        const unanswered = blockQuestions.find((q) => ratings[q.number] == null);
        if (unanswered) {
          handleRatingChange(unanswered.number, val);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [screen, blockIndex, ratings]);

  const totalAnswered = Object.keys(ratings).length;

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === 'dark' ? 'dark' : ''
      }`}
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* GLOBAL TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl border border-slate-700/40 text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 no-print"
        style={{
          backgroundColor:
            theme === 'dark' ? 'rgba(11, 15, 25, 0.85)' : 'rgba(248, 250, 252, 0.88)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => {
              if (screen !== 'home') {
                openResetDialog(() => {
                  setIsDemoMode(false);
                  setScreen('home');
                });
              }
            }}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm transition-transform group-hover:scale-105"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              ⚓
            </div>
            <div>
              <div className="font-semibold text-base tracking-tight flex items-center gap-2">
                <span>Âncoras de Carreira</span>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full border border-indigo-500/20 text-indigo-500 bg-indigo-500/10">
                  Edgar Schein
                </span>
                {isDemoMode && (
                  <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    Modo Exemplo Fictício
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Inventário Psicométrico Profissional
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            {screen === 'quiz' && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)',
                }}
              >
                <span>Bloco {blockIndex + 1}/10</span>
                <span className="opacity-40">•</span>
                <span>{Math.round((totalAnswered / TOTAL_QUESTIONS) * 100)}%</span>
              </div>
            )}

            {/* Quick Demo Test Access from header */}
            {screen === 'home' && (
              <button
                onClick={() => handleLoadDemo(SAMPLE_PROFILES[0].id)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Ver Exemplo Pronto</span>
              </button>
            )}

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
              title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
              className="p-2.5 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)',
              }}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Quick Restart if in Quiz */}
            {(screen === 'quiz' || screen === 'bonus') && (
              <button
                onClick={() =>
                  openResetDialog(() => {
                    setBlockIndex(0);
                    setRatings({});
                    setBonus([]);
                    safeStorage.clear();
                    setSavedProgress(null);
                    setScreen('home');
                  })
                }
                title="Reiniciar avaliação"
                className="p-2.5 rounded-xl border text-xs font-medium transition-all duration-200 hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-900 cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-muted)',
                }}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* ===================== HOME SCREEN ===================== */}
        {screen === 'home' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* HERO */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autoconhecimento Profissional</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Descubra suas{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  Âncoras de Carreira
                </span>
              </h1>
              <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                Formulada por Edgar Schein na Sloan School of Management (MIT), a
                teoria das âncoras revela os valores nucleares e motivações
                profissionais dos quais você jamais abriria mão em um momento de
                decisão.
              </p>
            </div>

            {/* ACTION CARD (RESUME OR START) */}
            <div className="max-w-xl mx-auto space-y-4">
              {savedProgress ? (
                <div
                  className="rounded-2xl p-6 sm:p-8 border shadow-lg transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-indigo-500 mb-1">
                        Progresso Salvo
                      </div>
                      <h2 className="text-xl font-bold">Continuar de onde parou?</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Você já respondeu{' '}
                        <strong className="text-slate-900 dark:text-slate-100">
                          {Object.keys(savedProgress.ratings).length}
                        </strong>{' '}
                        de {TOTAL_QUESTIONS} afirmações (Bloco{' '}
                        {clampBlockIndex(savedProgress.blockIndex) + 1} de 10).
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-500 flex-shrink-0">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mb-6">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.round(
                          (Object.keys(savedProgress.ratings).length /
                            TOTAL_QUESTIONS) *
                            100
                        )}%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleResume}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md hover:shadow-indigo-500/25 active:scale-98 cursor-pointer"
                    >
                      <span>Continuar Avaliação</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleDiscardSaved}
                      className="px-4 py-3 rounded-xl font-medium text-sm text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                    >
                      Recomeçar do zero
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="rounded-2xl p-6 sm:p-8 border shadow-lg text-center space-y-5"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="flex justify-center items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 40 Afirmações
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> ~7 Minutos
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Gratuito
                    </span>
                  </div>

                  <button
                    onClick={handleStartNew}
                    className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-bold text-base text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 shadow-lg hover:shadow-indigo-500/30 active:scale-98 cursor-pointer"
                  >
                    <span>Iniciar Avaliação de Carreira</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Seus dados são processados exclusivamente no seu navegador e não
                    são enviados para nenhum servidor externo.
                  </p>
                </div>
              )}

              {/* DEMO PROFILE CALLOUT BANNER */}
              <div
                className="rounded-2xl p-5 border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5"
                style={{
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        Quer ver um teste pronto fictício?
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-indigo-500/10 text-indigo-500">
                        Instantâneo
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Explore um relatório completo com gráficos, sinergias e todas as 40 afirmações preenchidas.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleLoadDemo(SAMPLE_PROFILES[0].id)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-slate-700/60 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Eye className="w-4 h-4 text-indigo-500" />
                    <span>Ver Relatório Pronto</span>
                  </button>
                </div>
              </div>

              {/* Quick Persona Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="text-[11px] font-medium text-slate-400">Exemplos disponíveis:</span>
                {SAMPLE_PROFILES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleLoadDemo(p.id)}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium border hover:border-indigo-500 hover:text-indigo-500 transition-colors cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    {p.name.split('&')[0]} ({p.dominantLetter})
                  </button>
                ))}
              </div>
            </div>

            {/* HOW IT WORKS SECTION */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">
                  Como funciona o inventário
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Metodologia oficial de 3 fases
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className="p-5 rounded-2xl border flex flex-col justify-between"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="space-y-2">
                    <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    <h3 className="font-semibold text-base">40 Afirmações</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Responda em 10 blocos práticos de 4 perguntas, pontuando de 1
                      (nunca é verdade) a 6 (sempre é verdade) com avanço automático.
                    </p>
                  </div>
                </div>

                <div
                  className="p-5 rounded-2xl border flex flex-col justify-between"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="space-y-2">
                    <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                    <h3 className="font-semibold text-base">Bônus dos 3 Pilares</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Revise suas afirmações com notas mais altas (≥4) e marque as 3
                      mais verdadeiras para você, que recebem +4 pontos de bonificação.
                    </p>
                  </div>
                </div>

                <div
                  className="p-5 rounded-2xl border flex flex-col justify-between"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="space-y-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
                      3
                    </span>
                    <h3 className="font-semibold text-base">Relatório Executivo</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Visualize seu ranking de âncoras, âncora dominante e
                      secundária, análise de sinergia e perguntas para entrevistas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* THE 8 ANCHORS PREVIEW */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    Os 8 Pilares de Edgar Schein
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Passe o mouse ou toque para conferir a essência de cada âncora
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {ANCHOR_ORDER.map((letter) => {
                  const anchor = CAREER_ANCHORS[letter];
                  return (
                    <div
                      key={letter}
                      className="p-4 rounded-2xl border transition-all duration-200 hover:border-indigo-500/40 hover:-translate-y-0.5 group flex flex-col justify-between"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-semibold text-xs border border-slate-200 dark:border-slate-700">
                            {letter}
                          </span>
                          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            {anchor.badge}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm leading-snug group-hover:text-indigo-500 transition-colors">
                          {anchor.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {anchor.summary}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===================== QUIZ SCREEN ===================== */}
        {screen === 'quiz' && (() => {
          const blockQuestions = currentBlockQuestions();
          const isFirstBlock = blockIndex === 0;
          const isLastBlock = blockIndex + 1 >= TOTAL_BLOCKS;
          const percentDone = Math.round((blockIndex / TOTAL_BLOCKS) * 100);
          const blockComplete = isBlockComplete(blockQuestions, ratings);
          const answeredInCurrent = blockQuestions.filter(
            (q) => ratings[q.number] != null
          ).length;

          return (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* BLOCK STEPPER BAR */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-500 uppercase tracking-wider font-bold">
                      Bloco {blockIndex + 1} de {TOTAL_BLOCKS}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500 dark:text-slate-400 font-normal">
                      {answeredInCurrent} de {BLOCK_SIZE} respondidas
                    </span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400">
                    {percentDone}% concluído
                  </span>
                </div>

                {/* Stepper Dots / Bars */}
                <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
                  {Array.from({ length: TOTAL_BLOCKS }).map((_, i) => {
                    const isDone = i < blockIndex;
                    const isCurrent = i === blockIndex;
                    return (
                      <div
                        key={i}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isDone
                            ? 'bg-indigo-500'
                            : isCurrent
                            ? 'bg-indigo-400 ring-2 ring-indigo-500/30'
                            : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* HELPER SCALE BANNER */}
              <div
                className="p-3.5 sm:p-4 rounded-xl border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                  <HelpCircle className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span>Escala de 1 a 6: o quanto cada afirmação reflete sua verdade?</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-medium">1</span> Nunca
                  <span>→</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-medium">3</span> Ocasionalmente
                  <span>→</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-medium">6</span> Sempre
                </div>
              </div>

              {/* QUESTIONS LIST */}
              <div className="space-y-4">
                {blockQuestions.map((q) => {
                  const currentRating = ratings[q.number];
                  return (
                    <div
                      key={q.number}
                      className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 ${
                        currentRating != null
                          ? 'border-indigo-500/30 dark:border-indigo-500/20'
                          : ''
                      }`}
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor:
                          currentRating != null
                            ? undefined
                            : 'var(--border-color)',
                      }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            Afirmação {q.number} de {TOTAL_QUESTIONS}
                          </span>
                          {currentRating != null && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <Check className="w-3 h-3" /> Respondida
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-base sm:text-lg font-medium leading-relaxed mb-6 text-slate-800 dark:text-slate-100">
                        {q.text}
                      </p>

                      {/* Tactile Rating Selector 1 to 6 */}
                      <div className="grid grid-cols-6 gap-1.5 sm:gap-2.5">
                        {[1, 2, 3, 4, 5, 6].map((val) => {
                          const isSelected = currentRating === val;
                          const desc = SCALE_DESCRIPTIONS[val];
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleRatingChange(q.number, val)}
                              className={`group relative flex flex-col items-center justify-center py-2.5 sm:py-3.5 px-1 rounded-xl sm:rounded-2xl border text-sm sm:text-base font-bold transition-all duration-150 cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25 scale-102 ring-2 ring-indigo-400/40'
                                  : 'hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-300 dark:hover:border-indigo-700/50 text-slate-700 dark:text-slate-200'
                              }`}
                              style={{
                                borderColor: isSelected
                                  ? undefined
                                  : 'var(--border-color)',
                                backgroundColor: isSelected
                                  ? undefined
                                  : 'var(--bg-surface-elevated)',
                              }}
                              title={`${val} - ${desc.label}: ${desc.detail}`}
                            >
                              <span>{val}</span>
                              <span
                                className={`text-[9px] sm:text-[10px] font-normal truncate max-w-full hidden sm:block ${
                                  isSelected
                                    ? 'text-indigo-100'
                                    : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-500'
                                }`}
                              >
                                {val === 1
                                  ? 'Nunca'
                                  : val === 6
                                  ? 'Sempre'
                                  : desc.label.slice(0, 7)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* NAVIGATION CONTROLS */}
              <div className="flex items-center justify-between pt-4 border-t no-print"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <button
                  type="button"
                  onClick={handleGoBack}
                  disabled={isFirstBlock}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      openResetDialog(() => {
                        setBlockIndex(0);
                        setRatings({});
                        setBonus([]);
                        safeStorage.clear();
                        setSavedProgress(null);
                        setScreen('home');
                      })
                    }
                    className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    Reiniciar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGoNext()}
                    disabled={!blockComplete}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-indigo-500/25 active:scale-98 cursor-pointer"
                  >
                    <span>{isLastBlock ? 'Ir para Revisão de Bônus' : 'Próximo Bloco'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ===================== BONUS STEP SCREEN ===================== */}
        {screen === 'bonus' && (() => {
          const candidates = bonusCandidates();
          const requiredBonus = Math.min(BONUS_LIMIT, candidates.length);
          const isSatisfied = bonus.length === requiredBonus;

          return (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* BONUS HEADER */}
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>Etapa Final • Bônus de Pontuação</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Selecione as {requiredBonus} afirmações mais verdadeiras
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {candidates.length === 0
                    ? 'Nenhuma afirmação recebeu nota 4 ou mais. Você pode avançar direto para o resultado!'
                    : `Segundo o instrumento original de Edgar Schein, localize entre as afirmações com nota 4 ou mais aquelas que são os pilares mais autênticos da sua carreira. Cada uma receberá +4 pontos de bonificação.`}
                </p>
              </div>

              {/* BONUS COUNTER STICKY BADGE */}
              {candidates.length > 0 && (
                <div
                  className="sticky top-20 z-30 p-3 sm:p-4 rounded-xl border backdrop-blur-md shadow-md flex items-center justify-between"
                  style={{
                    backgroundColor:
                      theme === 'dark'
                        ? 'rgba(19, 25, 41, 0.92)'
                        : 'rgba(255, 255, 255, 0.92)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Star
                      className={`w-5 h-5 ${
                        isSatisfied
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-slate-400'
                      }`}
                    />
                    <span className="text-sm font-semibold">
                      Bônus selecionados: {bonus.length} de {requiredBonus}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      isSatisfied
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {isSatisfied
                      ? '✓ Meta atingida'
                      : `Faltam ${requiredBonus - bonus.length}`}
                  </span>
                </div>
              )}

              {/* CANDIDATES LIST */}
              <div className="space-y-3">
                {candidates.map((q) => {
                  const rating = ratings[q.number];
                  const isMarked = bonus.includes(q.number);
                  const isMaxedOut = !isMarked && bonus.length >= requiredBonus;

                  return (
                    <div
                      key={q.number}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isMarked
                          ? 'border-amber-500/40 bg-amber-50/20 dark:bg-amber-950/10 shadow-sm'
                          : ''
                      }`}
                      style={{
                        backgroundColor: isMarked
                          ? undefined
                          : 'var(--bg-surface)',
                        borderColor: isMarked ? undefined : 'var(--border-color)',
                      }}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-500">
                            Afirmação {q.number}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            Nota dada: {rating}/6
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {CAREER_ANCHORS[q.anchor].name}
                          </span>
                        </div>
                        <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100">
                          {q.text}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleBonus(q.number, requiredBonus)}
                        disabled={isMaxedOut}
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
                          isMarked
                            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 hover:bg-amber-600'
                            : isMaxedOut
                            ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
                            : 'border border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                        }`}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            isMarked ? 'fill-current' : ''
                          }`}
                        />
                        <span>{isMarked ? '★ +4 Bônus Ativo' : 'Marcar +4 Bônus'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* BONUS NAVIGATION */}
              <div className="flex items-center justify-between pt-6 border-t no-print"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <button
                  type="button"
                  onClick={handleBackFromBonus}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar às perguntas</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinishBonus}
                  disabled={!isSatisfied}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-indigo-500/30 cursor-pointer"
                >
                  <span>Ver Meu Relatório Completo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })()}

        {/* ===================== RESULT REPORT SCREEN ===================== */}
        {screen === 'result' && (() => {
          const averages = computeAverages(ratings, bonus);
          const sortedLetters = sortAnchorsByScore(averages);
          const dominant = sortedLetters[0];
          const secondary = sortedLetters[1];
          const hasSecondary =
            secondary && averages[secondary] !== averages[dominant];
          const synergy = getSynergyAnalysis(dominant, secondary);
          const currentDemoProfile = SAMPLE_PROFILES.find((p) => p.id === activeDemoId);

          return (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* DEMO NOTICE BANNER (if in demo mode) */}
              {isDemoMode && (
                <div
                  className="p-4 sm:p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-amber-500/10 border-amber-500/30 no-print"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                          Modo Demonstração Fictício Ativo
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                          {currentDemoProfile?.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        {currentDemoProfile?.description} Você pode alternar entre os perfis fictícios abaixo ou iniciar sua avaliação pessoal a qualquer instante.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    {/* Profile switcher pills */}
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/50 dark:bg-slate-800/80 border border-slate-300/40 dark:border-slate-700/50 text-xs">
                      {SAMPLE_PROFILES.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleLoadDemo(p.id)}
                          className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                            activeDemoId === p.id
                              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {p.dominantLetter}+{p.secondaryLetter}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleStartNew}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Fazer Meu Teste Real</span>
                    </button>
                  </div>
                </div>
              )}

              {/* REPORT HERO BANNER */}
              <div
                className="rounded-3xl p-6 sm:p-8 border shadow-xl relative overflow-hidden"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                }}
              >
                {/* Subtle background glow */}
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/40">
                      <Award className="w-3.5 h-3.5" />
                      <span>{isDemoMode ? 'Relatório Demonstrativo' : 'Diagnóstico Concluído'}</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                      Seu Relatório de Âncoras
                    </h1>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50">
                        <AnchorIcon
                          letter={dominant}
                          className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                        />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 block">
                            Âncora Dominante
                          </span>
                          <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                            {CAREER_ANCHORS[dominant].name} ({averages[dominant].toFixed(1)})
                          </span>
                        </div>
                      </div>

                      {hasSecondary && (
                        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50">
                          <AnchorIcon
                            letter={secondary}
                            className="w-5 h-5 text-purple-600 dark:text-purple-400"
                          />
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500 block">
                              Âncora Secundária
                            </span>
                            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                              {CAREER_ANCHORS[secondary].name} ({averages[secondary].toFixed(1)})
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ACTION TOOLBAR */}
                  <div className="flex flex-wrap gap-2.5 no-print w-full md:w-auto">
                    <button
                      type="button"
                      onClick={() =>
                        handleShare(dominant, secondary, averages)
                      }
                      className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-surface-elevated)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      <Share2 className="w-4 h-4 text-indigo-500" />
                      <span>Compartilhar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopyFullReport(
                          dominant,
                          secondary,
                          averages,
                          sortedLetters
                        )
                      }
                      className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-surface-elevated)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      <Copy className="w-4 h-4 text-indigo-500" />
                      <span>Copiar Texto</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md hover:shadow-indigo-500/25 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Imprimir / PDF</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* REPORT NAVIGATION TABS */}
              <div className="flex items-center gap-2 border-b overflow-x-auto no-print pb-px"
                style={{ borderColor: 'var(--border-color)' }}
              >
                {[
                  {
                    id: 'overview',
                    label: 'Visão Geral & Ranking',
                    icon: <BarChart3 className="w-4 h-4" />,
                  },
                  {
                    id: 'anchors',
                    label: 'As 8 Âncoras Detalhadas',
                    icon: <Layers className="w-4 h-4" />,
                  },
                  {
                    id: 'synergy',
                    label: 'Análise de Sinergia & Carreira',
                    icon: <Sparkles className="w-4 h-4" />,
                  },
                  {
                    id: 'audit',
                    label: 'Auditoria de Respostas (40)',
                    icon: <ListChecks className="w-4 h-4" />,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setResultTab(tab.id as ResultTab)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-t-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                      resultTab === tab.id
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20'
                        : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* ================= TAB 1: VISÃO GERAL & RANKING ================= */}
              {resultTab === 'overview' && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  {/* Dominant Highlight Box */}
                  <div
                    className="p-6 sm:p-7 rounded-2xl border"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center flex-shrink-0">
                        <AnchorIcon letter={dominant} className="w-6 h-6" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                            Pilar Predominante • Âncora {dominant}
                          </span>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500">
                            Média {averages[dominant].toFixed(1)} / 10
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold">
                          {CAREER_ANCHORS[dominant].name}
                        </h2>
                        <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                          {CAREER_ANCHORS[dominant].description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* VISUAL RANKING BARS */}
                  <div
                    className="p-6 sm:p-7 rounded-2xl border space-y-6"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div>
                      <h3 className="text-lg font-bold">
                        Hierarquia das 8 Âncoras no seu Perfil
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Ordenadas da maior média para a menor. Pontuações calculadas
                        incluindo o bônus de +4 pontos distribuídos.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {sortedLetters.map((letter, index) => {
                        const anchor = CAREER_ANCHORS[letter];
                        const score = averages[letter];
                        const percentage = Math.round((score / 10) * 100);
                        const isDominant = letter === dominant;
                        const isSecondary = letter === secondary && hasSecondary;

                        return (
                          <div key={letter} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-400 text-xs w-4">
                                  #{index + 1}
                                </span>
                                <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                                  {letter}
                                </span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                  {anchor.name}
                                </span>
                                {isDominant && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500">
                                    Dominante
                                  </span>
                                )}
                                {isSecondary && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500">
                                    Secundária
                                  </span>
                                )}
                              </div>
                              <span className="font-mono font-bold text-sm">
                                {score.toFixed(1)} pts
                              </span>
                            </div>

                            {/* Bar Track */}
                            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden relative">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isDominant
                                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-sm'
                                    : isSecondary
                                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                                    : score >= 4.0
                                    ? 'bg-slate-400 dark:bg-slate-600'
                                    : 'bg-slate-300 dark:bg-slate-700'
                                }`}
                                style={{ width: `${Math.max(percentage, 5)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* MINI TUTORIAL: ENTENDA CADA ÂNCORA (PARA LEIGO ENTENDER) */}
                  <div
                    className="p-6 sm:p-7 rounded-2xl border space-y-6"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/40">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Mini Tutorial Descomplicado</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                          O Que É Cada Âncora, Pelo Que É Responsável e Como Adquiri-la
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                          Um guia simples e direto ao ponto para qualquer pessoa leiga entender o que cada âncora faz, qual papel cumpre e como desenvolvê-la no dia a dia.
                        </p>
                      </div>

                      {/* Expand / Collapse All buttons */}
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <button
                          type="button"
                          onClick={() => toggleAllTutorialCards(true)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-600 dark:text-slate-300"
                          style={{ borderColor: 'var(--border-color)' }}
                        >
                          Expandir Tudo
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAllTutorialCards(false)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-600 dark:text-slate-300"
                          style={{ borderColor: 'var(--border-color)' }}
                        >
                          Recolher Tudo
                        </button>
                      </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-[11px] font-medium text-slate-400 mr-1">Filtrar:</span>
                      <button
                        type="button"
                        onClick={() => setTutorialFilter('all')}
                        className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                          tutorialFilter === 'all'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                        style={{
                          borderColor:
                            tutorialFilter === 'all'
                              ? undefined
                              : 'var(--border-color)',
                        }}
                      >
                        Todas as 8
                      </button>
                      <button
                        type="button"
                        onClick={() => setTutorialFilter('top')}
                        className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                          tutorialFilter === 'top'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                        style={{
                          borderColor:
                            tutorialFilter === 'top'
                              ? undefined
                              : 'var(--border-color)',
                        }}
                      >
                        Suas Principais ({dominant}
                        {hasSecondary ? ` e ${secondary}` : ''})
                      </button>
                      {sortedLetters.map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setTutorialFilter(l)}
                          className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                            tutorialFilter === l
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                          }`}
                          style={{
                            borderColor:
                              tutorialFilter === l
                                ? undefined
                                : 'var(--border-color)',
                          }}
                        >
                          {l}
                        </button>
                      ))}
                    </div>

                    {/* Anchor Cards Grid / List */}
                    <div className="space-y-4">
                      {sortedLetters
                        .filter((letter) => {
                          if (tutorialFilter === 'all') return true;
                          if (tutorialFilter === 'top')
                            return letter === dominant || letter === secondary;
                          return letter === tutorialFilter;
                        })
                        .map((letter) => {
                          const tutorial = ANCHOR_TUTORIAL_DATA[letter];
                          const score = averages[letter];
                          const isDominant = letter === dominant;
                          const isSecondary = letter === secondary && hasSecondary;
                          const isExpanded =
                            expandedTutorialLetters[letter] ?? true;

                          return (
                            <div
                              key={letter}
                              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                                isDominant
                                  ? 'border-indigo-500/50 bg-indigo-50/10 dark:bg-indigo-950/10 shadow-sm'
                                  : isSecondary
                                  ? 'border-purple-500/40 bg-purple-50/10 dark:bg-purple-950/10'
                                  : ''
                              }`}
                              style={{
                                backgroundColor:
                                  isDominant || isSecondary
                                    ? undefined
                                    : 'var(--bg-surface-elevated)',
                                borderColor:
                                  isDominant || isSecondary
                                    ? undefined
                                    : 'var(--border-color)',
                              }}
                            >
                              {/* Clickable Header for Accordion */}
                              <button
                                type="button"
                                onClick={() => toggleTutorialCard(letter)}
                                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-slate-500/5 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm ${
                                      isDominant
                                        ? 'bg-indigo-600 text-white'
                                        : isSecondary
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                                    }`}
                                  >
                                    <AnchorIcon
                                      letter={letter}
                                      className="w-5 h-5"
                                    />
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-bold text-base text-slate-900 dark:text-slate-100">
                                        Âncora {letter} — {tutorial.title}
                                      </span>
                                      {isDominant && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                                          ★ Sua Dominante
                                        </span>
                                      )}
                                      {isSecondary && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                                          Secundária
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                      {tutorial.badge} • Sua pontuação:{' '}
                                      <strong className="text-indigo-600 dark:text-indigo-400 font-mono">
                                        {score.toFixed(1)} / 10
                                      </strong>
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0 text-slate-400">
                                  <span className="text-xs hidden sm:inline-block font-medium">
                                    {isExpanded ? 'Ocultar' : 'Ver tutorial'}
                                  </span>
                                  {isExpanded ? (
                                    <ChevronDown className="w-5 h-5 transition-transform" />
                                  ) : (
                                    <ChevronRight className="w-5 h-5 transition-transform" />
                                  )}
                                </div>
                              </button>

                              {/* Expanded Content */}
                              {isExpanded && (
                                <div
                                  className="px-4 sm:px-6 pb-6 pt-2 space-y-4 border-t text-xs sm:text-sm"
                                  style={{
                                    borderColor: 'var(--border-color)',
                                  }}
                                >
                                  {/* 1. Em Linguagem Simples */}
                                  <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-800/40">
                                    <div className="flex items-start gap-2.5">
                                      <Lightbulb className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                                      <div>
                                        <span className="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-300 block mb-1">
                                          Em palavras simples (Para qualquer pessoa entender):
                                        </span>
                                        <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                                          "{tutorial.simpleMeaning}"
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* 2. Pelo que é Responsável */}
                                  <div className="space-y-1">
                                    <span className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                      <Target className="w-3.5 h-3.5 text-indigo-500" />
                                      Pelo que esta âncora é responsável?
                                    </span>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
                                      {tutorial.responsibility}
                                    </p>
                                  </div>

                                  {/* 3. O que fazer para Adquirir / Desenvolver */}
                                  <div className="space-y-2">
                                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      O que fazer para desenvolver ou adquirir essa âncora:
                                    </span>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                                      {tutorial.howToAcquire.map(
                                        (item, aIdx) => (
                                          <li
                                            key={aIdx}
                                            className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 flex items-start gap-2 text-xs"
                                          >
                                            <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                                              {aIdx + 1}
                                            </span>
                                            <span className="text-slate-700 dark:text-slate-300 leading-snug">
                                              {item}
                                            </span>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>

                                  {/* 4. Exemplo na vida real & Sinal de alerta */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
                                      <span className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                        <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                                        Exemplo prático do dia a dia:
                                      </span>
                                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {tutorial.realLifeExample}
                                      </p>
                                    </div>

                                    <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 space-y-1">
                                      <span className="font-bold text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        Sinal de alerta (Se estiver no lugar errado):
                                      </span>
                                      <p className="text-xs text-rose-700/80 dark:text-rose-300/80 leading-relaxed">
                                        {tutorial.warningSign}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* SUMMARY COMPARISON TABLE */}
                  <div
                    className="p-6 rounded-2xl border space-y-4"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <h3 className="text-base font-bold">Tabela Resumo de Afinidade</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b text-xs uppercase tracking-wider text-slate-400"
                            style={{ borderColor: 'var(--border-color)' }}
                          >
                            <th className="pb-3 font-semibold">Posição</th>
                            <th className="pb-3 font-semibold">Letra</th>
                            <th className="pb-3 font-semibold">Nome da Âncora</th>
                            <th className="pb-3 font-semibold">Classificação</th>
                            <th className="pb-3 font-semibold text-right">Média Final</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                          {sortedLetters.map((letter, idx) => {
                            const score = averages[letter];
                            const anchor = CAREER_ANCHORS[letter];
                            const level =
                              idx === 0
                                ? 'Primária (Forte)'
                                : idx === 1
                                ? 'Secundária (Ativa)'
                                : score >= 3.5
                                ? 'Moderada'
                                : 'Baixa Afinidade';

                            return (
                              <tr key={letter} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                <td className="py-3 font-mono text-xs text-slate-400">
                                  #{idx + 1}
                                </td>
                                <td className="py-3 font-bold">{letter}</td>
                                <td className="py-3 font-medium text-slate-900 dark:text-slate-100">
                                  {anchor.name}
                                </td>
                                <td className="py-3 text-xs text-slate-500 dark:text-slate-400">
                                  {level}
                                </td>
                                <td className="py-3 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                  {score.toFixed(1)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 2: AS 8 ÂNCORAS DETALHADAS ================= */}
              {resultTab === 'anchors' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold">
                      Guia Completo das 8 Âncoras no seu Perfil
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Entenda como cada pilar se manifesta na sua carreira e que
                      ambientes favorecem ou prejudicam seu desempenho.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {sortedLetters.map((letter, idx) => {
                      const anchor = CAREER_ANCHORS[letter];
                      const score = averages[letter];
                      const isDominant = letter === dominant;

                      return (
                        <div
                          key={letter}
                          className={`p-6 rounded-2xl border transition-all duration-200 ${
                            isDominant
                              ? 'border-indigo-500/50 ring-1 ring-indigo-500/20'
                              : ''
                          }`}
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: isDominant ? undefined : 'var(--border-color)',
                          }}
                        >
                          {/* Anchor Header */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-500 flex items-center justify-center flex-shrink-0">
                                <AnchorIcon letter={letter} className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                    #{idx + 1} • Âncora {letter}
                                  </span>
                                  <span className="text-xs font-medium text-slate-400">
                                    {anchor.badge}
                                  </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                  {anchor.name}
                                </h3>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">Média:</span>
                              <span className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">
                                {score.toFixed(1)} / 10
                              </span>
                            </div>
                          </div>

                          {/* Schein's Official Definition */}
                          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 mb-5">
                            {anchor.description}
                          </p>

                          {/* Deep breakdown grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t"
                            style={{ borderColor: 'var(--border-color)' }}
                          >
                            <div className="space-y-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5" /> O que te motiva
                              </span>
                              <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300 list-disc list-inside">
                                {anchor.motivators.map((mot, mIdx) => (
                                  <li key={mIdx}>{mot}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                                <RotateCcw className="w-3.5 h-3.5" /> Fatores Desmotivadores
                              </span>
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                {anchor.demotivators}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5" /> Ambiente de Trabalho Ideal
                              </span>
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                {anchor.idealEnvironment}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" /> Dica de Desenvolvimento
                              </span>
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                {anchor.careerTip}
                              </p>
                            </div>
                          </div>

                          {/* Interview Question */}
                          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border text-xs"
                            style={{ borderColor: 'var(--border-color)' }}
                          >
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              💡 Pergunta recomendada para você fazer em entrevistas:
                            </span>{' '}
                            <span className="italic text-slate-600 dark:text-slate-400">
                              "{anchor.interviewQuestion}"
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ================= TAB 3: ANÁLISE DE SINERGIA ================= */}
              {resultTab === 'synergy' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div
                    className="p-6 sm:p-8 rounded-3xl border shadow-sm space-y-6"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Perfil Integrado de Carreira</span>
                      </div>
                      <h2 className="text-2xl font-bold tracking-tight">
                        {synergy.profileTitle}
                      </h2>
                      <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                        {synergy.summary}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
                      <h3 className="font-bold text-sm text-indigo-900 dark:text-indigo-200">
                        Recomendações Práticas para suas Próximas Decisões:
                      </h3>
                      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        {synergy.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Decision Checklist */}
                    <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                      <h3 className="text-base font-bold">
                        Checklist: Como Avaliar uma Proposta de Emprego
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 rounded-xl border flex items-start gap-2.5"
                          style={{ borderColor: 'var(--border-color)' }}
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>
                            <strong>Alinhamento com {CAREER_ANCHORS[dominant].name}:</strong> A
                            vaga atende o seu motivador principal sem tentar distorcê-lo?
                          </span>
                        </div>

                        {hasSecondary && (
                          <div className="p-3.5 rounded-xl border flex items-start gap-2.5"
                            style={{ borderColor: 'var(--border-color)' }}
                          >
                            <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                            <span>
                              <strong>Compatibilidade com {CAREER_ANCHORS[secondary].name}:</strong> O
                              dia a dia dá espaço para suas necessidades secundárias?
                            </span>
                          </div>
                        )}

                        <div className="p-3.5 rounded-xl border flex items-start gap-2.5"
                          style={{ borderColor: 'var(--border-color)' }}
                        >
                          <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                          <span>
                            <strong>Cultura da Empresa:</strong> As lideranças compreendem o
                            valor da sua âncora ou exigem padrões opostos?
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl border flex items-start gap-2.5"
                          style={{ borderColor: 'var(--border-color)' }}
                        >
                          <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <span>
                            <strong>Crescimento a Longo Prazo:</strong> Existe um caminho de
                            carreira que mantém você motivado nos próximos 3 a 5 anos?
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 4: AUDITORIA DE RESPOSTAS ================= */}
              {resultTab === 'audit' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold">Auditoria de Respostas</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Veja todas as 40 afirmações respondidas agrupadas pelas 8
                      âncoras, comprovando a fórmula oficial: Média = (Soma das 5
                      notas + Bônus de 4 pts) ÷ 5.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {sortedLetters.map((letter) => {
                      const anchor = CAREER_ANCHORS[letter];
                      const anchorQuestions = QUESTIONS.filter(
                        (q) => q.anchor === letter
                      );
                      const anchorScore = averages[letter];

                      return (
                        <div
                          key={letter}
                          className="p-5 rounded-2xl border space-y-3"
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: 'var(--border-color)',
                          }}
                        >
                          <div className="flex items-center justify-between pb-2 border-b"
                            style={{ borderColor: 'var(--border-color)' }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-indigo-500">
                                Âncora {letter}
                              </span>
                              <span className="text-sm font-semibold">
                                {anchor.name}
                              </span>
                            </div>
                            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                              Média: {anchorScore.toFixed(1)}
                            </span>
                          </div>

                          <div className="space-y-2">
                            {anchorQuestions.map((q) => {
                              const r = ratings[q.number] || 0;
                              const isBonus = bonus.includes(q.number);

                              return (
                                <div
                                  key={q.number}
                                  className="text-xs flex items-start justify-between gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40"
                                >
                                  <div className="flex-1">
                                    <span className="font-bold text-slate-400 mr-2">
                                      #{q.number}
                                    </span>
                                    <span className="text-slate-700 dark:text-slate-300">
                                      {q.text}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                      Nota: {r}
                                    </span>
                                    {isBonus && (
                                      <span className="font-bold px-2 py-0.5 rounded bg-amber-500 text-white text-[10px]">
                                        +4 Bônus
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* BOTTOM ACTIONS */}
              <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 no-print"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() =>
                      openResetDialog(() => {
                        setBlockIndex(0);
                        setRatings({});
                        setBonus([]);
                        safeStorage.clear();
                        setSavedProgress(null);
                        setIsDemoMode(false);
                        setScreen('home');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      })
                    }
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isDemoMode ? 'Sair do Modo Exemplo' : 'Realizar Novo Teste'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyFullReport(
                        dominant,
                        secondary,
                        averages,
                        sortedLetters
                      )
                    }
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copiar Relatório</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md hover:shadow-indigo-500/25 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir / Salvar PDF</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* CONFIRMATION DIALOG MODAL */}
      {dialog.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 no-print"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDialog((d) => ({ ...d, open: false }));
            }
          }}
        >
          <div
            className="w-full max-w-md p-6 rounded-3xl border shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
          >
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold" id="dialog-title">
                {dialog.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {dialog.body}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDialog((d) => ({ ...d, open: false }))}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={dialog.onConfirm}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 transition-all shadow-md shadow-rose-600/20 cursor-pointer"
              >
                {dialog.confirmLabel || 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
