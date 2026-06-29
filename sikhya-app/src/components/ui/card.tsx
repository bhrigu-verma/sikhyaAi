import * as React from 'react';
import { cn } from '@/lib/utils';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?:  boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const pads = { none: 'p-0', sm: 'p-4', md: 'p-5', lg: 'p-6' };

export function Card({ className, hover, glow, padding = 'md', children, ...rest }: Props) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-2xl shadow-soft-1',
        'transition-all duration-300',
        hover && 'hover:-translate-y-0.5 hover:shadow-soft-2 hover:border-border-strong cursor-pointer',
        glow && 'shadow-soft-1 shadow-glow',
        pads[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
