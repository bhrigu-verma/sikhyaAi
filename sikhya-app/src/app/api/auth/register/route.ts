import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/lib/db';
import { verifyOtp } from '@/lib/otp';

const Schema = z.object({
  name:     z.string().min(1).max(80),
  email:    z.string().email(),
  password: z.string().min(8).max(72),
  code:     z.string().length(6),
  grade:    z.string().optional(),
  board:    z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data', details: parsed.error.format() }, { status: 400 });

  const { name, email, password, code, grade, board } = parsed.data;

  // Verify the OTP before touching the user table.
  const valid = await verifyOtp(email, code, 'verify_email');
  if (!valid) return NextResponse.json({ error: 'Invalid or expired code. Request a new one.' }, { status: 400 });

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });

  const hash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { name, email, password: hash, grade, board },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}
