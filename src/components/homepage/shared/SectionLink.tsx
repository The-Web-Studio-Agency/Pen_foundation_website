import Link from 'next/link';

import { cn } from '@/lib/utils';

/**
 * The site's `.link-active` underline treatment, extracted so the sections
 * added below the fold reuse it rather than restating it a fourth time.
 *
 * The markup is lifted verbatim from `SectionIntro` — same classes, same
 * timing, same `fine:` gate so a touch device never sticks in the hovered
 * state, same `focus-visible` mirror for keyboard users. This is not a new
 * button style; it is the one the page already uses, given a name.
 *
 * `SectionIntro` and `WhyPen` deliberately still carry their own copy of it:
 * they are approved as-is and there is nothing to gain from editing them.
 */
export interface SectionLinkProps {
  label: string;
  href: string;
  className?: string;
}

export function SectionLink({ label, href, className }: SectionLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'label-4 group relative inline-block overflow-hidden uppercase no-underline',
        'text-[var(--c-dark-green)]',
        className,
      )}
    >
      {label}
      <span
        aria-hidden
        className={cn(
          'absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-current',
          'transition-transform duration-[600ms] ease-wipe',
          'fine:group-hover:origin-left fine:group-hover:scale-x-100',
          'group-focus-visible:origin-left group-focus-visible:scale-x-100',
        )}
      />
    </Link>
  );
}
