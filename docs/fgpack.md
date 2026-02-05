# `.fgpack` Format (Draft v0.1)

`fgpack` is Firegate's portable lineage archive format.

Goal: preserve memory continuity in a verifiable, self-hostable package.

## Layout

```text
<name>.fgpack/
  manifest.json
  events.ndjson
  files/
    vault_map.json
    tape_entries/tape_17.json
    tape_entries/tape_29.json
    ...
```

## `manifest.json`

```json
{
  "format": "fgpack",
  "version": "0.1",
  "generated_at": "2026-02-05T00:00:00.000Z",
  "vault_root": "/absolute/path/to/VIP",
  "schema_version": "2.1",
  "identity_pubkey": null,
  "snapshot_hash": "<sha256 of events.ndjson>",
  "signature": null,
  "files": [
    {
      "path": "vault_map.json",
      "size": 5895,
      "sha256": "<sha256>"
    }
  ]
}
```

Notes:
- `identity_pubkey` and `signature` are reserved for signed snapshots.
- `snapshot_hash` is the integrity anchor for `events.ndjson`.

## `events.ndjson`

Append-only event stream for lineage reconstruction.

Each line is one JSON object.

## Security model

- Imports should fail closed on hash mismatch.
- Verification must check every listed file hash + `snapshot_hash`.
- If verification fails, import in quarantine mode only (future behavior).

