'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { LANDING_PHONE } from '@/content/data/landing';
import { trackCall } from '@/lib/analytics/track';

import { cx } from '../../components/primitives';
import s from './landing.module.css';

/** A phone link that reports the tap as a call conversion. */
export function CallLink({
  location,
  className,
  children,
}: {
  location: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <a href={`tel:${LANDING_PHONE.tel}`} className={className} onClick={() => trackCall(location)}>
      {children ?? LANDING_PHONE.display}
    </a>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Phones only: call and enquire, always in reach at the foot of the screen.
 * It steps aside while an enquiry form is on screen, so it never covers the
 * fields or the submit button.
 */
export function StickyBar({ cta }: { cta: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const forms = document.querySelectorAll('[data-enquiry]');
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setHidden(visible.size > 0);
    });
    forms.forEach((f) => io.observe(f));
    return () => io.disconnect();
  }, []);

  return (
    <div className={cx(s.sticky, hidden && s.stickyHidden)} aria-hidden={hidden || undefined}>
      <CallLink location="sticky-bar" className={s.stickyCall}>
        <PhoneIcon />
        Call
      </CallLink>
      <a href="#enquiry" className={s.stickyCta} tabIndex={hidden ? -1 : undefined}>
        {cta}
      </a>
    </div>
  );
}

export { PhoneIcon };
