import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import s from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import { ButtonLink, cx, stagger } from '../primitives';

export interface PageHeroAction {
  label: string;
  href: string;
  /** `solid` (lime, default for the first action) or `ghost` (outlined). */
  tone?: 'solid' | 'ghost';
}

export interface PageHeroFact {
  label: string;
  value: string;
}

interface PageHeroProps {
  /** Small mono label after the lime rule, e.g. "Applications". */
  kicker: string;
  /** The page's h1. */
  title: string;
  /** Supporting paragraph, set on the right on wide screens. */
  lead?: string;
  actions?: PageHeroAction[];
  /** Optional photo behind the copy, under a forest shade. */
  image?: { src: string; alt: string };
  /** Breadcrumb trail above the kicker; the last crumb is the current page. */
  crumbs?: { label: string; href?: string }[];
  /** A row of key figures along the bottom edge. */
  facts?: PageHeroFact[];
  /** Full-screen height instead of the default ~70svh. */
  tall?: boolean;
}

/**
 * The dark opening every inner page starts with — the homepage hero's
 * language without its 3D act: forest gradient (or a photo under a forest
 * shade), the lime-rule kicker, a large headline on the left and the lead
 * plus actions on the right. Dark on purpose: the site header's transparent
 * top state is white type.
 */
export function PageHero({
  kicker,
  title,
  lead,
  actions,
  image,
  crumbs,
  facts,
  tall,
}: PageHeroProps) {
  return (
    <section className={cx(s.hero, tall && s.heroTall, image && s.heroImage)}>
      {image ? (
        <>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className={s.heroPhoto}
          />
          <div className={s.heroShade} aria-hidden />
        </>
      ) : (
        <div className={s.heroGlow} aria-hidden>
          <div className={s.heroFloor} />
        </div>
      )}

      <div className={cx(s.heroInner, t.gutter)}>
        <div className={s.heroLeft}>
          {crumbs && crumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className={s.crumbs} data-reveal>
              <ol>
                {crumbs.map((crumb, i) => (
                  <li key={crumb.label}>
                    {crumb.href && i < crumbs.length - 1 ? (
                      <Link href={crumb.href}>{crumb.label}</Link>
                    ) : (
                      <span aria-current={i === crumbs.length - 1 ? 'page' : undefined}>
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <p className={s.kicker} data-reveal>
            <span className={s.kickerRule} aria-hidden />
            <span>{kicker}</span>
          </p>
          <h1 className={cx(t.display, s.heroTitle)} data-reveal style={stagger(1)}>
            {title}
          </h1>
        </div>

        {(lead || actions) && (
          <div className={s.heroRight} data-reveal style={stagger(2)}>
            {lead && <p className={s.heroLead}>{lead}</p>}
            {actions && actions.length > 0 && (
              <div className={s.heroActions}>
                {actions.map((action, i) => (
                  <ButtonLink
                    key={action.href}
                    href={action.href}
                    tone={
                      (action.tone ?? (i === 0 ? 'solid' : 'ghost')) === 'solid'
                        ? 'solid'
                        : 'onDark'
                    }
                  >
                    {action.label}
                  </ButtonLink>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {facts && facts.length > 0 && (
        <dl className={cx(s.facts, t.gutter)} style={{ '--facts': facts.length } as CSSProperties}>
          {facts.map((fact, i) => (
            <div key={fact.label} className={s.fact} data-reveal style={stagger(i)}>
              <dt className={t.mono}>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
