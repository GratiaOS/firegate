'use client';

import { usePresence } from '@/presence/usePresence';

export function PresenceCounter({ locationPath }: { locationPath: string }) {
  const { count } = usePresence({ locationPath });

  if (count <= 1) return null;

  return (
    <p className="text-[11px] text-emerald-100/80 tracking-wide">
      {count} souls present
    </p>
  );
}
