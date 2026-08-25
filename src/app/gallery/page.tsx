import { GalleryBody } from '@/features/gallery';
import { createMetadata } from '@/config/seo';
import ScrollAnimationText from '@/features/gallery/components/ScrollAnimationText';


export const metadata = createMetadata({
  title: 'Gallery',
  description:
    'The archive: site photography, installation sequences, and engineering documentation from PEN Foundation deployments.',
  path: '/gallery',
});

export default function GalleryPage() {
  return (
    <>
      <GalleryBody />
      {/* <ScrollAnimationText
        text="Transform your yard operations with real-time AI computer vision."
        highlightColor="#2fb7c4"
        className="max-w-2xl text-center text-3xl font-bold md:text-5xl"
      /> */}
    </>
  );
}
