import { createMetadata } from '@/config/seo';
import { GalleryPage } from '@/designs/v2/pages/gallery/GalleryPage';

export const metadata = createMetadata({
  title: 'Gallery',
  description:
    'The archive: site photography, installation sequences, and engineering documentation from PEN Foundation deployments.',
  path: '/gallery',
});

export default function Page() {
  return <GalleryPage />;
}
