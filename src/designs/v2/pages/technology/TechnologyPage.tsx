import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';

import { PageHero } from '../../components/page/PageHero';
import { SectionHead } from '../../components/page/SectionHead';
import { ArrowRight, Chip, cx, stagger } from '../../components/primitives';
import p from '../../styles/page.module.css';
import sys from '../../styles/system.module.css';
import t from '../../styles/theme.module.css';
import { Calculator } from './Calculator';
import {
  anatomyT,
  calculatorT,
  comparisonT,
  documentsT,
  heroT,
  installT,
  loadT,
  specificationT,
  validationT,
} from './content';
import s from './technology.module.css';

/**
 * /technology, top to bottom:
 *
 *   dark    hero over the installed node, four key figures
 *   black   anatomy (render + callouts) → specification table
 *   forest  load transfer: film, the two mechanism paragraphs, soil
 *   paper   installation — the four project steps
 *   white   PEN vs. conventional
 *   black   validation: testing, loads, code, institutions
 *   paper   calculator
 *   white   documents on request
 */
export function TechnologyPage() {
  return (
    <>
      <PageHero
        kicker={heroT.kicker}
        title={heroT.title}
        lead={heroT.lead}
        actions={heroT.actions}
        image={heroT.image}
        crumbs={[{ label: 'Home', href: '/' }, { label: heroT.kicker }]}
        facts={heroT.facts}
      />
      <div className={p.black}>
        <Anatomy />
        <Specification />
      </div>
      <LoadTransfer />
      <Installation />
      <Comparison />
      <Validation />
      <section
        id="calculator"
        className={cx(p.section, p.paper, s.anchor)}
        aria-labelledby="tech-calc-title"
      >
        <div className={t.gutter}>
          <SectionHead id="tech-calc-title" chip={calculatorT.chip} heading={calculatorT.heading} />
          <Calculator
            basis={calculatorT.basis}
            disclaimer={calculatorT.disclaimer}
            tag={calculatorT.tag}
            cta={calculatorT.cta}
          />
        </div>
      </section>
      <Documents />
    </>
  );
}

function Anatomy() {
  const { render } = anatomyT;
  return (
    <section className={cx(s.anatomy, t.gutter)} aria-labelledby="tech-anatomy-title">
      <div className={s.anatomyText}>
        <div data-reveal>
          <Chip>{anatomyT.chip}</Chip>
        </div>
        <h2 id="tech-anatomy-title" className={t.h2} data-reveal style={stagger(1)}>
          {anatomyT.heading}
        </h2>
        <p className={cx(t.body, s.anatomyBody)} data-reveal style={stagger(2)}>
          {anatomyT.body}
        </p>
      </div>

      <figure className={sys.renderPanel} data-reveal style={stagger(1)}>
        <Image
          src={render.src}
          alt={render.alt}
          width={render.width}
          height={render.height}
          sizes="(min-width: 64rem) 55vw, 100vw"
          className={sys.render}
        />
        <ul className={sys.tags}>
          {anatomyT.tags.map((tag, i) => (
            <li
              key={tag.label}
              className={cx(sys.tag, tag.x > 50 && s.tagFlip)}
              style={{ '--x': `${tag.x}%`, '--y': `${tag.y}%`, '--i': i + 2 } as CSSProperties}
            >
              <span className={sys.tagDot} aria-hidden />
              <span className={cx(t.mono, sys.tagLabel)}>{tag.label}</span>
            </li>
          ))}
        </ul>
      </figure>
    </section>
  );
}

function Specification() {
  return (
    <section className={cx(s.spec, t.gutter)} aria-labelledby="tech-spec-title">
      <SectionHead
        id="tech-spec-title"
        chip={specificationT.chip}
        heading={specificationT.heading}
      />
      <dl className={s.specList}>
        {specificationT.parts.map((part, i) => (
          <div key={part.term} className={s.specRow} data-reveal style={stagger(i % 4)}>
            <span className={cx(t.mono, s.specIndex)} aria-hidden>
              [{String(i + 1).padStart(2, '0')}]
            </span>
            <dt className={s.specTerm}>{part.term}</dt>
            <dd className={cx(t.mono, s.specValue)}>{part.spec}</dd>
          </div>
        ))}
      </dl>
      <p className={cx(t.mono, s.specNote)} data-reveal>
        {specificationT.note}
      </p>
    </section>
  );
}

function LoadTransfer() {
  return (
    <section className={cx(p.section, p.dark)} aria-labelledby="tech-load-title">
      <div className={t.gutter}>
        <SectionHead
          id="tech-load-title"
          chip={loadT.chip}
          heading={loadT.heading}
          lead={loadT.lead}
          split
        />
        <div className={s.loadGrid}>
          <figure className={s.filmCard} data-reveal>
            <Image
              src={loadT.image.src}
              alt={loadT.image.alt}
              fill
              sizes="(min-width: 64rem) 50vw, 100vw"
              className={s.film}
            />
            <figcaption className={cx(t.mono, s.filmLabel)}>[ {loadT.imageLabel} ]</figcaption>
          </figure>
          <div className={s.loadText}>
            {loadT.paragraphs.map((text, i) => (
              <p key={i} className={s.loadPara} data-reveal style={stagger(i + 1)}>
                {text}
              </p>
            ))}
            <div className={s.soilCard} data-reveal style={stagger(3)}>
              <h3 className={cx(t.mono, s.soilTitle)}>{loadT.soil.question}</h3>
              <p className={s.soilBody}>{loadT.soil.answer}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Installation() {
  return (
    <section className={cx(p.section, p.paper)} aria-labelledby="tech-install-title">
      <div className={t.gutter}>
        <SectionHead
          id="tech-install-title"
          chip={installT.chip}
          heading={installT.heading}
          lead={installT.lead}
          split
        />
        <ol className={s.steps}>
          {installT.steps.map((step, i) => (
            <li key={step.number} className={s.step} data-reveal style={stagger(i)}>
              <span className={s.stepNum} aria-hidden>
                {step.number}
              </span>
              <h3 className={s.stepTitle}>{step.title}</h3>
              <p className={s.stepBody}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Mark({ yes }: { yes: boolean }) {
  return (
    <span className={cx(s.mark, yes ? s.markYes : s.markNo)}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        {yes ? (
          <path d="m2.5 6.2 2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="1.6" />
        ) : (
          <path d="M3 3l6 6M9 3 3 9" stroke="currentColor" strokeWidth="1.6" />
        )}
      </svg>
      <span className={t.srOnly}>{yes ? 'Yes' : 'No'}</span>
    </span>
  );
}

function Comparison() {
  const [penCol, convCol] = comparisonT.columns;
  return (
    <section className={cx(p.section, p.light)} aria-labelledby="tech-compare-title">
      <div className={t.gutter}>
        <SectionHead
          id="tech-compare-title"
          chip={comparisonT.chip}
          heading={comparisonT.heading}
        />
        <div className={s.tableWrap} data-reveal>
          <table className={s.table}>
            <thead>
              <tr>
                <th scope="col">
                  <span className={t.srOnly}>Feature</span>
                </th>
                <th scope="col" className={cx(t.mono, s.colPen)}>
                  {penCol}
                </th>
                <th scope="col" className={t.mono}>
                  {convCol}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonT.rows.map((row) => (
                <tr key={row.feature}>
                  <th scope="row">{row.feature}</th>
                  <td className={s.colPen}>
                    <Mark yes={row.pen} />
                  </td>
                  <td>
                    <Mark yes={row.conventional} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={s.tableNote} data-reveal>
          {comparisonT.note}
        </p>
      </div>
    </section>
  );
}

function Validation() {
  return (
    <section className={cx(p.section, p.black)} aria-labelledby="tech-validation-title">
      <div className={t.gutter}>
        <SectionHead
          id="tech-validation-title"
          chip={validationT.chip}
          heading={validationT.heading}
        />
        <ul className={s.qaGrid}>
          {validationT.entries.map((entry, i) => (
            <li key={entry.question} className={s.qa} data-reveal style={stagger(i)}>
              <span className={cx(t.mono, s.qaIndex)} aria-hidden>
                [{String(i + 1).padStart(2, '0')}]
              </span>
              <h3 className={s.qaTitle}>{entry.question}</h3>
              <p className={s.qaBody}>{entry.answer}</p>
            </li>
          ))}
        </ul>
        <ul className={s.logos}>
          {validationT.logos.map((logo, i) => (
            <li key={logo.src} className={s.logoCard} data-reveal style={stagger(i)}>
              <Image src={logo.src} alt={logo.alt} width={320} height={160} className={s.logoImg} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Documents() {
  return (
    <section className={cx(p.section, p.light)} aria-labelledby="tech-docs-title">
      <div className={cx(t.gutter, s.docs)}>
        <SectionHead
          className={s.docsHead}
          id="tech-docs-title"
          chip={documentsT.chip}
          heading={documentsT.heading}
          lead={documentsT.lead}
        />
        <ul className={s.docList}>
          {documentsT.items.map((item, i) => (
            <li key={item} data-reveal style={stagger(i)}>
              <Link
                href={documentsT.href}
                className={s.docRow}
                aria-label={`${documentsT.actionLabel} ${item}`}
              >
                <span className={s.docName}>{item}</span>
                <span className={cx(t.mono, s.docAction)}>
                  <span className={s.docActionLabel}>{documentsT.actionLabel}</span>
                  <span className={cx(t.roundArrow, s.docArrow)}>
                    <ArrowRight />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
