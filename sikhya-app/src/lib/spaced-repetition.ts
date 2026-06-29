/**
 * SM-2 spaced-repetition scheduling.
 * quality: 0–5 (0 = total blackout, 5 = perfect recall).
 * Returns the next interval (days), updated ease factor, and repetition count.
 */
export interface SM2State {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
}

export interface SM2Result extends SM2State {
  dueAt: Date;
}

export function sm2(prev: SM2State, quality: number): SM2Result {
  const q = Math.max(0, Math.min(5, Math.round(quality)));
  let { easeFactor, intervalDays, repetitions } = prev;

  if (q < 3) {
    // Failed recall — reset repetitions, review again soon.
    repetitions = 0;
    intervalDays = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * easeFactor);
  }

  // Update ease factor (floor 1.3).
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const dueAt = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000);
  return { easeFactor: Number(easeFactor.toFixed(2)), intervalDays, repetitions, dueAt };
}
