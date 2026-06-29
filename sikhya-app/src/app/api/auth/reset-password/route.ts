import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/lib/db';
import { verifyOtp } from '@/lib/otp';

const Schema = z.object({
  email:    z.string().email(),
  code:     z.string().length(6),
  password: z.string().min(8).max(72),
});

export async function POST(req: NextRequest) {
  const parsed = Schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const { email, code, password } = parsed.data;

  const valid = await verifyOtp(email, code, 'reset_password');
  if (!valid) return NextResponse.json({ error: 'Invalid or expired code.' }, { status: 400 });

  const user = await db.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: 'Account not found.' }, { status: 404 });

  const hash = await bcrypt.hash(password, 10);
  await db.user.update({ where: { id: user.id }, data: { password: hash } });

  return NextResponse.json({ ok: true });
}
