# Changelog

All notable changes to this project are documented in this file.

## [0.1.0] - 2026-02-04

First S-Edition release for Firegate's somatic handshake loop.

### Added

- Memory Pool handshake path between UI and vault policy (`/api/vault/resolve`).
- Signal quality indicator with deterministic states: `normal`, `preview`, `soft_stop`.
- Soft-stop UI lock behavior (rose overlay + blur lock + return-to-body cue).
- Rotating somatic micro-tips for calibration and recovery states.
- Dev-only gate overlay (`[RESOLVE_LOG]`) for transparent policy debugging.
- Static grain overlay and somatic text-signal parser (`somaticFlagsFromText`).

### Changed

- Firegate now runs a pre-flight policy check before showing tape-derived flow.
- Runtime signal state now combines local somatic input and policy output.
- Prompt tone and placeholders aligned to somatic-first copy in EN/RO/ES.

### Fixed

- Browser timer refs typed correctly (`number | null`) to remove TS timeout mismatch.
- Removed unused `memory_aspects.json` seed file to avoid stale deterministic state.

### Security

- Added per-IP rate limiting on `GET/POST /api/vault/resolve` to protect filesystem-backed policy reads.

