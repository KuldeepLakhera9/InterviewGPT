import * as React from 'react';
import { cn } from '@/lib/utils';

export type KbdProps = React.HTMLAttributes<HTMLElement>;

const Kbd = React.forwardRef<HTMLElement, KbdProps>(({ className, ...props }, ref) => {
  return (
    <kbd
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-[4px] border border-[var(--border-strong)] bg-[var(--bg-surface-2)] px-1.5 font-mono text-[10px] font-semibold text-[var(--text-tertiary)] shadow-sm select-none',
        className
      )}
      {...props}
    />
  );
});
Kbd.displayName = 'Kbd';

export { Kbd };
