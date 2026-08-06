import { Article } from '@/features/research';
import { notFound } from 'next/navigation';

import { createMetadata } from '@/config/seo';
import { ARTICLES } from '@/content/data/research';

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};

  return createMetadata({
    title: article.title,
    description: article.dek,
    path: `/research/${article.slug}`,
    type: 'article',
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  return <Article article={article} />;
}
