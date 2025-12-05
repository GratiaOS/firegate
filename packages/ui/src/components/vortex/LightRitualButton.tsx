import React, { useEffect, useState } from 'react';
import { useSkinField } from '@/skin/SkinFieldContext';

interface LightRitualButtonProps {
  onLight?: () => void;
}

/**
 * "Aprinde lumina" ritual button for Vortex/Antonio.
 * - Pre-pulse 0–120ms
 * - Warm transition 120–400ms
 * - Whisper appears after ~1s
 */
const LightRitualButton: React.FC<LightRitualButtonProps> = ({ onLight }) => {
  const { setSkinId, skinId } = useSkinField();
  const [isLit, setIsLit] = useState(false);
  const [prePulse, setPrePulse] = useState(false);
  const [showWhisper, setShowWhisper] = useState(false);

  useEffect(() => {
    if (!isLit) return;

    setPrePulse(true);
    const pulseTimer = setTimeout(() => setPrePulse(false), 180);
    const whisperTimer = setTimeout(() => setShowWhisper(true), 1100);
    const doneTimer = setTimeout(() => {
      onLight?.();
    }, 1200);

    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(whisperTimer);
      clearTimeout(doneTimer);
    };
  }, [isLit, onLight]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative w-full max-w-xs rounded-[28px] p-[3px] transition-all duration-500"
        style={{
          background: isLit
            ? 'radial-gradient(circle at 50% 20%, rgba(251,191,36,0.45), rgba(255,255,255,0.18))'
            : 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.08), rgba(0,0,0,0.65))',
        }}
      >
        <div className="absolute inset-0 rounded-[26px] border border-white/10" aria-hidden />

        {prePulse && (
          <div className="absolute inset-2 rounded-[22px] bg-amber-200/20 blur-2xl animate-ping" aria-hidden />
        )}

        <button
          type="button"
          onClick={() => {
            if (skinId !== 'SUN') {
              setSkinId('SUN');
            }
            setIsLit(true);
          }}
          className={`relative z-[1] w-full rounded-[22px] px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-400 shadow-[0_0_12px_rgba(0,0,0,0.28)] focus:outline-none focus:ring-2 focus:ring-amber-200/60 focus:ring-offset-2 focus:ring-offset-transparent
            ${
              isLit
                ? 'bg-gradient-to-b from-amber-200 via-amber-100 to-amber-50 text-stone-900 shadow-[0_0_18px_rgba(251,191,36,0.55)]'
                : 'bg-gradient-to-b from-slate-800/80 via-slate-900/80 to-slate-950 text-amber-100/90 hover:from-slate-700 hover:to-slate-900'
            }
          `}
        >
          Aprinde lumina
        </button>
      </div>

      <p className="text-xs text-stone-400 text-center max-w-sm leading-snug">
        {isLit
          ? 'Pata blanca. Tú puedes imaginarte el próximo paso. Un singur pas e suficient pentru azi.'
          : 'Doar apasă. Restul vine singur.'}
      </p>

      {showWhisper && (
        <p className="text-[11px] text-amber-100/80 italic text-center transition-opacity duration-700">
          Lumina se aprinde în tine, nu doar pe ecran.
        </p>
      )}
    </div>
  );
};

export default LightRitualButton;
