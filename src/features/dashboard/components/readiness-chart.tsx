'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockReadinessTrend } from '@/features/dashboard/data/mock-dashboard-data';

export function ReadinessChart() {
  return (
    <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-bold">7-Day Readiness Trend</CardTitle>
        <span className="text-xs text-[var(--text-tertiary)]">Score (0-100)</span>
      </CardHeader>
      <CardContent>
        <div className="flex h-40 items-end justify-between gap-2 border-b border-[var(--border-subtle)] pt-4 pb-2">
          {mockReadinessTrend.map((point) => (
            <div key={point.day} className="flex flex-1 flex-col items-center space-y-1">
              <span className="text-[10px] font-semibold text-[var(--text-secondary)]">
                {point.score}
              </span>
              <div className="flex h-32 w-full items-end rounded-t-md bg-[var(--bg-surface-2)]">
                <div
                  className="w-full rounded-t-md bg-[var(--accent-primary)] transition-all duration-500"
                  style={{ height: `${point.score}%` }}
                />
              </div>
              <span className="text-[10px] text-[var(--text-tertiary)]">{point.day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
