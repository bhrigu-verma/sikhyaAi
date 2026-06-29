import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// List the logged-in user's chats (most recent first), with a short preview.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const chats = await db.chat.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: 100,
    select: {
      id: true, title: true, subject: true, mode: true, updatedAt: true,
      _count: { select: { messages: true } },
    },
  });

  return NextResponse.json({
    chats: chats.map(c => ({
      id: c.id,
      title: c.title,
      subject: c.subject,
      mode: c.mode,
      messageCount: c._count.messages,
      updatedAt: c.updatedAt,
    })),
  });
}
