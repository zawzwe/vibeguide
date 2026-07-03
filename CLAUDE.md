# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server on localhost:3000
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint (next/core-web-vitals + next/typescript)
npm run db:push    # Push Drizzle schema to PostgreSQL
npm run db:generate # Generate Drizzle migrations
npm run db:studio  # Open Drizzle Studio (DB GUI)
```

## Architecture

**VibeGuide** — AI-powered development documentation platform built on Next.js 16 + Supabase + Drizzle ORM.

### Supabase client layer (`lib/supabase/`)

Three separate client factories — never reuse across contexts:

| File | Context | Usage |
|------|---------|-------|
| `lib/supabase/client.ts` | Browser (`"use client"`) | Client Components |
| `lib/supabase/server.ts` | Server Components / Route Handlers | Server-side data + auth |
| `lib/supabase/proxy.ts` | Middleware | Session refresh via `updateSession()` |

**Critical**: Do not run code between `createServerClient` and `getClaims()` in middleware — causes random logout.

### Database (Drizzle ORM)

- `drizzle.config.ts` — Drizzle Kit config (postgresql dialect)
- `db/schema/` — Table definitions: `projects`, `credits`, `payments`
- `db/index.ts` — Client factory (`getDb()`), singleton pattern
- All tables reference `auth.users` via `user_id` column — enforced at app layer, not DDL

### Request flow

1. **Proxy** (`proxy.ts` at root) — Next.js middleware. Calls `updateSession()` to refresh Supabase auth cookies. Public routes: `/`, `/pricing`, `/auth/*`, `/api/pay/notify`, `/api/pay/return`. All others redirect unauthenticated users to `/auth/login`.
2. **Auth callback** (`app/auth/confirm/route.ts`) — OTP/email confirmation via `verifyOtp()`.
3. **Dynamic pages** — Pages using cookies/DB declare `export const dynamic = "force-dynamic"`.

### Route structure

**Public:**
- `/` — Landing page (Hero, Features, Bento, CTA, Pricing, Stats, FAQ)
- `/pricing` — 2 tiers: ¥20/10 projects, ¥40/30 projects
- `/auth/*` — Login, Sign-up, Forgot/Update password, Confirm, Error

**Protected (dashboard layout with sidebar):**
- `/projects` — Project list (server- fetched via Drizzle)
- `/projects/new` — 3-step AI wizard (Describe → Deepen Requirements → Create Docs)
- `/projects/[id]` — View/edit saved project (reuses wizard with `initialData`)
- `/my` — User profile with email + credit balance

### Component organization

- `components/ui/` — shadcn/ui primitives (Button, Card, Input, Label, Badge, Checkbox, DropdownMenu, Separator, Sheet, Tabs, Textarea, Skeleton, Accordion, Dialog, ScrollArea)
- `components/` — Feature components:
  - Auth forms: `login-form`, `sign-up-form`, `forgot-password-form`, `update-password-form`
  - **`project-wizard.tsx`** — 3-step wizard container (manages step state, `initialData` prop for edit mode)
  - `step-indicator.tsx`, `step-description.tsx`, `step-requirements.tsx`, `step-documents.tsx`
  - `sidebar.tsx` + `dashboard-header.tsx` — Dashboard layout
  - `site-header.tsx` — Public page header
  - `hero-cta-button.tsx` — Server component: auth-aware CTA button
  - `pay-button.tsx` — Client component: calls `/api/pay/create`, redirects to Z-Pay
  - `project-card.tsx`, `project-list.tsx` — Project listing
  - `user-profile.tsx` — Credits + email display

### API routes

- `/api/ai/questions` — POST: DeepSeek generates 3-5 clarifying questions
- `/api/ai/documents` — POST: DeepSeek generates 5 docs in parallel
- `/api/projects` — POST: Create project
- `/api/projects/[id]` — PUT: Update project
- `/api/projects/[id]/download` — GET: Download single doc as .md
- `/api/projects/[id]/download-zip` — GET: Download all docs as .zip (jszip)
- `/api/pay/create` — POST: Create Z-Pay order with MD5 signature
- `/api/pay/notify` — GET: Z-Pay callback (idempotent, credits user)
- `/api/pay/return` — GET: Post-payment redirect
- `/api/credits/check` — POST: Check credit balance
- `/api/credits/deduct` — POST: Atomic deduct 1 credit

### AI Integration

DeepSeek V4 Flash via OpenAI SDK (`new OpenAI({ baseURL: "https://api.deepseek.com" })`). Server-side only — protects `DEEPSEEK_API_KEY`. Document generation runs 5 parallel calls.

### Payment (Z-Pay)

- `lib/zpay.ts` — MD5 signature utilities (`generateSignature`, `verifySignature`, `generateOutTradeNo`, `buildPaymentUrl`)
- Plans: `PRICING_PLANS["10"]` (¥20/10 credits), `PRICING_PLANS["30"]` (¥40/30 credits)
- Notify handler is idempotent — checks existing payment status before processing

### Styling

- Tailwind CSS + CSS variables theming (light/dark in `globals.css`)
- shadcn/ui `new-york` style, `neutral` base, `lucide` icons
- `cn()` utility from `lib/utils.ts` (clsx + tailwind-merge)

### Environment variables

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase
- `DATABASE_URL` — Postgres pooler (Drizzle)
- `DEEPSEEK_API_KEY` — DeepSeek AI
- `ZPAY_PID` / `ZPAY_PKEY` — Z-Pay credentials
- `NEXT_PUBLIC_SITE_URL` — Used for payment callback URLs

### Form patterns (existing convention)

- `"use client"` components with individual `useState` per field
- `error: string | null` + `isLoading: boolean` states
- `try/catch/finally` with `setIsLoading(false)` in finally
- Button text changes on loading, disabled state
- Error displayed as inline `<p className="text-sm text-red-500">`
- `supabase.auth.getClaims()` (not `getUser()`) for auth checks — faster, reads from JWT locally
