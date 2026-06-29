import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { generateParentCode } from '@/lib/parent-code';
import { z } from 'zod';

export const runtime = 'nodejs';

// List the student's own parent links
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const links = await db.parentLink.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, code: true, label: true, active: true,
      expiresAt: true, lastUsedAt: true, viewCount: true, createdAt: true,
    },
  });
  return NextResponse.json({ links });
}

const PostSchema = z.object({
  label:      z.string().max(40).optional(),
  parentEmail: z.string().email().max(120).optional(),
  digestOptIn: z.boolean().optional(),
  expiresInDays: z.number().int().min(1).max(365).optional(),
});

// Create a new parent access code for the logged-in student
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;

  const parsed = PostSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const { label, expiresInDays, parentEmail, digestOptIn } = parsed.data;

  // Cap number of active links per student to limit exposure surface
  const activeCount = await db.parentLink.count({ where: { userId, active: true } });
  if (activeCount >= 5) {
    return NextResponse.json({ error: 'You already have 5 active codes. Revoke one first.' }, { status: 409 });
  }

  // Generate a unique code (retry on the rare collision)
  let code = generateParentCode();
  for (let i = 0; i < 5; i++) {
    const exists = await db.parentLink.findUnique({ where: { code } });
    if (!exists) break;
    code = generateParentCode();
  }

  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  const link = await db.parentLink.create({
    data: { userId, code, label, expiresAt, parentEmail, digestOptIn: digestOptIn ?? false },
    select: { id: true, code: true, label: true, active: true, expiresAt: true, parentEmail: true, digestOptIn: true, createdAt: true },
  });

  return NextResponse.json({ link }, { status: 201 });
}
