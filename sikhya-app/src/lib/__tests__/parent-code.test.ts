import { describe, it, expect } from 'vitest';
import { generateParentCode } from '@/lib/parent-code';

describe('generateParentCode', () => {
  it('matches the XXXX-XXXX-XX format', () => {
    expect(generateParentCode()).toMatch(/^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{2}$/);
  });

  it('excludes ambiguous characters (0,O,1,I,L)', () => {
    for (let i = 0; i < 200; i++) {
      expect(generateParentCode()).not.toMatch(/[01OIL]/);
    }
  });

  it('is effectively unique across many generations', () => {
    const codes = new Set(Array.from({ length: 1000 }, () => generateParentCode()));
    expect(codes.size).toBe(1000);
  });
});
