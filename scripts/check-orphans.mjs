#!/usr/bin/env node
/**
 * Reports modules under src/ that nothing imports.
 *
 * Orphans are how ~300 lines of the R3F film became invisible: unreachable but
 * still type-checked, still in review, still confusing every new developer.
 * This is a report, not a gate — some orphans are deliberate (route entries,
 * archived-but-kept work). It exits 0 unless --strict is passed.
 */

import { readFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src');
const STRICT = process.argv.includes('--strict');

/** Reachable by the framework, not by an import. */
const ENTRY_POINTS =
  /src\/app\/.*\/(page|layout|template|loading|error|not-found|route|sitemap|robots|opengraph-image|icon)\.(ts|tsx)$/;
const ROOT_ENTRIES = /src\/app\/(layout|page|not-found|error|sitemap|robots)\.(ts|tsx)$/;

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
    } else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      acc.push(full);
    }
  }
  return acc;
}

const files = await walk(SRC);

// Collect every import specifier in the tree.
const imported = new Set();
const IMPORT_RE = /(?:from\s+|import\s*\(\s*)['"]([^'"]+)['"]/g;

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  for (const match of src.matchAll(IMPORT_RE)) {
    const spec = match[1];
    let resolved;
    if (spec.startsWith('@/')) resolved = path.join(SRC, spec.slice(2));
    else if (spec.startsWith('.')) resolved = path.resolve(path.dirname(file), spec);
    else continue;
    // Record every plausible resolution — cheap and good enough for a report.
    for (const suffix of ['', '.ts', '.tsx', '/index.ts', '/index.tsx']) {
      imported.add(path.normalize(resolved + suffix));
    }
  }
}

const orphans = files.filter((file) => {
  const p = file.replace(/\\/g, '/');
  if (ENTRY_POINTS.test(p) || ROOT_ENTRIES.test(p)) return false;
  return !imported.has(path.normalize(file));
});

if (orphans.length === 0) {
  console.log(`✓ no orphaned modules (${files.length} files scanned)`);
  process.exit(0);
}

console.log(`\n${orphans.length} orphaned module(s) — nothing imports these:\n`);
for (const file of orphans) {
  const lines = readFileSync(file, 'utf8').split('\n').length;
  console.log(`  ${path.relative(ROOT, file)}  (${lines} lines)`);
}
console.log(
  '\nEither wire them up, or archive them under .archive/ with a note in docs/decisions/.\n',
);

process.exit(STRICT ? 1 : 0);
