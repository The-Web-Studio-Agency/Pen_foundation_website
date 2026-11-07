'use client';

import { type RefObject, useEffect, useMemo, useRef } from 'react';

export type ProgressListener = (progress: number) => void;

/** A subscribable 0→1 value. Consumers write to the DOM / WebGL, never render. */
export interface ProgressSource {
  subscribe(listener: ProgressListener): () => void;
  current(): number;
}

/** Share of the remaining gap closed per 60fps frame — the "trails the wheel" feel. */
const DAMPING = 0.11;
const EPSILON = 0.00005;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Frame-rate independent exponential approach. */
function damp(from: number, to: number, factor: number, deltaMs: number) {
  const t = 1 - Math.pow(1 - factor, deltaMs / 16.667);
  return from + (to - from) * t;
}

/**
 * Damped scroll progress across a pinned "sizer": 0 when its top meets the
 * top of the viewport, 1 when its bottom meets the bottom — i.e. exactly the
 * range over which a `position: sticky` stage inside it is pinned.
 *
 * Published through a subscription, not React state, so a full scrub costs
 * zero renders. The rAF loop only runs while the sizer is near the viewport
 * and parks itself once the value settles.
 *
 * `enabled = false` (reduced motion) publishes `fallback` once and never
 * animates.
 */
export function useScrollProgress(
  sizerRef: RefObject<HTMLElement | null>,
  { enabled = true, fallback = 0 }: { enabled?: boolean; fallback?: number } = {},
): ProgressSource {
  const listeners = useRef<Set<ProgressListener>>(new Set());
  const value = useRef(0);

  const source = useMemo<ProgressSource>(
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
      publish(fallback);
      return;
    }

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
      const goal = target();
      const next = damp(value.current, goal, DAMPING, delta);
      const settled = Math.abs(next - goal) < EPSILON;
      publish(settled ? goal : next);
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
      // Park on the end we left through so nothing freezes half-way.
      publish(sizer.getBoundingClientRect().top > 0 ? 0 : 1);
    };

    // Seed with the true position (a reload mid-page must not animate from 0).
    publish(target());

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? attach() : detach()), {
      rootMargin: '15% 0px',
    });
    io.observe(sizer);

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', start);
      window.removeEventListener('resize', start);
      cancelAnimationFrame(frame);
    };
  }, [sizerRef, enabled, fallback]);

  return source;
}

/** True when the OS asks for reduced motion. SSR-safe: false on the server. */
export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Map `v` from [a, b] onto [0, 1], clamped. */
export function range(v: number, a: number, b: number) {
  return clamp01((v - a) / (b - a));
}

/** Smoothstep-shaped 0→1, for scroll-mapped motion that eases at both ends. */
export function smooth(t: number) {
  return t * t * (3 - 2 * t);
}
