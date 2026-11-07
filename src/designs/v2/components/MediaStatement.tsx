'use client';

import { type CSSProperties, useEffect, useRef } from 'react';

import { statementV2 } from '../content';
import s from '../styles/statement.module.css';
import t from '../styles/theme.module.css';
import { LoopVideo } from './LoopVideo';
import { cx } from './primitives';
import { useReducedMotion } from './scroll/useReducedMotion';
import { range, smooth, useScrollProgress } from './scroll/useScrollProgress';

/* ==========================================================================
   TIMING — scroll choreography for this section, in svh (100 = one screen).
   ========================================================================== */
const TIMING = {
  /** Total pinned scroll for the section (expand + reveal + a short hold). */
  PIN_SVH: 140,
  /** Share of that scroll over which the pill grows to fill the screen. */
  EXPAND: [0, 0.6] as const,
  /** Share over which the paragraph and the three cards fade in. */
  CONTENT: [0.5, 0.75] as const,
};

/**
 * The site film behind the problem statement, with three highlight cards.
 *
 * Arrives as a pill of video on the light page: as the visitor scrolls, the
 * pill grows to the edges until the film fills the screen, then the statement
 * (bottom-left) and the three cards (spread across the top) fade in. The stage
 * is pinned while this happens, so the section holds still until it is full.
 *
 * Progress is written to the stage as two CSS variables — --g (expansion,
 * eased) and --c (content) — and styles/statement.module.css does the rest.
 * Reduced motion: no pin, no pill; the section simply shows in full.
 */
export function MediaStatement() {
  const sizerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const progress = useScrollProgress(sizerRef, { enabled: !reduced, fallback: 1 });

  useEffect(
    () =>
      progress.subscribe((p) => {
        const stage = stageRef.current;
        if (!stage) return;
        const g = smooth(range(p, TIMING.EXPAND[0], TIMING.EXPAND[1]));
        const c = range(p, TIMING.CONTENT[0], TIMING.CONTENT[1]);
        stage.style.setProperty('--g', g.toFixed(4));
        stage.style.setProperty('--c', c.toFixed(4));
        stage.toggleAttribute('data-content-hidden', c < 0.05);
      }),
    [progress],
  );

  return (
    <section id="hv2-after-hero" className={s.section} aria-labelledby="hv2-statement-text">
      <div
        ref={sizerRef}
        className={s.sizer}
        style={{ '--pin': `${TIMING.PIN_SVH}svh` } as CSSProperties}
      >
        <div ref={stageRef} className={s.stage}>
          {/* Behind the pill: a slow loop of the system's name in pale grey,
              so the page is not empty while the pill is small. Two identical
              runs side by side make the loop seamless. */}
          <div className={s.marquee} aria-hidden>
            {[0, 1].map((run) => (
              <div key={run} className={s.marqueeRun}>
                {[0, 1, 2].map((k) => (
                  <span key={k} className={s.marqueeItem}>
                    {statementV2.marquee}
                    <span className={s.marqueeSep}>·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>

          <div className={s.frame}>
            <div className={s.filmWrap} aria-hidden>
              <LoopVideo
                src={statementV2.film.src}
                poster={statementV2.film.poster}
                className={s.film}
              />
            </div>
            <div className={s.shade} aria-hidden />

            <ul className={s.spots}>
              {statementV2.hotspots.map((spot, i) => (
                <li
                  key={spot.label}
                  className={s.spot}
                  style={{ '--x': `${spot.x}%`, '--y': `${spot.y}%`, '--i': i } as CSSProperties}
                >
                  <div className={s.card} role="note">
                    <p className={cx(t.mono, s.cardTitle)}>{spot.label}</p>
                    <p className={s.cardBody}>{spot.body}</p>
                  </div>
                  <button type="button" className={s.dot} aria-label={spot.label}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden>
                      <circle cx="9" cy="4.5" r="1.5" />
                      <circle cx="4.5" cy="9" r="1.5" />
                      <circle cx="13.5" cy="9" r="1.5" />
                      <circle cx="9" cy="13.5" r="1.5" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <div className={cx(s.copy, t.gutter)}>
              <p className={s.kicker}>
                <span className={s.kickerRule} aria-hidden />
                <span>{statementV2.kicker}</span>
              </p>
              <p id="hv2-statement-text" className={s.text}>
                {statementV2.text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
