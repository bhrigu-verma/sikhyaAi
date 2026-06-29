'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SectionHeader } from '@/components/ui/section-header';

const WEEK = [
  { d: 'Mon', mins: 35 }, { d: 'Tue', mins: 50 }, { d: 'Wed', mins: 80 },
  { d: 'Thu', mins: 45 }, { d: 'Fri', mins: 65 }, { d: 'Sat', mins: 95 },
  { d: 'Sun', mins: 70 },
];
const SUBJECTS = [
  { name: 'Science', done: 5, total: 9, pct: 56, color: '#2563EB' },
  { name: 'Math',    done: 3, total: 8, pct: 38, color: '#16A34A' },
  { name: 'English', done: 6, total: 7, pct: 86, color: '#7C3AED' },
  { name: 'SST',     done: 2, total: 7, pct: 29, color: '#B45309' },
];

export default function ProgressPage() {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimate(true), 100); return () => clearTimeout(t); }, []);
  const maxM = Math.max(...WEEK.map(d => d.mins));

  return (
    <div className="px-8 py-7 pb-20 max-w-[1100px] mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KPI label="Weekly study"  value="7h 20m" delta="+1h 40m" />
        <KPI label="Accuracy"      value="78%"     delta="+7%" />
        <KPI label="Chapters done" value="16/31"  delta="+2 chs" />
        <KPI label="Best streak"   value="7 days" delta="Personal best" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4 mb-6">
        <Card padding="lg">
          <SectionHeader
            title="Study time"
            subtitle="This week — daily minutes"
            action={<Badge variant="success">↑ 28% vs last week</Badge>}
          />
          <div className="flex items-end gap-3 h-[180px] mt-3">
            {WEEK.map((d, i) => {
              const h = (d.mins / maxM) * 100;
              const last = i === WEEK.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="flex-1 w-full flex items-end relative">
                    <div
                      className={`w-full rounded-md ${last ? 'gradient-bg' : 'bg-subtle'} transition-[height] duration-700 ease-out relative`}
                      style={{ height: animate ? `${h}%` : '0%', transitionDelay: `${i*60}ms` }}
                    >
                      <div className={`absolute -top-5.5 left-1/2 -translate-x-1/2 font-mono text-[10px] font-semibold whitespace-nowrap ${last ? 'text-accent' : 'text-muted'}`}>
                        {d.mins}m
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted font-medium">{d.d}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card padding="lg">
          <SectionHeader title="Accuracy" subtitle="Overall accuracy rate" />
          <div className="flex justify-center py-2">
            <RingProgress pct={animate ? 78 : 0} />
          </div>
          <div className="flex flex-col gap-2 text-xs text-fg-2 mt-2">
            <Row label="Correct"      value="184 / 236" />
            <Row label="Improvement"  value="+7% vs last wk" tone="accent" />
            <Row label="Best subject" value="English (92%)" />
          </div>
        </Card>
      </div>

      <Card padding="lg">
        <SectionHeader title="By subject" subtitle="Chapters completed" />
        <div className="flex flex-col gap-4.5">
          {SUBJECTS.map(s => (
            <div key={s.name}>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-[13.5px] font-semibold text-fg">{s.name}</span>
                <span className="text-xs text-fg-2 font-mono">{s.done} / {s.total} chapters</span>
              </div>
              <Progress value={animate ? s.pct : 0} color={s.color} height={6} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function KPI({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <Card padding="sm" hover>
      <div className="text-[11px] font-medium text-muted uppercase tracking-wider mb-2">{label}</div>
      <div className="font-head text-[22px] font-bold tracking-tight leading-none text-fg mb-1">{value}</div>
      <div className="text-[11.5px] text-accent-2 font-medium">{delta}</div>
    </Card>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: 'accent' }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-border last:border-0">
      <span className="text-muted">{label}</span>
      <span className={tone === 'accent' ? 'text-accent font-semibold' : 'text-fg font-semibold'}>{value}</span>
    </div>
  );
}

function RingProgress({ pct }: { pct: number }) {
  const size = 160, stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="rgb(var(--accent))" />
            <stop offset="100%" stopColor="rgb(var(--accent-2))" />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgb(var(--subtle))" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#rg)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-head text-3xl font-bold tracking-tight leading-none text-fg">
          {Math.round(pct)}<span className="text-base text-muted">%</span>
        </div>
        <div className="text-[11px] text-muted mt-1">accuracy</div>
      </div>
    </div>
  );
}
