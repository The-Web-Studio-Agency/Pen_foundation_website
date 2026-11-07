import Image from 'next/image';

import type { CaseStory, StoryImage } from '@/content/data/case-studies';
import { PROJECTS } from '@/content/data/projects';
import { siteConfig } from '@/config/site';

import { FaqSection } from '../../../components/FaqSection';
import { PageHero } from '../../../components/page/PageHero';
import { ButtonLink, Chip, cx, stagger } from '../../../components/primitives';
import p from '../../../styles/page.module.css';
import t from '../../../styles/theme.module.css';
import { CaseStudyCard } from '../CaseStudyCard';
import { ASSESSMENT, caseStudyLabels } from '../content';
import pr from '../projects.module.css';
import { CompareSlider, LoadChart, RoleTabs, SiteVideo } from './StoryInteractive';
import s from './story.module.css';

/** Chip + heading, the chapter opening used through the story. */
function Head({
  kicker,
  heading,
  id,
  as: Tag = 'h2',
}: {
  kicker: string;
  heading: string;
  id?: string;
  as?: 'h2' | 'h3';
}) {
  return (
    <header className={s.head}>
      <div data-reveal>
        <Chip>{kicker}</Chip>
      </div>
      <Tag id={id} className={t.h2} data-reveal style={stagger(1)}>
        {heading}
      </Tag>
    </header>
  );
}

function Figure({ image, sizes }: { image: StoryImage; sizes: string }) {
  return (
    <figure className={s.figure} data-reveal>
      <div className={cx(s.figureFrame, image.drawing && s.isDrawing)}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          className={s.figureImg}
        />
      </div>
      {image.caption && <figcaption className={s.caption}>{image.caption}</figcaption>}
    </figure>
  );
}

function Stamp({ text }: { text: string }) {
  return (
    <span className={cx(t.mono, s.stamp)} aria-hidden>
      {text}
    </span>
  );
}

/**
 * /projects/[slug] for a project with a full written story (see
 * content/data/case-studies.ts). Static throughout except the four islands in
 * StoryInteractive: the before/after slider, the load chart, the site video
 * and the read-by-role tabs. Sections a study doesn't supply (a figure, a
 * load chart, a video, a quote) are left out.
 */
export function StoryPage({ story }: { story: CaseStory }) {
  const { hero, intro, glance, constraint, solution, proof, system, result } = story;
  const related = PROJECTS.filter((other) => other.slug !== story.slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: story.seoTitle,
        description: story.seoDescription,
        image: `${siteConfig.url}${hero.image.src}`,
        url: `${siteConfig.url}/projects/${story.slug}`,
        author: { '@type': 'Organization', name: 'C-DISC Technologies' },
        publisher: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
        about: { '@type': 'Product', name: siteConfig.name },
      },
      // VideoObject left out until the film's recording date is known —
      // schema.org requires `uploadDate` and the source doesn't give one.
      {
        '@type': 'FAQPage',
        mainEntity: story.faq.items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <PageHero
        kicker={`${story.crumb.sector} · ${story.crumb.place}`}
        title={hero.title}
        lead={hero.dek}
        image={hero.image}
        tall
        crumbs={[
          { label: caseStudyLabels.crumbs.home, href: '/' },
          { label: caseStudyLabels.crumbs.projects, href: '/projects' },
          { label: story.name },
        ]}
        actions={[glance.cta, { label: story.sheet.heading, href: '#datasheet', tone: 'ghost' }]}
        facts={story.stats.map((stat) => ({ label: stat.label, value: stat.value }))}
      />

      {/* ---- story: intro, constraint, solution, beside the glance panel ---- */}
      <section className={cx(p.section, p.light)} aria-label="The story">
        <div className={cx(t.gutter, s.layout)}>
          <article className={s.article}>
            <p className={cx(t.h3, s.lede)} data-reveal>
              {intro.lede}
            </p>
            {intro.paragraphs.map((para, i) => (
              <p key={i} className={cx(s.para, i === 0 && s.dropCap)} data-reveal>
                {para}
              </p>
            ))}

            <div className={s.chapter}>
              <Head kicker={constraint.kicker} heading={constraint.heading} />
              {constraint.before.map((para, i) => (
                <p key={i} className={s.para} data-reveal>
                  {para}
                </p>
              ))}
              {constraint.figure && (
                <Figure image={constraint.figure} sizes="(min-width: 64rem) 60vw, 100vw" />
              )}
              {constraint.after && (
                <p className={s.para} data-reveal>
                  {constraint.after}
                </p>
              )}
              <blockquote className={s.pull} data-reveal>
                <p>{constraint.pull.quote}</p>
                <footer className={t.mono}>{constraint.pull.source}</footer>
              </blockquote>
              {constraint.compare && (
                <div data-reveal>
                  <CompareSlider compare={constraint.compare} />
                </div>
              )}
            </div>

            <div className={s.chapter}>
              <Head kicker={solution.kicker} heading={solution.heading} />
              {solution.paragraphs.map((para, i) => (
                <p key={i} className={s.para} data-reveal>
                  {para}
                </p>
              ))}
              {solution.compare && (
                <div data-reveal>
                  <CompareSlider compare={solution.compare} />
                </div>
              )}

              <section className={s.sequence} aria-label={solution.sequence.heading} data-reveal>
                <div className={s.sequenceTop}>
                  <h3 className={s.sequenceTitle}>{solution.sequence.heading}</h3>
                  <span className={t.mono}>{solution.sequence.tag}</span>
                </div>
                <ol className={s.steps}>
                  {solution.sequence.steps.map((step, i) => (
                    <li key={step.title}>
                      <span className={cx(t.mono, s.stepNum)}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <b>{step.title}</b>
                      <span>{step.body}</span>
                    </li>
                  ))}
                </ol>
                <dl className={s.meters}>
                  {solution.sequence.meters.map((m) => (
                    <div key={m.label} className={s.meter}>
                      <dt>{m.label}</dt>
                      <dd>
                        <span className={s.meterTrack}>
                          <i
                            className={cx(s.meterFill, m.pen && s.meterPen)}
                            style={{ width: `${m.percent}%` }}
                          />
                        </span>
                        <span className={cx(t.mono, s.meterValue)}>
                          {m.value ?? `${m.percent}%`}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              {solution.gallery && (
                <ul className={s.gallery}>
                  {solution.gallery.map((img, i) => (
                    <li key={img.src} data-reveal style={stagger(i)}>
                      <figure className={s.galleryItem}>
                        <div className={s.galleryFrame}>
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            sizes="(min-width: 64rem) 20vw, (min-width: 40rem) 33vw, 100vw"
                            className={s.galleryImg}
                          />
                        </div>
                        <figcaption className={s.caption}>{img.caption}</figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>

          <aside className={s.panel} aria-label="Project at a glance">
            <div className={s.panelHead}>
              <p className={cx(t.mono, s.panelKicker)}>Project at a glance</p>
              <h2 className={s.panelTitle}>{glance.heading}</h2>
            </div>
            <dl className={s.panelRows}>
              {glance.rows.map((row) => (
                <div key={row.label}>
                  <dt className={t.mono}>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            <div className={s.panelBadge}>
              <Stamp text={glance.badge.stamp ?? hero.badge.stamp} />
              <div>
                <b>{glance.badge.title}</b>
                <span>{glance.badge.body}</span>
              </div>
            </div>
            <div className={s.panelActions}>
              <ButtonLink href={glance.cta.href} tone="solid">
                {glance.cta.label}
              </ButtonLink>
              <a href="#datasheet" className={s.panelLink}>
                {glance.sheetLink}
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* ---- the proof: plate load tests ---------------------------------- */}
      {proof && (
        <section className={cx(p.section, p.black)} aria-labelledby="story-proof">
          <div className={cx(t.gutter, s.proof)}>
            <div className={s.proofIntro}>
              <Head kicker={proof.kicker} heading={proof.heading} id="story-proof" />
              <p className={cx(t.lead, s.proofBody)} data-reveal>
                {proof.body}
              </p>
            </div>
            <div className={s.proofMain}>
              <div data-reveal>
                <LoadChart chart={proof.chart} />
              </div>
              <ul className={s.results}>
                {proof.results.map((r, i) => (
                  <li key={r.title} data-reveal style={stagger(i)}>
                    <b>{r.title}</b>
                    <span>{r.body}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ---- the system, the video, the result ---------------------------- */}
      <section className={cx(p.section, p.light)} aria-labelledby="story-system">
        {/* With a video, the system sits beside it; without, the heading does. */}
        <div className={cx(t.gutter, s.split)}>
          {!story.video && (
            <Head kicker={system.kicker} heading={system.heading} id="story-system" />
          )}
          <div>
            {story.video && (
              <Head kicker={system.kicker} heading={system.heading} id="story-system" />
            )}
            <p className={s.para} data-reveal>
              {system.body}
            </p>
            <ul className={s.points}>
              {system.points.map((pt, i) => (
                <li key={pt.title} data-reveal style={stagger(i)}>
                  <b>{pt.title}</b>
                  <span>{pt.body}</span>
                </li>
              ))}
            </ul>
          </div>
          {story.video && (
            <div data-reveal>
              <SiteVideo video={story.video} />
            </div>
          )}
        </div>

        <div className={cx(t.gutter, s.result)}>
          <Head kicker={result.kicker} heading={result.heading} />
          <div className={s.resultBody}>
            {result.paragraphs.map((para, i) => (
              <p
                key={i}
                className={i === result.paragraphs.length - 1 ? t.lead : s.para}
                data-reveal
              >
                {para}
              </p>
            ))}
            {result.quote && (
              <blockquote className={s.pull} data-reveal>
                <p>{result.quote.quote}</p>
                <footer className={t.mono}>{result.quote.source}</footer>
              </blockquote>
            )}
          </div>
        </div>
      </section>

      {/* ---- read by role -------------------------------------------------- */}
      <section className={cx(p.section, p.paper)} aria-labelledby="story-roles">
        <div className={t.gutter}>
          <Head kicker={story.roles.kicker} heading={story.roles.heading} id="story-roles" />
          <div data-reveal>
            <RoleTabs tabs={story.roles.tabs} />
          </div>
        </div>
      </section>

      {/* ---- evidence + the bigger picture -------------------------------- */}
      <section className={cx(p.section, p.dark)} aria-labelledby="story-evidence">
        <div className={t.gutter}>
          <div className={s.split}>
            <Head
              kicker={story.evidence.kicker}
              heading={story.evidence.heading}
              id="story-evidence"
            />
            <p className={cx(t.lead, s.proofBody)} data-reveal>
              {story.evidence.body}
            </p>
          </div>
          <ul className={s.evidence}>
            {story.evidence.items.map((item, i) => (
              <li key={item.title} data-reveal style={stagger(i)}>
                <b>{item.title}</b>
                <span>{item.body}</span>
              </li>
            ))}
          </ul>

          <div className={cx(s.split, s.bigger)}>
            <Head kicker={story.bigger.kicker} heading={story.bigger.heading} />
            <div className={s.resultBody}>
              {story.bigger.paragraphs.map((para, i) => (
                <p key={i} className={s.para} data-reveal>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- FAQ ----------------------------------------------------------- */}
      <FaqSection
        titleId="story-faq"
        chip={story.faq.kicker}
        heading={story.faq.heading}
        cta={ASSESSMENT}
        tabs={[
          {
            id: 'faq',
            label: story.faq.kicker,
            entries: story.faq.items.map((item) => ({ question: item.q, answer: item.a })),
          },
        ]}
      />

      {/* ---- technical data sheet ----------------------------------------- */}
      <section id="datasheet" className={cx(p.section, p.paper)} aria-labelledby="story-sheet">
        <div className={t.gutter}>
          <div className={s.split}>
            <Head kicker={story.sheet.kicker} heading={story.sheet.heading} id="story-sheet" />
            <p className={cx(t.lead, s.proofBody)} data-reveal>
              {story.sheet.lead}
            </p>
          </div>
          <div className={s.sheet} data-reveal>
            <div className={cx(t.mono, s.sheetHead)}>
              {story.sheet.header.map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>
            <div className={s.sheetBody}>
              <div className={s.sheetTableWrap}>
                <table className={s.sheetTable}>
                  <tbody>
                    {story.sheet.rows.map((row) => (
                      <tr key={row.label}>
                        <th scope="row" className={t.mono}>
                          {row.label}
                        </th>
                        <td>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={s.drawings}>
                {story.sheet.drawings.map((d, i) => (
                  <div key={d.src} className={i === 0 ? s.drawingWide : undefined}>
                    <Figure image={d} sizes="(min-width: 64rem) 30vw, 100vw" />
                  </div>
                ))}
                <div>
                  <ButtonLink href={story.sheet.cta.href} tone="onLight">
                    {story.sheet.cta.label}
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>

          <div className={s.close} data-reveal>
            <div>
              <h2 className={t.h3}>{story.close.heading}</h2>
              <p className={s.para}>{story.close.body}</p>
            </div>
            <ButtonLink href={story.close.cta.href} tone="solid">
              {story.close.cta.label}
            </ButtonLink>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className={cx(p.section, p.light)} aria-labelledby="story-related">
          <div className={t.gutter}>
            <div className={pr.relatedHead}>
              <h2 id="story-related" className={pr.chipHeading} data-reveal>
                <Chip>{caseStudyLabels.related}</Chip>
              </h2>
              <div data-reveal>
                <ButtonLink href="/projects" tone="onLight">
                  {caseStudyLabels.allProjects}
                </ButtonLink>
              </div>
            </div>
            <ul className={cx(pr.studies, pr.pair)}>
              {related.map((other, i) => (
                <li key={other.slug} data-reveal style={stagger(i)}>
                  <CaseStudyCard project={other} tone="light" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
