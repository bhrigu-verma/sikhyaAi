'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?:     string;
  hint?:      string;
  error?:     string;
  icon?:      React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, Props>(({
  className, label, hint, error, icon, iconRight, ...rest
}, ref) => (
  <div className={className}>
    {label && (
      <label className="block text-[12px] font-semibold text-fg tracking-wide uppercase mb-1.5">
        {label}
      </label>
    )}
    <div className={cn(
      'flex items-center gap-2 px-3 bg-surface rounded-xl',
      'border transition-all duration-200',
      error
        ? 'border-danger focus-within:shadow-[0_0_0_3px_rgb(var(--danger)/.18)]'
        : 'border-border focus-within:border-accent focus-within:shadow-[inset_0_2px_4px_rgba(0,0,0,.04),0_0_0_3px_rgb(var(--accent)/.18)]',
    )}>
      {icon && <span className="text-muted">{icon}</span>}
      <input
        ref={ref}
        className="flex-1 py-3 bg-transparent text-[13.5px] text-fg outline-none placeholder:text-muted"
        {...rest}
      />
      {iconRight}
    </div>
    {(hint || error) && (
      <div className={cn('text-[11.5px] mt-1.5', error ? 'text-danger' : 'text-muted')}>
        {error || hint}
      </div>
    )}
  </div>
));
Input.displayName = 'Input';
