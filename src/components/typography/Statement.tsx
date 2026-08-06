import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

const SIZES = {
  md: 'text-[clamp(2rem,4.4vw,3.6rem)]',
  lg: 'text-[clamp(2.6rem,6.2vw,6rem)]',
  xl: 'text-[clamp(3rem,8.5vw,9rem)]',
  mega: 'text-[clamp(3.6rem,15vw,16rem)]',
} as const;

interface StatementProps {
  children: ReactNode;
  size?: keyof typeof SIZES;
  className?: string;
  /** Render as a different heading level when the outline requires it. */
  as?: 'h1' | 'h2' | 'h3';
}

/** Oversized display statement. The size tiers keep page rhythm from flattening. */
export function Statement({ children, size = 'lg', className, as: Tag = 'h2' }: StatementProps) {
  return (
    <Tag className={cn('leading-[0.9] font-semibold tracking-[-0.035em]', SIZES[size], className)}>
      {children}
    </Tag>
  );
}
