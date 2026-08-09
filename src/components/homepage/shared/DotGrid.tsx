import { cn } from '@/lib/utils';

/**
 * The backdrop motif behind almost every section: a faint square grid with a
 * small "+" crosshair sitting on each intersection.
 *
 * The original draws it as a per-section inline SVG regenerated at the
 * container's exact size. Reproducing that machinery buys nothing, so this
 * tiles one SVG cell instead — the crosshair has to be a real shape, which is
 * why it is an SVG tile and not a pair of repeating gradients (a gradient can
 * only make a full-length bar, never a short tick).
 *
 * Pitch is 111px at desktop and 74px below it, both measured off the reference.
 */

/** Half-length of each crosshair arm, in px. */
const ARM = 5;
const CELL_MOBILE = 74;
const CELL_DESKTOP = 111;

function tile(cell: number, stroke: string, lineOpacity: number) {
  const mid = cell / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${cell}" height="${cell}" viewBox="0 0 ${cell} ${cell}">
<g stroke="${stroke}" stroke-width="1" fill="none" shape-rendering="crispEdges">
<path d="M0 ${mid}H${cell}M${mid} 0V${cell}" opacity="${lineOpacity}"/>
<path d="M${mid - ARM} ${mid}h${ARM * 2}M${mid} ${mid - ARM}v${ARM * 2}"/>
</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * Fades the motif out at the top and bottom edges, as the original does.
 *
 * The `black` stops are an alpha stencil, not a paint — this feeds
 * `mask-image`, where black means "keep". It is not part of the site palette
 * and must not be swapped for the site dark.
 */
const EDGE_MASK = 'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)';

export interface DotGridProps {
  /** Paints the light-on-dark variant used by the dark green sections. */
  onDark?: boolean;
  className?: string;
}

export function DotGrid({ onDark = false, className }: DotGridProps) {
  // Accent on the dark sections, ink on the light ones — the reference tints
  // the motif to whatever the section sits on.
  //
  // Literal hex, not var(--c-accent): this is interpolated into an inline SVG
  // data URI, which is a separate document and cannot see the host page's
  // custom properties. Keep in sync with --c-accent in globals.css.
  const stroke = onDark ? '#057c86' : '#012c32';
  const lineOpacity = onDark ? 0.18 : 0.12;
  const layer = {
    backgroundPosition: 'center',
    maskImage: EDGE_MASK,
    WebkitMaskImage: EDGE_MASK,
  };

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        onDark ? 'opacity-40' : 'opacity-25',
        className,
      )}
    >
      <div
        className="absolute inset-0 lg:hidden"
        style={{
          ...layer,
          backgroundImage: tile(CELL_MOBILE, stroke, lineOpacity),
        }}
      />
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          ...layer,
          backgroundImage: tile(CELL_DESKTOP, stroke, lineOpacity),
        }}
      />
    </div>
  );
}
