import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';
import { applications } from '@/content/data/homepage';
import { PROJECTS } from '@/content/data/projects';
import { ARTICLES } from '@/content/data/research';

/**
 * The sitemap, built from the same data the routes are built from, so a new
 * project, article or application appears here by existing rather than by
 * being remembered. It lists every page the navigation reaches.
 *
 * Absent on purpose: the redirecting addresses (/applications, /engineering,
 * /research, /resources, /home-v2 — see next.config.ts), which have no
 * document of their own.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteConfig.url}${path}`;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url('/'), changeFrequency: 'monthly', priority: 1 },
    { url: url('/about'), changeFrequency: 'yearly', priority: 0.7 },
    { url: url('/technology'), changeFrequency: 'yearly', priority: 0.8 },
    { url: url('/projects'), changeFrequency: 'monthly', priority: 0.8 },
    { url: url('/blogs'), changeFrequency: 'monthly', priority: 0.6 },
    { url: url('/docs'), changeFrequency: 'monthly', priority: 0.6 },
    { url: url('/certifications'), changeFrequency: 'yearly', priority: 0.6 },
    { url: url('/gallery'), changeFrequency: 'monthly', priority: 0.5 },
    { url: url('/contact'), changeFrequency: 'yearly', priority: 0.9 },
  ];

  const applicationRoutes: MetadataRoute.Sitemap = applications.items.map((item) => ({
    url: url(`/applications/${item.slug}`),
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  const projects: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: url(`/projects/${project.slug}`),
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  const articles: MetadataRoute.Sitemap = ARTICLES.map((article) => ({
    url: url(`/blogs/${article.slug}`),
    changeFrequency: 'yearly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...applicationRoutes, ...projects, ...articles].map((entry) => ({
    lastModified: now,
    ...entry,
  }));
}
