import Image from 'next/image';
import Link from 'next/link';

import {
  type Testimonial,
  testimonials,
  testimonialsSection as c,
} from '@/content/data/testimonials';

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

function SampleTag() {
  return <span className={cx(t.mono, s.sample)}>Sample</span>;
}

/** Cards per reel, at least: wider than a 2560px screen at the card width. */
const MIN_PER_REEL = 8;

/** One compact quote card on a drifting row. */
function Card({ item }: { item: Testimonial }) {
  return (
    <figure className={s.card}>
      <svg className={s.cardMark} viewBox="0 0 48 36" aria-hidden>
        <path d="M0 36V21.6C0 9.9 6.3 2.7 18.9 0l2.3 4.5C14.7 6.6 11.4 10.5 11.3 16.2H20V36H0Zm28 0V21.6C28 9.9 34.3 2.7 46.9 0l2.3 4.5c-6.5 2.1-9.8 6-9.9 11.7H48V36H28Z" />
      </svg>
      <blockquote className={s.cardQuote}>
        <p>{item.quote}</p>
      </blockquote>
      <figcaption className={s.cardCite}>
        <Avatar name={item.name} photo={item.photo} size="sm" />
        <span className={s.citeText}>
          <b>{item.name}</b>
          <span className={t.mono}>{item.role}</span>
        </span>
        {item.placeholder && <SampleTag />}
      </figcaption>
    </figure>
  );
}

/**
 * A drifting row of cards. The list is rendered twice so the loop is
 * seamless; the copy is hidden from screen readers so each quote is heard
 * once. It pauses on hover and focus; with reduced motion it stands still
 * and scrolls sideways instead.
 */
function Row({ items, reverse }: { items: Testimonial[]; reverse?: boolean }) {
  // Each reel must be wider than the widest screen, or the loop shows a gap:
  // repeat short lists (the repeats are hidden from screen readers).
  const reel: { item: Testimonial; repeat: boolean }[] = [];
  while (reel.length < MIN_PER_REEL) {
    items.forEach((item) => reel.push({ item, repeat: reel.length >= items.length }));
  }
  return (
    <div className={cx(s.row, reverse && s.rowReverse)}>
      {[0, 1].map((copy) => (
        <ul key={copy} className={s.reel} aria-hidden={copy === 1 || undefined}>
          {reel.map(({ item, repeat }, i) => (
            <li
              key={i}
              className={s.reelItem}
              aria-hidden={copy === 0 && repeat ? true : undefined}
            >
              <Card item={item} />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

/**
 * Testimonials: a centred head, one featured quote set large, then the rest
 * as cards on two rows drifting in opposite directions. Content lives in
 * content/data/testimonials.ts (the header there explains how to replace the
 * samples); the section hides itself while that list is empty.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  const featured = testimonials.find((item) => !item.placeholder) ?? testimonials[0];
  const rest = testimonials.filter((item) => item !== featured);
  const rows = [rest.filter((_, i) => i % 2 === 0), rest.filter((_, i) => i % 2 === 1)].filter(
    (row) => row.length > 0,
  );

  return (
    <section id="testimonials" className={s.section} aria-labelledby="hv2-testimonials-title">
      <div className={cx(t.gutter, s.head)}>
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
      </div>

      <figure className={cx(t.gutter, s.featured)} data-reveal style={stagger(2)}>
        {featured.highlight && <p className={s.highlight}>{featured.highlight}</p>}
        <blockquote className={cx(s.quote, !featured.highlight && s.quoteLarge)}>
          <p>“{featured.quote}”</p>
        </blockquote>
        <figcaption className={s.cite}>
          <Avatar name={featured.name} photo={featured.photo} size="lg" />
          <span className={s.citeText}>
            <b>{featured.name}</b>
            <span className={t.mono}>{featured.role}</span>
            {featured.source && <span className={cx(t.mono, s.source)}>{featured.source}</span>}
          </span>
          {featured.project &&
            (featured.project.href ? (
              <Link href={featured.project.href} className={s.project}>
                <span className={t.mono}>Project</span>
                {featured.project.label}
                <ArrowRight size={14} />
              </Link>
            ) : (
              <span className={s.project}>
                <span className={t.mono}>Project</span>
                {featured.project.label}
              </span>
            ))}
          {featured.placeholder && <SampleTag />}
        </figcaption>
      </figure>

      {rows.length > 0 && (
        <div className={s.wall} aria-label="More testimonials" role="group">
          {rows.map((row, i) => (
            <Row key={i} items={row} reverse={i === 1} />
          ))}
        </div>
      )}
    </section>
  );
}
