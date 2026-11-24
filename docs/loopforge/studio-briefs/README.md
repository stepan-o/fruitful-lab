# Maintained studio briefs

This is the authored source for the owner-directed Codex studio. The older `docs/loopforge/studio/` directory remains an archive of the former autonomous studio; do not import its operating rules into these briefs.

Public entry: `/stepanoskin/loopforge/design#studio`. General instructions: `/stepanoskin/loopforge/design/studio`. Each role has `/stepanoskin/loopforge/design/studio/<role-id>` and a downloadable Markdown copy. The plain design route opens the Loopforge AI Lab proposal, the first board tab. The explicit `#studio` link remains the agent onboarding entry; existing hashes keep their destinations.

## Maintain

Edit `general.md` for shared workflow, the named role's Markdown for its mandate/references/current handoff, and `roles.json` for card metadata and the last-maintained date. PRODUCER maintains the brief set with specialist contributions and craft review; coordinate with active editors. The owner opens top-level chats, authorizes supervised delegation, decides whether to iterate or ship, and validates gameplay. `dev-blog.md` is the current journal index and links the frozen prior publications. Applied book concepts require verified chapter/page references plus the concrete application; the local PDF is never copied into public output.

PRODUCER's onboarding package is `producer.md`, `producer-reading.md` and `producer-playbook.md`, published at the corresponding studio routes. The latter two are documentation companions, registered in `COMPANIONS` in the generator and the exact rewrite allowlist. They are not extra roles and do not receive launch prompts. The three pages share package navigation and downloadable source copies.

Run `python docs/loopforge/game-design/build_board.py` from the repository root to regenerate the board and all brief pages. For a role-only update, `python docs/loopforge/game-design/studio_briefs.py` regenerates standalone pages and downloads; run the full board build as well when card metadata or the landing design changes. Commit intended source and generated outputs together.

For a scoped role/card addition with no other board changes, `python docs/loopforge/game-design/studio_briefs.py --refresh-board` regenerates briefs and replaces only the existing Studio panel with the same generated overview used by the full build. It fails if that panel is absent or duplicated. Use the full generator when board structure, styles or other sections change.

MUSIC DIRECTOR's package is `music-director.md`, `music-study.md` and `music-production.md`; the companions are role readings, not extra specialists. Its first commissioned publication is a future `#music-engine` tab immediately after Studio briefs. The onboarding package does not implement that tab or an audio runtime. The role owns music-side input stubs, audio clearance and budget; ENGINE supplies the later authoritative adapter.

UI DESIGNER's package is `ui-designer.md`, `ui-reading.md` and `ui-first-assignment.md`. The companions are registered in `ROLE_READINGS` and the route allowlist. Its first commission is an annotated interface audit and static visual studies, with desktop and phone designed equally; implementation ownership is explicitly undecided. The onboarding package adds the role and references, not a completed UI audit or runtime redesign.

The generator uses the existing small narrative Markdown renderer. Links are explicit public paths or HTTPS references. Shared CSS/JS are served under `/loopforge-design/studio/`; the only new browser behavior copies a starting prompt and provides selection/download fallback.

## Add a role

AI ARCHITECT's public package is `ai-architect.md`, covering studio providers/execution/observability/evaluations and local dialogue/BDI architecture. Its first assignment starts with an interview, followed by an owner-approved plan and private SECURITY review. The owner-approved machine specification is public capacity-planning context, not a benchmark. The public SECURITY package is `security.md`, its generated role page and its starting prompt. It records the mandate, operating guide and owner-cleared milestones. Publish standard security practices or facts trivially observable on the public system. Keep private operational evidence and the private handoff outside the repository and all generated outputs.

PRODUCER proposes a focused role when an actual production gap calls for it. After owner commissioning, add its Markdown brief and a `roles.json` entry, then add its ID to the exact studio rewrite allowlist in `apps/lab/next.config.ts`. Regenerate and verify its page, references, downloads and prompt. Give the owner the task-specific prompt to open the chat. Do not add roles as an autonomous organization chart.

## Verify

Check the default AI Lab tab, the explicit Studio briefs entry, all old design hashes, direct role routes, shared instructions, journal, source downloads, copy/fallback, keyboard use and narrow viewports. Run relevant repository checks and verify the hosted preview. Role pages are readable without JavaScript. No existing game runtime, approved script, geometry, timing, media pack or frozen retrospective is changed by this feature.
