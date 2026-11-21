import type { Metadata } from 'next';

import s from '@/designs/v2/admin/admin.module.css';
import { Analytics } from '@/designs/v2/admin/Analytics';
import { requireAdmin } from '@/lib/cms/auth';

export const metadata: Metadata = { title: 'Analytics' };

export default async function Page() {
  await requireAdmin();
  return (
    <>
      <div className={s.head}>
        <div>
          <h1 className={s.title}>Website traffic</h1>
          <p className={s.sub}>
            Who is on the site now, how many people visited, where they came from, where they are
            and which page they landed on first. Pick a date range, then click any row to filter.
          </p>
        </div>
      </div>
      <Analytics />
    </>
  );
}
