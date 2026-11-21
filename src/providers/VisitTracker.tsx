'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Counts visits for the admin's Analytics page (lib/cms/analytics.ts).
 *
 * Cookie-free: a random visitor ID and the current visit live in this site's
 * localStorage. A visit ends after 30 minutes without activity, or when the
 * visitor arrives again from a new ad or tagged link. Each page view is sent
 * once; while the tab is visible a small ping every 30 s keeps "on the site
 * now" accurate. Nothing is sent from the admin, or by automated browsers.
 */

const VISITOR_KEY = 'pen-vid';
const SESSION_KEY = 'pen-visit';
const SESSION_MS = 30 * 60_000;
const PING_MS = 30_000;
const CAMPAIGN = /[?&](utm_[a-z]+|gclid|gbraid|wbraid|fbclid|msclkid)=/i;

interface Visit {
  id: string;
  last: number;
  landing: string;
  referrer: string;
  search: string;
}

const randomId = () =>
  (crypto.randomUUID?.() ?? `${Math.random()}${Date.now()}`)
    .replace(/[^a-z0-9]/gi, '')
    .slice(0, 24);

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode: the IDs just last for this page */
  }
}

function visitor() {
  let id = read<string>(VISITOR_KEY);
  if (!id) {
    id = randomId();
    write(VISITOR_KEY, id);
  }
  return id;
}

/** The current visit, or a new one; `entry` when this page started it. */
function visit(path: string): { visit: Visit; entry: boolean } {
  const now = Date.now();
  const search = window.location.search;
  const current = read<Visit>(SESSION_KEY);
  const freshCampaign = CAMPAIGN.test(search) && current?.search !== search;
  if (current && now - current.last < SESSION_MS && !freshCampaign) {
    current.last = now;
    write(SESSION_KEY, current);
    return { visit: current, entry: false };
  }
  const next: Visit = {
    id: randomId(),
    last: now,
    landing: path,
    referrer: document.referrer.slice(0, 500),
    search: search.slice(0, 800),
  };
  write(SESSION_KEY, next);
  return { visit: next, entry: true };
}

function send(body: Record<string, unknown>) {
  void fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
}

/** Development double-mounts effects; one view per path change is enough. */
let lastView = { path: '', at: 0 };

export function VisitTracker() {
  const pathname = usePathname();
  const skip = !pathname || pathname.startsWith('/web-admin');

  useEffect(() => {
    if (skip || navigator.webdriver) return;
    const now = Date.now();
    if (lastView.path === pathname && now - lastView.at < 1500) return;
    lastView = { path: pathname, at: now };

    const { visit: v, entry } = visit(pathname);
    send({
      type: 'view',
      vid: visitor(),
      sid: v.id,
      path: pathname,
      landing: v.landing,
      entry,
      referrer: v.referrer,
      search: v.search,
    });
  }, [pathname, skip]);

  useEffect(() => {
    if (skip || navigator.webdriver) return;
    const ping = () => {
      if (document.visibilityState !== 'visible') return;
      const { visit: v } = visit(pathname);
      send({
        type: 'ping',
        vid: visitor(),
        sid: v.id,
        path: pathname,
        referrer: v.referrer,
        search: v.search,
      });
    };
    const id = window.setInterval(ping, PING_MS);
    const onVisible = () => document.visibilityState === 'visible' && ping();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [pathname, skip]);

  return null;
}
