import { cn } from '@/lib/utils';
export function Avatar({ name = '?', size = 32, className }: { name?: string; size?: number; className?: string }) {
  const initial = name.trim()[0]?.toUpperCase() || '?';
  return (
    <div
      className={cn('shrink-0 rounded-full grid place-items-center text-white font-head font-bold gradient-bg', className)}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >{initial}</div>
  );
}
