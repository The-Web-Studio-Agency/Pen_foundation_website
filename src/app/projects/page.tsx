import { ProjectsBody } from '@/features/projects';
import { createMetadata } from '@/config/seo';

export const metadata = createMetadata({
  title: 'Projects',
  description:
    'Where PEN is already in the ground: residential, commercial, solar, and eco-resort foundations delivered with the pre-engineered nail system.',
  path: '/projects',
});

export default function ProjectsPage() {
  return <ProjectsBody />;
}
