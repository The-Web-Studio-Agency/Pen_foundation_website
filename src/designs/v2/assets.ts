/**
 * Every file the home-v2 concept shows, in one place.
 *
 * Two kinds of asset:
 *
 *   SHARED  PEN's own photography, film and logos under /public/media. These
 *           are referenced read-only, never copied — duplicating a 16 MB film
 *           to keep a folder "pure" would double the deploy for nothing. If the
 *           concept ever needs a different crop or grade, put the new file in
 *           the DESIGN folder below and repoint the entry here.
 *
 *   DESIGN  Artwork that exists only for this concept, under
 *           /public/designs/v2. Nothing on the live site uses them.
 *
 * Swapping a picture anywhere in the concept is an edit to this file.
 */

const DESIGN = '/designs/v2';

export const assets = {
  logo: { src: '/media/logos/pen-logo@2x.webp', width: 458, height: 363 },

  /** Rendered film: camera around the node on a dark stage. */
  heroFilm: {
    src: '/media/videos/hero.mp4',
    poster: '/media/images/homepage/hero-poster.webp',
  },

  /** Aerial of a plot set out for foundation points, Kerala. */
  siteFilm: {
    src: '/media/videos/capability-01.mp4',
    poster: '/media/images/homepage/capability-01-poster.webp',
  },

  /** An installed node with its nails in the ground, on site. */
  installFilm: {
    src: '/media/videos/capability-02.mp4',
    poster: '/media/images/homepage/capability-02-poster.webp',
  },

  /** Studio render of the node, on white. */
  productRender: {
    src: '/media/images/pen.png',
    alt: 'The PEN Foundation node: a precast concrete block with a bolted top plate and four galvanised steel nails splayed at a batter angle',
    width: 1547,
    height: 1017,
  },

  installedCloseUp: {
    src: '/media/images/homepage/pen-installed_image.png',
    alt: 'A PEN node installed at ground level, its nails driven into leaf-covered soil',
  },

  aerialSetOut: {
    src: '/media/images/storysection2.png',
    alt: 'Aerial view of a cleared plot set out with string lines, paddy fields either side',
  },

  frameOnNodes: {
    src: '/media/images/storysection3.png',
    alt: 'A timber-framed house raised on PEN nodes, their nails splayed into the ground beneath it',
  },

  structureRising: {
    src: '/media/images/storysection1.png',
    alt: 'Concrete columns and steel beams rising from a slab among palm trees',
  },

  brickHouse: {
    src: '/media/images/brick-house.png',
    alt: 'A steel and masonry structure standing on completed PEN foundations at a Kerala site',
  },

  excavation: {
    src: '/media/images/homepage/excavation-image.png',
    alt: 'A deep excavation with reinforcement cages, an excavator and a spoil truck on a building site',
  },

  /* ---- design-only artwork ---------------------------------------------- */

  /**
   * PEN's 3D model for the opening. An optimised copy of the supplied
   * /media/3d/PENFOUNDATION.glb (11.8 MB): textures re-encoded as WebP and
   * geometry meshopt-compressed with glTF-Transform → 2.4 MB, same parts and
   * names. Re-run the recipe in README.md if the source model changes.
   */
  penModel: { src: `${DESIGN}/pen-foundation.glb` },

  /** Soil-contour line drawing used as a card in the problem collage. */
  contours: { src: `${DESIGN}/soil-contours.svg`, alt: '' },
} as const;
