'use client';

import { RevealText } from '@/components/motion';
import { SectionLink } from '@/components/homepage/shared/SectionLink';
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
        {/* `SectionLink` rather than the copy of it that used to live here.
            The two were the same markup, so the copy also carried the same
            9px-tall tap target — see that component for the fix. */}
        {linkLabel ? <SectionLink label={linkLabel} href={linkHref ?? '#'} /> : null}
      </div>
    </section>
  );
}
