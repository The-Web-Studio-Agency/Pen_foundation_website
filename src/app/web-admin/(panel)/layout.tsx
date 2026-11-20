import type { ReactNode } from 'react';

import { AdminNav } from '@/designs/v2/admin/AdminNav';
import s from '@/designs/v2/admin/admin.module.css';
import { requireAdmin } from '@/lib/cms/auth';
import { readLeads } from '@/lib/cms/server';

/** Every signed-in admin page: the sidebar and the work area. */
export default async function PanelLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();
  const newLeads = readLeads().filter((lead) => lead.status === 'new').length;
  return (
    <div className={s.shell}>
      <AdminNav user={user} newLeads={newLeads} />
      <main className={s.main}>{children}</main>
    </div>
  );
}
