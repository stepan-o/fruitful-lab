# Maintained studio briefs

This is the authored source for the owner-directed Codex studio. The older `docs/loopforge/studio/` directory remains an archive of the former autonomous studio; do not import its operating rules into these briefs.

Public entry: `/stepanoskin/loopforge/design#studio`. General instructions: `/stepanoskin/loopforge/design/studio`. Each role has `/stepanoskin/loopforge/design/studio/<role-id>` and a downloadable Markdown copy. The plain design route now opens Studio briefs; explicit existing hashes keep their destinations.

## Maintain

Edit `general.md` for shared workflow, the named role's Markdown for its mandate/references/current handoff, and `roles.json` for card metadata and the last-maintained date. Each specialist owns its own brief. `dev-blog.md` is the current journal index and links the frozen prior publications. Applied book concepts require verified chapter/page references plus the concrete application; the local PDF is never copied into public output.

Run `python docs/loopforge/game-design/build_board.py` from the repository root to regenerate the board and all brief pages. For a role-only update, `python docs/loopforge/game-design/studio_briefs.py` regenerates standalone pages and downloads; run the full board build as well when card metadata or the landing design changes. Commit intended source and generated outputs together.

The generator uses the existing small narrative Markdown renderer. Links are explicit public paths or HTTPS references. Shared CSS/JS are served under `/loopforge-design/studio/`; the only new browser behavior copies a starting prompt and provides selection/download fallback.

## Add a role

Add a focused Markdown brief and a `roles.json` entry, then add its ID to the exact studio rewrite allowlist in `apps/lab/next.config.ts`. Regenerate and verify its page, references, downloads and prompt. Do not add roles as an autonomous organization chart; add them when the owner commissions them.

## Verify

Check the default Studio tab, all old design hashes, direct role routes, shared instructions, journal, source downloads, copy/fallback, keyboard use and narrow viewports. Run relevant repository checks and verify the hosted preview. Role pages are readable without JavaScript. No existing game runtime, approved script, geometry, timing, media pack or frozen retrospective is changed by this feature.
