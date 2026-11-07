import Image from 'next/image';
import Link from 'next/link';

import type { Project } from '@/content/data/projects';

import { ArrowRight, cx } from '../../components/primitives';
import t from '../../styles/theme.module.css';
import { projectItem, type ProjectListItem } from './content';
import s from './projects.module.css';

interface ProjectCardProps {
  item: ProjectListItem;
  /** `dark` on black/forest grounds, `light` on paper/white. */
  tone: 'dark' | 'light';
  /** Heading level of the project name, to fit the page outline. */
  as?: 'h2' | 'h3';
}

/**
 * One project: tag chip, name, location, then its figures (or, for a project
 * without figures, its one-line result). A project with a photo shows it under
 * a dark shade; the rest are solid tiles. A project with its own page is a
 * link that washes yellow on hover; one without is a plain card.
 */
export function ProjectCard({ item, tone, as = 'h3' }: ProjectCardProps) {
  const Heading = as;
  const className = cx(
    s.study,
    tone === 'dark' ? s.studyDark : s.studyLight,
    item.image && s.studyHasPhoto,
    !item.href && s.studyStatic,
  );

  const body = (
    <>
      {item.image && (
        <>
          <Image
            src={item.image.src}
            alt=""
            fill
            sizes="(min-width: 64rem) 33vw, (min-width: 40rem) 50vw, 100vw"
            className={s.studyPhoto}
          />
          <span className={s.studyPhotoShade} aria-hidden />
        </>
      )}
      <span className={s.studyTint} aria-hidden />
      <div className={s.studyTop}>
        <span className={cx(t.mono, s.studyTag)}>{item.tag}</span>
        {item.href && (
          <span className={s.studyArrow} aria-hidden>
            <ArrowRight size={18} />
          </span>
        )}
      </div>
      <div className={s.studyMain}>
        <Heading className={s.studyName}>{item.name}</Heading>
        {item.location && <p className={cx(t.mono, s.studyLocation)}>{item.location}</p>}
      </div>
      {item.figures.length > 0 ? (
        <dl className={s.studyFigures}>
          {item.figures.map((f) => (
            <div key={f.label}>
              <dt className={t.mono}>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        item.summary && <p className={s.studySummary}>{item.summary}</p>
      )}
    </>
  );

  return item.href ? (
    <Link href={item.href} className={className}>
      {body}
    </Link>
  ) : (
    <article className={className}>{body}</article>
  );
}

/** A project from `PROJECTS` (always has its own page). */
export function CaseStudyCard({
  project,
  ...rest
}: { project: Project } & Omit<ProjectCardProps, 'item'>) {
  return <ProjectCard item={projectItem(project)} {...rest} />;
}
