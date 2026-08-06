# ContactOptions Specification

## Overview
- **Target files:** `src/components/contact/ContactOptionsBanner.tsx`, `src/components/contact/ContactOptionsGrid.tsx`
- **Interaction model:** scroll-reveal (fade-up, staggered on grid cards); hover lift on cards

## Content (PEN's own, not Terminal's)

### Banner (datasheet-style CTA)
- Kicker: "Not ready to talk yet"
- Heading: "Get a one-page overview of the PEN system, sent straight to your inbox."
- Email field (Work email *) + button "SEND ME THE BRIEF"
- Right side: a lightweight in-CSS "document preview" card (not a real screenshot) — a small
  rounded frame showing PEN's own headline typography treatment ("The Pre-Engineered Nail
  Foundation System" + a couple of muted lines + a small diagram-style grid), built with existing
  `Media`-style placeholder conventions, not a fabricated brand asset.

### Grid — 4 cards, 2×2 on desktop, 1-col on mobile
1. (dark/primary card) "Download the Foundation Planning Guide" — icon: document icon, arrow-out icon top right, no description
2. (light card) "Ask our engineering team" — "Email us directly with soil conditions, load questions, or a site sketch — a real engineer replies." — mailto:info@cdisc.in
3. (light card) "Estimate your savings" — "See concrete and time saved versus poured footings for your project size." — links to `/engineering` (PEN's real ROI calculator route)
4. (light card) "Subscribe to updates" — email field + "SUBSCRIBE" button

## Computed styles (from reference, adapted)
- Banner container: `background: #f0f0f0`≈ PEN's `bg-paper-alt` (#eae7df) or `bg-paper-panel`
  (#e4e0d6) — use `paper-panel` (closer, warm neutral), `border-radius: 32px` → `rounded-[32px]`.
- Banner heading: `fontSize: ~44px`, `lineHeight: ~53px`, `fontWeight: 400` → use PEN's
  `Statement size="md"` component directly (`clamp(2rem,4.4vw,3.6rem)`).
- Grid cards: reference `border-radius: 20px`, bg `rgb(240,240,240)` light / dark variant. PEN:
  `rounded-[20px]`, light card `bg-paper-panel`, dark card `bg-gradient-to-b from-navy to-pen-dark
  text-white` (reuses the form card treatment for consistency).
  SIMPLIFIED: no puzzle-notch clip-path (see BEHAVIORS.md) — plain rounded corners.
- Card padding: ~40px (reference measured via screenshot proportions, not exact getComputedStyle
  — approximate `p-8 md:p-10`).
- Icon: 40px square, rounded-full bg tinted by card theme, centered glyph.
- Arrow-out button: 36px circle, top-right, `bg-black/5` light card / `bg-white/10` dark card,
  rotates 45deg + fills coral on hover.

## States & behaviors
- **Card hover:** `translateY(-4px)`, shadow grows (`shadow-lg`), transition 300ms ease. Arrow
  button background fills `coral`, icon color flips to white.
- **Scroll reveal:** each card fades+rises in with `staggerChildren: 0.08` (reuse `Reveal`/`Item`
  from `src/components/ui/ui.tsx`).
- **Email inputs:** underline-style (border-bottom only), consistent with `ContactForm.tsx`'s
  light-on-dark version but here light-on-light — `border-b border-ink/15 focus:border-teal`.

## Responsive
- Desktop (1440): banner 2-col (text/form left, mockup right); grid 2×2.
- Tablet (768): banner stacks (mockup below/hidden), grid stays 2×2 with tighter gap.
- Mobile (390): banner stacks, mockup hidden (`hidden md:block`); grid 1-col.
