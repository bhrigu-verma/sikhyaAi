import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmail, parentDigestTemplate } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }

/**
 * Sends weekly progress digests to opted-in parents.
 * Trigger from a scheduler (Vercel Cron) weekly. Auth via CRON_SECRET
 * (header `x-cron-secret` or `?secret=`), or Vercel's Authorization bearer.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const provided =
    req.headers.get('x-cron-secret') ||
    req.nextUrl.searchParams.get('secret') ||
    (req.headers.get('authorization')?.replace('Bearer ', '') ?? '');
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);

  const links = await db.parentLink.findMany({
    where: { active: true, digestOptIn: true, parentEmail: { not: null } },
    select: { id: true, code: true, parentEmail: true, userId: true },
  });

  let sent = 0;
  for (const link of links) {
    try {
      const user = await db.user.findUnique({ where: { id: link.userId }, select: { name: true } });
      const rows = await db.progress.findMany({
        where: { userId: link.userId },
        orderBy: { updatedAt: 'desc' },
        take: 300,
      });

      // Streak
      const dateSet = new Set<string>();
      for (const r of rows) dateSet.add(startOfDay(r.updatedAt).toISOString());
      const today = startOfDay(new Date());
      let cursor = new Date(today);
      let streak = 0;
      if (!dateSet.has(cursor.toISOString())) cursor.setDate(cursor.getDate() - 1);
      while (dateSet.has(cursor.toISOString())) { streak++; cursor.setDate(cursor.getDate() - 1); }

      const weeklySolved = rows.filter(r => r.updatedAt >= weekAgo).length;

      const bySubject: Record<string, { sum: number; count: number }> = {};
      for (const r of rows) {
        if (typeof r.score !== 'number') continue;
        (bySubject[r.subject] ??= { sum: 0, count: 0 }).sum += r.score;
        bySubject[r.subject].count += 1;
      }
      const subjects = Object.entries(bySubject).map(([subject, v]) => ({
        subject, avgScore: v.count ? Math.round(v.sum / v.count) : 0, count: v.count,
      }));

      const tpl = parentDigestTemplate({
        studentName: user?.name ?? 'Your child',
        streak, weeklySolved, subjects, code: link.code,
      });
      const res = await sendEmail(link.parentEmail!, tpl.subject, tpl.html);
      if (res.ok) {
        sent++;
        await db.parentLink.update({ where: { id: link.id }, data: { lastDigestAt: new Date() } }).catch(() => {});
      }
    } catch (e) {
      console.error('[parent-digest] failed for link', link.id, e);
    }
  }

  return NextResponse.json({ ok: true, candidates: links.length, sent });
}
