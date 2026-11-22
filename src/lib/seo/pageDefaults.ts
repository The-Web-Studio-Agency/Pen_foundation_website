import { type PageDefaults, pageDefaults } from '@/config/seo';
import { sitePages, type SitePage } from '@/lib/seo/routes';

/**
 * Each public page's own title, description and share image — what shows
 * when the SEO team has not overridden it. Read by asking every page module
 * for its metadata (createMetadata records the defaults as it builds), so
 * this always matches the code and never needs keeping in step by hand.
 */

type MetaModule = {
  generateMetadata: (props: { params: Promise<{ slug: string }> }) => unknown;
};

const LOADERS: [RegExp, () => Promise<MetaModule>][] = [
  [/^\/$/, () => import('@/app/(site)/page')],
  [/^\/about$/, () => import('@/app/(site)/about/page')],
  [/^\/technology$/, () => import('@/app/(site)/technology/page')],
  [/^\/projects$/, () => import('@/app/(site)/projects/page')],
  [/^\/blogs$/, () => import('@/app/(site)/blogs/page')],
  [/^\/docs$/, () => import('@/app/(site)/docs/page')],
  [/^\/certifications$/, () => import('@/app/(site)/certifications/page')],
  [/^\/partners$/, () => import('@/app/(site)/partners/page')],
  [/^\/gallery$/, () => import('@/app/(site)/gallery/page')],
  [/^\/contact$/, () => import('@/app/(site)/contact/page')],
  [/^\/landing-page$/, () => import('@/app/landing-page/page')],
  [/^\/applications\/[^/]+$/, () => import('@/app/(site)/applications/[slug]/page')],
  [/^\/projects\/[^/]+$/, () => import('@/app/(site)/projects/[slug]/page')],
  [/^\/blogs\/[^/]+$/, () => import('@/app/(site)/blogs/[slug]/page')],
];

export interface PageRow extends SitePage {
  defaults: PageDefaults;
}

export async function pagesWithDefaults(): Promise<PageRow[]> {
  const pages = sitePages();
  await Promise.all(
    pages.map(async (p) => {
      const load = LOADERS.find(([pattern]) => pattern.test(p.path))?.[1];
      if (!load) return;
      const slug = p.path.split('/').pop() ?? '';
      try {
        await (await load()).generateMetadata({ params: Promise.resolve({ slug }) });
      } catch (error) {
        console.error(`[seo] Could not read the metadata of ${p.path}:`, error);
      }
    }),
  );
  return pages.map((p) => ({
    ...p,
    defaults: pageDefaults.get(p.path) ?? {
      title: '',
      description: '',
      image: '',
      noIndex: false,
    },
  }));
}
