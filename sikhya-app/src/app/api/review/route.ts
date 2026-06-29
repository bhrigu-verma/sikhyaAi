import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Get review cards due now (spaced repetition queue).
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const due = await db.review.findMany({
    where: { userId, dueAt: { lte: new Date() } },
    orderBy: { dueAt: 'asc' },
    take: 30,
    select: { id: true, subject: true, chapter: true, topic: true, prompt: true, answer: true, dueAt: true, repetitions: true },
  });

  const upcomingCount = await db.review.count({ where: { userId, dueAt: { gt: new Date() } } });
  return NextResponse.json({ due, dueCount: due.length, upcomingCount });
}

const CreateSchema = z.object({
  subject: z.string().min(1).max(60),
  chapter: z.string().min(1).max(120),
  topic: z.string().max(120).optional(),
  prompt: z.string().min(1).max(2000),
  answer: z.string().min(1).max(4000),
});

// Add a card to the revision deck (e.g. from a wrong practice answer or a chat).
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const parsed = CreateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const review = await db.review.create({
    data: { userId, ...parsed.data, dueAt: new Date() },
    select: { id: true, dueAt: true },
  });
  return NextResponse.json({ review }, { status: 201 });
}
