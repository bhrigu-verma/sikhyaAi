import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { encrypt, mask } from '@/lib/crypto';
import { z } from 'zod';

const Provider = z.enum(['openai','anthropic','google','groq']);

const PostSchema = z.object({
  provider: Provider,
  label:    z.string().min(1).max(80),
  key:      z.string().min(8),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const keys = await db.apiKey.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, provider: true, label: true, maskedKey: true,
      active: true, requestsCount: true, lastUsedAt: true, createdAt: true,
    },
  });
  return NextResponse.json({ keys });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const { provider, label, key } = parsed.data;
  const userId = (session.user as any).id;

  // If this is the user's first key, make it active by default
  const existing = await db.apiKey.count({ where: { userId } });

  const created = await db.apiKey.create({
    data: {
      userId,
      provider,
      label,
      encryptedKey: encrypt(key.trim()),
      maskedKey:    mask(key.trim()),
      active:       existing === 0,
    },
    select: { id: true, provider: true, label: true, maskedKey: true, active: true, createdAt: true },
  });

  return NextResponse.json({ key: created }, { status: 201 });
}
