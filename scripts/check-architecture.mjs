#!/usr/bin/env node
/**
 * Architecture rules that ESLint cannot express.
 *
 * ESLint reasons about one file at a time, so it cannot see "there are two
 * footers" or "this repo still has a quarantine folder on main". Those are
 * repo-shaped invariants and they live here.
 *
 * Run: npm run arch:check   (part of `npm run check` and CI)
 */

import { readFileSync } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src');

const violations = [];
const fail = (rule, file, detail) => violations.push({ rule, file, detail });
const rel = (p) => path.relative(ROOT, p);

/** Every .ts/.tsx under a directory, skipping build output. */
async function walk(dir, acc = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', 'out', '.archive'].includes(entry.name)) continue;
      await walk(full, acc);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

const exists = async (p) => {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
};

// ---------------------------------------------------------------------------
// RULE 1 — no "use client" on a route entry point.
// A client page cannot export `metadata`, and it drags the whole subtree into
// the client bundle. The directive belongs on the smallest interactive leaf.
// ---------------------------------------------------------------------------
async function noClientPages(files) {
  const routeEntries = files.filter((f) =>
    /src\/app\/.*\/(page|layout|template)\.tsx$/.test(f.replace(/\\/g, '/')),
  );
  for (const file of routeEntries) {
    const src = readFileSync(file, 'utf8');
    if (/^\s*['"]use client['"]/m.test(src.split('\n').slice(0, 5).join('\n'))) {
      fail('no-client-route-entry', rel(file), 'Route entry points must stay Server Components.');
    }
  }
}

// ---------------------------------------------------------------------------
// RULE 2 — every page exports metadata (or generateMetadata).
// Missing metadata means the route inherits the root title. That is an SEO
// defect that is invisible until someone checks a search result.
// ---------------------------------------------------------------------------
async function everyPageHasMetadata(files) {
  const pages = files.filter((f) => /src\/app\/.*page\.tsx$/.test(f.replace(/\\/g, '/')));
  for (const file of pages) {
    const src = readFileSync(file, 'utf8');
    const hasMetadata =
      /export\s+const\s+metadata\b/.test(src) ||
      /export\s+(async\s+)?function\s+generateMetadata\b/.test(src);
    if (!hasMetadata) {
      fail(
        'page-requires-metadata',
        rel(file),
        'Add `export const metadata` or `generateMetadata`.',
      );
    }
  }
}

// ---------------------------------------------------------------------------
// RULE 3 — no orphan _ported/ quarantine folders.
// Quarantine is a staging area for a single PR. If it survives to main, raw
// clone output has entered production.
// ---------------------------------------------------------------------------
async function noOrphanQuarantine() {
  const found = [];
  async function scan(dir) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (['node_modules', '.next', 'out', '.archive'].includes(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.name === '_ported') found.push(full);
      else await scan(full);
    }
  }
  await scan(SRC);
  for (const dir of found) {
    fail(
      'no-orphan-quarantine',
      rel(dir),
      'Normalize and delete this folder before merging — see docs/implementation/porting-a-cloned-page.md.',
    );
  }
}

// ---------------------------------------------------------------------------
// RULE 4 — singleton modules. Exactly one of each of these may exist.
// Duplicate navigation and footers are how this codebase drifted the first
// time: four nav sources that already disagreed with each other.
// ---------------------------------------------------------------------------
const SINGLETONS = [
  { name: 'navigation source', pattern: /\/config\/navigation\.ts$/, expect: 1 },
  { name: 'site footer', pattern: /\/components\/layout\/SiteFooter\.tsx$/, expect: 1 },
  { name: 'site header', pattern: /\/components\/layout\/SiteHeader\.tsx$/, expect: 1 },
  { name: 'SEO factory', pattern: /\/config\/seo\.ts$/, expect: 1 },
  { name: 'app providers', pattern: /\/providers\/AppProviders\.tsx$/, expect: 1 },
];

/** Files whose name says "footer"/"nav" but which live outside components/layout. */
const CHROME_WORDS = /(footer|sitenav|navbar|header)/i;

async function singletonChrome(files) {
  for (const { name, pattern, expect } of SINGLETONS) {
    const matches = files.filter((f) => pattern.test(f.replace(/\\/g, '/')));
    if (matches.length > expect) {
      fail(
        'singleton-module',
        matches.map(rel).join(', '),
        `Expected exactly ${expect} ${name}, found ${matches.length}.`,
      );
    }
  }

  const strayChrome = files.filter((f) => {
    const p = f.replace(/\\/g, '/');
    const base = path.basename(p);
    if (!CHROME_WORDS.test(base)) return false;
    if (p.includes('/components/layout/')) return false;
    // A feature may legitimately own a section named e.g. FooterCta — only flag
    // components that look like site chrome.
    return /^(Site)?(Footer|Header|SiteNav|Navbar)\.tsx$/.test(base);
  });
  for (const file of strayChrome) {
    fail(
      'chrome-outside-layout',
      rel(file),
      'Site chrome lives in src/components/layout and is rendered by a route-group layout.',
    );
  }
}

// ---------------------------------------------------------------------------
// RULE 5 — no inline easing literals outside the motion system.
// A duplicated cubic-bezier is a design-system fork nobody notices.
// ---------------------------------------------------------------------------
const EASING_LITERAL = /(cubic-bezier\s*\(|ease:\s*\[|ease:\s*['"](?!linear\b))/;

async function noInlineEasing(files) {
  const owners = ['/lib/motion/', '/components/motion/', '/providers/'];
  for (const file of files) {
    const p = file.replace(/\\/g, '/');
    if (owners.some((o) => p.includes(o))) continue;
    const src = readFileSync(file, 'utf8');
    src.split('\n').forEach((line, i) => {
      if (EASING_LITERAL.test(line)) {
        fail(
          'no-inline-easing',
          `${rel(file)}:${i + 1}`,
          'Import an easing token from @/lib/motion.',
        );
      }
    });
  }
}

// ---------------------------------------------------------------------------
// RULE 6 — globals.css is an import orchestrator only.
// It is the file that silently absorbs every ported page's CSS. Capping it is
// what keeps route styles route-scoped.
// ---------------------------------------------------------------------------
async function globalsIsOrchestrator() {
  const candidates = [path.join(SRC, 'styles/globals.css'), path.join(SRC, 'app/globals.css')];
  for (const file of candidates) {
    if (!(await exists(file))) continue;
    if (!file.includes('styles/globals.css')) continue; // pre-Phase-9 location is exempt
    const meaningful = readFileSync(file, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('/*') && !l.startsWith('*') && !l.startsWith('//'));
    const nonImport = meaningful.filter((l) => !l.startsWith('@import'));
    if (nonImport.length > 0) {
      fail(
        'globals-orchestrator-only',
        rel(file),
        `globals.css must contain only @import statements — found ${nonImport.length} other line(s).`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// RULE 7 — docs/ and the clone repo are never imported by src/.
// ---------------------------------------------------------------------------
async function noForeignImports(files) {
  const BAD = /from\s+['"]([^'"]*(\.\.\/){2,}(docs|\.archive)\/|.*website-clone.*)['"]/;
  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    src.split('\n').forEach((line, i) => {
      if (BAD.test(line)) {
        fail(
          'no-foreign-import',
          `${rel(file)}:${i + 1}`,
          'src/ may not import from docs/, .archive/, or the clone repository.',
        );
      }
    });
  }
}

// ---------------------------------------------------------------------------

const files = await walk(SRC);

await noClientPages(files);
await everyPageHasMetadata(files);
await noOrphanQuarantine();
await singletonChrome(files);
await noInlineEasing(files);
await globalsIsOrchestrator();
await noForeignImports(files);

if (violations.length === 0) {
  console.log(`✓ architecture check passed (${files.length} files)`);
  process.exit(0);
}

const byRule = violations.reduce((acc, v) => {
  (acc[v.rule] ??= []).push(v);
  return acc;
}, {});

console.error(`\n✗ ${violations.length} architecture violation(s)\n`);
for (const [rule, items] of Object.entries(byRule)) {
  console.error(`  ${rule}`);
  for (const item of items) console.error(`    ${item.file}\n      ${item.detail}`);
  console.error('');
}
console.error('See docs/architecture/conventions.md for the reasoning behind each rule.\n');
process.exit(1);
