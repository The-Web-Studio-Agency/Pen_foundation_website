import type { Metadata } from 'next';

import s from '@/designs/v2/admin/admin.module.css';
import { LeadsTable } from '@/designs/v2/admin/LeadsTable';
import { requireAdmin } from '@/lib/cms/auth';
import { readLeads } from '@/lib/cms/server';

export const metadata: Metadata = { title: 'Leads' };

export default async function Page() {
  await requireAdmin();
  return (
    <>
      <div className={s.head}>
        <div>
          <h1 className={s.title}>Leads</h1>
          <p className={s.sub}>
            Every enquiry from the Contact, Partners and Landing page forms, newest first, with the
            ad that brought the visitor when there was one. Update the status as you follow up, or
            export to a spreadsheet.
          </p>
        </div>
      </div>
      <LeadsTable initial={readLeads()} />
    </>
  );
}
