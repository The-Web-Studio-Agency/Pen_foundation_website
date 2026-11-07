import { notFound } from 'next/navigation';

import { createMetadata } from '@/config/seo';
import { PROJECTS } from '@/content/data/projects';
import { CaseStudyPage, filled } from '@/designs/v2/pages/projects';

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};

  // A location still reading "[Region]" stays out of the title.
  const location = filled(project.location);
  return createMetadata({
    title: location ? `${project.name} — ${location}` : project.name,
    description: project.challenge,
    path: `/projects/${project.slug}`,
    type: 'article',
  });
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return <CaseStudyPage project={project} />;
}
