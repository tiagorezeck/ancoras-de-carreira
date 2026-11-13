/**
 * @license
 * Âncoras de Carreira (Edgar Schein) - Relatório Individual
 * Assessment COMET
 */

import React, { useState } from 'react';
import {
  AnchorLetter,
  CAREER_ANCHORS,
  QUESTIONS,
  SCALE_DESCRIPTIONS,
  getSynergyAnalysis,
} from './data';
import {
  Award,
  BarChart3,
  Layers,
  Sparkles,
  ListChecks,
  Share2,
  Copy,
  Printer,
  Check,
  Cpu,
  Briefcase,
  Compass,
  ShieldCheck,
  Rocket,
  HeartHandshake,
  Target,
  SunMedium,
  RotateCcw,
  Star,
  BookOpen,
} from 'lucide-react';

interface AncorasReportViewProps {
  ratings: Record<number, number>;
  bonus: number[];
  theme?: 'light' | 'dark';
  onStartNew?: () => void;
  onGoToIntegrated?: () => void;
}

const ANCHOR_ORDER: AnchorLetter[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const BONUS_POINTS = 4;

function computeAverages(
  ratings: Record<number, number>,
  bonus: number[]
): Record<AnchorLetter, number> {
  const sums: Record<AnchorLetter, number> = {
    A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0,
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
    case 'A': return <Cpu className={className} />;
    case 'B': return <Briefcase className={className} />;
    case 'C': return <Compass className={className} />;
    case 'D': return <ShieldCheck className={className} />;
    case 'E': return <Rocket className={className} />;
    case 'F': return <HeartHandshake className={className} />;
    case 'G': return <Target className={className} />;
    case 'H': return <SunMedium className={className} />;
    default: return <Sparkles className={className} />;
  }
}

export const AncorasReportView: React.FC<AncorasReportViewProps> = ({
  ratings,
  bonus,
  theme = 'dark',
  onStartNew,
  onGoToIntegrated,
}) => {
  type ResultTab = 'overview' | 'anchors' | 'synergy' | 'audit';
  const [resultTab, setResultTab] = useState<ResultTab>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const averages = computeAverages(ratings, bonus);
  const sortedLetters = sortAnchorsByScore(averages);
  const dominant = sortedLetters[0] || 'A';
  const secondary = sortedLetters[1] || 'B';
  const hasSecondary = secondary && averages[secondary] !== averages[dominant];
  const synergy = getSynergyAnalysis(dominant, secondary);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyFullReport = () => {
    const text = `=== RELATÓRIO ÂNCORAS DE CARREIRA (EDGAR SCHEIN) ===\n\n` +
      `Âncora Dominante: ${CAREER_ANCHORS[dominant].name} (${dominant}) - Média: ${averages[dominant].toFixed(1)}/10\n` +
      (hasSecondary ? `Âncora Secundária: ${CAREER_ANCHORS[secondary].name} (${secondary}) - Média: ${averages[secondary].toFixed(1)}/10\n\n` : '\n') +
      `RANKING GERAL:\n` +
      sortedLetters.map((l, i) => `${i + 1}º [${l}] ${CAREER_ANCHORS[l].name}: ${averages[l].toFixed(1)} / 10`).join('\n');
    navigator.clipboard.writeText(text);
    showToast('Relatório copiado para a área de transferência!');
  };

  const handleShare = () => {
    const text = `Meu resultado no Teste Âncoras de Carreira COMET: ${CAREER_ANCHORS[dominant].name} (${dominant}) com média ${averages[dominant].toFixed(1)}/10!`;
    if (navigator.share) {
      navigator.share({ title: 'Resultado Âncoras de Carreira', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      showToast('Resumo copiado para compartilhamento!');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/95 text-white shadow-2xl border border-slate-700 backdrop-blur-md text-sm font-medium animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER CARD */}
      <div className="rounded-3xl p-6 sm:p-8 border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/40">
              <Award className="w-3.5 h-3.5" />
              <span>Assessment COMET • Instrumento Individual</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Relatório de Âncoras de Carreira
            </h1>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50">
                <AnchorIcon letter={dominant} className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
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
                  <AnchorIcon letter={secondary} className="w-5 h-5 text-purple-600 dark:text-purple-400" />
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
            {onGoToIntegrated && (
              <button
                type="button"
                onClick={onGoToIntegrated}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Ver Dossiê Integrado</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-indigo-500" />
              <span>Compartilhar</span>
            </button>

            <button
              type="button"
              onClick={handleCopyFullReport}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              <Copy className="w-4 h-4 text-indigo-500" />
              <span>Copiar</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* REPORT NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-print pb-px">
        {[
          { id: 'overview', label: 'Visão Geral & Ranking', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'anchors', label: 'As 8 Âncoras Detalhadas', icon: <Layers className="w-4 h-4" /> },
          { id: 'synergy', label: 'Análise de Sinergia', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'audit', label: 'Auditoria de Respostas (40)', icon: <ListChecks className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setResultTab(tab.id as ResultTab)}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              resultTab === tab.id
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ================= TAB 1: VISÃO GERAL & RANKING ================= */}
      {resultTab === 'overview' && (
        <div className="space-y-6">
          {/* Dominant Highlight Box */}
          <div className="p-6 sm:p-7 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
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
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {CAREER_ANCHORS[dominant].name}
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {CAREER_ANCHORS[dominant].description}
                </p>
              </div>
            </div>
          </div>

          {/* Ranking Bar Chart */}
          <div className="p-6 sm:p-7 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <span>Ranking Geral das 8 Âncoras</span>
            </h3>
            <div className="space-y-3">
              {sortedLetters.map((letter, idx) => {
                const anchor = CAREER_ANCHORS[letter];
                const score = averages[letter];
                const percentage = Math.min(100, Math.round((score / 10) * 100));
                const isDominant = letter === dominant;
                const isSecondary = letter === secondary;

                return (
                  <div key={letter} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs w-5 font-bold text-slate-400">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          [{letter}] {anchor.name}
                        </span>
                        {isDominant && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-600 text-white uppercase">
                            Dominante
                          </span>
                        )}
                        {isSecondary && hasSecondary && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300">
                            Secundária
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {score.toFixed(1)} / 10
                      </span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isDominant
                            ? 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                            : isSecondary
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                            : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: AS 8 ÂNCORAS DETALHADAS ================= */}
      {resultTab === 'anchors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ANCHOR_ORDER.map((letter) => {
            const anchor = CAREER_ANCHORS[letter];
            const score = averages[letter];
            const isDominant = letter === dominant;

            return (
              <div
                key={letter}
                className={`p-5 rounded-2xl border transition-all ${
                  isDominant
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                      {letter}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {anchor.name}
                      </h4>
                      <span className="text-xs text-slate-500">{anchor.badge}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400">
                    {score.toFixed(1)}/10
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {anchor.summary}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] space-y-1">
                  <div>
                    <strong className="text-slate-700 dark:text-slate-200">Ambiente Ideal: </strong>
                    <span className="text-slate-500 dark:text-slate-400">{anchor.idealEnvironment}</span>
                  </div>
                  <div>
                    <strong className="text-rose-600 dark:text-rose-400">Fator de Desmotivação: </strong>
                    <span className="text-slate-500 dark:text-slate-400">{anchor.demotivators}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= TAB 3: SINERGIA ================= */}
      {resultTab === 'synergy' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span>{synergy.profileTitle}</span>
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {synergy.summary}
            </p>

            <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-3">
              <h4 className="font-bold text-sm text-indigo-900 dark:text-indigo-200">
                Recomendações Práticas para suas Próximas Decisões:
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {synergy.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: AUDITORIA DE RESPOSTAS ================= */}
      {resultTab === 'audit' && (
        <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-indigo-500" />
              <span>Auditoria das 40 Afirmações Respondidas</span>
            </h3>
            <span className="text-xs text-slate-500">
              Bônus aplicados (+4 pts): {bonus.join(', ') || 'Nenhum'}
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {QUESTIONS.map((q) => {
              const val = ratings[q.number] || 0;
              const hasBonus = bonus.includes(q.number);
              return (
                <div key={q.number} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-slate-400 font-bold w-6">{q.number}.</span>
                    <div>
                      <p className="text-slate-700 dark:text-slate-300">{q.text}</p>
                      <span className="text-[10px] text-slate-400">
                        Âncora {q.anchor} — {CAREER_ANCHORS[q.anchor].name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {hasBonus && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-black text-[10px]">
                        ★ Bônus (+4)
                      </span>
                    )}
                    <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold flex items-center justify-center font-mono text-indigo-600 dark:text-indigo-400">
                      {val}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AncorasReportView;
