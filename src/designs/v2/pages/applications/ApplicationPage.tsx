import Image from 'next/image';
import Link from 'next/link';

import { applicationAudiences } from '@/content/data/application-audiences';

import { FaqSection } from '../../components/FaqSection';
import { PageHero } from '../../components/page/PageHero';
import { SectionHead } from '../../components/page/SectionHead';
import { ArrowRight, ButtonLink, Chip, cx, stagger } from '../../components/primitives';
import cards from '../../styles/applications.module.css';
import p from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import { CaseStudyCard } from '../projects/CaseStudyCard';
import { AudienceSections } from './AudienceSections';
import { applicationPage, type ApplicationItem } from './content';
import s from './applications.module.css';

/**
 * /applications/[slug]. The application's own title, paragraph and photo open
 * the page; the sections after it are the shared, sourced material every
 * application page carries — the product highlights with the suitability
 * note, the four-step process, matching case studies, and the other five
 * applications as the homepage's lime-on-hover cards.
 *
 * Residential and Modular and prefab also carry the matching audience page
 * from the client's V3 handoff (content/data/application-audiences.ts): its
 * opening sections after the hero, its FAQ after the process. Every page
 * without an audience FAQ gets one in the same place (content.ts,
 * APPLICATION_FAQ), in the homepage FAQ design.
 */
export function ApplicationPage({ item }: { item: ApplicationItem }) {
  const c = applicationPage(item);
  const audience = applicationAudiences[item.slug];
  const faqs = [
    ...(audience
      ? [...audience.before, ...audience.after].flatMap((b) => (b.kind === 'faq' ? b.items : []))
      : []),
    ...(c.faq ? c.faq.entries.map((e) => ({ q: e.question, a: e.answer })) : []),
  ];
  const jsonLd =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }
      : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      <PageHero
        kicker={c.hero.kicker}
        title={c.hero.title}
        lead={c.hero.lead}
        image={c.hero.image}
        crumbs={c.hero.crumbs}
        actions={c.hero.actions}
      />

      {audience && <AudienceSections blocks={audience.before} />}

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

      {audience && <AudienceSections blocks={audience.after} offset={audience.before.length} />}

      {c.faq && (
        <FaqSection
          id="faq"
          titleId="app-faq-title"
          chip={c.faq.chip}
          heading={c.faq.heading}
          cta={c.faq.cta}
          tabs={[{ id: 'faq', label: c.faq.chip, entries: c.faq.entries }]}
        />
      )}

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
