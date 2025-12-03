import React, { useMemo, useState } from 'react';
import type { FieldState, KernelEvent, LayerState, ReligareRule } from '@gratia/kernel';
import processedSceneJson from '@gratia/kernel/examples/dog-in-rain.processed.json' assert { type: 'json' };
import { GratiaFridgeCard } from './GratiaFridgeCard';
import { KernelTraceView } from './KernelTraceView';

type ProcessedScene = {
  event: KernelEvent;
  layerStates: LayerState[];
  rules: ReligareRule[];
  fieldSnapshots?: FieldState[];
};

const processedScene = processedSceneJson as unknown as ProcessedScene;

export const DogInRainCard: React.FC = () => {
  const [showTrace, setShowTrace] = useState(false);

  const fridgeData = useMemo(() => {
    const l1 = processedScene.layerStates.find((ls) => ls.layer === 'L1_LOCAL');
    const l2 = processedScene.layerStates.find((ls) => ls.layer === 'L2_EMOTIONAL');
    const l5 = processedScene.layerStates.find((ls) => ls.layer === 'L5_TRANSGENERATIONAL');
    const l7 = processedScene.layerStates.find((ls) => ls.layer === 'L7_KERNEL');
    const rule = processedScene.rules[0];

    const nextAction =
      (processedScene.layerStates
        .find((ls) => ls.layer === 'L3_MENTAL')
        ?.data as { decisions?: string[] } | undefined)?.decisions?.[0] ||
      'Continuăm să avem grijă';

    return {
      id: processedScene.event.id,
      timestamp:
        processedScene.event.context.timestamp?.replace('T', ' • ').slice(0, 16) ??
        'Scene',
      title: 'Guardian Event – Dog in rain',
      description: processedScene.event.sceneDescription,
      layers: [
        { id: 'L1', name: 'Somatic', value: l1?.summary ?? 'L1 capturat' },
        { id: 'L2', name: 'Emoțional', value: l2?.summary ?? 'L2 simțit' },
        { id: 'L5', name: 'Roots', value: l5?.summary ?? 'Pattern de rescris' },
        { id: 'L7', name: 'Kernel', value: l7?.summary ?? rule?.ruleId ?? 'Kernel' },
      ],
      kernelRule: rule ? `${rule.ruleId}: ${rule.description}` : 'Kernel update',
      nextAction,
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setShowTrace((v) => !v)}
        className="self-end rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-xs text-slate-200 transition-colors hover:border-purple-400 hover:text-purple-100"
      >
        {showTrace ? '◀︎ Fridge card' : 'Kernel trace ▶︎'}
      </button>

      {showTrace ? (
        <KernelTraceView scene={processedScene} />
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
