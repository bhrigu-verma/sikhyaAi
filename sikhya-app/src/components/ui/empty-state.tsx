import { cn } from '@/lib/utils';

export function EmptyState({
  icon, title, description, action, className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-14 px-6', className)}>
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-subtle grid place-items-center text-muted mb-4">
          {icon}
        </div>
      )}
      <h3 className="font-head text-[15px] font-bold text-fg">{title}</h3>
      {description && <p className="text-[13px] text-fg-2 mt-1.5 max-w-xs leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
