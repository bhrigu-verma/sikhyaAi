import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getBackendUrl, generateQuestionArray } from '@/lib/hf';
import { rateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit';
import { cacheKey, cacheGetJSON, cacheSetJSON } from '@/lib/cache';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120; // reasoning model + retries can be slow

const BodySchema = z.object({
  subject:  z.string().min(1).max(60),
  topic:    z.string().min(1).max(120),
  classNum: z.number().int().min(1).max(12).default(10),
  count:    z.number().int().min(1).max(10).default(5),
});

const McqSchema = z.object({
  q:           z.string().min(1),
  options:     z.array(z.string()).min(2).max(6),
  answer:      z.string().min(1),
  explanation: z.string().optional().default(''),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const ip = clientIp(req);
  const [userRl, ipRl] = await Promise.all([
    rateLimit(`practice:user:${userId}`, { limit: 20, windowSec: 3600 }),
    rateLimit(`practice:ip:${ip}`,       { limit: 40, windowSec: 3600 }),
  ]);
  if (!userRl.success) return tooManyRequests(userRl.retryAfter, 'You’ve generated a lot of practice sets. Try again in a bit! 📚');
  if (!ipRl.success)   return tooManyRequests(ipRl.retryAfter);

  const parsed = BodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const { subject, topic, classNum, count } = parsed.data;

  const backendUrl = getBackendUrl('/api/chat');
  if (!backendUrl) return NextResponse.json({ error: 'Backend not configured' }, { status: 503 });

  // Cache generated sets — same topic/class requests recur constantly, and
  // (importantly) caching means the slow/retry-prone first generation is paid once.
  const ckey = cacheKey('mcq', subject, topic, classNum, count);
  const cached = await cacheGetJSON<{ questions: unknown[] }>(ckey);
  if (cached) return NextResponse.json({ ...cached, cached: true });

  // Prompt is tuned for the reasoning model: JSON-only instruction placed LAST so
  // the array reliably appears at the end of the reply (where we extract it from).
  const prompt = `Create ${count} multiple choice questions about "${topic}" for Class ${classNum} ${subject} (PSEB/NCERT syllabus).
Keep any thinking brief. End your reply with ONLY this JSON array and nothing after it:
[{"q":"...?","options":["A) ..","B) ..","C) ..","D) .."],"answer":"A","explanation":"why A is correct"}]`;

  try {
    const raw = await generateQuestionArray({ backendUrl, prompt, classNum, subject, attempts: 3 });
    const questions = raw.map(q => McqSchema.safeParse(q)).filter(r => r.success).map((r: any) => r.data);

    if (questions.length === 0) {
      return NextResponse.json({ questions: [], error: 'The tutor is busy thinking. Please try again in a moment.' }, { status: 503 });
    }
    cacheSetJSON(ckey, { questions }, 30 * 24 * 3600).catch(() => {});
    return NextResponse.json({ questions });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
