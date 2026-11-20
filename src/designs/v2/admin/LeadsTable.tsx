'use client';

import { Fragment, useMemo, useState } from 'react';

import { cx } from '../components/primitives';
import s from './admin.module.css';
import { useToast } from './ContentEditor';

export interface LeadRow {
  id: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  source: string;
  page: string;
  fields: Record<string, string>;
  campaign: Record<string, string>;
  note?: string;
}

const STATUSES: LeadRow['status'][] = ['new', 'contacted', 'qualified', 'closed'];

const SOURCE_NAMES: Record<string, string> = {
  contact: 'Contact page',
  partners: 'Partners page',
  'landing-top': 'Landing page (top form)',
  'landing-bottom': 'Landing page (bottom form)',
};

/** Field values by meaning, whatever the form called them. */
function pick(lead: LeadRow, ...labels: RegExp[]) {
  for (const re of labels) {
    for (const [k, v] of Object.entries(lead.fields)) if (re.test(k)) return v;
  }
  return '';
}

const name = (l: LeadRow) => pick(l, /name/i);
const phone = (l: LeadRow) => pick(l, /phone/i);
const email = (l: LeadRow) => pick(l, /email/i);
const where = (l: LeadRow) => pick(l, /location/i, /company/i);
const what = (l: LeadRow) => pick(l, /type/i, /help/i, /topic/i);

const when = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

function toCsv(leads: LeadRow[]) {
  const labels = [...new Set(leads.flatMap((l) => Object.keys(l.fields)))];
  const campaign = [...new Set(leads.flatMap((l) => Object.keys(l.campaign)))];
  const head = ['Received', 'Status', 'Source', 'Page', ...labels, ...campaign, 'Note'];
  const esc = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = leads.map((l) => [
    new Date(l.createdAt).toISOString(),
    l.status,
    SOURCE_NAMES[l.source] ?? l.source,
    l.page,
    ...labels.map((k) => l.fields[k] ?? ''),
    ...campaign.map((k) => l.campaign[k] ?? ''),
    l.note ?? '',
  ]);
  return [head, ...rows].map((r) => r.map(esc).join(',')).join('\r\n');
}

/** Every enquiry from the site's forms, newest first: filter, update, export. */
export function LeadsTable({ initial }: { initial: LeadRow[] }) {
  const [leads, setLeads] = useState(initial);
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('all');
  const [status, setStatus] = useState('all');
  const [open, setOpen] = useState<string | null>(null);
  const { show, node } = useToast();

  const sources = useMemo(() => [...new Set(leads.map((l) => l.source))], [leads]);
  const shown = leads.filter(
    (l) =>
      (source === 'all' || l.source === source) &&
      (status === 'all' || l.status === status) &&
      JSON.stringify(l).toLowerCase().includes(query.trim().toLowerCase()),
  );

  const patch = async (id: string, body: Partial<Pick<LeadRow, 'status' | 'note'>>) => {
    setLeads((all) => all.map((l) => (l.id === id ? { ...l, ...body } : l)));
    const res = await fetch('/api/cms/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...body }),
    });
    if (!res.ok) show({ text: 'Could not update.', error: true });
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this lead permanently?')) return;
    const res = await fetch(`/api/cms/leads?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!res.ok) return show({ text: 'Could not delete.', error: true });
    setLeads((all) => all.filter((l) => l.id !== id));
    show({ text: 'Deleted.' });
  };

  const exportCsv = () => {
    const blob = new Blob([`﻿${toCsv(shown)}`], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pen-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <div className={s.searchRow}>
        <input
          className={s.input}
          placeholder="Search name, phone, email, message…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className={s.select} value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="all">All forms</option>
          {sources.map((src) => (
            <option key={src} value={src}>
              {SOURCE_NAMES[src] ?? src}
            </option>
          ))}
        </select>
        <select className={s.select} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Any status</option>
          {STATUSES.map((st) => (
            <option key={st} value={st}>
              {st[0].toUpperCase() + st.slice(1)}
            </option>
          ))}
        </select>
        <span className={s.grow} />
        <button
          type="button"
          className={cx(s.btn, s.dark)}
          onClick={exportCsv}
          disabled={shown.length === 0}
        >
          Export CSV ({shown.length})
        </button>
      </div>

      {shown.length === 0 ? (
        <div className={cx(s.panel, s.empty)}>
          {leads.length === 0
            ? 'No enquiries yet. Leads from the contact, partners and landing page forms appear here.'
            : 'No leads match these filters.'}
        </div>
      ) : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Received</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Location / company</th>
                <th>Project / topic</th>
                <th>Form</th>
                <th>Ad source</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {shown.map((l) => (
                <Fragment key={l.id}>
                  <tr className={cx(l.status === 'new' && s.rowNew)}>
                    <td style={{ whiteSpace: 'nowrap' }}>{when(l.createdAt)}</td>
                    <td>
                      <b>{name(l) || '—'}</b>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {phone(l) ? (
                        <a href={`tel:${phone(l).replace(/[^\d+]/g, '')}`}>{phone(l)}</a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className={s.cellClip}>
                      {email(l) ? <a href={`mailto:${email(l)}`}>{email(l)}</a> : '—'}
                    </td>
                    <td className={s.cellClip}>{where(l) || '—'}</td>
                    <td className={s.cellClip}>{what(l) || '—'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{SOURCE_NAMES[l.source] ?? l.source}</td>
                    <td className={s.cellClip}>
                      {l.campaign.utm_source
                        ? `${l.campaign.utm_source}${l.campaign.utm_campaign ? ` · ${l.campaign.utm_campaign}` : ''}`
                        : l.campaign.gclid
                          ? 'Google Ads'
                          : l.campaign.fbclid
                            ? 'Meta Ads'
                            : '—'}
                    </td>
                    <td>
                      <select
                        className={s.select}
                        value={l.status}
                        onChange={(e) =>
                          patch(l.id, { status: e.target.value as LeadRow['status'] })
                        }
                        style={{ minHeight: '2rem', padding: '0.2rem 0.5rem', width: 'auto' }}
                        aria-label="Status"
                      >
                        {STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st[0].toUpperCase() + st.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        className={cx(s.btn, s.secondary, s.small)}
                        onClick={() => setOpen(open === l.id ? null : l.id)}
                        aria-expanded={open === l.id}
                      >
                        {open === l.id ? 'Close' : 'Details'}
                      </button>
                    </td>
                  </tr>
                  {open === l.id && (
                    <tr className={s.detail}>
                      <td colSpan={10}>
                        <dl className={s.detailGrid}>
                          {Object.entries(l.fields).map(([k, v]) => (
                            <div key={k}>
                              <dt>{k}</dt>
                              <dd>{v}</dd>
                            </div>
                          ))}
                          <div>
                            <dt>Page</dt>
                            <dd>{l.page}</dd>
                          </div>
                          {Object.entries(l.campaign).map(([k, v]) => (
                            <div key={k}>
                              <dt>{k}</dt>
                              <dd>{v}</dd>
                            </div>
                          ))}
                        </dl>
                        <label className={s.field} style={{ marginTop: '0.5rem' }}>
                          <span className={s.label}>Internal note</span>
                          <textarea
                            className={s.textarea}
                            defaultValue={l.note ?? ''}
                            placeholder="Called back, sent drawings, site visit booked…"
                            onBlur={(e) => {
                              if (e.target.value !== (l.note ?? '')) {
                                void patch(l.id, { note: e.target.value });
                                show({ text: 'Note saved.' });
                              }
                            }}
                          />
                        </label>
                        <div style={{ marginTop: '0.75rem' }}>
                          <button
                            type="button"
                            className={cx(s.btn, s.danger, s.small)}
                            onClick={() => remove(l.id)}
                          >
                            Delete lead
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {node}
    </>
  );
}
