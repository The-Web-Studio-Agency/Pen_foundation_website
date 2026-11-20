import { GALLERY_ITEMS } from '@/content/data/gallery';

import { PageHero } from '../../components/page/PageHero';
import { SectionHead } from '../../components/page/SectionHead';
import { cx } from '../../components/primitives';
import p from '../../styles/page.module.css';
import t from '../../styles/theme.module.css';
import { isWritten } from '../blogs/article';
import { GalleryGrid, type GalleryTile } from './GalleryGrid';
import { galleryPageCopy, galleryPhotos } from '../pageCopy';

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
      photo: galleryPhotos[item.id],
    }),
  );
  // Photographed entries lead, so the one real picture takes the wide slot.
  tiles.sort((a, b) => Number(Boolean(b.photo)) - Number(Boolean(a.photo)));

  return (
    <>
      <PageHero
        kicker={galleryPageCopy.hero.kicker}
        title={galleryPageCopy.hero.title}
        lead={galleryPageCopy.hero.lead}
        facts={[
          { label: 'Entries', value: String(tiles.length) },
          { label: 'Categories', value: String(new Set(tiles.map((x) => x.category)).size) },
        ]}
        image={galleryPageCopy.hero.image}
      />

      <section className={cx(p.section, p.light)} aria-labelledby="gallery-title">
        <div className={t.gutter}>
          <SectionHead
            id="gallery-title"
            chip={galleryPageCopy.grid.chip}
            heading={galleryPageCopy.grid.heading}
          />
          <GalleryGrid tiles={tiles} />
        </div>
      </section>
    </>
  );
}
