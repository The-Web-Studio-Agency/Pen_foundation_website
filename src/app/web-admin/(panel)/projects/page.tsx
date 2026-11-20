import type { Metadata } from 'next';

import { CollectionIndexPage } from '@/designs/v2/admin/CollectionPages';

export const metadata: Metadata = { title: 'Projects' };

export default function Page() {
  return (
    <CollectionIndexPage
      id="projects.list"
      base="/web-admin/projects"
      title="Projects"
      intro="Add, edit and remove projects. Each one gets its own case-study page at /projects/…, and appears on the Projects page. Black Langur and Devagiri also have long-form stories under Page content › Projects."
    />
  );
}
