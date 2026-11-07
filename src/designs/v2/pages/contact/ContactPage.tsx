import { footerContact } from '@/config/navigation';
import { hero } from '@/content/data/contact';
import { whatsappNumber } from '@/lib/contact/whatsapp';

import { PageHero } from '../../components/page/PageHero';
import { SectionHead } from '../../components/page/SectionHead';
import { ArrowRight, cx, stagger } from '../../components/primitives';
import p from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import { EnquiryForm } from './EnquiryForm';
import s from './contact.module.css';

/**
 * /contact, top to bottom:
 *
 *   dark    hero — "Connect directly with the PEN Foundation engineering team"
 *   paper   #contact-form — what the team helps with and the direct lines
 *           (call / WhatsApp, the only published channels), beside the
 *           enquiry form. The header's "Request Assessment" deep-links here.
 *
 * Copy comes from content/data/contact.ts and config/navigation.ts
 * (`footerContact`); the number from config/site.ts via both.
 */

const telHref = `tel:${footerContact.phone.replace(/[^\d+]/g, '')}`;
const whatsappHref = `https://wa.me/${whatsappNumber}`;

export function ContactPage() {
  const lines = [
    { label: 'Call', value: footerContact.phone, href: telHref, external: false },
    { label: 'WhatsApp', value: footerContact.phone, href: whatsappHref, external: true },
  ];

  return (
    <>
      <PageHero
        kicker="Contact"
        title={hero.infoHeading}
        lead={hero.infoBody}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
        actions={[
          { label: 'Send an enquiry', href: '#contact-form' },
          { label: 'Call us', href: telHref, tone: 'ghost' },
        ]}
      />

      <section
        id="contact-form"
        className={cx(p.section, p.paper)}
        aria-labelledby="contact-form-title"
      >
        <div className={cx(t.gutter, s.formGrid)}>
          <SectionHead
            id="contact-form-title"
            chip="Enquiry"
            heading={footerContact.prompt}
            className={s.formHead}
          />

          <div className={s.formDetails}>
            <div className={s.helps} data-reveal style={stagger(3)}>
              <p className={cx(t.mono, s.helpsLabel)}>[ How we can help ]</p>
              <ul className={s.helpList}>
                {hero.bullets.map((bullet) => (
                  <li key={bullet} className={s.helpItem}>
                    <span className={s.helpMark} aria-hidden />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            <p className={cx(t.body, s.trust)} data-reveal style={stagger(4)}>
              {hero.trustLabel}
            </p>

            <div className={s.direct} data-reveal style={stagger(5)}>
              <p className={cx(t.mono, s.helpsLabel)}>[ {hero.phoneLabel} ]</p>
              <ul className={s.lines}>
                {lines.map((line) => (
                  <li key={line.label}>
                    <a
                      href={line.href}
                      className={s.line}
                      {...(line.external ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
                    >
                      <span className={cx(t.mono, s.lineLabel)}>{line.label}</span>
                      <span className={s.lineValue}>{line.value}</span>
                      <span className={t.roundArrow}>
                        <ArrowRight />
                      </span>
                      {line.external && <span className={t.srOnly}> (opens in a new tab)</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={s.formCol} data-reveal style={stagger(1)}>
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
