'use client';

import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Smile, ShieldCheck, Flame, Skull, Zap } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { DifficultyLevel, InterviewConfigData } from '../../types/interview-wizard.types';
import { cn } from '@/lib/utils';

interface Step4DifficultyProps {
  form: UseFormReturn<InterviewConfigData>;
}

const DIFFICULTY_OPTIONS: {
  level: DifficultyLevel;
  title: string;
  badgeText: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
}[] = [
  {
    level: 'easy',
    title: 'Easy / Foundational',
    badgeText: 'Warm-up & Core Concepts',
    description:
      'Foundational questions to build confidence, verify core concepts, and practice fluency.',
    icon: Smile,
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  {
    level: 'medium',
    title: 'Medium / Standard Bar',
    badgeText: 'Realistic Industry Benchmark',
    description:
      'Standard industry difficulty covering real-world design choices, trade-offs, and edge cases.',
    icon: ShieldCheck,
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  },
  {
    level: 'hard',
    title: 'Hard / High Rigor',
    badgeText: 'Complex Edge Cases & Scaling',
    description:
      'Challenging scenarios requiring deep algorithmic optimization and resilient system architecture.',
    icon: Flame,
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
  {
    level: 'expert',
    title: 'Expert / FAANG Bar',
    badgeText: 'Top 1% Maximum Challenge',
    description:
      'Unforgiving difficulty designed to stress-test mastery, multi-system failure modes & staff-level depth.',
    icon: Skull,
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  },
];

export function Step4Difficulty({ form }: Step4DifficultyProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;

  const currentDifficulty = watch('difficulty');
  const isAdaptive = watch('adaptiveDifficulty');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
          Step 4: Select Difficulty & Adaptive Mode
        </h2>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Set the challenge level and enable AI adaptive difficulty adjustments.
        </p>
      </div>

      {/* Difficulty Level Selection */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold text-[var(--text-primary)]">
          Base Difficulty Level *
        </Label>

        <div className="grid gap-3 sm:grid-cols-2">
          {DIFFICULTY_OPTIONS.map((opt) => {
            const isSelected = currentDifficulty === opt.level;
            const Icon = opt.icon;

            return (
              <div
                key={opt.level}
                onClick={() => setValue('difficulty', opt.level, { shouldValidate: true })}
                className={cn(
                  'group relative cursor-pointer rounded-xl border p-4 transition-all duration-200',
                  isSelected
                    ? 'border-blue-500/80 bg-blue-500/10 shadow-md ring-1 ring-blue-500/40'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface-1)] hover:border-blue-500/40 hover:bg-[var(--bg-surface-hover)]'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg border text-xs',
                        opt.badgeColor
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-blue-400">
                        {opt.title}
                      </h4>
                      <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                        {opt.badgeText}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {opt.description}
                </p>
              </div>
            );
          })}
        </div>

        {errors.difficulty && <p className="text-xs text-red-400">{errors.difficulty.message}</p>}
      </div>

      {/* Adaptive Difficulty Switch */}
      <div className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-semibold text-[var(--text-primary)]">
              Adaptive Difficulty Engine
            </span>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
              Recommended
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Dynamically escalates follow-up question depth when candidate shows strong performance,
            or offers hints when struggling.
          </p>
        </div>

        <Switch
          checked={isAdaptive}
          onCheckedChange={(checked) => setValue('adaptiveDifficulty', checked)}
          aria-label="Toggle adaptive difficulty engine"
        />
      </div>
    </div>
  );
}
