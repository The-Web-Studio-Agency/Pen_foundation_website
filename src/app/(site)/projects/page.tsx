import { createMetadata } from '@/config/seo';
import { ProjectsPage } from '@/designs/v2/pages/projects';

export const metadata = createMetadata({
  title: 'Projects',
  description:
    'Where PEN is already in the ground: residential, commercial, solar, and eco-resort foundations delivered with the pre-engineered nail system.',
  path: '/projects',
});

/** /projects — see src/designs/v2/pages/projects/ProjectsPage.tsx. */
export default function Page() {
  return <ProjectsPage />;
}
