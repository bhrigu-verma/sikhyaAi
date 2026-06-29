'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Sparkles, Trophy, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastKind = 'success' | 'error' | 'info' | 'xp' | 'level' | 'badge' | 'streak';

export interface Toast {
  id: string;
  kind: ToastKind;
  title: string;
  description?: string;
  duration?: number;
}

interface Ctx {
  toast: (t: Omit<Toast, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  xp: (amount: number) => void;
  levelUp: (level: number) => void;
  badge: (name: string, icon?: string) => void;
}

const ToastContext = createContext<Ctx | null>(null);

const ICONS: Record<ToastKind, React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 text-success" />,
  error:   <AlertCircle className="w-4 h-4 text-danger" />,
  info:    <Info className="w-4 h-4 text-accent-2" />,
  xp:      <Sparkles className="w-4 h-4 text-accent" />,
  level:   <Trophy className="w-4 h-4 text-accent" />,
  badge:   <Trophy className="w-4 h-4 text-accent" />,
  streak:  <Flame className="w-4 h-4 text-accent" />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => setToasts(t => t.filter(x => x.id !== id)), []);

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    const full = { id, duration: 3500, ...t };
    setToasts(prev => [...prev, full]);
  }, []);

  const api: Ctx = {
    toast,
    success: (title, description) => toast({ kind: 'success', title, description }),
    error:   (title, description) => toast({ kind: 'error', title, description }),
    xp:      (amount) => toast({ kind: 'xp', title: `+${amount} XP`, duration: 2200 }),
    levelUp: (level) => toast({ kind: 'level', title: `Level ${level}!`, description: 'You leveled up 🎉', duration: 5000 }),
    badge:   (name, icon) => toast({ kind: 'badge', title: `${icon ?? '🏅'} ${name}`, description: 'Badge unlocked!', duration: 5000 }),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[100] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map(t => <ToastCard key={t.id} t={t} onClose={() => remove(t.id)} />)}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ t, onClose }: { t: Toast; onClose: () => void }) {
  useEffect(() => {
    const id = setTimeout(onClose, t.duration ?? 3500);
    return () => clearTimeout(id);
  }, [t.duration, onClose]);

  const celebratory = t.kind === 'level' || t.kind === 'badge';
  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto w-full sm:w-[340px] flex items-start gap-3 px-4 py-3 rounded-xl border shadow-soft-2 animate-fade-in',
        celebratory ? 'bg-accent/10 border-accent/30' : 'bg-surface border-border',
      )}
    >
      <div className="mt-0.5 shrink-0">{ICONS[t.kind]}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-semibold text-fg">{t.title}</div>
        {t.description && <div className="text-[12px] text-fg-2 mt-0.5">{t.description}</div>}
      </div>
      <button onClick={onClose} className="text-muted hover:text-fg shrink-0" aria-label="Dismiss">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function useToast(): Ctx {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
