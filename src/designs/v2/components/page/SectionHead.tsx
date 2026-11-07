import type { ReactNode } from 'react';

import s from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import { Chip, cx, stagger } from '../primitives';

interface SectionHeadProps {
  /** Lime chip label above the heading. */
  chip: string;
  heading: ReactNode;
  lead?: ReactNode;
  /** Heading level; h2 by default. */
  as?: 'h2' | 'h3';
  /** Heading + lead side by side on wide screens (default: stacked). */
  split?: boolean;
  id?: string;
  className?: string;
}

/**
 * The chapter opening used across the site: lime chip, large heading, then a
 * lead paragraph — the homepage sections' pattern. Colour follows the
 * section (`color`), so it works on light and dark grounds alike.
 */
export function SectionHead({
  chip,
  heading,
  lead,
  as = 'h2',
  split,
  id,
  className,
}: SectionHeadProps) {
  const Heading = as;
  return (
    <header className={cx(s.head, split && s.headSplit, className)}>
      <div className={s.headMain}>
        <div data-reveal>
          <Chip>{chip}</Chip>
        </div>
        <Heading
          id={id}
          className={cx(as === 'h2' ? t.h2 : t.h3, s.headTitle)}
          data-reveal
          style={stagger(1)}
        >
          {heading}
        </Heading>
      </div>
      {lead && (
        <p className={cx(t.lead, s.headLead)} data-reveal style={stagger(2)}>
          {lead}
        </p>
      )}
    </header>
  );
}
