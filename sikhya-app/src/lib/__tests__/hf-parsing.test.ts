import { describe, it, expect } from 'vitest';
import { stripReasoning, extractLastJSONArray } from '@/lib/hf';

// Fixtures modeled on REAL sarvam-m backend output (reasoning prose ending with
// an unpaired </think>, then the answer; and JSON arrays appended after reasoning).

describe('stripReasoning', () => {
  it('keeps only text after an unpaired </think>', () => {
    const raw = "Okay, let's tackle this question. The user wants...\n</think>\n\nStomata are tiny pores that regulate gas exchange.";
    expect(stripReasoning(raw)).toBe('Stomata are tiny pores that regulate gas exchange.');
  });

  it('removes paired <think>...</think> blocks', () => {
    expect(stripReasoning('<think>reasoning here</think>The answer.')).toBe('The answer.');
  });

  it('returns text unchanged when there is no reasoning marker', () => {
    expect(stripReasoning('Just a plain answer.')).toBe('Just a plain answer.');
  });

  it('uses the LAST </think> when several appear', () => {
    expect(stripReasoning('a</think>b</think>final')).toBe('final');
  });
});

describe('extractLastJSONArray', () => {
  it('extracts the JSON array that follows reasoning prose', () => {
    const raw = `Okay, let me think about the questions...
First question about chlorophyll. Second about stomata.
</think>
[{"q":"What is chlorophyll?","options":["A) x","B) y","C) z","D) w"],"answer":"A","explanation":"e"}]`;
    const arr = extractLastJSONArray<any[]>(raw);
    expect(Array.isArray(arr)).toBe(true);
    expect(arr![0].q).toBe('What is chlorophyll?');
  });

  it('ignores bracket-like fragments in the reasoning prose', () => {
    const raw = `Options like [Chlorophyll, Sunlight] could work. Let me decide.
[{"q":"Q1","options":["A) a","B) b"],"answer":"A"}]`;
    const arr = extractLastJSONArray<any[]>(raw);
    expect(arr).toHaveLength(1);
    expect(arr![0].q).toBe('Q1');
  });

  it('handles a markdown-fenced array', () => {
    const raw = 'Here:\n```json\n[{"q":"Q","options":["A) a","B) b"],"answer":"B"}]\n```';
    const arr = extractLastJSONArray<any[]>(raw);
    expect(arr![0].answer).toBe('B');
  });

  it('returns null when reasoning never produced JSON (truncated)', () => {
    const raw = "Okay, let's tackle this. First question about... and then the plant kept in the dark for for";
    expect(extractLastJSONArray(raw)).toBeNull();
  });

  it('recovers the last array when multiple arrays exist', () => {
    const raw = '[{"q":"draft","options":["A) a","B) b"],"answer":"A"}]\nActually, final:\n[{"q":"final","options":["A) a","B) b"],"answer":"B"}]';
    const arr = extractLastJSONArray<any[]>(raw);
    expect(arr![0].q).toBe('final');
  });
});
