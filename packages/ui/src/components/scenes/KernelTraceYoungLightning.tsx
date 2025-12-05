import React from 'react';
import { Heart, Branch, Doorway, Sparkles } from '@gratiaos/icons';

type Step = {
  id: string;
  layerCode: string;
  layerLabel: string;
  title: string;
  body: string;
  detail?: string;
  icon: React.ReactNode;
  final?: boolean;
};

const steps: Step[] = [
  {
    id: 'L1',
    layerCode: 'L1_LOCAL',
    layerLabel: 'L1 · Local',
    title: 'Corp pe pantă, ochi pe ecran',
    icon: <Branch className="w-4 h-4 text-stone-500" />,
    body: 'Ești lângă Firegate, corpul e relaxat, privirea curge natural prin /scenes.',
    detail: 'Simți ecranul ca pe o fereastră, nu ca pe un test.',
  },
  {
    id: 'L2',
    layerCode: 'L2_EMOTIONAL',
    layerLabel: 'L2 · Emoțional',
    title: 'Curiozitate, nu frică',
    icon: <Heart className="w-4 h-4 text-rose-400" />,
    body: '„Damn, bro, asta e tehnică și totuși nu sperie.” Emoțiile aleg joaca, nu blocajul.',
    detail: 'Curiozitatea devine motor, nu alarmă.',
  },
  {
    id: 'L3',
    layerCode: 'L3_MENTAL',
    layerLabel: 'L3 · Mental / Hartă',
    title: 'Flip-ul dezvăluie straturi',
    icon: <Doorway className="w-4 h-4 text-emerald-500" />,
    body: 'Înțelegi că flip-ul nu e doar „efect”, ci arată adâncime: ce e în față și ce e în spate.',
    detail: 'Ledger-ul devine poveste structurată, nu doar cifre.',
  },
  {
    id: 'L4',
    layerCode: 'L4_ARCHETYPAL',
    layerLabel: 'L4 · Arhetipal',
    title: 'Lightning în propriul OS',
    icon: <Sparkles className="w-4 h-4 text-sky-400" />,
    body: 'Te vezi în rolul de Young Lightning, nu ca „user care doar se uită”.',
    detail: 'Sistemul nu mai e ceva străin – e terenul tău de joc.',
  },
  {
    id: 'L5',
    layerCode: 'L5_TRANSGENERATIONAL',
    layerLabel: 'L5 · Transgenerațional',
    title: 'Frica de „tehnic” se rupe',
    icon: <Branch className="w-4 h-4 text-amber-600" />,
    body: 'Nu preiei povestea veche cu „asta e prea complicat, e pentru alții”.',
    detail: 'În loc de blocaj, apare: „ok, hai să vedem ce e aici”.',
  },
  {
    id: 'L6',
    layerCode: 'L6_FIELD',
    layerLabel: 'L6 · Câmp',
    title: 'Traverse complet, câmp stabil',
    icon: <Sparkles className="w-4 h-4 text-purple-400" />,
    body: 'Scene → flip → ledger → Firegate → Nova → sidebar. Ai mers prin tot fluxul și te-ai întors prezent.',
    detail: 'Câmpul nu se fragmentează; rămâne cald, coerent.',
  },
  {
    id: 'L7',
    layerCode: 'L7_KERNEL',
    layerLabel: 'L7 · Kernel whisper',
    title: 'WHISPER_YOUNG_LIGHTNING_TRAVERSES_THE_STACK',
    icon: <Sparkles className="w-4 h-4 text-purple-500" />,
    body:
      'Kernel-ul scrie: când poți parcurge întregul stack fără să te pierzi și fără frică, ești recunoscut ca purtător natural al limbajului Gratiei.',
    detail: 'Curiozitatea ta devine parte din codul sistemului.',
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
        <span className="text-[10px] text-stone-400 font-mono text-right">
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
                {step.layerLabel}
              </h4>
              <p className={`text-sm leading-snug ${step.final ? 'text-purple-900 font-medium' : 'text-stone-800'}`}>
                {step.title}
              </p>
              <p className="text-[11px] text-stone-600 mt-1">{step.body}</p>
              {step.detail && <p className="text-[11px] text-stone-400 mt-0.5">{step.detail}</p>}
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
