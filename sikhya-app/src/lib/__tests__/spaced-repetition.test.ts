import { describe, it, expect } from 'vitest';
import { sm2 } from '@/lib/spaced-repetition';

const fresh = { easeFactor: 2.5, intervalDays: 0, repetitions: 0 };

describe('sm2', () => {
  it('first successful recall schedules 1 day out', () => {
    const r = sm2(fresh, 5);
    expect(r.repetitions).toBe(1);
    expect(r.intervalDays).toBe(1);
    expect(r.dueAt.getTime()).toBeGreaterThan(Date.now());
  });

  it('second successful recall schedules 6 days out', () => {
    const r1 = sm2(fresh, 5);
    const r2 = sm2(r1, 4);
    expect(r2.repetitions).toBe(2);
    expect(r2.intervalDays).toBe(6);
  });

  it('third recall multiplies interval by ease factor', () => {
    const r1 = sm2(fresh, 5);
    const r2 = sm2(r1, 5);
    const r3 = sm2(r2, 5);
    expect(r3.repetitions).toBe(3);
    expect(r3.intervalDays).toBe(Math.round(6 * r2.easeFactor));
  });

  it('failed recall (quality < 3) resets repetitions and interval to 1', () => {
    const r1 = sm2(fresh, 5);
    const r2 = sm2(r1, 5);
    const fail = sm2(r2, 1);
    expect(fail.repetitions).toBe(0);
    expect(fail.intervalDays).toBe(1);
  });

  it('ease factor never drops below 1.3', () => {
    let state = fresh;
    for (let i = 0; i < 20; i++) state = sm2(state, 0);
    expect(state.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it('clamps quality into 0..5', () => {
    const hi = sm2(fresh, 99);
    const lo = sm2(fresh, -5);
    expect(hi.repetitions).toBe(1);    // treated as success
    expect(lo.repetitions).toBe(0);    // treated as failure
  });

  it('higher quality yields a higher (or equal) ease factor than lower quality', () => {
    const good = sm2(fresh, 5);
    const ok = sm2(fresh, 3);
    expect(good.easeFactor).toBeGreaterThanOrEqual(ok.easeFactor);
  });
});
