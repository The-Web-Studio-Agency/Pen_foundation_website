import type { Document } from 'mongodb';

import type { Channel, Device } from '@/lib/analytics/sources';

import { db, usingMongo } from './server';

/**
 * Website traffic, stored in MongoDB next to the content.
 *
 *   visits     one document per page view, kept for 400 days (a TTL index),
 *              which covers "this year" and the year-ago comparison window
 *   presence   one document per open visit, refreshed every 30 s by the
 *              tracker and removed 10 minutes after the tab goes quiet;
 *              "on the site now" is whatever was seen in the last 90 s
 *
 * No cookies and no IP addresses are stored: a visitor is a random ID the
 * browser keeps for this site, a visit (session) ends after 30 minutes of
 * inactivity. Location comes from the host's own lookup (Vercel's
 * x-vercel-ip-* headers) and is stored as country / state / city only.
 *
 * Dates are reported in TIMEZONE, so "today" means today in India unless
 * ANALYTICS_TIMEZONE says otherwise.
 */

export const TIMEZONE = process.env.ANALYTICS_TIMEZONE || 'Asia/Kolkata';
const KEEP_DAYS = 400;
const LIVE_MS = 90_000;

export interface Visit {
  t: Date;
  vid: string;
  sid: string;
  path: string;
  landing: string;
  entry: boolean;
  channel: Channel;
  source: string;
  campaign?: string;
  country: string;
  region: string;
  city: string;
  device: Device;
}

interface Presence {
  _id: string;
  vid: string;
  path: string;
  channel: Channel;
  source: string;
  country: string;
  region: string;
  city: string;
  device: Device;
  seen: Date;
}

const visits = async () => (await db()).collection<Visit>('visits');
const presence = async () => (await db()).collection<Presence>('presence');

const shared = ((
  globalThis as unknown as { __penAnalytics?: { indexes?: Promise<void> } }
).__penAnalytics ??= {});

function ensureIndexes() {
  shared.indexes ??= (async () => {
    const [v, p] = await Promise.all([visits(), presence()]);
    await Promise.all([
      v.createIndex({ t: 1 }, { expireAfterSeconds: KEEP_DAYS * 86400 }),
      p.createIndex({ seen: 1 }, { expireAfterSeconds: 600 }),
    ]);
  })().catch((error) => {
    shared.indexes = undefined;
    throw error;
  });
  return shared.indexes;
}

export const analyticsEnabled = usingMongo;

/* ---- recording --------------------------------------------------------------- */

export async function recordView(visit: Visit) {
  await ensureIndexes();
  await (await visits()).insertOne(visit);
  await touch(visit.sid, visit);
}

export async function recordPing(sid: string, fields: Omit<Presence, '_id' | 'seen'>) {
  await ensureIndexes();
  await touch(sid, fields);
}

async function touch(sid: string, f: Omit<Presence, '_id' | 'seen'>) {
  await (
    await presence()
  ).updateOne(
    { _id: sid },
    {
      $set: {
        vid: f.vid,
        path: f.path,
        channel: f.channel,
        source: f.source,
        country: f.country,
        region: f.region,
        city: f.city,
        device: f.device,
        seen: new Date(),
      },
    },
    { upsert: true },
  );
}

/* ---- calendar in the reporting time zone ---------------------------------- */

const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  weekday: 'short',
  hourCycle: 'h23',
});

function partsIn(date: Date) {
  const p = Object.fromEntries(formatter.formatToParts(date).map((x) => [x.type, x.value]));
  return {
    y: Number(p.year),
    m: Number(p.month),
    d: Number(p.day),
    h: Number(p.hour),
    mi: Number(p.minute),
    s: Number(p.second),
    weekday: p.weekday as string,
  };
}

function offsetMs(date: Date) {
  const p = partsIn(date);
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s) - Math.floor(date.getTime() / 1000) * 1000;
}

/** The instant local midnight starts on y-m-d (day may overflow, like Date.UTC). */
function midnight(y: number, m: number, d: number) {
  const guess = Date.UTC(y, m - 1, d);
  return new Date(guess - offsetMs(new Date(guess)));
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const pad = (n: number) => String(n).padStart(2, '0');
const dayKey = (utc: number) => {
  const d = new Date(utc);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
};

export const RANGES = {
  today: 'Today',
  yesterday: 'Yesterday',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  week: 'This week',
  month: 'This month',
  year: 'This year',
  custom: 'Custom dates',
} as const;
export type RangeKey = keyof typeof RANGES;

export type Unit = 'hour' | 'day' | 'month';

export interface Range {
  key: RangeKey;
  label: string;
  start: Date;
  end: Date;
  unit: Unit;
  /** Every bucket in the range, in order, so empty days still show. */
  buckets: string[];
}

/** First local day (y, m, d) and the number of days, for a range key. */
function span(key: RangeKey, from?: string, to?: string): [number, number, number, number] {
  const now = partsIn(new Date());
  const { y, m, d } = now;
  switch (key) {
    case 'yesterday':
      return [y, m, d - 1, 1];
    case '7d':
      return [y, m, d - 6, 7];
    case '30d':
      return [y, m, d - 29, 30];
    case 'week': {
      const back = WEEKDAYS.indexOf(now.weekday);
      return [y, m, d - back, 7];
    }
    case 'month':
      return [y, m, 1, new Date(Date.UTC(y, m, 0)).getUTCDate()];
    case 'year':
      return [y, 1, 1, Math.round((Date.UTC(y + 1, 0, 1) - Date.UTC(y, 0, 1)) / 86400_000)];
    case 'custom': {
      const a = /^(\d{4})-(\d{2})-(\d{2})$/.exec(from ?? '');
      const b = /^(\d{4})-(\d{2})-(\d{2})$/.exec(to ?? '');
      if (a && b) {
        const sa = Date.UTC(+a[1], +a[2] - 1, +a[3]);
        const sb = Date.UTC(+b[1], +b[2] - 1, +b[3]);
        const [lo, hi] = sa <= sb ? [sa, sb] : [sb, sa];
        const days = Math.min(Math.round((hi - lo) / 86400_000) + 1, 800);
        const first = new Date(lo);
        return [first.getUTCFullYear(), first.getUTCMonth() + 1, first.getUTCDate(), days];
      }
      return [y, m, d, 1];
    }
    default:
      return [y, m, d, 1];
  }
}

export function resolveRange(key: string, from?: string, to?: string): Range {
  const k: RangeKey = key in RANGES ? (key as RangeKey) : '7d';
  const [y, m, d, days] = span(k, from, to);
  const start = midnight(y, m, d);
  const end = midnight(y, m, d + days);
  const unit: Unit = days <= 2 ? 'hour' : days <= 92 ? 'day' : 'month';
  const dayKeys = Array.from({ length: days }, (_, i) => dayKey(Date.UTC(y, m - 1, d + i)));
  const buckets =
    unit === 'hour'
      ? dayKeys.flatMap((dk) => Array.from({ length: 24 }, (_, h) => `${dk}T${pad(h)}`))
      : unit === 'day'
        ? dayKeys
        : [...new Set(dayKeys.map((dk) => dk.slice(0, 7)))];
  return { key: k, label: RANGES[k], start, end, unit, buckets };
}

/* ---- reports ------------------------------------------------------------------ */

export const FILTER_KEYS = [
  'channel',
  'source',
  'country',
  'region',
  'city',
  'path',
  'landing',
  'device',
  'campaign',
] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];
export type Filters = Partial<Record<FilterKey, string>>;

export interface Row {
  key: Record<string, string> | string | null;
  views: number;
  visitors: number;
  sessions: number;
}
export interface Totals {
  views: number;
  visitors: number;
  sessions: number;
}

export interface Report {
  totals: Totals;
  series: { bucket: string; views: number; visitors: number }[];
  channels: Row[];
  sources: Row[];
  countries: Row[];
  regions: Row[];
  cities: Row[];
  landing: Row[];
  pages: Row[];
  devices: Row[];
  campaigns: Row[];
}

const FORMATS: Record<Unit, string> = { hour: '%Y-%m-%dT%H', day: '%Y-%m-%d', month: '%Y-%m' };

const grouped = (key: unknown, limit = 50): Document[] => [
  { $group: { _id: key, views: { $sum: 1 }, v: { $addToSet: '$vid' }, s: { $addToSet: '$sid' } } },
  {
    $project: {
      _id: 0,
      key: '$_id',
      views: 1,
      visitors: { $size: '$v' },
      sessions: { $size: '$s' },
    },
  },
  { $sort: { visitors: -1, views: -1 } },
  { $limit: limit },
];

export async function report(range: Range, filters: Filters): Promise<Report> {
  const match: Document = { t: { $gte: range.start, $lt: range.end } };
  for (const key of FILTER_KEYS) if (filters[key] !== undefined) match[key] = filters[key];

  const [result] = await (
    await visits()
  )
    .aggregate([
      { $match: match },
      {
        $facet: {
          totals: grouped(null, 1),
          series: [
            {
              $group: {
                _id: {
                  $dateToString: { format: FORMATS[range.unit], date: '$t', timezone: TIMEZONE },
                },
                views: { $sum: 1 },
                v: { $addToSet: '$vid' },
              },
            },
            { $project: { _id: 0, bucket: '$_id', views: 1, visitors: { $size: '$v' } } },
          ],
          channels: grouped('$channel', 10),
          sources: grouped({ channel: '$channel', source: '$source' }),
          countries: grouped('$country'),
          regions: grouped({ country: '$country', region: '$region' }),
          cities: grouped({ country: '$country', region: '$region', city: '$city' }),
          landing: [{ $match: { entry: true } }, ...grouped('$path')],
          pages: grouped('$path'),
          devices: grouped('$device', 5),
          campaigns: [{ $match: { campaign: { $type: 'string' } } }, ...grouped('$campaign')],
        },
      },
    ])
    .toArray();

  const series = new Map(
    (result.series as Report['series']).map((row) => [row.bucket, row] as const),
  );
  return {
    totals: (result.totals[0] as Totals | undefined) ?? { views: 0, visitors: 0, sessions: 0 },
    series: range.buckets.map((bucket) => series.get(bucket) ?? { bucket, views: 0, visitors: 0 }),
    channels: result.channels,
    sources: result.sources,
    countries: result.countries,
    regions: result.regions,
    cities: result.cities,
    landing: result.landing,
    pages: result.pages,
    devices: result.devices,
    campaigns: result.campaigns,
  };
}

/** Visitors and page views for today, this week, this month and this year. */
export async function summary() {
  const periods = (['today', 'week', 'month', 'year'] as const).map((key) => resolveRange(key));
  const earliest = new Date(Math.min(...periods.map((p) => p.start.getTime())));
  const facets = Object.fromEntries(
    periods.map((p) => [
      p.key,
      [{ $match: { t: { $gte: p.start, $lt: p.end } } }, ...grouped(null, 1)],
    ]),
  );
  const [result] = await (
    await visits()
  )
    .aggregate([{ $match: { t: { $gte: earliest } } }, { $facet: facets }])
    .toArray();
  return periods.map((p) => ({
    key: p.key,
    label: p.label,
    ...((result[p.key][0] as Totals | undefined) ?? { views: 0, visitors: 0, sessions: 0 }),
  }));
}

export interface LiveVisit {
  path: string;
  channel: Channel;
  source: string;
  country: string;
  region: string;
  city: string;
  device: Device;
  seen: string;
}

/** Who has the site open right now (seen in the last 90 seconds). */
export async function live(): Promise<{ count: number; visits: LiveVisit[] }> {
  const docs = await (
    await presence()
  )
    .find({ seen: { $gte: new Date(Date.now() - LIVE_MS) } })
    .sort({ seen: -1 })
    .limit(200)
    .toArray();
  // One row per visitor, even with several tabs open.
  const byVisitor = new Map<string, Presence>();
  for (const doc of docs) if (!byVisitor.has(doc.vid)) byVisitor.set(doc.vid, doc);
  return {
    count: byVisitor.size,
    visits: [...byVisitor.values()].slice(0, 50).map((doc) => ({
      path: doc.path,
      channel: doc.channel,
      source: doc.source,
      country: doc.country,
      region: doc.region,
      city: doc.city,
      device: doc.device,
      seen: doc.seen.toISOString(),
    })),
  };
}
