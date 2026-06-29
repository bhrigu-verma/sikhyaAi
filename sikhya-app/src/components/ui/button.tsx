'use client';
import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'accent' | 'gradient' | 'ghost' | 'outline' | 'soft' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?:    Size;
  icon?:    React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  full?:    boolean;
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8  px-3 text-[12.5px] gap-1.5 rounded-md',
  md: 'h-9  px-4 text-[13.5px] gap-2   rounded-[10px]',
  lg: 'h-11 px-5 text-[14.5px] gap-2   rounded-xl',
};

const variantClasses: Record<Variant, string> = {
  primary:  'bg-fg text-bg border border-transparent hover:bg-accent hover:text-white',
  accent:   'bg-accent text-white border border-transparent hover:-translate-y-px hover:shadow-[0_6px_24px_rgb(var(--accent)/.3)]',
  gradient: 'gradient-bg text-white border border-transparent hover:-translate-y-px hover:shadow-[0_8px_28px_rgb(var(--accent)/.35)]',
  ghost:    'bg-transparent text-fg-2 hover:bg-subtle hover:text-fg border border-transparent',
  outline:  'bg-surface text-fg border border-border hover:border-border-strong',
  soft:     'bg-accent/10 text-accent border border-accent/20 hover:bg-accent/15',
  danger:   'bg-transparent text-danger border border-border hover:bg-danger/10 hover:border-danger/40',
};

export const Button = React.forwardRef<HTMLButtonElement, Props>(({
  className, variant = 'primary', size = 'md', icon, iconRight, loading, full, children, disabled, ...rest
}, ref) => (
  <button
    ref={ref}
    disabled={disabled || loading}
    className={cn(
      'inline-flex items-center justify-center font-semibold whitespace-nowrap',
      'transition-all duration-200',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      full && 'w-full',
      sizeClasses[size],
      variantClasses[variant],
      className,
    )}
    {...rest}
  >
    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
    {children}
    {iconRight}
  </button>
));
Button.displayName = 'Button';
