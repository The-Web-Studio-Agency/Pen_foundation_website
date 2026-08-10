'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { duration, EASE_OUT_EXPO } from '@/lib/motion';
import { footerContact, navActions, primaryNav } from '@/config/navigation';
import { ChevronDownIcon, CloseIcon, MenuIcon, PhoneIcon } from '@/components/shared/icons';
import { Logo } from '@/components/shared/icons/Logo';
import { MobileNavPanel } from './MobileNavPanel';

const buttonBase =
  'rounded-lg px-8 py-3 text-[11px] font-semibold tracking-wide uppercase transition-colors duration-300';

/** Where the desktop row starts fitting. Below this the pill is logo + toggle. */
const MOBILE_PANEL_ID = 'site-nav-mobile';

/**
 * THE site header. One header, every route.
 *
 * Promoted from the About clone's floating pill, which was previously rendered
 * only by /about while every other route used a separate `SiteNav` — and
 * `SiteNav` early-returned null on /about so the two would not overlap. That
 * conditional is gone: there is only one header now, so there is nothing to
 * suppress.
 *
 * Responsive at `lg` (1024px), and the breakpoint is measured rather than
 * chosen by feel. The desktop row needs 746px of logo + links + actions; the
 * pill offers 736px at 768px wide and 802px at 834px. So it does not fit on a
 * phone at all — at 390px it wanted 701px inside 358px, which is why the logo
 * was being crushed to 0px and the Demo/Contact buttons were laid out at
 * x=417..693, entirely outside the viewport — and it clears a tablet only by a
 * margin too small to survive a font swap. Below `lg` the row is replaced by
 * `MobileNavPanel` instead of being squeezed.
 *
 * The mega menus also open on tap here, not only on hover. Hover alone left
 * every dropdown unreachable on touch, which included the tablets that were
 * nominally "fitting".
 */
export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const activeMenu = primaryNav.find((item) => item.label === openMenu && item.items);
  // Narrowed once here: `items` is optional on NavItem, and `find` cannot carry
  // the "has items" guard through to the JSX below.
  const activeItems = activeMenu?.items ?? [];

  /** A menu is current when the route sits under any of its destinations. */
  const isCurrent = (href: string) => {
    const base = href.split(/[#?]/)[0];
    return base !== '/' && pathname.startsWith(base);
  };

  const closeAll = () => {
    setMobileOpen(false);
    setMobileSection(null);
    setOpenMenu(null);
  };

  // A route change means whatever was open has done its job. Links close the
  // panel themselves via `onNavigate`; this is the case they cannot cover —
  // back/forward, which moves the route with no click to hang the reset on.
  //
  // Adjusted during render rather than in an effect: an effect would paint the
  // new route with the old menu still open and then close it in a second pass.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setMobileOpen(false);
    setOpenMenu(null);
  }

  // Escape closes whichever layer is open and hands focus back to the control
  // that opened it, so keyboard users are not dropped at the top of the page.
  useEffect(() => {
    if (!mobileOpen && !openMenu) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (mobileOpen) toggleRef.current?.focus();
      closeAll();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen, openMenu]);

  // Tap-opened menus need an explicit outside-click to dismiss; the desktop
  // row's `onMouseLeave` only ever fired for a mouse.
  useEffect(() => {
    if (!mobileOpen && !openMenu) return;
    const onPointerDown = (event: PointerEvent) => {
      if (headerRef.current?.contains(event.target as Node)) return;
      closeAll();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [mobileOpen, openMenu]);

  // Crossing up into the desktop row while the panel is open would otherwise
  // leave it mounted but hidden, ready to reappear on the way back down.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileOpen(false);
      else setOpenMenu(null);
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 lg:top-[46px]"
    >
      <div
        // Reference source says max-w-[820px], but this project's Suisse Intl
        // is wider than the Geist it was written against, which pushed the
        // action buttons outside the pill. Widened so the row fits.
        className="w-full max-w-[960px]"
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="inner flex h-16 items-center justify-between gap-3 rounded-lg bg-ink/30 px-4 backdrop-blur-[30px] lg:h-[78px] lg:gap-6 lg:px-6">
          <Link
            href="/"
            aria-label="PEN Foundation — home"
            // `shrink-0`: the logo has no intrinsic minimum in a flex row, so
            // before this it was the first thing the overflow ate — the mobile
            // header rendered with no logo at all.
            className="flex shrink-0 items-center gap-2 text-white"
          >
            <Logo className="h-8 lg:h-9" priority />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {primaryNav.map((item) =>
              item.items ? (
                <div
                  key={item.label}
                  onMouseEnter={() => {
                    setOpenMenu(item.label);
                    setActiveIndex(0);
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={openMenu === item.label}
                    // Hover opens it on a mouse; this is what makes it work on
                    // a touchscreen, where `onMouseEnter` never fires.
                    onClick={() => {
                      setOpenMenu(openMenu === item.label ? null : item.label);
                      setActiveIndex(0);
                    }}
                    className={cn(
                      'flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors hover:text-white',
                      openMenu === item.label || item.items.some((i) => isCurrent(i.href))
                        ? 'text-white'
                        : 'text-white/90',
                    )}
                  >
                    {item.label}
                    <ChevronDownIcon
                      className={cn(
                        'transition-transform duration-200',
                        openMenu === item.label && 'rotate-180',
                      )}
                    />
                  </button>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  onMouseEnter={() => setOpenMenu(null)}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    // `isCurrent` as well as an exact match, so Projects stays
                    // lit on `/projects/[slug]` rather than only on the index.
                    // It returns false for `/`, which keeps Home exact-match.
                    pathname === item.href || isCurrent(item.href)
                      ? 'text-teal-bright'
                      : 'text-white/90 hover:text-white',
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              aria-label="Show phone number"
              className="flex size-9 items-center justify-center rounded-lg border border-white/20 text-white/80 transition-colors hover:text-white"
            >
              <PhoneIcon className="size-4" />
            </button>
            {navActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={cn(
                  buttonBase,
                  action.emphasis === 'primary'
                    ? 'bg-teal text-white hover:bg-[#012c32] hover:text-teal-bright'
                    : 'bg-white text-[#012c32] hover:bg-[#012c32] hover:text-teal-bright',
                )}
              >
                {action.label}
              </Link>
            ))}
          </div>

          <button
            ref={toggleRef}
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls={MOBILE_PANEL_ID}
            onClick={() => setMobileOpen((open) => !open)}
            // 44px square: the minimum comfortable touch target, and the pill
            // is only 64px tall on a phone.
            className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/20 text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            {mobileOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen ? (
            <MobileNavPanel
              id={MOBILE_PANEL_ID}
              items={primaryNav}
              expanded={mobileSection}
              onToggleSection={(label) =>
                setMobileSection((current) => (current === label ? null : label))
              }
              onNavigate={closeAll}
              isCurrent={isCurrent}
              pathname={pathname}
              phone={footerContact.phone}
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {activeMenu ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: duration.fast, ease: EASE_OUT_EXPO }}
              className="mt-2 hidden overflow-hidden rounded-lg bg-[#3a3d34] text-white shadow-xl lg:flex"
            >
              <ul className="w-1/2 divide-y divide-white/10 py-2">
                {activeItems.map((item, i) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(i)}
                      onFocus={() => setActiveIndex(i)}
                      className={cn(
                        'flex w-full items-center justify-between px-5 py-2.5 text-left text-sm transition-colors',
                        activeIndex === i ? 'bg-white/10 text-teal-bright' : 'text-white/80',
                      )}
                    >
                      {item.label}
                      <ChevronDownIcon className="-rotate-90" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="w-1/2 border-l border-white/10 p-6">
                <p className="text-lg font-semibold">{activeItems[activeIndex]?.label}</p>
                <p className="mt-2 text-sm text-white/70">
                  {activeItems[activeIndex]?.description}
                </p>
                <Link
                  href={activeItems[activeIndex]?.href ?? '#'}
                  className="mt-4 inline-block text-sm font-medium text-teal-bright"
                >
                  Read More ↗
                </Link>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
