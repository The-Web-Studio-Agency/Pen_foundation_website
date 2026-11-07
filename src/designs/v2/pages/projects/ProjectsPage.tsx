import Image from 'next/image';
import Link from 'next/link';

import { PageHero } from '../../components/page/PageHero';
import { SectionHead } from '../../components/page/SectionHead';
import { ArrowRight, Chip, cx, stagger } from '../../components/primitives';
import p from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import { CaseStudyCard } from './CaseStudyCard';
import { projectsIndex as c } from './content';
import s from './projects.module.css';

/** Some project images are renders; their alt text says so, and so does the card. */
const isVisualisation = (alt: string) => /^visualisation\b/i.test(alt);

/**
 * /projects — the named deployments first (the homepage's proof projects, with
 * their photographs), then the case studies that have pages of their own, then
 * the applications they belong to.
 */
export function ProjectsPage() {
  return (
    <>
      <PageHero
        kicker={c.hero.kicker}
        title={c.hero.title}
        image={c.hero.image}
        actions={c.hero.actions}
      />

      <section className={cx(p.section, p.light)} aria-labelledby="projects-deployments">
        <div className={t.gutter}>
          <SectionHead
            chip={c.deployments.chip}
            heading={c.deployments.heading}
            id="projects-deployments"
          />
          <ul className={s.deployments}>
            {c.deployments.items.map((project, i) => (
              <li key={project.name} className={s.deployment} data-reveal style={stagger(i % 2)}>
                {project.image && (
                  <div className={s.deploymentMedia}>
                    <Image
                      src={project.image.src}
                      alt={project.image.alt}
                      fill
                      sizes="(min-width: 64rem) 46vw, 100vw"
                      className={s.deploymentImg}
                    />
                    {isVisualisation(project.image.alt) && (
                      <span className={cx(t.mono, s.mediaNote)}>{c.deployments.visualisation}</span>
                    )}
                  </div>
                )}
                <div className={s.deploymentBody}>
                  <Chip className={s.wrapChip}>{project.application}</Chip>
                  <h3 className={cx(t.h3, s.deploymentName)}>{project.name}</h3>
                  <p className={cx(t.mono, s.deploymentLocation)}>{project.location}</p>
                  <p className={s.deploymentCopy}>{project.challenge}</p>
                  <div className={s.deploymentResult}>
                    <p className={t.mono}>{c.deployments.resultLabel}</p>
                    <p>{project.result}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="case-studies"
        className={cx(p.section, p.black)}
        aria-labelledby="projects-case-studies"
      >
        <div className={t.gutter}>
          <SectionHead
            chip={c.caseStudies.chip}
            heading={c.caseStudies.heading}
            id="projects-case-studies"
          />
          <ul className={s.studies}>
            {c.caseStudies.items.map((project, i) => (
              <li key={project.slug} data-reveal style={stagger(i % 3)}>
                <CaseStudyCard project={project} tone="dark" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={cx(p.section, p.paper)} aria-labelledby="projects-applications">
        <div className={t.gutter}>
          <SectionHead
            chip={c.applications.chip}
            heading={c.applications.heading}
            lead={c.applications.lead}
            split
            id="projects-applications"
          />
          <ul className={s.appList}>
            {c.applications.items.map((item, i) => (
              <li key={item.href} data-reveal style={stagger(i % 3)}>
                <Link href={item.href} className={s.appLink}>
                  <span>{item.title}</span>
                  <span className={s.appArrow} aria-hidden>
                    <ArrowRight size={18} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className={cx(t.mono, s.note)} data-reveal>
            {c.applications.note}
          </p>
        </div>
      </section>
    </>
  );
}
