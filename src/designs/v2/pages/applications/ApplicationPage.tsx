import Image from 'next/image';
import Link from 'next/link';

import { PageHero } from '../../components/page/PageHero';
import { SectionHead } from '../../components/page/SectionHead';
import { ArrowRight, ButtonLink, Chip, cx, stagger } from '../../components/primitives';
import cards from '../../styles/applications.module.css';
import p from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import { CaseStudyCard } from '../projects/CaseStudyCard';
import { applicationPage, type ApplicationItem } from './content';
import s from './applications.module.css';

/**
 * /applications/[slug]. The application's own title, paragraph and photo open
 * the page; the sections after it are the shared, sourced material every
 * application page carries — the product highlights with the suitability
 * note, the four-step process, matching case studies, and the other five
 * applications as the homepage's lime-on-hover cards.
 */
export function ApplicationPage({ item }: { item: ApplicationItem }) {
  const c = applicationPage(item);

  return (
    <>
      <PageHero
        kicker={c.hero.kicker}
        title={c.hero.title}
        lead={c.hero.lead}
        image={c.hero.image}
        crumbs={c.hero.crumbs}
        actions={c.hero.actions}
      />

      <section className={cx(p.section, p.light)} aria-labelledby="app-highlights">
        <div className={t.gutter}>
          <SectionHead
            chip={c.highlights.chip}
            heading={c.highlights.heading}
            lead={c.highlights.lead}
            split
            id="app-highlights"
          />
          <ol className={s.highlights}>
            {c.highlights.items.map((h, i) => (
              <li key={h.title} className={s.highlight} data-reveal style={stagger(i)}>
                <span className={s.highlightNum}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={s.highlightTitle}>{h.title}</h3>
                <p className={s.highlightBody}>{h.body}</p>
              </li>
            ))}
          </ol>

          <aside className={s.suitability} aria-label={c.suitability.chip} data-reveal>
            <Chip>{c.suitability.chip}</Chip>
            <p className={s.suitabilityText}>{c.suitability.note}</p>
          </aside>
        </div>
      </section>

      <section className={cx(p.section, p.dark)} aria-labelledby="app-process">
        <div className={t.gutter}>
          <SectionHead
            chip={c.process.chip}
            heading={c.process.heading}
            lead={c.process.lead}
            split
            id="app-process"
          />
          <ol className={s.steps}>
            {c.process.steps.map((step, i) => (
              <li key={step.number} className={s.step} data-reveal style={stagger(i)}>
                <span className={s.stepNum}>{step.number}</span>
                <h3 className={s.stepTitle}>{step.title}</h3>
                <p className={s.stepBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {c.related.items.length > 0 && (
        <section className={cx(p.section, p.paper)} aria-labelledby="app-related">
          <div className={t.gutter}>
            <div className={s.relatedLayout}>
              <div className={s.relatedHead}>
                <SectionHead
                  chip={c.related.chip}
                  heading={c.related.heading}
                  id="app-related"
                  className={s.relatedTitle}
                />
                <div data-reveal>
                  <ButtonLink href={c.related.all.href} tone="onLight">
                    {c.related.all.label}
                  </ButtonLink>
                </div>
              </div>
              <ul className={s.related}>
                {c.related.items.map((project, i) => (
                  <li key={project.slug} data-reveal style={stagger(i)}>
                    <CaseStudyCard project={project} tone="light" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <section className={cx(p.section, p.light)} aria-labelledby="app-others">
        <div className={t.gutter}>
          <SectionHead chip={c.others.chip} heading={c.others.heading} id="app-others" />
          <ul className={cx(cards.grid, s.others)}>
            {c.others.items.map((other, i) => (
              <li key={other.href} data-reveal style={stagger(i % 3)}>
                <Link href={other.href} className={cx(cards.card, s.otherCard)}>
                  <Image
                    src={other.image.src}
                    alt={other.image.alt}
                    fill
                    sizes="(min-width: 64rem) 33vw, (min-width: 48rem) 50vw, 100vw"
                    className={cards.cardImage}
                  />
                  <span className={cards.cardShade} aria-hidden />
                  <span className={cards.cardTint} aria-hidden />
                  <span className={cards.cardArrow} aria-hidden>
                    <ArrowRight size={18} />
                  </span>
                  <div className={cards.cardText}>
                    <h3 className={cards.cardTitle}>{other.title}</h3>
                    <p className={cards.cardBody}>{other.body}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
