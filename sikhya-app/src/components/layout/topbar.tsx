'use client';
import { usePathname } from 'next/navigation';
import { Search, Sparkles, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

const META: Record<string, { title: string; sub: string }> = {
  '/dashboard':  { title: 'Home',        sub: 'Your learning today' },
  '/tutor':      { title: 'AI Tutor',    sub: 'Ask anything — type, speak, or snap a photo' },
  '/doubts':     { title: 'Doubts',      sub: 'Snap a question, get a step-by-step answer' },
  '/learn':      { title: 'Lessons',     sub: 'Subjects & chapters' },
  '/practice':   { title: 'Practice',    sub: 'Drill MCQs & get answers graded' },
  '/mock-test':  { title: 'Mock Tests',  sub: 'Timed, board-pattern practice exams' },
  '/revise':     { title: 'Revise',      sub: 'Spaced repetition — review what fades' },
  '/pyq':        { title: 'PYQ Bank',    sub: 'Previous-year board questions' },
  '/progress':   { title: 'Progress',    sub: 'Where you stand, what to focus on' },
  '/profile':    { title: 'Profile',     sub: 'XP, badges & leaderboard' },
  '/study-plan': { title: 'Study Plan',  sub: 'Your roadmap to the exam' },
  '/settings':   { title: 'Settings',    sub: 'Appearance, language, parent access, keys' },
  '/books':      { title: 'PSEB Books',  sub: 'Class 6–12 textbook library' },
};

export function TopBar({ onMobileMenu }: { onMobileMenu: () => void }) {
  const pathname = usePathname();
  const meta = META[pathname] ?? { title: 'Sikhya', sub: '' };
  const openCmd = () => window.dispatchEvent(new Event('sikhya:command'));

  return (
    <header className="h-[60px] flex items-center gap-4 px-4 sm:px-5 bg-surface/70 backdrop-blur-xl border-b border-border sticky top-0 z-30">
      <button onClick={onMobileMenu} className="lg:hidden w-9 h-9 grid place-items-center text-fg-2 hover:text-fg rounded-lg">
        <Menu className="w-[18px] h-[18px]" />
      </button>

      <div className="min-w-0">
        <h1 className="font-head text-base font-bold text-fg truncate">{meta.title}</h1>
        <div className="text-[11.5px] text-muted hidden sm:block">{meta.sub}</div>
      </div>

      <button
        onClick={openCmd}
        className="hidden md:flex flex-1 max-w-[420px] items-center gap-2 px-2.5 ml-6 h-9 bg-subtle border border-border rounded-[9px] text-muted hover:border-border-strong transition-colors"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="flex-1 text-left text-[13px]">Search or jump to…</span>
        <Kbd>⌘K</Kbd>
      </button>

      <div className="flex items-center gap-2 ml-auto">
        <button onClick={openCmd} className="md:hidden w-9 h-9 grid place-items-center text-fg-2 hover:text-fg rounded-lg border border-border" aria-label="Search">
          <Search className="w-4 h-4" />
        </button>
        <Link href="/tutor" className="hidden sm:block">
          <Button variant="gradient" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>Ask AI</Button>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
