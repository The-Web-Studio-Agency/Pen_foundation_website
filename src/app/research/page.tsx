import { ResearchBody } from '@/features/research';
import { createMetadata } from '@/config/seo';

export const metadata = createMetadata({
  title: 'Research',
  description:
    'Engineering studies, field testing, and technical writing on driven-nail foundations, soil interaction, and the carbon cost of concrete.',
  path: '/research',
  // Unlinked from the header and the footer until the page is ready for
  // visitors; listing it for a crawler while it is hidden from the site's own
  // navigation would be a contradiction. Drop this when it is relinked.
  noIndex: true,
});

export default function ResearchPage() {
  return <ResearchBody />;
}
