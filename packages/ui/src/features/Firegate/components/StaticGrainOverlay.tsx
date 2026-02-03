import React from 'react';

export function StaticGrainOverlay({ active, intensity = 0.03 }: { active: boolean; intensity?: number }) {
  if (!active) return null;
  return <div aria-hidden="true" className="fg-grain" style={{ opacity: intensity }} />;
}
