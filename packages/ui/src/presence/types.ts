export type PresenceStatus = 'active' | 'idle' | 'background';

export interface PresenceSnapshot {
  status: PresenceStatus;
  count: number;
}
