import Image from 'next/image';
import Link from 'next/link';

import { anchors, applicationsV2 } from '../content';
import s from '../styles/applications.module.css';
import t from '../styles/theme.module.css';
import { ArrowRight, Chip, cx, stagger } from './primitives';

/**
 * Chip, big heading, then every application as an image card in a three-column
 * grid. Each card is a link to that application's page: the application name
 * is the heading, its description the paragraph beneath. On hover the whole
 * card washes lime.
 */
export function Applications() {
  return (
    <section id={anchors.applications} className={s.section} aria-labelledby="hv2-apps-title">
      <div className={t.gutter}>
        <header className={s.head}>
          <div data-reveal>
            <Chip>{applicationsV2.chip}</Chip>
          </div>
          <h2 id="hv2-apps-title" className={cx(t.h2, s.title)} data-reveal style={stagger(1)}>
            {applicationsV2.heading}
          </h2>
          <p className={cx(t.lead, s.lead)} data-reveal style={stagger(2)}>
            {applicationsV2.lead}
          </p>
        </header>

        <ul className={s.grid}>
          {applicationsV2.items.map((item, i) => (
            <li key={item.title} data-reveal style={stagger(i % 3)}>
              <Link href={item.href} className={s.card}>
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 64rem) 33vw, (min-width: 48rem) 50vw, 100vw"
                  className={s.cardImage}
                />
                <span className={s.cardShade} aria-hidden />
                <span className={s.cardTint} aria-hidden />
                <span className={s.cardArrow} aria-hidden>
                  <ArrowRight size={18} />
                </span>
                <div className={s.cardText}>
                  <h3 className={s.cardTitle}>{item.title}</h3>
                  <p className={s.cardBody}>{item.body}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <p className={cx(t.mono, s.note)} data-reveal>
          {applicationsV2.note}
        </p>
      </div>
    </section>
  );
}
