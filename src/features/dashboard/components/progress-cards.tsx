'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockPillarScores } from '@/features/dashboard/data/mock-dashboard-data';

export function ProgressCards() {
  return (
    <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
      <CardHeader>
        <CardTitle className="text-base font-bold">4-Pillar Skill Evaluation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockPillarScores.map((pillar) => (
          <div key={pillar.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[var(--text-primary)]">{pillar.name}</span>
              <div className="flex items-center space-x-2">
                <span className="font-bold">{pillar.score}%</span>
                <Badge
                  variant={pillar.status === 'excellent' ? 'success' : 'secondary'}
                  className="text-[10px] uppercase"
                >
                  {pillar.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--bg-surface-2)]">
              <div
                className="h-full rounded-full bg-[var(--accent-primary)] transition-all duration-500"
                style={{ width: `${pillar.score}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
