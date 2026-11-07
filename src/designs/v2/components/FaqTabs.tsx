'use client';

import { useId, useState, type KeyboardEvent } from 'react';

import { anchors, faqV2 } from '../content';
import s from '../styles/faq.module.css';
import t from '../styles/theme.module.css';
import { ButtonLink, Chip, cx } from './primitives';

/**
 * Category pills (a real tablist: arrow keys move between tabs) over native
 * <details> rows. Switching tab swaps the whole question set.
 */
export function FaqTabs() {
  const [active, setActive] = useState(0);
  const base = useId();
  const tabs = faqV2.tabs;

  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    setActive(next);
    document.getElementById(`${base}-tab-${next}`)?.focus();
  };

  return (
    <section id={anchors.faq} className={s.section} aria-labelledby="hv2-faq-title">
      <div className={cx(s.grid, t.gutter)}>
        <header className={s.head}>
          <div data-reveal>
            <Chip>{faqV2.chip}</Chip>
          </div>
          <h2 id="hv2-faq-title" className={t.h2} data-reveal>
            {faqV2.heading}
          </h2>
          <p className={cx(t.body, s.intro)} data-reveal>
            {faqV2.body}
          </p>
          <div data-reveal>
            <ButtonLink href={faqV2.cta.href} tone="onLight">
              {faqV2.cta.label}
            </ButtonLink>
          </div>
        </header>

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
            {/* `key` remounts the list on tab change, so no row stays open across sets. */}
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
          </div>
        </div>
      </div>
    </section>
  );
}
