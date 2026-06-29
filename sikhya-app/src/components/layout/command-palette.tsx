'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Home, Sparkles, BookOpen, PencilLine, Timer, BarChart3, Library,
  Camera, Repeat, CalendarCheck, FileText, User, Settings, Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Cmd { label: string; href: string; icon: any; keywords?: string }

const COMMANDS: Cmd[] = [
  { label: 'Home',           href: '/dashboard', icon: Home, keywords: 'today overview' },
  { label: 'Ask the Tutor',  href: '/tutor',     icon: Sparkles, keywords: 'chat doubt question ai' },
  { label: 'Snap a Doubt',   href: '/doubts',    icon: Camera, keywords: 'photo camera image' },
  { label: 'Learn',          href: '/learn',     icon: BookOpen, keywords: 'subjects chapters' },
  { label: 'Practice',       href: '/practice',  icon: PencilLine, keywords: 'mcq questions drill grade' },
  { label: 'Mock Tests',     href: '/mock-test', icon: Timer, keywords: 'exam test timed' },
  { label: 'Revise',         href: '/revise',    icon: Repeat, keywords: 'flashcards spaced repetition' },
  { label: 'Study Plan',     href: '/study-plan',icon: CalendarCheck, keywords: 'schedule plan' },
  { label: 'PYQ Bank',       href: '/pyq',       icon: FileText, keywords: 'previous year questions papers' },
  { label: 'Progress',       href: '/progress',  icon: BarChart3, keywords: 'analytics weak topics' },
  { label: 'Profile',        href: '/profile',   icon: User, keywords: 'xp level badges leaderboard' },
  { label: 'Books',          href: '/books',     icon: Library, keywords: 'textbooks library' },
  { label: 'Settings',       href: '/settings',  icon: Settings, keywords: 'appearance language parent api keys' },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('sikhya:command', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('sikhya:command', onOpen);
    };
  }, []);

  useEffect(() => { if (open) { setQ(''); setActive(0); } }, [open]);

  const results = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return COMMANDS;
    return COMMANDS.filter(c => (c.label + ' ' + (c.keywords ?? '')).toLowerCase().includes(s));
  }, [q]);

  function go(href: string) { setOpen(false); router.push(href); }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center pt-[12vh] px-4">
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-soft-3 overflow-hidden animate-fade-in">
        <div className="flex items-center gap-2.5 px-4 border-b border-border">
          <Search className="w-4 h-4 text-muted" />
          <input
            autoFocus
            value={q}
            onChange={e => { setQ(e.target.value); setActive(0); }}
            onKeyDown={e => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); }
              if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
              if (e.key === 'Enter' && results[active]) go(results[active].href);
            }}
            placeholder="Search Sikhya — go anywhere…"
            className="flex-1 py-3.5 text-sm bg-transparent outline-none placeholder:text-muted"
          />
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <div className="px-3 py-6 text-center text-[13px] text-muted">No matches</div>}
          {results.map((c, i) => {
            const Ic = c.icon;
            return (
              <button
                key={c.href}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(c.href)}
                className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-[13.5px]',
                  i === active ? 'bg-subtle text-fg' : 'text-fg-2')}
              >
                <Ic className="w-4 h-4 text-muted" />
                {c.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
