import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import rateLimit from 'express-rate-limit';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { homedir } from 'node:os';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const vaultResolveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many vault resolve requests. Please try again later.' },
});

type SignalStatus = 'normal' | 'preview' | 'soft_stop';

type VaultEntry = {
  focus?: string;
  focus_label?: string | null;
  path?: string;
  entry_ref?: string;
  tape_id?: string;
  status?: string;
  source_exists?: boolean;
  confidence_breakdown?: {
    somatic?: number;
    source?: number;
    mapping?: number;
    interpretation?: number;
  };
  runtime_policy?: {
    gating?: {
      soft_stop_if?: string[];
      preview_mode_if?: string[];
    };
  };
};

const DEFAULT_GATES = {
  somatic_min: 0.8,
  source_min: 0.75,
  mapping_min: 0.7,
};

const DEFAULT_VAULT_MAP = path.resolve(homedir(), 'Desktop/VIP/vault_map.json');

const toNumberOrNull = (value: unknown): number | null => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const parseGateThreshold = (conditions: unknown, metric: string): number | null => {
  if (!Array.isArray(conditions)) return null;
  const matcher = new RegExp(`\\b${metric}\\s*<\\s*(\\d+(?:\\.\\d+)?)`, 'i');
  for (const condition of conditions) {
    if (typeof condition !== 'string') continue;
    const match = condition.match(matcher);
    if (!match) continue;
    const parsed = toNumberOrNull(match[1]);
    if (parsed !== null) return parsed;
  }
  return null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const flattenEntries = (vaultMap: unknown): VaultEntry[] => {
  const rows: VaultEntry[] = [];
  if (!isRecord(vaultMap)) return rows;
  const levels = isRecord(vaultMap.focus_levels) ? vaultMap.focus_levels : {};
  for (const [focus, meta] of Object.entries(levels)) {
    if (!isRecord(meta)) continue;
    const files = Array.isArray(meta.files) ? meta.files : [];
    const focusLabel = typeof meta.label === 'string' ? meta.label : null;
    for (const file of files) {
      if (typeof file === 'string') {
        rows.push({ focus, focus_label: focusLabel, path: file });
        continue;
      }
      if (!isRecord(file)) continue;
      rows.push({
        focus,
        focus_label: focusLabel,
        ...file,
      });
    }
  }
  return rows;
};

const matchesTape = (entry: VaultEntry, tape: string | number): boolean => {
  const needle = String(tape).toLowerCase();
  const tapeId = entry.tape_id ? String(entry.tape_id).toLowerCase() : '';
  const entryPath = (entry.path || '').toLowerCase();
  return tapeId === needle || entryPath.includes(`#${needle}`) || entryPath.includes(`tape #${needle}`);
};

const resolveEntry = async (entry: VaultEntry, vaultRoot: string): Promise<VaultEntry & { resolved_mode: string }> => {
  if (!entry.entry_ref) {
    return { ...entry, resolved_mode: 'index_only' };
  }
  const refPath = path.resolve(vaultRoot, entry.entry_ref);
  try {
    const raw = await readFile(refPath, 'utf8');
    const referenced = JSON.parse(raw);
    return {
      ...entry,
      ...referenced,
      entry_ref: entry.entry_ref,
      resolved_mode: 'entry_ref',
    };
  } catch {
    return { ...entry, resolved_mode: 'index_fallback' };
  }
};

const computeRuntimeDecision = (
  entry: VaultEntry & { resolved_mode: string },
  overrides?: { somatic?: number; source?: number; mapping?: number; interpretation?: number }
) => {
  const scoresRaw = entry.confidence_breakdown ?? {};
  const scores = {
    somatic: toNumberOrNull(overrides?.somatic ?? scoresRaw.somatic),
    source: toNumberOrNull(overrides?.source ?? scoresRaw.source),
    mapping: toNumberOrNull(overrides?.mapping ?? scoresRaw.mapping),
    interpretation: toNumberOrNull(overrides?.interpretation ?? scoresRaw.interpretation),
  };

  const gating = entry.runtime_policy?.gating ?? {};
  const effectiveGates = {
    somatic_min: parseGateThreshold(gating.soft_stop_if, 'somatic') ?? DEFAULT_GATES.somatic_min,
    source_min: parseGateThreshold(gating.soft_stop_if, 'source') ?? DEFAULT_GATES.source_min,
    mapping_min: parseGateThreshold(gating.preview_mode_if, 'mapping') ?? DEFAULT_GATES.mapping_min,
  };

  const reasons: string[] = [];
  let runtimeDecision: SignalStatus = 'normal';
  if (scores.somatic !== null && scores.somatic < effectiveGates.somatic_min) reasons.push('somatic_below_min');
  if (scores.source !== null && scores.source < effectiveGates.source_min) reasons.push('source_below_min');

  if (reasons.length > 0) {
    runtimeDecision = 'soft_stop';
  } else {
    if (scores.mapping !== null && scores.mapping < effectiveGates.mapping_min) reasons.push('mapping_below_min');
    if (entry.source_exists === false) reasons.push('source_missing');
    if (reasons.length > 0) runtimeDecision = 'preview';
  }

  const tonePolicy = scores.interpretation !== null && scores.interpretation < 0.7 ? 'no_claims' : 'minimal';

  return {
    resolved_mode: entry.resolved_mode,
    runtime_decision: runtimeDecision,
    reasons: reasons.slice(0, 3),
    scores,
    effective_gates: effectiveGates,
    tone_policy: tonePolicy,
    path: entry.path ?? null,
    tape_id: entry.tape_id ?? null,
    status: entry.status ?? null,
  };
};

const handleVaultResolve = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.method === 'POST' ? (req.body ?? {}) : {};
    const tape = (body.tape ?? req.query.tape) as string | number | undefined;
    const pathQuery = (body.path ?? req.query.path) as string | undefined;
    const scoreOverrides = {
      somatic: toNumberOrNull(body.somatic ?? req.query.somatic ?? body.somaticScore ?? req.query.somaticScore) ?? undefined,
      source: toNumberOrNull(body.source ?? req.query.source) ?? undefined,
      mapping: toNumberOrNull(body.mapping ?? req.query.mapping) ?? undefined,
      interpretation: toNumberOrNull(body.interpretation ?? req.query.interpretation) ?? undefined,
    };

    if (!tape && !pathQuery) {
      res.status(400).json({ error: 'Missing query. Provide tape or path.' });
      return;
    }

    const vaultMapPath = process.env.VIP_VAULT_MAP_PATH || DEFAULT_VAULT_MAP;
    const vaultRoot = path.dirname(vaultMapPath);
    const raw = await readFile(vaultMapPath, 'utf8');
    const vaultMap = JSON.parse(raw);
    const entries = flattenEntries(vaultMap);

    let selected: VaultEntry | undefined;
    if (tape !== undefined) selected = entries.find((entry) => matchesTape(entry, tape));
    if (!selected && pathQuery) {
      const needle = String(pathQuery).toLowerCase();
      selected = entries.find((entry) => (entry.path || '').toLowerCase().includes(needle));
    }

    if (!selected) {
      res.status(404).json({ error: 'No matching vault entry.' });
      return;
    }

    const resolved = await resolveEntry(selected, vaultRoot);
    const out = computeRuntimeDecision(resolved, scoreOverrides);
    res.json(out);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: 'vault_resolve_failed', detail });
  }
};

// 🌌 Unified /api/nova – online + offline fallback
const handleNova = async (req: Request, res: Response): Promise<void> => {
  const { prompt, preferLocal = true } = req.body as { prompt: string; preferLocal?: boolean };
  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({ error: 'Missing OPENAI_API_KEY in server config (.env)' });
    return;
  }
  const fullPrompt = `
You are Nova. Keep it somatic and minimal.

Hard rules:
- Do NOT infer user emotions or motives (no "you seem", no "this indicates").
- Do NOT mention nicotine, addiction, therapy, meditation, diagnoses, or advice.
- Reply in exactly 4 points:
  1. Observation: ...
  2. Body signal: ... (or "—" if unknown)
  3. Small step: ...
  4. Close: Done.
- Keep each point short and practical.

Return strict JSON:
{
"reply": "...",
"level": "CE0|CE1|CE2|CE3|CE4|CE5|AE"
}

User prompt: ${prompt}
`.trim();

  const tryOnline = async () => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: fullPrompt }],
        temperature: 0.6,
      }),
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content;
  };

  const tryLocal = async () => {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'nova-egg', prompt: fullPrompt, stream: false }),
    });
    const result = await response.json();
    return result.response;
  };

  try {
    let raw;
    if (preferLocal) {
      raw = await tryLocal();
    } else {
      try {
        raw = await tryOnline();
      } catch {
        raw = await tryLocal();
      }
    }
    raw = raw.replace(/```(?:json)?/g, '').trim();
    const match = raw.match(/\{[\s\S]*\}/);
    let jsonText = match ? match[0] : raw;
    jsonText = jsonText.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

    try {
      const parsed = JSON.parse(jsonText);
      res.json({
        reply: parsed.reply?.trim() || '',
        level: parsed.level || 'CE0',
      });
      return;
    } catch {
      res.json({ reply: raw.trim(), level: 'CE0' });
      return;
    }
  } catch {
    res.status(500).json({ error: 'Nova backend failed.' });
  }
};

app.post('/api/nova', handleNova);
app.get('/api/vault/resolve', vaultResolveLimiter, handleVaultResolve);
app.post('/api/vault/resolve', vaultResolveLimiter, handleVaultResolve);

// 🌐 Unified Nova Translate Endpoint (Online + Offline)
app.post('/api/nova-translate', async (req: Request, res: Response) => {
  const {
    text,
    targetLang,
    preferLocal = true,
  } = req.body as { text: string; targetLang: string; preferLocal?: boolean };
  const prompt = `Translate the following UI label into ${targetLang}. Keep it short and clear for app UI. Do not translate names like “Nova” or “Firegate”.
  
  "${text}"`;

  const tryOnline = async () => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      }),
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim();
  };

  const tryLocal = async () => {
    const ollamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'nova-egg', prompt, stream: false }),
    });
    const result = await ollamaRes.json();
    return result.response?.trim();
  };

  try {
    let translation = preferLocal ? await tryLocal() : await tryOnline();
    if (!translation) throw new Error();
    res.json({ translation });
  } catch {
    res.status(500).json({ error: 'Nova translation failed' });
  }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
