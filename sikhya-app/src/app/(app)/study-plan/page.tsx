'use client';

import { useState, useMemo } from 'react';
import { CalendarRange, Plus, Check, AlertCircle, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Dialog } from '@/components/ui/dialog';
import { Select } from '@/components/ui/tabs';
import { Ring } from '@/components/ui/ring';
import { Badge } from '@/components/ui/badge';
import { SubjectIcon, subjectStyle } from '@/components/feature/subject-icon';
import { useStudyPlans, type PlanItem } from '@/lib/hooks';
import { PSEB_SYLLABUS } from '@/lib/syllabus';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

const CLASSES = [8, 9, 10];

export default function StudyPlanPage() {
  const { data, error, isLoading, mutate } = useStudyPlans();
  const t = useToast();

  const [open, setOpen] = useState(false);
  const [pendingItems, setPendingItems] = useState<Record<string, boolean>>({});

  const plans = data?.plans ?? [];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-head text-2xl font-bold text-fg">Study plans</h1>
          <p className="text-[13.5px] text-fg-2 mt-0.5">Stay on track for your exams.</p>
        </div>
        {plans.length > 0 && (
          <Button variant="accent" icon={<Plus className="w-4 h-4" />} onClick={() => setOpen(true)}>
            New plan
          </Button>
        )}
      </header>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
        </div>
      ) : error ? (
        <Card className="flex items-center gap-3 text-[13px] text-fg-2">
          <AlertCircle className="w-4 h-4 text-danger shrink-0" />
          Couldn&apos;t load your study plans. Try again later.
        </Card>
      ) : plans.length === 0 ? (
        <Card>
          <EmptyState
            icon={<CalendarRange className="w-6 h-6" />}
            title="No study plans yet"
            description="Create a plan and we'll spread your syllabus across the days until your exam — weakest topics first."
            action={
              <Button variant="accent" icon={<Plus className="w-4 h-4" />} onClick={() => setOpen(true)}>
                Create your first plan
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-5">
          {plans.map(plan => {
            const style = subjectStyle(plan.subject);
            const pct = plan.total ? Math.round((plan.done / plan.total) * 100) : 0;
            return (
              <Card key={plan.id} padding="sm">
                <div className="flex items-center gap-3">
                  <SubjectIcon subject={plan.subject} size={44} />
                  <div className="flex-1 min-w-0">
                    <h2 className="font-head font-bold text-fg text-[15px] truncate">{plan.title}</h2>
                    <div className="text-[12px] text-muted flex items-center gap-2 flex-wrap">
                      <span>Class {plan.classNum}</span>
                      <span>· {plan.done}/{plan.total} done</span>
                      <Badge variant="neutral" size="sm">
                        Target {new Date(plan.targetDate).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                  <Ring value={pct} size={52} color={style.color}>
                    <span className="font-head font-bold text-[13px] text-fg">{pct}%</span>
                  </Ring>
                </div>

                <ul className="mt-4 space-y-1">
                  {plan.items.map(item => (
                    <ChecklistRow
                      key={item.id}
                      item={item}
                      planId={plan.id}
                      pending={!!pendingItems[item.id]}
                      onToggle={async () => {
                        if (item.status === 'done' || pendingItems[item.id]) return;
                        setPendingItems(p => ({ ...p, [item.id]: true }));
                        // Optimistic update
                        mutate(prev => prev && {
                          plans: prev.plans.map(pl => pl.id === plan.id ? {
                            ...pl,
                            done: pl.done + 1,
                            items: pl.items.map(it => it.id === item.id ? { ...it, status: 'done' } : it),
                          } : pl),
                        }, false);
                        try {
                          const res = await fetch(`/api/study-plan/${plan.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ itemId: item.id, status: 'done' }),
                          });
                          if (!res.ok) throw new Error('Failed');
                          t.success('Marked done', item.chapter);
                          mutate();
                        } catch {
                          t.error('Could not update', 'Please try again.');
                          mutate();
                        } finally {
                          setPendingItems(p => { const n = { ...p }; delete n[item.id]; return n; });
                        }
                      }}
                    />
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      )}

      <CreatePlanDialog open={open} onClose={() => setOpen(false)} onCreated={() => { setOpen(false); mutate(); }} />
    </div>
  );
}

function ChecklistRow({
  item, pending, onToggle,
}: { item: PlanItem; planId: string; pending: boolean; onToggle: () => void }) {
  const done = item.status === 'done';
  return (
    <li>
      <button
        onClick={onToggle}
        disabled={done || pending}
        className={cn(
          'w-full flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg text-left transition-colors',
          !done && 'hover:bg-subtle cursor-pointer',
          done && 'cursor-default',
        )}
      >
        <span className={cn(
          'w-5 h-5 rounded-md border grid place-items-center shrink-0 transition-colors',
          done ? 'bg-accent border-accent text-white' : 'border-border-strong',
          pending && 'opacity-60',
        )}>
          {done && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
        </span>
        <div className="flex-1 min-w-0">
          <div className={cn('text-[14px] font-medium truncate', done ? 'text-muted line-through' : 'text-fg')}>
            {item.chapter}
          </div>
          {item.topic && <div className="text-[11.5px] text-muted truncate">{item.topic}</div>}
        </div>
        <span className="text-[11px] text-muted shrink-0">
          {new Date(item.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
      </button>
    </li>
  );
}

function CreatePlanDialog({
  open, onClose, onCreated,
}: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const t = useToast();
  const subjects = useMemo(
    () => Array.from(new Set(PSEB_SYLLABUS.map(s => s.subject))),
    [],
  );
  const [subject, setSubject] = useState(subjects[0] ?? 'Science');
  const [classNum, setClassNum] = useState(10);
  const [targetDate, setTargetDate] = useState('');
  const [prioritizeWeak, setPrioritizeWeak] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setErr(null);
    if (!targetDate) { setErr('Pick a target date.'); return; }
    if (new Date(targetDate).getTime() < Date.now()) { setErr('Target date must be in the future.'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          classNum,
          targetDate: new Date(targetDate).toISOString(),
          prioritizeWeak,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof body.error === 'string' ? body.error : 'Could not create plan.');
      }
      t.success('Plan created', `${subject} · Class ${classNum}`);
      setTargetDate('');
      onCreated();
    } catch (e: any) {
      setErr(e.message || 'Could not create plan.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="Create study plan">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-fg-2">Subject</label>
          <Select
            value={subject}
            onChange={setSubject}
            options={subjects.map(s => ({ value: s, label: s }))}
            className="w-full"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-fg-2">Class</label>
          <Select
            value={String(classNum)}
            onChange={v => setClassNum(Number(v))}
            options={CLASSES.map(c => ({ value: String(c), label: `Class ${c}` }))}
            className="w-full"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-fg-2">Target date</label>
          <input
            type="date"
            value={targetDate}
            min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
            onChange={e => setTargetDate(e.target.value)}
            className="w-full h-9 px-3 text-[13px] bg-surface border border-border rounded-[10px] text-fg outline-none focus:border-accent transition-colors"
          />
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={prioritizeWeak}
            onChange={e => setPrioritizeWeak(e.target.checked)}
            className="w-4 h-4 rounded border-border-strong accent-accent"
          />
          <span className="text-[13px] text-fg-2 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-accent" /> Prioritize my weak topics first
          </span>
        </label>

        {err && (
          <div className="flex items-center gap-2 text-[12.5px] text-danger">
            <AlertCircle className="w-4 h-4 shrink-0" /> {err}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button variant="accent" loading={submitting} onClick={submit} icon={!submitting ? <Plus className="w-4 h-4" /> : undefined}>
            Create plan
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
