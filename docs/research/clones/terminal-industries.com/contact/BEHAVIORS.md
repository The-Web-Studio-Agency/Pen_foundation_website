# Behaviors & Measured Values

Captured via `getComputedStyle()` through Chrome MCP on the live reference page (desktop 1440px)
unless noted. Base ink/dark color across the reference is `rgb(5, 36, 36)` (#052424) — PEN's
closest existing token is `--color-navy: #023e49` / `--color-pen-dark: #0a1f24`, used throughout
instead of introducing a new color.

## Contact options — bento cards
- Card container found via DOM walk: `.contact-ways-card` — `background: rgb(240,240,240)`
  (light card), `border-radius: 20px`.
- Dark/primary variant: same radius, dark bg (`rgb(5,36,36)` equivalent → use `bg-navy`/`bg-pen-dark`).
- Reference achieves an interlocking "puzzle notch" between adjacent cards via a JS-generated
  `clip-path: polygon(...)` with ~40 points, recalculated per element width (responsive, script-
  driven). Too complex/fragile to reverse-engineer faithfully for a decorative flourish —
  SIMPLIFIED to plain `rounded-[20px]` cards with a hover lift (`translateY(-4px)` + shadow).
- Icon top-left, arrow-in-circle top-right (`↗`), rotates/fills on hover.

## Datasheet-style CTA banner
- Container: `background: rgb(240,240,240)`, `border-radius: 32px`.
- Heading: `fontSize: 43.94px`, `lineHeight: 52.73px`, `fontWeight: 400` → maps to PEN's
  `Statement size="md"` scale, close enough to reuse rather than hand a new clamp().

## Videos / resources cards
- 3-up grid, `gap` ~24px, card image aspect looked ~4:3, rounded corners ~16-20px, bottom-left
  gradient-scrim caption overlay on the media row cards (mirrored using PEN's `Media` component,
  which already renders a labelled placeholder frame — no gradient caption needed since there's
  no real photo/video to caption yet).

## Comparison carousel
- Card box (post clip): `width: 380px`, `height: ~514px`, `border-radius: 8px`, `overflow: hidden`.
- Parent is a plain horizontal flex/scroll row (`overflow-x` clipped by a wrapper, scrolled via
  JS on arrow click — not native scroll-snap markers found). Implementation: `overflow-x-auto`
  flex row + prev/next buttons that call `scrollBy()`.

## FAQ
- Confirmed via DOM inspection: **native `<details class="accordion-item">` /
  `<summary class="accordion-item__summary">`** — not a custom JS accordion. Summary text:
  `fontSize: 16px`, `fontWeight: 400`, `color: rgb(5,36,36)`.
- Icon: `+` rotates to `×` on open (CSS `transform: rotate()` on the marker, easiest done with a
  small SVG/plus-icon component rotated via `group-open:rotate-45`).
- Category pills: 4 pills, click swaps the entire visible question list (not filtered/hidden via
  CSS — separate content per category, confirmed by clicking "Value" and seeing 6 different
  questions than "Core Technology"'s 5). Active pill: light bg fill; inactive: muted text, no fill.
- INTERACTION MODEL: click-driven tabs (content swap) + click-driven accordion (native disclosure).
  Confirmed NOT scroll-driven — nothing changed while scrolling past this section.

## Final CTA / footer block
- Both sit on one continuous dark section (`rgb(5,36,36)` equivalent), separated only by a wavy
  top divider at the very start of the dark block (Resources section start). The divider is not a
  discoverable `<svg>` element (checked `document.querySelectorAll('svg')`, none matched a
  full-width wave shape) — likely a generated `clip-path` on the section itself. SIMPLIFIED to a
  hand-authored inline SVG wave (single smooth arc), which reads visually the same without
  needing to reverse-engineer a generated path.
- CTA heading is genuinely large — confirmed via computed style the underlying `<h1>` (hidden
  behind the visible page, used for the animated final-CTA heading text) is `fontSize: 85.98px`,
  `lineHeight: 81.68px`, `letterSpacing: -3.6px`, `color: rgb(255,255,255)`, `fontWeight: 400`.
  PEN equivalent: reuse `Statement size="xl"` scale (`clamp(3rem,8.5vw,9rem)`), same spirit.
- CTA button: dark/muted fill (`bg-white/10`-style), mono uppercase tracked label — same treatment
  already used for the disabled-submit state in `ContactForm.tsx`; reused here for visual
  consistency in an *active* (not disabled) styling.

## Global notes
- No smooth-scroll library detected (no `.lenis` / `.locomotive-scroll` class, native scroll-behavior).
- No scroll-snap containers found anywhere on the page.
- Nav is `position: fixed` with a frosted/translucent pill treatment — out of scope, not touched.
- Every scroll-reveal on the reference is a simple opacity+translateY fade-in triggered once per
  element on first viewport intersection — consistent with PEN's existing `whileInView` framer-
  motion convention already used site-wide (`Reveal`/`Item` in `src/components/ui/ui.tsx`), reused
  rather than inventing a new animation vocabulary.
