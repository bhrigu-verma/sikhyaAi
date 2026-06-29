import crypto from 'crypto';
import { db } from './db';
import { sendEmail } from './email';

const OTP_TTL_MIN = 15; // expires in 15 minutes

// ─── Generate + store a 6-digit OTP (hashed) ───
export async function createOtp(email: string, type: 'verify_email' | 'reset_password'): Promise<string> {
  // Delete any prior pending tokens for this email+type.
  await db.otpToken.deleteMany({ where: { email, type } });
  const code = String(Math.floor(100000 + Math.random() * 900000)); // "123456"
  const hash = crypto.createHash('sha256').update(code).digest('hex');
  const expiresAt = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);
  await db.otpToken.create({ data: { email, token: hash, type, expiresAt } });
  return code;
}

// ─── Verify a code; returns true + deletes the token on success ───
export async function verifyOtp(email: string, code: string, type: 'verify_email' | 'reset_password'): Promise<boolean> {
  const hash = crypto.createHash('sha256').update(code.trim()).digest('hex');
  const row = await db.otpToken.findFirst({ where: { email, token: hash, type } });
  if (!row) return false;
  if (row.expiresAt < new Date()) {
    await db.otpToken.delete({ where: { id: row.id } }).catch(() => {});
    return false;
  }
  await db.otpToken.delete({ where: { id: row.id } }).catch(() => {});
  return true;
}

// ─── Email templates ───
function otpHtml(heading: string, body: string, code: string) {
  return `<!doctype html><html><body style="margin:0;background:#f6f7f9;font-family:-apple-system,Segoe UI,sans-serif;color:#1a1a1a">
  <div style="max-width:480px;margin:0 auto;padding:24px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
      <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#b46707,#6366f1);display:grid;place-items:center">
        <span style="color:#fff;font-weight:700;font-size:18px;line-height:1">ਸ</span>
      </div>
      <strong style="font-size:16px">Sikhya</strong>
    </div>
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:28px">
      <h1 style="font-size:20px;margin:0 0 10px">${heading}</h1>
      <p style="font-size:14px;color:#555;line-height:1.6;margin:0 0 20px">${body}</p>
      <div style="background:#f9f5ff;border:1px solid #e0d9ff;border-radius:10px;text-align:center;padding:20px">
        <div style="font-size:36px;font-weight:800;letter-spacing:10px;color:#6366f1">${code}</div>
        <div style="font-size:12px;color:#888;margin-top:6px">Expires in ${OTP_TTL_MIN} minutes</div>
      </div>
      <p style="font-size:12px;color:#aaa;margin-top:20px;margin-bottom:0">
        If you didn't request this, ignore this email. Do not share this code.
      </p>
    </div>
  </div></body></html>`;
}

export async function sendVerifyEmail(email: string, code: string) {
  return sendEmail(
    email,
    'Your Sikhya verification code',
    otpHtml(
      'Verify your email',
      'Enter this code to verify your Sikhya account. It expires in 15 minutes.',
      code,
    ),
  );
}

export async function sendPasswordResetEmail(email: string, code: string) {
  return sendEmail(
    email,
    'Reset your Sikhya password',
    otpHtml(
      'Reset your password',
      "Enter this code on the reset page. If you didn't request a reset, you can ignore this.",
      code,
    ),
  );
}
