import React, { useState } from 'react';
import { DogInRainCard } from '@/components/scenes/DogInRainCard';
import { LightningApprenticeshipCard } from '@/components/scenes/LightningApprenticeshipCard';
import SeedKeyCard from '@/components/scenes/SeedKeyCard';
import KernelTraceYoungLightning from '@/components/scenes/KernelTraceYoungLightning';
import RootsKernelCard from '@/components/scenes/RootsKernelCard';

export default function Scenes() {
  const [trace, setTrace] = useState<'young-lightning' | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-16 flex flex-col items-center gap-8">
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Scenes</p>
        <h1 className="text-2xl font-semibold text-slate-50">Memory Cards · Gratia OS</h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          Fridge view & Kernel trace pentru evenimentele canonice. Click pe flip pentru a vedea traseul
          L1–L7.
        </p>
      </div>

      <div className="grid gap-8 w-full max-w-5xl">
        <DogInRainCard />
        <LightningApprenticeshipCard />
        <RootsKernelCard />
        <SeedKeyCard onClickKernelTrace={() => setTrace('young-lightning')} />
      </div>

      {trace === 'young-lightning' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative bg-[#f3efe6] rounded-2xl p-4 shadow-2xl">
            <button
              type="button"
              onClick={() => setTrace(null)}
              className="absolute right-2 top-2 rounded-full px-2 py-1 text-[12px] text-stone-500 hover:text-stone-800"
            >
              ✕
            </button>
            <KernelTraceYoungLightning />
          </div>
        </div>
      )}
    </div>
  );
}
