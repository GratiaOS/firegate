import React from 'react';
import { Sparkles } from '@gratiaos/icons';

interface LightningStackWalkerBadgeProps {
  size?: 'sm' | 'md';
}

export const LightningStackWalkerBadge: React.FC<LightningStackWalkerBadgeProps> = ({ size = 'md' }) => {
  const base =
    'inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 text-purple-800';
  const sizing =
    size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs font-semibold';

  return (
    <span className={`${base} ${sizing}`}>
      <Sparkles className="w-3 h-3" />
      <span>Young Lightning · Stack walker</span>
    </span>
  );
};
