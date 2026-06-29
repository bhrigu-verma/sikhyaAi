import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { rateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit';
import { resolveOpenAIKey, visionExtract, NoAIKeyError } from '@/lib/ai-provider';
import { recordEvent } from '@/lib/analytics';
import { awardXP, grantBadge } from '@/lib/gamification';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Schema = z.object({
  // data URL ("data:image/jpeg;base64,...") or a public https URL
  imageUrl: z.string().min(8).max(8_000_000),
  subject: z.string().max(60).optional(),
  classNum: z.number().int().min(1).max(12).optional(),
  language: z.enum(['auto', 'english', 'hindi', 'punjabi']).default('auto'),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const ip = clientIp(req);
  const rl = await rateLimit(`doubt:user:${userId}`, { limit: 30, windowSec: 3600 });
  if (!rl.success) return tooManyRequests(rl.retryAfter, 'You’ve asked lots of doubts! Take a short break. 📸');

  const parsed = Schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const { imageUrl, subject, classNum, language } = parsed.data;

  const langInstruction =
    language === 'auto' ? 'Answer in the same language as the question in the image (English, Hindi, or Punjabi).'
    : `Answer in ${language}.`;

  const instruction =
    `You are Sikhya, a friendly tutor for Class ${classNum ?? '6-12'} students. ` +
    `Read the question in this photo (it may be handwritten or from a textbook). ` +
    `First restate the question clearly, then give a step-by-step solution a student can follow. ` +
    `${langInstruction} Keep it encouraging and use simple language.`;

  try {
    const key = await resolveOpenAIKey(userId);
    const t0 = Date.now();
    const answer = await visionExtract(key, imageUrl, instruction);
    const latencyMs = Date.now() - t0;

    // Best-effort: pull the restated question (first line) for storage.
    const questionText = answer.split('\n').find(l => l.trim().length > 0)?.slice(0, 500) ?? 'Photo question';

    const doubt = await db.doubt.create({
      data: { userId, imageUrl: imageUrl.startsWith('data:') ? imageUrl.slice(0, 200) + '…' : imageUrl, questionText, answer, subject, classNum },
      select: { id: true, createdAt: true },
    });

    recordEvent({ userId, type: 'doubt_asked', subject, latencyMs });
    awardXP(userId, 'doubt').catch(() => {});
    grantBadge(userId, 'doubt_solver').catch(() => {});

    return NextResponse.json({ id: doubt.id, question: questionText, answer });
  } catch (e: any) {
    if (e instanceof NoAIKeyError) {
      return NextResponse.json({ error: e.message, needsKey: true }, { status: 400 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
