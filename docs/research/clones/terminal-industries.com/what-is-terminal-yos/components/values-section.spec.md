# ValuesSection Specification

Reverse-engineered from `https://terminal-industries.com/what-is-terminal-yos`,
section `<section class="solutions-value" aria-label="Our Value">`.

**Design reference only.** No Terminal Industries copy, imagery, logo or brand
colour is reproduced. The lime accent (`#ABFF02`) is replaced by PEN teal, the
three `mesh-N.png` renders are replaced by PEN's own line glyphs, and every
string is PEN Foundation's own sourced copy.

## Overview

- **Target files:** `src/components/values/*`
- **Reference shots:** `../reference/{desktop,tablet,mobile}-section-full.jpg`
- **Interaction model:** scroll-driven only. **No hover, click, focus or tab
  state exists** — verified by hovering the card and diffing every computed
  style (transform / boxShadow / backgroundColor / opacity / filter / borderColor
  / cursor were byte-identical before and after).

## DOM structure

```
section.solutions-value                     aria-label="Our Value"
└── div.solutions-value__inner              12-col grid ≥1024px, flex column below
    ├── div.solutions-value__content        grid-column: span 6; position: sticky
    │   ├── p.solutions-value__label.label-5      "Our Value"
    │   ├── header.animated-strong > h2.title-h2  per-character scroll reveal
    │   └── p.body-2                              intro paragraph
    └── div.solutions-value__cards          grid-column: span 6
        ├── svg.solutions-value__clip-svg   0×0, holds 3 <clipPath> defs
        └── div.solutions-value__cards-list flex column
            └── article.solutions-value__card  ×3
                └── div.solutions-value__card-wrapper
                    ├── div.solutions-value__card-inner   clip-path: url(#card-clip-path-N)
                    │   ├── div.solutions-value__card-top
                    │   │   ├── figure.solutions-value__card-media   (mesh render)
                    │   │   └── dl.solutions-value__card-proof-points
                    │   │       └── div.solutions-value__card-proof-point ×2
                    │   │           ├── dt.…-value   gradient-clipped number
                    │   │           └── dd.…-label
                    │   └── div.solutions-value__card-content
                    │       ├── h3.solutions-value__card-title
                    │       └── div > p > span        body copy
                    └── svg.solutions-value__card-border-animation  (absolute overlay)
```

Note the proof points are a real `<dl>`: `<dt>` carries the figure, `<dd>` the
label. That semantic is kept.

## Computed styles — desktop (≥1024px, measured at 1440×900)

### section

| property | value |
| --- | --- |
| padding | `8.75rem min(3.646vw, 93.3333px)` → 140px / 52.5px at 1440 |
| overflow | `visible` |
| position | `relative` |
| font-family | `SuisseIntl, sans-serif` |
| color | `#052424` (→ PEN `--c-dark-green` `#012c32`) |

### .solutions-value__inner

`display: grid; grid-template-columns: repeat(12, 1fr); column-gap: min(1.042vw, 26.6667px)`
(15.0048px at 1440). Measured 1335px wide, columns 97.5px.

### .solutions-value__content (left column)

- `grid-column: span 6`, `max-width: 55rem`, measured 660×276
- `position: sticky; top: calc(var(--svh, 1svh) * 20)` → **20svh** (180px at 900h)
- `align-self: flex-start`, `display: flex; flex-direction: column; gap: 1.5rem`
- Carries an additional JS parallax: `transform: translate(0%, -2.0793%)` — a
  small upward drift layered on top of the sticky.

| element | size | tracking | line-height | colour |
| --- | --- | --- | --- | --- |
| `.label-5` "Our Value" | `1.25rem` (20px) | `-0.0125rem` | `0.95` (19px) | `#c2c2c2` |
| `h2.title-h2` | `min(2.396vw, 61.3333px)` → 34.5px | `min(-0.024vw, -0.613333px)` | **`1.2`** (component overrides `.title-h2`'s 0.96) | see reveal below |
| `p.body-2` | `1.25rem` (20px) | `-0.01em` | `1.26` (25.2px) | `#052424` |

### .solutions-value__cards (right column)

`grid-column: span 6; padding-left: min(2.083vw, 53.3333px)` (30px at 1440);
`.solutions-value__cards-list { display: flex; flex-direction: column; gap: 3rem }`.

### .solutions-value__card-inner

| property | value |
| --- | --- |
| padding | `4rem 4.375rem` (64px / 70px) |
| display | `flex; flex-direction: column; gap: 1.5rem` |
| border-radius | `1.25rem` (20px) |
| overflow | `hidden` |
| clip-path | `url(#card-clip-path-N)` — one of three distinct silhouettes |
| background | **none** — the page background shows through |

Measured card box at 1440: 630×542 / 630×518 / 630×542.

### .solutions-value__card-top

`display: flex; flex-direction: row; gap: 3rem; align-items: flex-start`

- `figure.…-card-media`: `max-width: 16.5rem` (264px), `margin: 0`, `flex-shrink: 0`, 1:1
- `dl.…-proof-points`: `display: flex; flex-direction: column; gap: 1rem;
  justify-content: flex-start; width: auto; flex: 1 1 0`
- `div.…-proof-point`: `flex: 0 0 auto; display: flex; flex-direction: column; gap: 0.25rem`

| element | size | weight | notes |
| --- | --- | --- | --- |
| `dt.…-proof-point-value` | `2.25rem` (36px) | 500 | `background-image: linear-gradient(90deg, #64A002 0%, #ABFF02 100%)`; `background-clip: text; color: transparent`; `line-height: normal` |
| `dd.…-proof-point-label` | `1rem` | 400 | `color: var(--c-dark-green)`, `opacity: 0.7`, `letter-spacing: -0.01rem`, `line-height: 1.3` |

### .solutions-value__card-content

`display: flex; flex-direction: column; gap: 1rem; max-width: 32.5rem` (520px)

| element | size | weight | tracking | line-height | colour |
| --- | --- | --- | --- | --- | --- |
| `h3.…-card-title` | `1.875rem` (30px) | 400 | `-0.01875rem` | `1.25` | `#052424` |
| card copy `span` | `1rem` | 400 | `-0.0125rem` | `1.35` | `#7F7F7F` |

## Card geometry (the notched silhouette)

Two representations of one shape, both **fixed at every breakpoint**:

1. `<clipPath clipPathUnits="objectBoundingBox">` on `.card-inner` — scales with
   the card, so the notches stay proportional.
2. The border overlay `<svg viewBox="0 0 730 531" preserveAspectRatio="none">` —
   stretches to the card box.

Because `preserveAspectRatio="none"`, the corner radii distort with the card's
aspect ratio. That is the reference's own behaviour and is reproduced as-is.

**clipPath `d` (objectBoundingBox units):**

```
card 0: M0.984 0.001H0.326L0.275 0.045L0.275 0.045H0.016C0.008 0.045 0.001 0.055 0.001 0.067V0.37L0.029 0.411L0.029 0.411V0.706L0.029 0.706L0.001 0.751V0.977C0.001 0.989 0.008 0.999 0.016 0.999H0.984C0.992 0.999 0.999 0.989 0.999 0.977V0.412H0.999V0.023C0.999 0.011 0.992 0.001 0.984 0.001Z
card 1: M0.016 0.001H0.674L0.725 0.045L0.725 0.045H0.984C0.992 0.045 0.999 0.055 0.999 0.067V0.37L0.972 0.411L0.972 0.411V0.706L0.972 0.706L0.999 0.751V0.977C0.999 0.989 0.992 0.999 0.984 0.999H0.016C0.008 0.999 0.001 0.989 0.001 0.977V0.412H0.001V0.023C0.001 0.011 0.008 0.001 0.016 0.001Z
card 2: M0.999 0.977V0.492L0.967 0.415L0.967 0.415V0.023C0.967 0.011 0.96 0.001 0.952 0.001H0.458L0.428 0.043L0.428 0.043H0.214L0.214 0.043L0.181 0.001H0.016C0.008 0.001 0.001 0.011 0.001 0.023V0.978C0.001 0.989 0.008 0.999 0.016 0.999H0.182L0.428 0.999H0.984C0.992 0.999 0.999 0.989 0.999 0.977Z
```

**border `d` (viewBox 730×531 user units):**

```
card 0: M717.999 0.5H237.774L200.635 23.7734L200.513 23.8506H12C5.64876 23.8506 0.5 28.9993 0.5 35.3506V196.47L20.8203 218.169L20.9551 218.312V374.771L20.834 374.911L0.5 398.497V518.88C0.5 525.231 5.6487 530.38 12 530.38H718C724.351 530.38 729.5 525.231 729.5 518.88V218.51H729.499V12C729.499 5.64873 724.35 0.5 717.999 0.5Z
card 1: M12.001 0.5H492.226L529.365 23.7734L529.487 23.8506H718C724.351 23.8506 729.5 28.9993 729.5 35.3506V196.47L709.18 218.169L709.045 218.312V374.771L709.166 374.911L729.5 398.497V518.88C729.5 525.231 724.351 530.38 718 530.38H12C5.64873 530.38 0.5 525.231 0.5 518.88V218.51H0.500977V12C0.500977 5.64873 5.6497 0.5 12.001 0.5Z
card 2: M729.355 518.999V261.108L706.065 220.302L706 220.187V12C706 5.6487 700.851 0.5 694.5 0.5H334.501L312.799 22.8135L312.651 22.9648H156.132L155.987 22.8281L132.399 0.5H12C5.64888 0.5 0.500198 5.64887 0.5 12V519C0.5 525.351 5.6487 530.5 12 530.5H132.599L312.44 530.499H717.855C724.207 530.499 729.355 525.35 729.355 518.999Z
```

Measured path lengths: 2497.07 / 2497.17 / 2499.25 user units.

## States & behaviours

### 1. Border draw-on (scroll-triggered, plays once)

- **Trigger:** card enters the viewport.
- **Mechanism:** the static border path's `stroke-dasharray` animates its dash
  length 0 → full path length. Sampled mid-flight at
  `1687.45px, 811.902px` → `2380.16px, 117.008px` → `2497.07px, 0.1px`.
- **End state:** stays fully drawn; re-scrolling does not replay it.
- **Static border style:** `stroke: var(--c-dark-green); stroke-width: 1.5;
  stroke-opacity: 0.2`.

### 2. Travelling comet (continuous loop, always running)

Four elements ride the same border path together:

| element | style |
| --- | --- |
| trail | same `d`, `stroke: var(--c-lime)`, `stroke-width: 1.5`, `stroke-opacity: 0.8`, `stroke-linecap: round`, `filter: url(#glow)`, `stroke-dasharray: 24.97, 2472.2` |
| head | teardrop `path` filled `#ABFF02` at `fill-opacity: 0.6`, same glow filter, positioned by a `matrix()` transform recomputed per frame with auto-rotation |
| tick | `<line x1="0" y1="0" x2="12" y2="0">`, `stroke: var(--c-dark-green)`, `stroke-width: 1.5`, `stroke-linecap: round`, riding just ahead of the head |
| glow filter | `<feGaussianBlur stdDeviation="17">` |

- **Measured period:** `stroke-dashoffset` drifts at **305.9 px/s** over a
  ~2497px path → **≈8.16 s per lap**, linear, infinite, no pause.
  Confirmed by a wrap from `-2452.94` → `-14.83`.
- Overlay svg: `position: absolute; inset: 0; width/height: 100%; z-index: 999;
  pointer-events: none; overflow: visible`.

### 3. Heading character reveal (scroll-scrubbed)

`header.animated-strong` wraps `h2 > strong`, whose text is split into
`<span class="--char">` per character. `strong` sits at `--c-light-gray`
(`#c2c2c2`); each char is flipped to `--c-dark-green` by an inline
`style="color: var(--c-dark-green)"` as the heading scrubs through its scroll
range. Not a play-once fade — it tracks scroll position both ways.

### 4. Sticky left column

`position: sticky; top: 20svh` for the whole height of the cards column, plus a
small JS parallax drift (`translateY(-2.08%)` at the sampled position).

### 5. Smooth scrolling

`document.documentElement.className === "lenis"` — the page runs Lenis. PEN
already ships the Lenis CSS block in `globals.css`.

### Hover / focus / active

**None.** Verified by diff; no cursor change, no transition, nothing.

## Responsive behaviour

Single breakpoint: **1024px**.

| | ≥1024px | <1024px |
| --- | --- | --- |
| section padding | `8.75rem min(3.646vw, 93.3333px)` | `3.75rem 1.25rem` (60/20px) |
| inner | 12-col grid | `flex; flex-direction: column` |
| left column | `sticky`, `span 6`, `max-width: 55rem` | static, `margin-bottom: 3.75rem` |
| cards column | `span 6`, `padding-left: min(2.083vw, 53.3333px)` | full width, no padding |
| cards gap | `3rem` | `1.5rem` |
| card padding | `4rem 4.375rem` | `2.375rem` |
| card-top | `row`, `gap: 3rem`, `align-items: flex-start` | `column`, `gap: 1.5rem`, `align-items: center` |
| media | `max-width: 16.5rem` (264px), `margin: 0` | `max-width: 10.125rem` (162px), `margin: 0 auto` |
| proof points | `column`, `justify-content: flex-start`, `width: auto` | `row`, `flex-wrap: wrap`, `justify-content: center`, `width: 100%` |
| proof value | `2.25rem` | `1.75rem` |
| proof label | `1rem` | `0.75rem` |
| card title | `1.875rem` | `1.5rem` |
| `.label-5` | `1.25rem` | `1.0625rem` |

Measured card boxes: 1920→840×518 · 1440→630×542 · 1024→448×489 · 768→728×433 · 390→350×526.

## Assets

Terminal loads three Storyblok renders — `mesh-1.png`, `mesh-2.png`,
`mesh-3.png`, 1024² source, displayed at 264px (162px on mobile), a concentric
lime ring motif with radiating tick marks.

**Not reproduced.** These are Terminal brand assets. PEN's implementation draws
its own glyphs inline (`ValueGlyph.tsx`) on the 64-unit `currentColor` grid that
`src/components/homepage/Proof/ProjectGlyph.tsx` already established, so the
section inherits PEN's existing drawing language and ships no new binaries.

## Token mapping — reference → PEN

| reference | value | PEN token | value |
| --- | --- | --- | --- |
| `--c-lime` | `#abff02` | `--color-teal-bright` | `#2fb7c4` |
| gradient stop 1 | `#64A002` | `--color-teal` | `#057c86` |
| `--c-dark-green` | `#052424` | `--c-dark-green` | `#012c32` |
| `--c-light-gray` | `#c2c2c2` | `--c-light-gray` | `#c2c2c2` |
| `--c-dark-gray` | `#7f7f7f` | `--c-dark-gray` | `#7f7f7f` |
| `SuisseIntl` | — | `--font-suisse` | already self-hosted |

`.title-h2` and `.label-5`/`.body-2` were transcribed from this same reference
site into PEN's `globals.css` during the earlier port, so the heading scale is
already an exact match — `min(2.396vw, 61.3333px)` / `min(-0.024vw, -0.613333px)`
resolves to the measured 34.5px / −0.613px at 1440.
