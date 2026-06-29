import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { seedBadges } from '@/lib/gamification';
import { PYQ_SEED } from '@/lib/pyq-seed';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Idempotent seed for badges + the PYQ starter bank.
 * Protected by SEED_SECRET — call with header `x-seed-secret: <SEED_SECRET>`.
 * Safe to run multiple times.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SEED_SECRET;
  if (!secret || req.headers.get('x-seed-secret') !== secret) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await seedBadges();

  let pyqInserted = 0;
  for (const p of PYQ_SEED) {
    // Avoid duplicates on re-run (no natural unique key, so check by content).
    const exists = await db.pYQ.findFirst({
      where: { board: p.board, classNum: p.classNum, subject: p.subject, year: p.year, question: p.question },
      select: { id: true },
    });
    if (!exists) {
      await db.pYQ.create({ data: p });
      pyqInserted++;
    }
  }

  return NextResponse.json({ ok: true, badges: 'seeded', pyqInserted });
}
