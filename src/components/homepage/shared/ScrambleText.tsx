'use client';

import { useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * The decode-in effect on the footer CTA label.
 *
 * Verified from a frame caught mid-animation on the reference: characters that
 * have not yet settled render as substituted glyphs painted lime, and the label
 * resolves left to right. Letters lock in one after another; every character
 * still in flight is re-randomised on each tick.
 *
 * Spaces are never scrambled, so the word shape stays readable throughout.
 */

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>*#';
/** How long one character waits, per index, before it locks. */
const STEP_MS = 45;
/** How often the still-scrambling characters are re-rolled. */
const TICK_MS = 55;

export interface ScrambleTextProps {
  text: string;
  className?: string;
}

export function ScrambleText({ text, className }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });
  const prefersReducedMotion = useReducedMotion();
  const [settled, setSettled] = useState(0);
  const [noise, setNoise] = useState(0);

  // Nothing to decode when motion is unwelcome — every character is already
  // settled, so the branch below never starts a timer.
  const resolved = prefersReducedMotion ? text.length : settled;

  useEffect(() => {
    if (!inView || prefersReducedMotion) return;
    const started = performance.now();
    let frame = 0;
    const id = window.setInterval(() => {
      const elapsed = performance.now() - started;
      const locked = Math.floor(elapsed / STEP_MS);
      setSettled(locked);
      setNoise((frame += 1));
      if (locked >= text.length) window.clearInterval(id);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [inView, prefersReducedMotion, text.length]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {Array.from(text).map((char, index) => {
          if (char === ' ') return <span key={index}> </span>;
          if (index < resolved) return <span key={index}>{char}</span>;
          // `noise` only re-rolls characters that have not locked yet.
          const pick = (index * 31 + noise * 17) % GLYPHS.length;
          return (
            <span key={index} className="text-[var(--c-accent)]">
              {GLYPHS[pick]}
            </span>
          );
        })}
      </span>
    </span>
  );
}
