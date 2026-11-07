import { notFound } from 'next/navigation';

import { createMetadata } from '@/config/seo';
import { ARTICLES } from '@/content/data/research';
import { ArticlePage } from '@/designs/v2/pages/blogs/ArticlePage';

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
    path: `/blogs/${article.slug}`,
    type: 'article',
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  return <ArticlePage article={article} />;
}
