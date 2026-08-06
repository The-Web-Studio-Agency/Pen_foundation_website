import { createMetadata } from '@/config/seo';

export const metadata = createMetadata({
  title: 'Applications',
  description:
    'Where the PEN foundation system applies: residential, commercial, industrial, hospitality, and infrastructure construction.',
  path: '/applications',
  // Unbuilt placeholder — keep it out of the index until it has real content.
  noIndex: true,
});

export default function ApplicationsPage() {
  return <section className="min-h-screen w-full bg-paper" aria-hidden />;
}
