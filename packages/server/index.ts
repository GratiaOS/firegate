import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import rateLimit from 'express-rate-limit';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { homedir } from 'node:os';
import {
  computeRuntimeDecision,
  flattenEntries,
  matchesTape,
  resolveEntryRef,
  toNumberOrNull,
  validateVaultMap,
  type VaultEntry,
} from '../../shared/src/policyCore';

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

const DEFAULT_VAULT_MAP = path.resolve(homedir(), 'Desktop/VIP/vault_map.json');
const readJsonFile = async (filePath: string): Promise<unknown> => {
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw);
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
    const vaultMap = await readJsonFile(vaultMapPath);
    const validation = validateVaultMap(vaultMap);
    if (!validation.valid) {
      res.status(500).json({
        error: 'vault_schema_invalid',
        detail: validation.errors.slice(0, 5).join('; '),
      });
      return;
    }
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

    const resolved = await resolveEntryRef(selected, (entryRef) =>
      readJsonFile(path.resolve(vaultRoot, entryRef))
    );
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
