'use client';

import { type RefObject, useEffect, useRef } from 'react';

import styles from './hero.module.css';
import type { HeroProgressSource } from './useHeroProgress';

interface HeroScrollIndicatorProps {
  label: string;
  progress: HeroProgressSource;
  /** The element the pointer has to be over for the cursor label to show. */
  sectionRef: RefObject<HTMLElement | null>;
}

/** Progress past which both indicators are out of the way. */
const HIDDEN_AT = 0.02;

/** Measured ends of the reference's per-character grey ramp. */
const RAMP_FROM = 254;
const RAMP_TO = 230;

/**
 * Tints each character along the ramp the reference applies to its label —
 * a barely-there left-to-right fade that reads as a soft edge rather than a
 * gradient. Spaces are skipped so the ramp is spread over glyphs only, which
 * is how the original counts them.
 */
function rampedCharacters(label: string) {
  const glyphs = Array.from(label).filter((character) => !/\s/.test(character));
  let seen = 0;

  return Array.from(label).map((character) => {
    if (/\s/.test(character)) return { character, color: undefined };
    const amount = glyphs.length > 1 ? seen / (glyphs.length - 1) : 0;
    seen += 1;
    const channel = Math.round(RAMP_FROM + (RAMP_TO - RAMP_FROM) * amount);
    return { character, color: `rgb(${channel}, ${channel}, ${channel})` };
  });
}

/**
 * Two indicators carrying the same label, one per input type: a cursor-following
 * one on fine pointers and a bottom-centred one on touch. `hero.module.css`
 * shows exactly one of them, so both are always rendered and neither needs a
 * media query in JS.
 */
export function HeroScrollIndicator({ label, progress, sectionRef }: HeroScrollIndicatorProps) {
  const cursorRef = useRef<HTMLSpanElement>(null);
  const touchRef = useRef<HTMLDivElement>(null);
  // The cursor label needs both conditions before it shows: pointer over the
  // hero, and the scrub not yet started.
  const hoveringRef = useRef(false);
  const atRestRef = useRef(true);

  useEffect(() => {
    const section = sectionRef.current;
    const cursor = cursorRef.current;
    if (!section || !cursor) return;

    const sync = () => {
      cursor.style.opacity = hoveringRef.current && atRestRef.current ? '1' : '0';
    };

    const onMove = (event: PointerEvent) => {
      // `position: fixed` at the origin, so the transform is the raw viewport
      // position — the same shape as the reference's own matrix.
      cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      if (!hoveringRef.current) {
        hoveringRef.current = true;
        sync();
      }
    };

    const onLeave = () => {
      hoveringRef.current = false;
      sync();
    };

    section.addEventListener('pointermove', onMove, { passive: true });
    section.addEventListener('pointerleave', onLeave);

    const unsubscribe = progress.subscribe((value) => {
      const atRest = value < HIDDEN_AT;
      if (atRest !== atRestRef.current) {
        atRestRef.current = atRest;
        sync();
      }
      if (touchRef.current) {
        touchRef.current.style.opacity = atRest ? '1' : '0';
      }
    });

    sync();

    return () => {
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      unsubscribe();
    };
  }, [progress, sectionRef]);

  return (
    <>
      <span ref={cursorRef} className={styles.cursorIndicator} style={{ opacity: 0 }}>
        {/* Announced once from copy that is not cut up. */}
        <span className={styles.srOnly}>{label}</span>
        <span aria-hidden>
          {rampedCharacters(label).map(({ character, color }, index) => (
            <span key={index} style={color ? { color } : undefined}>
              {character}
            </span>
          ))}
        </span>
      </span>

      <div ref={touchRef} className={styles.touchIndicator}>
        <p>{label}</p>
      </div>
    </>
  );
}
