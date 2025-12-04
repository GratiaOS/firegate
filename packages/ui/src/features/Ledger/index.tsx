import React, { useEffect, useMemo, useState } from 'react';
import ledgerProcessedJson from '../../../../kernel/examples/rainbow-ledger.processed.json' with { type: 'json' };

type LedgerEntry = {
  id: string;
  amount: number;
  note: string;
  feeling: 'calm' | 'curious' | 'excited' | 'grateful';
  createdAt: string;
};

type ProcessedLedgerScene = {
  sceneId: string;
  scene: {
    title: string;
    headline: string;
    actors?: string[];
    fieldSignature?: string;
  };
  fieldShift?: {
    to?: { vibe?: string; keywords?: string[] };
  };
  kernelRule?: {
    id: string;
    text: string;
  };
  anchor?: { plusCode?: string };
  balance?: { amount?: number; currency?: string; owner?: string };
};

const STORAGE_KEY = 'rainbow-ledger.entries';

const ledgerScene = ledgerProcessedJson as ProcessedLedgerScene;

export default function Ledger() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [feeling, setFeeling] = useState<LedgerEntry['feeling']>('calm');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as LedgerEntry[];
        setEntries(parsed);
      } catch {
        // ignore bad data
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    const parsed = parseFloat(amount);
    if (!parsed || !Number.isFinite(parsed)) return;
    const entry: LedgerEntry = {
      id: `${Date.now()}`,
      amount: parsed,
      note: note.trim() || 'Explorare',
      feeling,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [entry, ...prev].slice(0, 15));
    setAmount('');
    setNote('');
    setFeeling('calm');
  };

  const vibeLabel = useMemo(() => {
    const vibe = ledgerProcessedJson.fieldShift?.to?.vibe;
    if (!vibe) return 'CALM';
    return vibe;
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-16 flex flex-col items-center gap-10">
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Ledger</p>
        <h1 className="text-2xl font-semibold text-slate-50">Rainbow Ledger — Lightning funds</h1>
        <p className="text-sm text-slate-300 max-w-2xl">
          Fondurile lui Lightning sunt pentru explorare & învățare. Curcubeu peste Garden spune „ok to grow”.
        </p>
      </div>

      <div className="w-full max-w-4xl grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Balance</p>
              <p className="text-3xl font-semibold text-emerald-200">
                {ledgerScene.balance?.amount ?? 333.66}{' '}
                <span className="text-base text-slate-300">{ledgerScene.balance?.currency ?? 'EUR'}</span>
              </p>
              <p className="text-xs text-slate-400">
                Owner: {ledgerScene.balance?.owner ?? 'nicolas_lightning'}
              </p>
            </div>
            <div className="rounded-full border border-purple-400/60 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold text-purple-100">
              {ledgerScene.kernelRule?.id ?? 'RULE_18'}: {ledgerScene.kernelRule?.text ?? 'Lightning funds are for growth'}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 mb-4">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400 mb-1">Field signature</p>
            <p className="text-sm text-slate-100">
              {ledgerScene.scene.fieldSignature ?? 'rainbow_over_garden'} · Vibe: {vibeLabel}
            </p>
            <p className="text-xs text-slate-400">
              {ledgerScene.anchor?.plusCode ?? '6V75+GH Casbas de Huesca'}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Log exploration</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Sumă (EUR)"
                className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-400"
                type="number"
                step="0.01"
              />
              <select
                value={feeling}
                onChange={(e) => setFeeling(e.target.value as LedgerEntry['feeling'])}
                className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-400"
              >
                <option value="calm">calm</option>
                <option value="curious">curious</option>
                <option value="excited">excited</option>
                <option value="grateful">grateful</option>
              </select>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Pentru ce folosim (trip, gear, learning)?"
              className="w-full rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-400 min-h-[80px]"
            />
            <button
              type="button"
              onClick={addEntry}
              className="inline-flex items-center justify-center rounded-full bg-emerald-400/90 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-md hover:bg-emerald-300 transition-colors"
            >
              Log entry
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400 mb-3">Entries</p>
          {entries.length === 0 ? (
            <p className="text-sm text-slate-400">Încă nu există înregistrări. Curcubeul zice: ok to grow.</p>
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-200 font-semibold">+{entry.amount.toFixed(2)} EUR</span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(entry.createdAt).toLocaleString('ro-RO', { hour12: false })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-100">{entry.note}</p>
                  <p className="text-[11px] text-slate-400">Feeling: {entry.feeling}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
