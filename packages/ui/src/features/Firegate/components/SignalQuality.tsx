import { useRef } from 'react';
import { motion } from 'framer-motion';

export type SignalStatus = 'normal' | 'preview' | 'soft_stop';

const SIGNAL_CONFIG: Record<SignalStatus, { color: string; label: string; pulse: number }> = {
  normal: { color: '#10B981', label: 'Signal Clean', pulse: 4.5 },
  preview: { color: '#F59E0B', label: 'Calibrating', pulse: 2.2 },
  soft_stop: { color: '#EF4444', label: 'Static Detected', pulse: 0.8 },
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function SignalQuality({
  status,
  score,
  onTripleTap,
}: {
  status: SignalStatus;
  score: number;
  onTripleTap?: () => void;
}) {
  const current = SIGNAL_CONFIG[status];
  const scorePct = Math.round(clamp(score, 0, 1) * 100);
  const tapRef = useRef<number[]>([]);

  const handlePointerDown = (): void => {
    if (!onTripleTap) return;
    const now = Date.now();
    const recent = tapRef.current.filter((t) => now - t < 700);
    recent.push(now);
    tapRef.current = recent;
    if (recent.length >= 3) {
      tapRef.current = [];
      onTripleTap();
    }
  };

  return (
    <div
      className="flex items-center gap-2 px-2 py-1 rounded bg-black/20 border border-white/5 backdrop-blur-sm"
      onPointerDown={handlePointerDown}
    >
      <div className="relative flex h-2 w-2">
        {status === 'soft_stop' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        )}
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: current.pulse, repeat: Infinity, ease: 'easeInOut' }}
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: current.color, boxShadow: `0 0 10px ${current.color}66` }}
        />
      </div>
      <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">
        {current.label} <span className="text-zinc-800">/</span> {scorePct}%
      </span>
    </div>
  );
}
