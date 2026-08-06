import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Set false when the section supplies its own padding (full-bleed media). */
  padded?: boolean;
}

/**
 * Full-bleed section shell — the standard vertical rhythm and gutter.
 *
 * Replaces the old `Scene`, whose `bg` prop took five environment names that
 * all mapped to the same white. Callers now set their own background class,
 * which is honest about what actually happens.
 */
export function Section({ id, children, className, padded = true }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative w-full overflow-hidden bg-white text-ink',
        padded && 'px-6 py-[14vh] md:px-16 md:py-[18vh]',
        className,
      )}
    >
      {children}
    </section>
  );
}
