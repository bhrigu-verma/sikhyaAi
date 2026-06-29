import crypto from 'crypto';

/**
 * Generates a short, human-friendly, URL-safe access code for parent links.
 * Avoids ambiguous characters (0/O, 1/I/l). ~10 chars of crypto randomness.
 * Format: XXXX-XXXX-XX (groups for readability when shared verbally).
 */
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no 0,O,1,I,L

export function generateParentCode(): string {
  const bytes = crypto.randomBytes(10);
  let out = '';
  for (let i = 0; i < 10; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
    if (i === 3 || i === 7) out += '-';
  }
  return out; // e.g. "K9PQ-MN3T-RX"
}
