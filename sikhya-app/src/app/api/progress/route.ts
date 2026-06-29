import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d: Date) {
  const x = startOfDay(d);
  const day = x.getDay(); // 0 = Sun
  const diff = (day + 6) % 7; // Monday start
  x.setDate(x.getDate() - diff);
  return x;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id as string;

    const rows = await db.progress.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    // Aggregate per subject
    const bySubject: Record<string, { sum: number; count: number }> = {};
    for (const r of rows) {
      if (typeof r.score !== 'number') continue;
      const key = r.subject;
      if (!bySubject[key]) bySubject[key] = { sum: 0, count: 0 };
      bySubject[key].sum += r.score;
      bySubject[key].count++;
    }
    const subjects = Object.entries(bySubject).map(([subject, v]) => ({
      subject,
      avgScore: v.count ? Math.round(v.sum / v.count) : 0,
      count: v.count,
    }));

    // Streak: count consecutive days back from today (or yesterday if today empty)
    const dateSet = new Set<string>();
    for (const r of rows) {
      dateSet.add(startOfDay(r.updatedAt).toISOString());
    }
    let streak = 0;
    const today = startOfDay(new Date());
    let cursor = new Date(today);
    if (!dateSet.has(cursor.toISOString())) {
      // try yesterday
      cursor.setDate(cursor.getDate() - 1);
      if (!dateSet.has(cursor.toISOString())) {
        streak = 0;
      } else {
        while (dateSet.has(cursor.toISOString())) {
          streak++;
          cursor.setDate(cursor.getDate() - 1);
        }
      }
    } else {
      while (dateSet.has(cursor.toISOString())) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      }
    }

    const totalSolved = rows.length;

    // Weekly goal
    const weekStart = startOfWeek(new Date());
    const doneThisWeek = rows.filter(r => r.updatedAt >= weekStart).length;
    const weeklyGoal = { done: doneThisWeek, target: 60 };

    return NextResponse.json({ subjects, streak, totalSolved, weeklyGoal });
  } catch (err) {
    console.error('[PROGRESS_GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = (session.user as any).id as string;

    const body = await request.json().catch(() => null);
    if (!body || typeof body.subject !== 'string' || typeof body.chapter !== 'string' || typeof body.score !== 'number') {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
    const subject = body.subject.trim();
    const chapter = body.chapter.trim();
    const score = Math.max(0, Math.min(100, Math.round(body.score)));
    if (!subject || !chapter) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    // Schema has @@unique([userId, subject, chapter, topic]); topic is nullable.
    // We upsert on that compound key with topic=null.
    await db.progress.upsert({
      where: {
        userId_subject_chapter_topic: {
          userId,
          subject,
          chapter,
          topic: null as any,
        },
      },
      create: {
        userId,
        subject,
        chapter,
        score,
        status: 'done',
      },
      update: {
        score,
        status: 'done',
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PROGRESS_POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
