import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { rateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit';
import { resolveOpenAIKey, chatComplete, extractJSON, NoAIKeyError } from '@/lib/ai-provider';
import { recordEvent } from '@/lib/analytics';
import { awardXP } from '@/lib/gamification';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Schema = z.object({
  question: z.string().min(3).max(2000),
  studentAnswer: z.string().min(1).max(8000),
  maxMarks: z.number().int().min(1).max(20),
  subject: z.string().max(60).optional(),
  chapter: z.string().max(120).optional(),
  classNum: z.number().int().min(1).max(12).optional(),
});

interface GradeJSON {
  awardedMarks: number;
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
  rubric: { point: string; awarded: boolean }[];
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const ip = clientIp(req);
  const rl = await rateLimit(`grade:user:${userId}`, { limit: 40, windowSec: 3600 });
  if (!rl.success) return tooManyRequests(rl.retryAfter);

  const parsed = Schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const { question, studentAnswer, maxMarks, subject, chapter, classNum } = parsed.data;

  const sys =
    `You are an experienced PSEB/CBSE board examiner grading a Class ${classNum ?? '10'} ${subject ?? ''} answer. ` +
    `Grade strictly but fairly "for marks", as in a real board exam. Reward correct key points, ` +
    `deduct for missing/incorrect content. Respond in the SAME language as the student's answer. ` +
    `Return ONLY JSON of shape: {"awardedMarks": number, "strengths": string[], "improvements": string[], ` +
    `"modelAnswer": string, "rubric": [{"point": string, "awarded": boolean}]}.`;

  const user =
    `QUESTION (out of ${maxMarks} marks):\n${question}\n\nSTUDENT ANSWER:\n${studentAnswer}\n\n` +
    `Grade it. awardedMarks must be between 0 and ${maxMarks}.`;

  try {
    const key = await resolveOpenAIKey(userId);
    const t0 = Date.now();
    const raw = await chatComplete(key, [
      { role: 'system', content: sys },
      { role: 'user', content: user },
    ], { json: true, temperature: 0.2, maxTokens: 1200 });
    const latencyMs = Date.now() - t0;

    const graded = extractJSON<GradeJSON>(raw);
    if (!graded || typeof graded.awardedMarks !== 'number') {
      return NextResponse.json({ error: 'Could not grade answer. Try again.' }, { status: 502 });
    }
    const awardedMarks = Math.max(0, Math.min(maxMarks, graded.awardedMarks));

    await db.gradedAnswer.create({
      data: {
        userId, subject, chapter, question, studentAnswer, maxMarks, awardedMarks,
        feedback: {
          strengths: graded.strengths ?? [],
          improvements: graded.improvements ?? [],
          modelAnswer: graded.modelAnswer ?? '',
          rubric: graded.rubric ?? [],
        } as any,
      },
    }).catch(() => {});

    const pct = Math.round((awardedMarks / maxMarks) * 100);
    recordEvent({ userId, type: 'answer_graded', subject, chapter, correct: pct >= 50, score: pct, latencyMs });
    awardXP(userId, 'answer_graded').catch(() => {});

    return NextResponse.json({
      awardedMarks, maxMarks, percent: pct,
      strengths: graded.strengths ?? [],
      improvements: graded.improvements ?? [],
      modelAnswer: graded.modelAnswer ?? '',
      rubric: graded.rubric ?? [],
    });
  } catch (e: any) {
    if (e instanceof NoAIKeyError) {
      return NextResponse.json({ error: e.message, needsKey: true }, { status: 400 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
