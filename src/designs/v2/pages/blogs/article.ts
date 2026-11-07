import type { Article } from '@/content/data/research';

/**
 * The article records still carry template placeholders — "[Author]",
 * "[Date]", "see [citation]". Anything containing a bracketed token is
 * treated as not written yet and left off the page rather than shown to a
 * visitor. Fill the field in content/data/research.ts and it appears.
 */
const PLACEHOLDER = /\[[^\]]*\]/;

export function isWritten(value: string | undefined): value is string {
  return Boolean(value && value.trim() && !PLACEHOLDER.test(value));
}

export const blogHref = (slug: string) => `/blogs/${slug}`;

/** Anchor id for a body section, from its heading. */
export function sectionId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** The serialisable slice of an article a card needs (safe to pass to a client leaf). */
export interface ArticleCardData {
  slug: string;
  title: string;
  dek: string;
  category: Article['category'];
  readTime: string;
  cover: string;
}

export function toCard(a: Article): ArticleCardData {
  return {
    slug: a.slug,
    title: a.title,
    dek: a.dek,
    category: a.category,
    readTime: a.readTime,
    cover: a.cover,
  };
}
