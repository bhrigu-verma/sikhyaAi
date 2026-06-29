import { cn } from '@/lib/utils';
export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center justify-center min-w-[18px] px-1.5 py-px',
      'font-mono text-[10.5px] font-semibold text-fg-2',
      'bg-surface border border-border border-b-2 rounded',
      className,
    )}>{children}</span>
  );
}
