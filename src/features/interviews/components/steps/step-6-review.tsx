'use client';

import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
  Briefcase,
  Building2,
  Layers,
  Flame,
  Clock,
  Zap,
  CheckCircle2,
  Play,
  Edit3,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { InterviewConfigData, StepStatus } from '../../types/interview-wizard.types';

interface Step6ReviewProps {
  form: UseFormReturn<InterviewConfigData>;
  stepStatuses: StepStatus[];
  onJumpToStep: (stepNumber: number) => void;
  onStartSession: () => void;
  isSubmitting: boolean;
}

export function Step6Review({
  form,
  onJumpToStep,
  onStartSession,
  isSubmitting,
}: Step6ReviewProps) {
  const formValues = form.getValues();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
          Step 6: Review Configuration & Start
        </h2>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Review your interview parameters, save as a preset, and launch your session.
        </p>
      </div>

      {/* Configuration Summary Card Grid */}
      <div className="space-y-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5 shadow-md">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-400" />
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Interview Session Blueprint
            </h3>
          </div>
          <span className="inline-flex items-center space-x-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Ready for Launch</span>
          </span>
        </div>

        {/* 6 Key Items Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Role */}
          <div className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span className="flex items-center space-x-1 font-semibold">
                <Briefcase className="h-3.5 w-3.5 text-blue-400" />
                <span>Target Role</span>
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(1)}
                className="flex items-center space-x-0.5 text-[11px] text-blue-400 hover:underline"
              >
                <Edit3 className="h-3 w-3" />
                <span>Edit</span>
              </button>
            </div>
            <p className="text-sm font-bold text-[var(--text-primary)]">{formValues.roleTitle}</p>
            <span className="inline-block rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-300">
              Seniority: {formValues.seniorityLevel.toUpperCase()}
            </span>
          </div>

          {/* Company */}
          <div className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span className="flex items-center space-x-1 font-semibold">
                <Building2 className="h-3.5 w-3.5 text-purple-400" />
                <span>Target Company</span>
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(2)}
                className="flex items-center space-x-0.5 text-[11px] text-blue-400 hover:underline"
              >
                <Edit3 className="h-3 w-3" />
                <span>Edit</span>
              </button>
            </div>
            <p className="text-sm font-bold text-[var(--text-primary)]">
              {formValues.companyName || 'General Target'}
            </p>
            <span className="inline-block rounded bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-300">
              Tier: {formValues.companyTier.toUpperCase()}
            </span>
          </div>

          {/* Interview Type */}
          <div className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span className="flex items-center space-x-1 font-semibold">
                <Layers className="h-3.5 w-3.5 text-emerald-400" />
                <span>Interview Track</span>
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(3)}
                className="flex items-center space-x-0.5 text-[11px] text-blue-400 hover:underline"
              >
                <Edit3 className="h-3 w-3" />
                <span>Edit</span>
              </button>
            </div>
            <p className="text-sm font-bold text-[var(--text-primary)] capitalize">
              {formValues.track.replace('_', ' ')}
            </p>
            <span className="inline-block rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
              {formValues.focusAreas.length} Focus Areas Tagged
            </span>
          </div>

          {/* Difficulty */}
          <div className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span className="flex items-center space-x-1 font-semibold">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                <span>Difficulty Level</span>
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(4)}
                className="flex items-center space-x-0.5 text-[11px] text-blue-400 hover:underline"
              >
                <Edit3 className="h-3 w-3" />
                <span>Edit</span>
              </button>
            </div>
            <p className="text-sm font-bold text-[var(--text-primary)] capitalize">
              {formValues.difficulty}
            </p>
            <span className="inline-flex items-center space-x-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
              <Zap className="h-2.5 w-2.5 text-amber-400" />
              <span>Adaptive: {formValues.adaptiveDifficulty ? 'ON' : 'OFF'}</span>
            </span>
          </div>

          {/* Duration */}
          <div className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span className="flex items-center space-x-1 font-semibold">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                <span>Duration</span>
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(5)}
                className="flex items-center space-x-0.5 text-[11px] text-blue-400 hover:underline"
              >
                <Edit3 className="h-3 w-3" />
                <span>Edit</span>
              </button>
            </div>
            <p className="text-sm font-bold text-[var(--text-primary)]">
              {formValues.durationMinutes} Minutes
            </p>
            <span className="inline-block rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
              Time-boxed Simulation
            </span>
          </div>

          {/* Focus Tags List */}
          <div className="space-y-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-3 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span className="font-semibold">Selected Focus Areas</span>
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {formValues.focusAreas.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-blue-500/20 bg-blue-500/20 px-2 py-0.5 text-[10px] font-medium text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Start Interview Action Section */}
        <div className="flex flex-col gap-3 border-t border-[var(--border-subtle)] pt-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--text-secondary)]">
            Clicking Start will create your persistent session blueprint and launch the interview
            lobby.
          </p>

          <Button
            type="button"
            size="lg"
            onClick={onStartSession}
            disabled={isSubmitting}
            className="space-x-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-sm font-bold text-white shadow-lg hover:from-blue-500 hover:to-emerald-500"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4 fill-current" />
            )}
            <span>{isSubmitting ? 'Creating Session...' : 'Start Interview Session'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
