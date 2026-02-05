export type SignalStatus = 'normal' | 'preview' | 'soft_stop';

export type ConfidenceBreakdown = {
  somatic?: number;
  source?: number;
  mapping?: number;
  interpretation?: number;
};

export type RuntimePolicy = {
  gating?: {
    soft_stop_if?: string[];
    preview_mode_if?: string[];
  };
};

export type VaultEntry = {
  focus?: string;
  focus_label?: string | null;
  path?: string;
  entry_ref?: string;
  tape_id?: string;
  status?: string;
  source_exists?: boolean;
  confidence_breakdown?: ConfidenceBreakdown;
  runtime_policy?: RuntimePolicy;
};

export type VaultResolvedEntry = VaultEntry & {
  resolved_mode: 'entry_ref' | 'index_only' | 'index_fallback';
};

export type RuntimeDecision = {
  resolved_mode: VaultResolvedEntry['resolved_mode'];
  runtime_decision: SignalStatus;
  reasons: string[];
  scores: {
    somatic: number | null;
    source: number | null;
    mapping: number | null;
    interpretation: number | null;
  };
  effective_gates: {
    somatic_min: number;
    source_min: number;
    mapping_min: number;
  };
  tone_policy: 'no_claims' | 'minimal';
  path: string | null;
  tape_id: string | null;
  status: string | null;
};

export const DEFAULT_GATES = {
  somatic_min: 0.8,
  source_min: 0.75,
  mapping_min: 0.7,
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const toNumberOrNull = (value: unknown): number | null => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

export const parseGateThreshold = (conditions: unknown, metric: string): number | null => {
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

export const flattenEntries = (vaultMap: unknown): VaultEntry[] => {
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

export const matchesTape = (entry: VaultEntry, tape: string | number): boolean => {
  const needle = String(tape).toLowerCase();
  const tapeId = entry.tape_id ? String(entry.tape_id).toLowerCase() : '';
  const entryPath = (entry.path || '').toLowerCase();
  return tapeId === needle || entryPath.includes(`#${needle}`) || entryPath.includes(`tape #${needle}`);
};

export const validateVaultMap = (vaultMap: unknown): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (!isRecord(vaultMap)) {
    return { valid: false, errors: ['vault_map must be a JSON object'] };
  }

  if (typeof vaultMap.schema_version !== 'string') {
    errors.push('schema_version must be a string');
  }

  if (!isRecord(vaultMap.focus_levels)) {
    errors.push('focus_levels must be an object');
    return { valid: errors.length === 0, errors };
  }

  for (const [focusKey, levelValue] of Object.entries(vaultMap.focus_levels)) {
    if (!isRecord(levelValue)) {
      errors.push(`focus_levels.${focusKey} must be an object`);
      continue;
    }
    if (!Array.isArray(levelValue.files)) {
      errors.push(`focus_levels.${focusKey}.files must be an array`);
      continue;
    }
    for (let i = 0; i < levelValue.files.length; i += 1) {
      const file = levelValue.files[i];
      if (typeof file === 'string') continue;
      if (!isRecord(file)) {
        errors.push(`focus_levels.${focusKey}.files[${i}] must be string or object`);
        continue;
      }
      if (typeof file.path !== 'string') {
        errors.push(`focus_levels.${focusKey}.files[${i}].path must be a string`);
      }
      if (file.confidence_breakdown !== undefined && !isRecord(file.confidence_breakdown)) {
        errors.push(`focus_levels.${focusKey}.files[${i}].confidence_breakdown must be an object`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
};

export const resolveEntryRef = async (
  entry: VaultEntry,
  readReferencedEntry: (entryRef: string) => Promise<unknown>
): Promise<VaultResolvedEntry> => {
  if (!entry.entry_ref) {
    return { ...entry, resolved_mode: 'index_only' };
  }

  try {
    const referenced = await readReferencedEntry(entry.entry_ref);
    if (!isRecord(referenced)) {
      return { ...entry, resolved_mode: 'index_fallback' };
    }
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

export const computeRuntimeDecision = (
  entry: VaultResolvedEntry,
  overrides?: { somatic?: number; source?: number; mapping?: number; interpretation?: number }
): RuntimeDecision => {
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
    tape_id: entry.tape_id ? String(entry.tape_id) : null,
    status: entry.status ?? null,
  };
};
