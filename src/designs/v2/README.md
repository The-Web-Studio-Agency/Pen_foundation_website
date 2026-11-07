# v2: the site design

The PEN Foundation site's visual language, used on **every route**. It began as
the `/home-v2` homepage concept (that address now redirects to `/`).

The layout and interaction patterns are modelled on the homepage of
alethia.earth: a 3D hero that dives into a scroll-driven film, lime chips, mono labels, glass data cards,
a black "technology" chapter, a scattered photo collage, wide carousel cards and
a giant closing wordmark. **None of that site's copy, imagery, logo or code is
used.** Every word and picture here is PEN's own.

## How it is wired

1. **Chrome.** `src/components/layout/SiteChrome.tsx` renders the `.root`
   element (tokens + Geist), `SiteHeader`, `<main>`, `SiteFooter` and the
   `RevealController` for every route via `app/(site)/layout.tsx` (and the
   global 404). The header and footer live in `src/components/layout/` (the
   architecture check requires it) but are styled from `styles/nav.module.css`
   and `styles/closing.module.css` here.
2. **Navigation** is `primaryNav` in `src/config/navigation.ts`: Home, About,
   Technology, Applications ▾ (the six applications), Projects, Resources ▾
   (Blogs, Docs, Certifications, Gallery), Contact.
3. **Pages.** The homepage is `HomePage.tsx` + `components/*`. Every inner page
   lives in `pages/<name>/` and opens with the shared dark `components/page/PageHero`
   (the header's transparent top state is white type), then uses
   `components/page/SectionHead` and the grounds in `styles/page.module.css`.
4. **Styles.** CSS Modules only, scoped under `.root` and its `--hv2-*` tokens.
   Nothing in `app/globals.css` was added for it.
5. **Shared content, read-only.** Copy and figures are _imported_ from
   `src/content/data/*` and `src/config/*`, never rewritten. See `content.ts`.
6. **Assets.** `assets.ts` is the manifest; design-only artwork lives in
   `public/designs/v2/`.

## Layout

```
HomePage.tsx          the homepage's sections, in order
pages/<name>/         every inner page (about, technology, projects, applications, blogs, docs, certifications, gallery, contact)
content.ts            which existing copy each section shows + UI labels
assets.ts             every image/film path in one manifest
fonts.ts              Geist (sans, self-hosted), applied to the concept root only
components/
  page/PageHero       dark opening for every inner page
  page/SectionHead    chip + heading + lead
  opening/
    Opening           one pinned stage, two acts (see "The opening" below)
    PenCanvas         React Three Fiber scene: the model, satellites, glow, callouts
    useFilmScrub      maps scroll onto hero.mp4's currentTime
  scroll/
    useScrollProgress damped 0→1 progress for a pinned sizer, by subscription
  MediaStatement      full-bleed film + statement + hotspots
  Highlights          glass stat card + numbered <details> list
  Applications        six image cards, lime on hover, each to its page
  SystemChapter       black chapter: intro, anatomy, evidence, manifesto
  ProblemCollage      centred statement in a parallax photo collage
  Process             2×2 step cards
  ProjectsCarousel    wide snap-scroll project cards
  Validation          institution cards + supporter marquee
  FaqTabs             tablist + <details> accordion
  RevealController    one IntersectionObserver for all [data-reveal]
  CollageSpread       gathers the problem collage, then spreads it as the section pins
  LoopVideo           muted loop; plays only on screen, never under reduced motion
  primitives          Chip, ButtonLink, icons, cx()
styles/
  theme.module.css    tokens (--hv2-*), type scale, chip, button, reveal
  <section>.module.css  one per section
```

## The opening

Modelled on the reference's opening, which is one continuous scroll story. Here
it is one sticky stage inside a tall "sizer"; scroll progress across the sizer
drives two acts:

1. **3D act** (`ACT_SVH` of scroll). PEN's model floats centre stage with three
   smaller copies drifting around it. Lime pulses travel down the nails, which
   is the load leaving the node for the soil, and data callouts cycle over the
   parts. The model also follows the mouse. Scrolling fades the headline,
   rotates and grows the model, and brings in a centred statement. The camera
   then dives into the node while a widening circle reveals the film.
2. **Film act** (`SHOT_SVH` per shot). `hero.mp4` is scrubbed by scroll and never
   plays on its own. The six-beat script in `content/data/homepage.ts` was
   written against the film's six shots, and each beat's caption fades in over
   its shot. Shot one has no caption because its words are the page headline.

All overlay choreography is CSS reading two custom properties, `--ph` and
`--pf`, which `Opening.tsx` writes on the stage. The 3D scene reads the same
progress in its frame loop. Nothing re-renders while scrolling, and the canvas
stops drawing once the film covers it.

Reduced motion: no pin, no film. The model holds still under the headline.
Without WebGL, the copy stands on its own.

### The model

`public/designs/v2/pen-foundation.glb` is an optimised copy of the supplied
`public/media/3d/PENFOUNDATION.glb`. It has the same parts and names, and drops
from 11.8 MB to 2.4 MB. If the source model changes, re-run:

```bash
npx @gltf-transform/cli webp    PENFOUNDATION.glb a.glb --quality 82
npx @gltf-transform/cli prune   a.glb b.glb
npx @gltf-transform/cli meshopt b.glb pen-foundation.glb --level medium
```

`PenCanvas` finds parts by their exported names: `Centre Node`, `Bolts`, and the
nail meshes `Mesh14/15/18/19/22/23/26/27_n3d`. If a re-export renames them,
update `NAIL_MESHES` and the callout anchors there.

## Re-theming

The palette is a deep teal-green ground `#01282f` (sampled from the client's
C-DISC campaign artwork) with a warm yellow accent `#f7dc2e` (from the same
artwork's headline yellow). Change the tokens in `styles/theme.module.css`;
a few gradients and glass tints repeat the ground as rgba values in the
section modules. The 3D glow and rim-light colours
are set in `components/opening/PenCanvas.tsx`.

## Open items

- **Project imagery.** The live homepage paints project images at 12% opacity
  because some are visualisations rather than site photographs (see the
  `ProofProject.image` note in `src/types/homepage.ts`). The v2 design shows them
  full strength. Confirm which ones are real photos, or caption the renders.
- **Hotspot and callout positions** in `content.ts` were placed by eye on the
  current film and render. Re-check them if either asset changes.
