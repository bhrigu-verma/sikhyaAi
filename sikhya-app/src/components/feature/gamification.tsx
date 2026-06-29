import { Flame } from 'lucide-react';
import { Ring } from '@/components/ui/ring';
import { cn } from '@/lib/utils';

export function StreakFlame({ days, size = 'md' }: { days: number; size?: 'sm' | 'md' | 'lg' }) {
  const active = days > 0;
  const dims = size === 'sm' ? 'text-[12px] gap-1 px-2 py-1' : size === 'lg' ? 'text-[16px] gap-1.5 px-3 py-1.5' : 'text-[13px] gap-1 px-2.5 py-1';
  const ic = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <span className={cn('inline-flex items-center rounded-full font-bold border',
      active ? 'bg-accent/10 border-accent/25 text-accent' : 'bg-subtle border-border text-muted', dims)}>
      <Flame className={cn(ic, active && 'fill-accent/20')} />
      {days}
    </span>
  );
}

export function LevelRing({ level, value, size = 64 }: { level: number; value: number; size?: number }) {
  return (
    <Ring value={value} size={size} stroke={size > 50 ? 6 : 5}>
      <div className="text-center leading-none">
        <div className="text-[9px] text-muted font-semibold uppercase tracking-wide">Lvl</div>
        <div className="font-head font-bold text-fg" style={{ fontSize: size * 0.28 }}>{level}</div>
      </div>
    </Ring>
  );
}

export function BadgeChip({ icon, name, earned, onClick }: { icon: string; name: string; earned: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center w-full',
        earned ? 'bg-surface border-border hover:border-accent/40 hover:-translate-y-0.5' : 'bg-subtle/50 border-border opacity-50',
      )}
      title={name}
    >
      <span className={cn('text-2xl', !earned && 'grayscale')}>{icon}</span>
      <span className="text-[10.5px] font-semibold text-fg-2 leading-tight line-clamp-2">{name}</span>
    </button>
  );
}

export function StatCard({ label, value, icon, accent, className }: {
  label: string; value: React.ReactNode; icon?: React.ReactNode; accent?: boolean; className?: string;
}) {
  return (
    <div className={cn('rounded-2xl border border-border bg-surface p-4', accent && 'bg-accent/[0.06] border-accent/20', className)}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] uppercase tracking-wider text-muted font-semibold">{label}</span>
        {icon && <span className="text-muted">{icon}</span>}
      </div>
      <div className="font-head text-2xl font-bold text-fg">{value}</div>
    </div>
  );
}
