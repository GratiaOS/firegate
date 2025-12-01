export type PresenceStatus = 'active' | 'idle' | 'background';

export interface PresenceMetadata {
  device?: 'mobile' | 'desktop';
  // extend with cursor positions or other signals later
}

export interface PresenceState {
  sessionId: string;
  userId?: string | null;
  locationPath: string;
  status: PresenceStatus;
  lastHeartbeat: string;
  metadata?: PresenceMetadata;
}
