'use client';

import { useId, useState, type KeyboardEvent } from 'react';

import s from '../styles/faq.module.css';
import t from '../styles/theme.module.css';
import { ButtonLink, Chip, cx } from './primitives';

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface FaqTab {
  id: string;
  label: string;
  entries: readonly FaqEntry[];
}

interface FaqSectionProps {
  chip: string;
  heading: string;
  /** Short paragraph under the heading. */
  body?: string;
  cta?: { label: string; href: string };
  /** One tab shows its questions with no category pills. */
  tabs: readonly FaqTab[];
  /** The section's own id, for in-page links. */
  id?: string;
  /** The heading's id; the section is labelled by it. */
  titleId: string;
}

/**
 * The site's FAQ: the homepage design, used on every page that has one.
 * Heading, intro and button on the left (sticky on desktop), the questions
 * on the right as native <details> rows. With several sets, category pills
 * (a real tablist: arrow keys move between tabs) swap the whole set.
 */
export function FaqSection({ chip, heading, body, cta, tabs, id, titleId }: FaqSectionProps) {
  const [active, setActive] = useState(0);
  const base = useId();
  const many = tabs.length > 1;

  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    setActive(next);
    document.getElementById(`${base}-tab-${next}`)?.focus();
  };

  const list = (
    // `key` remounts the list on tab change, so no row stays open across sets.
    <ul key={tabs[active].id} className={s.list}>
      {tabs[active].entries.map((entry) => (
        <li key={entry.question}>
          <details className={s.item}>
            <summary className={s.summary}>
              <span>{entry.question}</span>
              <span className={s.plus} aria-hidden />
            </summary>
            <p className={s.answer}>{entry.answer}</p>
          </details>
        </li>
      ))}
    </ul>
  );

  return (
    <section id={id} className={s.section} aria-labelledby={titleId}>
      <div className={cx(s.grid, t.gutter)}>
        <header className={s.head}>
          <div data-reveal>
            <Chip>{chip}</Chip>
          </div>
          <h2 id={titleId} className={t.h2} data-reveal>
            {heading}
          </h2>
          {body && (
            <p className={cx(t.body, s.intro)} data-reveal>
              {body}
            </p>
          )}
          {cta && (
            <div data-reveal>
              <ButtonLink href={cta.href} tone="onLight">
                {cta.label}
              </ButtonLink>
            </div>
          )}
        </header>

        {many ? (
          <div>
            <div role="tablist" aria-label="FAQ categories" className={s.tabs}>
              {tabs.map((tab, i) => (
                <button
                  key={tab.id}
                  id={`${base}-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-controls={`${base}-panel`}
                  tabIndex={i === active ? 0 : -1}
                  className={cx(t.mono, s.tab, i === active && s.tabActive)}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-tab-${active}`}>
              {list}
            </div>
          </div>
        ) : (
          <div>{list}</div>
        )}
      </div>
    </section>
  );
}
