'use client';

import * as React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';
import type { HiringRecommendationType, ReadinessRating } from '../types/evaluation.types';
import { cn } from '@/lib/utils';

interface HiringRecommendationBannerProps {
  recommendation: HiringRecommendationType;
  executiveSummary: string;
  evidence: {
    technicalEvidence: string[];
    communicationEvidence: string[];
    culturalAndBehaviouralEvidence: string[];
    concernsAndRisks: string[];
  };
  readinessRating: ReadinessRating;
  nextSteps: string[];
}

export function HiringRecommendationBanner({
  recommendation,
  executiveSummary,
  evidence,
  readinessRating,
  nextSteps,
}: HiringRecommendationBannerProps) {
  const getBannerStyle = (rec: HiringRecommendationType) => {
    switch (rec) {
      case 'Strong Hire':
        return {
          bg: 'bg-gradient-to-r from-emerald-950/80 via-emerald-900/50 to-teal-950/80 border-emerald-500/40',
          badge: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30',
          text: 'text-emerald-300',
        };
      case 'Hire':
        return {
          bg: 'bg-gradient-to-r from-blue-950/80 via-indigo-900/50 to-blue-900/80 border-blue-500/40',
          badge: 'bg-blue-600 text-white shadow-lg shadow-blue-500/30',
          text: 'text-blue-300',
        };
      case 'Lean Hire':
        return {
          bg: 'bg-gradient-to-r from-cyan-950/80 via-sky-900/50 to-cyan-900/80 border-cyan-500/40',
          badge: 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30',
          text: 'text-cyan-300',
        };
      case 'Lean Reject':
        return {
          bg: 'bg-gradient-to-r from-amber-950/80 via-orange-900/50 to-amber-900/80 border-amber-500/40',
          badge: 'bg-amber-600 text-white shadow-lg shadow-amber-500/30',
          text: 'text-amber-300',
        };
      case 'Reject':
        return {
          bg: 'bg-gradient-to-r from-rose-950/80 via-red-900/50 to-rose-900/80 border-rose-500/40',
          badge: 'bg-rose-600 text-white shadow-lg shadow-rose-500/30',
          text: 'text-rose-300',
        };
    }
  };

  const style = getBannerStyle(recommendation);

  return (
    <div
      id="hiring-recommendation-banner"
      className={cn('space-y-6 rounded-xl border p-6 shadow-md', style.bg)}
    >
      {/* Header */}
      <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <div className="space-y-1">
          <span className="text-xs font-semibold tracking-wider text-gray-300 uppercase">
            Recruiter Panel Recommendation
          </span>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-black text-white">{recommendation}</h2>
            <span
              className={cn(
                'rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase',
                style.badge
              )}
            >
              {readinessRating.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center space-x-2 sm:mt-0">
          <Award className="h-6 w-6 text-yellow-400" />
          <span className="text-xs font-semibold text-gray-300">
            Verified Evidence-Backed Report
          </span>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="rounded-lg border border-white/10 bg-black/40 p-4 text-xs leading-relaxed text-gray-200">
        <p className="font-semibold text-white">Executive Summary:</p>
        <p className="mt-1">{executiveSummary}</p>
      </div>

      {/* Evidence Breakdown Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 rounded-lg border border-white/10 bg-black/20 p-4">
          <span className="text-xs font-bold text-blue-300">Technical Depth Evidence</span>
          <ul className="space-y-1 text-xs text-gray-300">
            {evidence.technicalEvidence.map((e, idx) => (
              <li key={idx} className="flex items-start space-x-1.5">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" />
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 rounded-lg border border-white/10 bg-black/20 p-4">
          <span className="text-xs font-bold text-purple-300">
            Communication & Behavioral Evidence
          </span>
          <ul className="space-y-1 text-xs text-gray-300">
            {evidence.communicationEvidence
              .concat(evidence.culturalAndBehaviouralEvidence)
              .map((e, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-400" />
                  <span>{e}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* Next Steps */}
      <div className="flex flex-col justify-between space-y-2 border-t border-white/10 pt-2 text-xs text-gray-300 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <span className="font-bold text-white">Recommended Panel Action: </span>
          <span>{nextSteps[0]}</span>
        </div>
      </div>
    </div>
  );
}
