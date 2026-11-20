import Image from 'next/image';

import { siteConfig } from '@/config/site';
import { landing as c, LANDING_PHONE } from '@/content/data/landing';

import { assets } from '../../assets';
import { LoopVideo } from '../../components/LoopVideo';
import { NotchedTop } from '../../components/NotchedTop';
import { ChevronRight, cx, stagger } from '../../components/primitives';
import { closingV2 } from '../../content';
import fs from '../../styles/closing.module.css';
import t from '../../styles/theme.module.css';
import { CallLink } from './LandingActions';
import s from './landing.module.css';

/**
 * The landing page's closing and footer: the site footer's design (film
 * ground, notched top, the full-width wordmark) carrying the source's
 * closing section. No link columns, no social links, no outbound credit
 * link: every action here is the enquiry, the phone or back to the top.
 */
export function LandingClosing() {
  return (
    <NotchedTop className={fs.notched}>
      <footer className={fs.closing}>
        <LoopVideo src={closingV2.film.src} poster={closingV2.film.poster} className={fs.film} />
        <div className={fs.shade} aria-hidden />

        <div className={cx(fs.cta, t.gutter)}>
          <h2 className={cx(t.display, fs.ctaTitle)}>
            <span className={fs.line} data-reveal>
              {c.closing.heading}
            </span>
          </h2>
          <p className={cx(t.body, fs.ctaIntro)} data-reveal style={stagger(1)}>
            {c.closing.sub}
          </p>
          <div className={s.closingActions} data-reveal style={stagger(2)}>
            <a href="#enquiry-bottom" className={cx(t.btn, t.solid, fs.ctaButton)}>
              <span>{c.closing.cta}</span>
              <span className={t.btnIcon}>
                <ChevronRight />
              </span>
            </a>
            <CallLink location="footer" className={s.closingCall}>
              {LANDING_PHONE.display}
            </CallLink>
          </div>
        </div>

        <div className={cx(fs.wordmarkWrap, t.gutter)} aria-hidden>
          <p className={fs.wordmark}>{closingV2.wordmark}</p>
        </div>

        <div className={cx(s.footRow, t.gutter)}>
          <div>
            <p className={fs.slogan}>{c.closing.slogan}</p>
            <p className={s.footDescriptor}>
              <b>{c.closing.name}</b> · {c.closing.descriptor}
            </p>
          </div>
          <div className={s.footContact}>
            <p className={cx(t.mono, s.footLabel)}>Talk to an Engineer</p>
            <CallLink location="footer-contact" className={s.footPhone} />
          </div>
        </div>

        <div className={cx(fs.bottom, t.gutter)}>
          <p className={fs.copyright}>
            <Image
              src={assets.logo.src}
              alt=""
              width={assets.logo.width}
              height={assets.logo.height}
              className={fs.bottomLogo}
            />
            {closingV2.copyright}
          </p>
          <p className={fs.credit}>
            {siteConfig.credit.prefix} <b className={fs.creditName}>{siteConfig.credit.label}</b>
            {siteConfig.credit.suffix}
          </p>
          <a href="#lp" className={fs.bottomLink}>
            Back to top ↑
          </a>
        </div>
      </footer>
    </NotchedTop>
  );
}
