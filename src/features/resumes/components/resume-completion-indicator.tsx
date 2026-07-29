'use client';

import * as React from 'react';
import { Briefcase, CheckCircle2, Code2, GraduationCap, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ParsedResumeRecord } from '../types/resume.types';

interface ResumeCompletionIndicatorProps {
  parsedResume?: ParsedResumeRecord | null;
  className?: string;
}

export function ResumeCompletionIndicator({
  parsedResume,
  className = '',
}: ResumeCompletionIndicatorProps) {
  if (!parsedResume) {
    return (
      <div
        className={`flex items-center space-x-2 text-xs text-[var(--text-secondary)] ${className}`}
      >
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-400"
        >
          Parsing Pending
        </Badge>
      </div>
    );
  }

  const overall = parsedResume.overallConfidence || 85;
  const structured = (parsedResume.structuredData || {}) as Record<string, unknown>;

  const hasPersonalInfo = Boolean(structured.personalInfo);
  const hasSkills = Array.isArray(structured.skills) && structured.skills.length > 0;
  const hasExperience =
    Array.isArray(structured.workExperience) && structured.workExperience.length > 0;
  const hasEducation = Array.isArray(structured.education) && structured.education.length > 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-[10px] font-semibold text-emerald-400"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" /> Parsed & Indexed
          </Badge>
          <span className="text-[11px] font-bold text-[var(--text-primary)]">
            {overall}% Extraction Completeness
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
          style={{ width: `${overall}%` }}
        />
      </div>

      {/* Field Section Indicators */}
      <div className="flex items-center space-x-3 pt-1 text-[10px]">
        <span
          className={`flex items-center space-x-1 ${
            hasPersonalInfo ? 'font-semibold text-emerald-400' : 'text-zinc-500 line-through'
          }`}
        >
          <User className="h-3 w-3" />
          <span>Identity</span>
        </span>

        <span
          className={`flex items-center space-x-1 ${
            hasSkills ? 'font-semibold text-emerald-400' : 'text-zinc-500 line-through'
          }`}
        >
          <Code2 className="h-3 w-3" />
          <span>Skills</span>
        </span>

        <span
          className={`flex items-center space-x-1 ${
            hasExperience ? 'font-semibold text-emerald-400' : 'text-zinc-500 line-through'
          }`}
        >
          <Briefcase className="h-3 w-3" />
          <span>Experience</span>
        </span>

        <span
          className={`flex items-center space-x-1 ${
            hasEducation ? 'font-semibold text-emerald-400' : 'text-zinc-500 line-through'
          }`}
        >
          <GraduationCap className="h-3 w-3" />
          <span>Education</span>
        </span>
      </div>
    </div>
  );
}
