# First-shift validation — 8 October 2026

Scope: the first-day interaction prototype, migrated design board and engine/experience documentation. This is a playtest slice; enjoyment, long-term balance and the full Act 1 remain owner-review questions.

## Automated checks

- Final app CI passed after the entity revision: 61 Jest suites, 302 tests, one golden snapshot, asset-release validation and the optimized Next.js production build. The focused first-shift suite has 21 passing tests. Focused ESLint and authored-code whitespace checks pass; historical source snapshots retain their original Markdown hard-break spaces.
- Golden private-state and public-projection fixtures cover both advisers. The worker-entity revision intentionally updates private-state golden fixtures; the public view remains an allowlisted aggregate rather than a copy of component tables.
- Verified empty opening assignments, committed adviser selection, swapped room authority, decision pauses, stale/invalid command rejection, output-versus-condition tradeoff, seeded risk variation, immutable allocation and hidden-history exclusion.
- Reconstructed every command result through ordered diffs. Duplicate, wrong-run, skipped, corrupted and forged-baseline records are rejected. HTTP checks cover no-store responses, 16KB body limits, retry equivalence and explicit snapshot recovery.
- Design-board migration preserves `design-data.json` exactly. All generated HTML IDs are unique and local document/asset links resolve. Source snapshots were scanned for secret-like values; no credential material was found. Historical repository paths in prose are provenance, not runtime dependencies.
- The imported optimized artwork is registered with verified immutable content hashes. Only two new WebP derivatives are added; existing illustrations are reused.

## Browser review

Local browser checks cover arrival, handover, adviser selection, structured briefing, assignment override, delegated Conveyor action, Security decision, explicit override, changed supervisor remarks, irreversible allocation and inspectable event causes. All fifteen design-board sections were opened in the production build; the dedicated route, tab switching and shared navigation work.

One observed Stiletto path: approved proposal, automatic push at the Conveyor, director overrides Security advice to verify records. The day ends with 22 produced, condition 67 and no worker loss. Retaining 2 commits 20 to quota, leaves 26 factory workers, and removes allocation controls. The supported-advice baseline produces 24; this difference is a consequence of the lost production opportunity.

Responsive review includes 320, 390, 768, 1440 and 2560 pixel widths. A narrow-header collision and a tablet portrait crop were corrected during review. No horizontal page overflow or broken active images was observed. Decision scenes foreground the affected room. Phone decisions foreground the readable response panel; the room image follows below.

Native camera inspection and settings dialogs provide keyboard focus and Escape dismissal. Range allocation works by keyboard. Optional audio starts muted. Camera atmosphere has a separate toggle; reduced-motion CSS suppresses animation and transitions. OS-level reduced-motion emulation and listening-quality assessment are not claimed by these checks.

## Performance and implementation limits

The worker foundation now uses stable IDs and component tables, with counts derived from their lifecycle states. Tests cover 10/24/100-worker scenarios, assignment and allocation identity continuity, per-worker work pressure, targeted casualties, local witnesses and bounded 100-worker server admission. The focused suite has 21 passing tests.

Local Node measurement: 20 complete first-day replays after one warm-up, seed 7, Stiletto's proposed plan and recommended responses. At 10/24/100 starting workers, median replay time was 12.47/20.89/92.92 ms (sample p95 15.80/26.67/102.70 ms). Final private state was 13,950/24,226/78,440 bytes; the filtered public view was 5,654/6,115/6,123 bytes. The 100-worker run ended with 200 identified entities, including 100 newly produced robots. These are local full-replay measurements, not hosted latency or live-renderer benchmarks. The current HTTP handler may replay the prior state as well to verify a diff baseline; a durable host should checkpoint and advance owned state rather than replaying a whole growing run on every tick.

Only selected first-day image metadata enters the client; responsive derivatives load for active screens. The old full art archive and simulator renderer are not bundled. No new runtime dependency or model call is introduced. Motion uses bounded CSS layers; camera loops pause offscreen, while hidden tabs and inspection screens stop beat requests. Audio has an explicit lifecycle and bounded one-shots.

This is a response-paced HTTP prototype. Internet latency affects elapsed viewing time, not simulation outcomes. It is not an autonomous production clock, cloud-save service, tamper-resistant run, 3D benchmark or field Web Vitals measurement. The soundtrack is planned, not shipped; original procedural SFX are a first sound pass.

## Delivery

The PR retains the old teaching console at `/stepanoskin/loopforge/play/teaching` and does not change its existing model endpoint, quotas or credentials.

[PR #94](https://github.com/stepan-o/fruitful-lab/pull/94) is a draft for owner review. Vercel deployment `dpl_DGLah5eMzFYZDRuYXZRVPfQfwY5Z` is READY for application commit `56898dd9d64dc12c55309f40ce390837bd15e945`. The verified [first-shift preview](https://fruitful-frrc1vujp-stepan-oskins-projects.vercel.app/stepanoskin/loopforge/play) completed the full Stiletto flow with a Security override: 22 produced, 2 retained, 20 committed, 26 remaining workers and condition 67. Causal-record expansion worked after the commitment; allocation controls were no longer available.

The hosted mobile briefing was reviewed at 390×844 with no horizontal overflow or broken images; the desktop decision composition was reviewed at 1440×900. The deployed engine notes accurately describe individual worker components, and their design-board deep link opens the Engine boundary tab. Existing browser authorization sufficed; no new access link or protection change was needed. This verifies the preview, not a merge or production promotion. The local desktop screenshot is retained at `/tmp/loopforge-first-shift-hosted-desktop.png` for the review handoff.
