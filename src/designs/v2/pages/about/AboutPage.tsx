import Image from 'next/image';

import { leadershipTeam } from '@/content/data/people';
import { partners } from '@/content/data/partners';
import { values } from '@/content/data/values';
import {
  hero,
  investorsIntro,
  leadersIntro,
  numberedFeatures,
  storyValues,
} from '@/features/about';

import { PageHero } from '../../components/page/PageHero';
import { SectionHead } from '../../components/page/SectionHead';
import { cx, stagger } from '../../components/primitives';
import p from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import s from './about.module.css';

/**
 * /about, top to bottom:
 *
 *   dark    hero — the About headline and the first half of its intro
 *   white   where it began — the rest of the intro, then the three numbered
 *           chapters (question → nature → proof) as alternating photo rows
 *   black   the story behind PEN — "Our story" / "Our values"
 *   paper   our value — three cards with their sourced proof figures
 *   white   the people behind PEN — founding team
 *   paper   research & industry ecosystem — supporter logos
 *
 * Every word comes from features/about/content.ts and content/data/*; this
 * file adds only section labels.
 */

/** Split a paragraph into sentences — same words, same order. */
function sentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+/g)?.map((x) => x.trim()) ?? [text];
}

const intro = sentences(hero.body);
/** "For decades… / Yet the foundation…" opens the page in the hero. */
const heroLead = intro.slice(0, 2).join(' ');
/** "PEN Foundation began with a simple belief…" heads the story chapter. */
const beliefHeading = intro[2];
const beliefLead = intro.slice(3).join(' ');

const anchors = { story: 'story', team: 'team' } as const;

export function AboutPage() {
  return (
    <>
      <PageHero
        kicker={hero.eyebrow}
        title={hero.heading}
        lead={heroLead}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
        actions={[
          { label: 'Our story', href: `#${anchors.story}` },
          { label: 'Meet the team', href: `#${anchors.team}`, tone: 'ghost' },
        ]}
        image={{
          src: '/media/images/homepage/excavation-image.png',
          alt: 'An excavator digging a deep pit for a conventional reinforced-concrete foundation',
        }}
      />

      <Beginnings />
      <StoryAndValues />
      <OurValue />
      <Team />
      <Supporters />
    </>
  );
}

/* ---- where it began ----------------------------------------------------- */

function Beginnings() {
  return (
    <section
      id={anchors.story}
      className={cx(p.section, p.light, s.anchor)}
      aria-labelledby="about-belief-title"
    >
      <div className={t.gutter}>
        <SectionHead
          id="about-belief-title"
          chip="Where it began"
          heading={beliefHeading}
          lead={beliefLead}
          split
          className={cx(s.wideHead, s.beliefHead)}
        />

        <ol className={s.chapters}>
          {numberedFeatures.map((feature) => (
            <li
              key={feature.number}
              className={cx(s.chapter, feature.imageSide === 'left' && s.chapterFlip)}
            >
              <div className={s.chapterText} data-reveal>
                <span className={cx(t.mono, s.chapterNum)}>[ {feature.number} ]</span>
                <h3 className={cx(t.h3, s.chapterTitle)}>{feature.title}</h3>
                <p className={cx(t.body, s.chapterBody)}>{feature.body}</p>
              </div>
              {feature.image && (
                <div className={s.chapterMedia} data-reveal style={stagger(1)}>
                  <Image
                    src={feature.image}
                    alt={feature.imageAlt ?? ''}
                    fill
                    sizes="(min-width: 64rem) 50vw, 100vw"
                    className={s.chapterImg}
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---- the story behind PEN ----------------------------------------------- */

function StoryAndValues() {
  const columns = [
    { label: 'Our story', text: storyValues.story },
    { label: 'Our values', text: storyValues.values },
  ];

  return (
    <section className={cx(p.section, p.black, s.story)} aria-labelledby="about-story-title">
      <div className={cx(t.gutter, s.storyInner)}>
        <div className={s.storyGlow} aria-hidden />
        <SectionHead id="about-story-title" chip="Story & values" heading={storyValues.heading} />
        <div className={s.storyCols}>
          {columns.map((col, i) => (
            <div key={col.label} className={s.storyCol} data-reveal style={stagger(i)}>
              <p className={cx(t.mono, s.storyLabel)}>[ {col.label} ]</p>
              <p className={cx(t.lead, s.storyText)}>{col.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- our value ---------------------------------------------------------- */

function OurValue() {
  return (
    <section className={cx(p.section, p.paper)} aria-labelledby="about-value-title">
      <div className={t.gutter}>
        <SectionHead
          id="about-value-title"
          chip={values.eyebrow}
          heading={values.heading}
          lead={values.intro}
          split
          className={s.wideHead}
        />

        <ul className={s.valueGrid}>
          {values.cards.map((card, i) => (
            <li key={card.id} className={s.valueCard} data-reveal style={stagger(i)}>
              <span className={cx(t.mono, s.valueNum)}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={s.valueTitle}>{card.title}</h3>
              <p className={cx(t.body, s.valueBody)}>{card.body}</p>
              <dl className={s.proof}>
                {card.proofPoints.map((point) => (
                  <div key={point.label} className={s.proofItem}>
                    <dt className={cx(t.mono, s.proofLabel)}>{point.label}</dt>
                    <dd className={s.proofValue}>{point.value}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---- the people behind PEN ---------------------------------------------- */

function Team() {
  return (
    <section
      id={anchors.team}
      className={cx(p.section, p.light, s.anchor)}
      aria-labelledby="about-team-title"
    >
      <div className={t.gutter}>
        <SectionHead
          id="about-team-title"
          chip={leadersIntro.eyebrow}
          heading={leadersIntro.heading}
          lead={leadersIntro.intro}
          split
          className={s.wideHead}
        />

        <ul className={s.team}>
          {leadershipTeam.map((person, i) => (
            <li key={person.name} className={s.person} data-reveal style={stagger(i)}>
              <div className={s.personPhoto}>
                {person.photo ? (
                  <Image
                    src={person.photo}
                    alt={`Portrait of ${person.name}`}
                    fill
                    sizes="(min-width: 56rem) 30vw, (min-width: 36rem) 50vw, 100vw"
                    className={s.personImg}
                  />
                ) : (
                  <span className={s.personInitials} aria-hidden>
                    {person.initials}
                  </span>
                )}
              </div>
              <div className={s.personText}>
                <p className={cx(t.mono, s.personRole)}>{person.title}</p>
                <h3 className={s.personName}>{person.name}</h3>
                {person.bio && <p className={cx(t.body, s.personBio)}>{person.bio}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---- research & industry ecosystem -------------------------------------- */

function Supporters() {
  return (
    <section
      className={cx(p.section, p.paper, s.supporters)}
      aria-labelledby="about-partners-title"
    >
      <div className={t.gutter}>
        <SectionHead
          id="about-partners-title"
          chip={investorsIntro.eyebrow}
          heading={investorsIntro.heading}
          lead={investorsIntro.intro}
          split
          className={s.wideHead}
        />

        <ul className={s.logos}>
          {partners.map((partner, i) => (
            <li
              key={partner.name}
              className={cx(s.logo, partner.onDark && s.logoDark)}
              data-reveal
              style={stagger(i % 4)}
              title={partner.fullName}
            >
              {partner.logo ? (
                <Image
                  src={partner.logo}
                  alt={partner.fullName ?? partner.name}
                  width={200}
                  height={100}
                  sizes="12rem"
                  className={s.logoImg}
                />
              ) : (
                <span className={s.logoName}>{partner.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
