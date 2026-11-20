import type { Metadata } from 'next';

import { CollectionIndexPage } from '@/designs/v2/admin/CollectionPages';

export const metadata: Metadata = { title: 'Blog articles' };

export default function Page() {
  return (
    <CollectionIndexPage
      id="blog.articles"
      base="/web-admin/blogs"
      title="Blog articles"
      intro="Write, edit and remove articles. Each one gets its own page at /blogs/…, and appears on the Blogs page."
    />
  );
}
