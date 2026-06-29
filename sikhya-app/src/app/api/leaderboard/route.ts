import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function startOfWeek(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay();
  const diff = (day + 6) % 7;
  x.setDate(x.getDate() - diff);
  return x;
}

// Weekly leaderboard. scope=global (default) | class — class scopes to peers
// sharing the current user's grade + board (fairer + more motivating).
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const currentUserId = (session.user as any).id as string;

    const scope = req.nextUrl.searchParams.get('scope') === 'class' ? 'class' : 'global';
    const weekStart = startOfWeek(new Date());

    // Determine peer set for class scope.
    let peerIds: string[] | null = null;
    if (scope === 'class') {
      const me = await db.user.findUnique({ where: { id: currentUserId }, select: { grade: true, board: true } });
      if (me?.grade) {
        const peers = await db.user.findMany({
          where: { grade: me.grade, ...(me.board ? { board: me.board } : {}) },
          select: { id: true },
        });
        peerIds = peers.map(p => p.id);
      }
    }

    const grouped = await db.progress.groupBy({
      by: ['userId'],
      _sum: { score: true },
      where: {
        updatedAt: { gte: weekStart },
        ...(peerIds ? { userId: { in: peerIds } } : {}),
      },
      orderBy: { _sum: { score: 'desc' } },
      take: 20,
    });

    const userIds = grouped.map(g => g.userId);
    const users = userIds.length
      ? await db.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true, level: true, xp: true } })
      : [];
    const userMap = new Map(users.map(u => [u.id, u]));

    const leaders = grouped.map((g, i) => {
      const u = userMap.get(g.userId);
      return {
        rank: i + 1,
        name: u?.name || u?.email?.split('@')[0] || 'Anonymous',
        score: g._sum.score ?? 0,
        level: u?.level ?? 1,
        isCurrentUser: g.userId === currentUserId,
      };
    });

    return NextResponse.json({ scope, leaders });
  } catch (err) {
    console.error('[LEADERBOARD_GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
