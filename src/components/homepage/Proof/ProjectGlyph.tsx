import type { SVGProps } from 'react';

/**
 * The small technical mark at the top of each project card.
 *
 * Section drawings, not icons. Each one states the ground condition that made
 * the project hard — an occupied slab overhead, a live root spread, an array
 * repeated past the frame, a slope — with the PEN unit drawn into it: a cap
 * plate and four battered legs, which is the whole system in four strokes.
 * That is the only motif shared across all four, so the set reads as one
 * family and the difference between the drawings is the difference between
 * the sites.
 *
 * Drawn on a 64-unit grid, unfilled, `currentColor` throughout so the card
 * sets the colour once. Purely decorative: the card's text already names the
 * project and states the condition, so every mark is hidden from the
 * accessibility tree rather than given a redundant label.
 */

type GlyphProps = SVGProps<SVGSVGElement>;

function GlyphFrame({ children, ...props }: GlyphProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Retrofit: a hatched slab overhead, the unit driven in the space beneath it. */
function RetrofitGlyph(props: GlyphProps) {
  return (
    <GlyphFrame {...props}>
      {/* The existing structure, carried on hatching it does not lose. */}
      <path d="M4 17h56" />
      <g opacity="0.5">
        <path d="M9 17 5 11M18 17l-4-6M27 17l-4-6M36 17l-4-6M45 17l-4-6M54 17l-4-6" />
      </g>
      {/* Working clearance, then the cap plate and four battered legs. */}
      <path d="M20 32h24" />
      <path d="M24 32 17 57M29.5 32 27 57M34.5 32 37 57M40 32l7 25" />
    </GlyphFrame>
  );
}

/** Forest: a live root spread, with the unit threaded through a gap in it. */
function RootsGlyph(props: GlyphProps) {
  return (
    <GlyphFrame {...props}>
      {/* Grade line and the trunk standing on it. */}
      <path d="M4 21h56" />
      <path d="M40 21V7" />
      {/* Roots running out under grade, untouched. */}
      <g opacity="0.55">
        <path d="M40 21c-4 5-5 12-4 20M40 21c5 3 9 9 11 17M40 21c-9 3-14 7-17 13" />
      </g>
      {/* The unit set down in the one gap between roots. */}
      <path d="M6 33h16" />
      <path d="M9 33 5 55M13 33l-1 22M15 33l1 22M19 33l4 22" />
    </GlyphFrame>
  );
}

/** Scale: the same unit in plan, arrayed past the edge of the frame. */
function ArrayGlyph(props: GlyphProps) {
  const origins = [6, 22, 38, 54];
  return (
    <GlyphFrame {...props}>
      {origins.map((y) =>
        origins.map((x) => (
          // Plan view of one unit: the plate, with four legs to the corners.
          // The right-hand and bottom columns run under the frame edge, so the
          // array reads as continuing rather than as a counted sixteen.
          <g key={`${x}-${y}`} opacity={x === 54 || y === 54 ? 0.4 : 1}>
            <rect x={x} y={y} width="10" height="10" rx="1" />
            <path d={`M${x} ${y}l10 10M${x + 10} ${y}l-10 10`} opacity="0.55" />
          </g>
        )),
      )}
    </GlyphFrame>
  );
}

/** Slope: disturbed ground on a grade, with the unit battered square into it. */
function SlopeGlyph(props: GlyphProps) {
  return (
    <GlyphFrame {...props}>
      {/* The slope, hatched on the downhill side. */}
      <path d="M4 50 60 16" />
      <g opacity="0.5">
        <path d="M11 46v7M21 40v7M31 34v7M41 28v7M51 22v7" />
      </g>
      {/* Cap plate laid level on the grade, legs splayed below it. */}
      <path d="m22 27 15-9" />
      <path d="M25.5 25 22 50M30 22.5 30 50M33 20.5l6 28M36.5 18.5l11 25" />
    </GlyphFrame>
  );
}

/**
 * Marks keyed by project name rather than by grid position, so reordering the
 * projects cannot hand a project the wrong drawing. A project with no entry
 * renders nothing at all — better a card without a mark than a card wearing
 * another site's section.
 */
const GLYPHS: Record<string, (props: GlyphProps) => React.ReactElement> = {
  'Devagiri Library': RetrofitGlyph,
  'Black Langur Resort': RootsGlyph,
  'Startup EcoAshram': ArrayGlyph,
  'Rehabilitation Housing': SlopeGlyph,
};

export function ProjectGlyph({ name, className }: { name: string; className?: string }) {
  const Glyph = GLYPHS[name];
  return Glyph ? <Glyph className={className} /> : null;
}
