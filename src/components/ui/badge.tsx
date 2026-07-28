import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-[4px] border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--bg-surface-2)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]',
        secondary:
          'border-[var(--border-subtle)] bg-[var(--bg-surface-1)] text-[var(--text-secondary)]',
        success:
          'border-transparent bg-[var(--status-success)]/15 text-[var(--status-success)] border border-[var(--status-success)]/30',
        warning:
          'border-transparent bg-[var(--status-warning)]/15 text-[var(--status-warning)] border border-[var(--status-warning)]/30',
        danger:
          'border-transparent bg-[var(--status-danger)]/15 text-[var(--status-danger)] border border-[var(--status-danger)]/30',
        outline: 'border-[var(--border-strong)] text-[var(--text-primary)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
