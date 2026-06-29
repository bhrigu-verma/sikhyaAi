import { describe, it, expect } from 'vitest';
import { rateLimit, clientIp, tooManyRequests } from '@/lib/rate-limit';

describe('rateLimit (in-memory)', () => {
  it('allows up to the limit then blocks', async () => {
    const key = `test:${Math.random()}`;
    const opts = { limit: 3, windowSec: 60 };
    const r1 = await rateLimit(key, opts);
    const r2 = await rateLimit(key, opts);
    const r3 = await rateLimit(key, opts);
    const r4 = await rateLimit(key, opts);
    expect(r1.success).toBe(true);
    expect(r2.success).toBe(true);
    expect(r3.success).toBe(true);
    expect(r4.success).toBe(false);
    expect(r4.remaining).toBe(0);
    expect(r4.retryAfter).toBeGreaterThan(0);
  });

  it('tracks separate keys independently', async () => {
    const a = await rateLimit(`a:${Math.random()}`, { limit: 1, windowSec: 60 });
    const b = await rateLimit(`b:${Math.random()}`, { limit: 1, windowSec: 60 });
    expect(a.success).toBe(true);
    expect(b.success).toBe(true);
  });

  it('reports decreasing remaining count', async () => {
    const key = `rem:${Math.random()}`;
    const opts = { limit: 5, windowSec: 60 };
    const first = await rateLimit(key, opts);
    const second = await rateLimit(key, opts);
    expect(first.remaining).toBe(4);
    expect(second.remaining).toBe(3);
  });
});

describe('clientIp', () => {
  it('reads the first x-forwarded-for entry', () => {
    const req = new Request('http://x', { headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' } });
    expect(clientIp(req)).toBe('1.2.3.4');
  });
  it('falls back to unknown', () => {
    expect(clientIp(new Request('http://x'))).toBe('unknown');
  });
});

describe('tooManyRequests', () => {
  it('returns a 429 with Retry-After', async () => {
    const res = tooManyRequests(42);
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBe('42');
    const body = await res.json();
    expect(body.retryAfter).toBe(42);
  });
});
