import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { sm2 } from '@/lib/spaced-repetition';
import { recordEvent } from '@/lib/analytics';
import { awardXP } from '@/lib/gamification';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Schema = z.object({ quality: z.number().int().min(0).max(5) });

// Record a recall attempt and reschedule the card via SM-2.
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const parsed = Schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const review = await db.review.findFirst({ where: { id: params.id, userId } });
  if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const next = sm2(
    { easeFactor: review.easeFactor, intervalDays: review.intervalDays, repetitions: review.repetitions },
    parsed.data.quality,
  );

  await db.review.update({
    where: { id: review.id },
    data: {
      easeFactor: next.easeFactor,
      intervalDays: next.intervalDays,
      repetitions: next.repetitions,
      dueAt: next.dueAt,
      lastReviewedAt: new Date(),
    },
  });

  recordEvent({
    userId, type: 'review_done', subject: review.subject, chapter: review.chapter, topic: review.topic ?? undefined,
    correct: parsed.data.quality >= 3,
  });
  awardXP(userId, 'review').catch(() => {});

  return NextResponse.json({ nextDueAt: next.dueAt, intervalDays: next.intervalDays });
}
