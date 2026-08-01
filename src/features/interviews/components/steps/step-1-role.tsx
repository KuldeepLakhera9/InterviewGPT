'use client';

import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Briefcase, UserCheck, Award, ShieldAlert, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { InterviewConfigData, SeniorityLevel } from '../../types/interview-wizard.types';
import { cn } from '@/lib/utils';

interface Step1RoleProps {
  form: UseFormReturn<InterviewConfigData>;
}

const POPULAR_ROLES = [
  'Full Stack Engineer',
  'Senior Frontend Engineer',
  'Backend Systems Engineer',
  'Systems Architect',
  'DevOps & Infrastructure Engineer',
  'Mobile Engineer (iOS/Android)',
  'AI / ML Engineer',
  'Data Engineer',
  'Product Manager',
  'Engineering Manager',
];

const SENIORITY_OPTIONS: {
  level: SeniorityLevel;
  title: string;
  experience: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
}[] = [
  {
    level: 'junior',
    title: 'Junior / Entry-Level',
    experience: '0 - 2 Years Experience',
    description:
      'Focuses on fundamental algorithms, syntax mastery, clean code & core data structures.',
    icon: UserCheck,
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  {
    level: 'mid',
    title: 'Mid-Level Engineer',
    experience: '2 - 5 Years Experience',
    description:
      'Evaluates system component design, API design trade-offs, testing & optimization.',
    icon: Briefcase,
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  },
  {
    level: 'senior',
    title: 'Senior Engineer',
    experience: '5 - 8 Years Experience',
    description:
      'Deep architectural decisions, scalability, fault-tolerance, mentorship & STAR leadership.',
    icon: Award,
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
  {
    level: 'staff',
    title: 'Staff / Principal / Lead',
    experience: '8+ Years Experience',
    description:
      'High-level multi-system design, organizational impact, trade-off matrix & strategic vision.',
    icon: ShieldAlert,
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
];

export function Step1Role({ form }: Step1RoleProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const currentRole = watch('roleTitle');
  const currentSeniority = watch('seniorityLevel');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
          Step 1: Select Target Role & Seniority
        </h2>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Specify your target job role and experience level to calibrate interviewer questions.
        </p>
      </div>

      {/* Target Role Input */}
      <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4">
        <Label htmlFor="roleTitle" className="text-xs font-semibold text-[var(--text-primary)]">
          Target Role Title *
        </Label>

        <Input
          id="roleTitle"
          placeholder="e.g. Senior Frontend Engineer"
          {...register('roleTitle')}
          className="bg-[var(--bg-surface-2)] text-xs"
        />

        {errors.roleTitle && <p className="text-xs text-red-400">{errors.roleTitle.message}</p>}

        {/* Quick Role Suggestions */}
        <div className="space-y-1.5 pt-2">
          <span className="flex items-center space-x-1 text-[11px] font-medium text-[var(--text-secondary)]">
            <Sparkles className="h-3 w-3 text-blue-400" />
            <span>Popular Roles (Click to select):</span>
          </span>

          <div className="flex flex-wrap gap-1.5">
            {POPULAR_ROLES.map((role) => {
              const isSelected = currentRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setValue('roleTitle', role, { shouldValidate: true })}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium transition-all',
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/50'
                      : 'bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:bg-blue-500/20 hover:text-blue-300'
                  )}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Seniority Level Selector */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold text-[var(--text-primary)]">
          Target Seniority Level *
        </Label>

        <div className="grid gap-3 sm:grid-cols-2">
          {SENIORITY_OPTIONS.map((opt) => {
            const isSelected = currentSeniority === opt.level;
            const Icon = opt.icon;

            return (
              <div
                key={opt.level}
                onClick={() => setValue('seniorityLevel', opt.level, { shouldValidate: true })}
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
                        {opt.experience}
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

        {errors.seniorityLevel && (
          <p className="text-xs text-red-400">{errors.seniorityLevel.message}</p>
        )}
      </div>
    </div>
  );
}
