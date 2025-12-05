import React from 'react';
import KernelLegend from '@/components/learn/KernelLegend';

export default function LearnKernel() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-16 flex flex-col items-center gap-10">
      <div className="text-center space-y-2 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Learn · Kernel</p>
        <h1 className="text-2xl font-semibold text-slate-50">Harta straturilor L1–L7</h1>
        <p className="text-sm text-slate-300">
          De la corp, la câmp, la whisper. Aceasta este legenda GratiaOS pentru procesarea unei scene —
          cum simți, cum mapezi, cum rămâne esența în kernel.
        </p>
      </div>

      <KernelLegend />
    </div>
  );
}
