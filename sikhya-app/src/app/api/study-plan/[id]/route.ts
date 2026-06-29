import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PatchSchema = z.object({
  itemId: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  active: z.boolean().optional(),
});

// Update a plan item's status, or archive the whole plan.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const plan = await db.studyPlan.findFirst({ where: { id: params.id, userId } });
  if (!plan) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const parsed = PatchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const { itemId, status, active } = parsed.data;

  if (itemId && status) {
    // Ensure the item belongs to this plan before updating.
    const item = await db.studyPlanItem.findFirst({ where: { id: itemId, planId: plan.id } });
    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    await db.studyPlanItem.update({ where: { id: itemId }, data: { status } });
  }
  if (typeof active === 'boolean') {
    await db.studyPlan.update({ where: { id: plan.id }, data: { active } });
  }

  return NextResponse.json({ success: true });
}

// Delete a plan.
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const plan = await db.studyPlan.findFirst({ where: { id: params.id, userId } });
  if (!plan) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await db.studyPlan.delete({ where: { id: plan.id } });
  return NextResponse.json({ success: true });
}
