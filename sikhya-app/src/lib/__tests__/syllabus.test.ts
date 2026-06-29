import { describe, it, expect } from 'vitest';
import { getSyllabus, PSEB_SYLLABUS } from '@/lib/syllabus';
import { extractJSON } from '@/lib/ai-provider';

describe('syllabus', () => {
  it('finds Class 10 Science with 14 chapters', () => {
    const s = getSyllabus('Science', 10);
    expect(s).toBeDefined();
    expect(s!.chapters.length).toBe(14);
  });

  it('finds expanded subjects (Class 9 Mathematics)', () => {
    expect(getSyllabus('Mathematics', 9)).toBeDefined();
    expect(getSyllabus('Social Science', 10)).toBeDefined();
    expect(getSyllabus('Science', 8)).toBeDefined();
  });

  it('returns undefined for an unknown combo', () => {
    expect(getSyllabus('Astrophysics', 10)).toBeUndefined();
  });

  it('every chapter has id, title and key topics', () => {
    for (const subj of PSEB_SYLLABUS) {
      for (const ch of subj.chapters) {
        expect(ch.id).toBeTruthy();
        expect(ch.title).toBeTruthy();
        expect(Array.isArray(ch.keyTopics)).toBe(true);
      }
    }
  });

  it('chapter ids are globally unique', () => {
    const ids = PSEB_SYLLABUS.flatMap(s => s.chapters.map(c => c.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('extractJSON', () => {
  it('parses a bare JSON object', () => {
    expect(extractJSON('{"a":1}')).toEqual({ a: 1 });
  });
  it('parses JSON inside a markdown fence', () => {
    expect(extractJSON('Here you go:\n```json\n{"x":true}\n```')).toEqual({ x: true });
  });
  it('parses JSON embedded in prose', () => {
    expect(extractJSON('The result is {"awardedMarks":3} as graded.')).toEqual({ awardedMarks: 3 });
  });
  it('returns null when there is no JSON', () => {
    expect(extractJSON('no json here')).toBeNull();
  });
});
