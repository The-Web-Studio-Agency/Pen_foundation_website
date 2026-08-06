# ResourcesSection Specification

## Overview
- **Target files:** `src/components/contact/ResourcesSection.tsx`,
  `src/components/contact/ResourcesFieldRow.tsx`, `src/components/contact/ExploreMoreRow.tsx`,
  `src/components/contact/ComparisonCarousel.tsx`
- **Interaction model:** scroll-reveal on rows; click-driven horizontal-scroll carousel (arrow buttons)
- **Section bg:** dark, `bg-gradient-to-b from-navy to-pen-dark`, wavy top divider (hand-authored
  inline SVG arc, see BEHAVIORS.md), text `text-white` / `text-white/70` for muted copy.

## Content (real PEN content only — no fabricated media/videos)

### a. "See PEN in the field" row (replaces reference's Videos row)
- Kicker: "In the field" / Heading: "See the system in place"
- 3 cards using the existing `Media` placeholder component (label prop), NOT fake video players:
  1. label "SITE — WAYANAD, KERALA" → links to `/projects/kerala-hillside-residence`
  2. label "SITE — ALAPPUZHA, KERALA" → links to `/projects/backwater-eco-resort`
  3. label "SITE — SOLAR ARRAY 14" → links to `/projects/utility-solar-array-14`
- Below each: small mono caption + project name (from `projectsData.ts`, real data)

### b. "Explore more ways to get started" row
- Kicker: "Explore more ways to get started" / sub: "Choose the path that fits your timeline."
- 3 cards, each linking to REAL existing routes:
  1. tag "RESEARCH" — pulls `PROJECTS_RESEARCH[0]` i.e. "Why driven beats poured" excerpt/readTime
     from `researchData.ts` → `/research/why-driven-beats-poured`
  2. tag "CASE STUDY" — Hillside Residence summary → `/projects/kerala-hillside-residence`
  3. tag "APPLICATIONS" — generic copy "See which foundation type fits your site" → `/applications`

### c. "How PEN compares" carousel (condensed from reference's 10-card competitor carousel)
- Kicker: "How PEN compares" / heading: "Built different from the ground up"
- 3 cards (not 10), each: `Media` placeholder frame (16:9) + tag "COMPARISON" + title + 1-line
  excerpt:
  1. "PEN vs. Poured Concrete Footings" — excerpt drawn from `why-driven-beats-poured` article dek
  2. "PEN vs. Helical Piles" — short original 1-liner (installation speed / equipment access)
  3. "PEN vs. Traditional Strip Foundations" — short original 1-liner (concrete volume / cure time)
- Prev/next arrow buttons top-right of heading row, `overflow-x-auto` flex row scrolled via
  `scrollBy({left: ±cardWidth, behavior:'smooth'})`.

## Computed styles (from reference, adapted)
- Card image aspect: reference video cards ~4:3; comparison cards `width:380px height:~514px
  border-radius:8px` → PEN: comparison cards `w-[300px] md:w-[340px] aspect-[3/4] rounded-lg`.
- Section text on dark: headings `text-white`, body `text-white/70`, tag labels reuse PEN's
  `Mono` component style (`font-mono text-[10px] tracking-[0.3em] uppercase`).
- Row gap: `gap-6 md:gap-8`.

## States & behaviors
- **Card hover (explore/media rows):** slight `scale-[1.02]` on media frame, arrow icon (`→`)
  shifts right 4px, underline grows under title — transition 300ms.
- **Carousel arrows:** disabled state (opacity-30, cursor-not-allowed) at scroll start/end,
  computed from `scrollLeft` vs `scrollWidth`.
- **Scroll reveal:** rows fade+rise once on enter viewport (`viewport:{once:true, amount:0.2}`).

## Responsive
- Desktop (1440): 3-col rows; carousel shows ~3.5 cards.
- Tablet (768): rows 2-col wrap or horizontal-scroll for card rows; carousel ~2.2 cards visible.
- Mobile (390): rows stack 1-col (media/explore) or become horizontal-scroll snap rows; carousel
  ~1.1 cards visible, `snap-x snap-mandatory`.
