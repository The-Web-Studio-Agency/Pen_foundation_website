#!/usr/bin/env node
/**
 * One-time move of CMS data from local files (cms-data/) into MongoDB.
 *
 *   node scripts/cms-migrate-to-mongo.mjs
 *
 * Reads MONGODB_URI / MONGODB_DB from the environment or .env.local.
 *   content/<id>.json  → content collection, as admin edits
 *   uploads/<file>     → GridFS "uploads", same file name (URLs keep working)
 *   leads.json         → leads collection
 * Safe to re-run: anything already in MongoDB is left alone. The files are
 * not deleted; keep cms-data/ as a backup until you have checked the admin.
 */

import fs from 'node:fs';
import path from 'node:path';

import { GridFSBucket, MongoClient } from 'mongodb';

const ROOT = path.resolve(import.meta.dirname, '..');
const DATA = path.join(ROOT, 'cms-data');

// Minimal .env.local reader (no dependency).
for (const file of ['.env.local', '.env']) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) continue;
  for (const line of fs.readFileSync(full, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set (in the environment or .env.local).');
  process.exit(1);
}
const client = await new MongoClient(uri).connect();
const db = client.db(process.env.MONGODB_DB || 'pen_foundation_cms');
const report = { content: 0, uploads: 0, leads: 0, skipped: 0 };

// Content: a file edit wins over a seed copy, never over an admin edit.
const contentDir = path.join(DATA, 'content');
if (fs.existsSync(contentDir)) {
  for (const file of fs.readdirSync(contentDir).filter((f) => f.endsWith('.json'))) {
    const id = file.slice(0, -5);
    const existing = await db.collection('content').findOne({ _id: id });
    if (existing?.source === 'admin') {
      report.skipped += 1;
      continue;
    }
    const value = JSON.parse(fs.readFileSync(path.join(contentDir, file), 'utf8'));
    await db.collection('content').updateOne(
      { _id: id },
      {
        $set: {
          value,
          source: 'admin',
          updatedAt: fs.statSync(path.join(contentDir, file)).mtime,
          updatedBy: 'migrated',
        },
      },
      { upsert: true },
    );
    report.content += 1;
  }
}

// Uploads, under the same names.
const uploadDir = path.join(DATA, 'uploads');
if (fs.existsSync(uploadDir)) {
  const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
  for (const name of fs.readdirSync(uploadDir)) {
    if ((await bucket.find({ filename: name }).limit(1).toArray()).length) {
      report.skipped += 1;
      continue;
    }
    await new Promise((resolve, reject) => {
      fs.createReadStream(path.join(uploadDir, name))
        .pipe(bucket.openUploadStream(name, { metadata: { originalName: name, migrated: true } }))
        .on('finish', resolve)
        .on('error', reject);
    });
    report.uploads += 1;
  }
}

// Leads.
const leadsFile = path.join(DATA, 'leads.json');
if (fs.existsSync(leadsFile)) {
  for (const lead of JSON.parse(fs.readFileSync(leadsFile, 'utf8'))) {
    const result = await db
      .collection('leads')
      .updateOne({ _id: lead.id }, { $setOnInsert: { _id: lead.id, ...lead } }, { upsert: true });
    if (result.upsertedCount) report.leads += 1;
    else report.skipped += 1;
  }
}

await client.close();
console.log(
  `Moved to MongoDB: ${report.content} content section(s), ${report.uploads} upload(s), ${report.leads} lead(s). Already there: ${report.skipped}.`,
);
