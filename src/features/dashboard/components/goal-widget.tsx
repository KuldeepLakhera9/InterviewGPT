'use client';

import * as React from 'react';
import { Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockGoalData } from '@/features/dashboard/data/mock-dashboard-data';

export function GoalWidget() {
  const percentage = Math.round(
    (mockGoalData.completedSessions / mockGoalData.targetSessions) * 100
  );

  return (
    <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-medium tracking-wider text-[var(--text-secondary)] uppercase">
          Weekly Practice Goal
        </CardTitle>
        <Target className="h-4 w-4 text-[var(--accent-primary)]" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-sm font-semibold text-[var(--text-primary)]">
            {mockGoalData.title}
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-[var(--text-tertiary)]">
            <span>
              {mockGoalData.completedSessions} of {mockGoalData.targetSessions} completed
            </span>
            <span>{mockGoalData.daysRemaining} days left</span>
          </div>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-surface-2)]">
          <div
            className="h-full rounded-full bg-[var(--status-success)] transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
