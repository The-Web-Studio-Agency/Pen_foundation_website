'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { siteConfig } from '@/config/site';
import { landing as c, LANDING_PHONE } from '@/content/data/landing';
import { trackCall } from '@/lib/analytics/track';

import { assets } from '../../assets';
import { cx } from '../../components/primitives';
import nav from '../../styles/nav.module.css';
import s from './landing.module.css';

/** Scroll distance after which the bar becomes the floating pill (as the site's). */
const PILL_AFTER_PX = 24;

/** In-page sections only: nothing here leaves the page. */
const LINKS = [
  { label: 'Why PEN', href: '#why' },
  { label: 'How it works', href: '#how' },
  { label: 'Projects', href: '#projects' },
  { label: 'FAQ', href: '#faq' },
];

/**
 * The landing page's navbar: the site navbar's design (transparent over the
 * hero, morphing into the floating pill on scroll) with only in-page links,
 * the phone number and the enquiry. The logo returns to the top of this
 * page, never to the homepage.
 */
export function LandingNav() {
  const [pill, setPill] = useState(false);

  useEffect(() => {
    const onScroll = () => setPill(window.scrollY > PILL_AFTER_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={nav.bar} data-pill={pill || undefined}>
      <div className={nav.inner}>
        <a href="#lp" className={nav.logo} aria-label={`${siteConfig.name}: back to top`}>
          <Image
            src={assets.logo.src}
            alt=""
            width={assets.logo.width}
            height={assets.logo.height}
            priority
            className={nav.logoImg}
          />
        </a>

        <nav aria-label="On this page" className={s.navLinks}>
          <ul className={nav.linkList}>
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={nav.link}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.navActions}>
          <a
            href={`tel:${LANDING_PHONE.tel}`}
            className={cx(nav.phone, s.navPhone)}
            onClick={() => trackCall('navbar')}
            aria-label={`Call ${LANDING_PHONE.display}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
            </svg>
            <span className={s.navPhoneText}>{LANDING_PHONE.display}</span>
          </a>
          <a href="#enquiry" className={cx(nav.pillButton, s.navCta)}>
            {c.hero.cta}
          </a>
        </div>
      </div>
    </header>
  );
}
