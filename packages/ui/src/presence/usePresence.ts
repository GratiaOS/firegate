'use client';

import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { PresenceMetadata, PresenceStatus } from './types';

interface UsePresenceOptions {
  locationPath: string;
  userId?: string | null;
  heartbeatIntervalMs?: number;
  idleTimeoutMs?: number;
  metadata?: PresenceMetadata;
}

export function usePresence({
  locationPath,
  userId = null,
  heartbeatIntervalMs = 10_000,
  idleTimeoutMs = 60_000,
  metadata = {},
}: UsePresenceOptions) {
  const [status, setStatus] = useState<PresenceStatus>('active');
  const [othersCount, setOthersCount] = useState(0);

  const supabaseRef = useRef(createSupabaseBrowserClient());
  const sessionIdRef = useRef<string | undefined>(undefined);
  const lastActivityRef = useRef<number>(Date.now());
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // init session id (per tab)
  if (typeof window !== 'undefined' && !sessionIdRef.current) {
    const key = 'presence_session_id';
    const stored = window.sessionStorage.getItem(key);
    const id = stored ?? uuidv4();
    if (!stored) window.sessionStorage.setItem(key, id);
    sessionIdRef.current = id;
  }

  // track activity + visibility
  useEffect(() => {
    function markActivity() {
      lastActivityRef.current = Date.now();
      setStatus((prev) => (prev === 'active' ? prev : 'active'));
    }

    function handleVisibility() {
      if (document.visibilityState === 'hidden') {
        setStatus('background');
      } else {
        markActivity();
      }
    }

    window.addEventListener('mousemove', markActivity);
    window.addEventListener('keydown', markActivity);
    window.addEventListener('scroll', markActivity);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('mousemove', markActivity);
      window.removeEventListener('keydown', markActivity);
      window.removeEventListener('scroll', markActivity);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // heartbeat + realtime
  useEffect(() => {
    const supabase = supabaseRef.current;
    const sessionId = sessionIdRef.current!;
    let cancelled = false;

    async function upsert(currentStatus: PresenceStatus) {
      await supabase.from('presence_state').upsert({
        session_id: sessionId,
        user_id: userId,
        location_path: locationPath,
        status: currentStatus,
        last_heartbeat: new Date().toISOString(),
        metadata,
      });
    }

    async function refreshCount() {
      const { data } = await supabase
        .from('presence_state')
        .select('session_id')
        .eq('location_path', locationPath)
        .eq('status', 'active');
      setOthersCount(data?.length ?? 0);
    }

    upsert('active');
    refreshCount();

    heartbeatRef.current = setInterval(async () => {
      if (cancelled) return;

      const now = Date.now();
      const inactiveFor = now - lastActivityRef.current;

      const nextStatus: PresenceStatus =
        document.visibilityState === 'hidden'
          ? 'background'
          : inactiveFor > idleTimeoutMs
          ? 'idle'
          : 'active';

      setStatus(nextStatus);
      await upsert(nextStatus);
    }, heartbeatIntervalMs);

    const channel = supabase
      .channel('presence_state_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'presence_state',
          filter: `location_path=eq.${locationPath}`,
        },
        refreshCount
      )
      .subscribe();

    return () => {
      cancelled = true;
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      supabase.removeChannel(channel);
    };
  }, [locationPath, userId, heartbeatIntervalMs, idleTimeoutMs, metadata]);

  return { status, othersCount };
}
