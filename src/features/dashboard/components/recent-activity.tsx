'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Clock, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { mockRecentActivity } from '@/features/dashboard/data/mock-dashboard-data';

export function RecentActivity() {
  if (mockRecentActivity.length === 0) {
    return (
      <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
        <CardHeader>
          <CardTitle className="text-base font-bold">Recent Practice Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<History className="h-6 w-6" />}
            title="No sessions completed yet"
            description="Start your first AI mock interview session to get instant scorecard telemetry."
            action={
              <Button size="sm" asChild>
                <Link href="/interviews">Start First Session</Link>
              </Button>
            }
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-bold">Recent Practice Sessions</CardTitle>
        <Link
          href="/scorecards"
          className="flex items-center text-xs text-[var(--accent-primary)] hover:underline"
        >
          View all
          <ChevronRight className="ml-0.5 h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockRecentActivity.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-app)] p-3 transition-colors hover:bg-[var(--bg-surface-hover)]"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-[10px]">
                  {session.track}
                </Badge>
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {session.role}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-[10px] text-[var(--text-tertiary)]">
                <span className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {session.durationMinutes} mins
                </span>
                <span>•</span>
                <span>{session.date}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-extrabold text-[var(--accent-primary)]">
                {session.score}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
