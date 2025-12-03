import React from 'react';
import { GratiaFridgeCard } from './GratiaFridgeCard';

export const DogInRainCard: React.FC = () => {
  return (
    <GratiaFridgeCard
      id="DOG_IN_RAIN_2025_12_03"
      timestamp="03 Dec • 17:30"
      title="Guardian Event – Dog in rain"
      description="Câine ud, tremurând, la poarta casei în ploaie."
      layers={[
        { id: 'L1', name: 'Somatic', value: 'Tremurat / frig, ploaie rece' },
        { id: 'L2', name: 'Emotional', value: 'Compasiune (S), urgență blândă' },
        { id: 'L5', name: 'Roots', value: 'Pattern rescris: nimeni nu rămâne afară' },
        { id: 'L7', name: 'Kernel', value: 'RULE_07_NO_ONE_LEFT_IN_RAIN' },
      ]}
      kernelRule="RULE_07: No one left in rain."
      nextAction="Hrănire & adăpostire pentru câinele oaspete"
    />
  );
};
