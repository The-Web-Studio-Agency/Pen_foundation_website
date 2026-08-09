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
 * `font-sans` on the heading is deliberate: the site-wide serif rule in
 * globals.css targets every h2, and this design is sans.
 */
export function SiteFooter() {
  const decorativeLine = 'pointer-events-none absolute rounded-[50%] border border-white/[0.06]';
  const linkClass =
    'body-3 text-[var(--c-white)] no-underline transition-colors duration-200 fine:hover:text-[var(--c-accent)]';

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
          'relative grid w-full grid-cols-2 overflow-hidden bg-ink text-[var(--c-white)]',
          'gap-x-[2.564vw] px-5 pt-[7.8125rem] pb-[2.09375rem]',
          'lg:grid-cols-12 lg:gap-x-[min(1.042vw,26.6666px)] lg:px-[4.375rem] lg:pt-[14.375rem] lg:pb-5',
        )}
      >
        <span aria-hidden className={cn(decorativeLine, '-top-40 -left-60 size-[36rem]')} />
        <span aria-hidden className={cn(decorativeLine, 'top-10 -right-80 size-[46rem]')} />

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
          <Link
            href={footerCta.href}
            className={cn(
              'label-4 z-[1] rounded-lg bg-white/15 px-[3.125rem] py-[1.5625rem] uppercase',
              'text-[var(--c-white)] no-underline backdrop-blur-[27px] transition-colors duration-300',
              'fine:hover:bg-[var(--c-accent)] fine:hover:text-white',
            )}
          >
            {footerCta.label}
          </Link>
        </div>

        <div className="col-span-full mt-24 flex flex-col gap-8 lg:col-span-4 lg:row-start-2 lg:mt-32">
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

        <div className="col-span-full mt-12 grid grid-cols-2 gap-8 lg:col-start-6 lg:col-end-10 lg:row-start-2 lg:mt-32">
          {footerColumns.map((column) => (
            <div key={column.heading} className="flex flex-col gap-6">
              <p className="label-4 m-0 text-white/70 uppercase">{column.heading}</p>
              <ul className="flex flex-col gap-3">
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

        <div className="col-span-full mt-32 flex flex-col gap-10 lg:col-start-10 lg:col-end-13 lg:row-start-2 lg:mt-32">
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

          <ul className="flex items-center gap-5">
            {siteConfig.social.map((social) => {
              const Icon = SOCIAL_ICONS[social.label as keyof typeof SOCIAL_ICONS];
              if (!Icon) return null;
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="inline-flex text-[var(--c-white)] transition-colors duration-200 fine:hover:text-[var(--c-accent)]"
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
            className="w-fit text-sm text-white/45 no-underline transition-colors duration-200 fine:hover:text-[var(--c-accent)]"
          >
            {footerSecondaryLink.label}
          </Link>
        </div>
      </footer>
    </NotchedBand>
  );
}
