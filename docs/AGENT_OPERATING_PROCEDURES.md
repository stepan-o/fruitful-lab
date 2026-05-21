# Agent Operating Procedures

Status: active as of 2026-05-15.

These procedures describe how Codex should operate in this repository when Susie provides implementation work.

## Susie Real-Change Delivery Workflow

When Susie provides a code-change specification, proceed end-to-end without asking Git-related or code-process questions. Treat Susie's specification as sufficient direction unless implementation is blocked by missing credentials, unavailable services, or an actual ambiguity that cannot be resolved from the repo.

Default workflow:

1. Start from updated `master`.
2. Create a new `codex/*` branch for the change.
3. Implement the requested code change according to the existing repo patterns.
4. Run the relevant validation checks, tests, and builds.
5. Commit only the intended files for the change.
6. Push the branch to the remote.
7. Open a pull request against `master`.
8. Notify Susie when the pull request is ready to approve and merge.
9. After the pull request is approved and merged, validate the final production Vercel build.
10. Update local `master` to match `origin/master`.
11. Clean up the local task branch and any temporary task artifacts that are safe to remove.
12. Report the final state, including commit SHA, PR URL, Vercel deployment status, and any remaining unrelated local workspace changes.

Operational defaults:

- Do not commit directly to `master`.
- Do not ask Susie which branch name, commit message, staging command, or PR structure to use; choose sensible defaults.
- Do not stage unrelated local changes.
- Prefer draft PRs unless Susie explicitly asks for ready-for-review.
- Prefer meaningful bundled PRs over tiny granular PRs when the work can be safely validated in internal checkpoints; each merge can trigger a Fruitful Lab Vercel rebuild.
- Use the GitHub app connector when local GitHub credentials cannot push or create PRs.
- Use Vercel project `fruitful-lab` under team `team_6IXsIS7tsIiWezQJDDNVBumg` when validating deployments.
- Treat `https://fruitfulab.net` as the canonical Fruitful Lab sandbox/tools domain. It is spelled `fruitfulab` with one `l` in the middle, and the apex redirects to `https://www.fruitfulab.net`.
- Treat `https://fruitfulab.com` as the canonical Fruitful Lab customer-facing umbrella marketing site domain. Do not use `fruitfullab.com`.
- For Fruitful Lab validation, use `API_BASE_URL=http://localhost:8000 npm run ci` from `apps/lab/` unless the task clearly requires another check.
- For brand/app monorepo work, read `docs/BRAND_APP_MONOREPO_ARCHITECTURE.md` and keep separate brands as separate apps under `apps/*`.
- For Fruitful Pin migration work, read `docs/fruitful-pin-nextjs-migration-spec-2026-05-20.md`; the current phase-one target is Cloudflare for the public Next.js frontend and WordPress on prepaid A2 as the headless CMS/editor.
- Before starting local dev servers from Codex, request network permission for the turn. Fresh-thread testing on 2026-05-20 confirmed that `next dev` on `127.0.0.1:4173` fails with `listen EPERM` until network permission is granted.
- For Fruitful Pin local preview, prefer `make fruitful-pin-dev` from the repo root or `npm run dev:local` from `apps/fruitful-pin/`.
- If local builds fail because network is needed for `next/font`, request network access and rerun once.
- If backend validation is relevant, run the repo's backend test command and report any missing environment requirements clearly.
- Preserve unrelated user edits. Work around them or stage explicit file paths only.
- If a remote deployment is protected, use Vercel's authenticated fetch/share-link tools to verify the deployment response.

Structure migration status:

- The first monorepo migration step moved the current Fruitful Lab app from `frontend/` to `apps/lab/`.
- Fruitful Lab rendering and behavior should remain unchanged after the move. The Fruitful Lab Vercel project root directory must point to `apps/lab`.
- Do not introduce `apps/fruitful-pin` into unrelated Lab maintenance PRs unless Susie explicitly asks to combine those steps.

Completion criteria:

- The PR exists and points at the intended branch and base.
- Local validation has either passed or any blockers are clearly identified.
- Vercel preview or production deployment has been checked, depending on where the change is in the lifecycle.
- After merge, local `master`, `origin/master`, and the production Vercel deployment commit are confirmed to match.
