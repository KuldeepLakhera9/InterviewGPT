import * as React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-in fade-in-50 flex min-h-[280px] w-full flex-col items-center justify-center rounded-[10px] border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface-1)]/50 p-8 text-center',
          className
        )}
        {...props}
      >
        {icon && (
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] text-[var(--text-secondary)]">
            {icon}
          </div>
        )}
        <h3 className="text-base font-semibold text-[var(--text-primary)]">{title}</h3>
        {description && (
          <p className="mt-1.5 max-w-sm text-sm text-[var(--text-secondary)]">{description}</p>
        )}
        {action && <div className="mt-6">{action}</div>}
        {children}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';

export { EmptyState };
