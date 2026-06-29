import crypto from 'crypto';

/**
 * AES-256-GCM encryption for user-supplied API keys.
 * The key in .env (ENCRYPTION_KEY) MUST be 64 hex chars = 32 bytes.
 *
 * Storage format (base64):  iv (12) | authTag (16) | ciphertext (variable)
 */

const ALGO = 'aes-256-gcm';
const IV_LEN = 12;
const TAG_LEN = 16;

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex) throw new Error('ENCRYPTION_KEY missing in .env');
  if (hex.length !== 64) throw new Error('ENCRYPTION_KEY must be 64 hex characters (32 bytes)');
  return Buffer.from(hex, 'hex');
}

export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64');
}

export function decrypt(payload: string): string {
  const key = getKey();
  const buf = Buffer.from(payload, 'base64');
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const enc = buf.subarray(IV_LEN + TAG_LEN);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return dec.toString('utf8');
}

/** Show only the start + last 4 chars: "sk-proj-...K9p2" */
export function mask(key: string): string {
  const trimmed = key.trim();
  if (trimmed.length < 12) return '••••' + trimmed.slice(-2);
  const head = trimmed.slice(0, 5);
  const tail = trimmed.slice(-4);
  return `${head}…${tail}`;
}
