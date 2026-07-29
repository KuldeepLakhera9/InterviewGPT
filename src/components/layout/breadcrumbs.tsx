'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const PATH_NAME_MAP: Record<string, string> = {
  dashboard: 'Overview',
  resumes: 'Resumes',
  interviews: 'Mock Interviews',
  scorecards: 'Scorecards',
  roadmap: 'Skill Roadmap',
  settings: 'Settings',
  profile: 'Profile',
  security: 'Security & Auth',
  workspace: 'Workspace',
  notifications: 'Notifications',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-1.5 text-xs text-[var(--text-secondary)]"
    >
      <Link
        href="/dashboard"
        className="flex items-center transition-colors hover:text-[var(--text-primary)]"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">Home</span>
      </Link>

      {segments.map((segment, index) => {
        const url = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        const displayName = PATH_NAME_MAP[segment] || segment.replace(/-/g, ' ');

        return (
          <React.Fragment key={url}>
            <ChevronRight className="h-3 w-3 text-[var(--text-tertiary)]" />
            {isLast ? (
              <span
                className="font-semibold text-[var(--text-primary)] capitalize"
                aria-current="page"
              >
                {displayName}
              </span>
            ) : (
              <Link
                href={url}
                className="capitalize transition-colors hover:text-[var(--text-primary)]"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
