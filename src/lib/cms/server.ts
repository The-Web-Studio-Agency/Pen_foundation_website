import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { installReader } from './store';

/**
 * Local storage for the CMS: plain files in `cms-data/` at the project root.
 *
 *   cms-data/content/<id>.json   the admin's saved version of a content object
 *   cms-data/uploads/<file>      images and files uploaded in the admin,
 *                                served at /uploads/<file>
 *   cms-data/leads.json          enquiries from the site's forms
 *
 * This is the "for now" storage the brief asked for: it works on any server
 * with a writable disk (localhost, a VM). To move to MongoDB and S3 later,
 * replace the functions in this file; nothing else reads the disk.
 */

export const DATA_DIR = path.join(process.cwd(), 'cms-data');
const CONTENT_DIR = path.join(DATA_DIR, 'content');
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

const ensure = (dir: string) => fs.mkdirSync(dir, { recursive: true });
const safeId = (id: string) => id.replace(/[^a-z0-9._-]/gi, '_');

/* ---- content ---------------------------------------------------------------- */

/** All saved versions, cached in memory; re-read from disk at most every 2s. */
let cache: Map<string, unknown> | null = null;
let cacheAt = 0;

function loadAll(): Map<string, unknown> {
  if (cache && Date.now() - cacheAt < 2000) return cache;
  const next = new Map<string, unknown>();
  try {
    for (const file of fs.readdirSync(CONTENT_DIR)) {
      if (!file.endsWith('.json')) continue;
      try {
        next.set(
          file.slice(0, -5),
          JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8')),
        );
      } catch {
        // A half-written or hand-broken file is skipped; the default shows.
      }
    }
  } catch {
    // No content saved yet.
  }
  cache = next;
  cacheAt = Date.now();
  return next;
}

export function readContent(id: string): unknown {
  return loadAll().get(safeId(id));
}

/** Every saved version, for the browser copy the root layout writes out. */
export function allContent(): Record<string, unknown> {
  return Object.fromEntries(loadAll());
}

export function writeContent(id: string, value: unknown) {
  ensure(CONTENT_DIR);
  const file = path.join(CONTENT_DIR, `${safeId(id)}.json`);
  fs.writeFileSync(`${file}.tmp`, JSON.stringify(value, null, 2));
  fs.renameSync(`${file}.tmp`, file);
  cache = null;
}

export function resetContent(id: string) {
  fs.rmSync(path.join(CONTENT_DIR, `${safeId(id)}.json`), { force: true });
  cache = null;
}

installReader(readContent);

/* ---- uploads ---------------------------------------------------------------- */

const ALLOWED = /\.(png|jpe?g|webp|avif|gif|svg|mp4|webm|pdf)$/i;
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

export function isAllowedUpload(name: string) {
  return ALLOWED.test(name);
}

export function saveUpload(name: string, data: Buffer): string {
  ensure(UPLOAD_DIR);
  const ext = path.extname(name).toLowerCase();
  const base =
    path
      .basename(name, path.extname(name))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'file';
  const file = `${Date.now().toString(36)}-${base}${ext}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, file), data);
  return `/uploads/${file}`;
}

export interface MediaItem {
  url: string;
  name: string;
  size: number;
  uploaded: boolean;
  modified: number;
}

function walk(dir: string, urlBase: string, uploaded: boolean, out: MediaItem[]) {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, `${urlBase}/${entry.name}`, uploaded, out);
    } else if (ALLOWED.test(entry.name)) {
      const stat = fs.statSync(full);
      out.push({
        url: `${urlBase}/${encodeURIComponent(entry.name)}`.replace(/%2F/g, '/'),
        name: entry.name,
        size: stat.size,
        uploaded,
        modified: stat.mtimeMs,
      });
    }
  }
}

/** Uploaded files first (newest first), then the site's own images. */
export function listMedia(): MediaItem[] {
  const uploads: MediaItem[] = [];
  walk(UPLOAD_DIR, '/uploads', true, uploads);
  uploads.sort((a, b) => b.modified - a.modified);
  const site: MediaItem[] = [];
  walk(path.join(process.cwd(), 'public', 'media'), '/media', false, site);
  walk(path.join(process.cwd(), 'public', 'designs'), '/designs', false, site);
  return [...uploads, ...site];
}

export function deleteUpload(url: string): boolean {
  if (!url.startsWith('/uploads/')) return false;
  const file = path.join(UPLOAD_DIR, path.basename(decodeURIComponent(url)));
  if (!file.startsWith(UPLOAD_DIR)) return false;
  fs.rmSync(file, { force: true });
  return true;
}

/* ---- leads ------------------------------------------------------------------ */

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed';

export interface Lead {
  id: string;
  createdAt: string;
  status: LeadStatus;
  /** Which form: contact, partners, landing-top, landing-bottom. */
  source: string;
  /** The page the form was on. */
  page: string;
  /** The visitor's answers, keyed by field label. */
  fields: Record<string, string>;
  /** utm_* / gclid / fbclid, when the visitor came from an ad. */
  campaign: Record<string, string>;
  note?: string;
}

export function readLeads(): Lead[] {
  try {
    return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')) as Lead[];
  } catch {
    return [];
  }
}

function writeLeads(leads: Lead[]) {
  ensure(DATA_DIR);
  fs.writeFileSync(`${LEADS_FILE}.tmp`, JSON.stringify(leads, null, 2));
  fs.renameSync(`${LEADS_FILE}.tmp`, LEADS_FILE);
}

export function addLead(input: Omit<Lead, 'id' | 'createdAt' | 'status'>): Lead {
  const lead: Lead = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'new',
    ...input,
  };
  writeLeads([lead, ...readLeads()]);
  return lead;
}

export function updateLead(id: string, patch: Partial<Pick<Lead, 'status' | 'note'>>) {
  writeLeads(readLeads().map((lead) => (lead.id === id ? { ...lead, ...patch } : lead)));
}

export function deleteLead(id: string) {
  writeLeads(readLeads().filter((lead) => lead.id !== id));
}
