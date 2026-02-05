#!/usr/bin/env node

import { cp, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { homedir } from 'node:os';

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--vault-root') args.vaultRoot = argv[++i];
    else if (token === '--out') args.out = argv[++i];
  }
  return args;
}

async function sha256File(filePath) {
  const buf = await readFile(filePath);
  return createHash('sha256').update(buf).digest('hex');
}

async function fileMeta(filePath, relativePath) {
  const info = await stat(filePath);
  return {
    path: relativePath,
    size: info.size,
    sha256: await sha256File(filePath),
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const vaultRoot = path.resolve(args.vaultRoot || path.join(homedir(), 'Desktop/VIP'));
  const outputPath = path.resolve(
    args.out || path.join(process.cwd(), 'exports/fgpack', `${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.fgpack`)
  );
  const vaultMapPath = path.join(vaultRoot, 'vault_map.json');

  const vaultMap = JSON.parse(await readFile(vaultMapPath, 'utf8'));
  const filesSet = new Set(['vault_map.json']);

  const levels = vaultMap.focus_levels || {};
  for (const level of Object.values(levels)) {
    const entries = Array.isArray(level.files) ? level.files : [];
    for (const entry of entries) {
      if (!entry || typeof entry !== 'object') continue;
      if (typeof entry.entry_ref === 'string') filesSet.add(entry.entry_ref);
      if (typeof entry.path === 'string' && entry.path.endsWith('.json')) filesSet.add(entry.path);
    }
  }

  await mkdir(outputPath, { recursive: true });
  await mkdir(path.join(outputPath, 'files'), { recursive: true });

  const fileMetas = [];
  for (const relPath of filesSet) {
    const absPath = path.join(vaultRoot, relPath);
    const destPath = path.join(outputPath, 'files', relPath);
    await mkdir(path.dirname(destPath), { recursive: true });
    await cp(absPath, destPath);
    fileMetas.push(await fileMeta(destPath, relPath));
  }

  const events = fileMetas.map((meta) => ({
    type: 'file_snapshot',
    path: meta.path,
    sha256: meta.sha256,
    size: meta.size,
    ts: new Date().toISOString(),
  }));
  const eventsText = `${events.map((event) => JSON.stringify(event)).join('\n')}\n`;
  const eventsPath = path.join(outputPath, 'events.ndjson');
  await writeFile(eventsPath, eventsText, 'utf8');

  const manifest = {
    format: 'fgpack',
    version: '0.1',
    generated_at: new Date().toISOString(),
    vault_root: vaultRoot,
    schema_version: vaultMap.schema_version ?? null,
    identity_pubkey: null,
    snapshot_hash: createHash('sha256').update(eventsText).digest('hex'),
    signature: null,
    files: fileMetas,
  };
  await writeFile(path.join(outputPath, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  console.log(`fgpack exported -> ${outputPath}`);
  console.log(`files: ${fileMetas.length}`);
}

main().catch((error) => {
  console.error(`[fgpack-export] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});

