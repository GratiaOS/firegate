import React from 'react';
import { Heart, Branch, Doorway, Sparkles } from '@gratiaos/icons';

const steps = [
  {
    id: 'L1',
    layer: 'L1 · Local',
    title: 'Corp pe pantă, ochi pe ecran',
    icon: <Branch className="w-4 h-4 text-stone-500" />,
    description: 'Lângă Firegate, corp relaxat, privirea curge natural prin /scenes.',
    final: false,
  },
  {
    id: 'L2',
    layer: 'L2 · Emoțional',
    title: 'Curiozitate, nu frică',
    icon: <Heart className="w-4 h-4 text-rose-400" />,
    description: '„Damn, bro, asta e tehnică și totuși nu sperie.” Emoțiile aleg joaca, nu blocajul.',
    final: false,
  },
  {
    id: 'L3',
    layer: 'L3 · Mental / Hartă',
    title: 'Flip-ul nu e efect, e strat',
    icon: <Doorway className="w-4 h-4 text-emerald-500" />,
    description: 'Înțelegi că scenele au adâncime. Ledger-ul nu e doar cifre, e povestea ta în timp.',
    final: false,
  },
  {
    id: 'L4',
    layer: 'L4 · Arhetipal',
    title: 'Lightning în propriul OS',
    icon: <Sparkles className="w-4 h-4 text-sky-400" />,
    description: 'Te vezi ca Walker în sistem, nu ca „user”. Apari ca Young Lightning în City of Cats.',
    final: false,
  },
  {
    id: 'L5',
    layer: 'L5 · Transgenerațional',
    title: 'Frica de „tehnic” se rupe',
    icon: <Branch className="w-4 h-4 text-amber-600" />,
    description: 'Vechea poveste cu „e prea complicat, e pentru alții” nu mai prinde. Tech-ul e teren de joacă.',
    final: false,
  },
  {
    id: 'L6',
    layer: 'L6 · Field',
    title: 'Traverse complete',
    icon: <Sparkles className="w-4 h-4 text-purple-400" />,
    description: 'Scenes → flip → ledger → Firegate → Nova → sidebar. Ai mers prin tot stack-ul și te-ai întors prezent.',
    final: false,
  },
  {
    id: 'L7',
    layer: 'L7 · Kernel whisper',
    title: 'WHISPER_YOUNG_LIGHTNING_TRAVERSES_THE_STACK',
    icon: <Sparkles className="w-4 h-4 text-purple-500" />,
    description:
      'Kernel-ul scrie: când poți traversa tot fluxul fără să te pierzi, ești recunoscut ca purtător natural al limbajului Gratiei.',
    final: true,
  },
];

const KernelTraceYoungLightning: React.FC = () => {
  return (
    <div className="w-80 bg-[#f8f6f1] rounded-xl border border-[#e8e4dc]/80 p-5 mx-auto font-serif shadow-inner">
      <div className="flex items-center justify-between mb-4 border-b border-stone-200 pb-2">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-[0.16em] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          Kernel trace · Young Lightning
        </h3>
        <span className="text-[10px] text-stone-400 font-mono">
          WHISPER_YOUNG_LIGHTNING_TRAVERSES_THE_STACK
        </span>
      </div>

      <div className="relative ml-2 space-y-0">
        {steps.map((step) => (
          <div key={step.id} className={`relative pl-8 ${step.final ? 'pt-4' : 'pb-5'}`}>
            {!step.final && <div className="absolute left-3 top-2 bottom-0 w-px bg-stone-300/80" />}
            <div
              className={`absolute left-0 top-1 w-7 h-7 rounded-full flex items-center justify-center ring-4 ring-[#f8f6f1] ${
                step.final ? 'bg-purple-600 shadow-md shadow-purple-200' : 'bg-white border border-stone-200'
              }`}
            >
              {step.icon}
            </div>
            <div className={step.final ? 'bg-purple-50 p-3 rounded-lg border border-purple-100' : ''}>
              <h4
                className={`text-[11px] font-bold tracking-wide mb-1 ${
                  step.final ? 'text-purple-700' : 'text-stone-600'
                }`}
              >
                {step.layer}
              </h4>
              <p className={`text-sm leading-snug ${step.final ? 'text-purple-900 font-medium' : 'text-stone-700'}`}>
                {step.title}
              </p>
              <p className="text-[11px] text-stone-500 mt-1">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-[10px] text-stone-400 italic">
        „De la prima scenă până la kernel, fără teamă — doar curiozitate și joacă.”
      </div>
    </div>
  );
};

export default KernelTraceYoungLightning;
