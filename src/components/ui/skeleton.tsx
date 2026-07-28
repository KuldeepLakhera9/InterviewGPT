import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-[6px] bg-[var(--bg-surface-2)]', className)}
      {...props}
    />
  );
}

export { Skeleton };
