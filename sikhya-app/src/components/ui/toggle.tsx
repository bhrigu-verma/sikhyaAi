'use client';
import { cn } from '@/lib/utils';

export function Toggle({
  checked, onChange, size = 'md',
}: { checked: boolean; onChange: (v: boolean) => void; size?: 'sm' | 'md' }) {
  const sm = size === 'sm';
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors',
        sm ? 'w-8 h-[18px]' : 'w-[38px] h-[22px]',
        checked ? 'bg-accent' : 'bg-border-strong',
      )}
    >
      <span className={cn(
        'pointer-events-none inline-block rounded-full bg-white shadow transition-transform',
        sm ? 'w-3.5 h-3.5 mt-px' : 'w-[18px] h-[18px] mt-0.5',
        checked
          ? (sm ? 'translate-x-[14px]' : 'translate-x-[18px]')
          : 'translate-x-0.5',
      )} />
    </button>
  );
}
