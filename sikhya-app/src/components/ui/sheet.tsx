'use client';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Side = 'right' | 'left' | 'bottom';

export function Sheet({
  open, onClose, side = 'right', title, children, className,
}: {
  open: boolean;
  onClose: () => void;
  side?: Side;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;

  const pos =
    side === 'right'  ? 'top-0 right-0 h-full w-[88%] max-w-[380px] border-l' :
    side === 'left'   ? 'top-0 left-0 h-full w-[88%] max-w-[380px] border-r' :
                        'bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl border-t';

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn('absolute bg-surface border-border shadow-soft-3 flex flex-col animate-fade-in', pos, className)}
      >
        {(title || side === 'bottom') && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
            <h2 className="font-head text-sm font-bold text-fg">{title}</h2>
            <button onClick={onClose} className="text-muted hover:text-fg" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
