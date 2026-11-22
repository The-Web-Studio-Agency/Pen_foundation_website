import type { Metadata } from 'next';

import s from '@/designs/v2/admin/admin.module.css';
import { SeoFilesForm } from '@/designs/v2/admin/SeoAdmin';
import { siteConfig } from '@/config/site';
import { requireSeo } from '@/lib/cms/auth';
import { generatedLlms, generatedRobots, generatedSitemap } from '@/lib/seo/files';
import { seoFiles } from '@/lib/seo/settings';

import { DomainCheck } from '../DomainCheck';

export const metadata: Metadata = { title: 'SEO · Files' };

export default async function Page() {
  await requireSeo();
  return (
    <>
      <div className={s.head}>
        <div>
          <h1 className={s.title}>Files</h1>
          <p className={s.sub}>
            robots.txt, sitemap.xml and llms.txt, plus any other file a platform asks for on the
            website’s root: ads.txt, verification files, security.txt and so on.
          </p>
        </div>
      </div>
      <DomainCheck />
      <SeoFilesForm
        initial={seoFiles()}
        generated={{
          robots: generatedRobots(),
          sitemap: generatedSitemap(),
          llms: await generatedLlms(),
        }}
        siteUrl={siteConfig.url}
      />
    </>
  );
}
