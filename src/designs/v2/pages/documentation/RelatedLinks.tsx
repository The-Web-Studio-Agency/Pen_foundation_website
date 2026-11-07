import Link from 'next/link';

import { SectionHead } from '../../components/page/SectionHead';
import { ArrowRight, cx, stagger } from '../../components/primitives';
import p from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import s from './docs.module.css';

export interface RelatedLink {
  label: string;
  href: string;
  body: string;
}

/**
 * "Keep exploring": the other Resources pages as forest cards that wash lime
 * on hover. Shared by /docs and /certifications.
 */
export function RelatedLinks({ id, items }: { id: string; items: RelatedLink[] }) {
  return (
    <section className={cx(p.section, p.light)} aria-labelledby={id}>
      <div className={t.gutter}>
        <SectionHead id={id} chip="Also in resources" heading="Keep exploring" />
        <ul className={s.related}>
          {items.map((item, i) => (
            <li key={item.href} data-reveal style={stagger(i)}>
              <Link href={item.href} className={s.relatedCard}>
                <span className={s.relatedTint} aria-hidden />
                <span className={cx(t.mono, s.relatedLabel)}>{item.label}</span>
                <span className={s.relatedBody}>{item.body}</span>
                <span className={s.relatedArrow} aria-hidden>
                  <ArrowRight size={18} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
