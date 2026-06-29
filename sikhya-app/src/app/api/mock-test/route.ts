import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getBackendUrl, generateQuestionArray } from '@/lib/hf';
import { rateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit';
import { cacheKey, cacheGetJSON, cacheSetJSON } from '@/lib/cache';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120; // reasoning model + retries can be slow

const McqSchema = z.object({
  q: z.string().min(1),
  options: z.array(z.string()).min(2).max(6),
  answer: z.string().min(1),
  explanation: z.string().optional().default(''),
  marks: z.number().int().min(1).max(10).optional().default(1),
});

const CreateSchema = z.object({
  subject: z.string().min(1).max(60),
  classNum: z.number().int().min(1).max(12).default(10),
  board: z.string().max(20).default('PSEB'),
  chapters: z.array(z.string()).max(20).optional(),
  count: z.number().int().min(3).max(30).default(10),
  durationMin: z.number().int().min(5).max(180).default(30),
});

// List the user's mock tests with best attempt summary
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const tests = await db.mockTest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true, title: true, subject: true, classNum: true, durationMin: true, totalMarks: true, createdAt: true,
      attempts: { orderBy: { score: 'desc' }, take: 1, select: { score: true, totalMarks: true, submittedAt: true } },
    },
  });
  return NextResponse.json({
    tests: tests.map(t => ({
      id: t.id, title: t.title, subject: t.subject, classNum: t.classNum,
      durationMin: t.durationMin, totalMarks: t.totalMarks, createdAt: t.createdAt,
      bestScore: t.attempts[0]?.score ?? null,
    })),
  });
}

// Generate + persist a new mock test
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const ip = clientIp(req);
  const rl = await rateLimit(`mock:user:${userId}`, { limit: 10, windowSec: 3600 });
  if (!rl.success) return tooManyRequests(rl.retryAfter, 'You’ve created several mock tests. Try again later! 📝');

  const parsed = CreateSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const { subject, classNum, board, chapters, count, durationMin } = parsed.data;

  const backendUrl = getBackendUrl('/api/chat');
  if (!backendUrl) return NextResponse.json({ error: 'Backend not configured' }, { status: 503 });

  const scope = chapters?.length ? `covering these chapters: ${chapters.join(', ')}` : 'covering the full syllabus';
  const ckey = cacheKey('mocktest', board, classNum, subject, scope, count);

  let questions = await cacheGetJSON<any[]>(ckey);
  if (!questions) {
    const prompt = `Create a ${count}-question multiple choice mock test for Class ${classNum} ${subject} (${board} board), ${scope}.
Keep any thinking brief. End your reply with ONLY this JSON array and nothing after it:
[{"q":"...","options":["A) ..","B) ..","C) ..","D) .."],"answer":"A","explanation":"..","marks":1}]`;
    try {
      const raw = await generateQuestionArray({ backendUrl, prompt, classNum, subject, attempts: 3 });
      questions = raw.map(q => McqSchema.safeParse(q)).filter(r => r.success).map((r: any) => r.data);
      if (questions.length > 0) cacheSetJSON(ckey, questions, 30 * 24 * 3600).catch(() => {});
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  if (!questions || questions.length === 0) {
    return NextResponse.json({ error: 'The tutor is busy thinking. Please try again in a moment.' }, { status: 503 });
  }

  const totalMarks = questions.reduce((s, q) => s + (q.marks ?? 1), 0);
  const test = await db.mockTest.create({
    data: {
      userId, subject, classNum, board, durationMin,
      title: `${subject} Mock Test — Class ${classNum}`,
      questions: questions as any,
      totalMarks,
    },
    select: { id: true, title: true, subject: true, classNum: true, durationMin: true, totalMarks: true, questions: true },
  });

  // Don't leak answers in the create response — strip them for the client.
  const clientQuestions = (test.questions as any[]).map((q, i) => ({
    index: i, q: q.q, options: q.options, marks: q.marks ?? 1,
  }));
  return NextResponse.json({ test: { ...test, questions: clientQuestions } }, { status: 201 });
}
