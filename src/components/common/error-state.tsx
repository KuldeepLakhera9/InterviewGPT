'use client';

import * as React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorStateProps {
  title?: string;
  description?: string;
  reset?: () => void;
  actionLabel?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected runtime error occurred while processing your request.',
  reset,
  actionLabel = 'Try Again',
}: ErrorStateProps) {
  return (
    <Card className="mx-auto max-w-md border-[var(--status-danger)]/30 bg-[var(--bg-surface-1)] shadow-lg">
      <CardContent className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--status-danger)]/10 text-[var(--status-danger)]">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-[var(--text-primary)]">{title}</h3>
          <p className="max-w-xs text-xs leading-relaxed text-[var(--text-secondary)]">
            {description}
          </p>
        </div>

        {reset && (
          <Button onClick={reset} size="sm" variant="outline" className="mt-2">
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
