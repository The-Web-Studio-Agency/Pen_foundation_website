import { EngineeringBody } from '@/features/engineering';
import { createMetadata } from '@/config/seo';

export const metadata = createMetadata({
  title: 'Engineering',
  description:
    'The anatomy of the PEN foundation system: precast node, galvanised sleeves, and driven helical nails — 20% of the concrete, no excavation, two-hour installation.',
  path: '/engineering',
  // Unlinked from the header and the footer until the page is ready for
  // visitors; listing it for a crawler while it is hidden from the site's own
  // navigation would be a contradiction. Drop this when it is relinked.
  noIndex: true,
});

export default function EngineeringPage() {
  return <EngineeringBody />;
}
