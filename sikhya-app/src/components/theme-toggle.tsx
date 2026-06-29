'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className={cn('w-9 h-9', className)} />;
  const isDark = (resolvedTheme || theme) === 'dark';
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        'relative w-9 h-9 grid place-items-center rounded-lg border border-border',
        'text-fg-2 hover:text-fg hover:border-border-strong transition-colors overflow-hidden',
        className
      )}
    >
      <Sun  className={cn('w-4 h-4 absolute transition-transform duration-300', isDark ? '-translate-y-8 rotate-90' : 'translate-y-0 rotate-0')} />
      <Moon className={cn('w-4 h-4 absolute transition-transform duration-300', isDark ? 'translate-y-0 rotate-0' : 'translate-y-8 -rotate-90')} />
    </button>
  );
}
