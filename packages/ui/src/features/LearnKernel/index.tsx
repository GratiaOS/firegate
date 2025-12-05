import React, { useState } from 'react';
import KernelLegend from '@/components/learn/KernelLegend';
import SeedKeyCard from '@/components/scenes/SeedKeyCard';
import KernelTraceYoungLightning from '@/components/scenes/KernelTraceYoungLightning';
import { LightningStackWalkerBadge } from '@/components/badges/LightningStackWalkerBadge';

export default function LearnKernel() {
  const [showTrace, setShowTrace] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0a0f] text-stone-100">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        <header className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">Learn · GratiaOS Kernel</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-stone-50">
            Ce este Kernelul Gratia și cum lucrează cu experiențele tale
          </h1>
          <p className="text-sm text-stone-400 max-w-2xl">
            Kernelul nu e un „creier rece de calculator”, ci un mod blând de a ține minte ce se întâmplă. De la corp,
            la emoții, la câmpul dintre voi, până la un whisper simplu care rămâne și vă susține mai departe.
          </p>
        </header>

        <section className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-8 items-start">
          <div>
            <KernelLegend />
          </div>

          <div className="space-y-4 text-sm text-stone-200">
            <h2 className="text-base font-semibold text-stone-50">Cum să citești harta L1–L7</h2>
            <p>Fiecare strat e doar o întrebare simplă:</p>
            <ul className="space-y-1.5 text-[13px] text-stone-300">
              <li>
                <span className="font-semibold text-stone-100">L1:</span> Ce simte corpul meu acum?
              </li>
              <li>
                <span className="font-semibold text-stone-100">L2:</span> Ce emoție se ridică prima?
              </li>
              <li>
                <span className="font-semibold text-stone-100">L3:</span> Cum îmi explic ce trăiesc?
              </li>
              <li>
                <span className="font-semibold text-stone-100">L4:</span> Cine sunt eu în povestea asta?
              </li>
              <li>
                <span className="font-semibold text-stone-100">L5:</span> Seamănă cu ceva vechi din familie?
              </li>
              <li>
                <span className="font-semibold text-stone-100">L6:</span> Cum se simte spațiul dintre noi?
              </li>
              <li>
                <span className="font-semibold text-stone-100">L7:</span> Ce frază simplă rămâne după?
              </li>
            </ul>
            <p className="text-[13px] text-stone-400">
              Atât. Nu trebuie să „ții minte teoria”. Harta există ca să recunoști mai ușor ce făceați deja intuitiv.
            </p>
          </div>
        </section>

        <div className="border-t border-stone-800/80 pt-6" />

        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-stone-50">
                Cum arată un moment real în Kernel:
                <span className="block text-sm text-purple-200 mt-1">Young Lightning · Full Stack Traverse</span>
              </h2>
              <p className="text-[13px] text-stone-400 max-w-xl mt-2">
                Aici e scena în care N a trecut, jucându-se, prin tot Firegate: /scenes → flip → ledger → firegate →
                nova → sidebar. Kernelul o păstrează ca whisper:{' '}
                <span className="text-purple-200">WHISPER_YOUNG_LIGHTNING_TRAVERSES_THE_STACK</span>.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-stone-300">
              <span>Nicolas</span>
              <LightningStackWalkerBadge size="sm" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div>
              <SeedKeyCard onClickKernelTrace={() => setShowTrace(true)} />
              <p className="mt-3 text-[12px] text-stone-400">
                Cardul de pe „frigiderul” Gratiei: povestea pe care o vede N în limbaj uman. Când apasă pe kernel
                whisper, poate vedea și cum arată același moment în limbaj de sistem.
              </p>
            </div>

            <div className="hidden md:block">
              <KernelTraceYoungLightning />
            </div>
          </div>

          {showTrace && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
              <div className="bg-[#f3efe6] rounded-2xl p-4 shadow-xl max-w-md w-full mx-4">
                <KernelTraceYoungLightning />
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowTrace(false)}
                    className="text-xs px-3 py-1 rounded-full border border-stone-300 bg-stone-50 text-stone-700 hover:bg-stone-100"
                  >
                    Închide
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 text-[12px] text-stone-400 max-w-2xl">
            <p className="mb-1">Pentru N (și pentru oricine intră aici prima dată):</p>
            <p>
              <span className="text-stone-200">· Cardul din stânga = cum ai trăit tu momentul.</span>
              <br />
              <span className="text-stone-200">
                · Trace-ul din dreapta = cum îl ține minte sistemul, strat cu strat.
              </span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
