import type { SVGProps } from 'react';

import type { ValueGlyphName } from '@/types/values';

/**
 * The technical mark at the top of each value card.
 *
 * The reference section fills this slot with a raster render; those are its
 * brand assets, so this draws PEN's own instead — on the same 64-unit,
 * unfilled, `currentColor` grid as `homepage/Proof/ProjectGlyph.tsx`, so the
 * two sets read as one drawing language rather than two.
 *
 * All three share a centred PEN node — a cap plate over four battered legs —
 * ringed by the load it spreads. What differs is what the rings are drawn
 * against: elapsed time, undisturbed strata, displaced volume. That is the
 * argument each card makes, so the drawing makes it too.
 *
 * Decorative throughout: the card's figures and copy already carry the meaning,
 * so every mark is hidden from the accessibility tree rather than labelled.
 */

type GlyphProps = SVGProps<SVGSVGElement>;

function GlyphFrame({ children, ...props }: GlyphProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
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

/** Cap plate and four battered legs — the system in five strokes. */
function PenNode() {
  return (
    <g>
      <path d="M25 30h14" />
      <path d="M27 30l-3.2 11M31 30l-1.4 11M33 30l1.4 11M37 30l3.2 11" />
    </g>
  );
}

/** Eight ticks on the outer ring, at the compass points. */
function RadialTicks({ inner = 27, outer = 30.5 }: { inner?: number; outer?: number }) {
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <g opacity={0.45}>
      {angles.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = Math.cos(rad);
        const y = Math.sin(rad);
        return (
          <path
            key={deg}
            d={`M${(32 + x * inner).toFixed(2)} ${(32 + y * inner).toFixed(2)}L${(32 + x * outer).toFixed(2)} ${(32 + y * outer).toFixed(2)}`}
          />
        );
      })}
    </g>
  );
}

/**
 * Speed — the load rings closed the moment the node was driven, so the ring
 * that would still be curing on a poured footing is drawn as a broken arc.
 */
function SpeedGlyph(props: GlyphProps) {
  return (
    <GlyphFrame {...props}>
      <circle cx="32" cy="32" r="9" opacity={0.9} />
      <circle cx="32" cy="32" r="15" opacity={0.7} />
      <circle cx="32" cy="32" r="21" opacity={0.5} />
      {/* The outermost ring is still open — the wait that PEN removes. */}
      <path d="M32 5.5a26.5 26.5 0 1 1-18.74 7.76" opacity={0.35} />
      <RadialTicks />
      <PenNode />
    </GlyphFrame>
  );
}

/**
 * Ground — the same rings laid over strata that run straight through the node,
 * because nothing was dug out to make room for it.
 */
function GroundGlyph(props: GlyphProps) {
  return (
    <GlyphFrame {...props}>
      <circle cx="32" cy="32" r="26.5" opacity={0.35} />
      <circle cx="32" cy="32" r="18" opacity={0.6} />
      {/* Strata, uninterrupted across the full width of the ring. */}
      <g opacity={0.55}>
        <path d="M8.5 20h47" />
        <path d="M6.5 32h51" />
        <path d="M8.5 44h47" />
        <path d="M13 51.5h38" />
      </g>
      <RadialTicks />
      <PenNode />
    </GlyphFrame>
  );
}

/**
 * Material — the volume a conventional footing occupies drawn as the outer
 * square, the volume PEN occupies as the node inside it.
 */
function MaterialGlyph(props: GlyphProps) {
  return (
    <GlyphFrame {...props}>
      <circle cx="32" cy="32" r="26.5" opacity={0.35} />
      {/* The displaced excavation, hatched — what is no longer poured. */}
      <path d="M13 13h38v38H13z" opacity={0.45} />
      <g opacity={0.25}>
        <path d="M13 25.7 25.7 13M13 38.3 38.3 13M13 51 51 13M25.7 51 51 25.7M38.3 51 51 38.3" />
      </g>
      <circle cx="32" cy="32" r="12" opacity={0.75} />
      <RadialTicks />
      <PenNode />
    </GlyphFrame>
  );
}

const GLYPHS: Record<ValueGlyphName, (props: GlyphProps) => React.ReactElement> = {
  speed: SpeedGlyph,
  ground: GroundGlyph,
  material: MaterialGlyph,
};

export function ValueGlyph({ name, ...props }: GlyphProps & { name: ValueGlyphName }) {
  const Glyph = GLYPHS[name];
  return <Glyph {...props} />;
}
