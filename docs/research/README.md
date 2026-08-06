# Research

Reference material produced by the **clone repository**
(`/home/ridha/website-clone/website-clone/ai-website-cloner-template`).

## Rules

1. **Nothing here is ever imported by `src/`.** These are `.md` specs and
   screenshots, not modules. Enforced by `no-foreign-import` in
   `scripts/check-architecture.mjs` and by the `NO_DOCS` ESLint boundary.
2. **This is a record, not a spec to maintain.** Once a page has been ported and
   normalized, its research files are frozen. Do not update them to match later
   production changes — production code is the source of truth after intake.
3. **One folder per source host, one subfolder per page.**

```
docs/research/clones/<hostname>/<page>/
  PAGE_TOPOLOGY.md      section-by-section structure
  BEHAVIORS.md          interactions, scroll behavior, breakpoints
  components/*.spec.md  per-component specifications
  screens/              desktop / tablet / mobile reference screenshots
```

## Current contents

| Source | Page | Ported into |
| --- | --- | --- |
| `terminal-industries.com` | `contact` | `src/features/contact` |
| `terminal-industries.com` | `about` | `src/features/about` — research files were not transferred; only the implementation was |

See `docs/implementation/porting-a-cloned-page.md` for the intake procedure.
