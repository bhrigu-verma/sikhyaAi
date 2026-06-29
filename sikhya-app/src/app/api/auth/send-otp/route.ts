import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { createOtp, sendVerifyEmail, sendPasswordResetEmail } from '@/lib/otp';
import { rateLimit } from '@/lib/rate-limit';

const Schema = z.object({
  email: z.string().email(),
  type: z.enum(['verify_email', 'reset_password']),
});

export async function POST(req: NextRequest) {
  const parsed = Schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const { email, type } = parsed.data;

  // Rate limit: max 5 OTP sends per email per hour.
  const rl = await rateLimit(`otp:${email}`, { limit: 5, windowSec: 3600 });
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many attempts. Try again in an hour.' }, { status: 429 });
  }

  if (type === 'verify_email') {
    // Don't reveal whether the email already exists — just send the code.
    // The register route will check for duplicates.
  }

  if (type === 'reset_password') {
    const user = await db.user.findUnique({ where: { email }, select: { id: true } });
    if (!user) {
      // Silent success — don't leak whether email is registered.
      return NextResponse.json({ ok: true });
    }
  }

  const code = await createOtp(email, type);
  const sendFn = type === 'verify_email' ? sendVerifyEmail : sendPasswordResetEmail;
  const result = await sendFn(email, code);

  // In dev / no Resend key: log the code to the console so you can still test.
  if (!result.ok) {
    console.warn(`[otp] Email not sent (no Resend key?). Code for ${email}: ${code}`);
  }

  return NextResponse.json({ ok: true });
}
