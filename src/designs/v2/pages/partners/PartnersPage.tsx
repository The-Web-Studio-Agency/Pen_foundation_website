import { partnerNetwork as c, type NetworkPartner } from '@/content/data/partner-network';

import { PageHero } from '../../components/page/PageHero';
import { SectionHead } from '../../components/page/SectionHead';
import { ButtonLink, cx, stagger } from '../../components/primitives';
import p from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import s from './partners.module.css';

/** A source value still reading "[PHONE]" and the like. */
const isPlaceholder = (value: string) => /^\s*\[.*\]\s*$/.test(value);

function PartnerCard({ partner, accent }: { partner: NetworkPartner; accent?: boolean }) {
  const rows = partner.rows.filter((row) => !isPlaceholder(row.value));
  return (
    <article className={cx(s.card, accent && s.cardAlt)} data-reveal>
      <p className={cx(t.mono, s.role)}>{partner.role}</p>
      <h3 className={cx(t.h3, s.name)}>{partner.name}</h3>
      {rows.length > 0 && (
        <dl className={s.rows}>
          {rows.map((row) => (
            <div key={row.label}>
              <dt className={t.mono}>{row.label}</dt>
              <dd>
                {row.kind === 'phone' ? (
                  <a href={`tel:${row.value.replace(/\s+/g, '')}`}>{row.value}</a>
                ) : row.kind === 'email' ? (
                  <a href={`mailto:${row.value}`}>{row.value}</a>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}

/**
 * /partners — who is authorised to supply and install PEN.
 *
 *   dark   hero + trust strip
 *   paper  solution provider and resellers, side by side
 *   black  certified installers: the coming cohort and the four steps
 *   white  why use an authorised partner, then the join call
 *
 * Copy from content/data/partner-network.ts; unfilled placeholder rows are
 * left off the cards.
 */
export function PartnersPage() {
  return (
    <>
      <PageHero
        kicker={c.hero.kicker}
        title={c.hero.title}
        lead={c.hero.lead}
        actions={[
          { label: 'Find a partner', href: '#network' },
          { label: c.join.cta.label, href: '#join', tone: 'ghost' },
        ]}
      />

      <section id="network" className={cx(p.section, p.paper)} aria-label="Authorised partners">
        <div className={t.gutter}>
          <ul className={s.trust} aria-label="About PEN">
            {c.hero.trust.map((item, i) => (
              <li key={item} className={t.mono} data-reveal style={stagger(i)}>
                {item}
              </li>
            ))}
          </ul>

          <div className={s.pair}>
            <div className={s.group}>
              <SectionHead
                chip={c.providers.chip}
                heading={c.providers.heading}
                lead={c.providers.lead}
                id="partners-providers"
              />
              {c.providers.items.map((partner) => (
                <PartnerCard key={partner.name} partner={partner} />
              ))}
            </div>
            <div className={s.group}>
              <SectionHead
                chip={c.resellers.chip}
                heading={c.resellers.heading}
                lead={c.resellers.lead}
                id="partners-resellers"
              />
              {c.resellers.items.map((partner) => (
                <PartnerCard key={partner.name} partner={partner} accent />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={cx(p.section, p.black)} aria-labelledby="partners-installers">
        <div className={t.gutter}>
          <SectionHead
            chip={c.installers.chip}
            heading={c.installers.heading}
            lead={c.installers.lead}
            split
            id="partners-installers"
          />
          <div className={s.soon} data-reveal>
            <div>
              <h3 className={t.h3}>{c.installers.soon.heading}</h3>
              <p>{c.installers.soon.body}</p>
            </div>
            <ButtonLink href={c.installers.soon.cta.href} tone="solid">
              {c.installers.soon.cta.label}
            </ButtonLink>
          </div>
          <ol className={s.steps}>
            {c.installers.steps.map((step, i) => (
              <li key={step.title} data-reveal style={stagger(i)}>
                <span className={cx(t.mono, s.stepNum)}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={s.stepTitle}>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={cx(p.section, p.light)} aria-labelledby="partners-why">
        <div className={t.gutter}>
          <SectionHead chip={c.why.chip} heading={c.why.heading} id="partners-why" />
          <ul className={s.why}>
            {c.why.items.map((item, i) => (
              <li key={item.title} data-reveal style={stagger(i)}>
                <h3 className={s.whyTitle}>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>

          <div id="join" className={s.join} data-reveal>
            <div>
              <h2 className={t.h2}>{c.join.heading}</h2>
              <p className={t.lead}>{c.join.body}</p>
            </div>
            <ButtonLink href={c.join.cta.href} tone="solid">
              {c.join.cta.label}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
