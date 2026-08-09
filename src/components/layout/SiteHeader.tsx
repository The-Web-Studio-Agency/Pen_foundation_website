'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { navActions, primaryNav } from '@/config/navigation';
import { ChevronDownIcon, PhoneIcon } from '@/components/shared/icons';
import { Logo } from '@/components/shared/icons/Logo';

const buttonBase =
  'rounded-lg px-8 py-3 text-[11px] font-semibold tracking-wide uppercase transition-colors duration-300';

/**
 * THE site header. One header, every route.
 *
 * Promoted from the About clone's floating pill, which was previously rendered
 * only by /about while every other route used a separate `SiteNav` — and
 * `SiteNav` early-returned null on /about so the two would not overlap. That
 * conditional is gone: there is only one header now, so there is nothing to
 * suppress.
 */
export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
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

  return (
    <header className="fixed inset-x-0 top-[46px] z-50 flex justify-center px-4">
      <div
        // Reference source says max-w-[820px], but this project's Suisse Intl
        // is wider than the Geist it was written against, which pushed the
        // action buttons outside the pill. Widened so the row fits.
        className="w-full max-w-[960px]"
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="inner flex h-[78px] items-center justify-between gap-6 rounded-lg bg-ink/30 px-6 backdrop-blur-[30px]">
          <Link
            href="/"
            aria-label="PEN Foundation — home"
            className="flex items-center gap-2 text-white"
          >
            <Logo className="h-9" priority />
          </Link>

          <nav aria-label="Primary" className="flex items-center gap-1">
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
                    pathname === item.href ? 'text-teal-bright' : 'text-white/90 hover:text-white',
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-3">
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
        </div>

        <AnimatePresence>
          {activeMenu ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-2 flex overflow-hidden rounded-lg bg-[#3a3d34] text-white shadow-xl"
            >
              <ul className="w-1/2 divide-y divide-white/10 py-2">
                {activeItems.map((item, i) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(i)}
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
