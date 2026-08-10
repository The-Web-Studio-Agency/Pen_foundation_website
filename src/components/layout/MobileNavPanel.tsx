'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { duration, EASE_OUT_EXPO } from '@/lib/motion';
import { ChevronDownIcon, PhoneIcon } from '@/components/shared/icons';
import { navActions, type NavItem } from '@/config/navigation';

interface MobileNavPanelProps {
  id: string;
  items: NavItem[];
  /** Label of the expanded section, or null. One open at a time. */
  expanded: string | null;
  onToggleSection: (label: string) => void;
  /** Called after any navigation, so the panel closes behind the tap. */
  onNavigate: () => void;
  isCurrent: (href: string) => boolean;
  pathname: string;
  phone: string;
}

/**
 * The header's navigation below `lg`, where the desktop row cannot fit.
 *
 * Split out of `SiteHeader` rather than inlined because the two share almost no
 * markup: the desktop row is a single flex line with hover-driven mega menus,
 * this is a scrollable stack of tap-driven accordions. Trying to express both
 * with one set of responsive classes is what produced the original bug, where
 * the action buttons were laid out at x=417..693 inside a 358px pill and simply
 * rendered off-screen.
 *
 * It lives in `components/layout/` because it is site chrome; `arch:check`
 * RULE 4 keeps chrome out of feature folders, and the singleton patterns it
 * guards are `SiteHeader`/`SiteFooter` themselves, which this is not.
 */
export function MobileNavPanel({
  id,
  items,
  expanded,
  onToggleSection,
  onNavigate,
  isCurrent,
  pathname,
  phone,
}: MobileNavPanelProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: duration.fast, ease: EASE_OUT_EXPO }}
      /*
       * Capped to the space between the pill and the bottom of the screen, then
       * scrolled internally. `svh` rather than `vh` so a mobile URL bar that is
       * still on screen cannot push the CTAs below the fold — the one unit that
       * matters here, since the buttons are the point of the menu.
       */
      className="mt-2 max-h-[calc(100svh-9rem)] overflow-y-auto overscroll-contain rounded-lg bg-ink/95 text-white shadow-xl backdrop-blur-[30px] lg:hidden"
    >
      <nav aria-label="Primary" className="flex flex-col p-2">
        {items.map((item) =>
          item.items ? (
            <div key={item.label} className="border-b border-white/10 last:border-b-0">
              <button
                type="button"
                aria-expanded={expanded === item.label}
                aria-controls={`${id}-${item.label}`}
                onClick={() => onToggleSection(item.label)}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-4 py-3.5 text-left text-base transition-colors',
                  item.items.some((i) => isCurrent(i.href)) ? 'text-teal-bright' : 'text-white',
                )}
              >
                {item.label}
                <ChevronDownIcon
                  className={cn(
                    'size-4 transition-transform duration-200',
                    expanded === item.label && 'rotate-180',
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {expanded === item.label ? (
                  <motion.ul
                    id={`${id}-${item.label}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: duration.fast, ease: EASE_OUT_EXPO }}
                    className="overflow-hidden"
                  >
                    {item.items.map((sub) => (
                      <li key={sub.label}>
                        <Link
                          href={sub.href}
                          onClick={onNavigate}
                          className="block rounded-md py-2.5 pr-4 pl-8 text-sm text-white/75 transition-colors hover:text-white"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                ) : null}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              aria-current={pathname === item.href ? 'page' : undefined}
              className={cn(
                'rounded-md border-b border-white/10 px-4 py-3.5 text-base transition-colors last:border-b-0',
                // Matches the desktop row: a section stays lit on its detail
                // routes, and `isCurrent` returns false for `/` so Home does not.
                pathname === item.href || isCurrent(item.href)
                  ? 'text-teal-bright'
                  : 'text-white hover:text-white',
              )}
            >
              {item.label}
            </Link>
          ),
        )}
      </nav>

      {/*
       * The actions the broken layout pushed off-screen entirely.
       *
       * Stacked full-width on a phone, where thumb reach is the constraint and
       * a wide target is the point. From `sm` the panel is wide enough that
       * full-bleed buttons just look stretched, so they shrink to their content
       * and the phone number takes the free space on the left.
       */}
      <div className="flex flex-col gap-2 border-t border-white/10 p-4 sm:flex-row sm:items-center">
        <a
          href={`tel:${phone.replace(/\s+/g, '')}`}
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3.5 text-sm text-white/85 transition-colors hover:text-white sm:order-first sm:mr-auto sm:border-0 sm:px-0"
        >
          <PhoneIcon className="size-4" />
          {phone}
        </a>
        {navActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            onClick={onNavigate}
            className={cn(
              'rounded-lg px-6 py-3.5 text-center text-[11px] font-semibold tracking-wide uppercase transition-colors duration-300',
              action.emphasis === 'primary'
                ? // Matches the header's Contact button (#012c32). The panel is
                  // `bg-ink/95`, i.e. the same colour, so the ring is what makes
                  // the button visible at all here.
                  'bg-ink text-white ring-1 ring-white/20 ring-inset'
                : 'bg-white text-[#012c32] hover:bg-white/90',
            )}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
