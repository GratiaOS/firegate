import React from 'react';
import { Branch, Heart, Doorway, Anchor, Sparkles } from '@gratiaos/icons';

type KernelLegendItem = {
  id: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7';
  label: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const items: KernelLegendItem[] = [
  {
    id: 'L1',
    label: 'L1 · Local / Somatic',
    title: 'Corpul simte',
    description: 'Picioare pe pământ, respirație, frig, căldură, poziția ta acum.',
    icon: <Branch className="w-4 h-4 text-stone-600" />,
  },
  {
    id: 'L2',
    label: 'L2 · Emoțional',
    title: 'Inima răspunde',
    description: 'Frică, bucurie, nervi, curiozitate – emoția care urcă înainte de cuvinte.',
    icon: <Heart className="w-4 h-4 text-rose-500" />,
  },
  {
    id: 'L3',
    label: 'L3 · Mental / Hartă',
    title: 'Mintea înțelege',
    description: 'Pui sens: ce se întâmplă, cum legi punctele, cum îți explici scena.',
    icon: <Doorway className="w-4 h-4 text-emerald-500" />,
  },
  {
    id: 'L4',
    label: 'L4 · Arhetipal / Rol',
    title: 'Rolul apare',
    description: 'Te vezi ca Lightning, Roots, Water, Guardian – cine ești în poveste.',
    icon: <Sparkles className="w-4 h-4 text-sky-400" />,
  },
  {
    id: 'L5',
    label: 'L5 · Transgenerațional',
    title: 'Povestea veche se arată',
    description: 'Reflexe moștenite din familie: frici vechi, loialități, tipare care se repetă.',
    icon: <Anchor className="w-4 h-4 text-amber-600" />,
  },
  {
    id: 'L6',
    label: 'L6 · Câmp',
    title: 'Spațiul dintre noi',
    description: 'Atmosfera din casă, dintre oameni, dintre voi și natură – tensiune sau calm.',
    // TODO: înlocuiește cu FieldWave când apare în @gratiaos/icons
    icon: <Sparkles className="w-4 h-4 text-purple-400" />,
  },
  {
    id: 'L7',
    label: 'L7 · Kernel / Whisper',
    title: 'Whisper-ul se scrie',
    description: 'Esența care rămâne după experiență – o frază simplă care susține următorul pas.',
    // TODO: înlocuiește cu KernelGem/Seed când apare în @gratiaos/icons
    icon: <Anchor className="w-4 h-4 text-purple-600" />,
  },
];

const KernelLegend: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto bg-[#fdfbf7] rounded-2xl border border-[#e8e4dc] shadow-[2px_4px_18px_rgba(0,0,0,0.06)] p-6 font-serif">
      <div className="mb-5 text-center">
        <p className="text-[11px] uppercase tracking-[0.16em] text-stone-400 mb-1">GratiaOS · Kernel legend</p>
        <h2 className="text-stone-800 text-lg font-medium leading-tight">Harta straturilor L1–L7</h2>
        <p className="text-[11px] text-stone-500 mt-2">De la corp, la câmp, la whisper. Un singur fir: experiența ta.</p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-xl bg-stone-50/60 border border-stone-100 px-3 py-2.5"
          >
            <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white border border-stone-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              {item.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-400">
                  {item.label}
                </span>
              </div>
              <p className="text-sm text-stone-800 font-medium mt-0.5">{item.title}</p>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-[10px] text-stone-400 italic">
        „L1 — corpul simte · L7 — whisper-ul rămâne.”
      </div>
    </div>
  );
};

export default KernelLegend;
