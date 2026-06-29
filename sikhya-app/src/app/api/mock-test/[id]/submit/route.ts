import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { recordEvent } from '@/lib/analytics';
import { awardXP, grantBadge } from '@/lib/gamification';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SubmitSchema = z.object({
  answers: z.record(z.string()),        // { "0": "A", "1": "C", ... }
  timeTakenSec: z.number().int().min(0).max(36000).default(0),
});

// Grade a mock test submission server-side (answers live only on the server).
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const parsed = SubmitSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const { answers, timeTakenSec } = parsed.data;

  const test = await db.mockTest.findFirst({ where: { id: params.id, userId } });
  if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const questions = test.questions as any[];
  let score = 0, correctCount = 0;
  const review = questions.map((q, i) => {
    const given = answers[String(i)] ?? null;
    // Match by leading letter (e.g. "A") or full option text.
    const correctLetter = String(q.answer).trim().charAt(0).toUpperCase();
    const givenLetter = given ? String(given).trim().charAt(0).toUpperCase() : null;
    const isCorrect = givenLetter !== null && givenLetter === correctLetter;
    const marks = q.marks ?? 1;
    if (isCorrect) { score += marks; correctCount++; }
    recordEvent({
      userId, type: 'mock_submit', subject: test.subject, correct: isCorrect,
      meta: { mockTestId: test.id, questionIndex: i },
    });
    return { index: i, q: q.q, given, correct: q.answer, isCorrect, explanation: q.explanation ?? '' };
  });

  const attempt = await db.mockTestAttempt.create({
    data: {
      mockTestId: test.id, userId, answers: answers as any,
      score, totalMarks: test.totalMarks, correctCount, totalCount: questions.length,
      timeTakenSec, submittedAt: new Date(),
    },
  });

  // Gamification
  await awardXP(userId, 'mock_submit').catch(() => {});
  const pct = test.totalMarks > 0 ? Math.round((score / test.totalMarks) * 100) : 0;
  const newBadges: string[] = [];
  if (await grantBadge(userId, 'mock_first')) newBadges.push('mock_first');
  if (pct >= 90 && (await grantBadge(userId, 'mock_90'))) newBadges.push('mock_90');

  // Persist a Progress row so the score feeds streaks/leaderboard/parent view.
  await db.progress.upsert({
    where: { userId_subject_chapter_topic: { userId, subject: test.subject, chapter: test.title, topic: null as any } },
    create: { userId, subject: test.subject, chapter: test.title, score: pct, status: 'done' },
    update: { score: pct, status: 'done' },
  }).catch(() => {});

  return NextResponse.json({
    attemptId: attempt.id,
    score, totalMarks: test.totalMarks, percent: pct,
    correctCount, totalCount: questions.length,
    review, newBadges,
  });
}
