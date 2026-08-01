'use client';

import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Code2, Cpu, MessageSquare, Layers, Check, Sparkles } from 'lucide-react';
import { Label } from '@/components/ui/label';
import type { InterviewConfigData, InterviewTrack } from '../../types/interview-wizard.types';
import { cn } from '@/lib/utils';

interface Step3TypeProps {
  form: UseFormReturn<InterviewConfigData>;
}

const TRACK_OPTIONS: {
  track: InterviewTrack;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
}[] = [
  {
    track: 'technical',
    title: 'Technical Algorithms',
    badge: 'Code Sandbox & Data Structures',
    description:
      'Solve algorithmic challenges, optimize time & space complexity, write clean executable code.',
    icon: Code2,
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  },
  {
    track: 'system_design',
    title: 'System Design & Architecture',
    badge: 'Distributed Systems & Trade-offs',
    description:
      'Design large-scale systems, load balancing, caching, database partitioning & microservices.',
    icon: Cpu,
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
  {
    track: 'behavioral',
    title: 'Behavioral & STAR Method',
    badge: 'Leadership & Conflict Framing',
    description:
      'Practice Situation-Task-Action-Result answers, Amazon leadership principles & soft skills.',
    icon: MessageSquare,
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  {
    track: 'full_loop',
    title: 'Full Loop Simulation',
    badge: 'Comprehensive Multi-Domain',
    description:
      'Full 360-degree round featuring coding, system architecture, and behavioral STAR questions.',
    icon: Layers,
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
];

const AVAILABLE_FOCUS_AREAS = [
  'React/Next.js',
  'TypeScript',
  'System Architecture',
  'Microservices',
  'Databases/PostgreSQL',
  'Dynamic Programming',
  'API Design',
  'Concurrency',
  'Web Performance',
  'STAR Behavioral',
  'Team Leadership',
  'State Management',
  'Security & OAuth',
  'CI/CD & Cloud',
];

export function Step3Type({ form }: Step3TypeProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;

  const currentTrack = watch('track');
  const currentFocusAreas = watch('focusAreas') || [];

  const toggleFocusArea = (tag: string) => {
    const existing = [...currentFocusAreas];
    const index = existing.indexOf(tag);
    if (index > -1) {
      existing.splice(index, 1);
    } else {
      existing.push(tag);
    }
    setValue('focusAreas', existing, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
          Step 3: Select Interview Type & Focus Areas
        </h2>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Choose the interview format track and tag your primary technical competencies.
        </p>
      </div>

      {/* Track Selection Cards */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold text-[var(--text-primary)]">
          Interview Track Format *
        </Label>

        <div className="grid gap-3 sm:grid-cols-2">
          {TRACK_OPTIONS.map((opt) => {
            const isSelected = currentTrack === opt.track;
            const Icon = opt.icon;

            return (
              <div
                key={opt.track}
                onClick={() => setValue('track', opt.track, { shouldValidate: true })}
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
                        {opt.badge}
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

        {errors.track && <p className="text-xs text-red-400">{errors.track.message}</p>}
      </div>

      {/* Focus Areas Selection */}
      <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center space-x-1 text-xs font-semibold text-[var(--text-primary)]">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Select Focus Areas *</span>
          </Label>
          <span className="text-[11px] text-[var(--text-secondary)]">
            Selected ({currentFocusAreas.length})
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {AVAILABLE_FOCUS_AREAS.map((tag) => {
            const isSelected = currentFocusAreas.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleFocusArea(tag)}
                className={cn(
                  'inline-flex items-center space-x-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                  isSelected
                    ? 'border-blue-500/60 bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-[var(--text-secondary)] hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-300'
                )}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
                <span>{tag}</span>
              </button>
            );
          })}
        </div>

        {errors.focusAreas && <p className="text-xs text-red-400">{errors.focusAreas.message}</p>}
      </div>
    </div>
  );
}
