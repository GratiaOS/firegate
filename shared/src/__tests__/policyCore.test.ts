import { describe, expect, it } from 'vitest';
import {
  computeRuntimeDecision,
  flattenEntries,
  resolveEntryRef,
  validateVaultMap,
  type VaultEntry,
} from '../policyCore';

const baseEntry: VaultEntry = {
  path: 'Explorer Tape #29 - Aspects (Unedited Transcript).pdf',
  tape_id: '29',
  source_exists: true,
  confidence_breakdown: {
    somatic: 0.95,
    source: 0.9,
    mapping: 0.88,
    interpretation: 0.72,
  },
  runtime_policy: {
    gating: {
      soft_stop_if: ['somatic < 0.75', 'source < 0.75'],
      preview_mode_if: ['mapping < 0.78'],
    },
  },
};

describe('policyCore.validateVaultMap', () => {
  it('fails closed when schema_version is missing', () => {
    const result = validateVaultMap({
      focus_levels: {},
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.includes('schema_version'))).toBe(true);
  });

  it('accepts a minimal valid vault map', () => {
    const result = validateVaultMap({
      schema_version: '2.1',
      focus_levels: {
        '12': {
          label: 'expanded_mapping_and_patterns',
          files: [{ path: 'Explorer Tape #17 - The Patrick Event (Transcript).pdf' }],
        },
      },
    });
    expect(result.valid).toBe(true);
  });
});

describe('policyCore.computeRuntimeDecision', () => {
  it('returns soft_stop when somatic falls under gate', () => {
    const output = computeRuntimeDecision(
      {
        ...baseEntry,
        resolved_mode: 'entry_ref',
      },
      { somatic: 0.62 }
    );

    expect(output.runtime_decision).toBe('soft_stop');
    expect(output.reasons).toContain('somatic_below_min');
  });

  it('returns preview when mapping falls under gate', () => {
    const output = computeRuntimeDecision(
      {
        ...baseEntry,
        resolved_mode: 'entry_ref',
      },
      { mapping: 0.6 }
    );

    expect(output.runtime_decision).toBe('preview');
    expect(output.reasons).toContain('mapping_below_min');
  });

  it('returns normal when all values are inside gates', () => {
    const output = computeRuntimeDecision({
      ...baseEntry,
      resolved_mode: 'entry_ref',
    });

    expect(output.runtime_decision).toBe('normal');
    expect(output.reasons).toHaveLength(0);
  });
});

describe('policyCore.resolveEntryRef + flattenEntries', () => {
  it('loads referenced entry and preserves resolved mode', async () => {
    const vaultMap = {
      schema_version: '2.1',
      focus_levels: {
        '21': {
          label: 'integration_and_lineage_bridge',
          files: [
            {
              path: 'Explorer Tape #29 - Aspects (Unedited Transcript).pdf',
              entry_ref: 'tape_entries/tape_29.json',
            },
          ],
        },
      },
    };
    const [entry] = flattenEntries(vaultMap);
    const resolved = await resolveEntryRef(entry, async () => ({
      ...baseEntry,
      status: 'ready',
    }));

    expect(resolved.resolved_mode).toBe('entry_ref');
    expect(resolved.status).toBe('ready');
  });
});
