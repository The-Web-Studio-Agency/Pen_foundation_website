'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useId, useState } from 'react';

import { testimonials, testimonialsSection as c } from '@/content/data/testimonials';

import s from '../styles/testimonials.module.css';
import t from '../styles/theme.module.css';
import { ArrowRight, Chip, cx, stagger } from './primitives';

/** "Karan J Fraanc" → "KF": first and last initials. */
function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (
    (parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')
  ).toUpperCase();
}

function Avatar({ name, photo, size }: { name: string; photo?: string; size: 'sm' | 'lg' }) {
  return (
    <span className={cx(s.avatar, size === 'lg' ? s.avatarLg : s.avatarSm)} aria-hidden>
      {photo ? (
        <Image src={photo} alt="" fill sizes="64px" className={s.avatarImg} />
      ) : (
        initials(name)
      )}
    </span>
  );
}

function Arrow({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={dir === 'prev' ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Written testimonials: heading and the people quoted on the left, one large
 * quote card on the right. Pick a person, or step with the arrows; the card
 * cross-fades. With a single entry the controls drop away and it reads as a
 * featured quote. Content in content/data/testimonials.ts; the section hides
 * itself while that list is empty.
 */
export function Testimonials() {
  const base = useId();
  const [index, setIndex] = useState(0);
  const count = testimonials.length;
  if (count === 0) return null;

  const many = count > 1;
  const item = testimonials[index];
  const go = (step: number) => {
    const next = (index + step + count) % count;
    setIndex(next);
    // On phones the people row scrolls sideways; keep the chosen one in view.
    document
      .getElementById(`${base}-tab-${next}`)
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  };
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section
      id="testimonials"
      className={s.section}
      aria-labelledby="hv2-testimonials-title"
      aria-roledescription={many ? 'carousel' : undefined}
    >
      <div className={cx(t.gutter, s.layout)}>
        <div className={s.side}>
          <div data-reveal>
            <Chip>{c.chip}</Chip>
          </div>
          <h2
            id="hv2-testimonials-title"
            className={cx(t.h2, s.title)}
            data-reveal
            style={stagger(1)}
          >
            {c.heading}
          </h2>

          {many && (
            <>
              <div className={s.people} role="tablist" aria-label="Testimonials" data-reveal>
                {testimonials.map((person, i) => (
                  <button
                    key={person.name}
                    type="button"
                    role="tab"
                    id={`${base}-tab-${i}`}
                    aria-selected={i === index}
                    aria-controls={`${base}-panel`}
                    className={s.person}
                    onClick={() => setIndex(i)}
                  >
                    <Avatar name={person.name} photo={person.photo} size="sm" />
                    <span className={s.personText}>
                      <b>{person.name}</b>
                      <span className={t.mono}>{person.role}</span>
                    </span>
                  </button>
                ))}
              </div>

              <div className={s.controls} data-reveal>
                <span className={cx(t.mono, s.counter)} aria-hidden>
                  <b>{pad(index + 1)}</b> / {pad(count)}
                </span>
                <div className={s.arrows}>
                  <button
                    type="button"
                    className={s.arrow}
                    onClick={() => go(-1)}
                    aria-label="Previous testimonial"
                  >
                    <Arrow dir="prev" />
                  </button>
                  <button
                    type="button"
                    className={s.arrow}
                    onClick={() => go(1)}
                    aria-label="Next testimonial"
                  >
                    <Arrow dir="next" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <figure
          id={`${base}-panel`}
          role={many ? 'tabpanel' : undefined}
          aria-labelledby={many ? `${base}-tab-${index}` : undefined}
          aria-live={many ? 'polite' : undefined}
          className={s.card}
          data-reveal
          style={stagger(2)}
        >
          <svg className={s.mark} viewBox="0 0 48 36" aria-hidden>
            <path d="M0 36V21.6C0 9.9 6.3 2.7 18.9 0l2.3 4.5C14.7 6.6 11.4 10.5 11.3 16.2H20V36H0Zm28 0V21.6C28 9.9 34.3 2.7 46.9 0l2.3 4.5c-6.5 2.1-9.8 6-9.9 11.7H48V36H28Z" />
          </svg>

          {/* Keyed so each quote fades in on its own. */}
          <div key={index} className={s.body}>
            {item.highlight && <p className={s.highlight}>{item.highlight}</p>}
            <blockquote className={cx(s.quote, !item.highlight && s.quoteLarge)}>
              <p>“{item.quote}”</p>
            </blockquote>

            <figcaption className={s.cite}>
              <Avatar name={item.name} photo={item.photo} size="lg" />
              <span className={s.citeText}>
                <b>{item.name}</b>
                <span className={t.mono}>{item.role}</span>
                {item.source && <span className={cx(t.mono, s.source)}>{item.source}</span>}
              </span>
              {item.project &&
                (item.project.href ? (
                  <Link href={item.project.href} className={s.project}>
                    <span className={t.mono}>Project</span>
                    {item.project.label}
                    <ArrowRight size={14} />
                  </Link>
                ) : (
                  <span className={s.project}>
                    <span className={t.mono}>Project</span>
                    {item.project.label}
                  </span>
                ))}
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}
