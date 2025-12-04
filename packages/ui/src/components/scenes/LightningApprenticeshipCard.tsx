import React, { useMemo } from 'react';
import type { FieldState, KernelEvent, LayerState, ReligareRule } from '@gratia/kernel';
import processedSceneJson from '@gratia/kernel/examples/n_lightning_apprenticeship.processed.json' assert { type: 'json' };
import { GratiaFridgeCard } from './GratiaFridgeCard';

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

  return (
    <div className="relative w-full max-w-lg">
      <div className="absolute -top-4 left-0 inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-800 shadow-sm">
        WITNESSED BY WATER
      </div>

      <GratiaFridgeCard
        id={fridgeData.id}
        timestamp={fridgeData.timestamp}
        title={fridgeData.title}
        description={fridgeData.description}
        layers={fridgeData.layers}
        kernelRule={fridgeData.kernelRule}
        nextAction={fridgeData.nextAction}
      />
    </div>
  );
};
