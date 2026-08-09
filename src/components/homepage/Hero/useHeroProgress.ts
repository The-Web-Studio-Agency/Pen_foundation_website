'use client';

import { type RefObject, useEffect, useMemo, useRef } from 'react';

import { clamp01, damp } from './heroAnimation';

/** Share of the gap to the true scroll position closed per 60fps frame. */
const DAMPING = 0.12;
/** Below this the damped value is treated as settled and the loop parks. */
const EPSILON = 0.00005;

export type ProgressListener = (progress: number) => void;

/**
 * A subscribable scalar. Deliberately not a Framer `MotionValue`: the hero's
 * consumers write straight to the DOM and never render, and this keeps the
 * publisher a plain rAF loop with no motion-system involvement.
 */
export interface HeroProgressSource {
  subscribe(listener: ProgressListener): () => void;
  current(): number;
}

/**
 * Scroll progress across the pinned range of the hero, damped.
 *
 * Two things matter here. The first is that progress is published through a
 * subscription rather than React state: the scrub touches a few hundred
 * character spans per frame, and routing that through a render would be
 * hopeless. Nothing in the hero re-renders while you scroll.
 *
 * The second is the damping. The reference drives its sequence off Lenis's
 * smoothed scroll value, not the raw one, which is why the headings feel like
 * they trail the wheel slightly. Reproducing that here — rather than adding a
 * smooth-scroll dependency this project does not have — keeps the hero working
 * against the native scrolling every other PEN route uses.
 */
export function useHeroProgress(
  sizerRef: RefObject<HTMLElement | null>,
  enabled = true,
): HeroProgressSource {
  const listeners = useRef<Set<ProgressListener>>(new Set());
  const value = useRef(0);

  const source = useMemo<HeroProgressSource>(
    () => ({
      subscribe(listener) {
        listeners.current.add(listener);
        listener(value.current);
        return () => {
          listeners.current.delete(listener);
        };
      },
      current: () => value.current,
    }),
    [],
  );

  useEffect(() => {
    const sizer = sizerRef.current;
    if (!sizer) return;

    const publish = (next: number) => {
      value.current = next;
      for (const listener of listeners.current) listener(next);
    };

    if (!enabled) {
      // Reduced motion: settle on the closing frame and never animate.
      publish(1);
      return;
    }

    // The pinned range is the sizer's height minus the one viewport the stage
    // occupies, so progress hits 1 exactly as the stage releases.
    const target = () => {
      const rect = sizer.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      return range <= 0 ? 0 : clamp01(-rect.top / range);
    };

    let frame = 0;
    let last = 0;
    let running = false;

    const tick = (now: number) => {
      const delta = last ? Math.min(now - last, 64) : 16.7;
      last = now;

      const next = damp(value.current, target(), DAMPING, delta);
      const settled = Math.abs(next - target()) < EPSILON;

      publish(settled ? target() : next);

      if (settled) {
        running = false;
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(tick);
    };

    // Only listen while the hero is anywhere near the viewport.
    let attached = false;
    const attach = () => {
      if (attached) return;
      attached = true;
      window.addEventListener('scroll', start, { passive: true });
      window.addEventListener('resize', start);
      start();
    };
    const detach = () => {
      if (!attached) return;
      attached = false;
      window.removeEventListener('scroll', start);
      window.removeEventListener('resize', start);
      cancelAnimationFrame(frame);
      running = false;
      // Park on whichever end we left through, so the headings do not freeze
      // mid-reveal when the hero is scrolled past quickly.
      publish(sizer.getBoundingClientRect().top > 0 ? 0 : 1);
    };

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? attach() : detach()),
      { rootMargin: '10% 0px' },
    );
    observer.observe(sizer);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', start);
      window.removeEventListener('resize', start);
      cancelAnimationFrame(frame);
    };
  }, [sizerRef, enabled]);

  return source;
}
