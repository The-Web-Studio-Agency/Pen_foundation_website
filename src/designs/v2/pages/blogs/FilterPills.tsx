'use client';

import { cx } from '../../components/primitives';
import t from '../../styles/theme.module.css';
import s from './filters.module.css';

interface FilterPillsProps<T extends string> {
  /** Accessible name of the group, e.g. "Filter articles by subject". */
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  /** Ground the pills sit on. */
  tone?: 'light' | 'dark';
  /** Optional count shown after each label. */
  counts?: Partial<Record<T, number>>;
}

/**
 * The homepage FAQ's pill row, as a filter: toggle buttons (`aria-pressed`)
 * rather than a tablist, because the list below is filtered in place, not
 * swapped for another panel. The selected pill fills lime.
 */
export function FilterPills<T extends string>({
  label,
  options,
  value,
  onChange,
  tone = 'light',
  counts,
}: FilterPillsProps<T>) {
  return (
    <div role="group" aria-label={label} className={cx(s.pills, tone === 'dark' && s.dark)}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={option === value}
          className={cx(t.mono, s.pill, option === value && s.active)}
          onClick={() => onChange(option)}
        >
          {option}
          {counts?.[option] !== undefined && <span className={s.count}>{counts[option]}</span>}
        </button>
      ))}
    </div>
  );
}
