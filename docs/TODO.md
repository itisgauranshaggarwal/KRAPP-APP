# KRAPP APP - TODO List

This is the master todo list. Work in the specified order: UI -> UX -> Realtime Texting -> Media/Extras. Update this file as we progress (mark [x] when done). This file is part of session continuity.

## Phase 1: Project Setup & UI Foundation
**Goal:** Initialize project, establish design system, build static/mock UI (no backend wiring yet).

- [x] 1.1 Initialize Vite + React + TypeScript project (React 19.3, TS 6.0, Vite 8.3)
- [x] 1.2 Setup Git repo and .gitignore (node_modules, .env*, build outputs)
- [x] 1.3 Add Tailwind CSS v4 (@tailwindcss/vite, CSS-first `@theme`)
- [x] 1.4 Component strategy: custom neumorphic components (no shadcn). Added `cn()` helper (clsx + tailwind-merge)
- [x] 1.5 Add Fira Sans font (self-hosted via @fontsource/fira-sans, weights 400/500/600/700)
- [x] 1.6 Lint setup (oxlint from Vite scaffold) — Prettier deferred to Phase 2/5
- [x] 1.7 Design system: color tokens (light/dark), neumorphic shadow utilities, radius, typography
- [x] 1.8 Routing structure (react-router-dom v7): public auth routes + app shell routes
- [x] 1.9 Auth UI: Signup screen (display name, username, email, password)
- [x] 1.10 Auth UI: Signin screen (username + password only)
- [x] 1.11 Desktop app shell (icon rail + list + chat area)
- [x] 1.12 Mobile layout (bottom nav + list/chat navigation with full-screen chat)
- [x] 1.13 Contacts UI + Requests UI (received/sent tabs, accept/reject, empty states)
- [x] 1.14 New Contact dialog: search by username, results, send invite with single intro message
- [x] 1.15 Chat UI: message list, bubbles, day separators, timestamps, status ticks, typing bubble
- [x] 1.16 Chat input (text only; Enter to send, auto-grow textarea)
- [x] 1.17 Profile UI (view/edit display name + username + email + avatar + bio, theme mode, delete account, about)
- [x] 1.18 Light/Dark/system mode toggle (no-flash inline script + ThemeProvider)
- [x] 1.19 Default avatar component (WhatsApp-style silhouette, optional initials mode, presence dot)
- [~] 1.20 Responsive polish — first pass done (lg breakpoints); needs device testing in Phase 2
- [x] 1.21 Safety notice UI (auth screens + Profile → About)
- [x] 1.22 Docs updated (decisions + session log)

**Note:** Mock data drives the UI for now via `src/store/AppDataProvider.tsx` (swappable for Supabase in Phase 3). Verify with `npm run build`.

**Phase 1 Done When:** Static UI renders for auth, contacts, chat (desktop + mobile). Mock data only.

## Phase 2: UX Polish & Flows
**Goal:** Improve UX, validation, empty/loading states, route guards, accessibility basics.

- [ ] 2.1 Form validation for signup/signin (min 5 char password, required fields, username uniqueness logic client-side for UX)
- [ ] 2.2 Profile: inline save feedback + field validation (email now editable)
- [ ] 2.3 Username search validation (no spaces, case handling? document behavior)
- [ ] 2.4 Invite flow UX: search -> result -> confirm send (with optional intro msg)
- [ ] 2.5 Accept/Reject flow with feedback
- [ ] 2.6 Route guards (redirect to login if not authenticated; redirect to app if logged in)
- [ ] 2.7 Loading states (skeletons/spinners) for async actions
- [ ] 2.8 Empty states for contacts, requests, chat list, no results
- [ ] 2.9 Error states and toasts/snackbars
- [ ] 2.10 Mobile navigation: smooth transitions between list and chat
- [ ] 2.11 Profile edit validation and save feedback
- [ ] 2.12 Delete account confirmation modal (destructive action)
- [ ] 2.13 Delete conversation confirmation
- [ ] 2.14 Accessibility: aria labels, focus management, keyboard nav basics
- [ ] 2.15 Neumorphic consistency pass (shadows, borders, active states)
- [ ] 2.16 Dark mode polish
- [ ] 2.17 Update DOCUMENTATION.md with UX decisions

**Phase 2 Done When:** Flows feel smooth, validation works, guards in place, mock UX solid.

## Phase 3: Realtime Texting (Core)
**Goal:** Wire to Supabase, implement auth, contacts, 1:1 realtime messaging with presence/typing/read receipts.

### 3.1 Supabase Setup
- [ ] 3.1.1 Create Supabase project (free tier)
- [ ] 3.1.2 Get API keys (anon, service role if needed later) and URL
- [ ] 3.1.3 Configure environment variables (.env.local, .env.example)
- [ ] 3.1.4 Install Supabase JS client
- [ ] 3.1.5 Test connection
- [ ] 3.1.6 Document keys setup in README/DOCS

### 3.2 Database Schema
- [ ] 3.2.1 Design tables: users (profile), contacts (friendships with status), conversations (1:1), messages
- [ ] 3.2.2 Add constraints: unique username, unique (requester, addressee) pair, conversation uniqueness
- [ ] 3.2.3 Add indexes for performance (common queries)
- [ ] 3.2.4 Write migration SQL (or use Supabase dashboard) - store SQL in docs/migrations/
- [ ] 3.2.5 Enable RLS on all tables
- [ ] 3.2.6 Define RLS policies (users: read own+allowed? contacts visible to involved; messages visible to conversation participants)
- [ ] 3.2.7 Add created_at/updated_at with defaults
- [ ] 3.2.8 Document schema in DOCUMENTATION.md (ERD description)

### 3.3 Auth Integration
- [ ] 3.3.1 Supabase Auth (email/password) - still username+password login UX; email stored in auth.users
- [ ] 3.3.2 Signup: create auth user, create profile row (display_name, username, email, avatar_url null)
- [ ] 3.3.3 Enforce username uniqueness (check before signup; handle collision)
- [ ] 3.3.4 Signin with username+password (lookup username->email or use custom auth; document approach)
- [ ] 3.3.5 Session persistence (onAuthStateChange)
- [ ] 3.3.6 Route guards based on auth state
- [ ] 3.3.7 Edit profile: update display_name, username (check unique), avatar_url
- [ ] 3.3.8 Delete account: delete profile + auth user (handle cascades)
- [ ] 3.3.9 Allow email updates (with validation + uniqueness check)

### 3.4 Contacts System
- [ ] 3.4.1 Search user by username (exact or startswith? document; keep simple)
- [ ] 3.4.2 Send invite: create contact record (status pending), allow single intro message stored? (where - in messages with flag or just create first message marked as intro)
- [ ] 3.4.3 Intro message: sender can send 1 msg at invite time; visible before accept
- [ ] 3.4.4 List pending received/sent
- [ ] 3.4.5 Accept/Reject: update contact status
- [ ] 3.4.6 Create conversation on accept (or ensure exists)
- [ ] 3.4.7 Contact list (accepted only)
- [ ] 3.4.8 Profile pic visibility: only after acceptance (enforce in UI + consider RLS)
- [ ] 3.4.9 Delete conversation (soft/hard; affects messages)

### 3.5 Realtime Messaging
- [ ] 3.5.1 Conversation creation/joining logic
- [ ] 3.5.2 Send text message (after accept; intro msg allowed pre-accept by sender only once)
- [ ] 3.5.3 Receive messages in realtime (Supabase Realtime subscription per conversation)
- [ ] 3.5.4 Message ordering by created_at
- [ ] 3.5.5 Presence: online/offline (track last seen or presence channel)
- [ ] 3.5.6 Typing indicators (emit typing state on input)
- [ ] 3.5.7 Message status: sent/delivered/seen (update on read)
- [ ] 3.5.8 Chat list: show last message preview, unread count (basic), presence dot
- [ ] 3.5.9 Auto-scroll to bottom on new message
- [ ] 3.5.10 Load message history (respect "last 5" retention concept; for active chats show recent; implement retention)
- [ ] 3.5.11 Daily cleanup: implement strategy for deleting messages older than keeping last 5 per chat (cron/edge function). Document approach and schedule
- [ ] 3.5.12 Handle network/reconnects gracefully

### 3.6 Storage/Media Foundations (Phase 3 prep)
- [ ] 3.6.1 Plan storage buckets (images, voice-notes, files) - choose Supabase Storage vs R2; document choice
- [ ] 3.6.2 Define media deletion policy (delete media files regardless of 5-msg rule)
- [ ] 3.6.3 RLS for storage objects (if Supabase Storage)

**Phase 3 Done When:** Auth, contacts, 1:1 realtime text fully functional with presence/typing/read receipts. Retention policy implemented or scheduled.

## Phase 4: Media (Voice Notes, Images, Files)
**Goal:** Add media support respecting storage constraints.

- [ ] 4.1 Image upload: select/compress, preview before send, upload to storage
- [ ] 4.2 Image display in messages (thumbnails, full view modal)
- [ ] 4.3 Image size limits; supported formats (PNG/JPG/GIF/WebP)
- [ ] 4.4 Voice notes: recording UI with hold-to-record, swipe up to unhold, release/tap to finish
- [ ] 4.5 Voice notes: MP3 format, max 1 min, upload, playback (audio controls)
- [ ] 4.6 File attachments: upload, preview/download
- [ ] 4.7 Media in messages: distinguish types, render appropriately
- [ ] 4.8 Deletion: media files removed on daily cleanup per policy (regardless of 5-msg rule)
- [ ] 4.9 Storage quotas awareness; handle upload errors (size/type)
- [ ] 4.10 Default avatar asset (add to repo or generate)
- [ ] 4.11 Profile pic upload/change (optional)
- [ ] 4.12 Profile pic visibility enforced (only after acceptance)

**Phase 4 Done When:** Can send/receive images, voice notes, files with proper UI/limits.

## Phase 5: Polish, Deployment, Safety & Docs
**Goal:** Finalize MVP for deployment, polish neumorphic UI, add safety notice, complete docs.

- [ ] 5.1 Safety notice implemented and visible (login/signup/footer per choice)
- [ ] 5.2 Neumorphic design audit across all screens (light/dark)
- [ ] 5.3 Mobile UX audit (gestures, back nav, keyboard)
- [ ] 5.4 Desktop UX audit (split view behavior)
- [ ] 5.5 Performance: lazy load routes, optimize images
- [ ] 5.6 Error boundaries
- [ ] 5.7 Empty/loading states everywhere
- [ ] 5.8 Delete account flow fully tested
- [ ] 5.9 Delete conversation flow tested
- [ ] 5.10 Retention cleanup tested (logic + schedule)
- [ ] 5.11 Environment variables: .env.example complete
- [ ] 5.12 Build: `npm run build` succeeds
- [ ] 5.13 Deploy to Cloudflare Pages (configure project, env vars)
- [ ] 5.14 Test on mobile device (real) and desktop
- [ ] 5.15 Update README.md with setup, deploy, features
- [ ] 5.16 Update DOCUMENTATION.md with all implementation details, decisions, schema, RLS, flows
- [ ] 5.17 Update PRD.md if any scope adjustments made (with rationale)
- [ ] 5.18 Add SESSION_LOG to DOCUMENTATION.md
- [ ] 5.19 Final pass: no TODOs left for MVP features; document known issues if any

**Phase 5 Done When:** MVP deployed to pages.dev, usable per success criteria, docs complete.

## Phase 6: Stretch (Defer)
- [ ] 6.1 Block contacts
- [ ] 6.2 Group chats
- [ ] 6.3 Reactions/replies
- [ ] 6.4 Push notifications
- [ ] 6.5 End-to-end encryption (research)
- [ ] 6.6 Online presence enhancements (last seen granularity)

## Notes
- Stick to free tiers only. Document any limit considerations.
- Document every non-obvious decision in Decisions Log (see DOCUMENTATION.md).
- Keep session continuity: update docs/ after each meaningful change.
- Don't guess - if unclear, ask before implementing. (But we have answers; still follow this.)
- Prioritize Phase 1-3 first for core usability.
