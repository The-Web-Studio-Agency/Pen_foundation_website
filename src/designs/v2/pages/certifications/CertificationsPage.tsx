import Image from 'next/image';

import { certificate, documents } from '@/features/resources';

import { PageHero } from '../../components/page/PageHero';
import { Chip, ArrowDown, cx, stagger } from '../../components/primitives';
import p from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import { RelatedLinks } from '../documentation/RelatedLinks';
import s from './certifications.module.css';

/**
 * /certifications — the GRIHA Product Catalogue listing.
 *
 *   dark   hero: the listing, in the certificate's own words
 *   paper  the certificate itself beside its particulars and the PDF
 *   white  related resources
 *
 * Every figure is transcribed from the certificate (features/resources
 * content); nothing here is restated by hand.
 */
export function CertificationsPage() {
  const [issuer, number, ...rest] = certificate.facts;
  const pdf = documents.items.find((d) => d.file === certificate.file);

  return (
    <>
      <PageHero
        kicker="Certifications"
        title={certificate.heading}
        lead={certificate.body}
        actions={[
          { label: 'View the certificate', href: '#griha' },
          { label: 'All documents', href: '/docs' },
        ]}
        facts={[issuer, ...rest]}
      />

      <section
        id="griha"
        className={cx(p.section, p.paper, s.section)}
        aria-labelledby="griha-title"
      >
        <div className={cx(t.gutter, s.layout)}>
          <figure className={s.sheet} data-reveal>
            <Image
              src={certificate.image}
              alt={certificate.imageAlt}
              width={676}
              height={794}
              sizes="(min-width: 64rem) 32rem, 90vw"
              className={s.sheetImage}
            />
          </figure>

          <div className={s.details}>
            <div data-reveal>
              <Chip>{issuer.value}</Chip>
            </div>
            <p className={cx(t.mono, s.numberLabel)} data-reveal style={stagger(1)}>
              {number.label}
            </p>
            <h2 id="griha-title" className={cx(t.h2, s.number)} data-reveal style={stagger(1)}>
              {number.value}
            </h2>

            <dl className={s.facts} data-reveal style={stagger(2)}>
              {rest.map((fact) => (
                <div key={fact.label} className={s.fact}>
                  <dt className={t.mono}>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className={s.download} data-reveal style={stagger(3)}>
              <a
                href={certificate.file}
                target="_blank"
                rel="noopener noreferrer"
                className={cx(t.btn, t.solid)}
              >
                <span>{certificate.downloadLabel}</span>
                <span className={t.btnIcon}>
                  <ArrowDown size={14} />
                </span>
                <span className={t.srOnly}> (opens in a new tab)</span>
              </a>
              {pdf && <span className={cx(t.mono, s.size)}>{pdf.meta}</span>}
            </div>
          </div>
        </div>
      </section>

      <RelatedLinks
        id="certifications-related-title"
        items={[
          { label: 'Docs', href: '/docs', body: 'Technical documentation and downloads' },
          { label: 'Blogs', href: '/blogs', body: 'Notes from the engineering journal' },
        ]}
      />
    </>
  );
}
