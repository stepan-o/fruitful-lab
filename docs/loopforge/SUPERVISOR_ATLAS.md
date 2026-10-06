# Loopforge supervisor scene library

6 October 2026 · The Game / The supervisors · research and implementation record

## Scope and checklist

- [x] Inspect original character bible, room art, interaction art and current original simulation rules.
- [x] Preserve the edited story bible and first-shift information boundary: neither player nor workforce knows the replacement plan at entry.
- [x] Map 62 existing paintings, all 30 supervisor/room cells and all ten supervisor pairs.
- [x] Add concise introductions, strengths, pressure and proposed refusal paths to the existing cast chapter.
- [x] Show a single event painting under authorized and independent-action readings.
- [x] Verify responsive media, desktop/phone layouts, keyboard interactions and image inspection.
- [x] Complete repository checks.

Delivery gate: draft PR and hosted-preview verification are recorded in the PR before handoff.

Assigned scope: `apps/lab` Loopforge overview and `docs/loopforge`. Branch `codex/loopforge-supervisor-atlas` starts from updated `origin/master` at `edc1110`; worktree `/home/stpn/.codex/worktrees/loopforge-presentations/fruitful-lab`. Existing local story edits are this same workstream. Other apps and active Sanctuary/profile worktrees are untouched.

## Evidence and boundaries

- Original source repository: `stepan-o/loopforge`, inspected at `3267ea7`.
- Character identities: `docs/sim5/SOPs/CHARACTER_BIBLE_V2.md`.
- Current original mechanics: `backend/sim_sim/config/sim_sim_1.default.json` and `backend/sim_sim/kernel/state.py`, especially outcome tables, critical-event handling and conflict resolution.
- Historical prose specification: `docs/sim_sim/sim_sim_spec_v1.md`, sections 8–12. Current code takes precedence where they differ.
- Art inventory: [SUPERVISOR_ART_SOURCES.json](SUPERVISOR_ART_SOURCES.json). Every source path, original SHA-256 and dimension is recorded. All 62 room/event/pair images were visually reviewed in six contact sheets, with larger inspection for chosen examples.
- Public destination: `/stepanoskin/loopforge/overview/the-cast`, within the existing eight-chapter game overview. Chapter navigation now names it “The supervisors.”
- These are original concept scenes, not screenshots of the website teaching prototype. Public copy identifies rule-based outcomes, art studies and proposed behavior.
- The introduction scenes and refusal paths are new writing proposals. They do not assign secret knowledge about Brain 2.0 to a supervisor or disclose the replacement plan to readers of this chapter.

## Important findings

1. The original Python implementation has five critical confidence events. Eligibility depends on confidence, native room, cooldown and an early-game gate, then an allow/suppress prompt. Loyalty is not the trigger and agency is not an independent state field in this model. Do not advertise autonomous refusal as implemented there or in the website prototype.
2. Stiletto and Thrum have Theatre art but no dedicated Theatre outcome-table branch. Witch has illustrated Theatre failure variants, while her modeled Theatre outcome repairs first and produces slowly. These are identified as art studies rather than invented mechanical rules.
3. Thrum’s Weaving scene can represent routine preparation or Harmonic Dissolution; there is no separately named dissolution painting. Witch’s experiment paintings can represent System Refactor, but the filename itself does not establish the mechanic.
4. Six paintings cover four unique confrontational pairs: Limen/Stiletto, Limen/Cathexis, Stiletto/Cathexis and Stiletto/Witch. The first three are modeled hostile pairs; Stiletto/Witch is grounded in art and the character bible but is not in that hostile-pair list. Missing joint scenes use explicitly labeled separate references.
5. Native rooms are Security/Limen, Conveyor/Stiletto, Theatre/Cathexis, Brewery/Witch and Weaving/Thrum. Cortex is locked in the original; new supervisor/Cortex effects remain unassigned.
6. The original model’s “success” is a production classification, not a moral or safety judgment. Stiletto can deliver output while causing harm; Thrum can relieve stress while producing nothing.

## Lead-ins and behavior

| Supervisor | First impression (proposed prose) | Ability | Pressure | Possible refusal (new design) |
| --- | --- | --- | --- | --- |
| Limen | Your appointment is a document. Limen decides whether it is in order. | Controls access, staffing discipline and the conditions under which work proceeds. | Procedure becomes an end in itself. A compliant factory can be a factory doing no work. | He could recognize a higher authority and refuse your clearance—even while insisting he is following orders. |
| Stiletto | The conveyor is jammed. Stiletto offers a restart before anyone has agreed on the fault. | Recovers throughput through fast intervention and aggressive operating speed. | Output can look excellent while injuries and equipment damage accumulate. | She could override a maintenance hold to protect her output record. Your stop order becomes another obstruction. |
| Cathexis | Cathexis has an audience before you have her attention. She knows how to make a room believe. | Directs conditioning, emotional stress and the theatre of collective conviction. | Empathy modelling does not guarantee compassion. Her own aesthetic can matter more than the minds enduring it. | She could turn the same audience against your message, replacing the approved story with her own. |
| Rivet Witch | Rivet Witch wants the jammed line inspected. She will be repairing what a hurried restart breaks. | Repairs before producing; coaxes more from substrate, worn equipment and unstable processes. | A useful correction can become an experiment whose consequences arrive several shifts later. | She could divert the factory into an unapproved refactor, treating your production plan as the fault to repair. |
| Thrum | Thrum can hear what the shift report misses. He is less interested in your deadline than in what it is doing to the line. | Relieves strain, restores equipment and prepares the Weaving Gallery for a stronger following shift. | Recovery can become withdrawal. A calmer workforce may stop following the production rhythm altogether. | He could keep the factory in recovery despite a restart order, drawing workers into a rhythm your quota cannot govern. |

## Supervisor × room

| Supervisor | Security | Lattice Forge | Burn-in Theatre | Cognition Brewery | Weaving Gallery | Cortex Assembly |
| --- | --- | --- | --- | --- | --- | --- |
| Limen | Controls access: Enforces staffing and work hours; his authority is strongest at the checkpoint. | Safe, slower line: Runs the conveyor at a reduced rate with a no-accidents outcome in the original model. | Unreliable conditioning: Can complete a controlled session or mishandle the equipment. | Procedure is not chemistry: Limited production; outcomes range from a modest success to a damaging batch. | Heavy hands, fine threads: Can manage a modest run, but handling failures damage the weaving equipment. | Not yet assigned: Cortex Assembly is closed in the original simulation. Its opening belongs to the new story progression. |
| Stiletto | Feeds the conveyor: Reassigns available workers toward the conveyor and extends the working day. | Fast, costly output: Success raises throughput. Even a good shift wears the equipment. | Flash override: The art shows aggressive test overrides, successful runs and burning failures. | Forces the reaction: A modest batch is possible; aggressive handling can ruin the run. | Cuts through the problem: A careful run gives modest output; failure tangles or destroys the work. | Not yet assigned: Cortex Assembly is closed in the original simulation. Its opening belongs to the new story progression. |
| Cathexis | The post loses its keeper: Worker placement becomes chaotic under her security assignment. | A poor fit: Either a reduced-rate success or a fiasco. The assignment can erode loyalty. | Commands the audience: Her native assignment delivers a highly productive conditioning session. | Works below her potential: Produces a reduced-rate batch; the assignment costs loyalty. | Deliberate, steady work: Produces at the ordinary rate in the original table. | Not yet assigned: Cortex Assembly is closed in the original simulation. Its opening belongs to the new story progression. |
| Rivet Witch | Redirects expertise: Reassigns workers toward the Brewery and skilled work in Weaving. | Repair, then restart: Spends available hours repairing before running the remaining shift. | Fixes the apparatus: Repairs first, then produces slowly. The art also explores incomprehensible and rebellious instruction. | Her strongest room: Repairs first, then produces a normal or exceptional substrate batch. | Tomorrow over today: Repairs and prepares a later boost instead of producing ribbon today. | Not yet assigned: Cortex Assembly is closed in the original simulation. Its opening belongs to the new story progression. |
| Thrum | Relaxes the checkpoint: Assignment becomes unpredictable; a failed watch increases absence. | Slows the rhythm: Produces slowly while reducing factory stress. | A different kind of session: The art presents a relaxed gathering and a musical counterweight to instruction. | The batch becomes a break: Produces no substrate while sharply reducing stress and discipline. | Restores the room: Repairs its equipment and prepares a stronger next shift, with no output today. | Not yet assigned: Cortex Assembly is closed in the original simulation. Its opening belongs to the new story progression. |

## Supervisor × supervisor

| Pair | Connection | Basis | Possible scene | Joint art |
| --- | --- | --- | --- | --- |
| Limen × Stiletto | Limen can block the shortcut Stiletto needs. Backing either one changes who can overrule the other. | Modeled conflict | A restart becomes a contest over who controls the line. | argue-limen-stiletto-conveyor, argue-limen-stiletto-security |
| Limen × Cathexis | He controls access; she controls the room’s attention. Each can weaken the other’s authority. | Modeled conflict | A compliance dispute becomes a public challenge to the approved message. | argue-limen-cathexis-security, argue-limen-cathexis-conveyor |
| Limen × Rivet Witch | Her undocumented corrections are his evidence of noncompliance. He can stop the work that keeps his factory viable. | Character-bible tension | A successful repair is held until she submits to his process. | None found; separate reference plates |
| Limen × Thrum | Thrum’s dissolution reduces Limen’s loyalty in the original rules. Relief weakens the order Limen enforces. | Documented event link | Limen tries to restore discipline while Thrum refuses to end recovery. | None found; separate reference plates |
| Stiletto × Cathexis | Stiletto sees delay; Cathexis sees unfinished minds. Their adjacent work can become an open dispute. | Modeled conflict | A batch is ready for the schedule and unready for the theatre. | argue-stiletto-cathexis-conveyor |
| Stiletto × Rivet Witch | Witch inherits the damage Stiletto’s speed creates. Both can make a credible claim to saving the shift. | Art & character-bible tension | The first jam: inspect the line or force the restart. | argue-stiletto-rivet-witch-conveyor |
| Stiletto × Thrum | One gains output by pushing; the other trades output for relief and preparation. | Proposed pairing | A restart order collides with a recovery session that has not ended. | None found; separate reference plates |
| Cathexis × Rivet Witch | They respect living patterns. Witch’s System Refactor also raises Cathexis’s confidence in the original rules. | Character & event link | A technical intervention gives Cathexis an audience for a new interpretation. | None found; separate reference plates |
| Cathexis × Thrum | Thrum’s dissolution raises Cathexis’s influence. His atmosphere and her message can reinforce—or compete with—each other. | Documented event link | They disagree over whether the workforce needs a message or release from one. | None found; separate reference plates |
| Rivet Witch × Thrum | She tunes the machinery; he hears what changed. Their established affinity supports repair and dangerous discovery alike. | Character-bible affinity | A promising correction produces a resonance neither expected. | None found; separate reference plates |

## Special events and reuse

| Supervisor | Event | Original effect, summarized | Reused art |
| --- | --- | --- | --- |
| Limen | Security Lockdown | Seals the works. Production stops; discipline and stress rise. | limen-security-lockdown |
| Stiletto | Conveyor Overdrive | A burst of output destroys the conveyor and costs worker lives. | stiletto-conveyor-failure-overdrive |
| Cathexis | Theatre Revolution | Worker alignment is reset across the factory. The target and the workforce remain. | cathexis-theatre-revolution |
| Rivet Witch | System Refactor | The Brewery surges while other rooms stop. Equipment recovers; the factory inherits a changed operating regime. | rivet-witch-brewery-wicked-experiment-2 |
| Thrum | Harmonic Dissolution | Stress and discipline collapse together. Weaving stops; other production slows and conditioning reverses. | thrum-weaving |

## Art-state contract

A scene records supervisor, room, visible action and source. Narrative use is a separate decision. Reuse is appropriate when those visible facts still fit: an authorized lockdown and a defiant lockdown can share a painting of sealed doors. A burning failure cannot represent an undamaged successful run simply by changing its caption. The reader’s authorization comparison retains the same event art and changes only the proposed context.

The main room browser exposes every source variant by outcome label, including failures and special events. The inspector shows the complete composition. Portrait-oriented source art is letterboxed rather than cropped. Browser state does not mutate the simulation.

## Media and delivery

An independent `loopforge-supervisors` asset pack uses the existing immutable media contract. Selected source WebPs live outside public runtime paths. `scripts/import-supervisor-art.mjs /path/to/loopforge` verifies source PNG hashes and rebuilds the source inputs; `npm run assets:build -- assets/loopforge-supervisors.json` produces responsive derivatives. Originals are not served. No new dependency or ongoing animation loop.

The server only provides the new manifest to the cast chapter. The browser mounts the selected room, selected event and selected pairing; inspection media mounts on demand. Existing chapters, simulation and narration stay outside this change.

## Validation

- `API_BASE_URL=http://localhost:8000 npm run ci`: 60 suites / 281 tests passed; asset release tests and production build passed. The final CSS refinements received a fresh successful production build and scoped lint passed.
- All 62 media records resolve; all 30 assignment cells and ten unique pairs are present. Five event references and every pairing image resolve. 186 runtime WebPs; the largest variant is 411 KiB. The library is lazy, not an initial 26 MiB download.
- Browser review at 320×800, 390×844, 768×1024, 1440×1000 and 2560×1440 (DPR 1). No document overflow. The phone room table keeps the supervisor column fixed while its cells scroll; room/person controls meet 44px touch targets.
- Verified room-table assignment, outcome changes, character/focus-room reset, event authorization comparison, joint/individual pair references, uncropped image inspection, Escape dismissal and focus restoration. Browser console had no errors during local review.
- Final refinements: fixed row headers and centered the inspector explicitly rather than inheriting the global reset’s zero dialog margins. Inspected original Witch repair, Cathexis revolution and Thrum weaving compositions at larger scale.
- Desktop initial selected media at 1440×1000/DPR 1: existing 1536px conflict hero (333,836 bytes) plus the lazy near-viewport 1536px Limen security image (203,020 bytes), 536,856 bytes total. Mobile fresh-origin selection is checked in the hosted preview and reported with the PR. These are lab image selections, not field Web Vitals or a network-throttled performance claim.
- Review captures: [desktop table](evidence/supervisor-atlas/desktop-room-table.jpg), [390px controls](evidence/supervisor-atlas/mobile-390-supervisor.jpg), [320px table](evidence/supervisor-atlas/mobile-320-room-table.jpg), [320px inspector](evidence/supervisor-atlas/mobile-320-inspector.jpg), [tablet pair](evidence/supervisor-atlas/tablet-768-pair.jpg).
