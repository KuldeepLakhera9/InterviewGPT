import * as React from 'react';

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only text-xs font-medium focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-[var(--accent-primary)] focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:outline-none"
    >
      Skip to main content
    </a>
  );
}
