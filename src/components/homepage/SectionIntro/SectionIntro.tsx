'use client';

import Link from 'next/link';

import { RevealText } from '@/components/motion';
import { DotGrid } from '@/components/homepage/shared/DotGrid';
import { cn } from '@/lib/utils';

/**
 * The centred label + heading block the page uses twice — once to open the
 * "Built by the Industry" section (621px tall) and once for "How it Works"
 * (810px), where it also carries a link.
 *
 * The link reproduces the site's `.link-active` underline: it rests collapsed to
 * the right and sweeps open from the left on hover, then collapses back the way
 * it came on leave. Gated behind `fine:` so a touch device never sticks in the
 * hovered state, and mirrored on `focus-visible` for keyboard users.
 */
export interface SectionIntroProps {
  label: string;
  heading: string;
  linkLabel?: string;
  linkHref?: string;
  className?: string;
}

export function SectionIntro({
  label,
  heading,
  linkLabel,
  linkHref,
  className,
}: SectionIntroProps) {
  return (
    <section
      className={cn(
        'relative flex w-full flex-col items-center justify-center overflow-hidden',
        'bg-[var(--c-white)] py-[7.5rem] lg:py-[10rem]',
        className,
      )}
    >
      <DotGrid />
      <div className="site-gutter relative z-[1] flex flex-col items-center gap-8">
        <p
          className={cn(
            'label m-0 text-center uppercase',
            'text-[1.0625rem] leading-[0.95] tracking-[-0.0106rem]',
            'lg:text-[1.25rem] lg:tracking-[-0.0125rem]',
          )}
        >
          {label}
        </p>
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
