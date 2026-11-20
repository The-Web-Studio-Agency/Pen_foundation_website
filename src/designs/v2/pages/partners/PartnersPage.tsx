import Image from 'next/image';

import { footerContact } from '@/config/navigation';
import { validationLogos } from '@/content/data/homepage';
import { partnerNetwork as c, type NetworkPartner } from '@/content/data/partner-network';

import { PageHero } from '../../components/page/PageHero';
import { SectionHead } from '../../components/page/SectionHead';
import { ButtonLink, Chip, cx, stagger } from '../../components/primitives';
import p from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import { EnquiryForm } from '../contact/EnquiryForm';
import s from './partners.module.css';

/** A source value still reading "[PHONE]" and the like. */
const isPlaceholder = (value: string) => /^\s*\[.*\]\s*$/.test(value);

type Photo = { src: string; alt: string; contain?: boolean };

/*
 * STAND-IN photographs from PEN's existing imagery, chosen to match each
 * block. Replace with the partners' own photos as they are supplied.
 */
const PHOTOS = {
  provider: {
    src: '/media/images/homepage/Benglaru-Farmhouse.png',
    alt: 'A farmhouse in the Bengaluru region built on PEN foundations',
  },
  reseller: {
    src: '/media/images/pen.png',
    alt: 'A PEN node with its four nail pipes, bolts and carbide tips',
    contain: true,
  },
  installers: {
    src: '/media/projects/black-langur/inst_3.jpg',
    alt: 'An installation crew working together to drive a PEN nail',
  },
  steps: [
    {
      src: '/media/projects/black-langur/plan_family.jpg',
      alt: 'A foundation layout drawing with PEN points marked',
    },
    {
      src: '/media/projects/black-langur/inst_2.jpg',
      alt: 'Installers learning to drive a nail pipe through a PEN node',
    },
    {
      src: '/media/projects/devagiri/install-crop.jpg',
      alt: 'A PEN node installed into a cut in an existing floor',
    },
    {
      src: '/media/images/homepage/capability-02-poster.webp',
      alt: 'A completed PEN node set in prepared ground',
    },
  ],
  why: [
    {
      src: '/media/images/pen.png',
      alt: 'A PEN node with its four nail pipes, bolts and carbide tips',
      contain: true,
    },
    {
      src: '/media/projects/devagiri/plan_install.jpg',
      alt: 'Photos of a PEN installation in progress on site',
    },
    {
      src: '/media/projects/black-langur/plan_node.jpg',
      alt: 'An engineering section drawing of a PEN node and its nails',
      contain: true,
    },
  ],
} satisfies Record<string, Photo | Photo[]>;

/** Figures quoted elsewhere on the site, unchanged, as trust signals. */
const FACTS = [
  { value: '2.0–2.6×', label: 'Enhancement Factor of soil bearing capacity' },
  { value: 'IS 2911', label: 'Part 4, the code the design follows' },
  { value: 'GRIHA', label: 'Listed in the GRIHA Product Catalogue' },
];

/** Options for the partner enquiry form (UI labels, not claims). */
const PARTNER_TOPICS = [
  'Become a solution provider',
  'Become a reseller',
  'Apply as a certified installer',
  'Find an authorised partner near me',
  'Something else',
];

function Photo({ photo, className, sizes }: { photo: Photo; className?: string; sizes: string }) {
  return (
    <div className={cx(s.photo, photo.contain && s.photoContain, className)}>
      <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className={s.photoImg} />
    </div>
  );
}

function PartnerCard({
  partner,
  photo,
  accent,
}: {
  partner: NetworkPartner;
  photo: Photo;
  accent?: boolean;
}) {
  const rows = partner.rows.filter((row) => !isPlaceholder(row.value));
  return (
    <article className={cx(s.card, accent && s.cardAlt)} data-reveal>
      <Photo photo={photo} className={s.cardPhoto} sizes="(min-width: 64rem) 45vw, 100vw" />
      <div className={s.cardBody}>
        <div className={s.cardTop}>
          <p className={cx(t.mono, s.role)}>{partner.role}</p>
          <span className={cx(t.mono, s.verified)}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="m2.5 6.2 2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            Authorised
          </span>
        </div>
        <h3 className={cx(t.h3, s.name)}>{partner.name}</h3>
        {rows.length > 0 ? (
          <dl className={s.rows}>
            {rows.map((row) => (
              <div key={row.label}>
                <dt className={t.mono}>{row.label}</dt>
                <dd>
                  {row.kind === 'phone' ? (
                    <a href={`tel:${row.value.replace(/\s+/g, '')}`}>{row.value}</a>
                  ) : row.kind === 'email' ? (
                    <a href={`mailto:${row.value}`}>{row.value}</a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className={s.pending}>Contact details coming soon. Reach them through PEN below.</p>
        )}
      </div>
    </article>
  );
}

/**
 * /partners — who is authorised to supply and install PEN.
 *
 *   dark   hero
 *   white  trust band: three figures and the validating institutions
 *   paper  solution provider and resellers, as photo cards
 *   black  certified installers: the coming cohort and the four steps
 *   white  why use an authorised partner
 *   paper  become a partner: the enquiry form
 *
 * Copy from content/data/partner-network.ts; unfilled placeholder rows are
 * left off the cards.
 */
export function PartnersPage() {
  return (
    <>
      <PageHero
        kicker={c.hero.kicker}
        title={c.hero.title}
        lead={c.hero.lead}
        actions={[
          { label: 'Find a partner', href: '#network' },
          { label: c.join.cta.label, href: '#join', tone: 'ghost' },
        ]}
        // STAND-IN photo from PEN's existing imagery; replace with this page's own.
        image={{
          src: '/media/projects/black-langur/inst_1.jpg',
          alt: 'Installers driving a nail pipe through a PEN node',
        }}
      />

      {/* ---- trust band --------------------------------------------------- */}
      <section className={cx(p.light, s.trustBand)} aria-label="Why PEN is trusted">
        <div className={cx(t.gutter, s.trustGrid)}>
          <ul className={s.facts}>
            {FACTS.map((fact, i) => (
              <li key={fact.value} className={s.fact} data-reveal style={stagger(i)}>
                <span className={s.factValue}>{fact.value}</span>
                <span className={s.factLabel}>{fact.label}</span>
              </li>
            ))}
          </ul>
          <div className={s.validators} data-reveal style={stagger(3)}>
            <p className={cx(t.mono, s.validatorsLabel)}>{c.hero.trust[0]}</p>
            <ul className={s.logoRow}>
              {validationLogos.map((logo) => (
                <li key={logo.src}>
                  <Image src={logo.src} alt={logo.alt} width={160} height={80} className={s.logo} />
                </li>
              ))}
            </ul>
            <ul className={s.ticks}>
              {c.hero.trust.slice(1).map((item) => (
                <li key={item} className={t.mono}>
                  <span className={s.tick} aria-hidden>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="m2.5 6.2 2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---- the network --------------------------------------------------- */}
      <section id="network" className={cx(p.section, p.paper)} aria-label="Authorised partners">
        <div className={t.gutter}>
          <div className={s.pair}>
            <div className={s.group}>
              <SectionHead
                chip={c.providers.chip}
                heading={c.providers.heading}
                lead={c.providers.lead}
                id="partners-providers"
              />
              {c.providers.items.map((partner) => (
                <PartnerCard key={partner.name} partner={partner} photo={PHOTOS.provider} />
              ))}
            </div>
            <div className={s.group}>
              <SectionHead
                chip={c.resellers.chip}
                heading={c.resellers.heading}
                lead={c.resellers.lead}
                id="partners-resellers"
              />
              {c.resellers.items.map((partner) => (
                <PartnerCard key={partner.name} partner={partner} photo={PHOTOS.reseller} accent />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- installers ------------------------------------------------------ */}
      <section className={cx(p.section, p.black)} aria-labelledby="partners-installers">
        <div className={t.gutter}>
          <SectionHead
            chip={c.installers.chip}
            heading={c.installers.heading}
            lead={c.installers.lead}
            split
            id="partners-installers"
          />
          <div className={s.soon} data-reveal>
            <Photo
              photo={PHOTOS.installers}
              className={s.soonPhoto}
              sizes="(min-width: 64rem) 45vw, 100vw"
            />
            <div className={s.soonCopy}>
              <Chip>Now onboarding</Chip>
              <h3 className={t.h3}>{c.installers.soon.heading}</h3>
              <p>{c.installers.soon.body}</p>
              <ButtonLink href="#join" tone="solid">
                {c.installers.soon.cta.label}
              </ButtonLink>
            </div>
          </div>
          <ol className={s.steps}>
            {c.installers.steps.map((step, i) => (
              <li key={step.title} data-reveal style={stagger(i)}>
                <Photo
                  photo={PHOTOS.steps[i]}
                  className={s.stepPhoto}
                  sizes="(min-width: 64rem) 22vw, 50vw"
                />
                <div className={s.stepBody}>
                  <span className={cx(t.mono, s.stepNum)}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className={s.stepTitle}>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- why ------------------------------------------------------------- */}
      <section className={cx(p.section, p.light)} aria-labelledby="partners-why">
        <div className={t.gutter}>
          <SectionHead chip={c.why.chip} heading={c.why.heading} id="partners-why" />
          <ul className={s.why}>
            {c.why.items.map((item, i) => (
              <li key={item.title} data-reveal style={stagger(i)}>
                <Photo
                  photo={PHOTOS.why[i]}
                  className={s.whyPhoto}
                  sizes="(min-width: 64rem) 30vw, 100vw"
                />
                <div className={s.whyBody}>
                  <h3 className={s.whyTitle}>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- join: the enquiry form ----------------------------------------- */}
      <section
        id="join"
        className={cx(p.section, p.paper, s.joinSection)}
        aria-labelledby="partners-join"
      >
        <div className={cx(t.gutter, s.joinGrid)}>
          <div className={s.joinCopy} data-reveal>
            <Chip>Partner with PEN</Chip>
            <h2 id="partners-join" className={t.h2}>
              {c.join.heading}
            </h2>
            <p className={cx(t.lead, s.joinLead)}>{c.join.body}</p>
            <ul className={s.joinList}>
              {c.installers.steps.map((step, i) => (
                <li key={step.title}>
                  <span className={cx(t.mono, s.joinNum)}>{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <b>{step.title}.</b> {step.body}
                  </span>
                </li>
              ))}
            </ul>
            <p className={cx(t.mono, s.joinCall)}>
              Prefer to talk?{' '}
              <a href={`tel:${footerContact.phone.replace(/\s+/g, '')}`}>{footerContact.phone}</a>
            </p>
          </div>
          <div className={s.joinForm} data-reveal style={stagger(1)}>
            <EnquiryForm topics={PARTNER_TOPICS} subject="partner enquiry" />
          </div>
        </div>
      </section>
    </>
  );
}
