import type { Metadata } from 'next';

import s from '@/designs/v2/admin/admin.module.css';
import { SeoSiteForm } from '@/designs/v2/admin/SeoAdmin';
import { siteConfig } from '@/config/site';
import { requireSeo } from '@/lib/cms/auth';
import { seoSite } from '@/lib/seo/settings';

import { DomainCheck } from '../DomainCheck';

export const metadata: Metadata = { title: 'SEO · Verification & site' };

export default async function Page() {
  await requireSeo();
  return (
    <>
      <div className={s.head}>
        <div>
          <h1 className={s.title}>Verification &amp; site settings</h1>
          <p className={s.sub}>
            Prove ownership to Google, Bing, Meta and others, set the default share image, and the
            emergency switch that hides the whole site from search.
          </p>
        </div>
      </div>
      <DomainCheck />
      <SeoSiteForm initial={seoSite()} siteUrl={siteConfig.url} />
    </>
  );
}
