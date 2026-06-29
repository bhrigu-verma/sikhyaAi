import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Search the previous-year question bank.
// Query params: subject, classNum, year, chapter, board, marks, q (text), limit
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sp = req.nextUrl.searchParams;
  const where: any = {};
  if (sp.get('subject'))  where.subject = sp.get('subject');
  if (sp.get('chapter'))  where.chapter = sp.get('chapter');
  if (sp.get('board'))    where.board = sp.get('board');
  if (sp.get('classNum')) where.classNum = Number(sp.get('classNum'));
  if (sp.get('year'))     where.year = Number(sp.get('year'));
  if (sp.get('marks'))    where.marks = Number(sp.get('marks'));
  const text = sp.get('q');
  if (text) where.question = { contains: text, mode: 'insensitive' };

  const limit = Math.min(50, Math.max(1, Number(sp.get('limit')) || 20));

  const [items, years, subjects] = await Promise.all([
    db.pYQ.findMany({ where, orderBy: [{ year: 'desc' }, { marks: 'asc' }], take: limit }),
    db.pYQ.findMany({ where: where.subject ? { subject: where.subject } : {}, distinct: ['year'], select: { year: true }, orderBy: { year: 'desc' } }),
    db.pYQ.findMany({ distinct: ['subject'], select: { subject: true } }),
  ]);

  return NextResponse.json({
    items,
    facets: {
      years: years.map(y => y.year),
      subjects: subjects.map(s => s.subject),
    },
  });
}
