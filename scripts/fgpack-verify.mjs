#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--pack') args.pack = argv[++i];
  }
  return args;
}

async function sha256Text(text) {
  return createHash('sha256').update(text).digest('hex');
}

async function sha256File(filePath) {
  const buf = await readFile(filePath);
  return createHash('sha256').update(buf).digest('hex');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.pack) {
    console.error('Usage: node scripts/fgpack-verify.mjs --pack <path-to.fgpack>');
    process.exit(1);
  }

  const packRoot = path.resolve(args.pack);
  const manifestPath = path.join(packRoot, 'manifest.json');
  const eventsPath = path.join(packRoot, 'events.ndjson');

  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const eventsText = await readFile(eventsPath, 'utf8');

  const errors = [];
  const snapshotHash = await sha256Text(eventsText);
  if (manifest.snapshot_hash !== snapshotHash) {
    errors.push(`snapshot_hash mismatch: expected ${manifest.snapshot_hash}, got ${snapshotHash}`);
  }

  const files = Array.isArray(manifest.files) ? manifest.files : [];
  for (const file of files) {
    const relPath = file.path;
    const expected = file.sha256;
    if (typeof relPath !== 'string' || typeof expected !== 'string') {
      errors.push(`invalid file entry: ${JSON.stringify(file)}`);
      continue;
    }
    const fullPath = path.join(packRoot, 'files', relPath);
    const actual = await sha256File(fullPath);
    if (actual !== expected) {
      errors.push(`hash mismatch for ${relPath}: expected ${expected}, got ${actual}`);
    }
  }

  if (errors.length > 0) {
    console.error('fgpack verification failed');
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log('fgpack verification OK');
  console.log(`files verified: ${files.length}`);
}

main().catch((error) => {
  console.error(`[fgpack-verify] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});

