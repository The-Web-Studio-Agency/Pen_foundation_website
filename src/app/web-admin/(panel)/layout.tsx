import type { ReactNode } from 'react';

import { AdminNav } from '@/designs/v2/admin/AdminNav';
import s from '@/designs/v2/admin/admin.module.css';
import { requireAdmin } from '@/lib/cms/auth';
import { allOriginals } from '@/designs/v2/admin/registry';
import { readLeads, syncSeeds } from '@/lib/cms/server';

/** Every signed-in admin page: the sidebar and the work area. */
export default async function PanelLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();
  // Keep a copy of every section in the database, so it holds the whole site
  // (edited sections are never overwritten). Cheap: one bulk write.
  await syncSeeds(allOriginals()).catch((error: Error) =>
    console.error('[cms] Could not store the original content:', error.message),
  );
  const newLeads = (await readLeads()).filter((lead) => lead.status === 'new').length;
  return (
    <div className={s.shell}>
      <AdminNav user={user} newLeads={newLeads} />
      <main className={s.main}>{children}</main>
    </div>
  );
}
