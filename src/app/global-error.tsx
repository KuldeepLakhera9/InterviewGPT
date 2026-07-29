'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('💥 Global Critical Error Captured:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#0f0f11] p-6 text-[#fafafa]">
        <div className="max-w-md space-y-4 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-red-500">
            Critical System Failure
          </h1>
          <p className="text-xs text-zinc-400">
            A fatal error occurred in the application shell. Please reset or contact support.
          </p>
          <Button onClick={() => reset()} size="sm" variant="default">
            Reset Application
          </Button>
        </div>
      </body>
    </html>
  );
}
