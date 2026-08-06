# PEN Foundation

Product site for the PEN (Pre-Engineered Nail) Foundation system.

## Stack

- Next.js (App Router) · TypeScript
- React Three Fiber + drei (3D model viewer on `/technology`)
- Framer Motion (interactive/animated sections)
- Tailwind CSS v4 (CSS-first `@theme` tokens in `app/globals.css`)

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
```

> Note: `next dev` (Turbopack) can crash if the project directory is also used as
> the system `TMPDIR` (stray socket files break the file watcher). If that
> happens, use `npm run build && npm start` instead.

## Structure

```
app/                       Next routes (App Router)
  page.tsx                   Homepage (placeholder)
  about/ contact/ gallery/   Route segments, each backed by a components/<name>/*Body.tsx
  journal/ projects/         Route segments with [slug] detail pages
  technology/                 3D model viewer + spec sheet
components/
  home/
    ui.tsx                    Shared section primitives (Scene, Kicker, Statement, ...)
    sections/S14_Calculator.tsx  Load calculator, used on /technology
  hero/
    experience/PenSystem.tsx   3D precast node + nail geometry (R3F), used by PenModelViewer
    lib/progressStore.ts       Frame-shared scroll progress store
    lib/story.ts                Nail geometry + phase constants
  technology/                PenModelViewer.tsx wraps PenSystem in a standalone R3F canvas
  about/ contact/ gallery/ journal/ projects/   Per-route body components + data
  layout/SiteNav.tsx         Persistent nav (hidden on the homepage)
```

## Architecture notes

- The homepage was previously a full scroll-driven WebGL film + 18-section
  editorial body; that has been stripped back to a placeholder. The surviving
  pieces (`components/hero/experience/PenSystem.tsx`, `lib/progressStore.ts`,
  `lib/story.ts`, `components/home/ui.tsx`, `S14_Calculator.tsx`) are kept
  because `/technology` still depends on them for its 3D model viewer and
  load calculator.
