'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Route-level error boundary.
 *
 * Without one, any exception thrown while rendering a route shows Next's raw
 * "Application error: a client-side exception has occurred" screen in
 * production — no header, no footer, no way back. This keeps the visitor
 * inside the site and gives them the two exits that always apply.
 *
 * `reset()` re-renders the segment, which is the right first move for a
 * transient failure (a chunk that failed to load, a hydration hiccup) and
 * costs nothing when it is not.
 *
 * No `metadata` export: an error file is a Client Component and Next does not
 * read metadata from one. The route's own title stays.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side digest only; the message itself is not shown to the visitor.
    console.error('Route error:', error.digest ?? error.message);
  }, [error]);

  return (
    <section className="site-gutter flex min-h-[70svh] flex-col justify-center py-24">
      <p className="label-3 text-[var(--c-accent)] uppercase">Something went wrong</p>

      <h1 className="title-si mt-6 max-w-[20ch] font-sans font-normal text-balance text-[var(--c-dark-green)]">
        This page failed to load.
      </h1>

      <p className="body-3 mt-6 max-w-[52ch] text-[var(--c-dark-green)]/70">
        The fault is on our side, not yours. Try again — and if it keeps happening, call the
        engineering team directly.
      </p>

      <div className="mt-12 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="label-4 inline-flex h-13 items-center rounded-lg bg-[var(--c-dark-green)] px-8 text-[var(--c-white)] uppercase transition-colors duration-250 fine:hover:bg-[var(--c-accent)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--c-accent)]"
        >
          Try again
        </button>

        <Link
          href="/"
          className="label-4 inline-flex h-13 items-center rounded-lg border border-[var(--c-dark-green)]/20 px-8 text-[var(--c-dark-green)] uppercase no-underline transition-colors duration-250 fine:hover:border-[var(--c-accent)] fine:hover:text-[var(--c-accent)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--c-accent)]"
        >
          Back to the homepage
        </Link>
      </div>
    </section>
  );
}
