// Global test setup. Sets a deterministic encryption key and ensures no live
// AI/cache/email credentials leak into unit tests (so nothing hits the network).
process.env.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY ||
  '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'; // 64 hex

// Force the in-memory paths for cache + rate limiting during tests.
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;
// Ensure moderation never calls the OpenAI API in tests.
delete process.env.OPENAI_API_KEY;
delete process.env.OPENAI_MODERATION_KEY;
delete process.env.RESEND_API_KEY;
