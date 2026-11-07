'use client';

import { type CSSProperties, useId, useMemo, useState } from 'react';

import { calculator as c } from '@/content/data/homepage';
import {
  estimateProject,
  formatArea,
  formatCountRange,
  formatMassRange,
} from '@/lib/calculator/savings';

import s from '../styles/estimator.module.css';
import t from '../styles/theme.module.css';
import { ButtonLink, Chip, cx, stagger } from './primitives';

const ASSESSMENT_HREF = '/contact#contact-form';

/**
 * Homepage project estimator, built to the client's calculator spec
 * (`calculator` in content/data/homepage.ts; arithmetic in
 * lib/calculator/savings.ts): built-up area in, an indicative PEN unit band and
 * the CO₂e it avoids out. No cost figure — the spec removes it ("Cost is too
 * project- and site-dependent for a generic public calculator"). Project type
 * is context for the assessment and doesn't change the figures; the small
 * print says so.
 */
export function ProjectEstimator() {
  const id = useId();
  const [area, setArea] = useState(c.area.initial);
  const [type, setType] = useState(c.projectTypes[0].id);
  const est = useMemo(() => estimateProject(area), [area]);
  const fill = ((area - c.area.min) / (c.area.max - c.area.min)) * 100;

  return (
    <section id="estimator" className={s.section} aria-labelledby="hv2-estimator-title">
      <div className={t.gutter}>
        <header className={s.head}>
          <div>
            <div data-reveal>
              <Chip>Project calculator</Chip>
            </div>
            <h2
              id="hv2-estimator-title"
              className={cx(t.h2, s.title)}
              data-reveal
              style={stagger(1)}
            >
              {c.heading}
            </h2>
          </div>
          <p className={cx(t.lead, s.lead)} data-reveal style={stagger(2)}>
            {c.body.lead}
            <a href={ASSESSMENT_HREF}>{c.body.linkLabel}</a>
            {c.body.trail}
          </p>
        </header>

        <div className={s.calc}>
          <div className={s.inputs} data-reveal>
            <p className={cx(t.mono, s.panelTitle)}>{c.parametersTitle}</p>

            <div className={s.field}>
              <div className={s.fieldRow}>
                <label htmlFor={`${id}-area`} className={cx(t.mono, s.fieldLabel)}>
                  {c.areaLabel}
                </label>
                <output htmlFor={`${id}-area`} className={s.areaValue}>
                  {formatArea(area)}
                  <span className={cx(t.mono, s.areaUnit)}>{c.areaUnit}</span>
                </output>
              </div>
              <input
                id={`${id}-area`}
                type="range"
                min={c.area.min}
                max={c.area.max}
                step={c.area.step}
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className={s.range}
                style={{ '--fill': `${fill}%` } as CSSProperties}
              />
              <div className={cx(t.mono, s.rangeEnds)} aria-hidden>
                <span>{formatArea(c.area.min)}</span>
                <span>{formatArea(c.area.max)}</span>
              </div>
            </div>

            <div className={s.field}>
              <p id={`${id}-type`} className={cx(t.mono, s.fieldLabel)}>
                Project type
              </p>
              <div className={s.options} role="group" aria-labelledby={`${id}-type`}>
                {c.projectTypes.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={type === option.id}
                    className={s.option}
                    onClick={() => setType(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <ul className={s.basis}>
              {c.basis.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>

          <div className={s.results} data-reveal>
            <dl className={s.cards} aria-live="polite">
              <div className={cx(s.card, s.cardAccent)}>
                <dt className={t.mono}>{c.unitsLabel}</dt>
                <dd>
                  <span className={s.value}>{formatCountRange(est.unitsMin, est.unitsMax)}</span>
                  <span className={cx(t.mono, s.note)}>{c.unitsNote}</span>
                </dd>
              </div>
              <div className={s.card}>
                <dt className={t.mono}>{c.programmeLabel}</dt>
                <dd>
                  <span className={s.value}>{c.programmeValue}</span>
                  <span className={cx(t.mono, s.note)}>{c.programmeNote}</span>
                </dd>
              </div>
              <div className={cx(s.card, s.cardWide)}>
                <dt className={t.mono}>{c.carbon.label}</dt>
                <dd>
                  <span className={s.value}>
                    {formatMassRange(est.co2SavedKgMin, est.co2SavedKgMax)}
                  </span>
                  <span className={cx(t.mono, s.note)}>
                    {c.carbon.treesPrefix} {formatCountRange(est.treesMin, est.treesMax)}{' '}
                    {c.carbon.treesSuffix} ·{' '}
                    <a href={c.carbon.href} className={s.noteLink}>
                      {c.carbon.linkLabel}
                    </a>
                  </span>
                </dd>
              </div>
            </dl>
            <ButtonLink href={ASSESSMENT_HREF} tone="solid" className={s.cta}>
              {c.cta.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
