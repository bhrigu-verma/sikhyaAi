'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Loader2, ArrowLeft, Flame, BookOpen, TrendingUp, AlertCircle } from 'lucide-react';

interface Subject  { subject: string; avgScore: number; count: number }
interface Activity { subject: string; chapter: string; topic: string | null; score: number | null; status: string; updatedAt: string }
interface WeekDay  { date: string; count: number }
interface ParentData {
  student:        { name: string };
  streak:         number;
  subjects:       Subject[];
  recentActivity: Activity[];
  week:           WeekDay[];
}

export default function ParentPage() {
  const [code,    setCode]    = useState('');
  const [data,    setData]    = useState<ParentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/parent/${encodeURIComponent(code.trim())}`);
      if (res.status === 404) {
        setError('No student found with that access code. Double-check it with your child.');
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error('Failed to load');
      const json = (await res.json()) as ParentData;
      setData(json);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setData(null);
    setCode('');
    setError(null);
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Branding header */}
      <header className="px-6 py-5 border-b border-border flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl gradient-bg grid place-items-center shadow-glow">
            <span className="text-white font-bold text-lg leading-none" style={{ fontFamily: 'serif' }}>ਸ</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-head font-bold text-fg text-[15px]">Sikhya</span>
            <span className="text-[10.5px] text-muted">Parent Dashboard</span>
          </div>
        </Link>
        {data && (
          <button
            onClick={reset}
            className="ml-auto flex items-center gap-1.5 text-[12.5px] text-fg-2 hover:text-fg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Look up another
          </button>
        )}
      </header>

      {/* State 1: enter access code */}
      {!data && (
        <main className="flex-1 grid place-items-center px-6 py-16 min-h-[calc(100vh-72px)]">
          <div className="w-full max-w-[440px]">
            <h1 className="font-head text-2xl font-bold text-fg mb-2">Enter Student Access Code</h1>
            <p className="text-[13.5px] text-fg-2 mb-7">
              See your child&rsquo;s learning progress, streak and recent activity. No login required.
            </p>

            <form onSubmit={lookup} className="space-y-3">
              <input
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Paste access code here"
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
                className="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl text-sm font-mono text-fg placeholder:text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgb(var(--accent)/.12)] outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!code.trim() || loading}
                className="w-full h-11 rounded-xl gradient-bg text-white font-semibold text-sm shadow-[0_4px_16px_rgb(var(--accent)/.3)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all grid place-items-center"
              >
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : 'View Progress'}
              </button>
            </form>

            {error && (
              <div className="mt-4 flex items-start gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-[12.5px] text-destructive">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-7 p-4 rounded-xl border border-border bg-surface">
              <div className="text-[11.5px] font-semibold text-fg mb-1.5">How to get the code?</div>
              <p className="text-[12px] text-fg-2 leading-relaxed">
                Ask your child to open <strong>Settings</strong> in their Sikhya app and copy their <strong>Access Code</strong>. Share it with you securely.
              </p>
            </div>
          </div>
        </main>
      )}

      {/* State 2: dashboard */}
      {data && (
        <main className="px-6 py-8 max-w-[1080px] mx-auto space-y-7">
          {/* Greeting + streak */}
          <section className="rounded-2xl border border-border bg-surface p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-1">Student</div>
              <h2 className="font-head text-2xl font-bold text-fg">{data.student.name}</h2>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-accent/10 border border-accent/20">
              <Flame className="w-5 h-5 text-accent" />
              <div className="leading-tight">
                <div className="text-[18px] font-bold text-accent">{data.streak}</div>
                <div className="text-[10.5px] text-fg-2">day streak</div>
              </div>
            </div>
          </section>

          {/* Subjects */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-fg-2" />
              <h3 className="font-head font-bold text-fg text-[15px]">Subjects</h3>
            </div>
            {data.subjects.length === 0 ? (
              <div className="rounded-xl border border-border bg-surface p-6 text-center text-[13px] text-muted">
                No subject scores yet — your child hasn&rsquo;t completed any practice.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.subjects.map(s => (
                  <div key={s.subject} className="rounded-xl border border-border bg-surface p-4">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-[13px] font-semibold text-fg capitalize">{s.subject.replace('_', ' ')}</span>
                      <span className="text-[12px] text-fg-2"><strong className="text-fg">{s.avgScore}%</strong> avg</span>
                    </div>
                    <div className="h-2 rounded-full bg-subtle overflow-hidden">
                      <div
                        className="h-full gradient-bg rounded-full transition-all"
                        style={{ width: `${Math.max(0, Math.min(100, s.avgScore))}%` }}
                      />
                    </div>
                    <div className="mt-1.5 text-[10.5px] text-muted">{s.count} topic{s.count === 1 ? '' : 's'} attempted</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Weekly heatmap */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-fg-2" />
              <h3 className="font-head font-bold text-fg text-[15px]">Last 7 days</h3>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-end gap-2">
                {data.week.map(d => {
                  const intensity = d.count === 0 ? 0 : d.count >= 5 ? 4 : d.count >= 3 ? 3 : d.count >= 2 ? 2 : 1;
                  const colorMap = ['bg-subtle', 'bg-accent/25', 'bg-accent/45', 'bg-accent/70', 'bg-accent'];
                  const day = new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' });
                  return (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5">
                      <div
                        className={`w-full aspect-square rounded-md ${colorMap[intensity]} border border-border/40`}
                        title={`${d.date}: ${d.count} activity`}
                      />
                      <span className="text-[10px] text-muted">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Recent activity */}
          <section>
            <h3 className="font-head font-bold text-fg text-[15px] mb-3">Recent practice</h3>
            {data.recentActivity.length === 0 ? (
              <div className="rounded-xl border border-border bg-surface p-6 text-center text-[13px] text-muted">
                No practice in the last 7 days.
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-surface divide-y divide-border overflow-hidden">
                {data.recentActivity.map((a, i) => (
                  <div key={i} className="px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-fg truncate">{a.chapter}</div>
                      <div className="text-[11px] text-muted capitalize">
                        {a.subject.replace('_', ' ')}
                        {a.topic ? ` · ${a.topic}` : ''}
                      </div>
                    </div>
                    {typeof a.score === 'number' && (
                      <div className="text-[12.5px] font-bold text-accent shrink-0">{a.score}%</div>
                    )}
                    <div className="text-[10.5px] text-muted shrink-0">
                      {new Date(a.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <footer className="text-center text-[11px] text-muted pt-4 pb-2">
            Sikhya keeps your child&rsquo;s personal data private. Only progress is shown here.
          </footer>
        </main>
      )}
    </div>
  );
}
