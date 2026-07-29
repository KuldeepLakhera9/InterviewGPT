import * as React from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = 'Loading workspace data...' }: LoadingStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center space-y-4 p-6 text-center">
      <Spinner size="lg" />
      <p className="animate-pulse text-xs font-medium text-[var(--text-secondary)]">{label}</p>
      <div className="w-full max-w-sm space-y-2 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mx-auto h-4 w-3/4" />
      </div>
    </div>
  );
}
