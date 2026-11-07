import { notFound } from 'next/navigation';

import { createMetadata } from '@/config/seo';
import { storyFor } from '@/content/data/case-studies';
import { PROJECTS } from '@/content/data/projects';
import { CaseStudyPage, filled, StoryPage } from '@/designs/v2/pages/projects';

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // A project with a full written story uses that story's own SEO copy.
  const story = storyFor(slug);
  if (story) {
    return createMetadata({
      title: story.seoTitle,
      description: story.seoDescription,
      path: `/projects/${story.slug}`,
      type: 'article',
      image: story.hero.image.src,
    });
  }

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
  const story = storyFor(slug);
  if (story) return <StoryPage story={story} />;

  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  return <CaseStudyPage project={project} />;
}
