'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * One IntersectionObserver for the whole page.
 *
 * Sections stay Server Components and mark what should animate with a plain
 * `data-reveal` attribute; this stamps `data-shown` on each the first time it
 * enters the viewport, and the CSS in theme.module.css does the rest. One
 * observer instead of one client wrapper per element keeps the client bundle to
 * this file.
 *
 * It lives in the shared layout, which persists across client navigations, so
 * it re-scans on every route change — otherwise a page reached by a link would
 * keep its `data-reveal` elements hidden.
 */
export function RevealController({ rootId }: { rootId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-shown', '');
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    );

    // Anything already on screen at load (the hero) shows straight away rather
    // than waiting for a scroll that the observer's bottom margin would demand.
    const vh = window.innerHeight;
    root.querySelectorAll('[data-reveal]:not([data-shown])').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) el.setAttribute('data-shown', '');
      else io.observe(el);
    });
    return () => io.disconnect();
  }, [rootId, pathname]);

  return null;
}
