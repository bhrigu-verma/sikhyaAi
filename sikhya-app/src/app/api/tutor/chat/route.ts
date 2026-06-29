import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getBackendUrl, sseToTextStream, stripReasoningStream } from '@/lib/hf';
import { rateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit';
import { moderateInput, redactForLog } from '@/lib/moderation';
import { cacheKey, cacheGet, cacheSet } from '@/lib/cache';
import { recordEvent } from '@/lib/analytics';
import { awardXP, grantBadge } from '@/lib/gamification';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Schema = z.object({
  chatId:         z.string().optional(),
  mode:           z.enum(['simple','exam','deep']).default('simple'),
  class_filter:   z.number().int().min(1).max(12).optional(),
  subject_filter: z.string().optional(),
  messages:       z.array(z.object({
    role:    z.enum(['user','assistant','system']),
    content: z.string().min(1).max(8000),
  })).min(1),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const { chatId, mode, messages, class_filter, subject_filter } = parsed.data;
  const userId = (session.user as any).id;

  // ─── Rate limiting (per-user + per-IP) ───
  const ip = clientIp(req);
  const [userRl, ipRl] = await Promise.all([
    rateLimit(`tutor:user:${userId}`, { limit: 40, windowSec: 3600 }),  // 40 msgs/hour/user
    rateLimit(`tutor:ip:${ip}`,       { limit: 80, windowSec: 3600 }),  // 80 msgs/hour/IP
  ]);
  if (!userRl.success) return tooManyRequests(userRl.retryAfter, "You've sent a lot of questions! Take a short break and try again soon. 📚");
  if (!ipRl.success)   return tooManyRequests(ipRl.retryAfter);

  // ─── Content safety on the latest student message ───
  const lastUser = messages[messages.length - 1].content;
  const mod = await moderateInput(lastUser);
  if (!mod.allowed) {
    db.abuseLog.create({
      data: {
        userId, route: 'tutor/chat', kind: 'moderation',
        reason: mod.category, snippet: redactForLog(lastUser), ip,
      },
    }).catch(() => {});
    // Return a calm, redirecting message as a normal text stream so the UI renders it like a reply.
    return new Response(mod.safeMessage ?? "Let's focus on your studies. 📚", {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  const backendUrl = getBackendUrl('/api/chat');
  if (!backendUrl) {
    return NextResponse.json({ error: 'Backend not configured. Set PYTHON_API_URL in .env.' }, { status: 503 });
  }

  let chat = chatId
    ? await db.chat.findFirst({ where: { id: chatId, userId } })
    : await db.chat.create({
        data: {
          userId, mode,
          title: messages[messages.length - 1].content.slice(0, 60),
        },
      });
  if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });

  await db.message.create({
    data: { chatId: chat.id, role: 'user', content: messages[messages.length - 1].content },
  });

  // First chat ever → badge. Always award a little XP for engagement.
  recordEvent({ userId, type: 'chat_message', subject: subject_filter, meta: { mode } });
  awardXP(userId, 'chat').catch(() => {});
  grantBadge(userId, 'first_chat').catch(() => {});

  // ─── Cache: identical single-question lookups are common (textbook Q&A) ───
  // Only cache the simple case: a fresh single-turn question (no prior context).
  const cacheable = messages.filter(m => m.role !== 'system').length === 1;
  const ckey = cacheKey('rag', mode, class_filter, subject_filter, lastUser);
  if (cacheable) {
    const cached = await cacheGet(ckey);
    if (cached) {
      db.message.create({ data: { chatId: chat.id, role: 'assistant', content: cached } }).catch(() => {});
      return new Response(cached, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Chat-Id': chat.id,
          'X-Cache': 'HIT',
          'Cache-Control': 'no-store',
        },
      });
    }
  }

  try {
    const hfRes = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages
          .filter(m => m.role !== 'system')
          .map(m => ({ role: m.role, content: m.content })),
        ...(class_filter   !== undefined && { class_filter }),
        ...(subject_filter !== undefined && { subject_filter }),
      }),
    });

    if (hfRes.status === 503) {
      return NextResponse.json(
        { error: 'AI backend is waking up (cold start). Try again in 30 seconds.' },
        { status: 503 }
      );
    }
    if (!hfRes.ok || !hfRes.body) {
      return NextResponse.json({ error: `Backend error: ${hfRes.status}` }, { status: 502 });
    }

    const textStream = stripReasoningStream(sseToTextStream(hfRes.body));
    const decoder = new TextDecoder();
    let assistantText = '';

    const teeStream = new ReadableStream({
      async start(controller) {
        const reader = textStream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            assistantText += decoder.decode(value, { stream: true });
            controller.enqueue(value);
          }
        } finally {
          controller.close();
          reader.releaseLock();
          db.message.create({
            data: { chatId: chat!.id, role: 'assistant', content: assistantText },
          }).catch(() => {});
          // Cache successful single-turn answers for 7 days.
          if (cacheable && assistantText.trim().length > 20) {
            cacheSet(ckey, assistantText, 7 * 24 * 3600).catch(() => {});
          }
        }
      },
    });

    return new Response(teeStream, {
      headers: {
        'Content-Type':    'text/plain; charset=utf-8',
        'X-Chat-Id':       chat.id,
        'Cache-Control':   'no-store',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
