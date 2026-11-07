'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import { cx } from '@/designs/v2/components/primitives';
import p from '@/designs/v2/styles/page.module.css';
import t from '@/designs/v2/styles/theme.module.css';

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
    <section className={cx(p.hero, p.heroTall)}>
      <div className={p.heroGlow} aria-hidden>
        <div className={p.heroFloor} />
      </div>
      <div className={cx(p.heroInner, t.gutter)}>
        <div>
          <p className={p.kicker}>
            <span className={p.kickerRule} aria-hidden />
            <span>Something went wrong</span>
          </p>
          <h1 className={cx(t.display, p.heroTitle)}>This page failed to load.</h1>
        </div>
        <div className={p.heroRight}>
          <p className={p.heroLead}>
            The fault is on our side, not yours. Try again — and if it keeps happening, call the
            engineering team directly.
          </p>
          <div className={p.heroActions}>
            <button type="button" onClick={reset} className={cx(t.btn, t.solid)}>
              <span>Try again</span>
            </button>
            <Link href="/" className={cx(t.btn, t.onDark)}>
              <span>Back to the homepage</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
