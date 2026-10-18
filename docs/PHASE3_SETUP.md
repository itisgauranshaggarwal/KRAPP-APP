# Phase 3 Setup

Phase 3 replaces the in-memory demo with Supabase Auth, Postgres, Realtime and storage-aware cleanup. The migration is ready at `docs/migrations/001_initial_schema.sql`.

## What you provide

1. A Supabase project created on the free tier.
2. The project URL from **Project Settings → API**.
3. The publishable/anon key from the same page.
4. Confirmation that `docs/migrations/001_initial_schema.sql` was run successfully in the Supabase SQL Editor.
5. A test account email and password for local verification. Do not send the password in chat; put it in the local environment or create the account yourself.

The browser app never needs the service-role key. Do not commit or share it. Account deletion and any trusted cleanup operation will use a server-side Edge Function if required.

## Local setup

Create `.env.local` in the repository root:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

Apply the migration, then tell me that both steps are complete. Real credentials belong only in `.env.local`, which is ignored by Git.

## Implementation order

1. Repair and lock the npm dependency tree, then install `@supabase/supabase-js`.
2. Replace mock session bodies with username-to-email resolution, Supabase Auth session events and profile creation.
3. Replace `AppDataProvider` mock queries with profile, contact, conversation and message queries.
4. Add Realtime message subscriptions, presence, typing broadcasts and read receipts.
5. Add daily retention cleanup and storage policies.
6. Run the previous Phase 2 flow checks plus authenticated database tests against the project.

Until the migration and credentials are available, the app intentionally stays in mock mode so the existing UI remains usable.
