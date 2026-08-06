import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

/**
 * Architecture boundaries are enforced here, not in review comments.
 * The dependency direction is one-way:
 *
 *   app/ → features/ → components/ → {content,config,constants,hooks,services} → lib/ → types/
 *
 * Anything pointing back up the chain is a defect. See docs/architecture/overview.md.
 */

/** Deep-importing a feature's internals couples callers to its file layout. */
const NO_FEATURE_DEEP_IMPORT = {
  group: ['@/features/*/*'],
  message: 'Import the feature barrel (@/features/<name>) instead of reaching into its internals.',
};

/** A feature owns its slice end to end; cross-feature reuse means "promote to shared". */
const NO_CROSS_FEATURE = {
  group: ['@/features/*', '@/features/*/**'],
  message:
    'A feature must not import another feature. Promote the shared part to src/components/shared or src/lib.',
};

/** Shared layers may never depend on a feature — that inverts the dependency direction. */
const NO_UPWARD_FEATURE = {
  group: ['@/features/**'],
  message:
    'Shared code must not depend on a feature. Move the shared part down, or keep it inside the feature.',
};

/** Quarantined clone output is never reachable from production code. */
const NO_PORTED = {
  group: ['**/_ported/**', '@/features/*/_ported/**'],
  message:
    '_ported/ is quarantine. Normalize the code out of it before importing — see docs/implementation/porting-a-cloned-page.md.',
};

/** docs/ is prose. It is never a module. */
const NO_DOCS = {
  group: ['**/docs/**', '@/docs/**'],
  message: 'docs/ is reference material and must never be imported by src/.',
};

/**
 * One motion system. Direct framer-motion access is restricted to its owners
 * (src/components/motion, src/lib/motion, src/providers). Wired into the
 * features block in Phase 7 — see docs/decisions/0004-single-motion-system.md.
 */
export const NO_RAW_MOTION = {
  group: ['framer-motion', 'motion/react'],
  message:
    'Use the motion system: @/components/motion wrappers or @/lib/motion presets. Direct framer-motion imports belong in src/components/motion and src/lib/motion only.',
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', '.archive/**', 'scripts/**']),

  // ---------------------------------------------------------------- baseline
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: [NO_FEATURE_DEEP_IMPORT, NO_PORTED, NO_DOCS] },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // ----------------------------------------------- features are self-contained
  // NOTE: flat-config rule options are last-wins per file, never merged — every
  // block that touches `no-restricted-imports` must repeat the patterns it still
  // wants enforced. NO_RAW_MOTION joins this list in Phase 7, once every consumer
  // has been moved onto the presets.
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [NO_CROSS_FEATURE, NO_PORTED, NO_DOCS] }],
    },
  },

  // ------------------------------------------- shared layers never point upward
  {
    files: [
      'src/components/**/*.{ts,tsx}',
      'src/lib/**/*.{ts,tsx}',
      'src/hooks/**/*.{ts,tsx}',
      'src/services/**/*.{ts,tsx}',
      'src/content/**/*.{ts,tsx}',
      'src/config/**/*.{ts,tsx}',
      'src/providers/**/*.{ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': ['error', { patterns: [NO_UPWARD_FEATURE, NO_PORTED, NO_DOCS] }],
    },
  },

  // ------------------------------------------------------- content is not UI
  {
    files: ['src/content/**/*.{ts,tsx}', 'src/config/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXElement',
          message: 'Content and config modules hold data only — no JSX. Render it in a component.',
        },
      ],
    },
  },
]);

export default eslintConfig;
