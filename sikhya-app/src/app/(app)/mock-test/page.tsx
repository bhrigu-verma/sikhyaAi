'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Plus, Clock, Trophy, Flag, ChevronLeft, ChevronRight, CheckCircle2, XCircle,
  AlertTriangle, Sparkles, RefreshCw, FileText, BookmarkPlus,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ring } from '@/components/ui/ring';
import { Dialog } from '@/components/ui/dialog';
import { Select } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { SubjectIcon } from '@/components/feature/subject-icon';
import { useToast } from '@/components/ui/toast';
import { useMockTests, MockTestListItem } from '@/lib/hooks';
import { PSEB_SYLLABUS } from '@/lib/syllabus';
import { cn } from '@/lib/utils';

const SUBJECTS = Array.from(new Set(PSEB_SYLLABUS.map(s => s.subject)));
function classesFor(subject: string): number[] {
  return Array.from(new Set(PSEB_SYLLABUS.filter(s => s.subject === subject).map(s => s.classNum))).sort((a, b) => a - b);
}

interface PlayerQuestion { index: number; q: string; options: string[]; marks: number }
interface PlayerTest { id: string; title: string; subject: string; classNum: number; durationMin: number; totalMarks: number; questions: PlayerQuestion[] }
interface ReviewItem { index: number; q: string; given: string | null; correct: string; isCorrect: boolean; explanation: string }
interface Results {
  score: number; totalMarks: number; percent: number;
  correctCount: number; totalCount: number;
  review: ReviewItem[]; newBadges: string[];
}

const BADGE_META: Record<string, { name: string; icon: string }> = {
  mock_first: { name: 'First Mock Test', icon: '📝' },
  mock_90: { name: 'Topper — 90%+', icon: '🏆' },
};

function optLetter(opt: string): string {
  return opt.trim().charAt(0).toUpperCase();
}

type View = 'list' | 'player' | 'results';

export default function MockTestPage() {
  const t = useToast();
  const { data, error, isLoading, mutate } = useMockTests();

  const [view, setView] = useState<View>('list');
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState<string | null>(null);

  // create form
  const [subject, setSubject] = useState(SUBJECTS[0] ?? 'Science');
  const [classNum, setClassNum] = useState<number>(classesFor(SUBJECTS[0] ?? 'Science')[0] ?? 10);
  const [count, setCount] = useState(10);
  const [durationMin, setDurationMin] = useState(20);

  // player
  const [test, setTest] = useState<PlayerTest | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flags, setFlags] = useState<Record<number, boolean>>({});
  const [cur, setCur] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const startedAt = useRef<number>(0);

  // results
  const [results, setResults] = useState<Results | null>(null);
  const [savedReview, setSavedReview] = useState<Record<number, boolean>>({});

  function onSubjectChange(s: string) {
    setSubject(s);
    const cls = classesFor(s);
    if (!cls.includes(classNum)) setClassNum(cls[0] ?? 10);
  }

  async function createTest() {
    setCreating(true);
    setCreateErr(null);
    try {
      const res = await fetch('/api/mock-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, classNum, count, durationMin }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || `Could not create test (${res.status})`);
      setCreateOpen(false);
      startPlayer(json.test as PlayerTest);
      mutate();
    } catch (e: any) {
      setCreateErr(e.message || 'Something went wrong.');
    } finally {
      setCreating(false);
    }
  }

  async function openExisting(id: string) {
    try {
      const res = await fetch(`/api/mock-test/${id}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || 'Could not load test');
      startPlayer((json.test ?? json) as PlayerTest);
    } catch (e: any) {
      t.error('Could not start test', e.message);
    }
  }

  function startPlayer(pt: PlayerTest) {
    setTest(pt);
    setAnswers({});
    setFlags({});
    setCur(0);
    setResults(null);
    setSavedReview({});
    setSecondsLeft(pt.durationMin * 60);
    startedAt.current = Date.now();
    setView('player');
  }

  const submitTest = useMemo(() => async () => {
    if (!test || submitting) return;
    setSubmitting(true);
    try {
      const timeTakenSec = Math.max(0, Math.round((Date.now() - startedAt.current) / 1000));
      const res = await fetch(`/api/mock-test/${test.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, timeTakenSec }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || 'Submission failed');
      const r = json as Results;
      setResults(r);
      setView('results');
      (r.newBadges || []).forEach(code => {
        const meta = BADGE_META[code] ?? { name: code, icon: '🏅' };
        t.badge(meta.name, meta.icon);
      });
      mutate();
    } catch (e: any) {
      t.error('Could not submit', e.message);
    } finally {
      setSubmitting(false);
    }
  }, [test, submitting, answers, t, mutate]);

  // countdown timer
  useEffect(() => {
    if (view !== 'player') return;
    if (secondsLeft <= 0) { submitTest(); return; }
    const id = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [view, secondsLeft, submitTest]);

  async function addReviewToDeck(item: ReviewItem) {
    if (!test || savedReview[item.index]) return;
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: test.subject,
          chapter: test.title,
          prompt: item.q,
          answer: `${item.correct}\n\n${item.explanation}`.trim(),
        }),
      });
      if (!res.ok) throw new Error('save failed');
      setSavedReview(s => ({ ...s, [item.index]: true }));
    } catch {
      t.error('Could not add to revise');
    }
  }

  async function reviseAllWrong() {
    if (!results) return;
    const wrong = results.review.filter(r => !r.isCorrect);
    await Promise.all(wrong.map(addReviewToDeck));
    t.success('Added to revise', `${wrong.length} question${wrong.length === 1 ? '' : 's'} saved to your deck.`);
  }

  // ─────────── RESULTS ───────────
  if (view === 'results' && results) {
    const pass = results.percent >= 50;
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        <Card className="flex flex-col sm:flex-row items-center gap-5" glow>
          <Ring value={results.percent} size={104} stroke={9} color={pass ? 'rgb(var(--success))' : 'rgb(var(--danger))'}>
            <div className="text-center leading-none">
              <div className="font-head text-2xl font-bold text-fg">{results.percent}%</div>
              <div className="text-[10px] text-muted font-semibold mt-0.5">{results.score}/{results.totalMarks}</div>
            </div>
          </Ring>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-head text-lg font-bold text-fg">{test?.title ?? 'Mock test'}</h2>
            <p className="text-[13px] text-fg-2 mt-1">
              {results.correctCount} of {results.totalCount} correct · {results.score}/{results.totalMarks} marks
            </p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <Button variant="outline" icon={<BookmarkPlus className="w-4 h-4" />} onClick={reviseAllWrong}>
                Revise wrong ones
              </Button>
              <Button variant="ghost" icon={<RefreshCw className="w-4 h-4" />} onClick={() => { setView('list'); setTest(null); setResults(null); }}>
                Back to tests
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <h3 className="font-head text-[15px] font-bold text-fg">Question review</h3>
          {results.review.map(item => (
            <Card key={item.index} className={cn(
              'space-y-2 border-l-4',
              item.isCorrect ? 'border-l-[rgb(var(--success))]' : 'border-l-danger',
            )}>
              <div className="flex items-start gap-2">
                {item.isCorrect
                  ? <CheckCircle2 className="w-4 h-4 text-[rgb(var(--success))] shrink-0 mt-0.5" />
                  : <XCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />}
                <p className="font-head text-[14px] font-semibold text-fg leading-snug">
                  <span className="text-muted mr-1.5">Q{item.index + 1}.</span>{item.q}
                </p>
              </div>
              <div className="pl-6 space-y-1 text-[12.5px]">
                <div className={cn(item.isCorrect ? 'text-[rgb(var(--success))]' : 'text-danger')}>
                  Your answer: <span className="font-semibold">{item.given ?? '— not answered'}</span>
                </div>
                {!item.isCorrect && (
                  <div className="text-[rgb(var(--success))]">Correct answer: <span className="font-semibold">{item.correct}</span></div>
                )}
                {item.explanation && <p className="text-fg-2 leading-relaxed pt-1">{item.explanation}</p>}
                {!item.isCorrect && (
                  <Button
                    variant="ghost" size="sm" className="mt-1"
                    icon={savedReview[item.index] ? <CheckCircle2 className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                    disabled={savedReview[item.index]}
                    onClick={() => addReviewToDeck(item)}
                  >
                    {savedReview[item.index] ? 'Added' : 'Add to revise'}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // ─────────── PLAYER ───────────
  if (view === 'player' && test) {
    const q = test.questions[cur];
    const answeredCount = Object.keys(answers).length;
    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const ss = String(secondsLeft % 60).padStart(2, '0');
    const low = secondsLeft <= 60;

    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-4">
        {/* header: timer + progress */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-head text-[15px] font-bold text-fg truncate">{test.title}</h2>
            <p className="text-[12px] text-muted">{test.subject} · Class {test.classNum} · {test.totalMarks} marks</p>
          </div>
          <Badge variant={low ? 'danger' : 'accent'} className="text-[13px] tabular-nums">
            <Clock className="w-3.5 h-3.5" /> {mm}:{ss}
          </Badge>
        </div>

        {/* palette */}
        <Card padding="sm">
          <div className="flex flex-wrap gap-1.5">
            {test.questions.map((qq, i) => {
              const isAnswered = answers[qq.index] !== undefined;
              const isFlagged = flags[qq.index];
              const isCur = i === cur;
              return (
                <button
                  key={qq.index}
                  onClick={() => setCur(i)}
                  className={cn(
                    'relative w-8 h-8 rounded-lg text-[12px] font-bold border transition-all',
                    isCur && 'ring-2 ring-accent ring-offset-1 ring-offset-surface',
                    isAnswered ? 'bg-accent/15 border-accent/40 text-accent'
                      : 'bg-surface border-border text-fg-2 hover:border-border-strong',
                  )}
                >
                  {i + 1}
                  {isFlagged && <Flag className="w-2.5 h-2.5 absolute -top-1 -right-1 text-warning fill-warning" />}
                </button>
              );
            })}
          </div>
        </Card>

        {/* current question */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="neutral" size="sm">Question {cur + 1} of {test.questions.length}</Badge>
            <button
              onClick={() => setFlags(f => ({ ...f, [q.index]: !f[q.index] }))}
              className={cn('inline-flex items-center gap-1 text-[12px] font-semibold transition-colors',
                flags[q.index] ? 'text-warning' : 'text-muted hover:text-fg')}
            >
              <Flag className={cn('w-3.5 h-3.5', flags[q.index] && 'fill-warning')} />
              {flags[q.index] ? 'Flagged' : 'Flag'}
            </button>
          </div>
          <p className="font-head text-[15px] font-semibold text-fg leading-snug">{q.q}</p>
          <div className="grid grid-cols-1 gap-2">
            {q.options.map(opt => {
              const letter = optLetter(opt);
              const selected = answers[q.index] === letter;
              return (
                <button
                  key={letter}
                  onClick={() => setAnswers(a => ({ ...a, [q.index]: letter }))}
                  className={cn(
                    'text-left px-4 py-3 rounded-xl text-[13.5px] border transition-all',
                    selected ? 'border-accent bg-accent/10 text-fg font-semibold'
                      : 'border-border text-fg-2 hover:border-accent/40 hover:bg-accent/5',
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </Card>

        {/* nav */}
        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" icon={<ChevronLeft className="w-4 h-4" />} disabled={cur === 0} onClick={() => setCur(c => Math.max(0, c - 1))}>
            Prev
          </Button>
          <span className="text-[12px] text-muted">{answeredCount}/{test.questions.length} answered</span>
          {cur < test.questions.length - 1 ? (
            <Button variant="primary" iconRight={<ChevronRight className="w-4 h-4" />} onClick={() => setCur(c => Math.min(test.questions.length - 1, c + 1))}>
              Next
            </Button>
          ) : (
            <Button variant="gradient" loading={submitting} icon={!submitting && <CheckCircle2 className="w-4 h-4" />} onClick={submitTest}>
              Submit test
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ─────────── LIST ───────────
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-head text-2xl font-bold text-fg">Mock Tests</h1>
          <p className="text-[13px] text-fg-2 mt-1">Timed, exam-style papers graded instantly.</p>
        </div>
        <Button variant="gradient" icon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>
          Create test
        </Button>
      </header>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      )}

      {error && !isLoading && (
        <Card>
          <EmptyState
            icon={<AlertTriangle className="w-6 h-6" />}
            title="Couldn't load your tests"
            description="Something went wrong fetching your mock tests. Please try again."
            action={<Button variant="outline" icon={<RefreshCw className="w-4 h-4" />} onClick={() => mutate()}>Retry</Button>}
          />
        </Card>
      )}

      {!isLoading && !error && data && data.tests.length === 0 && (
        <Card>
          <EmptyState
            icon={<FileText className="w-6 h-6" />}
            title="No mock tests yet"
            description="Create your first timed paper and get an instant board-style score."
            action={<Button variant="gradient" icon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>Create test</Button>}
          />
        </Card>
      )}

      {!isLoading && !error && data && data.tests.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {data.tests.map(test => <MockCard key={test.id} test={test} onStart={() => openExisting(test.id)} />)}
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} title="Create mock test">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-muted font-semibold">Subject</span>
              <Select value={subject} onChange={onSubjectChange} options={SUBJECTS.map(s => ({ value: s, label: s }))} className="w-full" />
            </label>
            <label className="block space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-muted font-semibold">Class</span>
              <Select value={String(classNum)} onChange={v => setClassNum(Number(v))} options={classesFor(subject).map(c => ({ value: String(c), label: `Class ${c}` }))} className="w-full" />
            </label>
            <label className="block space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-muted font-semibold">Questions</span>
              <Select value={String(count)} onChange={v => setCount(Number(v))} options={[5, 10, 15, 20].map(n => ({ value: String(n), label: `${n}` }))} className="w-full" />
            </label>
            <label className="block space-y-1.5">
              <span className="text-[11px] uppercase tracking-wider text-muted font-semibold">Duration</span>
              <Select value={String(durationMin)} onChange={v => setDurationMin(Number(v))} options={[10, 15, 20, 30, 45, 60].map(n => ({ value: String(n), label: `${n} min` }))} className="w-full" />
            </label>
          </div>

          {createErr && (
            <div className="flex items-start gap-2 p-3 rounded-xl border border-danger/30 bg-danger/10 text-danger text-[12.5px]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{createErr}</span>
            </div>
          )}

          <Button variant="gradient" full size="lg" loading={creating} icon={!creating && <Sparkles className="w-4 h-4" />} onClick={createTest}>
            {creating ? 'Generating paper…' : 'Generate & start'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

function MockCard({ test, onStart }: { test: MockTestListItem; onStart: () => void }) {
  return (
    <Card hover onClick={onStart} className="flex items-center gap-4">
      <SubjectIcon subject={test.subject} size={44} />
      <div className="flex-1 min-w-0">
        <h3 className="font-head text-[14.5px] font-bold text-fg truncate">{test.title}</h3>
        <p className="text-[12px] text-fg-2 mt-0.5">{test.subject} · Class {test.classNum}</p>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-[11.5px] text-muted">
          <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{test.durationMin} min</span>
          <span className="inline-flex items-center gap-1"><FileText className="w-3 h-3" />{test.totalMarks} marks</span>
          {test.bestScore != null && (
            <span className="inline-flex items-center gap-1 text-accent font-semibold">
              <Trophy className="w-3 h-3" />Best {test.bestScore}%
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-muted shrink-0" />
    </Card>
  );
}
