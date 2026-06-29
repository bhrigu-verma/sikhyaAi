/**
 * Generic key/value cache with TTL.
 *  - Upstash Redis REST if configured (shared across serverless instances).
 *  - In-memory Map fallback otherwise.
 *
 * Used to cache expensive AI work (RAG answers, generated MCQ sets) keyed by a
 * stable hash of the inputs. Textbook questions repeat heavily, so this is a
 * large cost + latency win.
 */
import crypto from 'crypto';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const useUpstash = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

const mem = new Map<string, { value: string; expiresAt: number }>();

export function cacheKey(...parts: (string | number | undefined)[]): string {
  const raw = parts.filter(p => p !== undefined).join('|').toLowerCase().trim();
  return crypto.createHash('sha256').update(raw).digest('hex').slice(0, 32);
}

export async function cacheGet(key: string): Promise<string | null> {
  try {
    if (useUpstash) {
      const res = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
        cache: 'no-store',
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.result ?? null;
    }
    const entry = mem.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) { mem.delete(key); return null; }
    return entry.value;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: string, ttlSec: number): Promise<void> {
  try {
    if (useUpstash) {
      await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(key)}?EX=${ttlSec}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'text/plain' },
        body: value,
        cache: 'no-store',
      });
      return;
    }
    mem.set(key, { value, expiresAt: Date.now() + ttlSec * 1000 });
  } catch {
    /* cache failures must never break the request */
  }
}

export async function cacheGetJSON<T>(key: string): Promise<T | null> {
  const raw = await cacheGet(key);
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

export async function cacheSetJSON(key: string, value: unknown, ttlSec: number): Promise<void> {
  await cacheSet(key, JSON.stringify(value), ttlSec);
}
