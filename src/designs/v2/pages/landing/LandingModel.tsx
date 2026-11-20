'use client';

import dynamic from 'next/dynamic';
import { Component, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import type { HudItem, PenFit } from '../../components/opening/PenCanvas';
import { cx } from '../../components/primitives';
import { useReducedMotion } from '../../components/scroll/useReducedMotion';
import t from '../../styles/theme.module.css';
import s from './landing.module.css';

/* three.js only ships to the browser, and only when this section is built. */
const PenCanvas = dynamic(
  () => import('../../components/opening/PenCanvas').then((m) => m.PenCanvas),
  { ssr: false },
);

/** Centred and large: the model is the subject of the section. */
const FIT: PenFit = {
  width: 0.62,
  portraitWidth: 1,
  height: 1,
  x: 0,
  y: 0.05,
  portraitY: -0.1,
};

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
 * The landing page's 3D stage: the homepage's model, lights and load paths,
 * centred on a dark stage with each part numbered and labelled. Visitors turn
 * it by dragging. It stops rendering while off screen, and falls back to the
 * product render if WebGL is unavailable.
 */
export function LandingModel({
  src,
  hud,
  dragLabel,
  fallback,
}: {
  src: string;
  hud: readonly HudItem[];
  dragLabel: string;
  fallback: ReactNode;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      rootMargin: '300px 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={stageRef} className={cx(s.modelStage, ready && s.modelReady)} data-reveal>
        <span className={s.modelGlow} aria-hidden />
        <span className={s.modelFloor} aria-hidden />
        <Boundary fallback={<div className={s.modelFallback}>{fallback}</div>}>
          <div className={s.modelCanvas} aria-hidden>
            <PenCanvas
              src={src}
              fit={FIT}
              satellites={false}
              hudMode="all"
              paused={!onScreen}
              reduced={reduced}
              hud={hud}
              onReady={onReady}
              dragTarget={stageRef}
            />
          </div>
        </Boundary>
        <p className={cx(t.mono, s.modelHint)} aria-hidden>
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

      {/* The parts, numbered as on the model: shown below desktop, where the
          readouts do not fit; for screen readers at every size. */}
      <ol className={s.modelLegend}>
        {hud.map((item, i) => (
          <li key={item.anchor}>
            <span className={s.modelLegendNum} aria-hidden>
              {i + 1}
            </span>
            <span>
              <span className={cx(t.mono, s.modelLegendChip)}>{item.chip}</span>
              <span className={cx(t.mono, s.modelLegendLines)}>{item.lines.join(' · ')}</span>
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}
