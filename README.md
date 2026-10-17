# KRAPP APP

Simple 1:1 chat app with username-based invites, realtime messaging, light/dark mode, and a soft neumorphic UI. Built as a free-tier-only hobby project.

## Project Status
**Phase 1 (UI Foundation) complete, plus a brand/UI polish pass.** The full UI runs on mock data: auth screens, chats, requests, contacts, profile, light/dark theme, responsive layout. Backend wiring starts in Phase 3.

**Brand:** own identity — "Grape" violet `#7C5CFF` + "Sunset" coral `#FF5C7F` on lavender-grey surfaces (deliberately not a WhatsApp-green clone). Design tokens live in `src/index.css`.

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
- (Phase 1 = UI only, mock data)
- Add contacts by username only, with single intro message on invite
- Accept/Reject invites
- 1:1 chat: text, presence, typing, sent/delivered/seen
- Retention: last 5 messages per chat, older deleted daily; media deleted daily regardless
- Profile pic visible only after acceptance
- Light/Dark mode with neumorphism (own violet/coral brand system)
- Responsive layout (desktop icon rail + chat, mobile bottom nav + full-screen chat)
- Free tiers only (Cloudflare Pages + Supabase)

## Documentation
- [PRD](docs/PRD.md) - Product requirements
- [TODO](docs/TODO.md) - Phased task list
- [DOCUMENTATION](docs/DOCUMENTATION.md) - Full technical docs + session continuity

## Resume Work
See `docs/SESSION_RESUME.md` for instructions to reopen this session and continue.

## Safety Notice
This is a hobby project. We are not responsible for data leakage. Do not share sensitive personal information. Be a good neighbor.
