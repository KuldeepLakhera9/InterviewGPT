'use client';

import * as React from 'react';
import { Sparkles, Zap, Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import type { InterviewMode, LiveCoachingToastData } from '../../types/multimodal.types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LiveCoachingToastProps {
  interviewMode: InterviewMode;
  onToggleInterviewMode: (newMode: InterviewMode) => void;
  activeToasts: LiveCoachingToastData[];
  onDismissToast: (id: string) => void;
}

export function LiveCoachingToast({
  interviewMode,
  onToggleInterviewMode,
  activeToasts,
  onDismissToast,
}: LiveCoachingToastProps) {
  const isAssessment = interviewMode === 'assessment';

  return (
    <div id="live-coaching-container" className="space-y-3">
      {/* Mode Switcher Banner */}
      <div className="flex items-center justify-between rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-3">
        <div className="flex items-center space-x-2">
          {isAssessment ? (
            <Shield className="h-4 w-4 text-amber-400" />
          ) : (
            <Sparkles className="h-4 w-4 text-purple-400" />
          )}
          <div>
            <h4 className="text-xs font-bold text-[var(--text-primary)]">
              {isAssessment
                ? 'Assessment Mode (Strict Countdown)'
                : 'Practice Mode (Live AI Coach)'}
            </h4>
            <p className="text-[10px] text-[var(--text-secondary)]">
              {isAssessment
                ? 'Coaching toasts and hints suppressed for exam condition.'
                : 'Real-time micro-coaching enabled.'}
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => onToggleInterviewMode(isAssessment ? 'practice' : 'assessment')}
          variant="outline"
          size="sm"
          className="h-7 space-x-1 text-[10px] font-bold"
        >
          {isAssessment ? (
            <ToggleLeft className="h-3.5 w-3.5 text-gray-400" />
          ) : (
            <ToggleRight className="h-3.5 w-3.5 text-purple-400" />
          )}
          <span>{isAssessment ? 'Switch to Practice' : 'Switch to Assessment'}</span>
        </Button>
      </div>

      {/* Active Toast Hints (Practice Mode Only) */}
      {!isAssessment && activeToasts.length > 0 && (
        <div className="space-y-2">
          {activeToasts.map((toast) => (
            <div
              key={toast.id}
              className={cn(
                'animate-in fade-in slide-in-from-top-1 flex items-center justify-between rounded-lg border p-3 text-xs shadow-md transition-all',
                toast.severity === 'warning'
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                  : toast.severity === 'tip'
                    ? 'border-purple-500/30 bg-purple-500/10 text-purple-200'
                    : 'border-blue-500/30 bg-blue-500/10 text-blue-200'
              )}
            >
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 shrink-0" />
                <span className="font-semibold">{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => onDismissToast(toast.id)}
                className="text-[10px] font-bold text-gray-400 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
