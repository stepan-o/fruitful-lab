# Monorepo Parallel Workflow

Status: active discipline for parallel brand/app work as of 2026-05-22.

This repo intentionally remains a monorepo. Multiple brand apps can be developed in parallel, but each active workstream must be isolated so unfinished local edits do not leak across projects.

## Brand And App Map

| App path | Brand / domain | Status |
| - | - | - |
| `apps/lab/` | Fruitful Lab sandbox/tools at `https://fruitfulab.net` | Live Vercel sandbox app |
| `apps/fruitful-pin/` | Fruitful Pin at `https://fruitfulpin.com` | Active migration target |
| `apps/fruitful-lab-site/` | Fruitful Lab customer site at `https://fruitfulab.com` | Future public site, not live yet |
| `apps/bloom-whispers/` | Bloom Whispers at `https://bloomwhispers.com` | Future site, not live yet |
| `apps/bricoli/` | Bricoli | Future site |

Do not infer that a change is safe because a site is not live. Non-live apps still need clean Git history and preserved work.

## Core Rule

One repo is fine. One shared dirty folder is not.

Parallel threads must use separate Git branches and preferably separate Git worktree folders. The main checkout must not be used as a shared scratchpad across brands.

## Required Startup Check

Before editing files, every thread must run and report:

```bash
pwd
git branch --show-current
git status --short --branch
git log -1 --oneline
git worktree list
```

Then the thread must state:

- assigned app/brand,
- allowed file scope,
- whether the current folder is the correct worktree,
- whether any dirty files belong to another app.

If dirty files from another app appear, stop. Do not edit, stash, reset, clean, or commit until the owner confirms preservation.

## Worktree Discipline

Recommended stable worktree root:

```txt
/Users/susycidduque/Documents/repos/worktrees/
```

Recommended worktree layout:

```txt
/Users/susycidduque/Documents/repos/fruitful-lab
  main checkout; coordination only unless explicitly assigned

/Users/susycidduque/Documents/repos/worktrees/fruitful-pin
  apps/fruitful-pin work

/Users/susycidduque/Documents/repos/worktrees/fruitful-lab-site
  apps/fruitful-lab-site work

/Users/susycidduque/Documents/repos/worktrees/bloom-whispers
  apps/bloom-whispers work

/Users/susycidduque/Documents/repos/worktrees/lab
  apps/lab work when the live sandbox app needs changes
```

Create a new project worktree from an updated `master`:

```bash
cd /Users/susycidduque/Documents/repos/fruitful-lab
git switch master
git pull --ff-only origin master
mkdir -p /Users/susycidduque/Documents/repos/worktrees
git worktree add -b codex/<project-task-name> /Users/susycidduque/Documents/repos/worktrees/<project-folder> master
```

Use an existing branch in a new worktree:

```bash
cd /Users/susycidduque/Documents/repos/fruitful-lab
mkdir -p /Users/susycidduque/Documents/repos/worktrees
git worktree add /Users/susycidduque/Documents/repos/worktrees/<project-folder> <existing-branch>
```

## Allowed Scopes

Fruitful Pin work:

- Allowed: `apps/fruitful-pin/**`, `docs/brands/fruitful-pin/**`, `docs/fruitful-pin-nextjs-migration-spec-2026-05-20.md`
- Usually not allowed: `apps/fruitful-lab-site/**`, `apps/bloom-whispers/**`, `apps/lab/**`

Fruitful Lab customer-site work:

- Allowed: `apps/fruitful-lab-site/**`, `docs/brands/fruitful-lab-site/**`
- Usually not allowed: `apps/fruitful-pin/**`, `apps/bloom-whispers/**`, `apps/lab/**`

Bloom Whispers work:

- Allowed: `apps/bloom-whispers/**`, `docs/brands/bloom-whispers/**`
- Usually not allowed: `apps/fruitful-pin/**`, `apps/fruitful-lab-site/**`, `apps/lab/**`

Fruitful Lab sandbox work:

- Allowed: `apps/lab/**`, `backend/**` when relevant, `docs/brands/lab/**` if added later, and shared platform docs when relevant
- Usually not allowed: other brand app folders

Shared files such as `Makefile`, `AGENTS.md`, `docs/PROJECT_MEMORY.md`, `docs/REPO_GROUNDING_PACK.md`, or `packages/**` may be changed only when the PR explicitly states why the shared change is needed.

## Staging And Commit Rules

- Never use `git add .` in this repo.
- Stage explicit files or app-scoped paths only.
- Every PR must state its app/brand scope and intentionally excluded apps.
- If the branch name and dirty file scope disagree, stop and reconcile before editing.
- Do not commit directly to `master`.
- Preserve unrelated user or thread edits. Do not reset, delete, or clean them without explicit preservation confirmation.

## Stash And Cleanup Rules

Use stash only as a preservation tool, not as a substitute for branch/worktree discipline.

Before stashing another app's changes:

1. Identify the app owner/workstream.
2. Confirm whether the same work is preserved in its correct worktree, branch, commit, PR, patch, or explicit stash.
3. Use an explicit stash message that includes the app and reason.
4. Run `git status --short --branch` afterward.

Never run broad cleanup commands such as `git reset --hard`, `git checkout --`, or `git clean` unless Susy explicitly approves after preservation is confirmed.

## PR Template Expectations

Every PR should include:

- App/brand scope.
- Branch/worktree used.
- Files intentionally changed.
- Apps intentionally excluded.
- Validation run.
- Whether it affects a live deployment.
- Any required follow-up after merge.

Example:

```txt
Scope: Fruitful Pin only
Allowed files touched:
- apps/fruitful-pin/**
- docs/brands/fruitful-pin/**

Intentionally excluded:
- apps/fruitful-lab-site/**
- apps/bloom-whispers/**
- apps/lab/**

Validation:
- npm test from apps/fruitful-pin
- npm run build from apps/fruitful-pin
```

## Merge Awareness

Each worktree branch starts from some point in `master`. Other PRs may merge while a thread is working. A thread does not see another thread's uncommitted edits, and it will not automatically include newly merged PRs until it updates from `master`.

Before a long-running branch opens or refreshes a PR:

```bash
git fetch origin --prune
git status --short --branch
```

If the branch needs latest `master`, coordinate whether to merge/rebase. Avoid casual rebases on branches that other threads or PRs are already using.

## Kickoff Prompt Template

Use this at the start of every new project thread:

```text
Read and follow the monorepo parallel workflow before editing:
- AGENTS.md
- docs/MONOREPO_PARALLEL_WORKFLOW.md
- docs/AGENT_OPERATING_PROCEDURES.md
- docs/REPO_GROUNDING_PACK.md
- docs/PROJECT_MEMORY.md
- docs/CANONICAL_DOMAINS.md

First, do not edit. Report:
pwd
git branch --show-current
git status --short --branch
git log -1 --oneline
git worktree list

Then confirm:
1. assigned app/brand,
2. correct worktree folder,
3. allowed file scope,
4. dirty files, if any,
5. whether any dirty files belong to another app.

If the folder, branch, or dirty files do not match the assigned app, stop and ask for coordination.
```

## Project Kickoff Prompts

### Fruitful Pin

```text
You are the Fruitful Pin thread.

Assigned app:
apps/fruitful-pin

Brand/domain:
Fruitful Pin / fruitfulpin.com

Use a dedicated Fruitful Pin worktree or a clean checkout explicitly reserved for Fruitful Pin. Do not use a shared dirty main checkout.

Allowed scope:
- apps/fruitful-pin/**
- docs/brands/fruitful-pin/**
- docs/fruitful-pin-nextjs-migration-spec-2026-05-20.md when directly relevant

Do not touch unless explicitly coordinated:
- apps/fruitful-lab-site/**
- apps/bloom-whispers/**
- apps/lab/**

Before editing, run:
pwd
git branch --show-current
git status --short --branch
git log -1 --oneline
git worktree list

Then read:
- AGENTS.md
- docs/MONOREPO_PARALLEL_WORKFLOW.md
- docs/brands/fruitful-pin/README.md
- docs/brands/fruitful-pin/second-pass-prep-2026-05-22.md

If dirty files from another app appear, stop and report.
```

### Fruitful Lab Customer Site

```text
You are the Fruitful Lab customer-site thread.

Assigned app:
apps/fruitful-lab-site

Brand/domain:
Fruitful Lab customer site / fruitfulab.com

This is separate from apps/lab, which is the fruitfulab.net sandbox/tools app.

Use a dedicated Fruitful Lab customer-site worktree. Do not use the main checkout if it is assigned to another project.

Allowed scope:
- apps/fruitful-lab-site/**
- docs/brands/fruitful-lab-site/**

Do not touch unless explicitly coordinated:
- apps/fruitful-pin/**
- apps/bloom-whispers/**
- apps/lab/**

Before editing, run:
pwd
git branch --show-current
git status --short --branch
git log -1 --oneline
git worktree list

Then read:
- AGENTS.md
- docs/MONOREPO_PARALLEL_WORKFLOW.md
- docs/brands/fruitful-lab-site/README.md

If dirty files from another app appear, stop and report.
```

### Bloom Whispers

```text
You are the Bloom Whispers thread.

Assigned app:
apps/bloom-whispers

Brand/domain:
Bloom Whispers / bloomwhispers.com

Use a dedicated Bloom Whispers worktree. Do not use the main checkout if it is assigned to another project.

Allowed scope:
- apps/bloom-whispers/**
- docs/brands/bloom-whispers/**

Do not touch unless explicitly coordinated:
- apps/fruitful-pin/**
- apps/fruitful-lab-site/**
- apps/lab/**

Before editing, run:
pwd
git branch --show-current
git status --short --branch
git log -1 --oneline
git worktree list

Then read:
- AGENTS.md
- docs/MONOREPO_PARALLEL_WORKFLOW.md
- docs/brands/bloom-whispers/README.md

If dirty files from another app appear, stop and report.
```

### Fruitful Lab Sandbox

```text
You are the Fruitful Lab sandbox/tools thread.

Assigned app:
apps/lab

Brand/domain:
Fruitful Lab sandbox/tools / fruitfulab.net

This app is live on Vercel. Be extra careful with validation and post-merge production checks.

Allowed scope:
- apps/lab/**
- backend/** when directly relevant
- shared platform docs when directly relevant

Do not touch unless explicitly coordinated:
- apps/fruitful-pin/**
- apps/fruitful-lab-site/**
- apps/bloom-whispers/**

Before editing, run:
pwd
git branch --show-current
git status --short --branch
git log -1 --oneline
git worktree list

Then read:
- AGENTS.md
- docs/MONOREPO_PARALLEL_WORKFLOW.md
- docs/AGENT_OPERATING_PROCEDURES.md
- docs/REPO_GROUNDING_PACK.md
- docs/PROJECT_MEMORY.md

If dirty files from another app appear, stop and report.
```
