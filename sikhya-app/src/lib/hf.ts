type BackendConfig = {
  baseUrl: string;
};

export function getBackendConfig(): BackendConfig | null {
  const baseUrl = (process.env.PYTHON_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_URL || '').replace(/\/+$/, '');
  if (!baseUrl) return null;
  return { baseUrl };
}

export function getBackendUrl(path: string): string | null {
  const cfg = getBackendConfig();
  if (!cfg) return null;
  if (path.startsWith('/')) return `${cfg.baseUrl}${path}`;
  return `${cfg.baseUrl}/${path}`;
}

/**
 * The backend model (sarvamai/sarvam-m) is a REASONING model. It streams a long
 * chain-of-thought ("Okay, let's tackle this query...") that ends with an
 * unpaired `</think>` marker, followed by the real answer. Sometimes there is no
 * marker at all (short answers / truncated reasoning).
 *
 * stripReasoning returns only the answer the student should see.
 */
export function stripReasoning(text: string): string {
  // Remove any paired <think>...</think> first.
  let t = text.replace(/<think>[\s\S]*?<\/think>/gi, '');
  // Handle the common unpaired case: keep everything after the LAST </think>.
  const idx = t.lastIndexOf('</think>');
  if (idx !== -1) t = t.slice(idx + '</think>'.length);
  return t.replace(/^\s+/, '');
}

/**
 * Extract the last well-formed JSON array from a model response (after stripping
 * reasoning). Reasoning models put the JSON at the very end, so we scan backward
 * from the final `]` to its matching `[`. Falls back to a greedy match.
 */
export function extractLastJSONArray<T = any>(raw: string): T | null {
  const text = stripReasoning(raw);
  const end = text.lastIndexOf(']');
  if (end !== -1) {
    let depth = 0;
    for (let i = end; i >= 0; i--) {
      const ch = text[i];
      if (ch === ']') depth++;
      else if (ch === '[') {
        depth--;
        if (depth === 0) {
          try { return JSON.parse(text.slice(i, end + 1)) as T; } catch { break; }
        }
      }
    }
  }
  // Fallback: greedy first-to-last.
  const m = text.match(/\[[\s\S]*\]/);
  if (m) { try { return JSON.parse(m[0]) as T; } catch { /* ignore */ } }
  return null;
}

/**
 * Wrap an already-de-SSE'd text stream and hide the reasoning preamble: buffer
 * output until `</think>` is seen, then stream the answer live. If the stream
 * ends without ever seeing `</think>`, flush the whole buffer (it was the answer).
 */
export function stripReasoningStream(source: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';
  let passthrough = false;
  const MARK = '</think>';

  return new ReadableStream({
    async start(controller) {
      const reader = source.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (passthrough) { controller.enqueue(value); continue; }
          buffer += decoder.decode(value, { stream: true });
          const i = buffer.lastIndexOf(MARK);
          if (i !== -1) {
            const answer = buffer.slice(i + MARK.length).replace(/^\s+/, '');
            if (answer) controller.enqueue(encoder.encode(answer));
            buffer = '';
            passthrough = true;
          }
        }
        // Stream ended. If we never hit </think>, the buffer IS the answer.
        if (!passthrough && buffer.trim()) {
          controller.enqueue(encoder.encode(stripReasoning(buffer)));
        }
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
  });
}

export function sseToTextStream(source: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';

  return new ReadableStream({
    async start(controller) {
      const reader = source.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const data = trimmed.slice(5).trim();
            if (!data || data === '[DONE]') continue;
            try {
              const json = JSON.parse(data);
              const text = json?.choices?.[0]?.delta?.content || '';
              if (text) controller.enqueue(encoder.encode(text));
            } catch {
              // Ignore malformed chunks
            }
          }
        }
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
  });
}


/** Drain a de-SSE'd text stream to a string. */
async function drainTextStream(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const dec = new TextDecoder();
  let out = '';
  try { while (true) { const { done, value } = await reader.read(); if (done) break; out += dec.decode(value, { stream: true }); } }
  finally { reader.releaseLock(); }
  return out;
}

/**
 * Generate a JSON array of questions from the reasoning backend, with retries.
 *
 * sarvam-m is a chain-of-thought model and frequently exhausts its output budget
 * on reasoning before emitting the JSON (~1-in-3 success per call). We retry a
 * bounded number of times; callers should cache the result so a topic only pays
 * this cost once. Returns [] if every attempt fails.
 */
export async function generateQuestionArray(opts: {
  backendUrl: string;
  prompt: string;
  classNum?: number;
  subject?: string;
  attempts?: number;
}): Promise<any[]> {
  const { backendUrl, prompt, classNum, subject, attempts = 3 } = opts;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          ...(classNum !== undefined && { class_filter: classNum }),
          ...(subject !== undefined && { subject_filter: subject.toLowerCase() }),
          top_k: 4,
        }),
      });
      if (!res.ok || !res.body) continue;
      const full = await drainTextStream(sseToTextStream(res.body));
      const arr = extractLastJSONArray<any[]>(full);
      if (Array.isArray(arr) && arr.length > 0) return arr;
    } catch { /* try again */ }
  }
  return [];
}
