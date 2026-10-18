# KRAPP APP

**Current status:** Supabase Auth/data wiring, realtime text messaging, unread/read state, typing, presence, legal pages, error recovery and the text-only MVP scope are implemented. Remaining work is live-project verification, retention scheduling, deployment, and device QA.

Simple 1:1 chat app with username-based invites, realtime messaging, light/dark mode, and a quiet, product-grade interface. Built as a free-tier-only hobby project.

## Project Status
**Phases 1–2 complete.** Phase 1 built the UI foundation; Phase 2 added the UX layer: a mock session with route guards, form validation, toasts, loading skeletons, empty states, a modal focus trap, and mobile list↔chat transitions. Everything still runs on mock data — backend wiring starts in Phase 3.

**Design:** "Quiet Ink" — neutral surfaces, hairlines instead of shadows, strong type hierarchy and a single petrol-teal accent (no gradients, glows or glassmorphism). Tokens live in `src/index.css`.

**Try it:** any username signs in; the password just needs 5+ characters (mock auth, `MOCK_AUTH` in `src/lib/session.tsx`).

**Design:** "Quiet Ink" — neutral surfaces, hairlines instead of shadows, strong type hierarchy and a single petrol-teal accent (no gradients, glows or glassmorphism). Tokens live in `src/index.css`.

## Tech Stack
Vite 8 · React 19 · TypeScript 6 · Tailwind CSS v4 · React Router v7 · lucide-react · Fira Sans (self-hosted) · Supabase (Phase 3) · Cloudflare Pages (deploy).

## Quick Start
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build
npm run lint
```

## Features
- Signup/Signin with username + password (email is editable later in Profile)
- Route guards + mock session (persisted to `localStorage`; Supabase Auth in Phase 3)
- Toasts, loading skeletons and empty states for every list and async action
- Accessibility basics: modal focus trap, skip link, labelled controls, `aria-live` notifications
- Add contacts by username only, with single intro message on invite
- Accept/Reject invites
- 1:1 chat: text, presence, typing, sent/delivered/seen
- Retention: last 5 messages per chat, older deleted daily; media deleted daily regardless
- Profile pic visible only after acceptance
- Light/Dark mode with a neutral, single-accent design system
- Responsive layout (desktop icon rail + chat, mobile bottom nav + full-screen chat)
- Free tiers only (Cloudflare Pages + Supabase)

## Documentation
- [PRD](docs/PRD.md) - Product requirements
- [TODO](docs/TODO.md) - Phased task list
- [DOCUMENTATION](docs/DOCUMENTATION.md) - Full technical docs + session continuity
- [PHASE 3 SETUP](docs/PHASE3_SETUP.md) - Supabase setup, required inputs, and integration order

## Resume Work
See `docs/SESSION_RESUME.md` for instructions to reopen this session and continue.

## Safety Notice
This is a hobby project. We are not responsible for data leakage. Do not share sensitive personal information. Be a good neighbor.
