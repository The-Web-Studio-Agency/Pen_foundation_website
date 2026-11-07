import Link from 'next/link';

import { PageHero } from '../../components/page/PageHero';
import { SectionHead } from '../../components/page/SectionHead';
import { ArrowRight, cx, stagger } from '../../components/primitives';
import p from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import { ProjectCard } from './CaseStudyCard';
import { projectsIndex as c } from './content';
import s from './projects.module.css';

/**
 * /projects — every project in one grid (projects and case studies are the
 * same thing; see `projectsIndex.list`), then the applications they belong to.
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

      <section id="all-projects" className={cx(p.section, p.light)} aria-labelledby="projects-list">
        <div className={t.gutter}>
          <SectionHead chip={c.list.chip} heading={c.list.heading} id="projects-list" />
          <ul className={s.studies}>
            {c.list.items.map((item, i) => (
              <li key={item.key} data-reveal style={stagger(i % 3)}>
                <ProjectCard item={item} tone="light" />
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
