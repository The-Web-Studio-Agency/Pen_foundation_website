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
/*
 * The vertical rhythm is viewport-relative but BOUNDED.
 *
 * It was a flat `py-[14vh] md:py-[18vh]`, which ties the space between sections
 * to how tall the window happens to be. That reads correctly on a laptop —
 * 18vh of 900px is 162px — and then grows without limit on anything taller: on
 * a 1366px portrait tablet the same rule asks for 246px above AND below every
 * section, so /engineering's nine sections carried roughly 1,500px of padding
 * that exists for no reason other than the viewport being tall.
 *
 * The clamps are chosen so the laptop case is untouched and only the runaway
 * end is cut: at 900px tall the `md` rule still resolves to 162px, at 1024 to
 * 176px, and from there it holds. The floors matter on short landscape windows,
 * where 14vh of a 500px-tall browser would otherwise collapse to 70px and the
 * sections would run together.
 */
export function Section({ id, children, className, padded = true }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative w-full overflow-hidden bg-white text-ink',
        padded &&
          'px-6 py-[clamp(4.5rem,14vh,9rem)] md:px-16 md:py-[clamp(6rem,18vh,11rem)]',
        className,
      )}
    >
      {children}
    </section>
  );
}
