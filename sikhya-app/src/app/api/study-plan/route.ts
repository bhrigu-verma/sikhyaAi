import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getSyllabus } from '@/lib/syllabus';
import { computeWeakTopics } from '@/lib/analytics';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// List the user's active study plans with progress.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const plans = await db.studyPlan.findMany({
    where: { userId, active: true },
    orderBy: { createdAt: 'desc' },
    include: { items: { orderBy: { dueDate: 'asc' } } },
  });

  return NextResponse.json({
    plans: plans.map(p => ({
      id: p.id, title: p.title, subject: p.subject, classNum: p.classNum, targetDate: p.targetDate,
      total: p.items.length,
      done: p.items.filter(i => i.status === 'done').length,
      items: p.items,
    })),
  });
}

const Schema = z.object({
  subject: z.string().min(1).max(60),
  classNum: z.number().int().min(1).max(12),
  targetDate: z.string(), // ISO date
  prioritizeWeak: z.boolean().default(true),
});

// Generate a study plan: spread the syllabus chapters across the days until the
// target date, putting the student's weakest topics first.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const parsed = Schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const { subject, classNum, targetDate, prioritizeWeak } = parsed.data;

  const target = new Date(targetDate);
  if (isNaN(target.getTime()) || target.getTime() < Date.now()) {
    return NextResponse.json({ error: 'targetDate must be a valid future date' }, { status: 400 });
  }

  const syllabus = getSyllabus(subject, classNum);
  if (!syllabus) {
    return NextResponse.json({ error: `No syllabus available for ${subject} Class ${classNum} yet.` }, { status: 404 });
  }

  // Order chapters: weak topics' chapters first (if any), then the rest in sequence.
  let chapters = [...syllabus.chapters];
  if (prioritizeWeak) {
    const weak = await computeWeakTopics(userId, 20);
    const weakChapters = new Set(weak.map(w => (w.chapter ?? '').toLowerCase()).filter(Boolean));
    chapters.sort((a, b) => {
      const aw = weakChapters.has(a.title.toLowerCase()) ? 0 : 1;
      const bw = weakChapters.has(b.title.toLowerCase()) ? 0 : 1;
      return aw - bw || a.num - b.num;
    });
  }

  // Distribute chapters across available days (at least 1 day apart, capped to range).
  const now = new Date();
  const totalDays = Math.max(1, Math.ceil((target.getTime() - now.getTime()) / (24 * 3600 * 1000)));
  const step = Math.max(1, Math.floor(totalDays / chapters.length));

  const plan = await db.studyPlan.create({
    data: {
      userId, subject, classNum, targetDate: target,
      title: `${subject} plan — Class ${classNum}`,
      items: {
        create: chapters.map((ch, i) => {
          const due = new Date(now);
          due.setDate(due.getDate() + Math.min(totalDays, (i + 1) * step));
          return { subject, chapter: ch.title, topic: ch.keyTopics[0] ?? null, dueDate: due, order: i };
        }),
      },
    },
    include: { items: { orderBy: { dueDate: 'asc' } } },
  });

  return NextResponse.json({ plan }, { status: 201 });
}
