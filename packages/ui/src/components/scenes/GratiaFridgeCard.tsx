import React from 'react';
import { Anchor, Branch, Doorway, Heart, Sparkles } from '@gratiaos/icons';

export type LayerInfo = {
  id: string;
  name: string;
  value: string;
};

export type GratiaSceneCardProps = {
  id: string;
  timestamp: string; // ex: "03 Dec • 17:30"
  title?: string;
  description: string;
  layers: LayerInfo[];
  kernelRule: string;
  nextAction: string;
};

const IconForLayer = ({ id }: { id: string }) => {
  switch (id) {
    case 'L1':
      return <Branch width={14} height={14} />;
    case 'L2':
      return <Heart width={14} height={14} />;
    case 'L3':
      return <Doorway width={14} height={14} />;
    case 'L5':
      return <Anchor width={14} height={14} />;
    case 'L7':
      return <Sparkles width={14} height={14} />;
    default:
      return <Branch width={14} height={14} />;
  }
};

export const GratiaFridgeCard: React.FC<GratiaSceneCardProps> = ({
  id,
  timestamp,
  title = 'Guardian Event',
  description,
  layers,
  kernelRule,
  nextAction,
}) => {
  return (
    <div
      className="relative w-80 bg-[#fdfbf7] rounded-xl shadow-[2px_4px_16px_rgba(0,0,0,0.08)] border border-[#e8e4dc] p-6 mx-auto font-serif rotate-1 hover:rotate-0 transition-transform duration-300 cursor-pointer"
      aria-labelledby={id}
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <div className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full border border-purple-200 shadow-sm flex items-center gap-1">
          <Sparkles width={12} height={12} />
          <span>Kernel update</span>
        </div>
      </div>

      <div className="text-center mb-4 mt-2">
        <p className="text-stone-400 text-xs tracking-widest uppercase mb-1">{timestamp}</p>
        <h2 id={id} className="text-stone-800 text-lg font-medium leading-tight">
          {title}
        </h2>
      </div>

      <div className="mb-6 relative">
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-red-100 opacity-50 rounded-full" />
        <p className="pl-4 text-stone-600 italic text-sm leading-relaxed">“{description}”</p>
      </div>

      <div className="space-y-2 mb-6">
        {layers.map((layer) => (
          <div
            key={`${layer.id}-${layer.name}`}
            className="flex items-center gap-3 text-xs text-stone-500 bg-stone-50/50 p-1.5 rounded-lg border border-transparent hover:border-purple-100 hover:bg-purple-50/30 transition-colors"
          >
            <span className="text-stone-400">
              <IconForLayer id={layer.id} />
            </span>
            <span className="font-semibold text-stone-600">{layer.name}:</span>
            <span>{layer.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-green-50/80 border border-green-100 rounded-lg p-3 mb-4 text-center">
        <p className="text-[10px] text-green-600 uppercase font-bold tracking-wider mb-1">Religare rule written</p>
        <p className="text-green-800 text-sm font-medium">{kernelRule}</p>
      </div>

      <div className="flex items-center justify-between border-t border-dashed border-stone-200 pt-3 mt-2">
        <span className="text-xs text-stone-400">Next action:</span>
        <span className="text-sm text-stone-700 font-semibold border-b-2 border-yellow-200/80">
          {nextAction}
        </span>
      </div>

      <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
        <Sparkles width={40} height={40} />
      </div>
    </div>
  );
};
