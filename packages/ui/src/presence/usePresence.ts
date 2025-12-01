import { useEffect, useState } from 'react';
import type { PresenceSnapshot, PresenceStatus } from './types';

interface UsePresenceOptions {
  locationPath: string;
}

export function usePresence(_opts: UsePresenceOptions): PresenceSnapshot {
  const [status, setStatus] = useState<PresenceStatus>('active');
  void _opts;

  // keep a minimal local signal so UI components don't break
  useEffect(() => {
    const onVisibility = () => {
      setStatus(document.hidden ? 'background' : 'active');
    };

    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return {
    status,
    count: 1,
  };
}
