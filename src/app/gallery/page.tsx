import { GalleryBody } from '@/features/gallery';
import { createMetadata } from '@/config/seo';

export const metadata = createMetadata({
  title: 'Gallery',
  description:
    'The archive: site photography, installation sequences, and engineering documentation from PEN Foundation deployments.',
  path: '/gallery',
});

export default function GalleryPage() {
  return <GalleryBody />;
}
