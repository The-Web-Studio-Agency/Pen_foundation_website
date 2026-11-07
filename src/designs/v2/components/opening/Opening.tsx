'use client';

import dynamic from 'next/dynamic';
import {
  Component,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { openingV2 } from '../../content';
import s from '../../styles/opening3d.module.css';
import t from '../../styles/theme.module.css';
import { ButtonLink, Chip, cx } from '../primitives';
import { useReducedMotion } from '../scroll/useReducedMotion';
import { range, useScrollProgress } from '../scroll/useScrollProgress';
import { useFilmScrub } from './useFilmScrub';

/* three.js only ships to the browser, and only for this page. */
const PenCanvas = dynamic(() => import('./PenCanvas').then((m) => m.PenCanvas), { ssr: false });

/* ==========================================================================
   TIMING — every knob for the opening's scroll choreography lives here.
   Scroll distances are in svh: 100 = one screen height of scrolling.
   ========================================================================== */
const TIMING = {
  /** Scroll for the whole 3D act (headline out → model grows → dive). */
  ACT_SVH: 210,

  /**
   * Scroll over which each film shot PLAYS. This is the film's scroll speed:
   * 55 is the original pace. Bigger = the footage moves slower per scroll.
   */
  PLAY_SVH: 55,

  /**
   * Extra scroll after each shot during which the film HOLDS still on the
   * shot's last frame, with its caption fully visible — the pause. Scrolling
   * stays perfectly normal; the picture just waits. 0 = no pause.
   */
  HOLD_SVH: 25,

  /** Caption fade-in, as fractions of its shot's scroll (play + hold). */
  TEXT_IN: [0.04, 0.2] as const,
  /** Caption fade-out, as fractions of its shot's scroll (play + hold). */
  TEXT_OUT: [0.9, 0.995] as const,
};

const { ACT_SVH, PLAY_SVH, HOLD_SVH, TEXT_IN, TEXT_OUT } = TIMING;
const SHOT_SVH = PLAY_SVH + HOLD_SVH;
/** Share of each shot's scroll that plays; the rest is the hold. */
const PLAY_SHARE = PLAY_SVH / SHOT_SVH;

const { film } = openingV2;
const SHOTS = film.beats.length;
const PINNED_SVH = ACT_SVH + SHOTS * SHOT_SVH;
/** Share of the pinned range that belongs to the 3D act. */
const SPLIT = ACT_SVH / PINNED_SVH;

/** Overall progress → 0..1 across the film act's scroll. */
const toFilm = (p: number) => range(p, SPLIT, 1);

/**
 * Overall progress → 0..1 across the footage, with holds. hero.mp4 is six
 * equal shots (its script is timed that way), so shot `i` spans [i, i+1]/6 of
 * the film. Within each shot's scroll the footage runs over the first
 * PLAY_SVH, then stays on the shot's last frame for HOLD_SVH.
 */
const toFootage = (p: number) => {
  const pos = toFilm(p) * SHOTS;
  const shot = Math.min(SHOTS - 1, Math.floor(pos));
  return (shot + Math.min((pos - shot) / PLAY_SHARE, 1)) / SHOTS;
};

/** If WebGL is unavailable or the model fails, keep the poster and the copy. */
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The opening of the concept page: one pinned stage, two acts.
 *
 *   ACT 1 — 3D   PEN's model floats centre stage with satellites and cycling
 *                callouts. Scrolling moves the headline out, turns and grows
 *                the model, brings in a centred statement, then dives the
 *                camera into the node.
 *   ACT 2 — FILM The dive opens a circular reveal onto hero.mp4, which then
 *                scrubs with the scroll; its beats land on the shots they were
 *                written for.
 *
 * One sizer drives both acts, so the hand-off has no seam. Progress is
 * published to CSS as --ph (act 1) and --pf (act 2) on the stage; all overlay
 * choreography is CSS reading those two numbers. Nothing re-renders while you
 * scroll.
 */
export function Opening() {
  const sizerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);

  const reduced = useReducedMotion();
  const progress = useScrollProgress(sizerRef, { enabled: !reduced, fallback: 0 });

  const [ready, setReady] = useState(false);
  const [graceOver, setGraceOver] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  // Model first, film second: start fetching the 16 MB film once the model is
  // up, or after a short grace period if WebGL never arrives.
  useEffect(() => {
    const id = window.setTimeout(() => setGraceOver(true), 2500);
    return () => window.clearTimeout(id);
  }, []);
  const filmSrc = !reduced && (ready || graceOver) ? film.src : undefined;

  useFilmScrub(videoRef, progress, toFootage, Boolean(filmSrc) && !reduced);

  // Publish progress to CSS, and drive the beat captions.
  useEffect(() => {
    let lastShot = -1;
    return progress.subscribe((p) => {
      const stage = stageRef.current;
      if (!stage) return;
      const ph = range(p, 0, SPLIT);
      const pf = toFilm(p);
      stage.style.setProperty('--ph', ph.toFixed(4));
      stage.style.setProperty('--pf', pf.toFixed(4));
      stage.toggleAttribute('data-copy-gone', ph > 0.18);

      const pos = pf * SHOTS;
      beatRefs.current.forEach((el, i) => {
        if (!el) return;
        const local = pos - i;
        const fadeIn = range(local, TEXT_IN[0], TEXT_IN[1]);
        const fadeOut = i === SHOTS - 1 ? 1 : 1 - range(local, TEXT_OUT[0], TEXT_OUT[1]);
        const o = ph < 1 ? 0 : fadeIn * fadeOut;
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0, ${((1 - fadeIn) * 2.5).toFixed(2)}rem, 0)`;
        el.style.visibility = o > 0.001 ? 'visible' : 'hidden';
      });

      const shot = Math.min(SHOTS - 1, Math.floor(pos));
      if (shot !== lastShot && counterRef.current) {
        lastShot = shot;
        counterRef.current.textContent = String(shot + 1).padStart(2, '0');
      }
    });
  }, [progress]);

  return (
    <section className={s.section} aria-labelledby="hv2-hero-title">
      <div
        ref={sizerRef}
        className={s.sizer}
        style={{ '--hv2-pinned': `${PINNED_SVH}svh` } as CSSProperties}
      >
        <div ref={stageRef} className={cx(s.stage, ready && s.stageReady)}>
          {/* ---- act 1: the model -------------------------------------- */}
          {/* Stage backdrop: radial green behind the model, a glow where the
              node sits, and a dotted floor receding under it. */}
          <div className={s.backdrop} aria-hidden>
            <span className={s.backdropGlow} />
            <span className={s.backdropFloor} />
          </div>

          <div className={s.canvasLayer} aria-hidden>
            <CanvasBoundary>
              <PenCanvas
                src={openingV2.model}
                progress={progress}
                split={SPLIT}
                reduced={reduced}
                hud={openingV2.hud}
                onReady={onReady}
              />
            </CanvasBoundary>
          </div>

          {/* Left: kicker + headline. */}
          <div className={s.copyLeft}>
            <p className={s.kicker}>
              <span className={s.kickerRule} aria-hidden />
              {openingV2.kicker}
            </p>
            <h1 id="hv2-hero-title" className={cx(t.display, s.title)}>
              {openingV2.heading.map((line) => (
                <span key={line} className={s.line}>
                  {line}
                </span>
              ))}
            </h1>
          </div>

          {/* Right: description + call to action. */}
          <div className={s.copyRight}>
            <p className={s.support}>
              {openingV2.support.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <ButtonLink href={openingV2.cta.href} tone="onDark" className={s.cta}>
              {openingV2.cta.label}
            </ButtonLink>
          </div>

          <p className={s.scrollCue} aria-hidden>
            <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
              <rect x="0.75" y="0.75" width="10.5" height="14.5" rx="5.25" stroke="currentColor" />
              <path
                className={s.scrollDot}
                d="M6 4v3"
                stroke="currentColor"
                strokeLinecap="round"
              />
            </svg>
            {openingV2.scrollLabel}
          </p>

          <div className={cx(s.statement, t.gutter)}>
            <Chip>{openingV2.statement.chip}</Chip>
            <h2 className={cx(t.display, s.statementTitle)}>
              {openingV2.statement.heading.map((line) => (
                <span key={line} className={s.line}>
                  {line}
                </span>
              ))}
            </h2>
            <p className={cx(t.lead, s.statementSub)}>{openingV2.statement.sub}</p>
          </div>

          {/* ---- act 2: the film --------------------------------------- */}
          <div className={s.film} aria-hidden>
            <video
              ref={videoRef}
              className={s.filmVideo}
              src={filmSrc}
              poster={film.poster}
              muted
              playsInline
              preload="auto"
              tabIndex={-1}
            />
            <div className={s.filmShade} />
          </div>

          <div className={cx(s.filmHud, t.gutter)} aria-hidden>
            <p className={cx(t.mono, s.filmLabel)}>
              <span ref={counterRef}>01</span> / {String(SHOTS).padStart(2, '0')} · {film.label}
            </p>
            <div className={s.filmBar}>
              <span className={s.filmBarFill} />
            </div>
          </div>

          <div className={cx(s.beats, t.gutter)}>
            {film.beats.map((beat, i) => (
              <div
                key={beat.lines.join(' ')}
                ref={(el) => void (beatRefs.current[i] = el)}
                className={s.beat}
                style={{ opacity: 0, visibility: 'hidden' }}
              >
                {beat.lines.length ? (
                  <p className={cx(t.display, s.beatText)}>
                    {beat.lines.map((line) => (
                      <span key={line} className={s.line}>
                        {line}
                      </span>
                    ))}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
