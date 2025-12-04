import React, { useMemo, useState } from 'react';
import type {
  FieldState,
  KernelEvent,
  KernelLayerId,
  LayerState,
  ReligareRule,
} from '../../../../kernel/src/types';
import processedSceneJson from '../../../../kernel/examples/apprenticeship.processed.json' with { type: 'json' };
import { GratiaFridgeCard } from './GratiaFridgeCard';
import { KernelTraceView } from './KernelTraceView';

type LayerStackEntry = {
  layer: string;
  title?: string;
  description?: string;
  status?: string;
};

type ProcessedScene = {
  sceneId: string;
  processedAt: string;
  org?: string;
  anchor?: { plusCode?: string; timezone?: string };
  witnessedBy?: string[];
  scene: {
    title: string;
    headline: string;
    kind: string;
    actors?: string[];
    fieldSignature?: string;
  };
  fieldShift?: {
    from?: { vibe?: string; keywords?: string[] };
    to?: { vibe?: string; keywords?: string[] };
  };
  layerStack?: LayerStackEntry[];
  kernelRule?: {
    id: string;
    title?: string;
    text: string;
    layersAffected?: string[];
  };
  nextActions?: string[];
};

const processedScene = processedSceneJson as ProcessedScene;

export const LightningApprenticeshipCard: React.FC = () => {
  const [showTrace, setShowTrace] = useState(false);

  const fridgeData = useMemo(() => {
    const timestamp = processedScene.processedAt?.replace('T', ' • ').slice(0, 16) ?? 'Scene';
    const ruleId = processedScene.kernelRule?.id ?? 'Kernel';
    const ruleDesc = processedScene.kernelRule?.text ?? '';
    const nextAction = processedScene.nextActions?.[0] ?? 'Continuăm să susținem vocea lui N.';

    const layerText = (startsWith: string, fallback: string) => {
      const entry = processedScene.layerStack?.find((l) => l.layer.startsWith(startsWith));
      return entry?.description ?? fallback;
    };

    return {
      id: processedScene.sceneId,
      timestamp,
      title: 'Lightning Apprenticeship — N',
      description: processedScene.scene.headline,
      layers: [
        { id: 'L2', name: 'Emoțional', value: layerText('L2', 'Calm + curiozitate') },
        { id: 'L4', name: 'Rol', value: layerText('L4', 'Apprentice / Young Builder') },
        { id: 'L6', name: 'Field', value: layerText('L6', 'Câmp aliniat cu Guardian') },
        { id: 'L7', name: 'Kernel', value: layerText('L7', ruleId) }
      ],
      kernelRule: ruleDesc ? `${ruleId}: ${ruleDesc}` : ruleId,
      nextAction
    };
  }, []);

  const traceScene = useMemo(() => {
    const asVibe = (value?: string): FieldState['vibe'] => {
      const upper = value?.toUpperCase();
      if (upper === 'CALM' || upper === 'CALM_EXPANSION' || upper === 'COHERENT_PRESENCE') return 'CALM';
      if (upper === 'TENSION') return 'TENSION';
      if (upper === 'EXPANSION') return 'EXPANSION';
      return 'FLUX';
    };

    const event: KernelEvent = {
      id: processedScene.sceneId,
      trigger: 'SENSORY',
      sourceTerritory: 'LIGHTNING',
      sceneDescription: processedScene.scene.headline,
      context: {
        timestamp: processedScene.processedAt,
        plusCode: processedScene.anchor?.plusCode,
        location: processedScene.scene.title,
        actors: processedScene.scene.actors,
        tags: ['apprenticeship', 'witnessed-by-water']
      }
    };

    const mapLayerId = (rawId: string): LayerState['layer'] => {
      if (rawId.startsWith('L1')) return 'L1_LOCAL';
      if (rawId.startsWith('L2')) return 'L2_EMOTIONAL';
      if (rawId.startsWith('L3')) return 'L3_MENTAL';
      if (rawId.startsWith('L4')) return 'L4_ARCHETYPAL';
      if (rawId.startsWith('L5')) return 'L5_TRANSGENERATIONAL';
      if (rawId.startsWith('L6')) return 'L6_FIELD';
      return 'L7_KERNEL';
    };

    const layerStates: LayerState[] =
      processedScene.layerStack?.map((entry) => ({
        layer: mapLayerId(entry.layer),
        eventId: processedScene.sceneId,
        summary: entry.description ?? entry.title
      })) ?? [];

    const rules: ReligareRule[] = processedScene.kernelRule
      ? [
          {
            ruleId: processedScene.kernelRule.id,
            description: processedScene.kernelRule.text,
            createdFromEventId: processedScene.sceneId,
            antecedent:
              "description CONȚINE 'young lightning' OR 'apprentice' AND field includes 'guardian_present'",
            consequent: "Field.vibe = 'COHERENT_PRESENCE'; Identity.state = 'Agency';",
            layersAffected: processedScene.kernelRule.layersAffected
              ?.map((id) => mapLayerId(id) as KernelLayerId)
              .filter(Boolean) as KernelLayerId[]
          }
        ]
      : [];

    const fieldSnapshots: FieldState[] = [];
    if (processedScene.fieldShift?.from) {
      fieldSnapshots.push({
        timestamp: processedScene.processedAt,
        vibe: asVibe(processedScene.fieldShift.from.vibe),
        activePatterns: processedScene.fieldShift.from.keywords ?? []
      });
    }
    if (processedScene.fieldShift?.to) {
      fieldSnapshots.push({
        timestamp: processedScene.processedAt,
        vibe: asVibe(processedScene.fieldShift.to.vibe),
        activePatterns: processedScene.fieldShift.to.keywords ?? []
      });
    }

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
