# Session Resume Instructions

To continue working on KRAPP APP in a new session, use the following.

## 1) Reopen this exact session (if available)
If the same OpenCode session is still accessible, reopen it. Otherwise, start a fresh session in the same repo directory.

Repo directory: `E:\KRAPP-APP` (workspace root as per environment).

## 2) Context to load (read these files in order)
Start by reading these files to restore full context:
1. `docs/DOCUMENTATION.md` - Complete project state, decisions log, session log, schema plan
2. `docs/PRD.md` - Requirements
3. `docs/TODO.md` - Current todo list (Phase 1)
4. `README.md` - Quick overview

Also skim any files added later (`docs/migrations/*`, etc.) if they exist.

## 3) Prompt to give the agent
Copy/paste this entire prompt to the agent to continue/start implementation.

```text
You are continuing work on KRAPP APP (repo: E:\KRAPP-APP).

Context:
- Read docs/DOCUMENTATION.md, docs/PRD.md, docs/TODO.md, README.md fully.
- Project: WhatsApp-like 1:1 chat app, neumorphic light/dark, username-based invites, free tiers only (Cloudflare Pages + Supabase).
- Rules: username+password login only, profile editable (incl. email), profile pic only after acceptance, single intro msg on invite, keep last 5 msgs per chat (daily purge), media deleted daily regardless, 1:1 MVP.
- Current phase: Phase 1 (UI Foundation). Start from TODO.md Phase 1.1 onward.

Goal: Continue implementation in order (UI -> UX -> Realtime Texting -> Media). Don't guess - ask if any ambiguity. Update docs as you go (DOCUMENTATION.md decisions log, TODO.md checkboxes).

Start by confirming current state (files present) and begin Phase 1.1.
```

## 4) Quick verification
- Confirm working directory is `E:\KRAPP-APP`
- Git repo: currently "no" (per env). Phase 1 will initialize.
- Platform: win32
- No code built yet (planning complete)

## Notes
- Keep changes small and consistent with neumorphic style.
- Maintain session continuity via docs.
- Free tiers only - respect constraints.
