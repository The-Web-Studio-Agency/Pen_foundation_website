import { createMetadata } from '@/config/seo';

export const metadata = createMetadata({
  title: 'Pre-Engineered Nail Foundation System',
  description:
    'PEN Foundation engineers driven-nail foundation systems as an alternative to poured concrete footings — less concrete, no cure time, engineered per site.',
  path: '/',
});

// Placeholder shell. The scroll-driven WebGL film that belongs here is still
// unbuilt; its geometry lives in src/components/three and is currently rendered
// only by /engineering. See docs/decisions/0006-homepage-film.md.
export default function HomePage() {
  return <section className="h-screen w-full" style={{ background: '#f5f0e6' }} aria-hidden />;
}
