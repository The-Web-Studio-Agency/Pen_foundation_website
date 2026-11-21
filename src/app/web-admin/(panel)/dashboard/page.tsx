import type { Metadata } from 'next';
import Link from 'next/link';

import s from '@/designs/v2/admin/admin.module.css';
import { ENTRIES } from '@/designs/v2/admin/registry';
import { cx } from '@/designs/v2/components/primitives';
import { analyticsEnabled, live, summary } from '@/lib/cms/analytics';
import { requireAdmin } from '@/lib/cms/auth';
import { allContent, listMedia, readContent, readLeads } from '@/lib/cms/server';
import { ARTICLES } from '@/content/data/research';
import { PROJECTS } from '@/content/data/projects';

export const metadata: Metadata = { title: 'Dashboard' };

/** Leads received in the last seven days (a request-time read, not a render value). */
function thisWeek(dates: string[]) {
  const since = Date.now() - 7 * 86400_000;
  return dates.filter((d) => new Date(d).getTime() > since).length;
}

/** Live visitors and today / this week, or nothing without the database. */
async function traffic() {
  if (!analyticsEnabled()) return [];
  try {
    const [periods, now] = await Promise.all([summary(), live()]);
    return [
      { label: 'On the website now', value: now.count, href: '/web-admin/analytics' },
      ...periods.slice(0, 3).map((p) => ({
        label: `Visitors ${p.label.toLowerCase()}`,
        value: p.visitors.toLocaleString('en-IN'),
        href: '/web-admin/analytics',
      })),
    ];
  } catch {
    return [];
  }
}

export default async function Page() {
  const user = await requireAdmin();
  const leads = await readLeads();
  const edited = Object.keys(allContent());
  const uploads = (await listMedia()).filter((m) => m.uploaded).length;
  const recentlyEdited = ENTRIES.filter((e) => readContent(e.id) !== undefined).slice(0, 6);

  const stats = [
    ...(await traffic()),
    { label: 'Leads, all time', value: leads.length, href: '/web-admin/leads' },
    {
      label: 'New leads this week',
      value: thisWeek(leads.map((l) => l.createdAt)),
      href: '/web-admin/leads',
    },
    { label: 'Blog articles', value: ARTICLES.length, href: '/web-admin/blogs' },
    { label: 'Projects', value: PROJECTS.length, href: '/web-admin/projects' },
    {
      label: 'Sections edited',
      value: `${edited.length} / ${ENTRIES.length}`,
      href: '/web-admin/content',
    },
    { label: 'Uploaded files', value: uploads, href: '/web-admin/media' },
  ];

  return (
    <>
      <div className={s.head}>
        <div>
          <h1 className={s.title}>Welcome back, {user}</h1>
          <p className={s.sub}>
            Edit any page of the website, publish articles and projects, and follow up on enquiries.
          </p>
        </div>
        <div className={s.headActions}>
          <Link href="/web-admin/blogs/new" className={cx(s.btn, s.secondary)}>
            New article
          </Link>
          <Link href="/web-admin/projects/new" className={cx(s.btn, s.secondary)}>
            New project
          </Link>
          <Link href="/web-admin/content" className={cx(s.btn, s.primary)}>
            Edit page content
          </Link>
        </div>
      </div>

      <div className={s.stats}>
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className={cx(s.panel, s.stat)}>
            <span className={s.statValue}>{stat.value}</span>
            <span className={s.statLabel}>{stat.label}</span>
          </Link>
        ))}
      </div>

      <div className={s.grid2}>
        <section className={s.panel}>
          <h2 className={s.panelTitle}>Latest enquiries</h2>
          {leads.length === 0 ? (
            <p className={s.muted}>
              No enquiries yet. They appear here as soon as someone sends a form.
            </p>
          ) : (
            <ul className={s.list}>
              {leads.slice(0, 6).map((lead) => {
                const name =
                  Object.entries(lead.fields).find(([k]) => /name/i.test(k))?.[1] ?? 'Unnamed';
                const phone =
                  Object.entries(lead.fields).find(([k]) => /phone/i.test(k))?.[1] ?? '';
                return (
                  <li key={lead.id}>
                    <div className={s.grow}>
                      <b>{name}</b>{' '}
                      {lead.status === 'new' && (
                        <span className={cx(s.badge, s.badgeNew)}>New</span>
                      )}
                      <div className={s.muted} style={{ fontSize: '0.8125rem' }}>
                        {phone} · {lead.source} ·{' '}
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <Link
            href="/web-admin/leads"
            className={cx(s.btn, s.secondary, s.small)}
            style={{ marginTop: '0.75rem' }}
          >
            Open the leads datasheet
          </Link>
        </section>

        <section className={s.panel}>
          <h2 className={s.panelTitle}>Edited sections</h2>
          {recentlyEdited.length === 0 ? (
            <p className={s.muted}>Nothing edited yet. Every page shows its original content.</p>
          ) : (
            <ul className={s.list}>
              {recentlyEdited.map((entry) => (
                <li key={entry.id}>
                  <div className={s.grow}>
                    <Link
                      href={`/web-admin/content/${entry.id}`}
                      style={{ color: 'inherit', fontWeight: 600 }}
                    >
                      {entry.title}
                    </Link>
                    <div className={s.muted} style={{ fontSize: '0.8125rem' }}>
                      {entry.page}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
