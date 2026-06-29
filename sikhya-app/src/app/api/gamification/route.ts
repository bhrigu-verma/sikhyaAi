import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { levelForXP, xpForNextLevel, checkStreakBadges } from '@/lib/gamification';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }

// The student's game profile: XP, level, progress to next level, badges, streak.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const [user, badges, allBadges, progressRows] = await Promise.all([
    db.user.findUnique({ where: { id: userId }, select: { xp: true, level: true, streakFreezes: true } }),
    db.userBadge.findMany({ where: { userId }, include: { badge: true }, orderBy: { earnedAt: 'desc' } }),
    db.badge.findMany(),
    db.progress.findMany({ where: { userId }, select: { updatedAt: true } }),
  ]);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Streak from progress activity dates.
  const dateSet = new Set<string>();
  for (const r of progressRows) dateSet.add(startOfDay(r.updatedAt).toISOString());
  const today = startOfDay(new Date());
  let cursor = new Date(today);
  let streak = 0;
  if (!dateSet.has(cursor.toISOString())) cursor.setDate(cursor.getDate() - 1);
  while (dateSet.has(cursor.toISOString())) { streak++; cursor.setDate(cursor.getDate() - 1); }

  // Award any newly-qualified streak badges.
  const newlyEarned = await checkStreakBadges(userId, streak);

  const level = levelForXP(user.xp);
  const currentFloor = level > 1 ? xpForNextLevel(level - 1) : 0;
  const nextCeil = xpForNextLevel(level);

  const earnedCodes = new Set(badges.map(b => b.badge.code));
  return NextResponse.json({
    xp: user.xp,
    level,
    streak,
    streakFreezes: user.streakFreezes,
    xpIntoLevel: user.xp - currentFloor,
    xpForLevel: nextCeil - currentFloor,
    newlyEarned,
    badges: allBadges.map(b => ({
      code: b.code, name: b.name, description: b.description, icon: b.icon,
      earned: earnedCodes.has(b.code),
      earnedAt: badges.find(ub => ub.badge.code === b.code)?.earnedAt ?? null,
    })),
  });
}
