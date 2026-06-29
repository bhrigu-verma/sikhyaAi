/**
 * Lightweight rate limiting for AI endpoints.
 *
 * Strategy: fixed-window counter.
 *  - If UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set, uses Upstash
 *    Redis over HTTP (works on Vercel serverless / edge — shared across instances).
 *  - Otherwise falls back to an in-memory Map (fine for single-instance / dev,
 *    NOT accurate across serverless instances — log a warning once).
 *
 * Usage:
 *   const r = await rateLimit(`tutor:${userId}`, { limit: 30, windowSec: 3600 });
 *   if (!r.success) return 429 with r.retryAfter
 */

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  retryAfter: number; // seconds until window resets
}

export interface RateLimitOpts {
  limit: number;
  windowSec: number;
}

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const useUpstash = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

let warnedInMemory = false;

// ─── In-memory fallback ───
const memStore = new Map<string, { count: number; resetAt: number }>();

function inMemoryLimit(key: string, opts: RateLimitOpts): RateLimitResult {
  if (!warnedInMemory && process.env.NODE_ENV === 'production') {
    console.warn(
      '[rate-limit] Using in-memory limiter in production. ' +
      'Set UPSTASH_REDIS_REST_URL/TOKEN for accurate limits across instances.'
    );
    warnedInMemory = true;
  }
  const now = Date.now();
  const windowMs = opts.windowSec * 1000;
  const entry = memStore.get(key);

  if (!entry || entry.resetAt <= now) {
    memStore.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, limit: opts.limit, remaining: opts.limit - 1, retryAfter: opts.windowSec };
  }

  entry.count += 1;
  const remaining = Math.max(0, opts.limit - entry.count);
  const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
  return { success: entry.count <= opts.limit, limit: opts.limit, remaining, retryAfter };
}

// ─── Upstash (atomic INCR + EX on first hit via pipeline) ───
async function upstashLimit(key: string, opts: RateLimitOpts): Promise<RateLimitResult> {
  const redisKey = `rl:${key}`;
  // Pipeline: INCR then (on first) set TTL; also read TTL.
  const res = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      ['INCR', redisKey],
      ['TTL', redisKey],
    ]),
    cache: 'no-store',
  });

  if (!res.ok) {
    // Fail open (don't block legit users on Redis outage) but log it.
    console.error(`[rate-limit] Upstash error ${res.status}; failing open`);
    return { success: true, limit: opts.limit, remaining: opts.limit, retryAfter: opts.windowSec };
  }

  const data = (await res.json()) as Array<{ result: number }>;
  const count = data[0]?.result ?? 1;
  let ttl = data[1]?.result ?? -1;

  // First request in the window: set expiry.
  if (count === 1 || ttl < 0) {
    await fetch(`${UPSTASH_URL}/expire/${encodeURIComponent(redisKey)}/${opts.windowSec}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: 'no-store',
    }).catch(() => {});
    ttl = opts.windowSec;
  }

  const remaining = Math.max(0, opts.limit - count);
  return {
    success: count <= opts.limit,
    limit: opts.limit,
    remaining,
    retryAfter: ttl > 0 ? ttl : opts.windowSec,
  };
}

export async function rateLimit(key: string, opts: RateLimitOpts): Promise<RateLimitResult> {
  try {
    return useUpstash ? await upstashLimit(key, opts) : inMemoryLimit(key, opts);
  } catch (e) {
    console.error('[rate-limit] unexpected error; failing open', e);
    return { success: true, limit: opts.limit, remaining: opts.limit, retryAfter: opts.windowSec };
  }
}

/** Extract a best-effort client IP from a Next.js request. */
export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

/** Standard 429 JSON response with Retry-After header. */
export function tooManyRequests(retryAfter: number, message = 'Too many requests. Please slow down.') {
  return new Response(JSON.stringify({ error: message, retryAfter }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': String(retryAfter),
    },
  });
}
