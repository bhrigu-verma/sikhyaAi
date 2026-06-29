import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Fetch a test to take it — answers/explanations are NOT included.
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const test = await db.mockTest.findFirst({ where: { id: params.id, userId } });
  if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const questions = (test.questions as any[]).map((q, i) => ({
    index: i, q: q.q, options: q.options, marks: q.marks ?? 1,
  }));

  return NextResponse.json({
    test: {
      id: test.id, title: test.title, subject: test.subject, classNum: test.classNum,
      durationMin: test.durationMin, totalMarks: test.totalMarks, questions,
    },
  });
}
