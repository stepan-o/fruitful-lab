# Loopforge Studio

22 October 2026 · connected and in use. Munder Difflin 0.5.7 runs the local studio workspace. Its Producer has completed intake, delivered LIMEN detail levels and produced an independent acting review. The existing Loopforge Codex chat owns the current game checkout, browser review, integration and publication. Opening-scene v1 remains in review.

The owner should be able to open the studio and see what the game gained, what is being made, what is failing review and where the budget went. The unit of progress is a playable encounter or an asset that works inside one. Agent activity is supporting evidence.

## One direction, several crafts

The owner sets the artistic direction and funds production. The Producer owns the current milestone, routes work and assembles the release. Specialist seats have persistent responsibilities, but are activated only when their work is ready.

| Seat | Responsibility | Handoff |
| --- | --- | --- |
| Producer / director | Episode continuity, shot priorities, dependencies, budget, integration | One current cut, one production board, an exact review build |
| Narrative | Character voice, short dialogue, personal arcs, visible motives | Dialogue and action beats tied to the approved storyboard |
| Character and animation | Model identity, rigs, attachments, contact, transitions and detail levels | Versioned model bank and recorded review across relevant motions |
| Environment and lighting | Lobby, Security and Conveyor; station affordances; contrast | Room kit shown with the actual cast, cameras and interactions |
| Engine | Time, actions, reservations, movement, speech, knowledge and future BDI connections | Tested behavior behind the staged episode, with explicit stubs |
| Independent review | Visual continuity, contacts, browser behavior, delivery and performance | Evidence-based pass or a short list of reproducible defects |

These are roles, not six continuously running processes. Start with a Producer, one builder and one reviewer. Activate the appropriate craft for each job. On this i5-7200U / HD620 machine, begin with at most two active specialist sessions and one heavy local process. Benchmarking gets the machine alone: pause builds, baking, other previews and the animated office. This is a starting operating limit, not a measured capacity claim.

## The owner's view

A milestone card opens the latest playable build, storyboard and outstanding acceptance failures. Under it, each production item exposes:

- Owner, current stage and the next handoff.
- The latest picture or motion sample, with a link to its actual viewer.
- Approved reference and the feedback being addressed.
- Credits spent and reserved, where applicable.
- What changed since the last review; what still fails.
- Exact asset version, source commit and deployment used for the evidence.

Use the office floor to locate people and the board to locate work. A moving avatar cannot substitute for a reviewed result. Keep technical logs available behind the task; the owner's default view shows the deliverable and the decision it needs.

Production stages: Brief → Making → Craft review → Scene review → Performance review → Published. A failed review returns the item to its owner with a frame, reproduction or measurement. "Generated", "integrated", "visually accepted" and "published" are different facts. Do not invent a percentage complete from task counts.

The harness's board may have fewer native statuses. Represent craft/scene/performance gates in the task contract and evidence; only mark the task done after its required gates. Do not pretend the complete owner-facing view is an existing Munder feature: linked previews, version checks and budget integration need to be wired and tested.

## Source of truth

Keep the repository's memory, numbered model/animation briefs, approved art, immutable manifests and measured results authoritative. The office memory points to them and keeps handoffs; it does not become a competing design bible.

Each production job names its allowed paths, branch/worktree, inputs, expected outputs, dependencies, budget reservation and acceptance checks. Parallel builders use separate worktrees. The integration owner publishes the combined preview. For the current milestone that owner is the existing Loopforge Codex chat; Munder’s Producer coordinates isolated contributions and acceptance evidence. Another agent must not edit the same pending files or publish a different build under the same review label.

The owner should see newly discovered creative choices or unresolved tradeoffs, not routine requests to repeat approval already given. The current opening scene and the cumulative 1,000-credit Meshy allowance remain authorized.

## Tools and budgets

Munder orchestrates terminal agents. Before routing real work, test one session's tool access end to end: repository instructions, Meshy keyring launcher, image inputs, Blender/offline baking, browser inspection, GitHub and deployment. Do not assume that capabilities supplied by this desktop chat automatically appear in another CLI session.

All paid Meshy requests must pass through one budget owner and one authoritative ledger. Our present client stores the ledger relative to its checkout: independently copied worktrees would therefore create separate spending books. The studio launcher now invokes the canonical checkout's client by absolute path, sharing its ledger and lock. Every role must use that launcher; independently copied clients and raw paid Meshy tools remain prohibited. Producer verified the safe launcher during intake. Paid generation remains with the canonical ledger owner; tool availability is checked per task. Do not copy the API key into prompts or give every agent an independent allowance. The harness's model-token limits do not enforce Meshy credits.

22 October snapshot: 710 / 1,000 Meshy credits spent, 290 remaining, no paid Meshy task in flight. The rebuilt LIMEN has 20 transferred performances and three delivery detail levels; the new room kit is integrated. Their scene and contact acceptance is tracked separately from generation and delivery. Re-check the ledger when starting work; this paragraph is not the live balance.

## Local setup handoff

The coordination home is `/home/stpn/LoopforgeStudio`. Its task board, inboxes and evidence directories are live. Producer is the orchestration agent (`god` internally). A completed intake proved local source access and offline tooling. Browser inspection and authenticated publishing are available in the existing Codex desktop chat; they do not automatically transfer into Munder’s CLI sessions.

Current division of work:

| Work | Owner | Evidence |
| --- | --- | --- |
| Runtime, room placement, cameras, browser review and publication | Existing Loopforge Codex chat | Canonical checkout and draft PR #126 |
| Independent acting review and bounded contact corrections | Munder Producer | LST-3 review and proposed patch files |
| Sustained HD620 test | Existing Loopforge Codex chat, machine reserved | LST-7 and versioned performance JSON |
| Dependencies, review status, task handoffs and spend snapshot | Munder Producer | Native studio task board |

The first two temporary reviewers stopped at cumulative token caps. Their evidence was recovered; they were not restarted. Temporary task limits count input plus output, including reused cached input on each call. The current bounded-task default is one million cumulative tokens, with a saved handoff before roughly 70%. This does not change Meshy’s 1,000-credit project cap. Start specialists only for work with an isolated scope and a concrete deliverable.

The board includes a post-setup credential check. The browser sign-in code is single-use and time-limited, not a persistent API key. Its value is not stored in project or studio files. Confirm use or expiry after connection; rotate a durable credential only if one was actually exposed.

## First pilot: LIMEN at the checkpoint

Use a complete, bounded production loop before moving the entire project into the office:

1. Character artist takes the generated skull/steel body, checks anatomy and silhouette, fits the existing cyan emitter and tunes the transferred motions.
2. Director places it in the actual greeting, strike and STILETTO passage shots. Check identity at room and CCTV scale against the concept art.
3. Independent reviewer inspects the sequence and reports exact failures: gaze, hand/blade/body contact, foot placement, transition or framing.
4. Engine owner resolves behavior issues; character artist resolves mesh and motion issues. The Producer keeps their versions aligned.
5. Run the production-build sustained performance test on an otherwise quiet machine. Preserve all gate results, including failures.
6. Publish the reviewed checkpoint with before/after frames, the exact evidence and cost. Keep the full opening-scene goal open until its other gates pass.

The pilot succeeds if a handoff survives a restart, two builders cannot overwrite each other's work, paid requests obey the shared cap, review catches a planted defect, and the owner can inspect the final result without reconstructing the chat. Measure review cycles, repeated defects and owner interruptions; more agents or more tokens are not success measures.

## Research basis

Munder Difflin's current [README](https://github.com/HarnessMD/munder-difflin) describes CLI providers, routed work and persistent memory. Its [onboarding guide](https://munderdiffl.in/blog/your-first-hour-with-munder-difflin/) describes a small team, per-agent budgets, temporary workers and handoffs. These are useful foundations for the proposed studio.

Official source inspected at [75869287eb5ab88d382a3711332bdb9918cf1073](https://github.com/HarnessMD/munder-difflin/tree/75869287eb5ab88d382a3711332bdb9918cf1073): `src/main/hive.ts` includes Codex session configuration and task-routing contracts; isolated worker requests and `src/main/worktreeDeps.ts` provide worktree support. That does not certify this monorepo's nested dependencies or this desktop session's tools. Older design documents describe earlier implementations, so setup must be checked against the installed version.

This is a production coordination tool. Loopforge's in-game BDI agents, authoritative clock, perceptions, actions and world feedback remain game systems owned by the engine.

## Dedicated animator rollout

The owner requested a dedicated animator on 22 October. The role package is prepared locally as `agents/animator.agent.json`, with its durable craft brief at `briefs/animator.md`. Producer has an onboarding request to create the native hire/import entry and run a bounded task from the existing Character Artist template. A role file, a running temporary job and a permanently imported seat are separate states; verify the live roster before claiming activation.

Begin with four responsibilities: Producer; Character & Motion; Engine/Integration; Independent Review. Environment and narrative specialists are commissioned when a production item needs them. The current Codex chat holds Engine/Integration and publication, so it is not duplicated in the same worktree. Keep no more than two specialists active and one heavy local process.

An animation task names the exact input hashes, immutable source, partner motion, shot/timing, allowed paths, output branch and acceptance tests. The animator delivers a reproducible derivative, before/after evidence and a short defect list. A reviewer checks the actual runtime and all affected detail levels; the integrator then checks the performance in the scene. A motion is not accepted merely because it has been generated or because a contact metric is zero. Quiet holds, weight, intent, pace and character identity remain visual judgments.

The animator keeps knowledge in briefs and verified handoffs, using bounded task sessions. No continuously growing conversation, duplicate paid ledger or autonomous restart after a token stop. Read the current task inputs rather than repeating the whole project intake. Munder’s native protocol supports launching temporary task workers; permanent hire/import requires its UI confirmation. The prepared package does not expand tools or permissions by itself.
