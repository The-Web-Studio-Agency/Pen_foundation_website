import {
  CertificateSection,
  DocumentsSection,
  FeaturedResourceGrid,
  ResourcesCarousel,
  TabbedAccordion,
  TestimonialSection,
  blogGrid,
  comparisonCarousel,
  exploreGrid,
  galleryCarousel,
  videoGrid,
} from '@/features/resources';
import { NotchedBand } from '@/components/shared/shapes/NotchedBand';
import { createMetadata } from '@/config/seo';
import { DIVIDER_NOTCH } from '@/lib/utils';
import { GridBeam } from '@/components/shared/backgrounds/GridBeam';

export const metadata = createMetadata({
  title: 'Resources',
  description:
    'Datasheets, videos, comparisons and answers to the questions engineers ask most about the PEN Foundation system.',
  path: '/resources',
  // TODO(content): drop this once the sections below carry PEN's own copy.
  // Until then the page must not be indexed — see the note in
  // features/resources/content.ts.
  noIndex: true,
});

/**
 * Resource library, split out of /contact so that page ends at "Other ways to
 * connect" and stays a single-purpose contact flow.
 *
 * The `contact-clone` class this shared with /contact is gone: its only rule
 * was an opt-out from a site-wide serif heading rule that no longer exists.
 * These sections were designed sans-serif and now simply inherit it.
 */
export default function ResourcesPage() {
  return (
    <div className="pt-nav">
      <FeaturedResourceGrid grid={videoGrid} lead />
      <FeaturedResourceGrid grid={exploreGrid} />

      {/* Decorative dark band, notched on both edges — the same divider that
          separated these blocks from the contact blocks on /contact. */}
      <NotchedBand
        height={192}
        dip={DIVIDER_NOTCH.dip}
        shoulder={DIVIDER_NOTCH.shoulder}
        run={DIVIDER_NOTCH.run}
        radius={DIVIDER_NOTCH.radius}
        edges={{ top: true, bottom: true }}
        className="my-0"
      >
        <div className="relative size-full bg-[var(--c-dark-green)]">
          <div aria-hidden className="bg-grid-canvas absolute inset-0 text-white/10 opacity-40" />
          <GridBeam duration={8} color="var(--color-teal-bright)" />
        </div>
      </NotchedBand>

      <ResourcesCarousel section={comparisonCarousel} />

      {/* Anchor targets for the header's Resources dropdown. Blogs and Gallery
          are previews: both read from the same records /research and /gallery
          render, and every card links through to the full route. */}
      <CertificateSection />
      <TabbedAccordion />
      <DocumentsSection />
      <FeaturedResourceGrid grid={blogGrid} id="blogs" />
      <ResourcesCarousel section={galleryCarousel} id="gallery" />

      <TestimonialSection />
    </div>
  );
}
