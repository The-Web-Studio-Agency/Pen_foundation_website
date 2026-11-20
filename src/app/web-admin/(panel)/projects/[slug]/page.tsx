import type { Metadata } from 'next';

import { CollectionItemPage } from '@/designs/v2/admin/CollectionPages';

export const metadata: Metadata = { title: 'Edit project' };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <CollectionItemPage
      id="projects.list"
      base="/web-admin/projects"
      title="Projects"
      slug={slug}
    />
  );
}
