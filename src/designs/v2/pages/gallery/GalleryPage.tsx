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
};

/**
 * /gallery — the archive.
 *
 *   dark   hero
 *   black  every entry, filterable by category
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
      />

      <section className={cx(p.section, p.black)} aria-labelledby="gallery-title">
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
