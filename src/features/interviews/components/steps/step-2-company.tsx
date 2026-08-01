'use client';

import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Building2, Globe, Rocket, Landmark, Flame, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CompanyTier, InterviewConfigData } from '../../types/interview-wizard.types';
import { cn } from '@/lib/utils';

interface Step2CompanyProps {
  form: UseFormReturn<InterviewConfigData>;
}

const POPULAR_COMPANIES = [
  'Google',
  'Amazon',
  'Meta',
  'Apple',
  'Microsoft',
  'Stripe',
  'Netflix',
  'Uber',
  'OpenAI',
  'Airbnb',
  'Snowflake',
  'Salesforce',
];

const COMPANY_TIER_OPTIONS: {
  tier: CompanyTier;
  title: string;
  badgeText: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
}[] = [
  {
    tier: 'faang',
    title: 'FAANG / Big Tech',
    badgeText: 'Google, Meta, Apple, Amazon, Netflix',
    description:
      'Extremely high algorithmic bar, massive scale system design & strict leadership rubrics.',
    icon: Flame,
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  {
    tier: 'startup',
    title: 'High-Growth Unicorn',
    badgeText: 'Stripe, OpenAI, Airbnb, Uber',
    description:
      'Fast-paced pragmatism, deep domain product engineering & system architecture execution.',
    icon: Rocket,
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
  {
    tier: 'enterprise',
    title: 'Enterprise SaaS',
    badgeText: 'Microsoft, Salesforce, Snowflake',
    description:
      'Focuses on maintainability, enterprise security standards, microservices & multi-tenancy.',
    icon: Building2,
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  },
  {
    tier: 'fintech',
    title: 'FinTech / Quantitative',
    badgeText: 'HFT, Stripe, Coinbase, Robinhood',
    description:
      'High concurrency, low-latency performance, financial data precision & compliance.',
    icon: Landmark,
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  {
    tier: 'early_stage',
    title: 'Early Stage Startup',
    badgeText: 'Seed - Series A Startups',
    description: '0-to-1 building speed, full-stack breadth, versatility & extreme owner mindset.',
    icon: Globe,
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  },
];

export function Step2Company({ form }: Step2CompanyProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const currentTier = watch('companyTier');
  const currentCompany = watch('companyName');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
          Step 2: Select Target Company & Tier
        </h2>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Select your target company environment to align interviewer style and standards.
        </p>
      </div>

      {/* Company Tier Selection Cards */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold text-[var(--text-primary)]">
          Target Company Tier *
        </Label>

        <div className="grid gap-3 sm:grid-cols-2">
          {COMPANY_TIER_OPTIONS.map((opt) => {
            const isSelected = currentTier === opt.tier;
            const Icon = opt.icon;

            return (
              <div
                key={opt.tier}
                onClick={() => setValue('companyTier', opt.tier, { shouldValidate: true })}
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

        {errors.companyTier && <p className="text-xs text-red-400">{errors.companyTier.message}</p>}
      </div>

      {/* Target Company Name Input */}
      <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4">
        <Label htmlFor="companyName" className="text-xs font-semibold text-[var(--text-primary)]">
          Specific Company Name (Optional)
        </Label>

        <Input
          id="companyName"
          placeholder="e.g. Google, Stripe, OpenAI"
          {...register('companyName')}
          className="bg-[var(--bg-surface-2)] text-xs"
        />

        {errors.companyName && <p className="text-xs text-red-400">{errors.companyName.message}</p>}

        {/* Quick Company Selection Chips */}
        <div className="space-y-1.5 pt-2">
          <span className="flex items-center space-x-1 text-[11px] font-medium text-[var(--text-secondary)]">
            <Sparkles className="h-3 w-3 text-purple-400" />
            <span>Popular Target Companies (Click to select):</span>
          </span>

          <div className="flex flex-wrap gap-1.5">
            {POPULAR_COMPANIES.map((company) => {
              const isSelected = currentCompany === company;
              return (
                <button
                  key={company}
                  type="button"
                  onClick={() => setValue('companyName', company, { shouldValidate: true })}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium transition-all',
                    isSelected
                      ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-400/50'
                      : 'bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:bg-purple-500/20 hover:text-purple-300'
                  )}
                >
                  {company}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
