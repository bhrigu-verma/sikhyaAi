/**
 * Server-side AI helpers for the richer features (vision OCR, written-answer
 * grading, TTS, STT). These need a capable multimodal/audio model, so they use
 * OpenAI-compatible endpoints.
 *
 * Key resolution order:
 *   1. The user's own active OpenAI key (BYO) — decrypted from ApiKey.
 *   2. Server fallback OPENAI_API_KEY (env).
 * Throws a typed error if neither is available, so routes can return a clear 400.
 */
import { db } from './db';
import { decrypt } from './crypto';

export class NoAIKeyError extends Error {
  constructor() { super('No OpenAI key available. Add one in Settings or configure the server.'); }
}

export async function resolveOpenAIKey(userId: string): Promise<string> {
  const userKey = await db.apiKey.findFirst({
    where: { userId, provider: 'openai', active: true },
    orderBy: { createdAt: 'desc' },
  });
  if (userKey) return decrypt(userKey.encryptedKey);
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  throw new NoAIKeyError();
}

const BASE = 'https://api.openai.com/v1';

/** Plain text chat completion (non-streaming). */
export async function chatComplete(
  apiKey: string,
  messages: { role: string; content: any }[],
  opts: { model?: string; temperature?: number; maxTokens?: number; json?: boolean } = {},
): Promise<string> {
  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: opts.model ?? 'gpt-4o-mini',
      messages,
      temperature: opts.temperature ?? 0.3,
      max_tokens: opts.maxTokens ?? 1200,
      ...(opts.json ? { response_format: { type: 'json_object' } } : {}),
    }),
  });
  if (!res.ok) throw new Error(`OpenAI chat error ${res.status}: ${await res.text().catch(() => '')}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

/** Vision: extract + optionally answer a question from an image (data URL or http URL). */
export async function visionExtract(apiKey: string, imageUrl: string, instruction: string): Promise<string> {
  return chatComplete(apiKey, [
    {
      role: 'user',
      content: [
        { type: 'text', text: instruction },
        { type: 'image_url', image_url: { url: imageUrl } },
      ],
    },
  ], { model: 'gpt-4o-mini', maxTokens: 1500, temperature: 0.2 });
}

/** Text-to-speech → returns audio bytes (mp3). */
export async function textToSpeech(apiKey: string, text: string, voice = 'alloy'): Promise<ArrayBuffer> {
  const res = await fetch(`${BASE}/audio/speech`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'tts-1', voice, input: text.slice(0, 4000), format: 'mp3' }),
  });
  if (!res.ok) throw new Error(`OpenAI TTS error ${res.status}`);
  return res.arrayBuffer();
}

/** Speech-to-text via Whisper. Accepts a File/Blob. */
export async function speechToText(apiKey: string, audio: Blob, filename = 'audio.webm'): Promise<string> {
  const form = new FormData();
  form.append('file', audio, filename);
  form.append('model', 'whisper-1');
  const res = await fetch(`${BASE}/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });
  if (!res.ok) throw new Error(`OpenAI STT error ${res.status}`);
  const data = await res.json();
  return data?.text ?? '';
}

/** Parse a JSON object out of a model response that may wrap it in prose/markdown. */
export function extractJSON<T = any>(text: string): T | null {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fence ? fence[1] : text;
  const obj = candidate.match(/\{[\s\S]*\}/);
  if (!obj) return null;
  try { return JSON.parse(obj[0]) as T; } catch { return null; }
}
