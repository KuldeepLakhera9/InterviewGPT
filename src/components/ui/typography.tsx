import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const headingVariants = cva('font-semibold tracking-tight text-[var(--text-primary)]', {
  variants: {
    level: {
      h1: 'text-3xl lg:text-4xl font-extrabold',
      h2: 'text-2xl lg:text-3xl border-b border-[var(--border-subtle)] pb-2',
      h3: 'text-xl lg:text-2xl',
      h4: 'text-lg font-semibold',
    },
  },
  defaultVariants: {
    level: 'h1',
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

export function Heading({ className, level = 'h1', as, ...props }: HeadingProps) {
  const Component = (as || level || 'h1') as 'h1' | 'h2' | 'h3' | 'h4';
  return <Component className={cn(headingVariants({ level }), className)} {...props} />;
}

const textVariants = cva('text-[var(--text-primary)]', {
  variants: {
    variant: {
      default: 'text-base leading-relaxed',
      lead: 'text-xl text-[var(--text-secondary)] font-normal',
      large: 'text-lg font-medium',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-[var(--text-tertiary)]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div';
}

export function Text({ className, variant = 'default', as = 'p', ...props }: TextProps) {
  const Component = as;
  return <Component className={cn(textVariants({ variant }), className)} {...props} />;
}

export type CodeProps = React.HTMLAttributes<HTMLElement>;

export function Code({ className, ...props }: CodeProps) {
  return (
    <code
      className={cn(
        'relative rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] px-[0.3rem] py-[0.2rem] font-mono text-xs font-semibold text-[var(--text-primary)]',
        className
      )}
      {...props}
    />
  );
}
