'use client';

import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Timer, Clock, Hourglass, Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import type { InterviewConfigData, InterviewDuration } from '../../types/interview-wizard.types';
import { cn } from '@/lib/utils';

interface Step5DurationProps {
  form: UseFormReturn<InterviewConfigData>;
}

const DURATION_OPTIONS: {
  minutes: InterviewDuration;
  title: string;
  badgeText: string;
  questions: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
}[] = [
  {
    minutes: 15,
    title: '15 Minutes',
    badgeText: 'Quick Pulse Check',
    questions: '1 - 2 Focused Questions',
    description: 'Fast evaluation for targeted skill practice or quick daily interview warm-up.',
    icon: Timer,
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  {
    minutes: 30,
    title: '30 Minutes',
    badgeText: 'Standard Technical Round',
    questions: '2 - 3 Core Questions',
    description: 'Standard industry interview session balancing problem solving, coding & Q&A.',
    icon: Clock,
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  },
  {
    minutes: 45,
    title: '45 Minutes',
    badgeText: 'Deep-Dive Architecture',
    questions: '3 - 4 Comprehensive Questions',
    description:
      'Thorough evaluation with detailed system trade-offs, optimization & STAR follow-ups.',
    icon: Hourglass,
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
  {
    minutes: 60,
    title: '60 Minutes',
    badgeText: 'Intensive Full Loop',
    questions: '4 - 5 Multi-Domain Questions',
    description: 'Exhaustive interview simulation replicating full onsite multi-interviewer loop.',
    icon: Calendar,
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
];

export function Step5Duration({ form }: Step5DurationProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;

  const currentDuration = watch('durationMinutes');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
          Step 5: Select Session Duration
        </h2>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Choose total time allocation for your mock interview simulation.
        </p>
      </div>

      {/* Duration Selection Cards */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold text-[var(--text-primary)]">
          Interview Duration *
        </Label>

        <div className="grid gap-3 sm:grid-cols-2">
          {DURATION_OPTIONS.map((opt) => {
            const isSelected = currentDuration === opt.minutes;
            const Icon = opt.icon;

            return (
              <div
                key={opt.minutes}
                onClick={() => setValue('durationMinutes', opt.minutes, { shouldValidate: true })}
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
                      <span className="text-[10px] font-medium text-blue-400">{opt.questions}</span>
                    </div>
                  </div>

                  <span
                    className={cn(
                      'rounded-full border px-2 py-0.5 text-[10px] font-semibold',
                      opt.badgeColor
                    )}
                  >
                    {opt.badgeText}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {opt.description}
                </p>
              </div>
            );
          })}
        </div>

        {errors.durationMinutes && (
          <p className="text-xs text-red-400">{errors.durationMinutes.message}</p>
        )}
      </div>
    </div>
  );
}
