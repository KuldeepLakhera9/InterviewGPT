'use client';

import * as React from 'react';
import { Activity, Award, CheckCircle2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockKpis } from '@/features/dashboard/data/mock-dashboard-data';

const KPI_ICONS = {
  readiness: Award,
  sessions: CheckCircle2,
  alignment: TrendingUp,
  speech: Activity,
};

export function KpiGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {mockKpis.map((kpi) => {
        const Icon = KPI_ICONS[kpi.id as keyof typeof KPI_ICONS] || Activity;

        return (
          <Card key={kpi.id} className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium tracking-wider text-[var(--text-secondary)] uppercase">
                {kpi.label}
              </CardTitle>
              <Icon className="h-4 w-4 text-[var(--text-tertiary)]" />
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
                {kpi.value}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--status-success)]">{kpi.change}</span>
                <span className="max-w-[120px] truncate text-[var(--text-tertiary)]">
                  {kpi.description}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
