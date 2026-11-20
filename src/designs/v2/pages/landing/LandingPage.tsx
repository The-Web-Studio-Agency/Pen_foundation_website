import Image from 'next/image';

import { applicationImages } from '@/config/navigation';
import { validationLogos } from '@/content/data/homepage';
import { landing as c, LANDING_PHONE, type LandingEnquiry } from '@/content/data/landing';

import { assets } from '../../assets';
import { FaqSection } from '../../components/FaqSection';
import { ChevronRight, Chip, cx, stagger } from '../../components/primitives';
import { RevealController } from '../../components/RevealController';
import { geistSans } from '../../fonts';
import t from '../../styles/theme.module.css';
import { anatomyT } from '../technology/content';
import { CallLink, PhoneIcon, StickyBar } from './LandingActions';
import s from './landing.module.css';
import { LandingClosing } from './LandingClosing';
import { LandingModel } from './LandingModel';
import { LandingNav } from './LandingNav';
import { LeadForm } from './LeadForm';

const pad = (n: number) => String(n).padStart(2, '0');

/** Line icons for the six benefits. */
function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    shovel: 'M4 20l7-7M14 3l7 7-4 4-7-7 4-4ZM9 15l-2 2',
    drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11ZM4 4l16 16',
    leaf: 'M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l7-7',
    cube: 'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3ZM12 12l8-4.5M12 12v9M12 12L4 7.5',
    ruler: 'M3 17 17 3l4 4L7 21l-4-4ZM7 13l2 2M10 10l2 2M13 7l2 2',
  };
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={paths[name]}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Tick() {
  return (
    <span className={s.tick} aria-hidden>
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="m2.5 6.2 2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    </span>
  );
}

function CtaButton({ label, tone = 'solid' }: { label: string; tone?: 'solid' | 'onDark' }) {
  return (
    <a href="#enquiry" className={cx(t.btn, t[tone])}>
      <span>{label}</span>
      <span className={t.btnIcon}>
        <ChevronRight />
      </span>
    </a>
  );
}

function Enquiry({ copy, id, formId }: { copy: LandingEnquiry; id?: string; formId: string }) {
  return (
    <section id={id} className={cx(s.section, s.paper, s.enquiry)} data-enquiry>
      <div className={cx(t.gutter, s.enquiryGrid)}>
        <div className={s.enquiryCopy} data-reveal>
          <Chip>{copy.chip}</Chip>
          <h2 className={t.h2}>{copy.heading}</h2>
          {copy.body.map((line) => (
            <p key={line} className={s.lead}>
              {line}
            </p>
          ))}
          <ul className={s.tickList}>
            {c.hero.trust.map((item) => (
              <li key={item}>
                <Tick />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal style={stagger(1)}>
          <LeadForm
            formId={formId}
            title={copy.formTitle}
            submit={copy.submit}
            callPrompt={copy.callPrompt}
            note={copy.note}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * /landing-page — the paid-traffic page. Copy from content/data/landing.ts
 * (the client's PDF), in its order. Built for one action: a project
 * enquiry. Its navbar and footer take the site's design but link only
 * within this page; nothing here leads to another page. The phone and the
 * "Request a Project Assessment" call are also in a sticky bar on phones.
 * Not linked from the site and not indexed (see app/landing-page/page.tsx).
 */
const ROOT_ID = 'lp';
const JS_FLAG = `document.getElementById('${ROOT_ID}').setAttribute('data-js','')`;

export function LandingPage() {
  return (
    <div id={ROOT_ID} className={cx(t.root, geistSans.variable, s.page)} suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      <LandingNav />
      <main>
        {/* ---- 1 · hero ------------------------------------------------- */}
        <section className={s.hero} aria-labelledby="lp-title">
          <div className={cx(t.gutter, s.heroGrid)}>
            <div className={s.heroCopy}>
              <p className={s.kicker}>
                <span className={s.kickerRule} aria-hidden />
                {c.hero.kicker}
              </p>
              <h1 id="lp-title" className={cx(t.display, s.heroTitle)}>
                {c.hero.title}
              </h1>
              <p className={s.heroSub}>{c.hero.sub}</p>
              <p className={s.heroBody}>
                {c.hero.body.split(c.hero.emphasis)[0]}
                <strong>{c.hero.emphasis}</strong>
                {c.hero.body.split(c.hero.emphasis)[1]}
              </p>
              <p className={s.heroPoints}>{c.hero.points}</p>
              <div className={s.heroActions}>
                <CtaButton label={c.hero.cta} />
                <CallLink location="hero" className={s.heroCall}>
                  <PhoneIcon />
                  <span>
                    {c.hero.call}: <b>{LANDING_PHONE.display}</b>
                  </span>
                </CallLink>
              </div>
              <ul className={s.heroTrust}>
                {c.hero.trust.map((item) => (
                  <li key={item}>
                    <Tick />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <figure className={s.heroMedia}>
              <Image
                src="/media/images/homepage/capability-02-poster.webp"
                alt="A PEN precast node set on prepared ground, its four nails splayed into the soil"
                fill
                priority
                sizes="(min-width: 64rem) 45vw, 100vw"
                className={s.cover}
              />
              <div className={s.heroBadge}>
                <span className={s.heroBadgeValue}>{c.proof.stats[0].value}</span>
                <span className={s.heroBadgeLabel}>{c.proof.stats[0].label}</span>
              </div>
            </figure>
          </div>
        </section>

        {/* ---- 2 · why --------------------------------------------------- */}
        <section id="why" className={cx(s.section, s.light)} aria-labelledby="lp-why">
          <div className={t.gutter}>
            <div className={s.head} data-reveal>
              <Chip>{c.why.chip}</Chip>
              <h2 id="lp-why" className={t.h2}>
                {c.why.heading}
              </h2>
              {c.why.body.map((line) => (
                <p key={line} className={s.lead}>
                  {line}
                </p>
              ))}
            </div>
            <ul className={s.benefits}>
              {c.why.items.map((item, i) => (
                <li key={item.title} className={s.benefit} data-reveal style={stagger(i % 3)}>
                  <span className={s.benefitIcon}>
                    <Icon name={item.icon} />
                  </span>
                  <h3 className={s.cardTitle}>{item.title}</h3>
                  <p className={s.cardBody}>{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- 3 · enquiry ------------------------------------------------ */}
        <Enquiry id="enquiry" copy={c.enquiryTop} formId="lp-top" />

        {/* ---- 4 · how it works: the 3D model, centred ------------------ */}
        <section id="how" className={cx(s.section, s.dark, s.how)} aria-labelledby="lp-how">
          <div className={t.gutter}>
            <div className={s.howHead} data-reveal>
              <Chip>{c.how.chip}</Chip>
              <h2 id="lp-how" className={t.h2}>
                {c.how.heading}
              </h2>
              {c.how.body.map((line) => (
                <p key={line} className={s.leadDark}>
                  {line}
                </p>
              ))}
            </div>

            <LandingModel
              src={assets.penModel.src}
              hud={anatomyT.hud}
              dragLabel={anatomyT.dragLabel}
              fallback={
                <Image
                  src={assets.productRender.src}
                  alt={assets.productRender.alt}
                  width={assets.productRender.width}
                  height={assets.productRender.height}
                  sizes="(min-width: 64rem) 60vw, 100vw"
                  className={s.render}
                />
              }
            />

            <ol className={s.howSteps}>
              {c.how.steps.map((step, i) => (
                <li key={step.title} data-reveal style={stagger(i)}>
                  <span className={s.stepNum}>{pad(i + 1)}</span>
                  <h3 className={s.stepTitle}>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
            <p className={s.tagline} data-reveal>
              {c.how.tagline}
            </p>
          </div>
        </section>

        {/* ---- 5 · comparison -------------------------------------------- */}
        <section className={cx(s.section, s.light)} aria-labelledby="lp-compare">
          <div className={t.gutter}>
            <div className={s.head} data-reveal>
              <Chip>{c.compare.chip}</Chip>
              <h2 id="lp-compare" className={t.h2}>
                {c.compare.heading}
              </h2>
            </div>
            <div className={s.tableWrap} data-reveal>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th scope="col" className={s.thPen}>
                      {c.compare.columns[0]}
                    </th>
                    <th scope="col">{c.compare.columns[1]}</th>
                  </tr>
                </thead>
                <tbody>
                  {c.compare.rows.map(([pen, conventional]) => (
                    <tr key={pen}>
                      <td className={s.tdPen}>
                        <span className={s.penCell}>
                          <Tick />
                          {pen}
                        </span>
                      </td>
                      <td>{conventional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={s.idea} data-reveal>
              <p>
                <span>{c.compare.closingLead}</span> {c.compare.closing}
              </p>
              <CtaButton label={c.hero.cta} />
            </div>
          </div>
        </section>

        {/* ---- 6 · proof -------------------------------------------------- */}
        <section className={cx(s.section, s.dark)} aria-labelledby="lp-proof">
          <div className={t.gutter}>
            <div className={s.head} data-reveal>
              <Chip>{c.proof.chip}</Chip>
              <h2 id="lp-proof" className={t.h2}>
                {c.proof.heading}
              </h2>
              <p className={s.leadDark}>{c.proof.body}</p>
            </div>
            <ul className={s.stats}>
              {c.proof.stats.map((stat, i) => (
                <li key={stat.value} className={s.stat} data-reveal style={stagger(i)}>
                  <span className={s.statValue}>{stat.value}</span>
                  <span className={s.statLabel}>{stat.label}</span>
                </li>
              ))}
            </ul>
            <div className={s.recognition} data-reveal>
              <div>
                <h3 className={cx(t.mono, s.recognitionTitle)}>{c.proof.trustTitle}</h3>
                <ul className={s.recognitionList}>
                  {c.proof.trust.map((item) => (
                    <li key={item}>
                      <Tick />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <ul className={s.logos}>
                {validationLogos.map((logo) => (
                  <li key={logo.src}>
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={160}
                      height={80}
                      className={s.logo}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <p className={s.disclaimer}>{c.proof.disclaimer}</p>
          </div>
        </section>

        {/* ---- 7 · uses --------------------------------------------------- */}
        <section className={cx(s.section, s.light)} aria-labelledby="lp-uses">
          <div className={t.gutter}>
            <div className={s.head} data-reveal>
              <Chip>{c.uses.chip}</Chip>
              <h2 id="lp-uses" className={t.h2}>
                {c.uses.heading}
              </h2>
            </div>
            <ul className={s.uses}>
              {c.uses.items.map((item, i) => {
                const image = applicationImages[item.slug];
                return (
                  <li key={item.slug} className={s.use} data-reveal style={stagger(i % 3)}>
                    {image && (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 50vw, 100vw"
                        className={s.cover}
                      />
                    )}
                    <div className={s.useShade} aria-hidden />
                    <div className={s.useCopy}>
                      <h3 className={s.useTitle}>{item.title}</h3>
                      <p>{item.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className={s.note}>{c.uses.note}</p>
          </div>
        </section>

        {/* ---- 8 · projects ----------------------------------------------- */}
        <section id="projects" className={cx(s.section, s.paper)} aria-labelledby="lp-projects">
          <div className={t.gutter}>
            <div className={s.head} data-reveal>
              <Chip>{c.projects.chip}</Chip>
              <h2 id="lp-projects" className={t.h2}>
                {c.projects.heading}
              </h2>
            </div>
            <ul className={s.projects}>
              {c.projects.items.map((project, i) => (
                <li key={project.name} className={s.project} data-reveal style={stagger(i % 3)}>
                  <div className={s.projectMedia}>
                    <Image
                      src={project.image.src}
                      alt={project.image.alt}
                      fill
                      sizes="(min-width: 64rem) 30vw, 100vw"
                      className={s.cover}
                    />
                  </div>
                  <div className={s.projectBody}>
                    <h3 className={s.cardTitle}>
                      {project.name}
                      {project.place && <span className={s.place}> · {project.place}</span>}
                    </h3>
                    <p className={s.cardBody}>{project.body}</p>
                    <p className={s.result}>{project.result}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- 9 · why choose --------------------------------------------- */}
        <section className={cx(s.section, s.light)} aria-labelledby="lp-choose">
          <div className={t.gutter}>
            <div className={s.head} data-reveal>
              <Chip>{c.choose.chip}</Chip>
              <h2 id="lp-choose" className={t.h2}>
                {c.choose.heading}
              </h2>
            </div>
            <ul className={s.choose}>
              {c.choose.items.map((item, i) => (
                <li key={item.title} data-reveal style={stagger(i % 3)}>
                  <span className={s.chooseNum}>{pad(i + 1)}</span>
                  <h3 className={s.cardTitle}>{item.title}</h3>
                  <p className={s.cardBody}>{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- 10 · process ------------------------------------------------ */}
        <section className={cx(s.section, s.dark)} aria-labelledby="lp-process">
          <div className={t.gutter}>
            <div className={s.head} data-reveal>
              <Chip>{c.process.chip}</Chip>
              <h2 id="lp-process" className={t.h2}>
                {c.process.heading}
              </h2>
            </div>
            <ol className={s.process}>
              {c.process.steps.map((step, i) => (
                <li key={step.title} data-reveal style={stagger(i)}>
                  <span className={s.processNum}>{pad(i + 1)}</span>
                  <h3 className={s.stepTitle}>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
            <div className={s.processCta} data-reveal>
              <CtaButton label={c.hero.cta} />
            </div>
          </div>
        </section>

        {/* ---- 11 · FAQ ---------------------------------------------------- */}
        <FaqSection
          id="faq"
          titleId="lp-faq"
          chip={c.faq.chip}
          heading={c.faq.heading}
          cta={{ label: c.hero.cta, href: '#enquiry-bottom' }}
          tabs={[{ id: 'faq', label: c.faq.chip, entries: c.faq.entries }]}
        />

        {/* ---- 12 · enquiry, again ----------------------------------------- */}
        <Enquiry id="enquiry-bottom" copy={c.enquiryBottom} formId="lp-bottom" />
      </main>

      {/* ---- 13 · closing, in the site footer's design --------------- */}
      <LandingClosing />

      <StickyBar cta={c.hero.cta} />
      <RevealController rootId={ROOT_ID} />
    </div>
  );
}
