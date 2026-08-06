# Terminal Industries /contact — Page Topology

Reconnaissance of https://terminal-industries.com/contact, desktop 1440px. Purpose: drive a
full-page redesign of PEN Foundation's /contact route. All proprietary text/content is replaced
with PEN's own; only layout, spacing, interaction patterns, and visual polish are cloned.

## Section order (top to bottom)

1. **Nav** — global, fixed pill bar, translucent/blurred on scroll. OUT OF SCOPE (global layout, not touched).
2. **Hero** — big two-tone heading (accent word + muted rest, settles to solid dark on load), kicker line.
   Already implemented in prior session as `ContactHero.tsx`. Kept as-is.
3. **Contact form section** — 2-col: left info panel (headline, paragraph, bulleted next-steps with
   colored rail, trusted-by strip), right dark rounded form card w/ "or call" line.
   Already implemented as `ContactInfoPanel.tsx` + `ContactForm.tsx`. Kept, lightly polished.
4. **Contact options** (NEW) — light gray section, two parts:
   a. Datasheet-style CTA banner: rounded-32 light card, 2-col (headline+email capture left,
      document-preview mockup right).
   b. "Other ways to connect" bento grid — 2×2 cards (1 dark "primary", 3 light), icon + heading
      + optional description, hover lift. Reference uses a generated clip-path "puzzle notch" per
      card — SIMPLIFIED to clean rounded corners (see BEHAVIORS.md note).
5. **Resources section** (NEW) — dark section with wavy top divider, contains:
   a. "See PEN in the field" — 3-card media row using PEN's existing `Media` placeholder pattern
      (no real photos/videos exist in the project — do not fabricate; reuse the intentional
      placeholder-frame convention already established in `src/components/ui/ui.tsx`).
   b. "Explore more ways to get started" — 3-card row linking to REAL PEN routes: a research
      article, a project case study, and the applications page.
   c. "How PEN compares" — condensed horizontal-scroll carousel (3 cards, not 10), adapted from
      the reference's competitor-comparison carousel. Anchored on PEN's real research article
      "Why driven beats poured" plus two more real differentiators (vs. helical piles, vs. strip
      footings). Arrow-nav, click-driven horizontal scroll.
6. **FAQ section** (NEW) — left title/description (static), right category pills (click-driven,
   swaps entire question set) + native `<details>/<summary>` accordion (confirmed via
   `getComputedStyle` inspection — reference literally uses `<details class="accordion-item">`).
   Categories renamed to PEN's domain: Engineering, Cost & Value, Installation, Site Conditions.
7. **Testimonial strip** (NEW, small) — single featured quote card, 5-star mark, placeholder
   attribution (no fabricated named client). Sits just above the final CTA.
8. **Final CTA** (NEW) — dark section, wavy top divider (same dark bg as resources/footer — one
   continuous dark block through footer). Big heading reusing PEN's REAL existing tagline
   "Let's build on solid ground." (from `src/app/about/sections/Footer.tsx`) + single CTA button.
9. **Footer** (NEW, page-scoped — lives inside the contact page only, does not touch the shared
   `src/components/layout/Footer.tsx`, which is a global stub) — 3-column: Explore (real routes:
   Engineering, Applications, Projects), Company (About, Research, Gallery), Reach Us (real email
   `info@cdisc.in`; no phone number or social links exist anywhere in the codebase, so none are
   invented — omit rather than fabricate). Copyright line.

## Layout / z-index

- Single scrolling column, no sticky sidebars, no scroll-snap.
- Nav is `position: fixed`, translucent, sits above all page content (out of scope to touch).
- Sections 5–9 (Resources → Footer) form one continuous dark-background block; the wavy divider
  only appears once, at the top of the Resources section.

## Interaction model per section

| Section | Model |
|---|---|
| Hero | load-in fade/rise (already implemented) |
| Contact form | scroll-reveal fade/slide; submit button validity-driven (already implemented) |
| Contact options | scroll-reveal fade-up per card, staggered; hover lift+shadow on cards |
| Resources — media row | scroll-reveal fade-up, hover scale on frame |
| Resources — explore cards | scroll-reveal fade-up; hover underline/arrow shift |
| Resources — comparison carousel | click-driven horizontal scroll via prev/next arrow buttons |
| FAQ | click-driven category tabs (swap content) + click-driven accordion (native `<details>`) |
| Testimonial | scroll-reveal fade |
| Final CTA | scroll-reveal fade; button hover |
| Footer | static, link hover-color only |

## Responsive

- Desktop (1440): as described above, multi-column grids.
- Tablet (768): 2-col grids collapse to 1-col; comparison carousel still horizontal-scroll.
- Mobile (390): all grids single-column; FAQ pills wrap to 2 rows; carousel cards ~85vw wide.
