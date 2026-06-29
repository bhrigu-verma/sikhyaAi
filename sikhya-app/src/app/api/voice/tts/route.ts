import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rateLimit, tooManyRequests } from '@/lib/rate-limit';
import { resolveOpenAIKey, textToSpeech, NoAIKeyError } from '@/lib/ai-provider';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Schema = z.object({
  text: z.string().min(1).max(4000),
  voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).default('nova'),
});

// Speak a tutor answer aloud (returns audio/mpeg).
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const rl = await rateLimit(`tts:user:${userId}`, { limit: 60, windowSec: 3600 });
  if (!rl.success) return tooManyRequests(rl.retryAfter);

  const parsed = Schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  try {
    const key = await resolveOpenAIKey(userId);
    const audio = await textToSpeech(key, parsed.data.text, parsed.data.voice);
    return new Response(audio, {
      headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' },
    });
  } catch (e: any) {
    if (e instanceof NoAIKeyError) return NextResponse.json({ error: e.message, needsKey: true }, { status: 400 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
