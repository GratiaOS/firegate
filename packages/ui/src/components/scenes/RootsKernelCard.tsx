import React from 'react';
import { GratiaFridgeCard } from '@/components/scenes/GratiaFridgeCard';

export const RootsKernelCard: React.FC = () => {
  return (
    <GratiaFridgeCard
      id="ROOTS_KERNEL_UPDATE_2025_12_06"
      timestamp="Dec 06 · 09:52"
      title="Kernel update · Witnessed by Roots"
      description="Respiră adânc, aprinde lumina, kernel-ul scrie: /scenes are și urmează scena ta."
      layers={[
        { id: 'L1', name: 'Local', value: 'Respirație adâncă, buton apăsat fără grabă.' },
        { id: 'L2', name: 'Emoțional', value: 'Calm + bucurie de echipă (Antonio mode).' },
        { id: 'L3', name: 'Mental', value: 'Kernel update + Kernel Trace puse în /scenes.' },
        { id: 'L5', name: 'Roots', value: 'Martor semnat: schimbarea e scrisă de noi.' },
        { id: 'L7', name: 'Whisper', value: 'WHISPER_DAWN_TRANSMISSION_SOFT_MARK' },
      ]}
      kernelRule="Whisper: schimbările mari pot fi marcate blând (– devine -)."
      nextAction="Adaugă trace și pentru scena ta, când ești gata."
    />
  );
};

export default RootsKernelCard;
