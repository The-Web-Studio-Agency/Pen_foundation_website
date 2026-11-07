import Image from 'next/image';
import type { CSSProperties } from 'react';

import { anatomyV2, anchors, evidenceV2, manifestoV2, systemV2 } from '../content';
import s from '../styles/system.module.css';
import t from '../styles/theme.module.css';
import { LoopVideo } from './LoopVideo';
import { ArrowDown, ButtonLink, Chip, cx, stagger } from './primitives';

/**
 * The black chapter: what PEN is, what it is made of, why it carries load, and
 * the one-line promise — four beats on one continuous black ground.
 */
export function SystemChapter() {
  return (
    <div className={s.chapter}>
      <SystemIntro />
      <Anatomy />
      <Evidence />
      <Manifesto />
    </div>
  );
}

function SystemIntro() {
  return (
    <section
      id={anchors.system}
      className={cx(s.intro, t.gutter)}
      aria-labelledby="hv2-system-title"
    >
      <div className={s.introGlow} aria-hidden />
      <div data-reveal>
        <Chip>{systemV2.chip}</Chip>
      </div>
      <h2 id="hv2-system-title" className={cx(t.display, s.introTitle)}>
        {systemV2.heading.map((line, i) => (
          <span key={line} className={s.introLine} data-reveal style={stagger(i + 1)}>
            {line}
          </span>
        ))}
      </h2>
      <p className={cx(t.lead, s.introLead)} data-reveal style={stagger(4)}>
        {systemV2.lead}
      </p>
      <a
        href="#hv2-anatomy"
        className={s.introArrow}
        aria-label="Continue to the anatomy of the node"
      >
        <ArrowDown />
      </a>
    </section>
  );
}

function Anatomy() {
  const { render } = anatomyV2;
  return (
    <section id="hv2-anatomy" className={cx(s.split, t.gutter)} aria-labelledby="hv2-anatomy-title">
      <div className={s.splitText}>
        <div data-reveal>
          <Chip>{anatomyV2.chip}</Chip>
        </div>
        <h3 id="hv2-anatomy-title" className={t.h3} data-reveal style={stagger(1)}>
          {anatomyV2.heading}
        </h3>
        <p className={cx(t.body, s.splitBody)} data-reveal style={stagger(2)}>
          {anatomyV2.body}
        </p>
        <div data-reveal style={stagger(3)}>
          <ButtonLink href={anatomyV2.cta.href} tone="onDark">
            {anatomyV2.cta.label}
          </ButtonLink>
        </div>
      </div>

      <figure className={s.renderPanel} data-reveal style={stagger(1)}>
        <Image
          src={render.src}
          alt={render.alt}
          width={render.width}
          height={render.height}
          sizes="(min-width: 64rem) 50vw, 100vw"
          className={s.render}
        />
        <ul className={s.tags}>
          {anatomyV2.tags.map((tag, i) => (
            <li
              key={tag.label}
              className={s.tag}
              style={{ '--x': `${tag.x}%`, '--y': `${tag.y}%`, '--i': i + 2 } as CSSProperties}
            >
              <span className={s.tagDot} aria-hidden />
              <span className={cx(t.mono, s.tagLabel)}>{tag.label}</span>
            </li>
          ))}
        </ul>
      </figure>
    </section>
  );
}

function Evidence() {
  return (
    <section className={cx(s.split, s.splitReverse, t.gutter)} aria-labelledby="hv2-evidence-title">
      <ul className={s.stats}>
        {evidenceV2.stats.map((stat, i) => (
          <li key={stat.label} className={s.stat} data-reveal style={stagger(i)}>
            <p className={cx(t.mono, s.statLabel)}>{stat.label}</p>
            <p className={s.statValue}>{stat.value}</p>
            <p className={s.statNote}>{stat.note}</p>
          </li>
        ))}
        <li className={s.confirm} data-reveal style={stagger(3)}>
          <span className={s.confirmTick} aria-hidden>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="m2.5 6.2 2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          {evidenceV2.confirmation}
        </li>
      </ul>

      <div className={s.splitText}>
        <div data-reveal>
          <Chip>{evidenceV2.chip}</Chip>
        </div>
        <h3 id="hv2-evidence-title" className={t.h3} data-reveal style={stagger(1)}>
          {evidenceV2.heading}
        </h3>
        <p className={cx(t.body, s.splitBody)} data-reveal style={stagger(2)}>
          {evidenceV2.body}
        </p>
        <div data-reveal style={stagger(3)}>
          <ButtonLink href={evidenceV2.cta.href} tone="onDark">
            {evidenceV2.cta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className={s.manifesto} aria-labelledby="hv2-manifesto-title">
      <LoopVideo
        src={manifestoV2.film.src}
        poster={manifestoV2.film.poster}
        className={s.manifestoFilm}
      />
      <div className={s.manifestoShade} aria-hidden />
      <div className={cx(s.manifestoInner, t.gutter)}>
        <div className={t.chipRow} data-reveal>
          {manifestoV2.chips.map((chip) => (
            <Chip key={chip}>{chip}</Chip>
          ))}
        </div>
        <h2 id="hv2-manifesto-title" className={cx(t.display, s.manifestoTitle)}>
          {manifestoV2.lines.map((line, i) => (
            <span key={line} className={s.introLine} data-reveal style={stagger(i + 1)}>
              {line}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
