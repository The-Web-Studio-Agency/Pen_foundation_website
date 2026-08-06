/**
 * Layout geometry shared between components and CSS.
 *
 * The `.bleed` utility in src/styles hardcoded `1700px` and `1.5rem` to match
 * Tailwind classes typed by hand in one component. When either side changed,
 * the full-bleed edge silently drifted. These are the canonical numbers; the
 * CSS reads them from the custom properties below.
 */

/** Widest content shell, in px. Mirrors `--shell-max` in styles/utilities. */
export const SHELL_MAX_WIDTH = 1700;

/** Standard page gutter at each breakpoint, in rem. Mirrors `--shell-pad`. */
export const SHELL_PADDING = {
  base: 1.5, // px-6
  lg: 3, // lg:px-12
} as const;

/** Narrower shell used by the marketing sections built on <Section>. */
export const SECTION_MAX_WIDTH = 1500;

/**
 * Space the fixed SiteHeader occupies, in rem: its 46px top offset plus the
 * 78px pill height. Mirrors the `--spacing-nav` token in styles.
 */
export const NAV_HEIGHT_REM = 7.75;

/** Distance from viewport top to the header pill, in px. */
export const HEADER_TOP_OFFSET = 46;

/** Height of the header pill itself, in px. */
export const HEADER_PILL_HEIGHT = 78;
