import React from 'react';
import type {
  FieldState,
  KernelEvent,
  LayerState,
  ReligareRule,
} from '../../../../kernel/src/types';

type ProcessedScene = {
  event: KernelEvent;
  layerStates: LayerState[];
  rules: ReligareRule[];
  fieldSnapshots?: FieldState[];
};

const LAYER_ORDER: Array<LayerState['layer']> = [
  'L1_LOCAL',
  'L2_EMOTIONAL',
  'L3_MENTAL',
  'L4_ARCHETYPAL',
  'L5_TRANSGENERATIONAL',
  'L6_FIELD',
  'L7_KERNEL',
];

const LAYER_LABEL: Record<LayerState['layer'], string> = {
  L1_LOCAL: 'Somatic / Local',
  L2_EMOTIONAL: 'Emoțional',
  L3_MENTAL: 'Mental / Hartă',
  L4_ARCHETYPAL: 'Arhetipal',
  L5_TRANSGENERATIONAL: 'Transgenerațional',
  L6_FIELD: 'Câmp',
  L7_KERNEL: 'Kernel / Reguli',
};

export function KernelTraceView({ scene }: { scene: ProcessedScene }) {
  const mainRule = scene.rules[0];
  const startSnapshot = scene.fieldSnapshots?.[0];
  const endSnapshot = scene.fieldSnapshots?.[scene.fieldSnapshots.length - 1];

  return (
    <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-slate-100 shadow-xl">
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-emerald-500/10" />

      <header className="relative mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            {scene.event.context.timestamp || 'Scene trace'}
          </p>
          <h2 className="text-lg font-semibold leading-tight text-slate-50">
            {scene.event.sceneDescription || scene.event.id}
          </h2>
          <p className="text-xs text-slate-300">
            {scene.event.trigger} · {scene.event.sourceTerritory}
          </p>
        </div>
        {mainRule && (
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/60 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold text-purple-100">
            <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
            L7 RULE WRITTEN
          </div>
        )}
      </header>

      <section className="relative mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Scene</p>
          <p className="mt-1 text-sm text-slate-100">{scene.event.sceneDescription}</p>
          {scene.event.context.actors && (
            <div className="mt-2 flex flex-wrap gap-1">
              {scene.event.context.actors.map((actor: string) => (
                <span
                  key={actor}
                  className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200"
                >
                  {actor}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Field shift</p>
          <div className="mt-2 flex items-center gap-2 text-[11px]">
            {startSnapshot && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-red-200">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                {startSnapshot.vibe}
              </span>
            )}
            <div className="h-px flex-1 bg-gradient-to-r from-red-500/50 via-slate-500/60 to-emerald-400/70" />
            {endSnapshot && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {endSnapshot.vibe}
              </span>
            )}
          </div>
          {endSnapshot?.activePatterns && (
            <div className="mt-2 flex flex-wrap gap-1">
              {endSnapshot.activePatterns.map((pattern: string) => (
                <span
                  key={pattern}
                  className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200"
                >
                  {pattern}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative rounded-xl border border-slate-800 bg-slate-900/70 p-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400 mb-2">Layer stack</p>
        <div className="space-y-1.5">
          {LAYER_ORDER.map((layerId) => {
            const state = scene.layerStates.find((ls) => ls.layer === layerId);
            const isKernel = layerId === 'L7_KERNEL';
            const active = Boolean(state);

            return (
              <div
                key={layerId}
                className={`flex items-start gap-2 rounded-lg border px-2 py-1.5 ${
                  isKernel ? 'border-purple-500/60 bg-purple-500/10' : 'border-slate-800 bg-slate-950/70'
                }`}
              >
                <span
                  className={`mt-1 h-2 w-2 rounded-full ${
                    active
                      ? isKernel
                        ? 'bg-purple-300 animate-pulse'
                        : 'bg-emerald-300'
                      : 'bg-slate-600'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
                    {layerId.replace('L', 'L ')} · {LAYER_LABEL[layerId]}
                  </p>
                  {state?.summary && <p className="text-[11px] text-slate-200/90">{state.summary}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {mainRule && (
        <section className="relative mt-4 rounded-xl border border-purple-500/60 bg-purple-900/20 p-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-purple-100">Kernel rule</p>
          <p className="text-xs font-mono text-purple-100">{mainRule.ruleId}</p>
          <p className="mt-1 text-sm text-purple-50/90">{mainRule.description}</p>
          {mainRule.layersAffected && (
            <div className="mt-2 flex flex-wrap gap-1">
              {mainRule.layersAffected.map((layer: string) => (
                <span
                  key={layer}
                  className="rounded-full border border-purple-400/50 bg-slate-950/70 px-2 py-0.5 text-[10px] text-purple-100"
                >
                  {layer}
                </span>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
