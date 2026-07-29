'use client';

import * as React from 'react';
import { Calendar, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockUpcomingPractice } from '@/features/dashboard/data/mock-dashboard-data';

export function UpcomingPractice() {
  return (
    <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
      <CardHeader>
        <CardTitle className="text-base font-bold">Upcoming Practice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockUpcomingPractice.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3"
          >
            <div className="space-y-1">
              <span className="block text-xs font-semibold text-[var(--text-primary)]">
                {item.title}
              </span>
              <div className="flex items-center space-x-2 text-[10px] text-[var(--text-tertiary)]">
                <Badge variant="secondary" className="text-[10px]">
                  {item.type}
                </Badge>
                <span className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {item.scheduledTime}
                </span>
              </div>
            </div>

            <Button size="sm" variant="ghost" className="h-8 w-8 p-0" aria-label="Start practice">
              <Play className="h-4 w-4 text-[var(--accent-primary)]" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
