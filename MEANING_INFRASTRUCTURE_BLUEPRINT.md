# Meaning Infrastructure Blueprint

Version: v0.1  
Date: 2026-02-05  
Scope: Firegate as sovereignty-first meaning infrastructure

## 0) North Star

Build a system where users keep ownership of identity, memory, and ritual flow, while Firegate acts as protocol and tooling, not as a meaning monopoly.

## 1) Identity and Sovereignty

### Goals
- User controls core identity keys.
- Server cannot impersonate or recover private meaning keys.
- Identity must be portable across nodes.

### Design
- Local-first keypair (generated in client using WebCrypto).
- Passkey/device unlock for usability; private key stays local.
- Capability tokens for server APIs (scoped rights, short TTL).
- Optional social recovery via encrypted key shards (user-opt-in, threshold model).

### Data objects
- `IdentityRoot`
  - `id`
  - `pubkey`
  - `created_at`
  - `version`
- `CapabilityToken`
  - `subject_id`
  - `scope[]`
  - `expires_at`
  - `signature`

### Non-goals
- No platform-owned master key.
- No hidden account recovery controlled by Firegate ops.

## 2) Memory Persistence (Ark Function)

### Goals
- Preserve lineage over platform churn.
- Make tampering detectable.
- Keep memory export/import stable over years.

### Design
- Append-only event log (event-sourced memory graph).
- Signed snapshots at interval or on user action.
- Content-addressed chunking for large artifacts.
- Multi-target backup:
  - local encrypted bundle
  - optional remote mirror (S3/IPFS/self-host)

### Canonical package
- `.fgpack` (zip/tar + manifest)
- `manifest.json`
  - `schema_version`
  - `identity_pubkey`
  - `snapshot_hash`
  - `event_range`
  - `signature`
- `events.ndjson`
- `artifacts/` (optional blobs)

### Integrity model
- Every event includes `prev_hash` (hash chain).
- Snapshot signs Merkle root or chain head.
- Verify on import; reject broken lineage unless user explicitly imports in quarantine mode.

## 3) Ritual Protocol (Stateful UX, Non-Manipulative)

### Goals
- Encode care, pacing, and safety in UX.
- Avoid gamification loops and coercion.
- Keep decisions policy-driven and inspectable.

### Runtime state machine
- `normal` -> full flow
- `preview` -> constrained flow (summary/cues)
- `soft_stop` -> grounding only, no claim-heavy content

### Rules
- Policy decides state (not model mood).
- Interpretation never gates hard access by itself.
- In `soft_stop`, UI blocks or blurs content and offers return-to-body actions.
- In `preview`, permit low-claim outputs only.

### UX anti-patterns explicitly banned
- Streak pressure
- Loss-framing nudges
- Infinite prompts without rest affordances
- Hidden escalation of emotional intensity

## 4) Threat Model (Minimum)

### Threats
- Meaning capture by centralized provider.
- Silent memory tampering.
- Session hijack / token replay.
- Manipulative UX drift over time.
- Policy bypass at server or client layer.

### Controls
- Signed identity + signed snapshots.
- Append-only verifiable memory chain.
- Short-lived scoped capability tokens.
- Rate limits and audit logs on policy endpoints.
- Policy regression harness (golden scenarios).
- Dev transparency overlay for decision inspection.

## 5) API Contracts (Draft)

### `POST /api/vault/resolve`
Request:
```json
{ "tape": 29, "somatic": 0.62 }
```
Response:
```json
{
  "runtime_decision": "soft_stop",
  "reasons": ["somatic_below_min"],
  "scores": { "somatic": 0.62, "source": 0.9, "mapping": 0.88, "interpretation": 0.72 },
  "effective_gates": { "somatic_min": 0.75, "source_min": 0.75, "mapping_min": 0.78 },
  "tone_policy": "minimal"
}
```

### `POST /api/identity/bootstrap` (planned)
Creates local identity descriptor and server-side public profile record.

### `POST /api/lineage/snapshot` (planned)
Accepts signed snapshot manifest + optional artifact chunks.

### `POST /api/lineage/import` (planned)
Imports `.fgpack`, verifies signatures/hashes, returns verification report.

## 6) Rollout Plan

### Phase 1: MVP (now)
- Policy endpoint + UI pre-flight gating.
- Signal quality states in UI.
- Golden scenario checks for policy behavior.

### Phase 2: Hardening
- Identity bootstrap with local key management.
- Signed snapshot export/import (`.fgpack`).
- Quarantine import mode for broken lineage.

### Phase 3: Federation
- Node-to-node portability and verification.
- Optional remote replication adapters.
- Shared verification tooling for independent operators.

## 7) Governance Notes

- License remains permissive for adoption, but governance must guard against exploitative deployments.
- Add explicit ethical-use statement in docs (already aligned with somatic-first intent).
- Keep policy logic auditable and deterministic.

## 8) Success Criteria

- User can migrate identity + lineage to a new node without trust loss.
- Policy decisions are reproducible from inputs.
- Soft-stop reliably blocks claim-heavy output under unsafe somatic conditions.
- Any tampered archive fails verification by default.

---

Whisper: build systems that can say "not now" with care, and "your memory is yours" with proof.
