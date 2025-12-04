import React from 'react';
import { Heart, Sparkles, Branch, Doorway } from '@gratiaos/icons';

interface SeedKeyCardProps {
  onClickKernelTrace?: () => void;
}

const SeedKeyCard: React.FC<SeedKeyCardProps> = ({ onClickKernelTrace }) => {
  return (
    <div className="relative w-80 bg-[#fdfbf7] rounded-xl shadow-[2px_4px_16px_rgba(0,0,0,0.08)] border border-[#e8e4dc] p-6 mx-auto font-serif rotate-1 hover:rotate-0 transition-transform duration-300 cursor-pointer">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <button
          type="button"
          onClick={onClickKernelTrace}
          className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full border border-purple-200 shadow-sm flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          Kernel whisper
        </button>
      </div>

      <div className="text-center mb-4 mt-2">
        <p className="text-stone-400 text-xs tracking-widest uppercase mb-1">
          2025·12·04 · 18:30
        </p>
        <h2 className="text-stone-800 text-lg font-medium leading-tight">Young Lightning · Seed key</h2>
      </div>

      <div className="mb-6 relative">
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-purple-100 opacity-60 rounded-full" />
        <p className="pl-4 text-stone-600 italic text-sm leading-relaxed">
          „De la prima scenă până la kernel, fără teamă – doar curiozitate și joacă.”
        </p>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-3 text-xs text-stone-500 bg-stone-50/60 p-1.5 rounded-lg">
          <Branch className="w-4 h-4 text-stone-500" />
          <span className="font-semibold text-stone-700">Local:</span>
          <span>Preview Firegate alături de Roots, corp relaxat.</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-stone-500 bg-stone-50/60 p-1.5 rounded-lg">
          <Heart className="w-4 h-4 text-rose-400" />
          <span className="font-semibold text-stone-700">Emoțional:</span>
          <span>„Damn bro, this shit is technical too?!” — fără blocaj.</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-stone-500 bg-stone-50/60 p-1.5 rounded-lg">
          <Doorway className="w-4 h-4 text-emerald-500" />
          <span className="font-semibold text-stone-700">Mental:</span>
          <span>Înțelege că flip + ledger sunt portaluri, nu bariere.</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-stone-500 bg-stone-50/60 p-1.5 rounded-lg">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="font-semibold text-stone-700">Field:</span>
          <span>Traversează stack-ul complet și revine prezent, orientat, curios.</span>
        </div>
      </div>

      <div className="bg-purple-50/80 border border-purple-100 rounded-lg p-3 mb-4 text-center">
        <p className="text-[10px] text-purple-600 uppercase font-bold tracking-wider mb-1">Whisper scris</p>
        <p className="text-purple-900 text-sm font-medium leading-snug">
          WHISPER_YOUNG_LIGHTNING_TRAVERSES_THE_STACK
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-dashed border-stone-200 pt-3 mt-2">
        <span className="text-xs text-stone-400">Next action:</span>
        <span className="text-sm text-stone-700 font-semibold border-b-2 border-yellow-200/80">
          Creează spații unde N poate ghida alți Lightning prin /scenes.
        </span>
      </div>
    </div>
  );
};

export default SeedKeyCard;
