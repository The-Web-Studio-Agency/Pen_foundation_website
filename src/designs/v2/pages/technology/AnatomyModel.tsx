'use client';

import dynamic from 'next/dynamic';
import { Component, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import type { HudItem, PenFit } from '../../components/opening/PenCanvas';
import { cx } from '../../components/primitives';
import { useReducedMotion } from '../../components/scroll/useReducedMotion';
import t from '../../styles/theme.module.css';
import s from './technology.module.css';

/* three.js only ships to the browser, and only when this section is built. */
const PenCanvas = dynamic(
  () => import('../../components/opening/PenCanvas').then((m) => m.PenCanvas),
  { ssr: false },
);

/** Centred and large, under the heading: the model is the subject. */
const FIT: PenFit = {
  width: 0.64,
  portraitWidth: 1,
  height: 1,
  x: 0,
  y: 0.1,
  portraitY: -0.15,
};

/** If WebGL is unavailable or the model fails, show the fallback instead. */
class Boundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * The /technology hero's stage: the homepage hero's model, lights and load
 * paths on a white ground, without the scroll choreography, as a labelled
 * diagram. Every part carries a numbered marker; on desktop its readout is
 * drawn beside it, on smaller screens the numbered list under the stage
 * names them. `children` is the hero copy, centred above the model. Visitors turn the model by dragging.
 * Rendering stops while the stage is off screen.
 */
export function AnatomyModel({
  src,
  hud,
  dragLabel,
  fallback,
  children,
}: {
  src: string;
  hud: readonly HudItem[];
  dragLabel: string;
  /** Shown in place of the model if it cannot be drawn. */
  fallback: ReactNode;
  /** The hero copy. */
  children: ReactNode;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      rootMargin: '200px 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={stageRef} className={cx(s.stage, ready && s.stageReady)}>
        <div className={s.stageCanvas}>
          <span className={s.stageGlow} aria-hidden />
          <Boundary fallback={<div className={s.stageFallback}>{fallback}</div>}>
            <div className={s.stageFade} aria-hidden>
              <PenCanvas
                src={src}
                fit={FIT}
                satellites={false}
                hudMode="all"
                tone="light"
                paused={!onScreen}
                reduced={reduced}
                hud={hud}
                onReady={onReady}
                dragTarget={stageRef}
              />
            </div>
          </Boundary>
          <p className={cx(t.mono, s.stageHint)} aria-hidden>
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
            {dragLabel}
          </p>
        </div>
        {children}
      </div>

      {/* The parts, numbered as on the model. Read by screen readers at
          every size; shown below desktop, where the readouts do not fit. */}
      <ol className={cx(s.legend, t.gutter)}>
        {hud.map((item, i) => (
          <li key={item.anchor}>
            <span className={s.legendNum} aria-hidden>
              {i + 1}
            </span>
            <span>
              <span className={cx(t.mono, s.legendChip)}>{item.chip}</span>
              <span className={cx(t.mono, s.legendLines)}>{item.lines.join(' · ')}</span>
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}
