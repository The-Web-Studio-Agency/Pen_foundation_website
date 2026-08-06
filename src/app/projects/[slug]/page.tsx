import { CaseStudy } from '@/features/projects';
import { notFound } from 'next/navigation';

import { createMetadata } from '@/config/seo';
import { PROJECTS } from '@/content/data/projects';

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};

  return createMetadata({
    title: `${project.name} — ${project.location}`,
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

  return <CaseStudy project={project} />;
}
