import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Spinner({ className, size = 18 }: { className?: string; size?: number }) {
  return <Loader2 className={cn('animate-spin text-muted', className)} style={{ width: size, height: size }} />;
}

/** Circular progress ring. value 0–100. */
export function Ring({
  value, size = 64, stroke = 6, children, className, trackClass, color,
}: {
  value: number;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
  className?: string;
  trackClass?: string;
  color?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;
  return (
    <div className={cn('relative inline-grid place-items-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke}
          className={cn('stroke-subtle', trackClass)} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          style={{ stroke: color || 'rgb(var(--accent))', transition: 'stroke-dashoffset 0.9s cubic-bezier(.16,1,.3,1)' }} />
      </svg>
      {children && <div className="absolute inset-0 grid place-items-center">{children}</div>}
    </div>
  );
}
