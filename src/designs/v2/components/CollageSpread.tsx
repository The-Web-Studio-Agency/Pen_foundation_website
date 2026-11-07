'use client';

import { useEffect } from 'react';

import { useReducedMotion } from './scroll/useReducedMotion';
import { range, smooth } from './scroll/useScrollProgress';

/* ==========================================================================
   TIMING — how the collage gathers and spreads.
   ========================================================================== */
const SPREAD = {
  /**
   * Where each tile starts, as a share of its distance from the centre:
   * 0.3 = 30% of the way out (gathered close around the heading). 1 would
   * mean no movement.
   */
  START_AT: 0.3,
  /** Scale while gathered; grows to 1 as the tiles reach their places. */
  START_SCALE: 0.82,
  /** Share of the pinned scroll over which the tiles spread (rest = hold). */
  SPREAD_UNTIL: 0.7,
  /** Share of the pinned scroll over which the statement fades in. */
  TEXT_IN: [0.4, 0.8] as const,
};

const DESKTOP = '(min-width: 64rem)';

/**
 * Gathers the problem collage's tiles around the centre as the section
 * arrives, and spreads them out to their scattered positions while it is
 * pinned, fading the statement in as they clear it.
 *
 * Progress is the pinned range of the section's sizer: 0 when the stage
 * pins, 1 when it releases. Before the pin the tiles hold their gathered
 * cluster, so they arrive on screen gathered. Each tile
 * gets its own --dx/--dy (the vector from its resting place to the centre of
 * the collage, measured once per layout) and the section gets --f, the share
 * of the way out; styles/problem.module.css turns those into a transform.
 *
 * Desktop only — below 1024px the collage is a plain grid. Reduced motion:
 * the tiles simply sit in place.
 */
export function CollageSpread({ sectionId }: { sectionId: string }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const tiles = Array.from(section.querySelectorAll<HTMLElement>('[data-tile]'));
    const desktop = window.matchMedia(DESKTOP);
    let frame = 0;

    /** Resting-place vectors, from offsets (which ignore transforms). */
    const measure = () => {
      for (const tile of tiles) {
        const parent = tile.offsetParent as HTMLElement | null;
        if (!parent || !desktop.matches) {
          tile.style.removeProperty('--dx');
          tile.style.removeProperty('--dy');
          continue;
        }
        const dx = parent.clientWidth / 2 - (tile.offsetLeft + tile.offsetWidth / 2);
        const dy = parent.clientHeight / 2 - (tile.offsetTop + tile.offsetHeight / 2);
        tile.style.setProperty('--dx', `${dx.toFixed(1)}px`);
        tile.style.setProperty('--dy', `${dy.toFixed(1)}px`);
      }
    };

    const update = () => {
      frame = 0;
      if (reduced || !desktop.matches) {
        section.style.setProperty('--f', '1');
        section.style.setProperty('--fs', '1');
        section.style.setProperty('--fc', '1');
        return;
      }
      const sizer = section.querySelector<HTMLElement>('[data-collage-sizer]');
      const r = (sizer ?? section).getBoundingClientRect();
      const pinned = Math.max(1, r.height - window.innerHeight);
      const p = range(-r.top / pinned, 0, 1);
      const e = smooth(range(p, 0, SPREAD.SPREAD_UNTIL));
      const f = SPREAD.START_AT + (1 - SPREAD.START_AT) * e;
      const scale = SPREAD.START_SCALE + (1 - SPREAD.START_SCALE) * e;
      section.style.setProperty('--f', f.toFixed(4));
      section.style.setProperty('--fs', scale.toFixed(4));
      section.style.setProperty('--fc', range(p, SPREAD.TEXT_IN[0], SPREAD.TEXT_IN[1]).toFixed(4));
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      request();
    };

    measure();
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', onResize);
    desktop.addEventListener('change', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', onResize);
      desktop.removeEventListener('change', onResize);
    };
  }, [sectionId, reduced]);

  return null;
}
