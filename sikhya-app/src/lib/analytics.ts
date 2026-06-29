/**
 * Analytics recorder. Fire-and-forget event logging that powers weak-topic
 * detection, personalization, and the study-plan generator.
 */
import { db } from './db';

export type EventType =
  | 'chat_message'
  | 'practice_attempt'
  | 'mock_submit'
  | 'doubt_asked'
  | 'answer_graded'
  | 'review_done';

export interface EventInput {
  userId?: string | null;
  type: EventType;
  subject?: string;
  chapter?: string;
  topic?: string;
  correct?: boolean;
  score?: number;
  latencyMs?: number;
  meta?: Record<string, unknown>;
}

/** Non-blocking — never await this on the hot path if you don't need to. */
export function recordEvent(e: EventInput): void {
  db.analyticsEvent
    .create({
      data: {
        userId: e.userId ?? null,
        type: e.type,
        subject: e.subject,
        chapter: e.chapter,
        topic: e.topic,
        correct: e.correct,
        score: e.score,
        latencyMs: e.latencyMs,
        meta: e.meta as any,
      },
    })
    .catch(() => {});
}

export interface WeakTopic {
  subject: string;
  chapter: string | null;
  topic: string | null;
  attempts: number;
  accuracy: number; // 0–100
}

/**
 * Aggregate a user's question-level events into weak topics (lowest accuracy
 * first). Used by /api/analytics/weak-topics and the study-plan generator.
 */
export async function computeWeakTopics(userId: string, limit = 10): Promise<WeakTopic[]> {
  const events = await db.analyticsEvent.findMany({
    where: {
      userId,
      type: { in: ['practice_attempt', 'mock_submit', 'review_done'] },
      correct: { not: null },
    },
    select: { subject: true, chapter: true, topic: true, correct: true },
    take: 2000,
    orderBy: { createdAt: 'desc' },
  });

  const buckets = new Map<string, { subject: string; chapter: string | null; topic: string | null; total: number; correct: number }>();
  for (const ev of events) {
    const key = `${ev.subject ?? '?'}|${ev.chapter ?? ''}|${ev.topic ?? ''}`;
    const b = buckets.get(key) ?? { subject: ev.subject ?? 'General', chapter: ev.chapter ?? null, topic: ev.topic ?? null, total: 0, correct: 0 };
    b.total += 1;
    if (ev.correct) b.correct += 1;
    buckets.set(key, b);
  }

  return Array.from(buckets.values())
    .filter(b => b.total >= 2) // need a little signal
    .map(b => ({
      subject: b.subject,
      chapter: b.chapter,
      topic: b.topic,
      attempts: b.total,
      accuracy: Math.round((b.correct / b.total) * 100),
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
}
