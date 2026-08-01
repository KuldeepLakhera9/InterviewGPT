'use client';

import * as React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ResumeRecommendationItem } from '../types/interview-wizard.types';

interface ResumeRecommendationCardProps {
  recommendation?: ResumeRecommendationItem;
  onApplyRecommendation: (rec: ResumeRecommendationItem) => void;
}

export function ResumeRecommendationCard({
  recommendation,
  onApplyRecommendation,
}: ResumeRecommendationCardProps) {
  if (!recommendation) return null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-blue-950/40 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 rounded-full border border-indigo-500/30 bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              <span>Resume Intelligence Match</span>
            </span>
            <span className="inline-flex items-center space-x-1 text-xs font-medium text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{recommendation.matchScore}% Target Match</span>
            </span>
          </div>

          <h3 className="flex items-center space-x-1.5 pt-1 text-sm font-bold tracking-tight text-white">
            <FileText className="h-4 w-4 text-purple-400" />
            <span>Recommended for: {recommendation.suggestedRoleTitle}</span>
          </h3>

          <p className="line-clamp-2 text-xs text-slate-300">{recommendation.rationale}</p>

          <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
            <span className="rounded-md border border-purple-500/20 bg-purple-500/20 px-2 py-0.5 text-purple-200">
              Seniority: {recommendation.suggestedSeniority.toUpperCase()}
            </span>
            <span className="rounded-md border border-blue-500/20 bg-blue-500/20 px-2 py-0.5 text-blue-200">
              Track: {recommendation.suggestedTrack.replace('_', ' ').toUpperCase()}
            </span>
            <span className="rounded-md border border-emerald-500/20 bg-emerald-500/20 px-2 py-0.5 text-emerald-200">
              Difficulty: {recommendation.suggestedDifficulty.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="shrink-0 pt-2 sm:pt-0">
          <Button
            type="button"
            size="sm"
            onClick={() => onApplyRecommendation(recommendation)}
            className="w-full space-x-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-xs font-medium text-white shadow-md hover:from-indigo-500 hover:to-blue-500 sm:w-auto"
          >
            <span>Apply AI Recommendation</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
