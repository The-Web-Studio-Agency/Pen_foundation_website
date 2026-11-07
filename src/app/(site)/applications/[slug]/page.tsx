import { notFound } from 'next/navigation';

import { createMetadata } from '@/config/seo';
import {
  ApplicationPage,
  applicationSlugs,
  findApplication,
} from '@/designs/v2/pages/applications';

export function generateStaticParams() {
  return applicationSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = findApplication(slug);
  if (!item) return {};

  return createMetadata({
    title: item.title,
    description: item.body,
    path: `/applications/${item.slug}`,
  });
}

/** /applications/[slug] — see src/designs/v2/pages/applications/ApplicationPage.tsx. */
export default async function ApplicationRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = findApplication(slug);
  if (!item) notFound();

  return <ApplicationPage item={item} />;
}
