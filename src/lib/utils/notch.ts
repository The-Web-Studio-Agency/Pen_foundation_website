/**
 * The reference site cuts a rounded, trapezoidal "notch" out of card edges and
 * section edges. Two mechanisms are used, and both are reproduced here from the
 * geometry measured on the live page (see docs/research/clones/terminal-industries.com/contact/).
 */

/** Depth of the bite taken out of the edge, in px. */
const NOTCH_DEPTH = 25;
/** Half-width of the notch where it meets the edge. */
const NOTCH_HALF_OPENING = 78;
/** Half-width of the flat inner face at full depth. */
const NOTCH_HALF_FLAT = 54;

/**
 * The original approximates each rounded corner with five sampled points. Each
 * pair is [depth into the card, distance travelled along the edge], measured
 * from the start of the corner. The second corner mirrors these values, which
 * is why the published polygon is perfectly symmetric.
 */
const CORNER_SAMPLES: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [0.34, 2.79],
  [1.35, 5.15],
  [3.04, 7.09],
  [5.41, 8.6],
];

export type NotchEdge = 'left' | 'right' | 'top' | 'bottom';

export interface NotchOptions {
  /** Which edge the notch is cut into. */
  edge: NotchEdge;
  /**
   * Where the notch is centred along that edge, as a CSS length expression
   * resolved against the edge's own axis — e.g. `"50%"` or `"calc(30% + 92px)"`.
   */
  center?: string;
  depth?: number;
  halfOpening?: number;
  halfFlat?: number;
}

/** Builds `calc(<center> + <offset>px)`, collapsing the trivial cases. */
function along(center: string, offset: number): string {
  if (offset === 0) return center;
  const sign = offset > 0 ? '+' : '-';
  return `calc(${center} ${sign} ${Math.abs(offset)}px)`;
}

/**
 * Generates the `clip-path: polygon(...)` value used by the contact cards.
 *
 * The path traces the full rectangle, then walks into the chosen edge: out to
 * the opening, around the first rounded corner, across the flat inner face,
 * back around the mirrored corner, and out to the opening again.
 */
export function notchClipPath({
  edge,
  center = '50%',
  depth = NOTCH_DEPTH,
  halfOpening = NOTCH_HALF_OPENING,
  halfFlat = NOTCH_HALF_FLAT,
}: NotchOptions): string {
  // Offsets along the edge, paired with how deep the path has cut in, walking
  // from one opening to the other.
  const profile: Array<[number, number]> = [];

  for (const [cut, travelled] of CORNER_SAMPLES) {
    profile.push([halfOpening - travelled, cut]);
  }
  for (const [cut, travelled] of [...CORNER_SAMPLES].reverse()) {
    profile.push([halfFlat + travelled, depth - cut]);
  }
  // Mirror across the centre for the second half of the notch.
  const mirrored = [...profile]
    .reverse()
    .map(([offset, cut]) => [-offset, cut] as [number, number]);
  const full = [...profile, ...mirrored];

  // `a` runs along the edge, `d` runs into the shape.
  const point = (a: number, d: number): string => {
    const axis = along(center, a);
    switch (edge) {
      case 'left':
        return `${d}px ${axis}`;
      case 'right':
        return `calc(100% - ${d}px) ${axis}`;
      case 'top':
        return `${axis} ${d}px`;
      case 'bottom':
        return `${axis} calc(100% - ${d}px)`;
    }
  };

  // Corners of the rectangle, ordered so the walk arrives at the notched edge
  // last and leaves the shape closed.
  const frame: Record<NotchEdge, string[]> = {
    left: ['0 0', '100% 0', '100% 100%', '0 100%'],
    right: ['0 0', '100% 0', '100% 100%', '0 100%'],
    top: ['0 0'],
    bottom: ['0 0', '100% 0', '100% 100%'],
  };

  const points = [...frame[edge], ...full.map(([a, d]) => point(a, d))];

  // `top` and `right` need the remaining corners after the notch to close.
  if (edge === 'top') points.push('100% 0', '100% 100%', '0 100%');
  if (edge === 'bottom') points.push('0 100%');

  return `polygon(${points.join(', ')})`;
}

export interface SectionNotchOptions {
  width: number;
  height: number;
  /** How far the middle of the edge is pushed in from the outer corners. */
  dip: number;
  /** Distance from the outer corner at which the shoulder starts curving. */
  shoulder: number;
  /** Horizontal run of the diagonal between shoulder and flat. */
  run: number;
  radius: number;
  edges?: { top?: boolean; bottom?: boolean };
}

/**
 * Generates the SVG path used to clip whole sections — the shallow "shoulders"
 * at the far corners with a recessed middle, seen on the dark divider band and
 * the top of the footer. Mirrors the original's arc-based construction.
 */
export function sectionNotchPath({
  width,
  height,
  dip,
  shoulder,
  run,
  radius,
  edges = { top: true },
}: SectionNotchOptions): string {
  const w = width;
  const h = height;
  // The original insets the path by half a pixel so the clip does not alias
  // against the section's own edge.
  const o = 0.5;

  const rise = radius * 0.36;
  const parts: string[] = [];

  if (edges.top) {
    const flatStart = shoulder + run + rise * 0.8;
    parts.push(
      `M ${-o},${-o}`,
      `L ${shoulder},${-o}`,
      `A ${radius},${radius} 0 0 1 ${shoulder + rise},${dip * 0.18}`,
      `L ${shoulder + run},${dip * 0.82}`,
      `A ${radius},${radius} 0 0 0 ${flatStart},${dip}`,
      `L ${w - flatStart},${dip}`,
      `A ${radius},${radius} 0 0 0 ${w - shoulder - run},${dip * 0.82}`,
      `L ${w - shoulder - rise},${dip * 0.18}`,
      `A ${radius},${radius} 0 0 1 ${w - shoulder},${-o}`,
      `L ${w + o},${-o}`,
    );
  } else {
    parts.push(`M ${-o},${-o}`, `L ${w + o},${-o}`);
  }

  if (edges.bottom) {
    const flatStart = shoulder + run + rise * 0.8;
    parts.push(
      `L ${w + o},${h + o}`,
      `L ${w - shoulder},${h + o}`,
      `A ${radius},${radius} 0 0 1 ${w - shoulder - rise},${h - dip * 0.18}`,
      `L ${w - shoulder - run},${h - dip * 0.82}`,
      `A ${radius},${radius} 0 0 0 ${w - flatStart},${h - dip}`,
      `L ${flatStart},${h - dip}`,
      `A ${radius},${radius} 0 0 0 ${shoulder + run},${h - dip * 0.82}`,
      `L ${shoulder + rise},${h - dip * 0.18}`,
      `A ${radius},${radius} 0 0 1 ${shoulder},${h + o}`,
      `L ${-o},${h + o}`,
    );
  } else {
    parts.push(`L ${w + o},${h + o}`, `L ${-o},${h + o}`);
  }

  parts.push(`L ${-o},${-o}`);
  return parts.join(' ');
}

/** Geometry for the dark divider band, transcribed from the live page. */
export const DIVIDER_NOTCH = {
  dip: 60,
  shoulder: 54.31,
  run: 75,
  radius: 46.6,
} as const;

/** Geometry for the notched top edge of the site footer — wider and shallower. */
export const FOOTER_NOTCH = {
  dip: 30,
  shoulder: 201.44,
  run: 72,
  radius: 61,
} as const;
