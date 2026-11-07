'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { anchors, projectsV2 } from '../content';
import s from '../styles/projects.module.css';
import t from '../styles/theme.module.css';
import { ArrowRight, ButtonLink, Chip, cx, stagger } from './primitives';

/**
 * Wide project cards on a horizontal track: image left, story right. Native
 * scroll with snap, so touch and trackpad swipes just work; the arrow buttons
 * step one card at a time and disable themselves at either end.
 *
 * Photographs are shown full strength here, unlike the live homepage, which
 * tints them to 12%. Some of these are visualisations rather than site photos
 * (Black Langur's alt says so) — see the note in README.md before shipping.
 */
export function ProjectsCarousel() {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft < 8,
      end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' });
  };

  return (
    <section id={anchors.projects} className={s.section} aria-labelledby="hv2-projects-title">
      <div className={t.gutter}>
        <div data-reveal>
          <Chip>{projectsV2.chip}</Chip>
        </div>
        <h2 id="hv2-projects-title" className={cx(t.h2, s.title)} data-reveal style={stagger(1)}>
          {projectsV2.heading}
        </h2>

        <div className={s.controls}>
          <ButtonLink href={projectsV2.cta.href} tone="onLight">
            {projectsV2.cta.label}
          </ButtonLink>
          <div className={s.arrows}>
            <button
              type="button"
              className={cx(s.arrow, s.arrowPrev)}
              onClick={() => step(-1)}
              disabled={edge.start}
              aria-label="Previous project"
            >
              <ArrowRight />
            </button>
            <button
              type="button"
              className={s.arrow}
              onClick={() => step(1)}
              disabled={edge.end}
              aria-label="Next project"
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>

      <ul ref={track} className={s.track} onScroll={measure} aria-label="Projects">
        {projectsV2.projects.map((project) => (
          <li key={project.name} className={s.card}>
            <div className={s.media}>
              {project.image ? (
                <Image
                  src={project.image.src}
                  alt={project.image.alt}
                  fill
                  sizes="(min-width: 64rem) 40vw, 85vw"
                  className={s.mediaImg}
                />
              ) : null}
            </div>
            <div className={s.body}>
              <Chip>{project.application}</Chip>
              <h3 className={cx(t.h3, s.name)}>{project.name}</h3>
              <p className={cx(t.mono, s.location)}>{project.location}</p>
              <p className={s.copy}>{project.challenge}</p>
              <div className={s.foot}>
                <p className={s.result}>{project.result}</p>
                <Link
                  href={projectsV2.cta.href}
                  className={s.round}
                  aria-label={`All projects, including ${project.name}`}
                >
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
