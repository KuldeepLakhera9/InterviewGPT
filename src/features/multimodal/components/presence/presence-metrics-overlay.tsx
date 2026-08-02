'use client';

import * as React from 'react';
import { UserCheck, Info } from 'lucide-react';
import type { PresenceMetricsData } from '../../types/multimodal.types';
import { cn } from '@/lib/utils';

interface PresenceMetricsOverlayProps {
  metrics: PresenceMetricsData;
}

export function PresenceMetricsOverlay({ metrics }: PresenceMetricsOverlayProps) {
  return (
    <div
      id="presence-metrics-overlay"
      className="space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <UserCheck className="h-4 w-4 text-purple-400" />
          <h4 className="text-xs font-bold text-[var(--text-primary)]">Webcam Presence Metrics</h4>
        </div>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
            metrics.overallPresenceScore > 80
              ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
              : 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
          )}
        >
          Score: {metrics.overallPresenceScore} / 100
        </span>
      </div>

      {/* Grid of Micro-Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        {/* Face Centered */}
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-2 text-center">
          <span className="block text-[10px] text-[var(--text-tertiary)]">Face Centering</span>
          <span className="font-bold text-[var(--text-primary)]">{metrics.faceCentredScore}%</span>
        </div>

        {/* Posture */}
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-2 text-center">
          <span className="block text-[10px] text-[var(--text-tertiary)]">Posture</span>
          <span className="font-bold text-[var(--text-primary)] capitalize">
            {metrics.postureQuality.replace('_', ' ')}
          </span>
        </div>

        {/* Lighting */}
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-2 text-center">
          <span className="block text-[10px] text-[var(--text-tertiary)]">Lighting</span>
          <span className="font-bold text-[var(--text-primary)]">{metrics.lightingScore}%</span>
        </div>

        {/* Eye Contact */}
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-2 text-center">
          <span className="block text-[10px] text-[var(--text-tertiary)]">Eye Contact</span>
          <span className="font-bold text-emerald-400">
            {metrics.isEyeContactEstimated ? 'Aligned' : 'Off-center'}
          </span>
        </div>
      </div>

      {/* Strict Ethical Disclaimer Requirement */}
      <div className="flex items-start space-x-2 rounded-lg border border-purple-500/20 bg-purple-500/5 p-2.5 text-[10px] text-[var(--text-secondary)]">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-400" />
        <p>{metrics.disclaimer}</p>
      </div>
    </div>
  );
}
