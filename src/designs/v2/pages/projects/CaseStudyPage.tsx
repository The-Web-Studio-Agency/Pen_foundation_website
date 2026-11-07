import Link from 'next/link';

import { PROJECTS, type Project } from '@/content/data/projects';

import { PageHero, type PageHeroFact } from '../../components/page/PageHero';
import { ArrowRight, ButtonLink, Chip, cx, stagger } from '../../components/primitives';
import p from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import { CaseStudyCard } from './CaseStudyCard';
import { ASSESSMENT, applicationForProject, caseStudyLabels as L, filled } from './content';
import s from './projects.module.css';

/**
 * /projects/[slug] — one case study. Every field comes from `PROJECTS`; a
 * field that is still a bracketed placeholder is left out rather than shown.
 */
export function CaseStudyPage({ project }: { project: Project }) {
  const location = filled(project.location);
  const year = filled(project.year);
  const lessons = filled(project.lessons);
  const application = applicationForProject(project);
  const related = PROJECTS.filter((other) => other.slug !== project.slug).slice(0, 3);

  const facts: PageHeroFact[] = [
    { label: L.facts.industry, value: project.industry },
    { label: L.facts.location, value: location },
    { label: L.facts.foundation, value: filled(project.foundationType) },
    { label: L.facts.soil, value: filled(project.soilType) },
    { label: L.facts.year, value: year },
  ].filter((f): f is PageHeroFact => Boolean(f.value));

  const steps = [
    {
      title: L.siteConditions,
      body: filled(project.siteConditions),
      meta: filled(project.soilType),
    },
    { title: L.approach, body: filled(project.approach), meta: filled(project.foundationType) },
    {
      title: L.installation,
      body: filled(project.installDuration) && L.installed(project.installDuration),
      meta: undefined,
    },
  ].filter((step) => Boolean(step.body));

  const figures = [
    // "1 day, 6 units" → "1 day": the figure leads, its detail is the step above.
    { label: L.figures.duration, value: filled(project.installDuration)?.split(',')[0] },
    { label: L.figures.capacity, value: filled(project.capacity) },
    { label: L.figures.concrete, value: filled(project.concreteSaved) },
    { label: L.figures.excavated.label, value: L.figures.excavated.value },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));

  return (
    <>
      <PageHero
        kicker={project.industry}
        title={project.name}
        crumbs={[
          { label: L.crumbs.home, href: '/' },
          { label: L.crumbs.projects, href: '/projects' },
          { label: project.name },
        ]}
        actions={[ASSESSMENT]}
        facts={facts}
      />

      <section className={cx(p.section, p.light)} aria-labelledby="study-challenge">
        <div className={t.gutter}>
          <div className={s.challenge}>
            <h2 id="study-challenge" className={s.chipHeading} data-reveal>
              <Chip>{L.challenge}</Chip>
            </h2>
            <p className={cx(t.h3, s.challengeText)} data-reveal style={stagger(1)}>
              {project.challenge}
            </p>
          </div>

          <ol className={s.steps}>
            {steps.map((step, i) => (
              <li key={step.title} className={s.step} data-reveal style={stagger(i)}>
                <span className={s.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={s.stepTitle}>{step.title}</h3>
                <p className={s.stepBody}>{step.body}</p>
                {step.meta && <p className={cx(t.mono, s.stepMeta)}>{step.meta}</p>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={cx(p.section, p.black)} aria-labelledby="study-performance">
        <div className={t.gutter}>
          <h2 id="study-performance" className={s.chipHeading} data-reveal>
            <Chip>{L.performance}</Chip>
          </h2>
          <dl className={s.figures}>
            {figures.map((f, i) => (
              <div key={f.label} className={s.figure} data-reveal style={stagger(i)}>
                <dd>{f.value}</dd>
                <dt className={t.mono}>{f.label}</dt>
              </div>
            ))}
          </dl>
          {lessons && (
            <div className={s.lessons} data-reveal>
              <h3 className={t.mono}>{L.lessons}</h3>
              <p className={t.lead}>{lessons}</p>
            </div>
          )}
        </div>
      </section>

      <section className={cx(p.section, p.paper)} aria-labelledby="study-downloads">
        <div className={cx(t.gutter, s.docsGrid)}>
          <div>
            <h2 id="study-downloads" className={s.chipHeading} data-reveal>
              <Chip>{L.downloads}</Chip>
            </h2>
            <ul className={s.rows}>
              {L.documents.map((doc, i) => (
                <li key={doc} data-reveal style={stagger(i)}>
                  <Link href={ASSESSMENT.href} className={s.row} aria-label={`${L.request} ${doc}`}>
                    <span>{doc}</span>
                    <span className={cx(t.mono, s.rowAction)}>
                      {L.request}
                      <ArrowRight size={14} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {application && (
            <div>
              <h2 className={s.chipHeading} data-reveal>
                <Chip>{L.application}</Chip>
              </h2>
              <ul className={s.rows}>
                <li data-reveal>
                  <Link href={application.href} className={s.row}>
                    <span>{application.title}</span>
                    <span className={s.rowArrow} aria-hidden>
                      <ArrowRight size={16} />
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className={cx(p.section, p.light)} aria-labelledby="study-related">
          <div className={t.gutter}>
            <div className={s.relatedHead}>
              <h2 id="study-related" className={s.chipHeading} data-reveal>
                <Chip>{L.related}</Chip>
              </h2>
              <div data-reveal>
                <ButtonLink href="/projects" tone="onLight">
                  {L.allProjects}
                </ButtonLink>
              </div>
            </div>
            <ul className={cx(s.studies, s.pair)}>
              {related.map((other, i) => (
                <li key={other.slug} data-reveal style={stagger(i)}>
                  <CaseStudyCard project={other} tone="light" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
