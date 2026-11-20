import { GALLERY_ITEMS } from '@/content/data/gallery';

import { assets } from '../../assets';
import { PageHero } from '../../components/page/PageHero';
import { SectionHead } from '../../components/page/SectionHead';
import { cx } from '../../components/primitives';
import p from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import { isWritten } from '../blogs/article';
import { GalleryGrid, type GalleryTile } from './GalleryGrid';

/**
 * Archive entries are labels only — no picture is attached to any of them
 * yet. Where one of PEN's existing photographs is plainly the thing an entry
 * names, it is shown; every other entry renders as a labelled tile until its
 * photograph is supplied. Add an entry here (keyed by gallery id) to attach one.
 */
const PHOTOS: Partial<Record<string, { src: string; alt: string }>> = {
  // "Site overview, aerial" — the aerial of a plot set out for foundation points.
  g04: assets.aerialSetOut,
  /*
   * STAND-INS from PEN's existing imagery, chosen to match each label so the
   * gallery can be shown. Swap each for the entry's own photograph.
   */
  g01: {
    src: '/media/images/storysection3.png',
    alt: 'A timber-framed house raised on PEN nodes on a sloping plot',
  },
  g02: {
    src: '/media/images/homepage/capability-02-poster.webp',
    alt: 'A PEN precast node set on prepared ground, its nails splayed into the soil',
  },
  g03: {
    src: '/media/projects/black-langur/inst_2.jpg',
    alt: 'Installers in hard hats driving a nail pipe through a PEN node',
  },
  g05: {
    src: '/media/projects/black-langur/pl_dials.jpg',
    alt: 'Dial gauges set up on a plate load test rig in a test pit',
  },
  g08: {
    src: '/media/projects/black-langur/inst_3.jpg',
    alt: 'A crew working together to drive a PEN nail on site',
  },
  g09: {
    src: '/media/images/Tropical%20Prefab%20Lift%20in%20Progress.png',
    alt: 'A prefabricated cabin lifted into place beside a backwater, among palm trees',
  },
  g10: {
    src: '/media/projects/devagiri/install-crop.jpg',
    alt: 'A PEN node set into a cut in an existing floor, its nails driven into the soil',
  },
  g11: {
    src: '/media/images/ground-mounted-solar.jpeg',
    alt: 'A row of ground-mounted solar panels on a gravel bed',
  },
  g12: {
    src: '/media/images/homepage/capability-01-poster.webp',
    alt: 'Aerial view of a cleared site set out for foundation points',
  },
};

/**
 * /gallery — the archive.
 *
 *   dark   hero
 *   white  every entry, filterable by category
 *
 * Entries whose label is still a template placeholder ("[event]",
 * "[Award name], [year]") are left out until they are written.
 */
export function GalleryPage() {
  const tiles: GalleryTile[] = GALLERY_ITEMS.filter((item) => isWritten(item.label)).map(
    (item) => ({
      id: item.id,
      label: item.label,
      category: item.category,
      photo: PHOTOS[item.id],
    }),
  );
  // Photographed entries lead, so the one real picture takes the wide slot.
  tiles.sort((a, b) => Number(Boolean(b.photo)) - Number(Boolean(a.photo)));

  return (
    <>
      <PageHero
        kicker="Gallery"
        title="The archive"
        lead="Site photography, installation sequences, and engineering documentation from PEN Foundation deployments."
        facts={[
          { label: 'Entries', value: String(tiles.length) },
          { label: 'Categories', value: String(new Set(tiles.map((x) => x.category)).size) },
        ]}
        // STAND-IN photo from PEN's existing imagery; replace with this page's own.
        image={{
          src: '/media/projects/devagiri/aerial.jpg',
          alt: 'Aerial view of a campus building and its grounds',
        }}
      />

      <section className={cx(p.section, p.light)} aria-labelledby="gallery-title">
        <div className={t.gutter}>
          <SectionHead
            id="gallery-title"
            chip="On site"
            heading="Projects, installs and testing on site"
          />
          <GalleryGrid tiles={tiles} />
        </div>
      </section>
    </>
  );
}
