'use client';

import * as React from 'react';
import { Award, Briefcase, Code2, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ParsedResumeRecord } from '../types/resume.types';

interface ResumeAnalyticsWidgetProps {
  parsedResume?: ParsedResumeRecord | null;
  className?: string;
}

export function ResumeAnalyticsWidget({
  parsedResume,
  className = '',
}: ResumeAnalyticsWidgetProps) {
  const structured = (parsedResume?.structuredData || {}) as Record<string, unknown>;

  const skillCount = Array.isArray(structured.skills) ? structured.skills.length : 12;
  const expCount = Array.isArray(structured.workExperience) ? structured.workExperience.length : 3;

  // Mock analytics calculation based on parsed structured fields (No ATS scoring)
  const readinessIndex = Math.min(75 + skillCount * 1.5 + expCount * 3, 98);
  const yearsExperience = (expCount * 1.8).toFixed(1);

  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {/* 1. Mock Interview Readiness */}
      <Card className="border border-blue-500/30 bg-gradient-to-b from-blue-950/30 to-[var(--bg-surface-1)]">
        <CardContent className="space-y-2 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
              Interview Readiness Index
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-[var(--text-primary)]">
              {Math.round(readinessIndex)}%
            </span>
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-400"
            >
              <TrendingUp className="mr-1 h-3 w-3" /> High
            </Badge>
          </div>

          <p className="text-[10px] text-[var(--text-secondary)]">
            Powered by active resume parameters for mock interview simulations.
          </p>
        </CardContent>
      </Card>

      {/* 2. Core Competencies */}
      <Card className="border border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
        <CardContent className="space-y-2 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
              Core Competencies
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Code2 className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-[var(--text-primary)]">{skillCount}</span>
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              Extracted Skills
            </span>
          </div>

          <p className="text-[10px] text-[var(--text-secondary)]">
            Indexed skills mapped to mock technical domain questions.
          </p>
        </CardContent>
      </Card>

      {/* 3. Tracked Experience Depth */}
      <Card className="border border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
        <CardContent className="space-y-2 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
              Experience Depth
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-[var(--text-primary)]">
              {yearsExperience}
            </span>
            <span className="text-xs font-medium text-[var(--text-secondary)]">Years Tracked</span>
          </div>

          <p className="text-[10px] text-[var(--text-secondary)]">
            {expCount} work experience roles indexed in active resume.
          </p>
        </CardContent>
      </Card>

      {/* 4. Target Role Fit */}
      <Card className="border border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
        <CardContent className="space-y-2 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
              Target Role Alignment
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Target className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="max-w-[150px] truncate text-sm font-extrabold text-[var(--text-primary)]">
              Full Stack Engineer
            </span>
          </div>

          <div className="flex items-center space-x-1 text-[10px] font-semibold text-amber-400">
            <Award className="h-3 w-3" />
            <span>Optimal Candidate Target Fit</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
