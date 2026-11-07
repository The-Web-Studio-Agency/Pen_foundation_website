'use client';

import { type CSSProperties, useId, useMemo, useState } from 'react';

import { ButtonLink, cx } from '../../components/primitives';
import t from '../../styles/theme.module.css';
import s from './technology.module.css';

/*
 * Inputs and arithmetic carried over unchanged from the /engineering
 * calculator (features/engineering/components/Calculator.tsx): ~2 h per point
 * so six points a working day, 6× faster than conventional, ~100 kg CO₂-eq
 * avoided per unit. Soil type is recorded but does not change the figures —
 * as before.
 */
const TYPES = ['Residential', 'Commercial', 'Solar', 'Eco Resort'] as const;
const SOILS = ['Laterite', 'Clay', 'Sand mix', 'Water-rich'] as const;
const DEFAULT_POINTS: Record<(typeof TYPES)[number], number> = {
  Residential: 12,
  Commercial: 60,
  Solar: 240,
  'Eco Resort': 36,
};
const MIN_POINTS = 4;
const MAX_POINTS = 500;

interface CalculatorProps {
  basis: string;
  disclaimer: string;
  tag: string;
  cta: { label: string; href: string };
}

export function Calculator({ basis, disclaimer, tag, cta }: CalculatorProps) {
  const id = useId();
  const [type, setType] = useState<(typeof TYPES)[number]>('Residential');
  const [points, setPoints] = useState(DEFAULT_POINTS.Residential);
  const [soil, setSoil] = useState<(typeof SOILS)[number]>('Laterite');

  const out = useMemo(() => {
    const penPerDay = 6; // ~2 h/point, working day, single crew
    const penDays = Math.max(1, Math.ceil(points / penPerDay));
    const tradDays = penDays * 6; // 6× faster deployment
    const savedDays = tradDays - penDays;
    const savedPct = Math.round((savedDays / tradDays) * 100);
    const co2 = points * 100; // kg CO₂-eq avoided per unit
    return { penDays, tradDays, savedDays, savedPct, co2 };
  }, [points]);

  const co2Display = out.co2 >= 1000 ? `${(out.co2 / 1000).toFixed(1)} t` : `${out.co2} kg`;
  const fill = ((points - MIN_POINTS) / (MAX_POINTS - MIN_POINTS)) * 100;

  return (
    <div className={s.calc}>
      <div className={s.calcInputs} data-reveal>
        <div className={s.field}>
          <p id={`${id}-type`} className={cx(t.mono, s.fieldLabel)}>
            Project type
          </p>
          <div className={s.options} role="group" aria-labelledby={`${id}-type`}>
            {TYPES.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={type === option}
                className={s.option}
                onClick={() => {
                  setType(option);
                  setPoints(DEFAULT_POINTS[option]);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className={s.field}>
          <div className={s.fieldRow}>
            <label htmlFor={`${id}-points`} className={cx(t.mono, s.fieldLabel)}>
              Foundation points
            </label>
            <output htmlFor={`${id}-points`} className={s.pointsValue}>
              {points}
            </output>
          </div>
          <input
            id={`${id}-points`}
            type="range"
            min={MIN_POINTS}
            max={MAX_POINTS}
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            className={s.range}
            style={{ '--fill': `${fill}%` } as CSSProperties}
          />
          <div className={cx(t.mono, s.rangeEnds)} aria-hidden>
            <span>{MIN_POINTS}</span>
            <span>{MAX_POINTS}</span>
          </div>
        </div>

        <div className={s.field}>
          <p id={`${id}-soil`} className={cx(t.mono, s.fieldLabel)}>
            Soil type
          </p>
          <div className={s.options} role="group" aria-labelledby={`${id}-soil`}>
            {SOILS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={soil === option}
                className={s.option}
                onClick={() => setSoil(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={s.calcResults} data-reveal>
        <dl className={s.results} aria-live="polite">
          <div className={cx(s.result, s.resultMuted)}>
            <dt className={t.mono}>Traditional time</dt>
            <dd>
              <span className={s.resultValue}>{out.tradDays}</span>
              <span className={cx(t.mono, s.resultUnit)}>days</span>
            </dd>
          </div>
          <div className={cx(s.result, s.resultAccent)}>
            <dt className={t.mono}>PEN time</dt>
            <dd>
              <span className={s.resultValue}>{out.penDays}</span>
              <span className={cx(t.mono, s.resultUnit)}>days</span>
            </dd>
          </div>
          <div className={s.result}>
            <dt className={t.mono}>Time saved</dt>
            <dd>
              <span className={s.resultValue}>{out.savedDays}</span>
              <span className={cx(t.mono, s.resultUnit)}>days · {out.savedPct}%</span>
            </dd>
          </div>
          <div className={s.result}>
            <dt className={t.mono}>CO₂-eq avoided</dt>
            <dd>
              <span className={s.resultValue}>{co2Display}</span>
              <span className={cx(t.mono, s.resultUnit)}>est.</span>
            </dd>
          </div>
        </dl>

        <div className={s.calcFoot}>
          <span className={cx(t.mono, s.calcTag)}>{tag}</span>
          <p className={s.calcBasis}>{basis}</p>
          <p className={cx(t.mono, s.calcDisclaimer)}>{disclaimer}</p>
          <ButtonLink href={cta.href} tone="solid" className={s.calcCta}>
            {cta.label}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
