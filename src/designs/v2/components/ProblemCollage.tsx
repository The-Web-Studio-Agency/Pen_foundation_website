import Image from 'next/image';

import { problemV2 } from '../content';
import s from '../styles/problem.module.css';
import t from '../styles/theme.module.css';
import { CollageSpread } from './CollageSpread';
import { Chip, cx } from './primitives';

/**
 * Centred problem statement inside a scattered collage of photographs and
 * fact cards. On desktop the section pins for a screen or so: the
 * tiles arrive gathered in a cluster at the centre, fly out to these places
 * as the visitor scrolls, and the statement fades in as they clear
 * (CollageSpread).
 * Below 1024px the collage becomes a tidy grid under the text and nothing
 * moves.
 */
export function ProblemCollage() {
  const { tiles, facts, stat } = problemV2;

  return (
    <section id="hv2-problem" className={s.section} aria-labelledby="hv2-problem-title">
      <CollageSpread sectionId="hv2-problem" />
      {/* Desktop: a sizer taller than the screen with a sticky one-screen
          stage, so the gather → spread plays out while the section holds. */}
      <div className={s.sizer} data-collage-sizer>
        <div className={s.stage}>
          <div className={cx(s.center, t.gutter)}>
            <div data-reveal>
              <Chip>{problemV2.chip}</Chip>
            </div>
            <h2 id="hv2-problem-title" className={cx(t.h2, s.title)} data-reveal>
              {problemV2.heading}
            </h2>
            <p className={cx(t.lead, s.sub)} data-reveal>
              {problemV2.sub}
            </p>
          </div>

          <div className={s.collage}>
            <figure className={cx(s.tile, s.tExcavation)} data-tile>
              <Image
                src={tiles.excavation.src}
                alt={tiles.excavation.alt}
                fill
                sizes="(min-width: 64rem) 18vw, 50vw"
                className={s.img}
              />
              <figcaption className={cx(t.mono, s.tileCaption)}>
                {problemV2.conventionalLabel}
              </figcaption>
            </figure>

            <div className={cx(s.tile, s.tStat)} data-tile>
              <p className={cx(t.mono, s.statLabel)}>{stat.label}</p>
              <p className={s.statValue}>{stat.value}</p>
            </div>

            <figure className={cx(s.tile, s.tAerial)} data-tile>
              <Image
                src={tiles.aerial.src}
                alt={tiles.aerial.alt}
                fill
                sizes="(min-width: 64rem) 16vw, 50vw"
                className={s.img}
              />
            </figure>

            <div className={cx(s.tile, s.tContours)} data-tile aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element -- static SVG line art; next/image adds nothing */}
              <img src={tiles.contours.src} alt="" className={s.contours} />
            </div>

            <div className={cx(s.tile, s.tFact)} data-tile>
              <p className={cx(t.mono, s.factLabel)}>PEN Foundation</p>
              <p className={s.factValue}>{facts[0]}</p>
            </div>

            <figure className={cx(s.tile, s.tRender)} data-tile>
              <Image
                src={tiles.render.src}
                alt={tiles.render.alt}
                fill
                sizes="(min-width: 64rem) 16vw, 50vw"
                className={cx(s.img, s.imgContain)}
              />
            </figure>

            <figure className={cx(s.tile, s.tRising)} data-tile>
              <Image
                src={tiles.rising.src}
                alt={tiles.rising.alt}
                fill
                sizes="(min-width: 64rem) 16vw, 50vw"
                className={s.img}
              />
            </figure>

            <div className={cx(s.tile, s.tFact2)} data-tile>
              <p className={cx(t.mono, s.factLabel)}>PEN Foundation</p>
              <p className={s.factValue}>{facts[1]}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
