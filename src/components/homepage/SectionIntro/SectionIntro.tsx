'use client';

import Link from 'next/link';

import { RevealText } from '@/components/motion';
import { TechnicalGridBackground } from '@/components/shared/backgrounds/TechnicalGridBackground';
import { cn } from '@/lib/utils';

/**
 * The centred heading block the page uses twice — once to open the
 * "Built by the Industry" section (621px tall) and once for "How it Works"
 * (810px), where it also carries a link.
 *
 * The link reproduces the site's `.link-active` underline: it rests collapsed to
 * the right and sweeps open from the left on hover, then collapses back the way
 * it came on leave. Gated behind `fine:` so a touch device never sticks in the
 * hovered state, and mirrored on `focus-visible` for keyboard users.
 *
 * The backdrop is `TechnicalGridBackground`: the same faint grid with a "+" at
 * every intersection, plus teal traces running along the lines.
 *
 * It replaces the `DotGrid` + `GridBeam` pair that used to sit here. Those were
 * two components that did not know about each other — the beam was one wide
 * gradient sweeping over the grid, so it read as a soft glow rather than a line
 * following a route, and nothing made it land on a grid line. A trace has to be
 * drawn from the same coordinates as the grid it runs along, which means one
 * component owning both.
 */
export interface SectionIntroProps {
  /**
   * Anchor id. The validation chapter's evidence table used to carry
   * `#validation`; with that section gone, the heading owns it so the header's
   * Validation link still lands somewhere.
   */
  id?: string;
  heading: string;
  linkLabel?: string;
  linkHref?: string;
  className?: string;
}

export function SectionIntro({ id, heading, linkLabel, linkHref, className }: SectionIntroProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative flex w-full scroll-mt-nav flex-col items-center justify-center overflow-hidden',
        'bg-[var(--c-white)] py-[7.5rem] lg:py-[10rem]',
        className,
      )}
    >
      <TechnicalGridBackground />

      <div className="site-gutter relative z-[1] flex flex-col items-center gap-8">
        <h2 className="title-si max-w-[min(70rem,90vw)] text-center text-balance">
          <RevealText text={heading} />
        </h2>
        {linkLabel ? (
          <Link
            href={linkHref ?? '#'}
            className={cn(
              'label-4 group relative inline-block overflow-hidden uppercase no-underline',
              'text-[var(--c-dark-green)]',
            )}
          >
            {linkLabel}
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
        ) : null}
      </div>
    </section>
  );
}
