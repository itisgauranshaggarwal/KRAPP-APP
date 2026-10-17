# KRAPP APP - Documentation

This document is the single source of truth for session continuity. If you switch sessions, read this entire file first to understand what was done, decisions made, current state, and next steps.

**Last Updated:** 2026-10-17 (Session 2)

**Current Phase:** Phase 1 - Project Setup & UI Foundation (in progress)

**Status:** Project scaffolded; full mock UI built (auth, chats, requests, contacts, profile), neumorphic light/dark theme, routing. Build verification pending (npm install was slow/interrupted on this machine).

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Goals](#2-goals)
3. [Tech Stack](#3-tech-stack)
4. [Architecture](#4-architecture)
5. [Design System](#5-design-system)
6. [Database Schema](#6-database-schema)
7. [API Contracts / Data Shapes](#7-api-contracts--data-shapes)
8. [Auth Flow](#8-auth-flow)
9. [Contacts & Invite Flow](#9-contacts--invite-flow)
10. [Messaging Flow](#10-messaging-flow)
11. [Media Handling](#11-media-handling)
12. [UI Structure & Routes](#12-ui-structure--routes)
13. [Features Implemented](#13-features-implemented)
14. [TODO / Next Steps](#14-todo--next-steps)
15. [Decisions Log](#15-decisions-log)
16. [Known Issues & Tech Debt](#16-known-issues--tech-debt)
17. [Session Log](#17-session-log)
18. [Setup Instructions](#18-setup-instructions)
19. [Environment Variables](#19-environment-variables)
20. [Deployment](#20-deployment)
21. [Safety & Legal Notice](#21-safety--legal-notice)

## 1. Project Overview

**Name:** KRAPP APP  
**Vibe:** WhatsApp-inspired, minimal, neumorphic, light/dark mode.  
**Target:** Teens (11-17) primarily, but open to anyone. Hobby project, not for professional work.  
**Focus:** 1:1 chat with friends via username-based invites.  
**Constraints:** Free tiers only. Keep storage minimal (last 5 msgs per chat; media deleted daily regardless).

## 2. Goals

See PRD.md Section 2. Core goals include working MVP with auth, invites, realtime text, presence/typing/read receipts, retention policy, responsive UI, account management.

## 3. Tech Stack

### Frontend
- **Framework:** Vite 8 + React 19 + TypeScript 6
- **Styling:** Tailwind CSS v4 (CSS-first `@theme`) + CSS variables for light/dark theming
- **Fonts:** Fira Sans, self-hosted via `@fontsource/fira-sans`
- **Icons:** `lucide-react`
- **Components:** **Custom** neumorphic components (no shadcn). `cn()` helper = `clsx` + `tailwind-merge`
- **Routing:** `react-router-dom` v7 (`BrowserRouter`, nested routes)
- **Forms/Validation:** Manual validation for Phase 1; `react-hook-form` + `zod` deferred to Phase 2 if needed
- **State Management:** React Context (`ThemeProvider`, `AppDataProvider`) — Supabase-backed later
- **Alias:** `@/*` → `src/*` (configured in `vite.config.ts` + `tsconfig.app.json`)
- **Lint:** `oxlint` (Vite scaffold default). Prettier deferred.

### Backend/Data
- **Auth/DB/Realtime:** Supabase (free tier)
- **Storage:** TBD (Supabase Storage or Cloudflare R2). Choose based on free limits/convenience.
- **Security:** Supabase RLS on all tables

### Hosting/Infra
- **Frontend:** Cloudflare Pages (*.pages.dev)
- **Backend:** Supabase managed

All free-only.

## 4. Architecture

High-level (to be detailed during implementation):
- SPA on Cloudflare Pages
- Supabase client for auth, DB queries, realtime subscriptions, storage
- RLS enforces per-user access
- Media stored in chosen storage; references in DB
- Daily cleanup job (Supabase cron/edge function/worker) for message retention + media deletion per policy

## 5. Design System

**Style:** Neumorphism (restrained — crisp shadows, tight radii, real hierarchy)  
**Brand:** "Grape" violet `#7C5CFF` + "Sunset" coral accent `#FF5C7F` on lavender-grey surfaces (deliberately not WhatsApp green / Telegram blue / Discord blurple / Snapchat yellow)  
**Modes:** Light / Dark / System (class-based `.dark` on `<html>`, persisted in `localStorage['krapp.theme']`)  
**Typography:** Fira Sans (self-hosted)  
**Layout:** desktop — icon rail + list column + chat pane; mobile — list ⇄ full-screen chat + bottom nav  
**Inspiration:** Instagram (profile hero, story ring, stats), Telegram/WhatsApp (chat list, composer), playful gradient identity for a younger audience.

### Brand tokens
- Brand ramp: `--brand-1 #7c5cff`, `--brand-2 #a95cff`, `--brand-3 #ff5c7f` (used by `brand-gradient`)
- Surfaces (light): `--bg/--surface #ebe9f4`, `--surface-2 #e2dff0`, `--surface-3 #d8d4e9`; (dark): `#161521`, `#201e2e`, `#282539`
- Text: `--text`, `--text-muted`, `--text-faint` (contrast-tuned per mode)
- Semantic: `--primary` (light `#7c5cff` / dark `#8b6cff`), `--accent` coral, `--success`, `--online` mint, `--danger`, `--warning`
- Neumorphic pair: `--shadow-light` / `--shadow-dark` (inverted per theme)
- Bubbles: `--bubble-in` (near-white in light, raised panel in dark), `--bubble-out` (violet gradient), `--bubble-in-text`, `--bubble-out-text`
- Radii: `--radius-neu 1rem`, `--radius-app 0.875rem`
- Motion: `--ease-out`, `--ease-spring`

Tailwind v4 `@theme inline` maps these to utilities (`bg-surface`, `text-muted`, `bg-bubble-in`, `text-primary-contrast`, …).

### Utility layer (`@utility` in `src/index.css`)
- Neumorphic: `neu-raised`, `neu-raised-sm`, `neu-raised-lg`, `neu-inset`, `neu-inset-sm`, `neu-flat`, `neu-press` (raised→inset on `:active`), `neu-divider`
- Brand: `brand-gradient`, `brand-gradient-soft`, `text-gradient`, `glow-brand`
- Misc: `app-texture` (dot pattern), `hairline` (inset 1px ring), `scroll-soft`
- Animations: `animate-rise`, `animate-fade`, `animate-pop`, `typing-bounce` keyframes (disabled under `prefers-reduced-motion`)

## 6. Database Schema

**Tables (planned):**
- `users` (profile): id (uuid, matches auth.users), display_name, username (unique), email (unique, editable in Profile), avatar_url, created_at, updated_at, last_seen_at (for presence)
- `contacts`: id, requester_id, addressee_id, status (pending|accepted|rejected), intro_message_id? or store intro separately, created_at, updated_at
- `conversations`: id (uuid), user1_id, user2_id, created_at, updated_at (1:1; enforce uniqueness)
- `messages`: id, conversation_id, sender_id, type (text|image|voice|file), content, media_url, media_metadata (jsonb), is_intro (bool), read_by (json/array or separate receipts), created_at, deleted_at? (or hard delete on purge)

**Constraints:** unique(username), unique(requester_id, addressee_id), unique conversation pair (user1<user2 or ordered).  
**Indexes:** conversation_id+created_at, sender_id, recipient-related.

**RLS:** All tables - define per action (select/insert/update/delete) based on participation.

Full schema SQL and policies will be added in Phase 3.2.

## 7. API Contracts / Data Shapes

Define key shapes:
- User: { id, displayName, username, email, avatarUrl, lastSeenAt, online }
- Contact: { id, otherUser, status, createdAt }
- Conversation: { id, otherUser, lastMessage, unreadCount, updatedAt }
- Message: { id, conversationId, senderId, type, content, mediaUrl, metadata, status, createdAt, isIntro }

To be filled during implementation.

## 8. Auth Flow

- **Signup:** POST-like via Supabase Auth (email+password). Then create `users` profile with display_name, username, email. Check username unique.
- **Signin:** email+password via Supabase Auth. But UI is username+password - so we resolve username -> email first, then sign in. Document exact approach.
- **Session:** onAuthStateChange; persist.
- **Profile edit:** update allowed fields (username/display_name/email/avatar/bio).
- **Delete account:** cascade delete profile + auth user.

## 9. Contacts & Invite Flow

1. Click "New Contact" -> search username.
2. If found, show user card + "Send Invite". Optionally include intro message (max 1). Send creates contact pending + stores intro as message (is_intro=true) if provided.
3. Recipient sees in "Received Requests". Can Accept/Reject.
4. On Accept: create conversation if not exists; mark contact accepted.
5. Profile pic visible only after acceptance.
6. Sender can see in "Sent Requests".

## 10. Messaging Flow

- Before accept: only intro message from sender visible to recipient; no replies.
- After accept: bidirectional.
- Send: validate permissions (accepted). Store message.
- Realtime: subscribe to conversation channel for inserts/updates.
- Status: track sent -> delivered -> seen. Update on events.
- Typing: broadcast typing status on input focus/blur with debounce.
- Presence: heartbeat/last_seen_at updates.

Retention: on schedule (daily), keep only last 5 messages per conversation_id ordered by created_at desc; delete older. Media files deleted regardless.

## 11. Media Handling

- **Images:** upload to storage bucket `images`. Compress client-side. Validate type/size.
- **Voice:** record in browser (MediaRecorder) -> convert to MP3 (or use available codec). Max 60s. Bucket `voice-notes`.
- **Files:** bucket `files`. Store metadata (name, size, mime).
- **Deletion:** daily cleanup job removes media objects not needed? Or just delete all media older than policy window? "Delete media files regardless of 5 msg rule" - interpret as: media files are subject to deletion policy (daily cleanup). Document exact rule implementation.
- **Visibility:** media URLs only accessible to conversation participants (via signed URLs or RLS on storage).

## 12. UI Structure & Routes

**Routes (as built):**
- Public: `/login`, `/signup`
- Under `AppShell`: `/` → redirect `/chats`
  - `/chats` (layout) → index (placeholder) | `/chats/:conversationId` (chat)
  - `/requests`, `/contacts`, `/profile`
  - `*` → NotFound (inside shell)

**Folder structure (as built):**
```
src/
  components/
    chat/       MessageBubble, MessageList, MessageInput, MessageStatusTicks, ChatList, ChatListItem, ChatView
    contacts/   NewContactDialog
    layout/     AppShell, IconRail, BottomNav, PageHeader, nav.ts
    shared/     AppLogo, ThemeToggle, SafetyNotice
    ui/         Button, IconButton, Input, Avatar, Badge, CountBadge, Modal, Switch,
                Tabs, Skeleton, SkeletonRows, EmptyState, index.ts (barrel)
  data/         mock.ts (mock users/contacts/requests/conversations/messages/directory)
  hooks/        useMediaQuery.ts
  lib/          utils.ts (cn, initials, avatarColor), format.ts (time/presence/duration/bytes),
                theme.tsx (ThemeProvider + useTheme)
  pages/
    auth/       AuthLayout, LoginPage, SignupPage
    app/        ChatsScreen, ChatDetailPage (+ ChatsIndexPage), RequestsPage, ContactsPage, ProfilePage
    NotFoundPage.tsx
  store/        AppDataProvider.tsx (mock data + actions; superseded by Supabase in Phase 3)
  types/        index.ts
  App.tsx  main.tsx  index.css  vite-env.d.ts
```

**Responsive behavior:**
- `AppShell` shows `IconRail` on `lg+`, `BottomNav` on mobile (hidden while a chat is open).
- `ChatsScreen` shows list + chat side-by-side on `lg+`; on mobile shows one column and swaps via the nested route.

## 13. Features Implemented

| Feature | Status | Notes |
|---|---|---|
| Project setup | ✅ Done | Vite 8 + React 19 + TS 6 |
| Auth UI (signup/signin) | ✅ Done | Mock only; validation basic |
| Contacts UI | ✅ Done | Search, list, remove |
| Requests UI | ✅ Done | Received/Sent tabs, accept/reject |
| Chat UI | ✅ Done | Bubbles, day separators, input, placeholder pane |
| Neumorphic design | ✅ Done | Tokens + utilities in index.css |
| Light/Dark mode | ✅ Done | light/dark/system + no-flash script |
| New contact dialog | ✅ Done | Username search + single intro message |
| Profile UI | ✅ Done | Hero + stats + edit (incl. **email** + bio), theme, delete account |
| Safety notice | ✅ Done | Auth screens + Profile |
| Brand identity | ✅ Done | "Grape" violet + "Sunset" coral (own system, not WhatsApp green) |
| Supabase integration | ⏳ Not started | Phase 3 |
| Auth (username+password) | ⏳ Not started | Mock nav only |
| Contacts/invites (real) | ⏳ Not started | Mock state only |
| Realtime messaging | ⏳ Not started | Phase 3 |
| Presence/typing/read receipts | ⏳ Not started | UI affordances exist (ticks, typing bubble) |
| Retention (last 5 msgs) | ⏳ Not started | Phase 3 |
| Media upload/display | ⏳ Not started | Phase 4 |
| Voice notes | ⏳ Not started | Phase 4 (mic button is a placeholder) |
| Account deletion | 🟡 UI only | Confirm modal; no real deletion yet |

## 14. TODO / Next Steps

**Immediate next step:**
Finish Phase 1 verification: `npm run build` must pass, then dev-server smoke test (auth → chats → open chat → send message → requests accept). Then begin **Phase 2 (UX polish)** per TODO.md.

## 15. Decisions Log

Use this section to record every significant decision with rationale, date, and session. This is critical for continuity.

| Date | Decision | Rationale | Impact |
|---|---|---|---|
| 2025-10-16 | Start with docs (no code) | User explicitly asked to write docs first | Clear plan before implementation |
| 2025-10-16 | Username chosen by user (not derived from email) | Per requirements | Simpler discovery by username |
| 2025-10-16 | Login is username+password only | Per requirements; resolve username->email for Supabase Auth | Custom lookup needed |
| 2025-10-16 | Single intro message on invite (only before accept) | Per requirements | Special message type (is_intro) |
| 2025-10-16 | Keep last 5 messages per chat; delete older daily | Storage-conscious for free tier | Retention job required |
| 2025-10-16 | Media files deleted regardless of 5-msg rule | Storage-conscious | Separate cleanup for media |
| 2025-10-16 | Profile pic visible only after acceptance | Privacy per requirements | UI + RLS considerations |
| 2025-10-16 | Neumorphic light/dark, Fira Sans, WhatsApp-like layout | Per requirements | Design system constraints |
| 2025-10-16 | Free tiers only (Cloudflare Pages + Supabase) | Constraint | Must stay within limits |
| 2026-10-17 | Tailwind v4 (CSS-first `@theme`) instead of v3 config | Latest; fewer config files | Tokens live in `src/index.css` |
| 2026-10-17 | Custom neumorphic components instead of shadcn/ui | shadcn defaults don't match neumorphism; keeps bundle small | No `components.json`; own `ui/*` primitives |
| 2026-10-17 | Fira Sans self-hosted via `@fontsource` | Works offline, no CDN dependency, free | Fonts in `node_modules`, imported in `main.tsx` |
| 2026-10-17 | Path alias `@/*` → `src/*` | Cleaner imports | Configured in `vite.config.ts` + `tsconfig.app.json` (no `baseUrl`, TS6 deprecated it) |
| 2026-10-17 | Mock data via `AppDataProvider` context | Lets UI be built/validated before Supabase | Swap internals in Phase 3; keep the same hook API |
| 2026-10-17 | Default avatar = WhatsApp-style silhouette (icon), initials mode available | Matches product requirement | `Avatar` supports `fallback="icon" \| "initials"` |
| 2026-10-17 | Guard/routing: no auth guard yet (all routes open) | Phase 2 adds route guards | Tracked in TODO 2.6 |
| 2026-10-17 | Retained `oxlint` (scaffold default); Prettier deferred | Reduce setup churn now | Revisit Phase 2/5 |
| 2026-10-17 | **Brand change:** own palette "Grape" `#7C5CFF` + "Sunset" `#FF5C7F`, lavender-grey neumorphic surfaces | User asked to drop the WhatsApp green/black system and create a distinct identity | All tokens + utilities rewritten in `src/index.css`; `index.html` theme-color updated |
| 2026-10-17 | **Neumorphism kept but restrained** (tight radii, crisper shadows, texture, real hierarchy) | Original style was too "blobby"/generic; user called it AI slop | Smaller radii (`rounded-xl/2xl`), added `hairline`, `app-texture`, `glow-brand`, brand wash behind the shell |
| 2026-10-17 | **Email is now editable** (reverses earlier "immutable" rule) | User requested it | Signup warning removed; Profile has an editable email field; `updateProfile` accepts `email`; DB `email` must no longer be immutable (update PRD 6.x) |
| 2026-10-17 | Added editable `bio` + profile stats row | Profile looked sparse/unfinished | `User.bio` already existed; stats derived from contacts/chats/requests |
| 2026-10-17 | Auth screens get a two-column desktop layout (brand panel + form) | Make first-run feel designed, not a plain card | `AuthLayout` responsive: panel `lg+`, form card always |

## 16. Known Issues & Tech Debt

- **npm on this machine is slow / flaky.** A first `npm install` was interrupted by a tool timeout, leaving `node_modules` partially extracted and `package.json` missing 5 deps (react-router-dom, lucide-react, clsx, tailwind-merge, @fontsource/fira-sans). Reinstalled. Also had to extract `lucide-react` from its npm tarball manually once because its `.d.ts` was missing from a corrupted extraction. If a package's types appear missing, verify against `npm pack <pkg>@<ver>`.
- **Verified:** `npm run build` (tsc + vite) ✅, `npm run lint` ✅ (warnings only), dev server smoke-tested at `http://localhost:5173` (all routes/modules compile).
- **Bundle size:** main JS ~935 kB (~254 kB gzip) — larger than ideal. Address with route-level code splitting in Phase 5.
- `Skeleton`/`SkeletonRows` exist but are not yet used by pages (Phase 2 loading states).
- `Modal` focus management is basic (focus-in + Escape close); full focus trap is Phase 2 (a11y).
- No Prettier config yet.
- `AppDataProvider` keeps all state in memory; nothing persists across reloads (expected pre-Supabase).

## 17. Session Log

**Session 1 (2025-10-16)**
- User provided detailed requirements (all questions answered).
- Created PRD.md, TODO.md, DOCUMENTATION.md, README.md, SESSION_RESUME.md.
- No code changes made.

**Session 2 (2026-10-17) — Phase 1 (UI Foundation)**
- Scaffolded Vite + React 19 + TS 6 project into `E:\KRAPP-APP` (kept existing `docs/`, `README.md`, `prompt.txt`).
- `git init`; extended `.gitignore` (`.env*`, keep `.env.example`).
- Added Tailwind v4 (`@tailwindcss/vite`); built full neumorphic design system in `src/index.css` (light/dark tokens, `@theme inline` mapping, `@utility` neu-* helpers).
- Self-hosted Fira Sans; configured `@/*` alias; added strict TS + paths in `tsconfig.app.json`.
- Built UI primitives: Button, IconButton, Input, Avatar, Badge/CountBadge, Modal, Switch, Tabs, Skeleton, EmptyState.
- Built shared: AppLogo, ThemeToggle, SafetyNotice; ThemeProvider (light/dark/system, no-flash inline script in `index.html`).
- Built layout: AppShell, IconRail (desktop), BottomNav (mobile), PageHeader.
- Built pages: Login, Signup, Chats (list + chat pane), ChatDetail, Requests (accept/reject), Contacts, Profile (edit + theme + delete account + about), NotFound.
- Built chat UI: bubbles, day separators, delivery ticks, typing bubble, auto-grow input, mic placeholder.
- Built `NewContactDialog` (username search → confirm → single intro message → sent state).
- Introduced `AppDataProvider` (mock data + actions) to drive the UI.
- Installed skills earlier (Session 2 pre-work): ui-ux-pro-max, supabase, frontend-design, frontend-ui-ux, impeccable-design-polish, web-design-guidelines, web-interface-guidelines, shadcn-ui, react-expert, component-design, react-architecture.
- Fixed install issues (see Known Issues). `npm run build` ✅, `npm run lint` ✅, dev server smoke test ✅.
- Fixed `lucide-react` missing `.d.ts` by extracting from the npm tarball (`dist/lucide-react*.d.ts`).

**Session 3 (2026-10-17) — Brand & UI polish**
- **Replaced the WhatsApp-green design with an own brand system:** "Grape" violet `#7C5CFF` + "Sunset" coral `#FF5C7F` on lavender-grey neumorphic surfaces. Rewrote `src/index.css` (tokens, `@theme inline`, new utilities: `brand-gradient`, `brand-gradient-soft`, `text-gradient`, `glow-brand`, `neu-flat`, `app-texture`, `hairline`; animations `rise`/`fade`/`pop`/`typing-bounce`; contrast-tuned text).
- **Removed the "AI slop" tells:** smaller consistent radii, crisper shadows, hairlines for definition, uppercase tracked micro-labels, real type hierarchy instead of oversized soft blobs.
- **Nav bar:** `IconRail` now has a brand-gradient active pill + left indicator bar, hover states, description tooltips, and an avatar profile entry with a gradient ring. `BottomNav` has a gradient top indicator, `primary-soft` active pill, icon scale and press feedback.
- **Main window:** `AppShell` gets a soft brand atmosphere (violet/coral glows); chat area and pages get a subtle dot texture; translucent blurred headers and composer (`PageHeader`, `MessageInput`); glassy chat-list column.
- **Chat:** gradient outgoing bubbles + near-white incoming bubbles, message grouping (tighter gaps, animated `rise` on arrival), day-separator pills, animated typing bubble, ticks tuned for violet.
- **Profile:** full redesign — gradient cover hero, story-ring avatar, bio, a stats row (contacts/chats/pending) and grouped settings sections; **email is now editable** (with validation) and `bio` added.
- **Auth:** two-column desktop layout (brand panel + form), gradient logo mark; removed the "email can't be changed later" warning.
- Icons/palette: `avatarColor` palette re-aligned to the brand.
- Docs updated (design system, decisions, features, PRD/TODO/SESSION_RESUME for editable email).
- Verified: `tsc -b` ✅, `npm run build` ✅, `npm run lint` ✅ (warnings only), dev-server smoke test ✅.
- Next: begin Phase 2 (route guards, form validation, loading/empty states, a11y focus trap, code splitting).

## 18. Setup Instructions

**Prerequisites:** Node 20+ (built with Node 24) and npm.

```bash
# install dependencies
npm install

# start dev server (http://localhost:5173)
npm run dev

# typecheck + production build (outputs to dist/)
npm run build

# lint
npm run lint

# preview the production build
npm run preview
```

**Supabase setup:** added in Phase 3. Copy `.env.example` → `.env.local` and fill in the values.

**Deployment:** Cloudflare Pages — build command `npm run build`, output directory `dist`, and set the `VITE_*` env vars in the Pages project.

## 19. Environment Variables

`.env.example` (committed) contains:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```
Real values go in `.env.local` (gitignored). Add more if R2 / custom endpoints are introduced.

## 20. Deployment

- **Frontend:** Cloudflare Pages. Build command: `npm run build`. Output: `dist/`. Env vars configured in Pages.
- **Backend:** Supabase (auth/db/realtime/storage configured in dashboard). RLS + migrations applied.

## 21. Safety & Legal Notice

Display in UI (login/signup or footer):
> "This is a hobby project. We are not responsible for data leakage. Do not share sensitive personal information. Be a good neighbor."

Also mention email cannot be changed after signup.
