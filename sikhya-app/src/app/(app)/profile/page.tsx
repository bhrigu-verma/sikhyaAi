'use client';

import { useState } from 'react';
import { Globe2, Users, Trophy, Crown, AlertCircle, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Tabs } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Dialog } from '@/components/ui/dialog';
import { LevelRing, StreakFlame, BadgeChip } from '@/components/feature/gamification';
import { useGamification, useLeaderboard, useMe } from '@/lib/hooks';
import { cn } from '@/lib/utils';

type Scope = 'global' | 'class';

interface SelectedBadge { name: string; description: string; icon: string; earned: boolean; earnedAt: string | null }

export default function ProfilePage() {
  const { data: me } = useMe();
  const { data: gam, error: gamError, isLoading: gamLoading } = useGamification();
  const [scope, setScope] = useState<Scope>('global');
  const { data: board, error: boardError, isLoading: boardLoading } = useLeaderboard(scope);
  const [selected, setSelected] = useState<SelectedBadge | null>(null);

  const user = me?.user;
  const xpPct = gam && gam.xpForLevel ? (gam.xpIntoLevel / gam.xpForLevel) * 100 : 0;
  const earnedCount = gam?.badges.filter(b => b.earned).length ?? 0;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Profile header */}
      <Card>
        {gamLoading ? (
          <div className="flex items-center gap-4">
            <Skeleton className="w-[88px] h-[88px] rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3.5 w-56" />
              <Skeleton className="h-2 w-full" />
            </div>
          </div>
        ) : gamError ? (
          <div className="flex items-center gap-3 text-[13px] text-fg-2">
            <AlertCircle className="w-4 h-4 text-danger shrink-0" />
            Couldn&apos;t load your profile stats. Try again later.
          </div>
        ) : gam ? (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative shrink-0">
              <LevelRing level={gam.level} value={xpPct} size={96} />
            </div>
            <div className="flex-1 w-full min-w-0 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                <h1 className="font-head text-xl font-bold text-fg truncate">
                  {user?.name ?? 'Student'}
                </h1>
                <div className="flex items-center gap-2 justify-center">
                  <StreakFlame days={gam.streak} size="md" />
                  {gam.streakFreezes > 0 && (
                    <Badge variant="accent" size="sm">❄ {gam.streakFreezes} freeze{gam.streakFreezes === 1 ? '' : 's'}</Badge>
                  )}
                </div>
              </div>
              {user?.grade && (
                <p className="text-[12.5px] text-muted mt-0.5">Class {user.grade}{user.board ? ` · ${user.board}` : ''}</p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent shrink-0" />
                <Progress value={xpPct} className="flex-1" />
                <span className="text-[12px] font-semibold text-fg-2 tabular-nums whitespace-nowrap">
                  {gam.xpIntoLevel}/{gam.xpForLevel} XP
                </span>
              </div>
              <p className="text-[11.5px] text-muted mt-1.5">
                {gam.xp.toLocaleString()} XP total · {gam.xpForLevel - gam.xpIntoLevel} XP to level {gam.level + 1}
              </p>
            </div>
          </div>
        ) : null}
      </Card>

      {/* Badge shelf */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-head text-sm font-bold text-fg flex items-center gap-2">
            <Trophy className="w-4 h-4 text-muted" /> Badges
          </h2>
          {gam && <span className="text-[12px] text-muted">{earnedCount}/{gam.badges.length} earned</span>}
        </div>
        {gamLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-[92px] rounded-xl" />)}
          </div>
        ) : gam && gam.badges.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {gam.badges.map(b => (
              <BadgeChip
                key={b.code}
                icon={b.icon}
                name={b.name}
                earned={b.earned}
                onClick={() => setSelected(b)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState
              icon={<Trophy className="w-6 h-6" />}
              title="No badges yet"
              description="Keep learning to unlock your first badge."
            />
          </Card>
        )}
      </section>

      {/* Leaderboard */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-head text-sm font-bold text-fg flex items-center gap-2">
            <Crown className="w-4 h-4 text-muted" /> Leaderboard
          </h2>
          <Tabs
            items={[
              { value: 'global', label: 'Global', icon: <Globe2 className="w-3.5 h-3.5" /> },
              { value: 'class', label: 'Class', icon: <Users className="w-3.5 h-3.5" /> },
            ]}
            value={scope}
            onChange={v => setScope(v as Scope)}
            size="sm"
          />
        </div>
        <Card padding="sm">
          {boardLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
            </div>
          ) : boardError ? (
            <div className="flex items-center gap-3 text-[13px] text-fg-2 py-4">
              <AlertCircle className="w-4 h-4 text-danger shrink-0" />
              Couldn&apos;t load the leaderboard. Try again later.
            </div>
          ) : board && board.leaders.length > 0 ? (
            <div className="divide-y divide-border">
              {board.leaders.map(l => (
                <div
                  key={`${l.rank}-${l.name}`}
                  className={cn(
                    'flex items-center gap-3 py-2.5 px-1 -mx-1 rounded-lg',
                    l.isCurrentUser && 'bg-accent/[0.07] ring-1 ring-accent/20',
                  )}
                >
                  <div className={cn(
                    'w-7 text-center font-head font-bold text-[13px] shrink-0',
                    l.rank === 1 ? 'text-warning' : l.rank <= 3 ? 'text-accent' : 'text-muted',
                  )}>
                    {l.rank <= 3 ? ['🥇', '🥈', '🥉'][l.rank - 1] : l.rank}
                  </div>
                  <Avatar name={l.name} size={34} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-fg text-[14px] truncate flex items-center gap-2">
                      {l.name}
                      {l.isCurrentUser && <Badge variant="accent" size="sm">You</Badge>}
                    </div>
                    <div className="text-[11.5px] text-muted">Level {l.level}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-head font-bold text-fg text-[14px] tabular-nums">{l.score.toLocaleString()}</div>
                    <div className="text-[10.5px] uppercase tracking-wide text-muted">XP</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Crown className="w-6 h-6" />}
              title="No rankings yet"
              description={scope === 'class' ? 'Your class leaderboard is still warming up.' : 'Be the first to climb the leaderboard.'}
            />
          )}
        </Card>
      </section>

      {/* Badge detail dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} title="Badge">
        {selected && (
          <div className="flex flex-col items-center text-center gap-3">
            <span className={cn('text-5xl', !selected.earned && 'grayscale opacity-50')}>{selected.icon}</span>
            <div>
              <h3 className="font-head text-lg font-bold text-fg">{selected.name}</h3>
              <p className="text-[13px] text-fg-2 mt-1 leading-relaxed">{selected.description}</p>
            </div>
            {selected.earned ? (
              <Badge variant="success">
                Earned{selected.earnedAt ? ` · ${new Date(selected.earnedAt).toLocaleDateString()}` : ''}
              </Badge>
            ) : (
              <Badge variant="neutral">Locked</Badge>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}
