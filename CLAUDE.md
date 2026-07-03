# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server on localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint (next/core-web-vitals + next/typescript)
```

## Architecture

This is the **Next.js + Supabase Starter Kit** — a full-stack template with cookie-based authentication.

### Supabase client layer (`lib/supabase/`)

Three separate client factories for different Next.js contexts — never reuse a client across contexts:

| File | Context | Usage |
|------|---------|-------|
| `lib/supabase/client.ts` | Browser (`"use client"`) | Client Components that call Supabase directly |
| `lib/supabase/server.ts` | Server Components / Route Handlers | Server-side data fetching, `auth.getClaims()` |
| `lib/supabase/proxy.ts` | Middleware | Session refresh via `updateSession()` |

**Critical rule from upstream**: When using `createServerClient` in middleware/proxy, do **not** run any code between creating the client and calling `supabase.auth.getClaims()` — it can cause users to be randomly logged out. The `getClaims()` call is mandatory for SSR to work correctly.

### Request flow

1. **Middleware** (`proxy.ts` at root) — runs on every matched request. Calls `updateSession()` which refreshes the Supabase auth cookies. If the user has no session and is not on `/`, `/login`, or `/auth/*`, they are redirected to `/auth/login`.
2. **Auth callback** (`app/auth/confirm/route.ts`) — OTP/email confirmation handler. Verifies the token via `verifyOtp()`, then redirects.
3. **Protected pages** (`app/protected/`) — server-rendered page checks `auth.getClaims()` and redirects to login if unauthenticated.

### Route structure

- `/` — Landing page with tutorial steps
- `/auth/login`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/update-password` — Auth form pages
- `/auth/confirm` — Email confirmation route handler (GET)
- `/auth/error` — Auth error display
- `/protected` — Authenticated-only page showing user claims

### Component organization

- `components/ui/` — shadcn/ui primitives (Button, Card, Input, Label, Badge, Checkbox, DropdownMenu)
- `components/` — Feature components: auth forms (`login-form`, `sign-up-form`, `forgot-password-form`, `update-password-form`), `auth-button`, `logout-button`, `hero`, `env-var-warning`, `theme-switcher`
- `components/tutorial/` — Tutorial step components shown on the landing page

### Styling

- Tailwind CSS with CSS variables for theming (defined in `app/globals.css`)
- Dark mode via `next-themes` (class strategy, system default)
- shadcn/ui configured with `new-york` style, `neutral` base color, `lucide` icons
- `lib/utils.ts` exports `cn()` (clsx + tailwind-merge) for merging classes

### Environment variables

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase publishable (or anon) key
- `DEEPSEEK_API_KEY` — DeepSeek API key for AI features (see `docs/ai.md`)
- `DATABASE_URL` — Direct Postgres connection string (Supabase pooler)
- `ZPAY_PID` / `ZPAY_PKEY` — Z-Pay payment integration (see `docs/z-pay.md`)
- `NEXT_PUBLIC_SITE_URL` — Public site URL

The app gracefully degrades when Supabase env vars are missing — `hasEnvVars` check in `lib/utils.ts` gates auth UI, showing `EnvVarWarning` instead.

### Payment integration (planned)

`docs/z-pay.md` documents the Z-Pay (zpayz.cn) payment flow: MD5-signed redirect to `https://zpayz.cn/submit.php` with async notify callback. Not yet implemented in code.
