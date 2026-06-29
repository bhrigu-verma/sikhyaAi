'use client';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Dialog({
  open, onClose, title, children, className, hideClose,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  hideClose?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn('relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-soft-3 animate-fade-in', className)}
      >
        {(title || !hideClose) && (
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <h2 className="font-head text-sm font-bold text-fg">{title}</h2>
            {!hideClose && (
              <button onClick={onClose} className="text-muted hover:text-fg" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
