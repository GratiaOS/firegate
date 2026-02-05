import { useEffect, useRef, useState } from 'react';

const ENTRY_HOLD_MS = 4500;
const FRANTIC_RELEASE_MS = 700;
const SOFT_BLOCK_MS = 1800;
const AXE_DOWN_MS = 7000;
const FRANTIC_LIMIT = 3;
const FRANTIC_WINDOW_MS = 15000;

type BlockState = 'none' | 'soft_block' | 'axe_down';

type MembraneGateProps = {
  title: string;
  subtitle: string;
  holdHint: string;
  blockedText: string;
  axeDownText: string;
  onGranted: () => void;
};

export function MembraneGate({
  title,
  subtitle,
  holdHint,
  blockedText,
  axeDownText,
  onGranted,
}: MembraneGateProps) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [blockState, setBlockState] = useState<BlockState>('none');

  const holdStartRef = useRef(0);
  const holdRafRef = useRef<number | null>(null);
  const holdTimeoutRef = useRef<number | null>(null);
  const releaseTimeoutRef = useRef<number | null>(null);
  const franticCountRef = useRef(0);
  const franticWindowStartRef = useRef(0);

  const clearHoldLoop = (): void => {
    if (holdTimeoutRef.current) {
      window.clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (holdRafRef.current) {
      window.cancelAnimationFrame(holdRafRef.current);
      holdRafRef.current = null;
    }
  };

  const clearReleaseTimer = (): void => {
    if (releaseTimeoutRef.current) {
      window.clearTimeout(releaseTimeoutRef.current);
      releaseTimeoutRef.current = null;
    }
  };

  const setBlockedState = (next: BlockState, durationMs: number): void => {
    clearReleaseTimer();
    setBlockState(next);
    releaseTimeoutRef.current = window.setTimeout(() => {
      setBlockState('none');
    }, durationMs);
  };

  const beginHold = (): void => {
    if (holding || blockState !== 'none') return;

    setHolding(true);
    holdStartRef.current = Date.now();

    const tick = (): void => {
      const elapsed = Date.now() - holdStartRef.current;
      setProgress(Math.max(0, Math.min(1, elapsed / ENTRY_HOLD_MS)));
      holdRafRef.current = window.requestAnimationFrame(tick);
    };

    holdRafRef.current = window.requestAnimationFrame(tick);
    holdTimeoutRef.current = window.setTimeout(() => {
      clearHoldLoop();
      clearReleaseTimer();
      setHolding(false);
      setProgress(1);
      onGranted();
    }, ENTRY_HOLD_MS);
  };

  const cancelHold = (): void => {
    if (!holding) return;

    const elapsed = Date.now() - holdStartRef.current;
    clearHoldLoop();
    setHolding(false);
    setProgress(0);

    if (elapsed >= ENTRY_HOLD_MS) return;
    if (elapsed >= FRANTIC_RELEASE_MS) return;

    const now = Date.now();
    if (now - franticWindowStartRef.current > FRANTIC_WINDOW_MS) {
      franticCountRef.current = 0;
      franticWindowStartRef.current = now;
    }
    franticCountRef.current += 1;

    if (franticCountRef.current >= FRANTIC_LIMIT) {
      franticCountRef.current = 0;
      setBlockedState('axe_down', AXE_DOWN_MS);
      return;
    }

    setBlockedState('soft_block', SOFT_BLOCK_MS);
  };

  useEffect(() => {
    return () => {
      clearHoldLoop();
      clearReleaseTimer();
    };
  }, []);

  const blockMessage = blockState === 'axe_down' ? axeDownText : blockState === 'soft_block' ? blockedText : null;

  return (
    <div className="min-h-screen w-full bg-[#0a0b0e] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-[#C9A56B]/25 bg-black/40 backdrop-blur-md p-6 shadow-[0_0_30px_rgba(201,165,107,0.08)]">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#C9A56B]/80">Firegate Membrane</p>
          <h1 className="mt-2 text-lg font-semibold text-zinc-100">{title}</h1>
          <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>
        </div>

        <div className="mt-6">
          <div
            className={`relative overflow-hidden rounded-xl border px-4 py-5 text-center select-none ${
              blockState === 'none'
                ? 'border-zinc-700/80 bg-zinc-900/70'
                : blockState === 'soft_block'
                  ? 'border-amber-500/40 bg-amber-500/10'
                  : 'border-red-500/40 bg-red-500/10'
            }`}
            role="button"
            tabIndex={0}
            aria-label={holdHint}
            onPointerDown={beginHold}
            onPointerUp={cancelHold}
            onPointerCancel={cancelHold}
            onPointerLeave={cancelHold}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) beginHold();
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter' || e.key === ' ') cancelHold();
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 bg-[#C9A56B]/20 transition-[width] duration-100"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
            <span className="relative z-10 text-sm font-medium text-zinc-200">{holdHint}</span>
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            Hold duration: {(ENTRY_HOLD_MS / 1000).toFixed(1)}s
          </p>
          {blockMessage && <p className="mt-2 text-xs text-zinc-300">{blockMessage}</p>}
        </div>
      </div>
    </div>
  );
}
