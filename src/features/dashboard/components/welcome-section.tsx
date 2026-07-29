'use client';

import * as React from 'react';
import { Sparkles, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { mockCandidateProfile } from '@/features/dashboard/data/mock-dashboard-data';

export function WelcomeSection() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1.5">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Welcome back, {mockCandidateProfile.name}
          </h2>
          <Sparkles className="h-5 w-5 animate-pulse text-[var(--accent-primary)]" />
        </div>
        <p className="text-sm text-[var(--text-secondary)]">
          Your interview readiness is looking strong. You are targeting{' '}
          <span className="font-semibold text-[var(--text-primary)]">
            {mockCandidateProfile.targetRole}
          </span>
          .
        </p>
      </div>

      <div className="flex shrink-0 items-center space-x-2">
        <Badge variant="secondary" className="flex items-center space-x-1.5 px-3 py-1">
          <Target className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
          <span>{mockCandidateProfile.targetCompanyTier}</span>
        </Badge>
      </div>
    </div>
  );
}
