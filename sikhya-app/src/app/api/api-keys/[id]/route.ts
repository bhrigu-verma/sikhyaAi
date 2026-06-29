import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id;
  const body = await req.json();

  // Ownership check
  const existing = await db.apiKey.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== userId)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // If setting active=true, deactivate all others atomically
  if (body.active === true) {
    await db.$transaction([
      db.apiKey.updateMany({ where: { userId }, data: { active: false } }),
      db.apiKey.update({ where: { id: params.id }, data: { active: true, label: body.label ?? existing.label } }),
    ]);
  } else {
    await db.apiKey.update({
      where: { id: params.id },
      data: { active: body.active ?? existing.active, label: body.label ?? existing.label },
    });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id;

  const existing = await db.apiKey.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== userId)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await db.apiKey.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
