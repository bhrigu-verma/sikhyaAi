import { describe, it, expect, vi, afterEach } from 'vitest';
import { cacheKey, cacheGet, cacheSet, cacheGetJSON, cacheSetJSON } from '@/lib/cache';

afterEach(() => vi.useRealTimers());

describe('cacheKey', () => {
  it('is deterministic for the same inputs', () => {
    expect(cacheKey('rag', 'simple', 10, 'science', 'q')).toBe(cacheKey('rag', 'simple', 10, 'science', 'q'));
  });
  it('is case-insensitive and trims', () => {
    expect(cacheKey('RAG', 'Science')).toBe(cacheKey('rag', 'science'));
  });
  it('differs for different inputs', () => {
    expect(cacheKey('a')).not.toBe(cacheKey('b'));
  });
  it('ignores undefined parts', () => {
    expect(cacheKey('a', undefined, 'b')).toBe(cacheKey('a', 'b'));
  });
});

describe('cache get/set (in-memory)', () => {
  it('stores and retrieves a string', async () => {
    const k = cacheKey('str', Math.random());
    await cacheSet(k, 'hello', 60);
    expect(await cacheGet(k)).toBe('hello');
  });

  it('returns null for missing keys', async () => {
    expect(await cacheGet(cacheKey('missing', Math.random()))).toBeNull();
  });

  it('round-trips JSON', async () => {
    const k = cacheKey('json', Math.random());
    await cacheSetJSON(k, { questions: [1, 2, 3] }, 60);
    expect(await cacheGetJSON<{ questions: number[] }>(k)).toEqual({ questions: [1, 2, 3] });
  });

  it('expires after TTL', async () => {
    const k = cacheKey('ttl', Math.random());
    await cacheSet(k, 'temp', 1);
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 2000);
    expect(await cacheGet(k)).toBeNull();
  });
});
