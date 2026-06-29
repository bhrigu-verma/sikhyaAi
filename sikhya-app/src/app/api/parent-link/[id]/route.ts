import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

// Revoke (delete) one of the student's own parent access codes
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  // Ensure the link belongs to this user before deleting (ownership check)
  const link = await db.parentLink.findFirst({ where: { id: params.id, userId } });
  if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await db.parentLink.delete({ where: { id: link.id } });
  return NextResponse.json({ success: true });
}
