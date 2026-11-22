import type { MetadataRoute } from 'next';

import { applications } from '@/content/data/homepage';
import { PROJECTS } from '@/content/data/projects';
import { ARTICLES } from '@/content/data/research';

/**
 * Every public page, built from the same data the routes are built from, so
 * a new project, article or application appears by existing rather than by
 * being remembered. The sitemap lists these; the SEO admin edits them.
 */

type Freq = MetadataRoute.Sitemap[number]['changeFrequency'];

export interface SitePage {
  path: string;
  /** Which part of the site, for grouping in the SEO admin. */
  group: 'Main pages' | 'Applications' | 'Projects' | 'Blog articles' | 'Ads';
  changeFrequency: Freq;
  priority: number;
  /** In the sitemap. The ads landing page is not. */
  listed: boolean;
}

const page = (
  path: string,
  group: SitePage['group'],
  changeFrequency: Freq,
  priority: number,
  listed = true,
): SitePage => ({ path, group, changeFrequency, priority, listed });

export function sitePages(): SitePage[] {
  return [
    page('/', 'Main pages', 'monthly', 1),
    page('/about', 'Main pages', 'yearly', 0.7),
    page('/technology', 'Main pages', 'yearly', 0.8),
    page('/projects', 'Main pages', 'monthly', 0.8),
    page('/blogs', 'Main pages', 'monthly', 0.6),
    page('/docs', 'Main pages', 'monthly', 0.6),
    page('/certifications', 'Main pages', 'yearly', 0.6),
    page('/partners', 'Main pages', 'monthly', 0.6),
    page('/gallery', 'Main pages', 'monthly', 0.5),
    page('/contact', 'Main pages', 'yearly', 0.9),
    ...applications.items.map((item) =>
      page(`/applications/${item.slug}`, 'Applications', 'yearly', 0.7),
    ),
    ...PROJECTS.map((project) => page(`/projects/${project.slug}`, 'Projects', 'yearly', 0.6)),
    ...ARTICLES.map((article) => page(`/blogs/${article.slug}`, 'Blog articles', 'yearly', 0.5)),
    page('/landing-page', 'Ads', 'yearly', 0, false),
  ];
}
