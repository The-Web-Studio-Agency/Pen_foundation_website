import type { ReactNode } from 'react';

import { AdminNav } from '@/designs/v2/admin/AdminNav';
import s from '@/designs/v2/admin/admin.module.css';
import { cx } from '@/designs/v2/components/primitives';
import { currentSession, requireAdmin } from '@/lib/cms/auth';
import { allOriginals } from '@/designs/v2/admin/registry';
import { databaseProblem, readLeads, syncSeeds } from '@/lib/cms/server';

/** Every signed-in admin page: the sidebar and the work area. */
export default async function PanelLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();
  const seo = (await currentSession())?.role === 'seo';

  // Without a working database every admin page would fail; say why instead.
  const problem = await databaseProblem();
  if (problem) {
    return (
      <div className={s.shell}>
        <AdminNav user={user} newLeads={0} seo={seo} />
        <main className={s.main}>
          <div className={s.head}>
            <div>
              <h1 className={s.title}>The database is not connected</h1>
              <p className={s.sub}>
                The website itself still works and shows its original content, but the admin cannot
                load or save anything until MongoDB answers.
              </p>
            </div>
          </div>
          <section className={cx(s.panel, s.error)} style={{ display: 'grid', gap: '0.75rem' }}>
            <b>{problem.reason}</b>
            <span>
              After fixing it in Atlas or in Vercel → Settings → Environment Variables, redeploy the
              site (changed variables only apply to a new deployment), then reload this page.
            </span>
            <code style={{ fontSize: '0.8125rem', wordBreak: 'break-word', opacity: 0.8 }}>
              {problem.detail}
            </code>
          </section>
        </main>
      </div>
    );
  }

  // Keep a copy of every section in the database, so it holds the whole site
  // (edited sections are never overwritten). Cheap: one bulk write.
  await syncSeeds(allOriginals()).catch((error: Error) =>
    console.error('[cms] Could not store the original content:', error.message),
  );
  const newLeads = (await readLeads().catch(() => [])).filter(
    (lead) => lead.status === 'new',
  ).length;
  return (
    <div className={s.shell}>
      <AdminNav user={user} newLeads={newLeads} seo={seo} />
      <main className={s.main}>{children}</main>
    </div>
  );
}
