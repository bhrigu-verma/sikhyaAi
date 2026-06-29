'use client';
import { cn } from '@/lib/utils';

export interface TabItem { value: string; label: string; icon?: React.ReactNode }

export function Tabs({
  items, value, onChange, className, size = 'md',
}: {
  items: TabItem[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
  size?: 'sm' | 'md';
}) {
  return (
    <div className={cn('inline-flex items-center gap-1 p-1 bg-subtle rounded-xl border border-border', className)}>
      {items.map(it => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            onClick={() => onChange(it.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg font-semibold transition-all',
              size === 'sm' ? 'px-2.5 py-1 text-[12px]' : 'px-3.5 py-1.5 text-[13px]',
              active ? 'bg-surface text-fg shadow-soft-1 border border-border' : 'text-fg-2 hover:text-fg',
            )}
            aria-pressed={active}
          >
            {it.icon}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

export function Select({
  value, onChange, options, className, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={cn(
        'h-9 px-3 pr-8 text-[13px] bg-surface border border-border rounded-[10px] text-fg',
        'outline-none focus:border-accent transition-colors appearance-none cursor-pointer',
        'bg-[length:16px] bg-[right_8px_center] bg-no-repeat',
        className,
      )}
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")` }}
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
