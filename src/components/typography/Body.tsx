import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface BodyProps {
  children: ReactNode;
  className?: string;
}

/** Standard body copy. Measure is capped at 46ch for readability. */
export function Body({ children, className }: BodyProps) {
  return (
    <p className={cn('max-w-[46ch] text-base leading-relaxed font-light md:text-lg', className)}>
      {children}
    </p>
  );
}
