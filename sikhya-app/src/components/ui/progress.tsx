import { cn } from '@/lib/utils';

export function Progress({
  value, className, color, height = 6,
}: { value: number; className?: string; color?: string; height?: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('bg-subtle rounded-full overflow-hidden', className)} style={{ height }}>
      <div
        className="h-full rounded-full transition-[width] duration-1000 ease-out"
        style={{ width: `${v}%`, background: color || 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-2)))' }}
      />
    </div>
  );
}
