/**
 * AI provider abstraction. Resolves the user's active key, calls the provider,
 * returns a streaming text response.
 *
 * For brevity we implement OpenAI + Anthropic + Google Gemini + Groq + NVIDIA with
 * a unified interface. Each provider's adapter accepts { apiKey, messages, mode }
 * and returns a ReadableStream<Uint8Array> of plain UTF-8 text.
 */
import { db } from './db';
import { decrypt } from './crypto';

export type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

const SYSTEM_PROMPTS: Record<string, string> = {
  simple: 'You are Sikhya, a friendly AI tutor for Indian school students (Class 6–12). Explain things simply, like the student is in 8th grade. Use bullet points and real-life examples. Respond in the same language the question was asked (English, Hindi, or Punjabi).',
  exam:   'You are Sikhya, an expert tutor focused on PSEB / CBSE / ICSE board exams. Give exam-ready answers — concise, point-wise, marked-for-marks. Highlight definitions, formulas, and the key 2-mark and 5-mark points. Respond in the language asked.',
  deep:   'You are Sikhya, a senior subject expert. Give in-depth explanations with full theory, derivations, examples, and connections to other topics. Suitable for students aiming for top marks or competitive exams. Respond in the language asked.',
};

interface CallOpts {
  userId: string;
  messages: ChatMessage[];
  mode?: 'simple' | 'exam' | 'deep';
}

export async function streamChat({ userId, messages, mode = 'simple' }: CallOpts): Promise<ReadableStream<Uint8Array>> {
  // Look up the active API key for this user
  const apiKey = await db.apiKey.findFirst({
    where: { userId, active: true },
    orderBy: { createdAt: 'desc' },
  });

  if (!apiKey) {
    throw new Error('No active API key. Add one in /settings.');
  }

  const key = decrypt(apiKey.encryptedKey);
  const sys = { role: 'system' as const, content: SYSTEM_PROMPTS[mode] };
  const fullMessages = [sys, ...messages];

  // Update lastUsed + counter (best-effort, not blocking)
  db.apiKey.update({
    where: { id: apiKey.id },
    data:  { lastUsedAt: new Date(), requestsCount: { increment: 1 } },
  }).catch(() => {});

  switch (apiKey.provider) {
    case 'openai':    return openaiStream(key, fullMessages);
    case 'anthropic': return anthropicStream(key, fullMessages);
    case 'google':    return googleStream(key, fullMessages);
    case 'groq':      return groqStream(key, fullMessages);
    case 'nvidia':    return nvidiaStream(key, fullMessages);
    default: throw new Error(`Unknown provider: ${apiKey.provider}`);
  }
}

// ─── OPENAI ───
async function openaiStream(apiKey: string, messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages, stream: true, temperature: 0.7 }),
  });
  if (!res.ok || !res.body) throw new Error(`OpenAI error: ${res.status}`);
  return parseSSE(res.body, (chunk) => chunk.choices?.[0]?.delta?.content || '');
}

// ─── ANTHROPIC ───
async function anthropicStream(apiKey: string, messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>> {
  const sys = messages.find(m => m.role === 'system')?.content;
  const rest = messages.filter(m => m.role !== 'system');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 1024,
      system: sys,
      messages: rest,
      stream: true,
    }),
  });
  if (!res.ok || !res.body) throw new Error(`Anthropic error: ${res.status}`);
  return parseSSE(res.body, (chunk) =>
    chunk.type === 'content_block_delta' ? (chunk.delta?.text || '') : ''
  );
}

// ─── GOOGLE GEMINI ───
async function googleStream(apiKey: string, messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>> {
  const contents = messages
    .filter(m => m.role !== 'system')
    .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));
  const systemInstruction = { parts: [{ text: messages.find(m => m.role === 'system')?.content || '' }] };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, systemInstruction }),
    }
  );
  if (!res.ok || !res.body) throw new Error(`Google error: ${res.status}`);
  return parseSSE(res.body, (chunk) => chunk.candidates?.[0]?.content?.parts?.[0]?.text || '');
}

// ─── GROQ ───
async function groqStream(apiKey: string, messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'llama-3.1-70b-versatile', messages, stream: true }),
  });
  if (!res.ok || !res.body) throw new Error(`Groq error: ${res.status}`);
  return parseSSE(res.body, (chunk) => chunk.choices?.[0]?.delta?.content || '');
}

// ─── NVIDIA NIM (OpenAI-compatible) ───
async function nvidiaStream(apiKey: string, messages: ChatMessage[]): Promise<ReadableStream<Uint8Array>> {
  const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'meta/llama-3.1-70b-instruct',
      messages,
      stream: true,
      temperature: 0.7,
    }),
  });
  if (!res.ok || !res.body) throw new Error(`NVIDIA error: ${res.status}`);
  return parseSSE(res.body, (chunk) => chunk.choices?.[0]?.delta?.content || '');
}

// ─── SSE parser — unifies all providers' streams into UTF-8 text ───
function parseSSE(
  source: ReadableStream<Uint8Array>,
  extract: (jsonChunk: any) => string,
): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      const reader = source.getReader();
      let buffer = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const data = line.slice(5).trim();
            if (data === '[DONE]' || !data) continue;
            try {
              const json = JSON.parse(data);
              const text = extract(json);
              if (text) controller.enqueue(encoder.encode(text));
            } catch { /* skip malformed */ }
          }
        }
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
  });
}
