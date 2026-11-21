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
  useSyncExternalStore,
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

  /**
   * Touch screens: a flick covers far less of the page than a wheel, so the
   * full-length pin reads as the page being stuck. Phones get a shorter 3D
   * act and shorter holds; the film itself keeps PLAY_SVH, so it scrubs at
   * the same, smooth pace everywhere.
   */
  TOUCH: { ACT_SVH: 120, HOLD_SVH: 8 },

  /** Caption fade-in, as fractions of its shot's scroll (play + hold). */
  TEXT_IN: [0.04, 0.2] as const,
  /** Caption fade-out, as fractions of its shot's scroll (play + hold). */
  TEXT_OUT: [0.9, 0.995] as const,
};

const { TEXT_IN, TEXT_OUT } = TIMING;

/** Timing is tied to the film file itself, so it is fixed when the module loads. */
const timing = openingV2.film;
const SHOTS = timing.beats.length;
const SKIPPED_SHOTS = timing.sourceShots - SHOTS;

/**
 * The pinned range for one set of distances: its length, the share that
 * belongs to the 3D act, and the progress → film-time mapping.
 *
 * The film is cut into `sourceShots` equal shots and its script is timed that
 * way. The first shot carries the page headline, so it is not a beat here:
 * the film starts `skipSeconds` in, and that leftover footage plays as part of
 * the first beat's shot. Every later beat spans its own source shot exactly.
 * Within each beat's scroll the footage runs over the first PLAY_SVH, then
 * stays on the shot's last frame for HOLD_SVH.
 */
function choreography(act: number, play: number, hold: number) {
  const shot = play + hold;
  const pinnedSvh = act + SHOTS * shot;
  const split = act / pinnedSvh;
  const playShare = play / shot;
  const toFilm = (p: number) => range(p, split, 1);
  const toFootageTime = (p: number, duration: number) => {
    const pos = toFilm(p) * SHOTS;
    const index = Math.min(SHOTS - 1, Math.floor(pos));
    const played = Math.min((pos - index) / playShare, 1);
    const shotLength = duration / timing.sourceShots;
    const start = index === 0 ? timing.skipSeconds : (index + SKIPPED_SHOTS) * shotLength;
    const end = (index + SKIPPED_SHOTS + 1) * shotLength;
    return start + played * (end - start);
  };
  return { pinnedSvh, split, toFilm, toFootageTime };
}

const FULL = choreography(TIMING.ACT_SVH, TIMING.PLAY_SVH, TIMING.HOLD_SVH);
const TOUCH = choreography(TIMING.TOUCH.ACT_SVH, TIMING.PLAY_SVH, TIMING.TOUCH.HOLD_SVH);

const TOUCH_QUERY = '(pointer: coarse), (max-width: 48rem)';
/** Phones: start the 3D scene after this long if the visitor has not touched the page yet. */
const START_3D_MS = 4000;
const subscribeTouch = (onChange: () => void) => {
  const mq = window.matchMedia(TOUCH_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
};
/** The touch pacing on phones and tablets; the full one on the server and desktop. */
function useChoreography() {
  const touch = useSyncExternalStore(
    subscribeTouch,
    () => window.matchMedia(TOUCH_QUERY).matches,
    () => false,
  );
  return touch ? TOUCH : FULL;
}

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
  // Copy and media read at render, so admin edits show without a rebuild.
  const { film } = openingV2;
  const sizerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);

  const reduced = useReducedMotion();
  const { pinnedSvh, split, toFilm, toFootageTime } = useChoreography();
  const progress = useScrollProgress(sizerRef, { enabled: !reduced, fallback: 0 });

  const [ready, setReady] = useState(false);
  const [graceOver, setGraceOver] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  // Phones: setting up the 3D scene is seconds of solid work on a phone's
  // CPU, and doing it during page load holds back the headline and the first
  // taps. So on touch screens the model starts on the visitor's first touch,
  // scroll or key, or after START_3D_MS, whichever comes first; the headline
  // sits on the stage's own backdrop meanwhile and the model fades in as
  // usual. Desktop starts it straight away.
  const [start3d, setStart3d] = useState(false);
  useEffect(() => {
    const go = () => setStart3d(true);
    if (!window.matchMedia(TOUCH_QUERY).matches) {
      const frame = requestAnimationFrame(go);
      return () => cancelAnimationFrame(frame);
    }
    const events = ['pointerdown', 'touchstart', 'scroll', 'wheel', 'keydown'] as const;
    const timer = window.setTimeout(go, START_3D_MS);
    for (const e of events) window.addEventListener(e, go, { once: true, passive: true });
    return () => {
      window.clearTimeout(timer);
      for (const e of events) window.removeEventListener(e, go);
    };
  }, []);

  // Model first, film second: start fetching the film once the model is up,
  // or after a short grace period if WebGL never arrives.
  useEffect(() => {
    if (!start3d) return;
    const id = window.setTimeout(() => setGraceOver(true), 2500);
    return () => window.clearTimeout(id);
  }, [start3d]);
  const filmSrc = !reduced && (ready || graceOver) ? film.src : undefined;

  useFilmScrub(videoRef, progress, toFootageTime, Boolean(filmSrc) && !reduced);

  // Publish progress to CSS, and drive the beat captions.
  useEffect(() => {
    let lastShot = -1;
    return progress.subscribe((p) => {
      const stage = stageRef.current;
      if (!stage) return;
      const ph = range(p, 0, split);
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
  }, [progress, split, toFilm]);

  return (
    <section className={s.section} aria-labelledby="hv2-hero-title">
      <div
        ref={sizerRef}
        className={s.sizer}
        style={{ '--hv2-pinned': `${pinnedSvh}svh` } as CSSProperties}
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
              {start3d && (
                <PenCanvas
                  src={openingV2.model}
                  progress={progress}
                  split={split}
                  reduced={reduced}
                  hud={openingV2.hud}
                  onReady={onReady}
                  dragTarget={stageRef}
                />
              )}
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
            <span className={s.dragHint}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 4 0 0 0 18 0" />
                <path d="M18 9.5l3 2.5-3 2" />
              </svg>
              {openingV2.dragLabel}
            </span>
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
