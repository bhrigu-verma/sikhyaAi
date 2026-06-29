import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { recordEvent } from '@/lib/analytics';
import { awardXP } from '@/lib/gamification';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Schema = z.object({
  type: z.enum(['chat_message', 'practice_attempt', 'mock_submit', 'doubt_asked', 'answer_graded', 'review_done']),
  subject: z.string().max(60).optional(),
  chapter: z.string().max(120).optional(),
  topic: z.string().max(120).optional(),
  correct: z.boolean().optional(),
  score: z.number().int().optional(),
  meta: z.record(z.any()).optional(),
});

// Lightweight client → server event ingestion (e.g. per-question practice results).
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const parsed = Schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  recordEvent({ userId, ...parsed.data });

  // Reward correct practice answers with XP.
  if (parsed.data.type === 'practice_attempt' && parsed.data.correct) {
    awardXP(userId, 'practice_correct').catch(() => {});
  }
  return NextResponse.json({ ok: true });
}
