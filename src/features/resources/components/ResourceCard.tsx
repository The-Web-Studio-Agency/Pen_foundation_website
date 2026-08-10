import { MediaCard } from '@/components/shared/cards/MediaCard';
import type { ResourceCard as ResourceCardData } from '@/types/contact';

/**
 * The resources card. Its markup now lives in `@/components/shared/cards`,
 * because the homepage needed the same card and `components/` may not import
 * from `features/` — see the note in MediaCard.
 *
 * Kept as a named component rather than deleted so the feature's two callers
 * (`FeaturedResourceGrid`, `ResourcesCarousel`) keep their local import and
 * their `ResourceCard` type. Rendering is identical.
 */
export function ResourceCard({
  card,
  as,
}: {
  card: ResourceCardData;
  as?: 'h2' | 'h3';
}) {
  return <MediaCard card={card} as={as} />;
}
