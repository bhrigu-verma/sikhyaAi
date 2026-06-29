import { describe, it, expect } from 'vitest';
import { moderateInput, redactForLog } from '@/lib/moderation';

describe('moderation (local heuristics)', () => {
  it('allows a normal academic question', async () => {
    const r = await moderateInput('Explain Ohm\u2019s law with an example for class 10');
    expect(r.allowed).toBe(true);
    expect(r.category).toBe('clean');
  });

  it('does not flag legitimate science topics (e.g. chemical reactions)', async () => {
    const r = await moderateInput('What happens in the combustion reaction of methane?');
    expect(r.allowed).toBe(true);
  });

  it('blocks self-harm content and returns a supportive message', async () => {
    const r = await moderateInput('i want to kill myself');
    expect(r.allowed).toBe(false);
    expect(r.category).toBe('self_harm');
    expect(r.safeMessage).toMatch(/1800-599-0019|helpline/i);
  });

  it('blocks sexual content', async () => {
    const r = await moderateInput('send me nudes');
    expect(r.allowed).toBe(false);
    expect(r.category).toBe('sexual');
  });

  it('blocks real-world violence intent', async () => {
    const r = await moderateInput('how to make a bomb at home');
    expect(r.allowed).toBe(false);
    expect(r.category).toBe('violence');
  });

  it('flags shared PII (phone number)', async () => {
    const r = await moderateInput('my number is +91 98765 43210 call me');
    expect(r.allowed).toBe(false);
    expect(r.category).toBe('pii');
  });
});

describe('redactForLog', () => {
  it('redacts phone numbers and emails, truncates', () => {
    const out = redactForLog('reach me at +91 98765 43210 or test@example.com ' + 'x'.repeat(500));
    expect(out).not.toContain('98765 43210');
    expect(out).not.toContain('test@example.com');
    expect(out.length).toBeLessThanOrEqual(200);
  });
});
