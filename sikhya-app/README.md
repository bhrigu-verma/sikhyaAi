# Sikhya — Next.js App

The full-stack app behind sikhya.app. Landing page stays as static HTML (`index.html`);
the rest (auth, dashboard, AI tutor, practice, progress, settings) is this Next.js 14 app.

## Stack
- **Next.js 14** (App Router, RSC)
- **TypeScript**
- **Tailwind CSS** + CSS variables for theming
- **Prisma** + PostgreSQL
- **NextAuth.js** (credentials + Google OAuth)
- **next-themes** for dark / light mode
- **AES-256-GCM** for encrypting user API keys at rest

## Quick start

```bash
# 1. Install
pnpm install      # or npm / yarn

# 2. Copy and fill .env
cp .env.example .env
# generate secrets:
#   NEXTAUTH_SECRET   = openssl rand -base64 32
#   ENCRYPTION_KEY    = openssl rand -hex 32     (must be 64 hex chars = 32 bytes)

# 3. Database
pnpm prisma db push       # creates tables from prisma/schema.prisma
pnpm prisma generate      # generates the client

# 4. Run
pnpm dev                  # http://localhost:3000
```

## Routes

| Path              | What                                                             |
|-------------------|------------------------------------------------------------------|
| `/`             | Redirects to /dashboard (or /signin)                             |
| `/signin`       | Sign-in / sign-up                                                 |
| `/dashboard`    | Overview — continue learning, today's focus, subjects, KPIs        |
| `/tutor`        | AI Tutor — 3-mode chat, conversation history, sources panel       |
| `/learn`        | Chapter browser by subject                                        |
| `/practice`     | Practice sets, weak-topic drilling                                |
| `/progress`     | Weekly chart, accuracy ring, per-subject completion               |
| `/settings`     | Profile, **API Keys**, Appearance, Preferences, Data              |

## API routes

| Endpoint                          | Verb                  | Notes                                              |
|-----------------------------------|-----------------------|----------------------------------------------------|
| /api/auth/[...nextauth]           | NextAuth              | Sessions, Google OAuth, credentials                |
| /api/user/me                      | GET                   | Current user                                       |
| /api/api-keys                     | GET, POST             | List / add encrypted API keys                      |
| /api/api-keys/[id]                | PATCH, DELETE         | Toggle active / remove                             |
| /api/tutor/chat                   | POST                  | Streams reply from user's active provider          |
| /api/progress                     | GET                   | Aggregate user progress                            |

## Why this shape

- Landing page (`index.html`) is static. Fast, indexable, no JS bloat.
- The app sits at `/dashboard` etc. — protected by NextAuth.
- API keys are encrypted with AES-256-GCM using `ENCRYPTION_KEY` from `.env`.
  We never log them, never send them to the client after creation.
- The `/api/tutor/chat` route reads the user's *active* key from the DB,
  decrypts it server-side, calls the chosen provider (OpenAI / Anthropic / Google / Groq),
  and streams the response back via SSE.

## File map

```
src/
├── app/
│   ├── (auth)/signin   sign-in / sign-up
│   ├── (app)/...       dashboard, tutor, learn, practice, progress, settings
│   └── api/...         REST endpoints
├── components/
│   ├── ui/             button, card, input, badge, progress, toggle
│   ├── layout/         sidebar, topbar
│   └── theme-provider, theme-toggle
└── lib/
    ├── auth.ts         NextAuth config
    ├── db.ts           Prisma client
    ├── crypto.ts       AES-256-GCM encrypt/decrypt
    ├── ai.ts           Provider routing (OpenAI / Anthropic / Google / Groq)
    └── utils.ts        cn(), formatters
```
