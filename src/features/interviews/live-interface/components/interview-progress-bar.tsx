'use client';

import * as React from 'react';
import { SessionControlBar } from '../../session-management/components/session-control-bar';
import type { SessionStatus } from '../../session-management/types/session-management.types';

interface InterviewProgressBarProps {
  sessionId: string;
  roleTitle: string;
  status: SessionStatus;
  currentQuestionIndex: number;
  totalQuestions: number;
  elapsedSeconds?: number;
  durationMinutes?: number;
  lastSavedAt?: Date | string | null;
  onStatusChange?: () => void;
}

export function InterviewProgressBar({
  sessionId,
  status,
  currentQuestionIndex,
  totalQuestions,
  elapsedSeconds = 0,
  lastSavedAt,
  onStatusChange,
}: InterviewProgressBarProps) {
  const percentComplete = Math.min(
    Math.round(
      ((currentQuestionIndex + (status === 'completed' ? 1 : 0)) / (totalQuestions || 1)) * 100
    ),
    100
  );

  return (
    <div className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-4 shadow-sm">
      {/* Session Control Header Bar */}
      <SessionControlBar
        sessionId={sessionId}
        status={status}
        elapsedSeconds={elapsedSeconds}
        lastSavedAt={lastSavedAt}
        onStatusChange={onStatusChange}
      />

      {/* Progress Bar & Indicators */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[var(--text-primary)]">
            Interview Question Progress: {currentQuestionIndex + (status === 'completed' ? 1 : 0)}{' '}
            of {totalQuestions}
          </span>
          <span className="font-bold text-blue-400">{percentComplete}% Completed</span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-surface-2)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>
    </div>
  );
}
