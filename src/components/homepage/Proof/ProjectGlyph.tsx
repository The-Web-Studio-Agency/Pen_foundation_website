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

/** Dwelling: the house the foundation carries, on units set into the grade. */
function DwellingGlyph(props: GlyphProps) {
  return (
    <GlyphFrame {...props}>
      {/* Grade, with the gable standing on it. */}
      <path d="M4 30h56" />
      <path d="M16 30V15l16-9 16 9v15" />
      {/* Two units below it, each a cap plate on four battered legs. */}
      <path d="M9 36h14" />
      <path d="M12 36 8 57M15 36l-1 21M17 36l1 21M20 36l4 21" />
      <path d="M41 36h14" />
      <path d="M44 36l-4 21M47 36l-1 21M49 36l1 21M52 36l4 21" />
    </GlyphFrame>
  );
}

/** Remote: a long approach across empty ground to a single unit at the end. */
function RemoteGlyph(props: GlyphProps) {
  return (
    <GlyphFrame {...props}>
      {/* The track in, drawn as a broken run so the distance reads as distance
          rather than as a second grade line. */}
      <g opacity="0.45">
        <path d="M4 20h9M17 20h9M30 20h9" />
      </g>
      <path d="M4 26h56" />
      {/* The one unit at the end of the run, set toward the frame edge so the
          emptiness to its left is the subject. */}
      <path d="M43 32h16" />
      <path d="M46.5 32 43 57M51 32l-1 25M53 32l1 25M56.5 32 60 57" />
    </GlyphFrame>
  );
}

/**
 * Marks keyed by project name rather than by grid position, so reordering the
 * projects cannot hand a project the wrong drawing. A project with no entry
 * renders nothing at all — better a card without a mark than a card wearing
 * another site's section.
 *
 * Two keys were renamed with the projects themselves when the C-DISC content
 * handoff settled their public names — Devagiri Library → Devagiri College
 * Library, Startup EcoAshram → Startup Eco-Ashram. Because the lookup is by
 * name, a rename in the content module silently drops the drawing unless the
 * key moves with it; that is the failure this comment exists to prevent.
 */
const GLYPHS: Record<string, (props: GlyphProps) => React.ReactElement> = {
  'Black Langur Resort': RootsGlyph,
  'Startup Eco-Ashram': ArrayGlyph,
  'Devagiri College Library': RetrofitGlyph,
  'Bethel Residency': DwellingGlyph,
  'Bengaluru Farmhouse': RemoteGlyph,
};

export function ProjectGlyph({ name, className }: { name: string; className?: string }) {
  const Glyph = GLYPHS[name];
  return Glyph ? <Glyph className={className} /> : null;
}
