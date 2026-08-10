import Link from 'next/link';

import { RevealText } from '@/components/motion';
import { LinkedInIcon, XIcon, YouTubeIcon } from '@/components/shared/icons';
import { Logo } from '@/components/shared/icons/Logo';
import { NotchedBand } from '@/components/shared/shapes/NotchedBand';
import {
  footerBadge,
  footerColumns,
  footerContact,
  footerCta,
  footerSecondaryLink,
} from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { cn, FOOTER_NOTCH } from '@/lib/utils';

const SOCIAL_ICONS = {
  LinkedIn: LinkedInIcon,
  X: XIcon,
  YouTube: YouTubeIcon,
} as const;

/**
 * THE site footer. One footer, every route — rendered by the root layout, so
 * no page composes its own.
 *
 * Ported from the reference clone: a dark slab whose top edge carries the same
 * notch profile as the contact page's divider band, just wider and shallower,
 * opening on a full-width CTA whose heading reveals character by character.
 *
 * Copy comes from `@/config/navigation` and `@/config/site` rather than a data
 * blob of its own — `arch:check` keeps navigation to a single source, and the
 * footer this replaced already read from there.
 *
 * `font-sans` on the heading is now what every heading inherits anyway — the
 * site-wide serif rule it used to override has been removed — but it is left
 * stated because this slogan is the one piece of type repeated on every route,
 * and it should not change typeface if the cascade above it ever does.
 */
export function SiteFooter() {
  const decorativeLine = 'pointer-events-none absolute rounded-[50%] border border-white/[0.06]';
  /* `py-1.5` with no gap on the list rather than `gap-3` with none: identical
     spacing on screen, but each link is a ~41px touch target instead of the
     29px text box it was. Footer links were the smallest tap targets on the
     site. */
  const linkClass =
    'body-3 inline-block py-1.5 text-[var(--c-white)] no-underline transition-colors duration-200 fine:hover:text-[var(--c-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--c-accent)]';

  return (
    <NotchedBand
      dip={FOOTER_NOTCH.dip}
      shoulder={FOOTER_NOTCH.shoulder}
      run={FOOTER_NOTCH.run}
      radius={FOOTER_NOTCH.radius}
      edges={{ top: true }}
    >
      <footer
        className={cn(
          'relative w-full overflow-hidden bg-ink text-[var(--c-white)]',
          'pt-20 pb-[2.09375rem] md:pt-[7.8125rem]',
          'lg:pt-[14.375rem] lg:pb-5',
        )}
      >
        {/* Direct children of the slab, not of the content column below: both
            are positioned against the footer's own box and are clipped by its
            `overflow-hidden`. */}
        <span aria-hidden className={cn(decorativeLine, '-top-40 -left-60 size-[36rem]')} />
        <span aria-hidden className={cn(decorativeLine, 'top-10 -right-80 size-[46rem]')} />

        {/*
         * The footer's content sits on the same column as the page above it.
         *
         * The grid used to be the `<footer>` element itself, carrying
         * `px-5 lg:px-[4.375rem]`. That put every footer link 70px from the
         * viewport edge at 1440 while the page's own content column started at
         * 120px, so the footer stepped 50px outward from everything above it —
         * the most visible misalignment on the site, because it happens at the
         * same place on every route.
         *
         * Splitting them fixes it without touching the slab: the dark ground,
         * its notched top edge and the two decorative arcs stay full-bleed on
         * the `<footer>`, and only the content moves onto `.site-column` — the
         * page's one content measure, the same one every section above uses.
         * The 12-column grid is unchanged and still the direct parent of the
         * five blocks that place themselves on it.
         */}
        <div
          className={cn(
            'site-column relative grid grid-cols-2',
            'gap-x-[2.564vw]',
            'lg:grid-cols-12 lg:gap-x-[min(1.042vw,26.6666px)]',
          )}
        >
          <div className="col-span-full flex flex-col items-center justify-center lg:row-start-1">
            <h2
              className={cn(
                'mx-auto mb-[2.625rem] text-center font-sans font-normal text-[var(--c-white)]',
                'text-[7.692vw] leading-[0.95] tracking-[-0.077vw]',
                'lg:mb-[min(4.688vw,120px)] lg:max-w-[min(57.292vw,1466.6666px)]',
                'lg:text-[max(4.375rem,min(4.688vw,120px))] lg:tracking-[min(-0.141vw,-3.6px)]',
              )}
            >
              <RevealText as="span" text={footerCta.title} onDark />
            </h2>
            {/* The support line under the headline. The headline is a slogan and
              says nothing about what PEN is; this states the product and its
              boundary ("suitable low-rise construction") for a reader who
              arrived at the footer from a page that never told them. */}
            <p className="body-3 mx-auto mb-10 max-w-[46ch] text-center text-white/70 lg:mb-14">
              {footerCta.support}
            </p>
            <Link
              href={footerCta.href}
              className={cn(
                /* `inline-flex` + `text-center`, and a smaller gutter until
                   `sm`. As a plain block the button stretched to the full
                   column while its label wrapped to two ragged lines pinned to
                   the left padding — measured at 390px, a 342px-wide button
                   with its text occupying 74–227px and the right half empty.
                   Shrinking to content and centring the wrap makes the label
                   sit in its own button at every width. */
                'label-4 z-[1] inline-flex items-center justify-center rounded-lg bg-white/15 leading-normal',
                'px-8 py-[1.5625rem] text-center uppercase sm:px-[3.125rem]',
                'text-[var(--c-white)] no-underline backdrop-blur-[27px] transition-colors duration-300',
                'fine:hover:bg-[var(--c-accent)] fine:hover:text-white',
              )}
            >
              {footerCta.label}
            </Link>
          </div>

          {/*
           * Mobile rhythm: 80 / 64 / 64, then 80 again before the copyright.
           *
           * These four stacked blocks were spaced 96, 48, 128 and 80px — no
           * rhythm at all, and the 128px gap opened a hole above "Reach us"
           * that read as a missing block rather than as separation. The three
           * content blocks now share one interval and the legal line keeps a
           * wider one, so the footer reads as three groups and a footer note.
           * Every `lg:` value is unchanged: on the desktop row these sit
           * side by side and the margins are not what separates them.
           */}
          <div className="col-span-full mt-20 flex flex-col gap-8 lg:col-span-4 lg:row-start-2 lg:mt-32">
            {/* `self-start` matters: this is a stretch-aligned flex column, so
              without it the image box fills the column and `object-contain`
              centres the mark instead of leaving it flush left. */}
            <Logo className="h-8 w-auto self-start" />
            <div className="flex flex-col gap-2">
              <p className="text-2xl font-semibold">{footerBadge.title}</p>
              <p className="text-sm leading-relaxed text-white/70">
                {footerBadge.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className="col-span-full mt-16 grid grid-cols-2 gap-8 lg:col-start-6 lg:col-end-10 lg:row-start-2 lg:mt-32">
            {footerColumns.map((column) => (
              <div key={column.heading} className="flex flex-col gap-6">
                <p className="label-4 m-0 text-white/70 uppercase">{column.heading}</p>
                <ul className="flex flex-col">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="col-span-full mt-16 flex flex-col gap-10 lg:col-start-10 lg:col-end-13 lg:row-start-2 lg:mt-32">
            <div className="flex flex-col gap-3">
              <p className="label-4 m-0 text-white/70 uppercase">{footerContact.heading}</p>
              <Link href={footerContact.promptHref} className={linkClass}>
                {footerContact.prompt}
              </Link>
              <a href={`tel:${footerContact.phone.replace(/[^\d+]/g, '')}`} className={linkClass}>
                {footerContact.phone}
              </a>
              <p className="body-3 m-0 text-white/50">{footerContact.phoneNote}</p>
            </div>

            {/* Only the accounts that actually have a URL. Every entry in
              `siteConfig.social` still ships `href: '#'`, so all three icons
              were live links that went nowhere — three dead controls in the
              footer of every page. Filling in a real URL brings the icon back
              with no change here. */}
            <ul className="flex items-center gap-5">
              {siteConfig.social.map((social) => {
                const Icon = SOCIAL_ICONS[social.label as keyof typeof SOCIAL_ICONS];
                if (!Icon || !social.href || social.href === '#') return null;
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="-m-3 inline-flex size-11 items-center justify-center text-[var(--c-white)] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--c-accent)] fine:hover:text-[var(--c-accent)]"
                    >
                      <Icon className="size-5" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="col-span-full mt-20 flex flex-col gap-1 text-white/45 lg:row-start-3 lg:mt-16">
            <p className="m-0 text-sm">
              Copyright {siteConfig.name} © {new Date().getFullYear()} All Rights Reserved
            </p>
            <Link
              href={footerSecondaryLink.href}
              className="w-fit py-1.5 text-sm text-white/45 no-underline transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--c-accent)] fine:hover:text-[var(--c-accent)]"
            >
              {footerSecondaryLink.label}
            </Link>
          </div>
        </div>
      </footer>
    </NotchedBand>
  );
}
