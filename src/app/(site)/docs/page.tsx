import { createMetadata } from '@/config/seo';
import { DocsPage } from '@/designs/v2/pages/documentation/DocsPage';

export function generateMetadata() {
  return createMetadata({
    title: 'Docs',
    description:
      'Technical documentation and downloads for the PEN Foundation system: the GRIHA certificate, with datasheets and guides to follow.',
    path: '/docs',
  });
}

export default function Page() {
  return <DocsPage />;
}
