# KRAPP APP - Product Requirements Document (PRD)

## 1. Project Overview

**Project Name:** KRAPP APP

**Tagline:** Simple, no-frills chat app focused on 1:1 conversations with friends.

**Vibe:** WhatsApp-inspired - minimal, clean, functional. Avoid overstimulating UI elements or excessive data display.

**Target Audience:** Primarily teens (ages 11-17), but not limited to this. Anyone can use it.

**Purpose:** A personal/hobby project to chat with friends. Not intended for professional/work use.

**Status:** Planning phase (UI first, then UX, then realtime text).

## 2. Goals

- Build a fully working, usable MVP that is free to run indefinitely on free tiers.
- Simple 1:1 chat between accepted contacts.
- Username-based identity (user-chosen, unique). No OAuth.
- Contact system: add by username, send invite (with optional intro message), accept/reject.
- Real-time messaging with presence, typing indicators, read/delivered receipts.
- Respect free tier storage: keep only last 5 messages per chat; delete older messages daily. Delete media files regardless of the 5-message rule.
- Full responsive behavior (mobile and desktop treated equally).
- Light/dark mode with neumorphic style.
- Account management: editable profile fields (display name, username, email, avatar, bio), delete account option.
- Safety notice for users.

## 3. User Roles

- **Guest**: Not logged in - can only access signup/signin.
- **User (logged in)**: Can manage profile, add contacts (by username), send/accept/reject requests, chat with accepted contacts.

## 4. Authentication & User Profile

### Login
- Login using **username** and **password** only (no Google/GitHub OAuth).
- Email is collected at signup but **not** used for login.

### Signup
Required fields at signup:
- **Display Name** (shown to others)
- **Username** (chosen by user; must be unique; used for finding accounts)
- **Email** (for UUID/account identity purposes only; editable later in Profile, never shown to other users)
- **Password** (minimum 5 characters)

During signup, show a short warning: *"Email cannot be changed later."*

### Account Management (post-signup)
Users can edit:
- Display Name
- Username
- Profile Picture (optional upload)

Users **cannot** edit email.

Account deletion: **Delete Account** option available in profile/settings.

### Username Rules
- User chooses their own username (no auto-generation from email).
- Must be unique - prevent duplicates.
- Username is the discovery key for adding contacts.

### Profile Picture
- Optional. Users can upload/change their profile picture later.
- Profile picture is **only shown to contacts who have accepted the friend invite**.
- For users without profile picture (or before acceptance visibility rules), show a default avatar (like WhatsApp).
- Profile pictures are stored as media and deleted per media deletion policy.

## 5. Contacts & Social System

### Discovery
- Add contacts by **searching username only** (click "New Contact" button, type username, press Enter; results shown).
- No email search, no QR, no share link in MVP.

### Invite Flow
- User searches for a username and sends a friend/contact invite.
- **Intro message allowed once**: The sender may include **1 (and only 1)** message when sending the invite. This is shown to the recipient.
- After sending invite, conversation state is pending until accepted/rejected.
- **Messages cannot be exchanged until the invite is accepted** (except that single intro message from sender).
- Recipient sees pending invites (received) and can **Accept** or **Reject**.

### Contact States
- Pending (sent)
- Pending (received)
- Accepted (friends/contacts)
- Rejected (no re-engagement flow specified for MVP)

### Actions (MVP)
- Accept / Reject invites
- Delete conversation (with confirmation)
- Block is **not** included in MVP (deferred to later versions)

### Visibility
- Profile picture visible **only after acceptance**.
- Contact list shows accepted contacts.
- Pending requests section shows sent/received separately.

## 6. Messaging

### Chat Model
- **1:1 only** for MVP (no group chats).

### Conversation Rules
- Conversation exists conceptually when contact is accepted.
- Before acceptance: only sender’s single intro message is visible to recipient; no further messages.
- After acceptance: bidirectional realtime messaging allowed.

### Message Types (Phased)
- **Phase 3 (MVP focus)**: Text messages only. Validate and stabilize before adding media.
- **Phase 4 (later)**: Voice notes, images, files.

### Message Features (Realtime)
- **Online/Offline presence**
- **Typing indicators** (when other user is typing)
- **Message status**: Sent / Delivered / Seen (read receipts)

### Message Retention (Storage-Conscious)
- **Keep only last 5 messages per chat** (per conversation).
- **Delete older messages daily** (automation/cleanup approach to be implemented; details in tech plan).
- **Media files are deleted regardless of the 5-message rule** (applies to images, voice notes, files). 
- This is to keep free tier storage usage low.

### Message Interactions
- Basic text display; links clickable (yes). Emoji support (yes).
- Formatting: keep simple (no heavy markdown required unless minimal - but specified generally; follow WhatsApp-like simple).

## 7. Media (Phase 4)

### Images
- Formats: PNG, JPG, JPEG, GIF, WebP (as applicable)
- Compression needed (to save space)
- Max size: to be determined during implementation with free tier in mind (storage-conscious). Choose reasonable default.
- Preview in chat; allow download.

### Voice Notes
- Format: MP3
- Max duration: 1 minute
- Recording: Hold to record; swipe record button up to switch to "unhold" mode (then release or tap back to finish)
- Auto-deleted per daily cleanup? Media files deleted regardless of 5-msg rule - yes.
- Playback in chat.

### Files (general)
- Allow file attachments (preview where possible, allow download).
- Size limits: keep minimal to protect free tier.
- Delete per media deletion policy.

## 8. UI/UX Design

### Style
- **Neumorphism** (soft UI with subtle shadows, embossed/debossed elements)
- **Light/Dark mode** with smooth toggle
- System preference respected? (or manual toggle) - implement toggle; can default to system preference if easy.

### Layout
- **Desktop**: Split view - left sidebar (chats/contacts/requests) + right chat pane (WhatsApp-like)
- **Mobile**: Tab-style / stacked - chat list view (main) and when opening chat, navigate to chat screen; back to list. Match WhatsApp mobile behavior.
- Responsive equally for both.

### Typography
- Font: **Fira Sans** (or closest to WhatsApp’s typeface if not available; choose web-safe/Google Fonts alternative that matches feel)

### Icons
- Clean, modern icon set (Lucide preferred for shadcn compatibility if used).

### Components
- Use component library if helpful for consistent neumorphic look (shadcn/ui is acceptable if styled to neumorphism; or build custom). Prioritize good UX over heavy libs.

### UX Details
- Empty states with guidance
- Loading states, error handling
- Form validation (signup/signin)
- Smooth transitions where subtle
- Accessibility basics (labels, focus states)

## 9. Technical Requirements

### Frontend
- Vite + React + TypeScript
- Client-side routing
- Form handling, validation (tooling choice flexible; use what fits)
- State management: simple (Context API or lightweight store). Choose pragmatically.

### Backend/Data
- Supabase for Auth, Database (Postgres), Realtime
- Storage: Supabase Storage or Cloudflare R2. Choose whichever is better for this use case (free, easy, reliable). Document rationale.
- Row-Level Security (RLS) on all tables
- Schema designed for 1:1 + request flow + message retention

### Realtime
- Supabase Realtime for messages, typing, presence, read receipts
- Or custom WebSocket via Cloudflare Workers if needed; start simple with Supabase.

### Deployment
- Frontend: **Cloudflare Pages** (use *.pages.dev; no custom domain for MVP)
- Backend: Supabase (managed)
- Env vars managed properly (dev/prod separation if any; at least local + prod)

### Free-Only Constraint
- Everything must run on **free tiers only**. No paid features/services.

### Legal/Safety
- Add a simple disclaimer/notice in the app (footer or login screen):
  - "This is a hobby project. We are not responsible for data leakage. Do not share sensitive personal information. Be a good neighbor."
- Keep it minimal.

### Development
- Local dev: standard Vite (default port)
- Git repo (will be initialized in Phase 1)
- Documentation-first for continuity (this doc + others)

## 10. Success Criteria (MVP "Usable")

MVP is considered usable when:
1. User can signup/signin with username+password (profile editable, including email)
2. User can search username and send friend invite (with single intro msg)
3. Recipient can accept/reject invite
4. After acceptance, 1:1 realtime text messaging works (send/receive)
5. Online/offline, typing, delivered/seen work
6. Last 5 messages retained per chat; older purged daily (mechanism in place or planned; core logic present)
7. Media policy defined and storage locations configured (even if media UI comes in Phase 4, foundations ready)
8. Responsive UI works on mobile and desktop (WhatsApp-like layout)
9. Light/dark + neumorphic styling present
10. Account deletion available; profile pic visibility rules enforced
11. Free-tier only deployment possible

## 11. Out of Scope (MVP)
- Group chats
- Blocking (later)
- OAuth
- Custom domain
- End-to-end encryption (advanced)
- Push notifications beyond browser? (browser notifications optional; focus on core)
- Heavy moderation tools

## 12. Open Questions (To confirm during implementation if needed)
- Exact neumorphic color palette (light/dark tokens)
- Fira Sans loading (self-host vs Google Fonts)
- Supabase RLS details for media visibility
- Daily cleanup implementation (Supabase cron/edge function/worker) - approach
- Default avatar asset location
- "Unhold" recording UX exact timing/feedback
- Max image size exact number (KB/MB) balancing UX vs storage

But the plan is to proceed without guessing - document decisions as made.

## 13. References
- WhatsApp UX patterns (layout, presence, states)
- Neumorphic design principles
- Supabase free tier limits (auth, db, realtime, storage)
- Cloudflare Pages free tier
