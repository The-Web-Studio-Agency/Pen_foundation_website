import type { Metadata } from 'next';

import s from '@/designs/v2/admin/admin.module.css';
import { MediaLibrary } from '@/designs/v2/admin/MediaLibrary';
import { requireAdmin } from '@/lib/cms/auth';

export const metadata: Metadata = { title: 'Media library' };

export default async function Page() {
  await requireAdmin();
  return (
    <>
      <div className={s.head}>
        <div>
          <h1 className={s.title}>Media library</h1>
          <p className={s.sub}>
            Upload images, video and PDFs, then pick them in any section. Uploads are saved on this
            server and served from /uploads/…. The site’s own images are listed too and can be
            reused, but not deleted.
          </p>
        </div>
      </div>
      <MediaLibrary />
    </>
  );
}
