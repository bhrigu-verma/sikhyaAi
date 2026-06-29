import { describe, it, expect } from 'vitest';
import { encrypt, decrypt, mask } from '@/lib/crypto';

describe('crypto (AES-256-GCM)', () => {
  it('round-trips plaintext through encrypt/decrypt', () => {
    const secret = 'sk-proj-abc123XYZ-super-secret-key';
    const enc = encrypt(secret);
    expect(enc).not.toContain(secret);
    expect(decrypt(enc)).toBe(secret);
  });

  it('produces different ciphertext each time (random IV)', () => {
    const a = encrypt('same-input');
    const b = encrypt('same-input');
    expect(a).not.toBe(b);
    expect(decrypt(a)).toBe('same-input');
    expect(decrypt(b)).toBe('same-input');
  });

  it('handles unicode (Punjabi/Hindi) content', () => {
    const s = 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ — नमस्ते';
    expect(decrypt(encrypt(s))).toBe(s);
  });

  it('fails to decrypt tampered ciphertext', () => {
    const enc = encrypt('tamper-me');
    const buf = Buffer.from(enc, 'base64');
    buf[buf.length - 1] ^= 0xff; // flip a ciphertext bit
    expect(() => decrypt(buf.toString('base64'))).toThrow();
  });

  it('mask shows head and tail only', () => {
    const masked = mask('sk-proj-1234567890abcd');
    expect(masked).toMatch(/^sk-pr.*abcd$/);
    expect(masked).toContain('…');
  });

  it('mask handles very short keys safely', () => {
    expect(mask('abc')).toMatch(/•+/);
  });
});
