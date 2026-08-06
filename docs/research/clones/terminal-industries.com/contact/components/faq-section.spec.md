# FAQSection Specification

## Overview
- **Target file:** `src/components/contact/FAQSection.tsx`
- **Interaction model:** click-driven category tabs (swap question set) + click-driven native
  `<details>/<summary>` accordion (confirmed on reference via DOM inspection — not a custom JS
  accordion, so implementing with native `<details>` is both accurate to source AND the simplest,
  most robust approach).
- **Section bg:** `bg-paper` (light, matches hero/form section), continues the light band before
  the page returns to dark for testimonial+CTA+footer.

## DOM structure
- 2-col grid: left = static title + description (`lg:col-span-1`), right = pills row + accordion
  list (`lg:col-span-2`).
- Pills: flex row, wraps on mobile.
- Accordion: list of `<details className="group border-b border-ink/10">` each containing
  `<summary>` (question + rotating `+`/`×` icon) and a `<div>` answer (padded, muted text).

## Content (original, PEN engineering domain — not Terminal's software Q&A)
- Heading: "FAQs" / sub: "Answers to what people ask before their first PEN install."
- Categories (pills): **Engineering**, **Cost & Value**, **Installation**, **Site Conditions**

### Engineering (default open category)
1. What is a pre-engineered nail foundation system? — answer: short, plain-language explainer.
2. How is this different from a poured concrete footing? — answer referencing driven vs poured.
3. How much load can a PEN node carry? — answer: depends on soil + node count, engineered per site.
4. Do I need a structural engineer to sign off? — answer: yes, PEN provides engineering docs for local approval.
5. Does PEN work on sloped or rocky sites? — answer: yes, cites hillside residence project.

### Cost & Value
1. How much concrete does PEN typically save? — cites 78-82% range from real project data.
2. What does installation cost compare to conventional footings?
3. Is PEN more expensive up front?
4. What's the long-term maintenance cost?
5. Does PEN reduce project timeline cost?
6. Is there a minimum project size?

### Installation
1. How long does a typical install take? — cites "2 hours" / "1 day, 6 units" from project data.
2. What equipment is required on site?
3. Can PEN be installed without heavy machinery access?
4. How many people does a crew need?
5. What happens in bad weather?

### Site Conditions
1. What soil types work with PEN?
2. Does a high water table rule it out? — cites backwater eco resort project (no dewatering needed).
3. What about tree roots or protected vegetation nearby?
4. Do you need a soil report before quoting?
5. Can PEN be used near existing structures?

## Computed styles (from reference, adapted)
- Question text: `fontSize:16px` → `text-base`, `fontWeight:400`, color `text-ink`.
- Row divider: `border-bottom` between items, light (`border-ink/10`).
- Pill (inactive): muted text, no fill, thin border (`border-ink/15 text-ink-soft`).
- Pill (active): filled light bg (`bg-paper-alt text-ink`), same radius as button (`rounded-full`
  or `rounded-lg` — reference used a soft rounded rect, use `rounded-lg px-5 py-2.5`).
- Answer text: muted (`text-ink-soft`), `text-sm md:text-base leading-relaxed`, padded top ~12px.

## States & behaviors
- **Tab click:** swaps `activeCategory` state → renders that category's question array; previous
  open `<details>` resets closed on category change (each category owns its own DOM).
- **Accordion open/close:** native `<details>` toggle; icon rotates 45deg via
  `group-open:rotate-45 transition-transform duration-300`; answer area uses a CSS grid-rows trick
  (`grid-rows-[0fr]` → `[1fr]` on `[&[open]]`) OR framer-motion `AnimatePresence` height animation
  — prefer the framer-motion approach for a smoother reveal consistent with rest of site, using a
  controlled `open` state per item instead of native `<details>` toggling directly (keeps the
  semantic tag but drives visibility via React state + `AnimatePresence`).
- **Scroll reveal:** whole section fades+rises once on enter viewport.

## Responsive
- Desktop (1440): 2-col as described, pills in one row.
- Tablet (768): still 2-col but tighter; pills may wrap to 2 rows.
- Mobile (390): stacks to 1-col (title block above accordion), pills wrap, horizontal scroll if needed.
