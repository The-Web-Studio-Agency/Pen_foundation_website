import type { Metadata } from 'next';

import { CollectionItemPage } from '@/designs/v2/admin/CollectionPages';

export const metadata: Metadata = { title: 'Edit article' };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <CollectionItemPage
      id="blog.articles"
      base="/web-admin/blogs"
      title="Blog articles"
      slug={slug}
    />
  );
}
