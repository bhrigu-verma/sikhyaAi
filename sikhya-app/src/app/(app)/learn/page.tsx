'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Check, ArrowRight, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SectionHeader } from '@/components/ui/section-header';
import { cn } from '@/lib/utils';

const SUBJECTS = ['Science', 'Math', 'English', 'SST'];

const CHAPTERS: Record<string, { n: number; title: string; status: 'done' | 'active' | 'upcoming'; topics: number; progress: number }[]> = {
  Science: [
    { n: 1, title: 'Chemical Reactions',         status: 'done',     topics: 8, progress: 100 },
    { n: 2, title: 'Acids, Bases & Salts',       status: 'done',     topics: 6, progress: 100 },
    { n: 3, title: 'Metals & Non-metals',        status: 'done',     topics: 7, progress: 100 },
    { n: 4, title: 'Carbon & Its Compounds',     status: 'done',     topics: 9, progress: 100 },
    { n: 5, title: 'Light — Reflection',         status: 'done',     topics: 5, progress: 100 },
    { n: 6, title: 'Life Processes',             status: 'active',   topics: 5, progress: 62 },
    { n: 7, title: 'Control & Coordination',     status: 'upcoming', topics: 6, progress: 0 },
    { n: 8, title: 'Reproduction',               status: 'upcoming', topics: 7, progress: 0 },
    { n: 9, title: 'Heredity & Evolution',       status: 'upcoming', topics: 5, progress: 0 },
  ],
  Math:    [{ n: 1, title: 'Real Numbers', status: 'done', topics: 4, progress: 100 }],
  English: [{ n: 1, title: 'A Letter to God', status: 'done', topics: 3, progress: 100 }],
  SST:     [{ n: 1, title: 'Rise of Nationalism', status: 'active', topics: 5, progress: 40 }],
};

export default function LearnPage() {
  const [active, setActive] = useState('Science');
  const list = CHAPTERS[active] || [];
  const done = list.filter(c => c.status === 'done').length;

  return (
    <div className="px-8 py-7 pb-20 max-w-[1000px] mx-auto">
      <div className="flex flex-wrap gap-1.5 mb-6">
        {SUBJECTS.map(s => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={cn(
              'px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-colors border',
              active === s ? 'bg-fg text-bg border-fg' : 'bg-transparent text-fg-2 hover:text-fg border-border',
            )}
          >{s}</button>
        ))}
      </div>

      <SectionHeader
        title={`${active} · Class 10 PSEB`}
        subtitle={`${done} of ${list.length} chapters complete`}
        action={<Button variant="ghost" size="sm" icon={<Filter className="w-3.5 h-3.5" />}>Filter</Button>}
      />

      <div className="flex flex-col gap-2.5">
        {list.map(ch => (
          <ChapterRow key={ch.n} ch={ch} />
        ))}
      </div>
    </div>
  );
}

function ChapterRow({ ch }: { ch: { n: number; title: string; status: string; topics: number; progress: number } }) {
  const isDone   = ch.status === 'done';
  const isActive = ch.status === 'active';
  return (
    <Link href="/tutor">
      <Card hover padding="none" className="group">
        <div className="grid grid-cols-[56px_1fr_auto_auto] gap-4 items-center px-5 py-4">
          <div className={cn(
            'w-11 h-11 rounded-xl grid place-items-center font-head font-bold text-sm',
            isDone   ? 'bg-accent-2/10 text-accent-2'
            : isActive ? 'bg-accent/10 text-accent'
            : 'bg-subtle text-muted',
          )}>
            {isDone ? <Check className="w-[18px] h-[18px]" /> : `0${ch.n}`}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[14.5px] font-semibold text-fg">{ch.title}</span>
              {isActive && <Badge variant="accent" size="sm">In progress</Badge>}
            </div>
            <div className="text-xs text-muted">
              {ch.topics} topics · Chapter {ch.n}
              {isActive && ` · ${ch.progress}% complete`}
            </div>
          </div>
          {!ch.status.startsWith('upcoming') && (
            <div className="w-[120px] hidden md:block">
              <Progress value={ch.progress} height={4} color={isDone ? 'rgb(var(--accent-2))' : undefined} />
            </div>
          )}
          <ArrowRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors group-hover:translate-x-0.5" />
        </div>
      </Card>
    </Link>
  );
}
