'use client';

import * as React from 'react';
import { ErrorState } from '@/components/common/error-state';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('❌ Page Error Boundary Captured:', error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6">
      <ErrorState
        title="Application Error"
        description={error.message || 'An unexpected error occurred while rendering this page.'}
        reset={reset}
        actionLabel="Try Again"
      />
    </div>
  );
}
