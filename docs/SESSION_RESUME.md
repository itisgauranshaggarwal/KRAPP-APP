# Session Resume Instructions

To continue working on KRAPP APP in a new session, use the following.

## 1) Reopen this exact session (if available)
If the same OpenCode session is still accessible, reopen it. Otherwise, start a fresh session in the same repo directory.

Repo directory: `E:\KRAPP-APP` (workspace root as per environment).

## 2) Context to load (read these files in order)
1. `docs/DOCUMENTATION.md` — full project state, **§15 Decisions Log**, **§16 Known Issues**, **§17 Session Log** (read Session 4 and Session 5 in particular)
2. `docs/TODO.md` — Phase 2 is complete (see its "Phase 2 notes"); Phase 3 is next
3. `docs/PRD.md` — requirements
4. `README.md` — quick overview

Also: `.21st/design.json` (design constraints + decisions) and `src/index.css` (the "Quiet Ink" token system) are the references for any visual work.

## 3) Current state (as of end of Session 5)

- **Phase 1 (UI foundation):** done.
- **Phase 2 (UX polish & flows):** implemented and verified — route guards, mock session, validation, toasts, loading/empty states, focus trap/a11y, mobile transitions.
- **Git:** repo exists (`master`). The "Quiet Ink" redesign is committed (`2e857c7`). **Phase 2 code+docs were being committed at the end of Session 5** — run `git log --oneline -3` and `git status` first to see whether that commit landed; commit anything still pending.
- **Verification status:** `tsc -b` ✅, `npm run build` ✅, `npm run lint` ✅ (clean). Design audit ✅. Functional flow harness: 14/17 on the first run; the 3 failures were harness bugs that were fixed but the confirming re-run was interrupted — **re-run it first thing**.
- **Nothing is pushed** to a remote yet.

## 4) First steps next session (in order)

1. **Re-run the functional flow harness** (needs a preview server on 4180):
   ```powershell
   # from E:\KRAPP-APP
   npm run build
   npx vite preview --port 4180 --strictPort   # leave running in a background shell
   node "C:\Users\Legen\AppData\Local\Temp\opencode\flow.mjs" http://localhost:4180 "C:\Users\Legen\AppData\Local\Temp\opencode"
   ```
   Expect 17/17. (If `vite build` fails with `ENOTEMPTY ... dist\assets`, stop the preview server first.)
2. **Re-run the design audit** after any UI change:
   ```powershell
   node "C:\Users\Legen\AppData\Local\Temp\opencode\audit.mjs" http://localhost:4180 "C:\Users\Legen\AppData\Local\Temp\opencode"
   ```
   Note: both scripts live in the temp dir and are **not** committed — if they are gone, re-create them or ask the user; they seed `localStorage['krapp.session']` so guarded routes render.
3. **Ask the user for visual sign-off** on Phase 2 (toasts, skeletons, dialogs, the auth guard flow). The user's own Vite dev server normally holds port 5173.
4. Commit any pending work, then **start Phase 3** at `docs/TODO.md` §3.1 (Supabase project, env vars, schema + RLS, then replace the mock auth/actions).

## 5) Prompt to give the agent
Copy/paste this to continue:

```text
You are continuing work on KRAPP APP (repo: E:\KRAPP-APP).

Context:
- Read docs/DOCUMENTATION.md (§15 Decisions, §16 Known Issues, §17 Session Log — especially Session 4 and 5),
  docs/TODO.md (Phase 2 is done; its notes describe what was built), docs/PRD.md, README.md.
- Project: WhatsApp-like 1:1 chat app. Design system is "Quiet Ink" (neutral surfaces, ONE petrol-teal
  accent, hairlines, no gradients/glass/neumorphism), light/dark, Fira Sans, mobile-first.
  Free tiers only (Cloudflare Pages + Supabase).
- Rules: username+password login only, profile editable (incl. email), profile pic only after acceptance,
  one optional intro message per invite, keep last 5 messages per chat (daily purge), media deleted daily, 1:1 MVP.
- Phase 1 and Phase 2 are complete. Phase 2 added: mock session + route guards (src/lib/session.tsx,
  src/components/layout/RouteGuards.tsx), a toast store (src/lib/toast.ts + ui/Toast.tsx), async mock
  actions with simulated latency, isReady list skeletons, a Modal focus trap, skip link, mobile slide transitions.
- Verified: tsc -b, npm run build, npm run lint all pass; design audit passes. The functional flow harness
  (flow.mjs) passed 14/17 on its first run and was fixed but not re-run.

Goal (in order):
1. Re-run the flow harness and the design audit; fix anything that fails.
2. Ask the user for visual sign-off of Phase 2.
3. Commit pending work (repo uses author "KRAPP Dev" <dev@krapp.app>).
4. Begin Phase 3 (docs/TODO.md §3.1): Supabase project + env vars, DB schema + RLS, then swap the mock
   auth in src/lib/session.tsx for Supabase Auth and delete the simulated `wait(...)` latencies.

Rules: preserve all existing features/routing; keep changes consistent with surrounding code; update
docs/DOCUMENTATION.md (decisions + session log) and docs/TODO.md as you go. Ask if anything is ambiguous.
```

## 6) Quick verification
- Working directory: `E:\KRAPP-APP`; platform: win32.
- `git config --global --add safe.directory E:/KRAPP-APP` may be needed (dubious-ownership).
- PowerShell quirks: no heredocs; `git -c "user.name=KRAPP Dev" ...` splits on the space — use
  `git -c "user.name=KRAPP Dev" -c "user.email=dev@krapp.app" commit -F <file>` with the message written via
  `[System.IO.File]::WriteAllText($p,$t,(New-Object System.Text.UTF8Encoding($false)))` to avoid a BOM.
- npm installs are slow/flaky on this machine (see DOCUMENTATION §16).

## Notes
- Keep changes small and consistent with the "Quiet Ink" design system (DOCUMENTATION §5; constraints + decisions in `.21st/design.json`).
- `prompt.txt` in the repo root is the user's own file — do not modify it.
- Free tiers only — respect constraints.
- Maintain session continuity via docs (this file, TODO.md, DOCUMENTATION.md).
