import Link from 'next/link';

import { createMetadata } from '@/config/seo';
import { footerContact } from '@/config/navigation';

export const metadata = createMetadata({
  title: 'Page not found',
  description: 'The page you were looking for is not here.',
  path: '/404',
  noIndex: true,
});

/**
 * The 404 every bad URL lands on, including an unknown `/projects/[slug]` or
 * `/research/[slug]` — both call `notFound()` and, until this file existed,
 * fell through to Next's unstyled default page inside PEN's own header and
 * footer, which read as a half-broken site rather than a handled state.
 *
 * Deliberately quiet: a mono status line, one sentence, and the two exits that
 * are always right on this site — back to the argument, or straight to a
 * person. `pt-nav` clears the fixed header pill the way every other non-home
 * route does, and the section is tall enough that the footer does not ride up
 * under a short page.
 */
export default function NotFound() {
  return (
    <section className="site-gutter flex min-h-[70svh] flex-col justify-center py-24">
      <p className="label-3 text-[var(--c-accent)] uppercase">Error 404</p>

      <h1 className="title-si mt-6 max-w-[18ch] font-sans font-normal text-balance text-[var(--c-dark-green)]">
        This page is not in the ground.
      </h1>

      <p className="body-3 mt-6 max-w-[52ch] text-[var(--c-dark-green)]/70">
        The address you followed does not exist, or the page has moved since it was linked.
      </p>

      <div className="mt-12 flex flex-wrap items-center gap-4">
        <Link
          href="/"
          className="label-4 inline-flex h-13 items-center rounded-lg bg-[var(--c-dark-green)] px-8 text-[var(--c-white)] uppercase no-underline transition-colors duration-250 fine:hover:bg-[var(--c-accent)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--c-accent)]"
        >
          Back to the homepage
        </Link>

        <Link
          href={footerContact.promptHref}
          className="label-4 inline-flex h-13 items-center rounded-lg border border-[var(--c-dark-green)]/20 px-8 text-[var(--c-dark-green)] uppercase no-underline transition-colors duration-250 fine:hover:border-[var(--c-accent)] fine:hover:text-[var(--c-accent)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--c-accent)]"
        >
          Talk to an engineer
        </Link>
      </div>
    </section>
  );
}
