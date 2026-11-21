import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { GridFSBucket, MongoClient, type Db } from 'mongodb';

import { installReader } from './store';

/**
 * CMS storage. Two backends behind one set of functions:
 *
 *   MongoDB  when MONGODB_URI is set (the normal case)
 *            content   one document per section: { _id: id, value, source,
 *                      updatedAt, updatedBy }. `source` is 'admin' for an
 *                      edit and 'seed' for a copy of the code's original
 *                      (kept in step with the code until someone edits it).
 *            leads     one document per enquiry
 *            uploads   GridFS bucket: files uploaded in the admin
 *   files    fallback without MONGODB_URI: cms-data/ at the project root
 *
 * Pages render synchronously, so admin edits are held in a memory cache
 * (shared through globalThis): filled when the server starts (see
 * src/instrumentation.ts), updated instantly by every save, and re-read from
 * the database in the background every few seconds so several servers stay
 * in step. A page view never waits on the database.
 */

/**
 * Read on every call, not once at load: every part of the server then agrees
 * on the backend, even parts loaded before the environment changed.
 */
export const usingMongo = () => Boolean(process.env.MONGODB_URI);

export const DATA_DIR = path.join(process.cwd(), 'cms-data');
const CONTENT_DIR = path.join(DATA_DIR, 'content');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

const ensureDir = (dir: string) => fs.mkdirSync(dir, { recursive: true });
const safeId = (id: string) => id.replace(/[^a-z0-9._-]/gi, '_');

/* ---- connection ---------------------------------------------------------------- */

interface Shared {
  client?: Promise<MongoClient>;
  cache?: { map: Map<string, unknown>; loadedAt: number; loading?: Promise<void> };
}
const shared = ((globalThis as unknown as { __penCms?: Shared }).__penCms ??= {});

export async function db(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set.');
  shared.client ??= new MongoClient(uri, { serverSelectionTimeoutMS: 5000 })
    .connect()
    .catch((error) => {
      shared.client = undefined; // retry on the next call
      throw error;
    });
  return (await shared.client).db(process.env.MONGODB_DB || 'pen_foundation_cms');
}

interface ContentDoc {
  _id: string;
  value: unknown;
  source: 'admin' | 'seed';
  updatedAt: Date;
  updatedBy?: string;
}
const contentCol = async () => (await db()).collection<ContentDoc>('content');
const leadsCol = async () => (await db()).collection<Lead & { _id: string }>('leads');
const bucket = async () => new GridFSBucket(await db(), { bucketName: 'uploads' });

/* ---- content: the cache pages read from ---------------------------------------- */

const REFRESH_MS = 5000;

function cache() {
  shared.cache ??= { map: new Map(), loadedAt: 0 };
  return shared.cache;
}

function loadFromFiles(): Map<string, unknown> {
  const map = new Map<string, unknown>();
  try {
    for (const file of fs.readdirSync(CONTENT_DIR)) {
      if (!file.endsWith('.json')) continue;
      try {
        map.set(
          file.slice(0, -5),
          JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8')),
        );
      } catch {
        // A broken file is skipped; the original content shows.
      }
    }
  } catch {
    // Nothing saved yet.
  }
  return map;
}

/** (Re)load every admin edit into the cache. Safe to call often; calls share one load. */
export function loadContent(): Promise<void> {
  const c = cache();
  if (!usingMongo()) {
    c.map = loadFromFiles();
    c.loadedAt = Date.now();
    return Promise.resolve();
  }
  c.loading ??= (async () => {
    try {
      const docs = await (
        await contentCol()
      )
        .find({ source: 'admin' }, { projection: { value: 1 } })
        .toArray();
      c.map = new Map(docs.map((doc) => [doc._id, doc.value]));
      c.loadedAt = Date.now();
    } catch (error) {
      console.error('[cms] Could not load content from MongoDB:', (error as Error).message);
    } finally {
      c.loading = undefined;
    }
  })();
  return c.loading;
}

/** Wait for the first load only (a cold start); afterwards resolves at once. */
export function contentReady(): Promise<void> {
  return cache().loadedAt === 0 ? loadContent() : Promise.resolve();
}

/** The admin's version of a section, or undefined for the original. Never waits. */
export function readContent(id: string): unknown {
  const c = cache();
  if (Date.now() - c.loadedAt > REFRESH_MS) void loadContent();
  return c.map.get(id);
}

/** Every admin edit, for the browser copy the root layout writes out. */
export function allContent(): Record<string, unknown> {
  readContent('');
  return Object.fromEntries(cache().map);
}

export async function writeContent(id: string, value: unknown, user = 'admin') {
  if (usingMongo()) {
    await (
      await contentCol()
    ).updateOne(
      { _id: id },
      { $set: { value, source: 'admin', updatedAt: new Date(), updatedBy: user } },
      { upsert: true },
    );
  } else {
    ensureDir(CONTENT_DIR);
    const file = path.join(CONTENT_DIR, `${safeId(id)}.json`);
    fs.writeFileSync(`${file}.tmp`, JSON.stringify(value, null, 2));
    fs.renameSync(`${file}.tmp`, file);
  }
  cache().map.set(id, value);
}

/** Back to the code's original. In MongoDB the section is kept, as a seed copy. */
export async function resetContent(id: string, original: unknown) {
  if (usingMongo()) {
    await (
      await contentCol()
    ).updateOne(
      { _id: id },
      {
        $set: { value: original, source: 'seed', updatedAt: new Date() },
        $unset: { updatedBy: '' },
      },
      { upsert: true },
    );
  } else {
    fs.rmSync(path.join(CONTENT_DIR, `${safeId(id)}.json`), { force: true });
  }
  cache().map.delete(id);
}

/**
 * Store every section's original content in MongoDB, so the database holds the
 * whole site. Sections nobody has edited are refreshed from the code each
 * time (so code changes still reach them); edited sections are never touched.
 */
export async function syncSeeds(originals: { id: string; value: unknown }[]) {
  if (!usingMongo() || originals.length === 0) return;
  const col = await contentCol();
  const now = new Date();
  await col
    .bulkWrite(
      originals.map(({ id, value }) => ({
        updateOne: {
          filter: { _id: id, source: { $ne: 'admin' } },
          update: { $set: { value, source: 'seed' as const, updatedAt: now } },
          upsert: true,
        },
      })),
      { ordered: false },
    )
    .catch((error: { code?: number; message: string }) => {
      // An upsert that meets an admin-edited section reports a duplicate key:
      // that section is exactly the one we must not overwrite.
      if (error.code !== 11000 && !/E11000/.test(error.message)) throw error;
    });
}

installReader(readContent);

/* ---- uploads -------------------------------------------------------------------- */

const ALLOWED = /\.(png|jpe?g|webp|avif|gif|svg|mp4|webm|pdf)$/i;
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

export const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
};

export function isAllowedUpload(name: string) {
  return ALLOWED.test(name);
}

function uploadName(original: string) {
  const ext = path.extname(original).toLowerCase();
  const base =
    path
      .basename(original, path.extname(original))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'file';
  return `${Date.now().toString(36)}-${base}${ext}`;
}

/** Save an upload; resolves to its public URL under /uploads. */
export async function saveUpload(original: string, data: Buffer): Promise<string> {
  const name = uploadName(original);
  if (usingMongo()) {
    const b = await bucket();
    await new Promise<void>((resolve, reject) => {
      const stream = b.openUploadStream(name, {
        metadata: {
          originalName: original,
          contentType: CONTENT_TYPES[path.extname(name)] ?? 'application/octet-stream',
        },
      });
      stream.once('finish', () => resolve());
      stream.once('error', reject);
      stream.end(data);
    });
  } else {
    ensureDir(UPLOAD_DIR);
    fs.writeFileSync(path.join(UPLOAD_DIR, name), data);
  }
  return `/uploads/${name}`;
}

/** An uploaded file's bytes, for the /uploads route. */
export async function readUpload(name: string): Promise<Buffer | null> {
  const file = path.basename(name);
  if (usingMongo()) {
    const b = await bucket();
    const found = await b.find({ filename: file }).limit(1).toArray();
    if (found.length === 0) return null;
    const chunks: Buffer[] = [];
    for await (const chunk of b.openDownloadStream(found[0]._id)) chunks.push(chunk as Buffer);
    return Buffer.concat(chunks);
  }
  const full = path.join(UPLOAD_DIR, file);
  return full.startsWith(UPLOAD_DIR) && fs.existsSync(full) ? fs.readFileSync(full) : null;
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
        url: `${urlBase}/${encodeURIComponent(entry.name)}`,
        name: entry.name,
        size: stat.size,
        uploaded,
        modified: stat.mtimeMs,
      });
    }
  }
}

/** Uploaded files first (newest first), then the site's own images. */
export async function listMedia(): Promise<MediaItem[]> {
  let uploads: MediaItem[] = [];
  if (usingMongo()) {
    const files = await (await bucket()).find({}).sort({ uploadDate: -1 }).toArray();
    uploads = files.map((f) => ({
      url: `/uploads/${f.filename}`,
      name: f.filename,
      size: f.length,
      uploaded: true,
      modified: f.uploadDate.getTime(),
    }));
  } else {
    walk(UPLOAD_DIR, '/uploads', true, uploads);
    uploads.sort((a, b) => b.modified - a.modified);
  }
  const site: MediaItem[] = [];
  walk(path.join(process.cwd(), 'public', 'media'), '/media', false, site);
  walk(path.join(process.cwd(), 'public', 'designs'), '/designs', false, site);
  return [...uploads, ...site];
}

export async function deleteUpload(url: string): Promise<boolean> {
  if (!url.startsWith('/uploads/')) return false;
  const name = path.basename(decodeURIComponent(url));
  if (usingMongo()) {
    const b = await bucket();
    const found = await b.find({ filename: name }).toArray();
    for (const file of found) await b.delete(file._id);
    return found.length > 0;
  }
  fs.rmSync(path.join(UPLOAD_DIR, name), { force: true });
  return true;
}

/* ---- leads --------------------------------------------------------------------- */

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

function readLeadsFile(): Lead[] {
  try {
    return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')) as Lead[];
  } catch {
    return [];
  }
}

function writeLeadsFile(leads: Lead[]) {
  ensureDir(DATA_DIR);
  fs.writeFileSync(`${LEADS_FILE}.tmp`, JSON.stringify(leads, null, 2));
  fs.renameSync(`${LEADS_FILE}.tmp`, LEADS_FILE);
}

/** Newest first. */
export async function readLeads(): Promise<Lead[]> {
  if (!usingMongo()) return readLeadsFile();
  const docs = await (await leadsCol()).find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(({ _id, ...lead }) => ({ ...lead, id: _id }));
}

export async function addLead(input: Omit<Lead, 'id' | 'createdAt' | 'status'>): Promise<Lead> {
  const lead: Lead = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'new',
    ...input,
  };
  if (usingMongo()) {
    const { id, ...rest } = lead;
    await (await leadsCol()).insertOne({ _id: id, id, ...rest });
  } else {
    writeLeadsFile([lead, ...readLeadsFile()]);
  }
  return lead;
}

export async function updateLead(id: string, patch: Partial<Pick<Lead, 'status' | 'note'>>) {
  if (usingMongo()) {
    await (await leadsCol()).updateOne({ _id: id }, { $set: patch });
  } else {
    writeLeadsFile(readLeadsFile().map((lead) => (lead.id === id ? { ...lead, ...patch } : lead)));
  }
}

export async function deleteLead(id: string) {
  if (usingMongo()) {
    await (await leadsCol()).deleteOne({ _id: id });
  } else {
    writeLeadsFile(readLeadsFile().filter((lead) => lead.id !== id));
  }
}
