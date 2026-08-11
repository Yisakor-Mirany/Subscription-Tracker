# Subscrio

A production-quality subscription tracker: know exactly what every recurring subscription costs you, monthly and annually.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack, Server Actions)
- TypeScript
- Tailwind CSS v4
- [Supabase](https://supabase.com) (Postgres, Auth, Row Level Security)
- [shadcn/ui](https://ui.shadcn.com) primitives (hand-vendored under `src/components/ui`)
- [Recharts](https://recharts.org) for analytics
- [Lucide](https://lucide.dev) icons
- react-hook-form + Zod for form validation

## Features

- Email/password auth via Supabase, with every route protected by `src/proxy.ts` (Next.js 16's renamed `middleware.ts`)
- Row Level Security — every user can only ever see their own data
- Full subscription CRUD: add, edit, delete, mark active/canceled/trial
- Subscription list with search, sort, category and status filters
- Dashboard with monthly/annual cost, active count, and 30-day upcoming charges
- Upcoming payments grouped into next 7 days / next 30 days / later
- Monthly calendar view of renewal dates
- Analytics: projected monthly spend, spending by category, largest subscriptions, averages
- Settings: name, preferred currency, dark mode, danger zone

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project URL + anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

The schema lives in `supabase/migrations/0001_init.sql`. It creates:

- `profiles` — one row per user (name, preferred currency, dark mode), auto-created on signup via an `auth.users` trigger
- `subscriptions` — one row per tracked subscription, scoped to `user_id`

Both tables have Row Level Security enabled with policies that restrict every read/write to `auth.uid()`.

Apply the migration to your own Supabase project with the Supabase CLI or MCP tooling:

```bash
supabase db push
```

## Scripts

```bash
npm run dev     # start the dev server (Turbopack)
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

## Project structure

```
src/
  app/            # routes (App Router)
    (auth)/       # login, signup — public
    (app)/        # dashboard, subscriptions, calendar, analytics, settings — protected
  components/     # ui/ (shadcn primitives) + feature folders
  lib/
    actions/      # server actions (auth, subscriptions, profile)
    data/         # server-side data fetchers
    supabase/     # browser/server Supabase clients + proxy session helper
    validations/  # zod schemas
  types/          # generated Supabase database types
supabase/
  migrations/     # SQL migrations
```
