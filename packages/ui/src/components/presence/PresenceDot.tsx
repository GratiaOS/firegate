'use client';

import { usePresence } from '@/presence/usePresence';
import clsx from 'clsx';

export function PresenceDot({ locationPath }: { locationPath: string }) {
  const { status } = usePresence({ locationPath });

  return (
    <div
      className={clsx(
        'h-3 w-3 rounded-full shadow',
        status === 'active' && 'bg-emerald-300 animate-pulse',
        status === 'idle' && 'bg-emerald-200',
        status === 'background' && 'bg-slate-400 opacity-70'
      )}
      aria-label={`presence-${status}`}
    />
  );
}
