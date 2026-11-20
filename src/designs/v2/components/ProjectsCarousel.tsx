'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { anchors, projectsV2 } from '../content';
import s from '../styles/projects.module.css';
import t from '../styles/theme.module.css';
import { ArrowRight, ButtonLink, Chip, cx, stagger } from './primitives';
import { useReducedMotion } from './scroll/useReducedMotion';

/** Scroll-driven sideways movement from this width up; below it, native swipe. */
const DESKTOP = '(min-width: 64rem)';

/**
 * Wide project cards on a horizontal track: image left, story right.
 *
 * Desktop: the section pins, and scrolling down moves the cards sideways,
 * one after another; the page carries on to the next section only once the
 * last card is in view. A sizer gives the pin exactly the scroll distance the
 * track needs, and the track's scrollLeft follows the page's scroll. The
 * arrow buttons scroll the page by one card, so they move the same way.
 *
 * Phones, tablets and reduced motion: a native swipe track with snap; the
 * arrows step it one card at a time. Both disable themselves at either end.
 *
 * Photographs are shown full strength here, unlike the live homepage, which
 * tints them to 12%. Some of these are visualisations rather than site photos
 * (Black Langur's alt says so) — see the note in README.md before shipping.
 */
export function ProjectsCarousel() {
  const track = useRef<HTMLUListElement>(null);
  const sizer = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [pinned, setPinned] = useState(false);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const start = el.scrollLeft < 8;
    const end = el.scrollLeft + el.clientWidth > el.scrollWidth - 8;
    setEdge((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
  }, []);

  // Pin on desktop unless the visitor prefers reduced motion.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const update = () => setPinned(mq.matches && !reduced);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [reduced]);

  // Pinned: size the sizer to the track's overflow and drive scrollLeft from
  // the page's scroll. Unpinned: just keep the arrow states current.
  useEffect(() => {
    const el = track.current;
    const box = sizer.current;
    if (!el || !box) return;
    if (!pinned) {
      box.style.removeProperty('height');
      measure();
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }

    let frame = 0;
    let distance = 0;
    let stick = 0;
    const stage = box.firstElementChild as HTMLElement;
    const layout = () => {
      el.scrollLeft = 0;
      distance = Math.max(0, el.scrollWidth - el.clientWidth);
      // Hold the stage at its natural height: centred when it fits on
      // screen, otherwise with its foot (the card) 2rem above the bottom.
      const vh = window.innerHeight;
      const h = stage.offsetHeight;
      stick = Math.min((vh - h) / 2, vh - h - 32);
      stage.style.top = `${stick}px`;
      box.style.height = `${h + distance}px`;
    };
    const update = () => {
      frame = 0;
      const top = box.getBoundingClientRect().top;
      const p = distance ? Math.min(1, Math.max(0, (stick - top) / distance)) : 0;
      el.scrollLeft = p * distance;
      measure();
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      layout();
      update();
    };

    layout();
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', onResize);
      box.style.removeProperty('height');
      stage.style.removeProperty('top');
    };
  }, [pinned, measure]);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const by = dir * (card.offsetWidth + gap);
    // Pinned, the page's scroll is what moves the track.
    if (pinned) window.scrollBy({ top: by, behavior: 'smooth' });
    else el.scrollBy({ left: by, behavior: 'smooth' });
  };

  return (
    <section
      id={anchors.projects}
      className={s.section}
      data-pinned={pinned || undefined}
      aria-labelledby="hv2-projects-title"
    >
      <div ref={sizer} className={s.sizer}>
        <div className={s.stage}>
          <div className={t.gutter}>
            <div data-reveal>
              <Chip>{projectsV2.chip}</Chip>
            </div>
            <h2
              id="hv2-projects-title"
              className={cx(t.h2, s.title)}
              data-reveal
              style={stagger(1)}
            >
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

          <ul
            ref={track}
            className={s.track}
            onScroll={pinned ? undefined : measure}
            aria-label="Projects"
          >
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
        </div>
      </div>
    </section>
  );
}
