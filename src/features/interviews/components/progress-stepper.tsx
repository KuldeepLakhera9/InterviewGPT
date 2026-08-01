'use client';

import * as React from 'react';
import { Check, Briefcase, Building2, Layers, Flame, Clock, Sparkles } from 'lucide-react';
import type { StepStatus } from '../types/interview-wizard.types';
import { cn } from '@/lib/utils';

export interface StepConfig {
  stepNumber: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const STEP_CONFIGS: StepConfig[] = [
  {
    stepNumber: 1,
    title: 'Select Role',
    subtitle: 'Target title & seniority level',
    icon: Briefcase,
  },
  {
    stepNumber: 2,
    title: 'Select Company',
    subtitle: 'Company tier & culture vibe',
    icon: Building2,
  },
  {
    stepNumber: 3,
    title: 'Select Interview Type',
    subtitle: 'Track format & core focus areas',
    icon: Layers,
  },
  {
    stepNumber: 4,
    title: 'Select Difficulty',
    subtitle: 'Challenge rigor & adaptive mode',
    icon: Flame,
  },
  {
    stepNumber: 5,
    title: 'Select Duration',
    subtitle: 'Time limit & question pacing',
    icon: Clock,
  },
  {
    stepNumber: 6,
    title: 'Review & Start',
    subtitle: 'Confirm config & launch simulation',
    icon: Sparkles,
  },
];

interface ProgressStepperProps {
  currentStep: number;
  stepStatuses: StepStatus[];
  onStepClick: (stepNumber: number) => void;
  completionPercentage: number;
}

export function ProgressStepper({
  currentStep,
  stepStatuses,
  onStepClick,
  completionPercentage,
}: ProgressStepperProps) {
  return (
    <div className="space-y-4">
      {/* Progress Bar Header Card */}
      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-primary)]">
          <span>Configuration Progress</span>
          <span className="text-blue-400">{completionPercentage}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={completionPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Interview configuration wizard progress"
          className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg-surface-hover)]"
        >
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Vertical Stepper List */}
      <nav aria-label="Wizard Steps Navigation" className="space-y-2">
        {STEP_CONFIGS.map((config) => {
          const status = stepStatuses.find((s) => s.stepNumber === config.stepNumber);
          const isCurrent = currentStep === config.stepNumber;
          const isCompleted = status?.isCompleted || false;
          const Icon = config.icon;

          return (
            <button
              key={config.stepNumber}
              type="button"
              onClick={() => onStepClick(config.stepNumber)}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'group relative flex w-full items-start space-x-3 rounded-lg border p-3 text-left transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none',
                isCurrent
                  ? 'border-blue-500/60 bg-blue-500/10 shadow-md ring-1 ring-blue-500/40'
                  : isCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface-1)] hover:bg-[var(--bg-surface-hover)]'
              )}
            >
              {/* Step Number Circle / Check Icon */}
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all',
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : isCurrent
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/40'
                      : 'bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                )}
              >
                {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : config.stepNumber}
              </div>

              {/* Title & Subtitle */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'text-xs font-semibold tracking-tight',
                      isCurrent
                        ? 'text-blue-400'
                        : isCompleted
                          ? 'text-emerald-400'
                          : 'text-[var(--text-primary)]'
                    )}
                  >
                    {config.title}
                  </span>
                  <Icon
                    className={cn(
                      'h-3.5 w-3.5 shrink-0 opacity-75',
                      isCurrent ? 'text-blue-400' : 'text-[var(--text-secondary)]'
                    )}
                  />
                </div>
                <p className="mt-0.5 truncate text-[11px] text-[var(--text-secondary)]">
                  {config.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
