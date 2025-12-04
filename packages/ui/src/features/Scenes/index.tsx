import React from 'react';
import { DogInRainCard } from '@/components/scenes/DogInRainCard';
import { LightningApprenticeshipCard } from '@/components/scenes/LightningApprenticeshipCard';
import SeedKeyCard from '@/components/scenes/SeedKeyCard';

export default function Scenes() {
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
        <SeedKeyCard />
      </div>
    </div>
  );
}
