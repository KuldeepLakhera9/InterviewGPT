'use client';

import * as React from 'react';
import {
  Clock,
  Eye,
  Sparkles,
  Building2,
  Briefcase,
  HelpCircle,
  Flame,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { QuestionBankItemData } from '../types/question-bank.types';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: QuestionBankItemData;
  onPreview: (question: QuestionBankItemData) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  technical: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  system_design: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  behavioral: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  coding: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  architecture: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  medium: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  hard: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  expert: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
};

export function QuestionCard({ question, onPreview }: QuestionCardProps) {
  const durationMinutes = Math.round(question.expectedDurationSeconds / 60);

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5 shadow-sm transition-all duration-200 hover:border-blue-500/60 hover:bg-[var(--bg-surface-hover)] hover:shadow-md">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                'rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase',
                CATEGORY_COLORS[question.category] || CATEGORY_COLORS.technical
              )}
            >
              {question.category.replace('_', ' ')}
            </span>

            <span
              className={cn(
                'rounded-full border px-2.5 py-0.5 text-[10px] font-semibold capitalize',
                DIFFICULTY_COLORS[question.difficulty] || DIFFICULTY_COLORS.medium
              )}
            >
              {question.difficulty}
            </span>

            {question.isAiGenerated && (
              <span className="inline-flex items-center space-x-1 rounded-full border border-purple-500/30 bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                <Sparkles className="h-2.5 w-2.5 text-purple-400" />
                <span>AI Generated</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1 text-xs font-medium text-[var(--text-secondary)]">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span>{durationMinutes}m</span>
          </div>
        </div>

        {/* Title & Topic */}
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-base font-bold text-[var(--text-primary)] transition-colors group-hover:text-blue-400">
            {question.title}
          </h3>
          <p className="flex items-center space-x-1 text-xs font-medium text-[var(--text-secondary)]">
            <Layers className="h-3 w-3 shrink-0 text-purple-400" />
            <span>Topic: {question.topic}</span>
          </p>
        </div>

        {/* Question Text Excerpt */}
        <p className="line-clamp-3 text-xs leading-relaxed text-[var(--text-secondary)]">
          {question.questionText}
        </p>

        {/* Company & Role Tags */}
        <div className="space-y-2 pt-1">
          {question.companyTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <Building2 className="h-3 w-3 shrink-0 text-[var(--text-secondary)]" />
              {question.companyTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {question.roleTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <Briefcase className="h-3 w-3 shrink-0 text-[var(--text-secondary)]" />
              {question.roleTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3 text-xs text-[var(--text-secondary)]">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <HelpCircle className="h-3.5 w-3.5 text-blue-400" />
            <span>{question.followUpReferences.length} Follow-ups</span>
          </span>
          <span className="flex items-center space-x-1">
            <Flame className="h-3.5 w-3.5 text-emerald-400" />
            <span>{question.evaluationMetadata.keyConcepts.length} Key Concepts</span>
          </span>
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onPreview(question)}
          className="space-x-1.5 border-blue-500/30 text-xs hover:border-blue-500 hover:bg-blue-500/10"
        >
          <Eye className="h-3.5 w-3.5 text-blue-400" />
          <span>Inspect Rubric</span>
        </Button>
      </div>
    </div>
  );
}
