/**
 * Email pipeline — Gmail SMTP via Nodemailer (free, sends to any address).
 * Falls back to Resend if SMTP_* vars are not set.
 */
import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM || `Sikhya <${SMTP_USER || 'onboarding@resend.dev'}>`;

const useSmtp = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

let transporter: nodemailer.Transporter | null = null;
function getTransporter() {
  if (!transporter && useSmtp) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

export interface SendResult { ok: boolean; id?: string; error?: string }

export async function sendEmail(to: string, subject: string, html: string): Promise<SendResult> {
  // Try SMTP first (Gmail)
  if (useSmtp) {
    try {
      const t = getTransporter()!;
      const info = await t.sendMail({ from: FROM, to, subject, html });
      return { ok: true, id: info.messageId };
    } catch (e: any) {
      console.error('[email/smtp]', e.message);
      // Fall through to Resend
    }
  }

  // Fallback: Resend
  if (RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: FROM, to, subject, html }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => '');
        console.error('[email/resend]', res.status, t);
        return { ok: false, error: `resend_${res.status}` };
      }
      const data = await res.json();
      return { ok: true, id: data?.id };
    } catch (e: any) {
      console.error('[email/resend]', e.message);
    }
  }

  console.warn('[email] No email provider configured — cannot send to', to);
  return { ok: false, error: 'not_configured' };
}

// ─── Templates ───

function shell(title: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f6f7f9;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#1a1a1a">
  <div style="max-width:520px;margin:0 auto;padding:24px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
      <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:grid;place-items:center;color:#fff;font-weight:700;font-size:18px">ਸ</div>
      <strong style="font-size:16px">Sikhya</strong>
    </div>
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:24px">
      <h1 style="font-size:18px;margin:0 0 12px">${title}</h1>
      ${body}
    </div>
    <p style="font-size:11px;color:#9ca3af;text-align:center;margin-top:16px">Sikhya — AI tutor for Punjab school students.</p>
  </div></body></html>`;
}

export function verifyEmailTemplate(link: string): { subject: string; html: string } {
  return {
    subject: 'Verify your Sikhya email',
    html: shell('Confirm your email',
      `<p style="font-size:14px;line-height:1.6">Tap the button below to verify your email and start learning.</p>
       <a href="${link}" style="display:inline-block;margin-top:12px;background:#6366f1;color:#fff;text-decoration:none;padding:10px 18px;border-radius:10px;font-weight:600;font-size:14px">Verify email</a>`),
  };
}

export function resetPasswordTemplate(link: string): { subject: string; html: string } {
  return {
    subject: 'Reset your Sikhya password',
    html: shell('Reset password',
      `<p style="font-size:14px;line-height:1.6">We received a request to reset your password. This link expires in 1 hour.</p>
       <a href="${link}" style="display:inline-block;margin-top:12px;background:#6366f1;color:#fff;text-decoration:none;padding:10px 18px;border-radius:10px;font-weight:600;font-size:14px">Reset password</a>
       <p style="font-size:12px;color:#6b7280;margin-top:14px">If you didn't request this, you can ignore this email.</p>`),
  };
}

export interface DigestData {
  studentName: string;
  streak: number;
  weeklySolved: number;
  subjects: { subject: string; avgScore: number; count: number }[];
  code: string;
}

export function parentDigestTemplate(d: DigestData): { subject: string; html: string } {
  const rows = d.subjects.length
    ? d.subjects.map(s =>
        `<tr><td style="padding:6px 0;font-size:13px">${s.subject}</td>
         <td style="padding:6px 0;font-size:13px;text-align:right"><strong>${s.avgScore}%</strong> · ${s.count} topics</td></tr>`).join('')
    : `<tr><td style="font-size:13px;color:#6b7280">No practice this week yet.</td></tr>`;
  return {
    subject: `${d.studentName}'s weekly progress on Sikhya`,
    html: shell(`${d.studentName}'s week in review`,
      `<div style="display:flex;gap:12px;margin-bottom:16px">
         <div style="flex:1;background:#f3f4f6;border-radius:10px;padding:12px;text-align:center"><div style="font-size:22px;font-weight:700">${d.streak}🔥</div><div style="font-size:11px;color:#6b7280">day streak</div></div>
         <div style="flex:1;background:#f3f4f6;border-radius:10px;padding:12px;text-align:center"><div style="font-size:22px;font-weight:700">${d.weeklySolved}</div><div style="font-size:11px;color:#6b7280">activities this week</div></div>
       </div>
       <table style="width:100%;border-collapse:collapse">${rows}</table>`),
  };
}
