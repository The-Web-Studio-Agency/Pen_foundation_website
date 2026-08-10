import Link from 'next/link';

import { cn } from '@/lib/utils';

/**
 * The site's `.link-active` underline treatment, extracted so the sections
 * added below the fold reuse it rather than restating it a fourth time.
 *
 * Same classes, same timing, same `fine:` gate so a touch device never sticks
 * in the hovered state, same `focus-visible` mirror for keyboard users. This is
 * not a new button style; it is the one the page already uses, given a name.
 *
 * TWO ELEMENTS, NOT ONE. The anchor is the hit target and the inner span is the
 * type. `label-4` is 11px on a line-height of 0.81, so the anchor used to be a
 * 9px-tall box — measured on the homepage, six section calls to action ("See
 * all projects", "Check PEN for my project", …) each had a 9px tap target,
 * which is a quarter of the 44px a fingertip needs and the smallest interactive
 * element on the site.
 *
 * It could not be fixed by padding the anchor, because the underline is
 * `absolute bottom-0` of its containing block: padding the anchor moves the
 * rule down with it and leaves it floating below the word. So the span became
 * the containing block — it keeps the rule welded to the text at exactly the
 * offset it had — and the anchor grew around it. `-my-2.5` gives most of that
 * height back to the layout, so the page's vertical rhythm is nearly unchanged
 * while the target clears 44px.
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
        'label-4 group -my-2.5 inline-flex min-h-11 items-center uppercase no-underline',
        'text-[var(--c-dark-green)]',
        className,
      )}
    >
      <span className="relative inline-block overflow-hidden">
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
      </span>
    </Link>
  );
}
