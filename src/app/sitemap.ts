import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';
import { PROJECTS } from '@/content/data/projects';
import { ARTICLES } from '@/content/data/research';

/**
 * The sitemap, built from the same data the routes are built from, so a new
 * project or article appears here by existing rather than by being remembered.
 *
 * `/applications` and `/resources` are deliberately absent: both carry
 * `noIndex: true` in their metadata — one is an empty placeholder, the other
 * still has clone copy — and listing a page you have asked not to be indexed
 * is a contradiction a crawler reports back to you.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteConfig.url}${path}`;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url('/'), changeFrequency: 'monthly', priority: 1 },
    { url: url('/about'), changeFrequency: 'yearly', priority: 0.7 },
    { url: url('/contact'), changeFrequency: 'yearly', priority: 0.9 },
    { url: url('/engineering'), changeFrequency: 'yearly', priority: 0.8 },
    { url: url('/projects'), changeFrequency: 'monthly', priority: 0.8 },
    { url: url('/research'), changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/gallery'), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const projects: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: url(`/projects/${project.slug}`),
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  const articles: MetadataRoute.Sitemap = ARTICLES.map((article) => ({
    url: url(`/research/${article.slug}`),
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...projects, ...articles].map((entry) => ({
    lastModified: now,
    ...entry,
  }));
}
