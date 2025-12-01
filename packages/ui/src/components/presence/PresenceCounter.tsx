'use client';

import { usePresence } from '@/presence/usePresence';

export function PresenceCounter({ locationPath }: { locationPath: string }) {
  const { othersCount } = usePresence({ locationPath });

  if (othersCount <= 1) return null;

  return (
    <p className="text-[11px] text-emerald-100/80 tracking-wide">
      {othersCount} souls present
    </p>
  );
}
