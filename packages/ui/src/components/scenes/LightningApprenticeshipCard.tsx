import React, { useMemo, useState } from 'react';
import type { FieldState, KernelEvent, LayerState, ReligareRule } from '@gratia/kernel';
import processedSceneJson from '@gratia/kernel/examples/n_lightning_apprenticeship.processed.json' with { type: 'json' };
import { GratiaFridgeCard } from './GratiaFridgeCard';
import { KernelTraceView } from './KernelTraceView';

// Keep scene typing local to avoid leaking kernel internals into UI
// (processed scenes may evolve independently from live data models).
type ProcessedScene = {
  id: string;
  timestamp: string;
  location?: { plus_code?: string; context?: string };
  description: string;
  participants?: Array<{ role: string; id: string }>;
  layers?: Record<string, string>;
  fieldShift?: {
    from?: string;
    to?: string;
    signatureEvent?: string;
  };
  kernelRuleWritten?: {
    id: string;
    description: string;
    layersAffected?: string[];
  };
  nextActions?: string[];
  emotionalSignature?: string;
  notes?: string;
};

type FullScene = ProcessedScene & {
  event?: KernelEvent;
  layerStates?: LayerState[];
  rules?: ReligareRule[];
  fieldSnapshots?: FieldState[];
};

const processedScene = processedSceneJson as unknown as FullScene;

export const LightningApprenticeshipCard: React.FC = () => {
  const [showTrace, setShowTrace] = useState(false);

  const fridgeData = useMemo(() => {
    const timestamp = processedScene.timestamp?.replace('T', ' • ').slice(0, 16) ?? 'Scene';
    const ruleId = processedScene.kernelRuleWritten?.id ?? 'Kernel';
    const ruleDesc = processedScene.kernelRuleWritten?.description ?? '';
    const nextAction = processedScene.nextActions?.[0] ?? 'Continuăm să susținem vocea lui N.';

    const layerText = (key: string, fallback: string) => {
      if (!processedScene.layers) return fallback;
      const value = processedScene.layers[key];
      return value || fallback;
    };

    return {
      id: processedScene.id,
      timestamp,
      title: 'Lightning Apprenticeship — N',
      description: processedScene.description,
      layers: [
        { id: 'L2', name: 'Emoțional', value: layerText('L2_EMOTIONAL', 'Calm + curiozitate') },
        { id: 'L4', name: 'Rol', value: layerText('L4_ARCHETYPE', 'Apprentice / Young Builder') },
        { id: 'L6', name: 'Field', value: layerText('L6_FIELD', 'Câmp aliniat cu Guardian') },
        { id: 'L7', name: 'Kernel', value: layerText('L7_KERNEL', ruleId) }
      ],
      kernelRule: ruleDesc ? `${ruleId}: ${ruleDesc}` : ruleId,
      nextAction
    };
  }, []);

  const traceScene = useMemo(() => {
    const event: KernelEvent = {
      id: processedScene.id,
      trigger: 'SENSORY',
      sourceTerritory: processedScene.participants?.find((p) => p.role === 'LIGHTNING') ? 'LIGHTNING' : 'ROOTS',
      sceneDescription: processedScene.description,
      context: {
        timestamp: processedScene.timestamp,
        plusCode: processedScene.location?.plus_code,
        location: processedScene.location?.context,
        actors: processedScene.participants?.map((p) => p.id),
        tags: ['apprenticeship', 'witnessed-by-water']
      }
    };

    const layerStates: LayerState[] = processedScene.layers
      ? Object.entries(processedScene.layers).map(([layerKey, summary]) => ({
          layer: layerKey as LayerState['layer'],
          eventId: processedScene.id,
          summary
        }))
      : [];

    const rules: ReligareRule[] = processedScene.kernelRuleWritten
      ? [
          {
            ruleId: processedScene.kernelRuleWritten.id,
            description: processedScene.kernelRuleWritten.description,
            createdFromEventId: processedScene.id,
            antecedent:
              "description CONȚINE 'young lightning' OR 'apprentice' AND field includes 'guardian_present'",
            consequent: "Field.vibe = 'COHERENT_PRESENCE'; Identity.state = 'Agency';",
            layersAffected: processedScene.kernelRuleWritten.layersAffected
          }
        ]
      : [];

    const fieldSnapshots: FieldState[] = processedScene.fieldShift
      ? [
          {
            timestamp: processedScene.timestamp,
            vibe: processedScene.fieldShift.from?.toUpperCase() || 'NEUTRAL',
            activePatterns: processedScene.fieldShift.signatureEvent ? [processedScene.fieldShift.signatureEvent] : []
          },
          {
            timestamp: processedScene.timestamp,
            vibe: processedScene.fieldShift.to?.toUpperCase() || 'COHERENT_PRESENCE',
            activePatterns: processedScene.fieldShift.signatureEvent ? [processedScene.fieldShift.signatureEvent] : []
          }
        ]
      : [];

    return { event, layerStates, rules, fieldSnapshots };
  }, []);

  return (
    <div className="relative w-full max-w-3xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-800 shadow-sm">
          WITNESSED BY WATER
        </div>
        <button
          type="button"
          onClick={() => setShowTrace((v) => !v)}
          className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-xs text-slate-200 transition-colors hover:border-purple-400 hover:text-purple-100"
        >
          {showTrace ? '◀︎ Fridge card' : 'Kernel trace ▶︎'}
        </button>
      </div>

      {showTrace ? (
        <KernelTraceView scene={traceScene} />
      ) : (
        <GratiaFridgeCard
          id={fridgeData.id}
          timestamp={fridgeData.timestamp}
          title={fridgeData.title}
          description={fridgeData.description}
          layers={fridgeData.layers}
          kernelRule={fridgeData.kernelRule}
          nextAction={fridgeData.nextAction}
        />
      )}
    </div>
  );
};
