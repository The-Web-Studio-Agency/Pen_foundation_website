import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface MonoProps {
  children: ReactNode;
  className?: string;
}

/** Small monospaced caps — metadata, labels, categories. */
export function Mono({ children, className }: MonoProps) {
  return (
    <span
      className={cn('font-mono text-[10px] tracking-[0.3em] uppercase md:text-[11px]', className)}
    >
      {children}
    </span>
  );
}
