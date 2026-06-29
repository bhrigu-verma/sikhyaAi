/**
 * Gamification engine: XP, levels, and badge awarding.
 *
 * Levels use a simple escalating curve. awardXP records an XPEvent, bumps the
 * user's xp/level, and checks badge rules — all best-effort and non-fatal.
 */
import { db } from './db';

export type XPReason = 'chat' | 'practice_correct' | 'mock_submit' | 'review' | 'doubt' | 'answer_graded' | 'badge';

const XP_VALUES: Record<XPReason, number> = {
  chat: 2,
  practice_correct: 5,
  mock_submit: 20,
  review: 4,
  doubt: 3,
  answer_graded: 8,
  badge: 0, // badge XP is carried on the badge itself
};

/** Total XP required to *reach* a given level. Level n needs 100*(n-1)*n/2 XP. */
export function levelForXP(xp: number): number {
  let level = 1;
  while (xp >= 100 * (level * (level + 1)) / 2) level++;
  return level;
}

export function xpForNextLevel(level: number): number {
  return 100 * (level * (level + 1)) / 2;
}

/** Catalog of badges that should exist. Seeded idempotently. */
export const BADGE_CATALOG = [
  { code: 'first_chat',   name: 'First Question',  description: 'Asked your first question',     icon: '💬', xpReward: 10 },
  { code: 'streak_3',     name: 'On a Roll',       description: '3-day learning streak',          icon: '🔥', xpReward: 15 },
  { code: 'streak_7',     name: 'Week Warrior',    description: '7-day learning streak',          icon: '⚡', xpReward: 40 },
  { code: 'streak_30',    name: 'Unstoppable',     description: '30-day learning streak',         icon: '🏆', xpReward: 150 },
  { code: 'mock_first',   name: 'Test Taker',      description: 'Completed your first mock test', icon: '📝', xpReward: 25 },
  { code: 'mock_90',      name: 'Topper',          description: 'Scored 90%+ on a mock test',     icon: '🥇', xpReward: 60 },
  { code: 'practice_50',  name: 'Practice Pro',    description: 'Answered 50 practice questions', icon: '🎯', xpReward: 50 },
  { code: 'level_5',      name: 'Rising Star',     description: 'Reached level 5',                icon: '🌟', xpReward: 0 },
  { code: 'doubt_solver', name: 'Curious Mind',    description: 'Asked a doubt from a photo',     icon: '📸', xpReward: 15 },
] as const;

export async function seedBadges(): Promise<void> {
  for (const b of BADGE_CATALOG) {
    await db.badge.upsert({ where: { code: b.code }, update: {}, create: b }).catch(() => {});
  }
}

/** Award XP for an action; returns the new total + level + any newly-earned badges. */
export async function awardXP(userId: string, reason: XPReason, customAmount?: number) {
  const amount = customAmount ?? XP_VALUES[reason] ?? 0;
  if (amount <= 0) return null;

  await db.xPEvent.create({ data: { userId, amount, reason } }).catch(() => {});
  const user = await db.user.findUnique({ where: { id: userId }, select: { xp: true, level: true } });
  if (!user) return null;

  const newXp = user.xp + amount;
  const newLevel = levelForXP(newXp);
  await db.user.update({ where: { id: userId }, data: { xp: newXp, level: newLevel } }).catch(() => {});

  const newBadges: string[] = [];
  if (newLevel >= 5 && newLevel > user.level) {
    const earned = await grantBadge(userId, 'level_5');
    if (earned) newBadges.push('level_5');
  }
  return { xp: newXp, level: newLevel, leveledUp: newLevel > user.level, newBadges };
}

/** Grant a badge if not already earned. Returns true if newly granted. */
export async function grantBadge(userId: string, code: string): Promise<boolean> {
  const badge = await db.badge.findUnique({ where: { code } });
  if (!badge) return false;
  const existing = await db.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
  }).catch(() => null);
  if (existing) return false;

  await db.userBadge.create({ data: { userId, badgeId: badge.id } }).catch(() => {});
  if (badge.xpReward > 0) {
    await db.xPEvent.create({ data: { userId, amount: badge.xpReward, reason: 'badge' } }).catch(() => {});
    await db.user.update({ where: { id: userId }, data: { xp: { increment: badge.xpReward } } }).catch(() => {});
  }
  return true;
}

/** Evaluate streak-based badges given a current streak length. */
export async function checkStreakBadges(userId: string, streak: number): Promise<string[]> {
  const granted: string[] = [];
  const rules: [number, string][] = [[3, 'streak_3'], [7, 'streak_7'], [30, 'streak_30']];
  for (const [days, code] of rules) {
    if (streak >= days && (await grantBadge(userId, code))) granted.push(code);
  }
  return granted;
}
