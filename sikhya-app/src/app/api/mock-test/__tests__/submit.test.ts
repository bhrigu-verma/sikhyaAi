import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mock all external dependencies of the route ───
vi.mock('next-auth', () => ({ getServerSession: vi.fn(async () => ({ user: { id: 'u1' } })) }));
vi.mock('@/lib/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/analytics', () => ({ recordEvent: vi.fn() }));
vi.mock('@/lib/gamification', () => ({ awardXP: vi.fn(async () => null), grantBadge: vi.fn(async () => false) }));
vi.mock('@/lib/db', () => ({
  db: {
    mockTest: { findFirst: vi.fn() },
    mockTestAttempt: { create: vi.fn(async () => ({ id: 'attempt1' })) },
    progress: { upsert: vi.fn(async () => ({})) },
  },
}));

import { POST } from '@/app/api/mock-test/[id]/submit/route';
import { db } from '@/lib/db';

const TEST = {
  id: 't1', userId: 'u1', subject: 'Science', title: 'Science Mock', totalMarks: 3,
  questions: [
    { q: 'Q1', options: ['A) x', 'B) y', 'C) z', 'D) w'], answer: 'A', marks: 1, explanation: 'because A' },
    { q: 'Q2', options: ['A) x', 'B) y', 'C) z', 'D) w'], answer: 'C', marks: 2, explanation: 'because C' },
  ],
};

function makeReq(body: unknown): any {
  return new Request('http://test/api/mock-test/t1/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/mock-test/[id]/submit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (db.mockTest.findFirst as any).mockResolvedValue(TEST);
  });

  it('grades correct/incorrect answers and computes score + percent', async () => {
    const res = await POST(makeReq({ answers: { '0': 'A', '1': 'B' }, timeTakenSec: 120 }), { params: { id: 't1' } });
    const data = await res.json();
    expect(data.correctCount).toBe(1);
    expect(data.totalCount).toBe(2);
    expect(data.score).toBe(1);           // Q1 (1 mark) correct, Q2 wrong
    expect(data.totalMarks).toBe(3);
    expect(data.percent).toBe(33);        // round(1/3*100)
    expect(data.review[0].isCorrect).toBe(true);
    expect(data.review[1].isCorrect).toBe(false);
  });

  it('awards full marks when all answers correct', async () => {
    const res = await POST(makeReq({ answers: { '0': 'A', '1': 'C' } }), { params: { id: 't1' } });
    const data = await res.json();
    expect(data.score).toBe(3);
    expect(data.percent).toBe(100);
    expect(data.correctCount).toBe(2);
  });

  it('matches by leading letter even with full option text', async () => {
    const res = await POST(makeReq({ answers: { '0': 'A) x', '1': 'C) z' } }), { params: { id: 't1' } });
    const data = await res.json();
    expect(data.score).toBe(3);
  });

  it('persists an attempt and a progress row', async () => {
    await POST(makeReq({ answers: { '0': 'A' } }), { params: { id: 't1' } });
    expect(db.mockTestAttempt.create).toHaveBeenCalledOnce();
    expect(db.progress.upsert).toHaveBeenCalledOnce();
  });

  it('returns 404 for a test the user does not own', async () => {
    (db.mockTest.findFirst as any).mockResolvedValue(null);
    const res = await POST(makeReq({ answers: {} }), { params: { id: 'nope' } });
    expect(res.status).toBe(404);
  });

  it('rejects an invalid body (400)', async () => {
    const res = await POST(makeReq({ answers: 'not-an-object' }), { params: { id: 't1' } });
    expect(res.status).toBe(400);
  });
});
