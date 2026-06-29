import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rateLimit, tooManyRequests } from '@/lib/rate-limit';
import { resolveOpenAIKey, speechToText, NoAIKeyError } from '@/lib/ai-provider';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB

// Transcribe a student's spoken question (multipart/form-data with "audio").
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const rl = await rateLimit(`stt:user:${userId}`, { limit: 60, windowSec: 3600 });
  if (!rl.success) return tooManyRequests(rl.retryAfter);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data with an "audio" file' }, { status: 400 });
  }

  const audio = form.get('audio');
  if (!(audio instanceof Blob)) {
    return NextResponse.json({ error: 'Missing "audio" file' }, { status: 400 });
  }
  if (audio.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Audio too large (max 20MB)' }, { status: 413 });
  }

  try {
    const key = await resolveOpenAIKey(userId);
    const filename = (audio as File).name || 'audio.webm';
    const text = await speechToText(key, audio, filename);
    return NextResponse.json({ text });
  } catch (e: any) {
    if (e instanceof NoAIKeyError) return NextResponse.json({ error: e.message, needsKey: true }, { status: 400 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
