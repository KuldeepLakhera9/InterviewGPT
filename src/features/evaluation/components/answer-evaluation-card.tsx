'use client';

import * as React from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import type { AnswerEvaluationData } from '../types/evaluation.types';
import { cn } from '@/lib/utils';

interface AnswerEvaluationCardProps {
  evaluation: AnswerEvaluationData;
}

export function AnswerEvaluationCard({ evaluation }: AnswerEvaluationCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const scoreBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (score >= 70) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    if (score >= 55) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  };

  return (
    <div
      id={`answer-eval-card-${evaluation.turnId}`}
      className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5 shadow-sm transition-all hover:border-[var(--border-strong)]"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
              Turn #{evaluation.turnIndex}
            </span>
            <h4 className="text-sm font-semibold text-[var(--text-primary)]">
              {evaluation.questionText}
            </h4>
          </div>
          <p className="line-clamp-2 text-xs text-[var(--text-secondary)] italic">
            &quot;{evaluation.candidateAnswer}&quot;
          </p>
        </div>

        <div className="flex flex-col items-end space-y-1">
          <div
            className={cn(
              'rounded-lg border px-3 py-1 text-xs font-bold',
              scoreBadgeColor(evaluation.overallAnswerScore)
            )}
          >
            {evaluation.overallAnswerScore} / 100
          </div>
        </div>
      </div>

      {/* 8 Core Metrics Grid */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {Object.entries(evaluation.scores).map(([metric, score]) => (
          <div
            key={metric}
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-2.5 text-center"
          >
            <span className="block text-[10px] font-semibold tracking-wider text-[var(--text-tertiary)] uppercase">
              {metric.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <div className="mt-1 text-sm font-bold text-[var(--text-primary)]">{score}</div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-700/30">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Feedback Summary */}
      <div className="mt-4 rounded-lg bg-[var(--bg-surface-2)] p-3 text-xs text-[var(--text-secondary)]">
        <p className="font-medium text-[var(--text-primary)]">{evaluation.feedbackSummary}</p>
      </div>

      {/* Expandable Improved Outline */}
      <div className="mt-3">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center space-x-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>
            {expanded ? 'Hide Recruiter Ideal Outline' : 'View Recruiter Ideal Answer Outline'}
          </span>
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>

        {expanded && (
          <div className="mt-2.5 space-y-3 rounded-lg border border-purple-500/20 bg-purple-500/5 p-3 text-xs">
            <div>
              <span className="font-semibold text-purple-300">Key Concepts Covered:</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {evaluation.keyConceptsCovered.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300"
                  >
                    <CheckCircle2 className="mr-1 inline-block h-3 w-3" />
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-semibold text-amber-300">Key Concepts Missed:</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {evaluation.keyConceptsMissed.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300"
                  >
                    <AlertTriangle className="mr-1 inline-block h-3 w-3" />
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-semibold text-purple-300">
                Recruiter Recommended Answer Outline:
              </span>
              <pre className="mt-1 rounded bg-black/30 p-2 font-mono text-[11px] whitespace-pre-wrap text-gray-300">
                {evaluation.improvedAnswerOutline}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
