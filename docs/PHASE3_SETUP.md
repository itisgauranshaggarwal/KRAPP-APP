# Phase 3 Setup

Phase 3 replaces the in-memory demo with Supabase Auth, Postgres, Realtime and storage-aware cleanup. The migrations are ready at `docs/migrations/001_initial_schema.sql` and `docs/migrations/002_auth_foundation.sql`.

## What you provide

1. A Supabase project created on the free tier.
2. The project URL from **Project Settings → API**.
3. The publishable/anon key from the same page.
4. Confirmation that both migrations were run successfully in the Supabase SQL Editor. Existing projects should run `002_auth_foundation.sql` now; fresh projects should run them in order.
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
2. Replace mock session bodies with username-to-email resolution, Supabase Auth session events and profile creation. This auth slice is implemented behind automatic Supabase mode when both `VITE_SUPABASE_*` values are set; set `VITE_KRAPP_DATA_MODE=mock` to force the demo.
3. Replace `AppDataProvider` mock queries with profile, contact, conversation and message queries.
4. Add Realtime message subscriptions, presence, typing broadcasts and read receipts.
5. Add daily retention cleanup and storage policies.
6. Run the previous Phase 2 flow checks plus authenticated database tests against the project.

Account deletion remains guarded behind a trusted `delete-account` Edge Function; the browser never receives a service-role key and the UI reports that setup gap instead of claiming deletion succeeded.
