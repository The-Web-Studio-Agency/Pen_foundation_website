import type { Metadata } from 'next';

import s from '@/designs/v2/admin/admin.module.css';
import { SeoTrackingForm } from '@/designs/v2/admin/SeoAdmin';
import { requireSeo } from '@/lib/cms/auth';
import { seoTracking } from '@/lib/seo/settings';

export const metadata: Metadata = { title: 'SEO · Tracking & pixels' };

export default async function Page() {
  await requireSeo();
  return (
    <>
      <div className={s.head}>
        <div>
          <h1 className={s.title}>Tracking &amp; pixels</h1>
          <p className={s.sub}>
            Google Analytics, Tag Manager, Google Ads, Meta Pixel, Microsoft Clarity, LinkedIn and
            any other tag. Added to every public page as soon as you save.
          </p>
        </div>
      </div>
      <SeoTrackingForm initial={seoTracking()} />
    </>
  );
}
