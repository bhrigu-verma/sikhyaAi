import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'neutral' | 'accent' | 'success' | 'warn' | 'danger';
const styles: Record<Variant, string> = {
  neutral: 'bg-subtle text-fg-2 border-border',
  accent:  'bg-accent/10 text-accent border-accent/25',
  success: 'bg-accent-2/10 text-accent-2 border-accent-2/25',
  warn:    'bg-warning/10 text-warning border-warning/25',
  danger:  'bg-danger/10 text-danger border-danger/25',
};

export function Badge({
  children, variant = 'neutral', className, size = 'md',
}: { children: React.ReactNode; variant?: Variant; className?: string; size?: 'sm' | 'md' }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full border font-semibold leading-tight',
      size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-[11px]',
      styles[variant], className,
    )}>{children}</span>
  );
}
