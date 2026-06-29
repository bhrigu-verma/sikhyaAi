import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: (session.user as any).id },
    select: { id: true, name: true, email: true, image: true, grade: true, board: true, goal: true, createdAt: true },
  });
  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const data: any = {};
  for (const k of ['name','grade','board','goal','image']) if (k in body) data[k] = body[k];
  const user = await db.user.update({ where: { id: (session.user as any).id }, data });
  return NextResponse.json({ user });
}
