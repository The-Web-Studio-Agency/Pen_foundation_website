'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

import { footerContact, navActions, primaryNav, type NavItem } from '@/config/navigation';
import { assets } from '@/designs/v2/assets';
import { ChevronRight, cx } from '@/designs/v2/components/primitives';
import s from '@/designs/v2/styles/nav.module.css';

/** Scroll distance after which the bar becomes the floating pill. */
const PILL_AFTER_PX = 24;
/** Grace period before a hover-opened dropdown closes, so the pointer can cross the gap. */
const CLOSE_DELAY_MS = 160;

const cta = navActions[0];
const phoneHref = `tel:${footerContact.phone.replace(/\s+/g, '')}`;

function PhoneGlyph() {
  return (
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
  );
}

function Caret() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden className={s.caret}>
      <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** True when `href` is the current page (or a section of it, for the menus). */
function isCurrent(pathname: string, item: NavItem) {
  if (item.items) return item.items.some((sub) => pathname === sub.href.split('#')[0]);
  if (item.href === '/') return pathname === '/';
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/**
 * The site's navigation: logo, the primary links (two of them dropdowns), then
 * the phone button and "Request Assessment".
 *
 *   AT THE TOP   full width and transparent, over each page's dark opening.
 *   SCROLLED     a floating forest-glass pill 16px down.
 *
 * One element changes state (`data-pill`) and CSS transitions between them.
 * Dropdowns open on hover (fine pointers) or click, close on Escape, on a
 * click elsewhere and on navigation. Below 1200px the links move into a
 * full-screen menu where the dropdowns become expandable groups.
 *
 * Links come from config/navigation.ts (`primaryNav`); styles from
 * designs/v2/styles/nav.module.css.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const base = useId();
  const [pill, setPill] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const [group, setGroup] = useState<string | null>(null);
  const [routeSeen, setRouteSeen] = useState(pathname);
  const closeTimer = useRef<number>(0);
  const navRef = useRef<HTMLElement>(null);

  // A new page closes every menu. Adjusting state while rendering (rather
  // than in an effect) is React's pattern for resetting on a prop change.
  if (routeSeen !== pathname) {
    setRouteSeen(pathname);
    setOpen(false);
    setMenu(null);
    setGroup(null);
  }

  useEffect(() => {
    const onScroll = () => setPill(window.scrollY > PILL_AFTER_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape closes whatever is open; a click outside the links closes a dropdown.
  useEffect(() => {
    if (!open && !menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      setMenu(null);
    };
    const onDown = (e: PointerEvent) => {
      if (menu && navRef.current && !navRef.current.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [open, menu]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const hoverOpen = (label: string) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    window.clearTimeout(closeTimer.current);
    setMenu(label);
  };
  const hoverClose = () => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenu(null), CLOSE_DELAY_MS);
  };

  return (
    <header
      className={s.bar}
      data-pill={pill || undefined}
      data-open={open || undefined}
      data-menu={menu ? '' : undefined}
    >
      <div className={s.inner}>
        <Link href="/" className={s.logo} aria-label="PEN Foundation — home">
          <Image
            src={assets.logo.src}
            alt=""
            width={assets.logo.width}
            height={assets.logo.height}
            priority
            className={s.logoImg}
          />
        </Link>

        <nav ref={navRef} aria-label="Primary" className={s.links}>
          <ul className={s.linkList}>
            {primaryNav.map((item) => {
              const current = isCurrent(pathname, item);
              if (!item.items) {
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={s.link}
                      aria-current={current ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              const panelId = `${base}-${item.label}`;
              const isOpen = menu === item.label;
              const visual = item.items.some((sub) => sub.image);
              return (
                <li
                  key={item.label}
                  className={s.menuItem}
                  onMouseEnter={() => hoverOpen(item.label)}
                  onMouseLeave={hoverClose}
                >
                  <button
                    type="button"
                    className={s.link}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    data-current={current || undefined}
                    onClick={() => setMenu(isOpen ? null : item.label)}
                  >
                    {item.label}
                    <Caret />
                  </button>
                  <div
                    id={panelId}
                    className={cx(s.dropdown, visual && s.dropdownVisual)}
                    data-open={isOpen || undefined}
                  >
                    <ul className={s.dropList}>
                      {item.items.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            className={s.dropLink}
                            aria-current={pathname === sub.href ? 'page' : undefined}
                            tabIndex={isOpen ? undefined : -1}
                            onClick={() => setMenu(null)}
                          >
                            {sub.image && (
                              <span className={s.dropThumb}>
                                <Image src={sub.image} alt="" fill sizes="120px" />
                              </span>
                            )}
                            <span className={s.dropText}>
                              <span className={s.dropLabel}>{sub.label}</span>
                              {sub.description && (
                                <span className={s.dropDesc}>{sub.description}</span>
                              )}
                            </span>
                            <span className={s.dropArrow} aria-hidden>
                              <ChevronRight size={12} />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={s.actions}>
          <a
            href={phoneHref}
            className={s.phone}
            aria-label={`Call ${footerContact.phone}`}
            title={footerContact.phone}
          >
            <PhoneGlyph />
          </a>
          <Link href={cta.href} className={s.pillButton}>
            {cta.label}
          </Link>
        </div>

        <button
          type="button"
          className={s.toggle}
          aria-expanded={open}
          aria-controls={`${base}-panel`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={s.toggleLabel} aria-hidden>
            {open ? 'Close' : 'Menu'}
          </span>
          <span className={cx(s.burger, open && s.burgerOpen)} aria-hidden />
        </button>
      </div>

      <div id={`${base}-panel`} className={s.panel} hidden={!open}>
        <nav aria-label="Mobile" className={s.panelLinks}>
          {primaryNav.map((item) =>
            item.items ? (
              <div key={item.label} className={s.panelGroup}>
                <button
                  type="button"
                  className={s.panelLink}
                  aria-expanded={group === item.label}
                  onClick={() => setGroup(group === item.label ? null : item.label)}
                >
                  {item.label}
                  <Caret />
                </button>
                <ul className={s.panelSub} hidden={group !== item.label}>
                  {item.items.map((sub) => (
                    <li key={sub.href}>
                      <Link
                        href={sub.href}
                        className={s.panelSubLink}
                        onClick={() => setOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={s.panelLink}
                aria-current={isCurrent(pathname, item) ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <div className={s.panelActions}>
          <a href={phoneHref} className={s.panelPhone}>
            <PhoneGlyph />
            {footerContact.phone}
          </a>
          <Link href={cta.href} className={s.panelCta} onClick={() => setOpen(false)}>
            {cta.label}
            <ChevronRight />
          </Link>
        </div>
      </div>
    </header>
  );
}
