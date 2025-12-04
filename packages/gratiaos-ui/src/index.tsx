import React from 'react';
import clsx from 'clsx';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
  tone?: 'default' | 'accent';
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  tone = 'default',
  className,
  children,
  ...props
}) => {
  const isPrimary = variant === 'primary';
  const accentBg = tone === 'accent';

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
        isPrimary
          ? accentBg
            ? 'bg-[color:var(--accent)] text-[color:var(--on-accent)] shadow-[0_16px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]'
            : 'bg-slate-200 text-slate-900 hover:bg-slate-100'
          : 'border border-[color:var(--color-border)] bg-[color-mix(in_oklab,var(--tone-surface)_90%,transparent)] text-[color:var(--tone-ink)] hover:border-[color:var(--accent)]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default {
  Button,
};
