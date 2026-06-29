'use client';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { Search, FileQuestion, AlertCircle, ChevronDown, MessageSquare, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Select } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SubjectIcon } from '@/components/feature/subject-icon';
import { fetcher } from '@/lib/hooks';
import { cn } from '@/lib/utils';

interface PYQItem {
  id: string;
  board: string;
  classNum: number;
  subject: string;
  year: number;
  chapter: string | null;
  question: string;
  answer: string;
  marks: number;
  paperType: string | null;
}
interface PYQResponse {
  items: PYQItem[];
  facets: { years: number[]; subjects: string[] };
}

const MARKS = [1, 2, 3, 5, 6];

export default function PyqPage() {
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState('');
  const [marks, setMarks] = useState('');
  const [q, setQ] = useState('');

  const url = useMemo(() => {
    const sp = new URLSearchParams();
    if (subject) sp.set('subject', subject);
    if (year) sp.set('year', year);
    if (marks) sp.set('marks', marks);
    if (q.trim()) sp.set('q', q.trim());
    const s = sp.toString();
    return `/api/pyq${s ? `?${s}` : ''}`;
  }, [subject, year, marks, q]);

  const { data, error, isLoading } = useSWR<PYQResponse>(url, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    keepPreviousData: true,
  });

  const facets = data?.facets;
  const hasFilters = !!(subject || year || marks || q.trim());

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
      <header>
        <h1 className="font-head text-2xl font-bold text-fg">Previous-year questions</h1>
        <p className="text-[13.5px] text-fg-2 mt-0.5">Search the PSEB board paper bank by subject, year and marks.</p>
      </header>

      {/* Filter bar */}
      <Card padding="sm" className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search questions…"
            className="w-full h-10 pl-9 pr-9 text-[14px] bg-surface border border-border rounded-[10px] text-fg outline-none focus:border-accent transition-colors"
          />
          {q && (
            <button
              onClick={() => setQ('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-fg"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={subject}
            onChange={setSubject}
            placeholder="All subjects"
            options={[
              { value: '', label: 'All subjects' },
              ...(facets?.subjects ?? []).map(s => ({ value: s, label: s })),
            ]}
          />
          <Select
            value={year}
            onChange={setYear}
            placeholder="All years"
            options={[
              { value: '', label: 'All years' },
              ...(facets?.years ?? []).map(y => ({ value: String(y), label: String(y) })),
            ]}
          />
          <Select
            value={marks}
            onChange={setMarks}
            options={[
              { value: '', label: 'Any marks' },
              ...MARKS.map(m => ({ value: String(m), label: `${m} mark${m === 1 ? '' : 's'}` })),
            ]}
          />
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setSubject(''); setYear(''); setMarks(''); setQ(''); }}
            >
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Results */}
      {isLoading && !data ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : error ? (
        <Card className="flex items-center gap-3 text-[13px] text-fg-2">
          <AlertCircle className="w-4 h-4 text-danger shrink-0" />
          Couldn&apos;t load questions. Try again later.
        </Card>
      ) : data && data.items.length > 0 ? (
        <div className="space-y-3">
          <p className="text-[12px] text-muted">{data.items.length} question{data.items.length === 1 ? '' : 's'}</p>
          {data.items.map(item => <QuestionCard key={item.id} item={item} />)}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={<FileQuestion className="w-6 h-6" />}
            title={hasFilters ? 'No questions match' : 'No questions yet'}
            description={hasFilters
              ? 'Try widening your filters or clearing the search.'
              : 'The question bank is still being populated for your board.'}
          />
        </Card>
      )}
    </div>
  );
}

function QuestionCard({ item }: { item: PYQItem }) {
  const [show, setShow] = useState(false);
  return (
    <Card padding="sm">
      <div className="flex items-start gap-3">
        <SubjectIcon subject={item.subject} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
            <Badge variant="neutral" size="sm">{item.year}</Badge>
            <Badge variant="accent" size="sm">{item.marks} mark{item.marks === 1 ? '' : 's'}</Badge>
            {item.board && <Badge variant="neutral" size="sm">{item.board}</Badge>}
            {item.chapter && <span className="text-[11px] text-muted truncate">{item.chapter}</span>}
          </div>
          <p className="text-[14px] text-fg leading-relaxed">{item.question}</p>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <Button
              variant="soft"
              size="sm"
              onClick={() => setShow(s => !s)}
              iconRight={<ChevronDown className={cn('w-4 h-4 transition-transform', show && 'rotate-180')} />}
            >
              {show ? 'Hide answer' : 'Show answer'}
            </Button>
            <a href={`/tutor?q=${encodeURIComponent(item.question)}&subject=${encodeURIComponent(item.subject)}`}>
              <Button variant="ghost" size="sm" icon={<MessageSquare className="w-4 h-4" />}>
                Ask tutor
              </Button>
            </a>
          </div>

          {show && (
            <div className="mt-3 p-3 rounded-xl bg-subtle border border-border animate-fade-in">
              <div className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-1.5">Answer</div>
              <p className="text-[13.5px] text-fg-2 leading-relaxed whitespace-pre-wrap">{item.answer}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
