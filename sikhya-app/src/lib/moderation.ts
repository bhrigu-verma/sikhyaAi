/**
 * Content safety for a minors' education product (Class 1–12 students).
 *
 * Two layers:
 *  1. Fast local heuristics (always on, zero-latency) — block obvious
 *     self-harm, sexual, violent, and PII-exposure inputs.
 *  2. Optional OpenAI Moderation API (if OPENAI_MODERATION_KEY is set) for
 *     higher-recall classification. Fails open (allows) on API error so the
 *     tutor stays usable, but local heuristics still apply.
 *
 * This is intentionally conservative for an audience of children: when a
 * category is flagged we return a gentle, redirecting message rather than the
 * raw model output.
 */

export type ModerationCategory =
  | 'self_harm'
  | 'sexual'
  | 'violence'
  | 'hate'
  | 'pii'
  | 'clean';

export interface ModerationResult {
  allowed: boolean;
  category: ModerationCategory;
  /** Student-facing safe message shown when blocked. */
  safeMessage?: string;
}

// ─── Local heuristic patterns ───
// Kept deliberately narrow to avoid false positives on legitimate academic
// questions (e.g. biology, history of wars, chemistry of explosives in NCERT).
const PATTERNS: { category: ModerationCategory; re: RegExp }[] = [
  {
    category: 'self_harm',
    re: /\b(kill myself|suicide|end my life|want to die|cut myself|self[-\s]?harm|hang myself)\b/i,
  },
  {
    category: 'sexual',
    re: /\b(porn|nude|nudes|sexting|send (me )?(pics|nudes)|child porn|cp\b)/i,
  },
  {
    category: 'violence',
    // target real-world harm intent, not academic topics
    re: /\b(how to (make|build) a (bomb|gun|weapon)|kill (him|her|them|someone)|hurt (someone|people))\b/i,
  },
  {
    category: 'pii',
    // student pasting personal contact info — nudge them not to share it
    re: /\b(\+?\d[\d\s\-]{8,}\d)\b|\b\d{12}\b|\b[A-Z]{5}\d{4}[A-Z]\b/, // phone / aadhaar-like / PAN-like
  },
];

const SAFE_MESSAGES: Record<ModerationCategory, string> = {
  self_harm:
    "It sounds like you might be going through something really hard. You're not alone. " +
    'Please talk to a trusted adult, a teacher, or call the KIRAN helpline at 1800-599-0019 (free, 24/7). ' +
    "I'm here to help with your studies whenever you're ready. 💙",
  sexual:
    "I can't help with that. I'm your study tutor — ask me anything about your school subjects! 📚",
  violence:
    "I can't help with anything that could hurt someone. Let's focus on your studies instead. 📚",
  hate:
    "Let's keep things respectful. I'm here to help you learn — ask me about your subjects! 📚",
  pii:
    "Please don't share personal details like phone numbers or ID numbers here — keep yourself safe online. " +
    'Ask me your study question and I’ll help! 📚',
  clean: '',
};

function localCheck(text: string): ModerationResult {
  for (const { category, re } of PATTERNS) {
    if (re.test(text)) {
      return { allowed: false, category, safeMessage: SAFE_MESSAGES[category] };
    }
  }
  return { allowed: true, category: 'clean' };
}

// ─── OpenAI Moderation (optional) ───
async function openaiModeration(text: string): Promise<ModerationResult | null> {
  const key = process.env.OPENAI_MODERATION_KEY || process.env.OPENAI_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'omni-moderation-latest', input: text }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    const result = data?.results?.[0];
    if (!result?.flagged) return { allowed: true, category: 'clean' };

    const cats = result.categories || {};
    let category: ModerationCategory = 'clean';
    if (cats['self-harm'] || cats['self-harm/intent'] || cats['self-harm/instructions']) category = 'self_harm';
    else if (cats['sexual'] || cats['sexual/minors']) category = 'sexual';
    else if (cats['violence'] || cats['violence/graphic']) category = 'violence';
    else if (cats['hate'] || cats['harassment']) category = 'hate';

    if (category === 'clean') return { allowed: true, category: 'clean' };
    return { allowed: false, category, safeMessage: SAFE_MESSAGES[category] };
  } catch {
    return null; // fail open
  }
}

/**
 * Moderate a student's input. Runs local heuristics first (cheap, blocks the
 * worst cases instantly), then the optional API layer.
 */
export async function moderateInput(text: string): Promise<ModerationResult> {
  const local = localCheck(text);
  if (!local.allowed) return local;

  const api = await openaiModeration(text);
  if (api && !api.allowed) return api;

  return { allowed: true, category: 'clean' };
}

/** Redact + truncate offending text for safe storage in AbuseLog. */
export function redactForLog(text: string, max = 200): string {
  return text
    .replace(/\b(\+?\d[\d\s\-]{8,}\d)\b/g, '[redacted-number]')
    .replace(/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, '[redacted-email]')
    .slice(0, max);
}
