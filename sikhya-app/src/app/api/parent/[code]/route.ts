import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  try {
    const { code: rawCode } = await params;
    const code = rawCode?.trim();
    if (!code) {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 });
    }

    // This endpoint is intentionally public (parents have no login), so rate
    // limit by IP to prevent brute-forcing of access codes.
    const ip = clientIp(req);
    const rl = await rateLimit(`parent:${ip}`, { limit: 20, windowSec: 60 });
    if (!rl.success) return tooManyRequests(rl.retryAfter);

    // Resolve via the secure ParentLink code — NOT the raw User.id.
    const link = await db.parentLink.findUnique({
      where: { code },
      select: { id: true, userId: true, active: true, expiresAt: true },
    });

    // Uniform 404 for missing / inactive / expired to avoid leaking which codes exist.
    if (!link || !link.active || (link.expiresAt && link.expiresAt < new Date())) {
      return NextResponse.json({ error: 'Invalid or expired access code' }, { status: 404 });
    }

    const user = await db.user.findUnique({
      where: { id: link.userId },
      select: { id: true, name: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired access code' }, { status: 404 });
    }

    // Best-effort usage tracking (non-blocking)
    db.parentLink.update({
      where: { id: link.id },
      data: { lastUsedAt: new Date(), viewCount: { increment: 1 } },
    }).catch(() => {});

    const rows = await db.progress.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      take: 200,
    });

    // Per-subject avg score
    const bySubject: Record<string, { sum: number; count: number }> = {};
    for (const r of rows) {
      if (typeof r.score !== 'number') continue;
      if (!bySubject[r.subject]) bySubject[r.subject] = { sum: 0, count: 0 };
      bySubject[r.subject].sum   += r.score;
      bySubject[r.subject].count += 1;
    }
    const subjects = Object.entries(bySubject).map(([subject, v]) => ({
      subject,
      avgScore: v.count ? Math.round(v.sum / v.count) : 0,
      count: v.count,
    }));

    // Streak (consecutive days)
    const dateSet = new Set<string>();
    for (const r of rows) dateSet.add(startOfDay(r.updatedAt).toISOString());
    const today = startOfDay(new Date());
    let cursor = new Date(today);
    let streak = 0;
    if (!dateSet.has(cursor.toISOString())) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (dateSet.has(cursor.toISOString())) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    // Last 7 days activity
    const week: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString();
      const count = rows.filter(r => startOfDay(r.updatedAt).toISOString() === key).length;
      week.push({ date: d.toISOString().slice(0, 10), count });
    }

    // Recent activity (last 7 days, max 10)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const recentActivity = rows
      .filter(r => r.updatedAt >= sevenDaysAgo)
      .slice(0, 10)
      .map(r => ({
        subject:  r.subject,
        chapter:  r.chapter,
        topic:    r.topic,
        score:    r.score,
        status:   r.status,
        updatedAt: r.updatedAt,
      }));

    return NextResponse.json({
      student:        { name: user.name ?? 'Student' },
      streak,
      subjects,
      recentActivity,
      week,
    });
  } catch (err) {
    console.error('[PARENT_API_ERROR]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
