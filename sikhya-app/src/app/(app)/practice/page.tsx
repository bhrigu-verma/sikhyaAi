'use client';
import { useState } from 'react';
import {
  Brain, PenLine, Sparkles, CheckCircle2, XCircle, RefreshCw, ChevronRight,
  Flame, BookmarkPlus, Loader2, AlertTriangle, KeyRound, ClipboardCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Ring } from '@/components/ui/ring';
import { Tabs, Select } from '@/components/ui/tabs';
import { SubjectIcon } from '@/components/feature/subject-icon';
import { useToast } from '@/components/ui/toast';
import { PSEB_SYLLABUS, getSyllabus } from '@/lib/syllabus';
import { cn } from '@/lib/utils';

// ─── Shared subject/class option helpers ───
const SUBJECTS = Array.from(new Set(PSEB_SYLLABUS.map(s => s.subject)));
function classesFor(subject: string): number[] {
  return Array.from(new Set(PSEB_SYLLABUS.filter(s => s.subject === subject).map(s => s.classNum))).sort((a, b) => a - b);
}

interface MCQ { q: string; options: string[]; answer: string; explanation: string }

/** Return the leading option letter, e.g. "A" from "A) Something". */
function optLetter(opt: string): string {
  return opt.trim().charAt(0).toUpperCase();
}
function isAnswer(opt: string, answer: string): boolean {
  const a = answer.trim();
  return a.toUpperCase() === optLetter(opt) || a === opt.trim();
}

export default function PracticePage() {
  const [mode, setMode] = useState<'mcq' | 'written'>('mcq');
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <header className="space-y-3">
        <div>
          <h1 className="font-head text-2xl font-bold text-fg">Practice</h1>
          <p className="text-[13px] text-fg-2 mt-1">Drill MCQs or get your written answers graded by AI.</p>
        </div>
        <Tabs
          value={mode}
          onChange={v => setMode(v as 'mcq' | 'written')}
          items={[
            { value: 'mcq', label: 'MCQ Drill', icon: <Brain className="w-3.5 h-3.5" /> },
            { value: 'written', label: 'Written Answer', icon: <PenLine className="w-3.5 h-3.5" /> },
          ]}
        />
      </header>
      {mode === 'mcq' ? <McqDrill /> : <WrittenAnswer />}
    </div>
  );
}

// ─────────────────────────── MCQ DRILL ───────────────────────────
type McqPhase = 'config' | 'loading' | 'playing' | 'error';

function McqDrill() {
  const t = useToast();
  const [subject, setSubject] = useState(SUBJECTS[0] ?? 'Science');
  const [classNum, setClassNum] = useState<number>(classesFor(SUBJECTS[0] ?? 'Science')[0] ?? 10);
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);

  const [phase, setPhase] = useState<McqPhase>('config');
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [busy503, setBusy503] = useState(false);

  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<Record<number, string>>({});
  const [correctStreak, setCorrectStreak] = useState(0);
  const [correctTotal, setCorrectTotal] = useState(0);
  const [saved, setSaved] = useState<Record<number, boolean>>({});

  const chapters = getSyllabus(subject, classNum)?.chapters ?? [];

  function onSubjectChange(s: string) {
    setSubject(s);
    const cls = classesFor(s);
    if (!cls.includes(classNum)) setClassNum(cls[0] ?? 10);
    setTopic('');
  }

  async function generate() {
    setPhase('loading');
    setErrMsg(null);
    setBusy503(false);
    setQuestions([]);
    setIdx(0);
    setChosen({});
    setSaved({});
    setCorrectStreak(0);
    setCorrectTotal(0);
    try {
      const res = await fetch('/api/practice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic: topic.trim() || 'general', classNum, count }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 503) {
        setBusy503(true);
        setErrMsg(data?.error || 'The AI is busy thinking right now. Please try again in a moment.');
        setPhase('error');
        return;
      }
      if (!res.ok) throw new Error(data?.error || `Failed to generate questions (${res.status})`);
      const qs: MCQ[] = data.questions || [];
      if (!qs.length) throw new Error('No questions were generated. Try a different topic.');
      setQuestions(qs);
      setPhase('playing');
    } catch (e: any) {
      setErrMsg(e.message || 'Something went wrong.');
      setPhase('error');
    }
  }

  function answer(q: MCQ, opt: string) {
    if (chosen[idx] !== undefined) return; // already answered
    const correct = isAnswer(opt, q.answer);
    setChosen(c => ({ ...c, [idx]: optLetter(opt) }));
    setCorrectStreak(s => (correct ? s + 1 : 0));
    if (correct) setCorrectTotal(n => n + 1);
    if (correct) t.xp(5);
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'practice_attempt', subject, topic: topic.trim() || 'general', correct }),
    }).catch(() => {});
  }

  async function addToRevise(q: MCQ) {
    if (saved[idx]) return;
    const correctOpt = q.options.find(o => isAnswer(o, q.answer)) ?? q.answer;
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          chapter: topic.trim() || subject,
          topic: topic.trim() || undefined,
          prompt: q.q,
          answer: `${correctOpt}\n\n${q.explanation}`.trim(),
        }),
      });
      if (!res.ok) throw new Error('save failed');
      setSaved(s => ({ ...s, [idx]: true }));
      t.success('Added to revise', 'You will see this in your revision deck.');
    } catch {
      t.error('Could not add to revise', 'Please try again.');
    }
  }

  // ── Render: config ──
  if (phase === 'config' || phase === 'error') {
    return (
      <Card className="space-y-5">
        <div className="flex items-center gap-3">
          <SubjectIcon subject={subject} size={42} />
          <div>
            <h2 className="font-head text-[15px] font-bold text-fg">Build an MCQ set</h2>
            <p className="text-[12px] text-fg-2">Fresh AI questions from the PSEB syllabus.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Subject">
            <Select
              value={subject}
              onChange={onSubjectChange}
              options={SUBJECTS.map(s => ({ value: s, label: s }))}
              className="w-full"
            />
          </Field>
          <Field label="Class">
            <Select
              value={String(classNum)}
              onChange={v => setClassNum(Number(v))}
              options={classesFor(subject).map(c => ({ value: String(c), label: `Class ${c}` }))}
              className="w-full"
            />
          </Field>
          <Field label="Chapter">
            <Select
              value={topic}
              onChange={setTopic}
              placeholder="Any chapter"
              options={chapters.map(c => ({ value: c.title, label: `${c.num}. ${c.title}` }))}
              className="w-full"
            />
          </Field>
          <Field label="Or custom topic">
            <input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Reflection of light"
              className="h-9 w-full px-3 text-[13px] bg-surface border border-border rounded-[10px] text-fg outline-none focus:border-accent transition-colors"
            />
          </Field>
          <Field label="Questions">
            <Select
              value={String(count)}
              onChange={v => setCount(Number(v))}
              options={[5, 10, 15].map(n => ({ value: String(n), label: `${n} questions` }))}
              className="w-full"
            />
          </Field>
        </div>

        {phase === 'error' && errMsg && (
          <div className={cn(
            'flex items-start gap-2.5 p-3 rounded-xl border text-[12.5px]',
            busy503 ? 'border-warning/30 bg-warning/10 text-warning' : 'border-danger/30 bg-danger/10 text-danger',
          )}>
            {busy503 ? <Loader2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
            <span className="flex-1">{errMsg}</span>
          </div>
        )}

        <Button variant="gradient" size="lg" full icon={<Sparkles className="w-4 h-4" />} onClick={generate}>
          {phase === 'error' ? 'Retry' : 'Generate questions'}
        </Button>
      </Card>
    );
  }

  // ── Render: loading ──
  if (phase === 'loading') {
    return (
      <Card className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="w-12 h-12 rounded-2xl gradient-bg grid place-items-center animate-pulse shadow-glow">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <p className="text-[13px] text-fg-2">Generating {count} questions on {topic.trim() || subject}…</p>
      </Card>
    );
  }

  // ── Render: playing ──
  const q = questions[idx];
  const answered = chosen[idx] !== undefined;
  const wasCorrect = answered && q.options.some(o => optLetter(o) === chosen[idx] && isAnswer(o, q.answer));
  const answeredCount = Object.keys(chosen).length;
  const done = idx === questions.length - 1 && answered;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* status bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[12px] font-semibold text-fg-2">Question {idx + 1} of {questions.length}</span>
            <span className="text-[12px] text-muted">{correctTotal}/{answeredCount} correct</span>
          </div>
          <Progress value={(answeredCount / questions.length) * 100} />
        </div>
        {correctStreak > 1 && (
          <Badge variant="accent" className="shrink-0">
            <Flame className="w-3 h-3" /> {correctStreak} streak
          </Badge>
        )}
      </div>

      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="neutral" size="sm">{subject} · Class {classNum}</Badge>
          {topic.trim() && <Badge variant="neutral" size="sm">{topic.trim()}</Badge>}
        </div>
        <p className="font-head text-[15px] font-semibold text-fg leading-snug">{q.q}</p>

        <div className="grid grid-cols-1 gap-2">
          {q.options.map(opt => {
            const letter = optLetter(opt);
            const isChosen = chosen[idx] === letter;
            const isRight = isAnswer(opt, q.answer);
            return (
              <button
                key={letter}
                disabled={answered}
                onClick={() => answer(q, opt)}
                className={cn(
                  'text-left px-4 py-3 rounded-xl text-[13.5px] border transition-all',
                  !answered && 'border-border text-fg-2 hover:border-accent/40 hover:bg-accent/5',
                  answered && isRight && 'border-[rgb(var(--success))] bg-[rgb(var(--success)/0.1)] text-[rgb(var(--success))] font-semibold',
                  answered && isChosen && !isRight && 'border-danger bg-danger/10 text-danger font-semibold',
                  answered && !isChosen && !isRight && 'border-border text-muted opacity-50',
                )}
              >
                <span className="inline-flex items-center gap-2">
                  {answered && isRight && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  {answered && isChosen && !isRight && <XCircle className="w-4 h-4 shrink-0" />}
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="space-y-3 animate-fade-in">
            <div className={cn(
              'flex items-start gap-2 text-[12.5px] p-3 rounded-lg',
              wasCorrect ? 'bg-[rgb(var(--success)/0.1)] text-[rgb(var(--success))]' : 'bg-danger/10 text-danger',
            )}>
              {wasCorrect ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              <span>{q.explanation}</span>
            </div>
            {!wasCorrect && (
              <Button
                variant="soft"
                size="sm"
                icon={saved[idx] ? <CheckCircle2 className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                onClick={() => addToRevise(q)}
                disabled={saved[idx]}
              >
                {saved[idx] ? 'Added to revise' : 'Add to revise'}
              </Button>
            )}
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => setPhase('config')}>New set</Button>
        {!done ? (
          <Button
            variant="primary"
            iconRight={<ChevronRight className="w-4 h-4" />}
            disabled={!answered}
            onClick={() => setIdx(i => Math.min(i + 1, questions.length - 1))}
          >
            Next question
          </Button>
        ) : (
          <Button variant="gradient" icon={<RefreshCw className="w-4 h-4" />} onClick={() => setPhase('config')}>
            Finish — {correctTotal}/{questions.length} correct
          </Button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────── WRITTEN ANSWER ───────────────────────────
interface GradeResult {
  awardedMarks: number;
  maxMarks: number;
  percent: number;
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
  rubric: { point: string; awarded: boolean }[];
}

function WrittenAnswer() {
  const t = useToast();
  const [subject, setSubject] = useState(SUBJECTS[0] ?? 'Science');
  const [classNum, setClassNum] = useState<number>(classesFor(SUBJECTS[0] ?? 'Science')[0] ?? 10);
  const [question, setQuestion] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [maxMarks, setMaxMarks] = useState(5);
  const [loading, setLoading] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);

  function onSubjectChange(s: string) {
    setSubject(s);
    const cls = classesFor(s);
    if (!cls.includes(classNum)) setClassNum(cls[0] ?? 10);
  }

  const canGrade = question.trim().length >= 3 && studentAnswer.trim().length >= 1 && !loading;

  async function grade() {
    setLoading(true);
    setError(null);
    setNeedsKey(false);
    setResult(null);
    try {
      const res = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim(), studentAnswer: studentAnswer.trim(), maxMarks, subject, classNum }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 400 && data?.needsKey) {
        setNeedsKey(true);
        return;
      }
      if (!res.ok) throw new Error(data?.error || `Grading failed (${res.status})`);
      setResult(data as GradeResult);
      t.success('Answer graded', `You scored ${data.awardedMarks}/${data.maxMarks}.`);
    } catch (e: any) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Subject">
            <Select value={subject} onChange={onSubjectChange} options={SUBJECTS.map(s => ({ value: s, label: s }))} className="w-full" />
          </Field>
          <Field label="Class">
            <Select value={String(classNum)} onChange={v => setClassNum(Number(v))} options={classesFor(subject).map(c => ({ value: String(c), label: `Class ${c}` }))} className="w-full" />
          </Field>
          <Field label="Max marks">
            <Select value={String(maxMarks)} onChange={v => setMaxMarks(Number(v))} options={[1, 2, 3, 5, 8, 10].map(n => ({ value: String(n), label: `${n} marks` }))} className="w-full" />
          </Field>
        </div>

        <Field label="Question">
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            rows={2}
            placeholder="Paste the exam question here…"
            className="w-full p-3 text-[13.5px] bg-surface border border-border rounded-xl text-fg outline-none focus:border-accent transition-colors resize-y"
          />
        </Field>
        <Field label="Your answer">
          <textarea
            value={studentAnswer}
            onChange={e => setStudentAnswer(e.target.value)}
            rows={6}
            placeholder="Write your answer the way you would in the exam…"
            className="w-full p-3 text-[13.5px] bg-surface border border-border rounded-xl text-fg outline-none focus:border-accent transition-colors resize-y"
          />
        </Field>

        {needsKey && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl border border-warning/30 bg-warning/10 text-warning text-[12.5px]">
            <KeyRound className="w-4 h-4 shrink-0 mt-0.5" />
            <span>An AI API key is required to grade answers. Add one in Settings to enable grading.</span>
          </div>
        )}
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl border border-danger/30 bg-danger/10 text-danger text-[12.5px]">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <Button variant="gradient" size="lg" full loading={loading} icon={!loading && <ClipboardCheck className="w-4 h-4" />} disabled={!canGrade} onClick={grade}>
          {loading ? 'Grading…' : 'Grade my answer'}
        </Button>
      </Card>

      {result && (
        <Card className="space-y-5 animate-fade-in" glow>
          <div className="flex items-center gap-4">
            <Ring value={result.percent} size={88} stroke={8}>
              <div className="text-center leading-none">
                <div className="font-head text-xl font-bold text-fg">{result.awardedMarks}</div>
                <div className="text-[10px] text-muted font-semibold">/ {result.maxMarks}</div>
              </div>
            </Ring>
            <div>
              <h3 className="font-head text-[15px] font-bold text-fg">Examiner feedback</h3>
              <p className="text-[12.5px] text-fg-2 mt-0.5">{result.percent}% — graded as a board examiner would.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FeedbackList title="Strengths" tone="good" items={result.strengths} />
            <FeedbackList title="Improvements" tone="bad" items={result.improvements} />
          </div>

          {result.rubric?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[12px] uppercase tracking-wider text-muted font-semibold">Rubric</h4>
              <ul className="space-y-1.5">
                {result.rubric.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-fg-2">
                    {r.awarded
                      ? <CheckCircle2 className="w-4 h-4 text-[rgb(var(--success))] shrink-0 mt-0.5" />
                      : <XCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />}
                    <span className={cn(r.awarded ? 'text-fg' : 'text-muted')}>{r.point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.modelAnswer && (
            <div className="space-y-2">
              <h4 className="text-[12px] uppercase tracking-wider text-muted font-semibold">Model answer</h4>
              <div className="p-4 rounded-xl bg-subtle border border-border text-[13px] text-fg-2 leading-relaxed whitespace-pre-wrap">
                {result.modelAnswer}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

// ─────────────────────────── small helpers ───────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] uppercase tracking-wider text-muted font-semibold">{label}</span>
      {children}
    </label>
  );
}

function FeedbackList({ title, tone, items }: { title: string; tone: 'good' | 'bad'; items: string[] }) {
  return (
    <div className="space-y-2">
      <h4 className="text-[12px] uppercase tracking-wider text-muted font-semibold">{title}</h4>
      {items?.length ? (
        <ul className="space-y-1.5">
          {items.map((it, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-fg-2">
              {tone === 'good'
                ? <CheckCircle2 className="w-4 h-4 text-[rgb(var(--success))] shrink-0 mt-0.5" />
                : <XCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />}
              <span>{it}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[12.5px] text-muted">—</p>
      )}
    </div>
  );
}
