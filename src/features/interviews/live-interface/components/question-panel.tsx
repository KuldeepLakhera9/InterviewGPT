'use client';

import * as React from 'react';
import { HelpCircle, Clock, CheckCircle2, Layers } from 'lucide-react';
import type { QuestionPanelData } from '../types/live-interface.types';
import { cn } from '@/lib/utils';

interface QuestionPanelProps {
  question?: QuestionPanelData | null;
  questionIndex: number;
  totalQuestions: number;
}

export function QuestionPanel({ question, questionIndex, totalQuestions }: QuestionPanelProps) {
  if (!question) {
    return (
      <div className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-6 text-center">
        <HelpCircle className="mx-auto h-8 w-8 animate-pulse text-blue-400" />
        <h3 className="text-sm font-bold text-[var(--text-primary)]">
          Interview Warmup & Introduction
        </h3>
        <p className="text-xs text-[var(--text-secondary)]">
          The AI interviewer is introducing the session structure before launching Question 1.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-xl border border-blue-500/30 bg-[var(--bg-surface-1)] p-5 shadow-sm">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center space-x-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
            {questionIndex + 1}
          </span>
          <span className="text-xs font-bold tracking-wider text-blue-400 uppercase">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
        </div>

        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase',
            question.difficulty === 'easy' &&
              'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
            question.difficulty === 'medium' &&
              'border border-amber-500/20 bg-amber-500/10 text-amber-400',
            question.difficulty === 'hard' &&
              'border border-orange-500/20 bg-orange-500/10 text-orange-400',
            question.difficulty === 'expert' &&
              'border border-purple-500/20 bg-purple-500/10 text-purple-300'
          )}
        >
          {question.difficulty}
        </span>
      </div>

      {/* Title & Prompt Text */}
      <div className="space-y-2">
        <h3 className="text-base leading-snug font-extrabold text-[var(--text-primary)]">
          {question.title}
        </h3>
        <p className="text-xs leading-relaxed whitespace-pre-wrap text-[var(--text-secondary)]">
          {question.questionText}
        </p>
      </div>

      {/* Metadata Badges Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
        <span className="flex items-center space-x-1 rounded bg-[var(--bg-surface-2)] px-2 py-1 font-semibold text-blue-300">
          <Layers className="h-3 w-3" />
          <span>{question.topic}</span>
        </span>

        <span className="rounded bg-[var(--bg-surface-2)] px-2 py-1 font-medium text-[var(--text-secondary)] capitalize">
          Category: {question.category}
        </span>

        {question.expectedDurationMinutes && (
          <span className="flex items-center space-x-1 rounded bg-[var(--bg-surface-2)] px-2 py-1 font-medium text-cyan-400">
            <Clock className="h-3 w-3" />
            <span>Target: ~{question.expectedDurationMinutes}m</span>
          </span>
        )}
      </div>

      {/* Focus Area Guidelines */}
      {question.evaluationCriteriaFocus && question.evaluationCriteriaFocus.length > 0 && (
        <div className="space-y-1.5 rounded-lg border border-blue-500/15 bg-blue-500/5 p-3">
          <span className="flex items-center space-x-1 text-[10px] font-bold tracking-wider text-blue-400 uppercase">
            <CheckCircle2 className="h-3 w-3" />
            <span>Key Evaluation Focus Areas</span>
          </span>
          <ul className="space-y-1 text-[11px] text-[var(--text-secondary)]">
            {question.evaluationCriteriaFocus.map((f, idx) => (
              <li key={idx} className="flex items-start space-x-1.5">
                <span className="font-bold text-blue-400">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
