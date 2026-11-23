# Loopforge delivery checklist

Started 2026-10-03. Owner approved autonomous implementation, research, redesign
of legacy implementation choices, visual iteration and a small hosted live demo.
This checklist is the execution record. Unchecked means unfinished.

This is the historical presentation and eight-shift teaching-demo checklist.
The current one-day prototype and the owner-requested asset-driven interface
revision are tracked in [FIRST_SHIFT_CHECKLIST.md](FIRST_SHIFT_CHECKLIST.md).
Its decision interfaces must carry the core loop before the later live 3D
factory view. Completed checks here do not establish acceptance of that UI.

## Brief and boundaries

Build two illustrated, interactive presentations inside the Stepanoskin routing
group: **Loopforge overview** and **Engine architecture for LLM-enabled narrative**.
Carry their components and a shared example into a playable factory demo.
Use the current Stepanoskin landing as the entrance; defer its broader rebuild.
The moving conveyor is a recurring physical element throughout the experience.

Quality reference: the locally approved Sanctuary opening and its design system,
including calm serif reading, coherent illustrated worlds, meaningful controls,
restrained motion, accessible still states, and deliberately composed diagrams.
Use existing owner-supplied Loopforge art. Curate, optimize and document provenance.
No blanket adoption of older game rules or architectural claims.

Worktree: `/home/stpn/.codex/worktrees/loopforge-presentations/fruitful-lab`.
Branch: `codex/loopforge-presentations`, initially based on
`codex/sanctuary-opening-thesis`, rebased onto published `master` at `463e1cb`.
Allowed scope: Loopforge routes, components, libraries, API handlers, assets and
tests under `apps/lab`; Stepanoskin menu integration; directly relevant docs.
Other apps, unrelated backend services, and ongoing Sanctuary edits are excluded.
Latest uncommitted Sanctuary references are copied to `/tmp/loopforge-sanctuary-reference`;
the source checkout remains untouched. No cross-app imports or speculative packages.

## 1. Evidence, design and technical decisions

- [x] Read repository memory, Sanctuary design system, Loopforge code and design docs.
- [x] Identify legacy drift; verify six days of the Python engine with reproducible hashes.
- [x] Create isolated worktree and preserve current visual references.
- [x] Review current primary documentation for rendering, runtime, model and hosting choices.
- [x] Record decision matrix and Rust-native design contract, with source links.
- [x] Select source art and publish an optimized, versioned Loopforge asset pack.
- [x] Finalize chapter claims, demonstration data, status labels and content ownership.

## 2. Presentation foundation

- [x] Build responsive Loopforge shell, shared navigation and chapter direct links.
- [x] Add conveyor with coherent mechanics, motion preference, visibility suspension and still state.
- [x] Integrate both presentations into the existing entrance menu.
- [x] Implement art inspection, source notes, readable typography and mobile controls.
- [x] Keep server-rendered content useful before client interaction.

## 3. Representative chapters, then full presentations

- [x] Finish overview opening and one-shift exhibit.
- [x] Finish architecture opening and command-to-story exhibit using the same example.
- [x] Review desktop/mobile screenshots against Sanctuary; record critiques and corrections.
- [x] Complete overview: premise, player role, cast, rooms, shift, conflicts, economy, replay.
- [x] Complete architecture: authority, data/ownership, commands, determinism, protocol,
      narrative, failure/budgets, renderer choices, Rust portability, deployment and learning.
- [x] Distinguish legacy implementation, this demo, illustrative models and future work.
- [x] Verify direct links, keyboard controls, dialogs, motion, content and all exhibit families.

## 4. Playable vertical slice

- [x] Record bounded game rules and engine version. Preserve premise and recognizable cast.
- [x] Implement pure deterministic kernel with explicit IDs, integer arithmetic, seeded RNG,
      typed commands/results, validated transitions and replayable command history.
- [x] Add server-authoritative run handling with isolation and bounded payloads/history.
- [x] Build player console: staffing doctrine, shift resolution, choices, recap and restart.
- [x] Implement the OpenAI narration adapter from structured committed events; validate outputs,
      separate it from mechanics, show provenance and degrade honestly on provider failure.
- [x] Configure provider credentials and approved spending limit; verify a real provider call.
- [x] Verify replay parity, invalid commands, cross-session isolation, mocked exhausted budgets,
      timeout/error recovery, game end, reset and keyboard/mobile behavior.

## 5. Delivery

- [x] Run focused engine/API/component tests, lint, asset checks and required Lab CI/build.
- [x] Visually inspect every chapter at desktop and narrow widths; complete a desktop run and mobile order flow.
- [x] Inspect time-separated motion/still frames; test reduced-motion lifecycle and fix quality defects.
- [x] Update project memory, architecture decisions, provenance and operational setup.
- [x] Commit only explicit scoped files; push and open draft PR against master.
- [x] Verify hosted preview, real simulation and live narration; attach PR and share URLs.
- [x] Record remaining limitations without marking incomplete work done.

## Completion bar

Both presentations have complete content and purposeful interactions. The demo
supports a complete bounded run, with consequences driven by the engine and a
real model connection verified on the hosted environment. No fake live badges,
silent synthetic narration, placeholder assets or unsupported performance claims.
Visual review includes desktop, mobile, inspector, motion and still states.
Current user approval covers implementation and a reviewable preview; repo merge
and production promotion follow the repository delivery workflow.

## Open dependencies

- Provider selected: OpenAI. Owner approved a $1 total model-testing allocation.
  Preview settings are configured. Two six-case passes cost an estimated $0.0039968;
  reservations total $0.024952. See `LIVE_EVALUATION.md` for defects and limitations.
- An existing `OPENAI_API_KEY` was found in Vercel Preview settings, without
  revealing its value. It is verified with this adapter.
- The free Upstash quota store is provisioned and connected to Preview. The owner
  added the private access code and redeployed; its Secret/Preview scope is verified.
- Local Git push has no credential; publication uses the connected GitHub app.
  Artwork publication was explicitly approved after automatic approval review
  requested exact public-destination authorization. Complete implementation
  publication and Upstash Marketplace terms are now explicitly approved.
- Legacy contract check: 21 live-input tests ran, 10 failed; newer end-of-day tests
  passed 4/4. Do not describe the legacy test suite as passing.

## Published delivery

- [Draft PR #52](https://github.com/stepan-o/fruitful-lab/pull/52).
- [Hosted overview](https://fruitful-lab-git-codex-loopforge-f32bcf-stepan-oskins-projects.vercel.app/stepanoskin/loopforge/overview/the-factory).
- [Hosted architecture](https://fruitful-lab-git-codex-loopforge-f32bcf-stepan-oskins-projects.vercel.app/stepanoskin/loopforge/architecture/the-thesis).
- [Playable preview](https://fruitful-lab-git-codex-loopforge-f32bcf-stepan-oskins-projects.vercel.app/stepanoskin/loopforge/play).
- Final live-adapter CI: 37 suites / 168 tests. Model quality remains a learning
  result with recorded defects, not an approved production benchmark.
