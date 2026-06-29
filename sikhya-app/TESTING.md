# Sikhya — Test Suite

Unit + integration tests using [Vitest](https://vitest.dev).

## Run

```bash
npm test           # run once (CI mode)
npm run test:watch # watch mode
npm run test:cov   # with coverage report
```

## Layout

| File | Covers |
|------|--------|
| `src/lib/__tests__/spaced-repetition.test.ts` | SM-2 scheduling (intervals, ease factor floor, fail reset, clamping) |
| `src/lib/__tests__/crypto.test.ts` | AES-256-GCM round-trip, random IV, unicode, tamper detection, masking |
| `src/lib/__tests__/gamification.test.ts` | XP→level curve monotonicity, thresholds, badge catalog integrity |
| `src/lib/__tests__/moderation.test.ts` | Content-safety heuristics (self-harm/sexual/violence/PII) + redaction |
| `src/lib/__tests__/rate-limit.test.ts` | In-memory limiter, per-key isolation, 429 helper, IP parsing |
| `src/lib/__tests__/cache.test.ts` | Key determinism, get/set, JSON round-trip, TTL expiry |
| `src/lib/__tests__/parent-code.test.ts` | Code format, ambiguous-char exclusion, uniqueness |
| `src/lib/__tests__/syllabus.test.ts` | Syllabus lookup, unique chapter ids, `extractJSON` parsing |
| `src/app/api/mock-test/__tests__/submit.test.ts` | Mock-test grading route (scoring, letter matching, ownership 404, validation 400) — DB/auth mocked |

## Conventions

- **No network or DB in tests.** `vitest.setup.ts` strips AI/cache/email/Upstash env vars so the in-memory paths run and nothing hits an API. DB-backed routes are tested by mocking `@/lib/db` with `vi.mock`.
- **Pure logic first.** The algorithm-heavy libs (`spaced-repetition`, `gamification`, `crypto`, `parent-code`, `syllabus`) have 100% line coverage — these are the highest-risk surfaces.

## Extending to more routes

Follow `mock-test/__tests__/submit.test.ts` as the pattern: mock `next-auth`, `@/lib/auth`, `@/lib/db`, and any side-effect libs (`analytics`, `gamification`), then import and call the route handler directly with a constructed `Request`. Good next candidates: `/api/grade`, `/api/review/[id]`, `/api/parent/[code]` (IDOR / expiry behaviour).
