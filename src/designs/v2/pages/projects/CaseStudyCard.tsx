import Link from 'next/link';

import type { Project } from '@/content/data/projects';

import { ArrowRight, cx } from '../../components/primitives';
import t from '../../styles/theme.module.css';
import { caseStudyLabels, filled, projectHref } from './content';
import s from './projects.module.css';

interface CaseStudyCardProps {
  project: Project;
  /** `dark` on black/forest grounds, `light` on paper/white. */
  tone: 'dark' | 'light';
  /** Heading level of the project name, to fit the page outline. */
  as?: 'h2' | 'h3';
}

/**
 * A case study as one link: industry chip, name, location, then its three
 * figures. No photograph exists for these projects, so the card is a solid
 * tile — and, like the homepage's application cards, it washes lime on hover.
 */
export function CaseStudyCard({ project, tone, as = 'h3' }: CaseStudyCardProps) {
  const Heading = as;
  const location = filled(project.location);
  const figures = [
    { label: caseStudyLabels.figures.duration, value: filled(project.installDuration) },
    { label: caseStudyLabels.figures.capacity, value: filled(project.capacity) },
    { label: caseStudyLabels.figures.concrete, value: filled(project.concreteSaved) },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));

  return (
    <Link
      href={projectHref(project.slug)}
      className={cx(s.study, tone === 'dark' ? s.studyDark : s.studyLight)}
    >
      <span className={s.studyTint} aria-hidden />
      <div className={s.studyTop}>
        <span className={cx(t.mono, s.studyTag)}>{project.industry}</span>
        <span className={s.studyArrow} aria-hidden>
          <ArrowRight size={18} />
        </span>
      </div>
      <div className={s.studyMain}>
        <Heading className={s.studyName}>{project.name}</Heading>
        {location && <p className={cx(t.mono, s.studyLocation)}>{location}</p>}
      </div>
      {figures.length > 0 && (
        <dl className={s.studyFigures}>
          {figures.map((f) => (
            <div key={f.label}>
              <dt className={t.mono}>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </Link>
  );
}
