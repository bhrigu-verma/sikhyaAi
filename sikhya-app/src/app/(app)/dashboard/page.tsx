'use client';

import Link from 'next/link';
import {
  Camera, Dumbbell, FileText, MessageSquare, Zap,
  CalendarClock, Target, ChevronRight, AlertCircle, Trophy,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { StreakFlame, LevelRing, StatCard } from '@/components/feature/gamification';
import { SubjectIcon, subjectStyle } from '@/components/feature/subject-icon';
import {
  useGamification, useChats, useReviews, useStudyPlans, useWeakTopics, useMe,
} from '@/lib/hooks';
import { greeting, relativeTime } from '@/lib/utils';

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear()
    && d.getMonth() === now.getMonth()
    && d.getDate() === now.getDate();
}

const QUICK_ACTIONS = [
  { href: '/tutor', label: 'Ask', sub: 'Tutor', icon: MessageSquare },
  { href: '/doubts', label: 'Snap', sub: 'Doubt', icon: Camera },
  { href: '/practice', label: 'Practice', sub: 'Questions', icon: Dumbbell },
  { href: '/mock-test', label: 'Mock', sub: 'Test', icon: FileText },
];

export default function DashboardPage() {
  const { data: me } = useMe();
  const { data: gam, error: gamError, isLoading: gamLoading } = useGamification();
  const { data: chatsData } = useChats();
  const { data: reviews } = useReviews();
  const { data: plansData } = useStudyPlans();
  const { data: weakData } = useWeakTopics();

  const firstName = me?.user.name?.split(' ')[0] ?? null;
  const lastChat = chatsData?.chats?.[0];

  const dueCount = reviews?.dueCount ?? 0;
  const todayItems = (plansData?.plans ?? [])
    .flatMap(p => p.items.map(it => ({ ...it, planTitle: p.title })))
    .filter(it => it.status !== 'done' && isToday(it.dueDate));

  const focusAreas = [...(weakData?.weakTopics ?? [])]
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Greeting header */}
      <header className="space-y-1">
        <h1 className="font-head text-2xl sm:text-3xl font-bold text-fg">
          {greeting()}{firstName ? `, ${firstName}` : ''} 👋
        </h1>
        <p className="text-[13.5px] text-fg-2">Here&apos;s what&apos;s on your plate today.</p>
      </header>

      {/* Gamification overview */}
      {gamLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[88px] rounded-2xl" />)}
        </div>
      ) : gamError ? (
        <Card className="flex items-center gap-3 text-[13px] text-fg-2">
          <AlertCircle className="w-4 h-4 text-danger shrink-0" />
          Couldn&apos;t load your stats. Pull to refresh or try again later.
        </Card>
      ) : gam ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="flex items-center gap-3" padding="sm">
            <LevelRing level={gam.level} value={gam.xpForLevel ? (gam.xpIntoLevel / gam.xpForLevel) * 100 : 0} size={56} />
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-muted font-semibold">Level</div>
              <div className="font-head text-xl font-bold text-fg leading-tight">{gam.level}</div>
              <div className="text-[11px] text-fg-2">{gam.xpIntoLevel}/{gam.xpForLevel} XP</div>
            </div>
          </Card>
          <StatCard label="Total XP" value={gam.xp.toLocaleString()} icon={<Zap className="w-4 h-4" />} accent />
          <Card className="flex items-center justify-between" padding="sm">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-1.5">Streak</div>
              <StreakFlame days={gam.streak} size="lg" />
            </div>
          </Card>
          <StatCard
            label="Badges"
            value={`${gam.badges.filter(b => b.earned).length}/${gam.badges.length}`}
            icon={<Trophy className="w-4 h-4" />}
          />
        </div>
      ) : null}

      {/* Quick actions */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map(a => {
          const Ic = a.icon;
          return (
            <Link key={a.href} href={a.href}>
              <Card hover padding="sm" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-bg grid place-items-center text-white shrink-0">
                  <Ic className="w-5 h-5" />
                </div>
                <div className="leading-tight">
                  <div className="font-head font-bold text-fg text-[15px]">{a.label}</div>
                  <div className="text-[11.5px] text-muted">{a.sub}</div>
                </div>
              </Card>
            </Link>
          );
        })}
      </section>

      {/* Continue last chat */}
      {lastChat && (
        <section className="space-y-2">
          <h2 className="font-head text-sm font-bold text-fg flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted" /> Continue
          </h2>
          <Link href={`/tutor?chat=${lastChat.id}`}>
            <Card hover className="flex items-center gap-3">
              <SubjectIcon subject={lastChat.subject} size={40} />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-fg text-[14px] truncate">{lastChat.title}</div>
                <div className="text-[12px] text-muted flex items-center gap-2">
                  {lastChat.subject && <span className="capitalize">{lastChat.subject}</span>}
                  <span>{lastChat.messageCount} messages</span>
                  <span>· {relativeTime(lastChat.updatedAt)}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted shrink-0" />
            </Card>
          </Link>
        </section>
      )}

      {/* Due today */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-head text-sm font-bold text-fg flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-muted" /> Due today
          </h2>
          {dueCount > 0 && <Badge variant="accent">{dueCount} to review</Badge>}
        </div>
        <Card padding="sm" className="divide-y divide-border">
          {dueCount > 0 && (
            <Link href="/revise" className="flex items-center gap-3 py-3 first:pt-0 group">
              <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent grid place-items-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-fg text-[14px]">Spaced review</div>
                <div className="text-[12px] text-muted">{dueCount} card{dueCount === 1 ? '' : 's'} due for review</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted shrink-0 group-hover:text-fg" />
            </Link>
          )}
          {todayItems.map(it => (
            <Link key={it.id} href="/study-plan" className="flex items-center gap-3 py-3 first:pt-0 group">
              <SubjectIcon subject={it.subject} size={36} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-fg text-[14px] truncate">{it.chapter}</div>
                <div className="text-[12px] text-muted truncate">
                  {it.topic ? it.topic : it.planTitle}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted shrink-0 group-hover:text-fg" />
            </Link>
          ))}
          {dueCount === 0 && todayItems.length === 0 && (
            <EmptyState
              icon={<CalendarClock className="w-6 h-6" />}
              title="Nothing due today"
              description="You're all caught up. Start a study plan or practice to stay sharp."
              action={
                <Link href="/study-plan">
                  <Button variant="soft" size="sm" icon={<CalendarClock className="w-4 h-4" />}>Plan your week</Button>
                </Link>
              }
            />
          )}
        </Card>
      </section>

      {/* Focus areas */}
      <section className="space-y-2">
        <h2 className="font-head text-sm font-bold text-fg flex items-center gap-2">
          <Target className="w-4 h-4 text-muted" /> Focus areas
        </h2>
        {!weakData ? (
          <Card><SkeletonText lines={3} /></Card>
        ) : focusAreas.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Target className="w-6 h-6" />}
              title="No weak spots yet"
              description="Practice a few topics and we'll surface what needs the most attention here."
              action={
                <Link href="/practice">
                  <Button variant="soft" size="sm" icon={<Dumbbell className="w-4 h-4" />}>Start practicing</Button>
                </Link>
              }
            />
          </Card>
        ) : (
          <div className="space-y-2.5">
            {focusAreas.map((w, i) => {
              const style = subjectStyle(w.subject);
              const pct = Math.round(w.accuracy);
              return (
                <Card key={`${w.subject}-${w.chapter}-${i}`} padding="sm">
                  <div className="flex items-center gap-3">
                    <SubjectIcon subject={w.subject} size={40} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-fg text-[14px] truncate">
                        {w.chapter || w.topic || w.subject}
                      </div>
                      <div className="text-[12px] text-muted capitalize truncate">
                        {w.subject}{w.attempts ? ` · ${w.attempts} attempts` : ''}
                      </div>
                    </div>
                    <Link href="/practice">
                      <Button variant="ghost" size="sm" iconRight={<ChevronRight className="w-4 h-4" />}>Practice</Button>
                    </Link>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Progress value={pct} className="flex-1" color={style.color} />
                    <span className="text-[12px] font-semibold tabular-nums" style={{ color: style.color }}>{pct}%</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
