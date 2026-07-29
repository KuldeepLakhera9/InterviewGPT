'use client';

import * as React from 'react';
import {
  Briefcase,
  CheckCircle2,
  Check,
  FileCode2,
  GraduationCap,
  Award,
  Target,
  User,
  Wrench,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StepStatus } from '../types/candidate-profile.types';

export const STEP_CONFIGS: Array<{
  stepNumber: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}> = [
  { stepNumber: 1, title: 'Personal Info', subtitle: 'Basic contact details', icon: User },
  {
    stepNumber: 2,
    title: 'Professional Info',
    subtitle: 'Work role & experience',
    icon: Briefcase,
  },
  { stepNumber: 3, title: 'Skills', subtitle: 'Technical & core skills', icon: Wrench },
  { stepNumber: 4, title: 'Education', subtitle: 'Academic history', icon: GraduationCap },
  { stepNumber: 5, title: 'Experience', subtitle: 'Employment history', icon: Briefcase },
  { stepNumber: 6, title: 'Projects', subtitle: 'Portfolio & code', icon: FileCode2 },
  { stepNumber: 7, title: 'Certifications', subtitle: 'Licenses & credentials', icon: Award },
  { stepNumber: 8, title: 'Career Goals', subtitle: 'Aspirations & target role', icon: Target },
  { stepNumber: 9, title: 'Review & Submit', subtitle: 'Summary & completion', icon: Send },
];

interface ProgressStepperProps {
  currentStep: number;
  stepStatuses: StepStatus[];
  onStepClick: (stepNumber: number) => void;
}

export function ProgressStepper({ currentStep, stepStatuses, onStepClick }: ProgressStepperProps) {
  return (
    <div className="w-full space-y-2">
      {/* Mobile Horizontal Scrollable Stepper Bar */}
      <div className="no-scrollbar flex overflow-x-auto border-b border-[var(--border-subtle)] pb-2 lg:hidden">
        <div className="flex min-w-max items-center space-x-2 px-1">
          {STEP_CONFIGS.map((step) => {
            const Icon = step.icon;
            const status = stepStatuses.find((s) => s.stepNumber === step.stepNumber);
            const isCurrent = currentStep === step.stepNumber;
            const isCompleted = status?.isCompleted ?? false;
            const isClickable = isCompleted || step.stepNumber <= currentStep;

            return (
              <button
                key={step.stepNumber}
                type="button"
                onClick={() => isClickable && onStepClick(step.stepNumber)}
                disabled={!isClickable}
                className={cn(
                  'flex items-center space-x-2 rounded-lg px-3 py-2 text-xs font-medium transition-all',
                  isCurrent
                    ? 'border border-blue-500/30 bg-blue-600/15 text-blue-400'
                    : isCompleted
                      ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)] opacity-70',
                  !isClickable && 'cursor-not-allowed opacity-40'
                )}
              >
                <div
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                    isCurrent
                      ? 'bg-blue-500 text-white'
                      : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-zinc-800 text-zinc-400'
                  )}
                >
                  {isCompleted ? <Check className="h-3 w-3" /> : step.stepNumber}
                </div>
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Vertical Left Stepper Column */}
      <nav aria-label="Progress Stepper" className="hidden space-y-1 lg:block">
        {STEP_CONFIGS.map((step) => {
          const Icon = step.icon;
          const status = stepStatuses.find((s) => s.stepNumber === step.stepNumber);
          const isCurrent = currentStep === step.stepNumber;
          const isCompleted = status?.isCompleted ?? false;
          const isClickable = isCompleted || step.stepNumber <= currentStep;

          return (
            <button
              key={step.stepNumber}
              type="button"
              onClick={() => isClickable && onStepClick(step.stepNumber)}
              disabled={!isClickable}
              className={cn(
                'group relative flex w-full items-start rounded-xl border p-3 text-left transition-all duration-200',
                isCurrent
                  ? 'border-blue-500/40 bg-blue-500/10 text-[var(--text-primary)] shadow-sm shadow-blue-500/10'
                  : isCompleted
                    ? 'border-transparent bg-[var(--bg-surface-1)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                    : 'border-transparent text-[var(--text-secondary)] opacity-60 hover:opacity-90',
                !isClickable && 'cursor-not-allowed opacity-40 hover:opacity-40'
              )}
            >
              <div className="flex w-full items-center space-x-3">
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold transition-all',
                    isCurrent
                      ? 'border-blue-500 bg-blue-600 text-white ring-4 ring-blue-500/20'
                      : isCompleted
                        ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-400'
                        : 'border-zinc-700 bg-zinc-800/60 text-zinc-400'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p
                      className={cn(
                        'truncate text-xs font-semibold',
                        isCurrent
                          ? 'text-blue-400'
                          : isCompleted
                            ? 'text-emerald-400'
                            : 'text-[var(--text-primary)]'
                      )}
                    >
                      {step.stepNumber}. {step.title}
                    </p>
                    {isCompleted && (
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                        Done
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[11px] text-[var(--text-secondary)]">
                    {step.subtitle}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
