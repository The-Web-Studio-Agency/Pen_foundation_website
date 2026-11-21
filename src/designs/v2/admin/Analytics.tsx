'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { countryName, regionName } from '@/lib/analytics/geo';
import { CHANNELS } from '@/lib/analytics/sources';
import type { FilterKey, Filters, LiveVisit, Report, Row, Totals } from '@/lib/cms/analytics';

import { cx } from '../components/primitives';
import s from './admin.module.css';

/** The admin's traffic page: live visitors, periods, filters and breakdowns. */

const RANGE_OPTIONS = [
  ['today', 'Today'],
  ['yesterday', 'Yesterday'],
  ['7d', 'Last 7 days'],
  ['30d', 'Last 30 days'],
  ['week', 'This week'],
  ['month', 'This month'],
  ['year', 'This year'],
  ['custom', 'Custom dates'],
] as const;

const FILTER_NAMES: Record<FilterKey, string> = {
  channel: 'Channel',
  source: 'Source',
  country: 'Country',
  region: 'State',
  city: 'City',
  path: 'Page',
  landing: 'Landing page',
  device: 'Device',
  campaign: 'Campaign',
};

const CHANNEL_HINTS: Record<string, string> = {
  Search: 'Google, Bing and other search engines',
  Social: 'Instagram, Facebook, YouTube, LinkedIn, WhatsApp…',
  AI: 'ChatGPT, Perplexity, Gemini, Claude, Copilot…',
  Paid: 'Ad clicks (Google Ads, Meta ads, tagged paid links)',
  Email: 'Email and newsletters',
  Referral: 'Links on other websites',
  Direct: 'Typed in, bookmarks, or apps that hide where the visitor came from',
};

interface Payload {
  enabled: boolean;
  error?: string;
  timezone?: string;
  range?: { key: string; label: string; unit: 'hour' | 'day' | 'month' };
  report?: Report;
  periods?: (Totals & { key: string; label: string })[];
  live?: { count: number; visits: LiveVisit[] };
}

const n = (value: number) => value.toLocaleString('en-IN');

function placeLabel(country: string, region?: string, city?: string) {
  return (
    [city, region ? regionName(country, region) : '', countryName(country)]
      .filter((part) => part && part !== 'Unknown')
      .join(', ') || 'Unknown location'
  );
}

function bucketLabel(bucket: string, unit: 'hour' | 'day' | 'month', long = false) {
  if (unit === 'hour') {
    const hour = Number(bucket.slice(11, 13));
    const time = `${String(hour).padStart(2, '0')}:00`;
    if (!long) return time;
    const day = new Date(`${bucket.slice(0, 10)}T00:00:00Z`);
    return `${day.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' })}, ${time}`;
  }
  if (unit === 'month') {
    return new Date(`${bucket}-01T00:00:00Z`).toLocaleDateString('en-IN', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
  }
  return new Date(`${bucket}T00:00:00Z`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    ...(long ? { weekday: 'short' } : {}),
    timeZone: 'UTC',
  });
}

const seenAgo = (iso: string, now: number) => {
  const sec = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  return sec < 10 ? 'just now' : `${sec}s ago`;
};

/* ---- data ------------------------------------------------------------------ */

function useReport(range: string, from: string, to: string, filters: Filters) {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const query = useMemo(() => {
    const q = new URLSearchParams({ range });
    if (range === 'custom') {
      q.set('from', from);
      q.set('to', to);
    }
    for (const [key, value] of Object.entries(filters)) if (value !== undefined) q.set(key, value);
    return q.toString();
  }, [range, from, to, filters]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const res = await fetch(`/api/cms/analytics?${query}`).catch(() => null);
      const json = ((await res?.json().catch(() => null)) as Payload | null) ?? {
        enabled: true,
        error: 'Could not reach the server.',
      };
      if (!cancelled) {
        setData(json);
        setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return { data, loading };
}

function useLive(initial: Payload['live']) {
  const [live, setLive] = useState(initial);
  const [now, setNow] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      const res = await fetch('/api/cms/analytics?live=1').catch(() => null);
      const json = (await res?.json().catch(() => null)) as Payload | null;
      if (!cancelled && json?.live) setLive(json.live);
      if (!cancelled) setNow(Date.now());
    };
    void poll();
    const id = window.setInterval(poll, 15_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);
  return { live, now };
}

/* ---- page ------------------------------------------------------------------ */

export function Analytics() {
  const [range, setRange] = useState('7d');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [filters, setFilters] = useState<Filters>({});
  const { data, loading } = useReport(range, from, to, filters);

  const addFilter = useCallback(
    (patch: Filters) => setFilters((current) => ({ ...current, ...patch })),
    [],
  );
  const removeFilter = (key: FilterKey) =>
    setFilters((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });

  if (data && !data.enabled) {
    return (
      <div className={cx(s.panel, s.empty)}>
        Traffic tracking needs the MongoDB database. Add <code>MONGODB_URI</code> to the site’s
        environment settings and redeploy; visits are counted from then on.
      </div>
    );
  }

  const report = data?.report;
  const unit = data?.range?.unit ?? 'day';
  const active = Object.entries(filters) as [FilterKey, string][];
  const t = report?.totals ?? { views: 0, visitors: 0, sessions: 0 };

  return (
    <div className={cx(s.analytics, loading && s.loading)}>
      <LivePanel initial={data?.live} />

      {data?.periods && (
        <div className={s.periods}>
          {data.periods.map((p) => (
            <button
              key={p.key}
              type="button"
              className={cx(s.panel, s.period)}
              aria-pressed={range === p.key}
              onClick={() => setRange(p.key)}
            >
              <span className={s.statLabel}>{p.label}</span>
              <span className={s.statValue}>{n(p.visitors)}</span>
              <span className={s.muted}>visitors · {n(p.views)} page views</span>
            </button>
          ))}
        </div>
      )}

      <div className={s.searchRow}>
        <select
          className={s.select}
          value={range}
          onChange={(e) => {
            const next = e.target.value;
            if (next === 'custom' && !from) {
              const today = new Date().toISOString().slice(0, 10);
              setFrom(today);
              setTo(today);
            }
            setRange(next);
          }}
          aria-label="Date range"
        >
          {RANGE_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {range === 'custom' && (
          <>
            <input
              type="date"
              className={s.input}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              aria-label="From"
              style={{ width: 'auto' }}
            />
            <input
              type="date"
              className={s.input}
              value={to}
              onChange={(e) => setTo(e.target.value)}
              aria-label="To"
              style={{ width: 'auto' }}
            />
          </>
        )}
        <select
          className={s.select}
          value={filters.channel ?? ''}
          onChange={(e) =>
            e.target.value ? addFilter({ channel: e.target.value }) : removeFilter('channel')
          }
          aria-label="Channel"
        >
          <option value="">All channels</option>
          {CHANNELS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className={s.select}
          value={filters.country ?? ''}
          onChange={(e) =>
            e.target.value ? addFilter({ country: e.target.value }) : removeFilter('country')
          }
          aria-label="Country"
        >
          <option value="">All countries</option>
          {filters.country !== undefined &&
            !report?.countries.some((r) => r.key === filters.country) && (
              <option value={filters.country}>{countryName(filters.country)}</option>
            )}
          {report?.countries.map((r) => (
            <option key={String(r.key)} value={String(r.key ?? '')}>
              {countryName(String(r.key ?? ''))}
            </option>
          ))}
        </select>
        <select
          className={s.select}
          value={filters.device ?? ''}
          onChange={(e) =>
            e.target.value ? addFilter({ device: e.target.value }) : removeFilter('device')
          }
          aria-label="Device"
        >
          <option value="">All devices</option>
          {['Mobile', 'Desktop', 'Tablet'].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {active.length > 0 && (
        <div className={s.chips}>
          {active.map(([key, value]) => (
            <button
              key={key}
              type="button"
              className={s.chip}
              onClick={() => removeFilter(key)}
              aria-label={`Remove filter ${FILTER_NAMES[key]}`}
            >
              {FILTER_NAMES[key]}:{' '}
              <b>
                {key === 'country'
                  ? countryName(value)
                  : key === 'region'
                    ? regionName(filters.country ?? '', value)
                    : value || 'Unknown'}
              </b>{' '}
              ×
            </button>
          ))}
          <button
            type="button"
            className={cx(s.btn, s.secondary, s.small)}
            onClick={() => setFilters({})}
          >
            Clear filters
          </button>
        </div>
      )}

      {data?.error && <div className={cx(s.panel, s.error)}>{data.error}</div>}

      <div className={s.stats}>
        {[
          ['Visitors', t.visitors, 'Different people (one per browser)'],
          ['Visits', t.sessions, 'A visit ends after 30 minutes without activity'],
          ['Page views', t.views, 'Every page opened'],
          [
            'Pages per visit',
            t.sessions ? (t.views / t.sessions).toFixed(1) : '0',
            'How far people read',
          ],
        ].map(([label, value, hint]) => (
          <div key={String(label)} className={cx(s.panel, s.stat)}>
            <span className={s.statValue}>{typeof value === 'number' ? n(value) : value}</span>
            <span className={s.statLabel}>{label}</span>
            <span className={s.muted} style={{ fontSize: '0.75rem' }}>
              {hint}
            </span>
          </div>
        ))}
      </div>

      {report && (
        <section className={s.panel} style={{ marginBottom: '1rem' }}>
          <h2 className={s.panelTitle}>
            Visitors {unit === 'hour' ? 'per hour' : unit === 'day' ? 'per day' : 'per month'} ·{' '}
            {data?.range?.label}
          </h2>
          <TrafficChart series={report.series} unit={unit} />
        </section>
      )}

      {report && (
        <div className={s.breakdowns}>
          <Breakdown
            title="Where visitors come from"
            rows={report.channels}
            label={(r) => String(r.key)}
            hint={(r) => CHANNEL_HINTS[String(r.key)]}
            onPick={(r) => addFilter({ channel: String(r.key) })}
          />
          <Breakdown
            title="Sources"
            rows={report.sources}
            label={(r) => (r.key as Record<string, string>).source}
            hint={(r) => (r.key as Record<string, string>).channel}
            onPick={(r) => {
              const k = r.key as Record<string, string>;
              addFilter({ channel: k.channel, source: k.source });
            }}
          />
          <Breakdown
            title="First page they landed on"
            rows={report.landing}
            metric="sessions"
            metricLabel="Visits"
            label={(r) => String(r.key)}
            onPick={(r) => addFilter({ landing: String(r.key) })}
          />
          <Breakdown
            title="Most viewed pages"
            rows={report.pages}
            metric="views"
            metricLabel="Views"
            label={(r) => String(r.key)}
            onPick={(r) => addFilter({ path: String(r.key) })}
          />
          <Breakdown
            title="Countries"
            rows={report.countries}
            label={(r) => countryName(String(r.key ?? ''))}
            onPick={(r) => addFilter({ country: String(r.key ?? '') })}
          />
          <Breakdown
            title={filters.country ? `States in ${countryName(filters.country)}` : 'States'}
            rows={report.regions}
            label={(r) => {
              const k = r.key as Record<string, string>;
              return filters.country
                ? regionName(k.country, k.region)
                : `${regionName(k.country, k.region)}${k.country ? ` · ${k.country}` : ''}`;
            }}
            onPick={(r) => {
              const k = r.key as Record<string, string>;
              addFilter({ country: k.country, region: k.region });
            }}
          />
          <Breakdown
            title="Cities"
            rows={report.cities}
            label={(r) => {
              const k = r.key as Record<string, string>;
              return placeLabel(k.country, k.region, k.city);
            }}
            onPick={(r) => {
              const k = r.key as Record<string, string>;
              addFilter({ country: k.country, region: k.region, city: k.city });
            }}
          />
          <Breakdown
            title="Devices"
            rows={report.devices}
            label={(r) => String(r.key)}
            onPick={(r) => addFilter({ device: String(r.key) })}
          />
          {report.campaigns.length > 0 && (
            <Breakdown
              title="Ad and link campaigns (utm_campaign)"
              rows={report.campaigns}
              label={(r) => String(r.key)}
              onPick={(r) => addFilter({ campaign: String(r.key) })}
            />
          )}
        </div>
      )}

      <p className={s.muted} style={{ fontSize: '0.8125rem', marginTop: '1.5rem' }}>
        Times are in {data?.timezone ?? 'India time'}. Visits are counted without cookies and
        without storing IP addresses; your own visits are not counted while you are signed in. Click
        any row to filter the whole page by it.
      </p>
    </div>
  );
}

/* ---- live ------------------------------------------------------------------ */

function LivePanel({ initial }: { initial: Payload['live'] }) {
  const { live, now } = useLive(initial);
  const [open, setOpen] = useState(false);
  const count = live?.count ?? 0;

  return (
    <section className={cx(s.panel, s.live)}>
      <div className={s.liveHead}>
        <span className={cx(s.liveDot, count > 0 && s.liveDotOn)} aria-hidden />
        <span className={s.liveCount}>{n(count)}</span>
        <span>
          {count === 1 ? 'person is' : 'people are'} on the website right now
          <span className={s.muted} style={{ display: 'block', fontSize: '0.8125rem' }}>
            Updates every 15 seconds
          </span>
        </span>
        <span className={s.grow} />
        {count > 0 && (
          <button
            type="button"
            className={cx(s.btn, s.secondary, s.small)}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            {open ? 'Hide' : 'Show who'}
          </button>
        )}
      </div>
      {open && live && live.visits.length > 0 && (
        <div className={s.tableWrap} style={{ marginTop: '1rem' }}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Page now</th>
                <th>From</th>
                <th>Location</th>
                <th>Device</th>
                <th>Last seen</th>
              </tr>
            </thead>
            <tbody>
              {live.visits.map((v, i) => (
                <tr key={`${v.path}-${i}`}>
                  <td className={s.mono}>{v.path}</td>
                  <td>
                    {v.source} <span className={s.muted}>· {v.channel}</span>
                  </td>
                  <td>{placeLabel(v.country, v.region, v.city)}</td>
                  <td>{v.device}</td>
                  <td className={s.muted}>{now ? seenAgo(v.seen, now) : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/* ---- chart ----------------------------------------------------------------- */

function niceMax(value: number) {
  if (value <= 4) return 4;
  const step = 10 ** Math.floor(Math.log10(value));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * step >= value) return m * step;
  return 10 * step;
}

function TrafficChart({
  series,
  unit,
}: {
  series: Report['series'];
  unit: 'hour' | 'day' | 'month';
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = niceMax(Math.max(0, ...series.map((p) => p.visitors)));
  const every = Math.max(1, Math.ceil(series.length / 8));
  const point = hover === null ? null : series[hover];

  return (
    <div className={s.chart}>
      <div className={s.chartGrid} aria-hidden>
        {[max, max / 2, 0].map((v) => (
          <span key={v} className={s.chartGridLine}>
            <span>{n(Math.round(v))}</span>
          </span>
        ))}
      </div>
      <div
        className={s.chartBars}
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label="Visitors over time"
      >
        {series.map((p, i) => (
          <div
            key={p.bucket}
            className={s.chartCol}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            tabIndex={0}
            aria-label={`${bucketLabel(p.bucket, unit, true)}: ${p.visitors} visitors, ${p.views} page views`}
          >
            <span
              className={cx(s.chartBar, hover === i && s.chartBarOn)}
              style={{ height: `${(p.visitors / max) * 100}%` }}
            />
          </div>
        ))}
        {point && hover !== null && (
          <div
            className={s.chartTip}
            style={{
              left: `${((hover + 0.5) / series.length) * 100}%`,
              transform: `translateX(${hover / series.length > 0.7 ? '-100%' : hover / series.length < 0.3 ? '0' : '-50%'})`,
            }}
          >
            <b>{bucketLabel(point.bucket, unit, true)}</b>
            <span>
              {n(point.visitors)} visitor{point.visitors === 1 ? '' : 's'}
            </span>
            <span className={s.muted}>{n(point.views)} page views</span>
          </div>
        )}
      </div>
      <div className={s.chartAxis} aria-hidden>
        {series.map((p, i) => (
          <span key={p.bucket}>{i % every === 0 ? bucketLabel(p.bucket, unit) : ''}</span>
        ))}
      </div>
    </div>
  );
}

/* ---- breakdown tables -------------------------------------------------------- */

function Breakdown({
  title,
  rows,
  label,
  hint,
  onPick,
  metric = 'visitors',
  metricLabel = 'Visitors',
}: {
  title: string;
  rows: Row[];
  label: (row: Row) => string;
  hint?: (row: Row) => string | undefined;
  onPick: (row: Row) => void;
  metric?: 'visitors' | 'sessions' | 'views';
  metricLabel?: string;
}) {
  const [all, setAll] = useState(false);
  const total = rows.reduce((sum, r) => sum + r[metric], 0);
  const top = rows[0]?.[metric] ?? 0;
  const shown = all ? rows : rows.slice(0, 8);

  return (
    <section className={s.panel}>
      <div className={s.breakdownHead}>
        <h2 className={s.panelTitle} style={{ margin: 0 }}>
          {title}
        </h2>
        <span className={s.muted} style={{ fontSize: '0.75rem' }}>
          {metricLabel}
        </span>
      </div>
      {rows.length === 0 ? (
        <p className={s.muted}>No visits in this range yet.</p>
      ) : (
        <ul className={s.breakdown}>
          {shown.map((row) => {
            const value = row[metric];
            const name = label(row) || 'Unknown';
            return (
              <li key={JSON.stringify(row.key)}>
                <button
                  type="button"
                  className={s.breakdownRow}
                  onClick={() => onPick(row)}
                  title={`Filter by ${name}`}
                >
                  <span
                    className={s.breakdownBar}
                    style={{ width: `${top ? (value / top) * 100 : 0}%` }}
                    aria-hidden
                  />
                  <span className={s.breakdownName}>
                    {name}
                    {hint?.(row) && <span className={s.breakdownHint}>{hint(row)}</span>}
                  </span>
                  <span className={s.breakdownValue}>
                    {n(value)}
                    <span className={s.muted}>
                      {total ? ` ${Math.round((value / total) * 100)}%` : ''}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {rows.length > 8 && (
        <button
          type="button"
          className={cx(s.btn, s.secondary, s.small)}
          style={{ marginTop: '0.75rem' }}
          onClick={() => setAll((v) => !v)}
        >
          {all ? 'Show fewer' : `Show all ${rows.length}`}
        </button>
      )}
    </section>
  );
}
