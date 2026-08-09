import { CARD_CLIP_PATHS } from './ValuesAnimations';

/**
 * The zero-sized `<svg>` that carries the cards' `clipPath` definitions.
 *
 * One element per section rather than one per card: a `clipPath` is referenced
 * by id, so three defs serve any number of cards, and keeping them in a single
 * hidden node means the cards themselves stay pure layout.
 *
 * Ids are namespaced by `prefix` (a `useId()` from the section) so two
 * instances of this section on one page cannot collide — the reference site has
 * exactly this bug latent in its hard-coded ids.
 */
export function ValuesBackground({ prefix }: { prefix: string }) {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden
      focusable="false"
      className="pointer-events-none absolute h-0 w-0"
    >
      <defs>
        {CARD_CLIP_PATHS.map((d, i) => (
          <clipPath key={i} id={`${prefix}-card-clip-${i}`} clipPathUnits="objectBoundingBox">
            <path d={d} />
          </clipPath>
        ))}
      </defs>
    </svg>
  );
}
