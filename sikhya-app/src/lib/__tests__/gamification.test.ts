import { describe, it, expect } from 'vitest';
import { levelForXP, xpForNextLevel, BADGE_CATALOG } from '@/lib/gamification';

describe('gamification level curve', () => {
  it('starts at level 1 with 0 XP', () => {
    expect(levelForXP(0)).toBe(1);
  });

  it('is monotonic non-decreasing in XP', () => {
    let prev = 1;
    for (let xp = 0; xp <= 100_000; xp += 137) {
      const lvl = levelForXP(xp);
      expect(lvl).toBeGreaterThanOrEqual(prev);
      prev = lvl;
    }
  });

  it('reaches level 2 exactly at the level-1 threshold', () => {
    const threshold = xpForNextLevel(1); // XP needed to leave level 1
    expect(levelForXP(threshold - 1)).toBe(1);
    expect(levelForXP(threshold)).toBe(2);
  });

  it('xpForNextLevel increases with level', () => {
    expect(xpForNextLevel(2)).toBeGreaterThan(xpForNextLevel(1));
    expect(xpForNextLevel(5)).toBeGreaterThan(xpForNextLevel(4));
  });

  it('badge catalog has unique codes and required fields', () => {
    const codes = BADGE_CATALOG.map(b => b.code);
    expect(new Set(codes).size).toBe(codes.length);
    for (const b of BADGE_CATALOG) {
      expect(b.code).toBeTruthy();
      expect(b.name).toBeTruthy();
      expect(b.icon).toBeTruthy();
      expect(b.xpReward).toBeGreaterThanOrEqual(0);
    }
  });
});
