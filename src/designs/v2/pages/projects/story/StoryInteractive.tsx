'use client';

import Image from 'next/image';
import { useId, useRef, useState, type KeyboardEvent } from 'react';

import type { CaseStory, StoryCompare } from '@/content/data/case-studies';

import { cx } from '../../../components/primitives';
import t from '../../../styles/theme.module.css';
import s from './story.module.css';

/* ---- before / after ------------------------------------------------------ */

export function CompareSlider({ compare }: { compare: StoryCompare }) {
  const [x, setX] = useState(50);
  const { before, after } = compare;
  return (
    <figure className={s.figure}>
      <div
        className={s.compare}
        style={{ '--x': `${x}%`, aspectRatio: compare.aspect } as React.CSSProperties}
      >
        <Image
          src={before.src}
          alt={before.alt}
          fill
          sizes="(min-width: 64rem) 50vw, 100vw"
          className={cx(s.compareImg, before.drawing && s.compareSheet)}
          style={before.drawing ? undefined : { objectPosition: 'center 60%' }}
        />
        <Image
          src={after.src}
          alt={after.alt}
          fill
          sizes="(min-width: 64rem) 50vw, 100vw"
          className={cx(s.compareImg, s.compareAfter, after.drawing && s.compareSheet)}
        />
        <span className={s.compareRule} aria-hidden />
        <span className={s.compareKnob} aria-hidden>
          ↔
        </span>
        <span className={cx(t.mono, s.compareLabel, s.compareLabelL)}>{before.label}</span>
        <span className={cx(t.mono, s.compareLabel, s.compareLabelR)}>{after.label}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
          className={s.compareRange}
          aria-label={`Compare: ${before.label} and ${after.label}`}
        />
      </div>
      <figcaption className={s.caption}>{compare.caption}</figcaption>
    </figure>
  );
}

/* ---- load / settlement chart -------------------------------------------- */

const W = 720;
const H = 372;
const PAD = { l: 56, r: 700, t: 20, b: 330 };
const X_MAX = 700;
const Y_MAX = 45;
const sx = (load: number) => PAD.l + ((PAD.r - PAD.l) * load) / X_MAX;
const sy = (mm: number) => PAD.t + ((PAD.b - PAD.t) * mm) / Y_MAX;
const linePath = (d: [number, number][]) =>
  d.map(([l, m], i) => `${i ? 'L' : 'M'}${sx(l).toFixed(1)},${sy(m).toFixed(1)}`).join(' ');

/** Settlement at `load`, interpolated; null past the end of the test. */
function settlementAt(d: [number, number][], load: number): number | null {
  if (load > d[d.length - 1][0]) return null;
  for (let i = 1; i < d.length; i++) {
    if (load <= d[i][0]) {
      const [l0, m0] = d[i - 1];
      const [l1, m1] = d[i];
      return m0 + ((m1 - m0) * (load - l0)) / (l1 - l0);
    }
  }
  return d[0][1];
}

export function LoadChart({ chart }: { chart: NonNullable<CaseStory['proof']>['chart'] }) {
  const id = useId();
  const [load, setLoad] = useState(chart.initialLoad);
  const maxLoad = chart.withPen[chart.withPen.length - 1][0];
  const nativeEnd = chart.withoutPen[chart.withoutPen.length - 1];
  const pen = settlementAt(chart.withPen, load) ?? 0;
  const natural = settlementAt(chart.withoutPen, load);

  return (
    <figure className={s.chart}>
      <div className={s.chartHead}>
        <b>{chart.title}</b>
        <span className={t.mono}>{chart.source}</span>
      </div>
      <div className={s.chartScroll}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`Settlement in millimetres against load in kN per square metre. With PEN: ${settlementAt(chart.withPen, nativeEnd[0])} mm at ${nativeEnd[0]} and ${chart.withPen[chart.withPen.length - 1][1]} mm at ${maxLoad}. Without PEN: ${nativeEnd[1]} mm at ${nativeEnd[0]}, where that test ended.`}
          className={s.chartSvg}
        >
          {Array.from({ length: 10 }, (_, i) => i * 5).map((mm) => (
            <g key={mm}>
              <line className={s.chartGrid} x1={PAD.l} x2={PAD.r} y1={sy(mm)} y2={sy(mm)} />
              <text x={PAD.l - 8} y={sy(mm) + 4} textAnchor="end">
                {mm}
              </text>
            </g>
          ))}
          {Array.from({ length: 8 }, (_, i) => i * 100).map((l) => (
            <text key={l} x={sx(l)} y={348} textAnchor="middle">
              {l}
            </text>
          ))}
          <text x={378} y={368} textAnchor="middle">
            Load, kN/m²
          </text>
          <text x={14} y={175} textAnchor="middle" transform="rotate(-90 14 175)">
            Settlement, mm
          </text>
          <path className={s.lineNatural} d={linePath(chart.withoutPen)} />
          <path className={s.linePen} d={linePath(chart.withPen)} />
          <text className={s.chartLabelNatural} x={sx(nativeEnd[0]) + 14} y={sy(nativeEnd[1]) - 10}>
            Without PEN, test end
          </text>
          <text
            className={s.chartLabelPen}
            x={sx(maxLoad) - 6}
            y={sy(chart.withPen[chart.withPen.length - 1][1]) + 22}
            textAnchor="end"
          >
            With PEN, {maxLoad} kN/m²
          </text>
          <line className={s.chartCursor} x1={sx(load)} x2={sx(load)} y1={PAD.t} y2={PAD.b} />
          <circle className={s.dotPen} r={6} cx={sx(load)} cy={sy(pen)} />
          {natural !== null && (
            <circle className={s.dotNatural} r={6} cx={sx(load)} cy={sy(natural)} />
          )}
        </svg>
      </div>
      <div className={s.chartControls}>
        <label htmlFor={id} className={t.mono}>
          Load <output htmlFor={id}>{load}</output> kN/m²
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={maxLoad}
          step={1}
          value={load}
          onChange={(e) => setLoad(Number(e.target.value))}
          className={s.chartRange}
        />
        <div className={s.readout} aria-live="polite">
          <span>
            <i className={cx(s.swatch, s.swatchPen)} aria-hidden />
            With PEN <b>{pen.toFixed(2)} mm</b>
          </span>
          <span>
            <i className={cx(s.swatch, s.swatchNatural)} aria-hidden />
            Without PEN{' '}
            <b>{natural === null ? `test ended at ${nativeEnd[0]}` : `${natural.toFixed(2)} mm`}</b>
          </span>
        </div>
      </div>
      <figcaption className={s.caption}>{chart.caption}</figcaption>
    </figure>
  );
}

/* ---- site video with chapters ------------------------------------------- */

export function SiteVideo({ video }: { video: NonNullable<CaseStory['video']> }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const play = (time?: number) => {
    const v = ref.current;
    if (!v) return;
    if (typeof time === 'number') v.currentTime = time;
    setStarted(true);
    v.play().catch(() => setStarted(false));
  };

  return (
    <div className={s.video}>
      <div className={s.player}>
        <video
          ref={ref}
          preload="none"
          playsInline
          muted
          controls={started}
          poster={video.poster}
          aria-label={video.label}
          className={s.playerVideo}
        >
          <source src={video.src} type="video/mp4" />
        </video>
        {!started && (
          <>
            <button
              type="button"
              className={s.playButton}
              onClick={() => play()}
              aria-label="Play the site video"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <div className={s.playerMeta}>
              <b>{video.title}</b>
              <span className={t.mono}>{video.meta}</span>
            </div>
          </>
        )}
      </div>
      <div className={s.chapters} aria-label="Video chapters" role="group">
        {video.chapters.map((c) => (
          <button key={c.stamp} type="button" className={s.chapterBtn} onClick={() => play(c.time)}>
            <b className={t.mono}>{c.stamp}</b>
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---- read-by-role tabs --------------------------------------------------- */

export function RoleTabs({ tabs }: { tabs: CaseStory['roles']['tabs'] }) {
  const base = useId();
  const [active, setActive] = useState(tabs[0].id);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + tabs.length) % tabs.length;
    setActive(tabs[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div className={s.roles}>
      <div role="tablist" aria-label="Read by role" className={s.tabList}>
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`${base}-panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            className={s.tab}
            onClick={() => setActive(tab.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${base}-panel-${tab.id}`}
          aria-labelledby={`${base}-tab-${tab.id}`}
          hidden={active !== tab.id}
          className={s.tabPanel}
        >
          <div>
            <h3 className={t.h3}>{tab.heading}</h3>
            <ul className={s.ticks}>
              {tab.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div className={cx(s.tabImage, tab.image.drawing && s.isDrawing)}>
            <Image
              src={tab.image.src}
              alt={tab.image.alt}
              fill
              sizes="(min-width: 64rem) 40vw, 100vw"
              style={{ objectFit: tab.image.drawing ? 'contain' : 'cover' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
