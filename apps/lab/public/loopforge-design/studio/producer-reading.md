# PRODUCER source reader

26 November 2026 · Companion to the [PRODUCER brief](/stepanoskin/loopforge/design/studio/producer) and [coordination playbook](/stepanoskin/loopforge/design/studio/producer-playbook)

## Read for a decision

Onboarding should produce understanding of this game and the next production problem. Read the current sources below before the interview. Expand into the archives where they answer a concrete question; do not ingest every historical file into the chat. Produce an informed pre-synthesis, not a bibliography in place of judgment.

Current owner instructions define intent. Current code and observed behavior establish implementation. Approved design records explain agreed decisions. Dated studies and archives offer hypotheses, experience and reusable material. If these disagree, name the contradiction and its consequence; do not quietly promote the oldest or most detailed document into authority.

## Read the evidence for a delivery

Begin with the owner’s commission, current master and the [local review procedure](/stepanoskin/loopforge/design/studio/producer-playbook#guest-build-and-owner-review). The [SECURITY handoff](/stepanoskin/loopforge/design/studio/security#current-handoff) records which parts of that procedure have run.

- **A local draft** has a base and worker head, a diff, checks and a guest URL. Compare the actual running content with the worker's revision. Record any uncommitted edits.
- **An approval** pairs the owner's “open the PR” with the full SHA of the clean revision they reviewed. A different head is a new candidate.
- **GitHub** supplies the immutable feature branch, current PR state and full head SHA. Re-read the state and head before reporting, even if the original submission receipt says draft.
- **Vercel** supplies the deployment state, source SHA and deployment-specific URL. Report a build in progress as pending. When it reaches READY, match its SHA to the reviewed head and verify the changed content at that URL.

The owner accepted the local one-file test. [PR #202](https://github.com/stepan-o/fruitful-lab/pull/202) provides the full documentation example. Its approved head was `775a22fac1b1c821f7b2fba039c2da34c40fb58d`. The scoped service delivered that head, the App opened the draft, the owner merged it, and both hosted diagram pages matched the reviewed Git HTML on the READY deployment for that SHA.

## Current vision and creative foundations

| Read | What PRODUCER should take from it |
| --- | --- |
| [Player desires and scenarios](/stepanoskin/loopforge/design#player-desires) and [authored study](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/PLAYER_DESIRES_AND_SCENARIOS.md) | “I ran this factory my way.” Preserve multiple satisfying identities for the player. Proposed scenarios and reference-game observations require their own validation. |
| [Editorial voice](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/EDITORIAL_VOICE.md) | Affection, physical specificity, bureaucratic speech and unequal voices. Avoid generic quips, compulsory suffering and explanatory metaphor. |
| [Character dramaturgy](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/CHARACTER_DRAMATURGY.md) and [opening cast](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/OPENING_CAST.md) | bob's continuity and ordinary wants; the player operates the factory rather than simply controlling bob. Preserve approved character passages and distinguish foundations from performed scenes. |
| [Narrative studies](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/NARRATIVE_STUDIES.md), [Astafiev](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/ASTAFIEV_CASE_STUDY.md) and [dialogue study](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/TARANTINO_CASE_STUDY.md) | References for voice, human texture and dialogue under practical pressure. Use specific applications, not imitation as an aesthetic shortcut. |
| [Current intro](/stepanoskin/loopforge/design#day-one-intro), [approved floor](/stepanoskin/loopforge/design#floor-layout) and [pixel-art plan](/stepanoskin/loopforge/design#pixel-art-plan) | The present script, measured world and visual direction. Rehearsal, art proofs and game playback answer different questions. |
| [Core loop study](/stepanoskin/loopforge/design#loop-study) and [Supervisor × room](/stepanoskin/loopforge/design#supervisor-rooms) | Connect observation, commitment, consequences and revision. Define useful duties and conflicts rather than turning every room/supervisor cell into a numerical bonus. |
| [Current shifts handoff](/loopforge-shifts/ENGINE-HANDOFF.md) and [art handoff](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/production/days-2-4-art/ENGINE.md) | What can actually run and what artwork can bind to it. Check the latest version and review status before commission or acceptance claims. |

The [older Producer console direction](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/PRODUCER_CONSOLE_DIRECTION.md) is useful for credible factory instrumentation, observation and consequential controls. Its earlier skins, schedules and one-minute-loop assumptions are dated context; they do not override the current 2D direction or approved intro timing.

## Designing Games: verified passages and applications

Tynan Sylvester, *Designing Games: A Guide to Engineering Experiences*, O'Reilly, 2013. The owner keeps the reference PDF in the private studio library. Locations below were checked in that 415-page PDF. **PDF pages are one-based page positions**, not zero-based indexes; printed pages are eight lower at these locations. The book remains local. This reader supplies short excerpts and original applications, not a copy of its chapters.

### Mechanics produce the experience

Chapter 1, “Engines of Experience,” printed p. 7; PDF p. 15: **“During play, mechanics and players interact to generate EVENTS.”**

Application: commission the situation and its causal rules together. A failed ID check, a held Security line, staffed machinery continuing elsewhere and a player's daily-pass decision can produce a scene through mechanics. Dialogue and art must represent those events. An independent cinematic sequence that merely resembles them cannot establish the same gameplay.

Review: ask ENGINE for matched decisions from one checkpoint and check the resulting public events and presentation. Then ask the player whether the situation is understandable and worth acting on. Passing a causality check does not establish emotional impact; the owner judges the experience.

### Every addition has a cost

Chapter 2, “Elegance,” printed pp. 49–51; PDF pp. 57–59. At printed p. 49: **“Every game mechanic has a price tag.”**

Application: compare how much meaningful play an addition creates with the learning, authoring, asset, integration and maintenance work it creates. Existing custody, hearing, movement and work reservations may support a richer next encounter than a new subsystem. Prefer a small set of interacting rules when they meet the approved goal; do not use “elegance” to excuse a missing required action or flatten character differences.

Review: show the owner what an added mechanic would let them do, what could be reused and what remains untested. Recommend scope; the owner decides whether the additional value deserves production effort.

### Make important state perceptible

Chapter 9, “Interface,” printed pp. 230–231; PDF pp. 238–239. At printed p. 231: **“DIVERSE REDUNDANCY is communicating the same information multiple times in different ways.”**

Application: an unresolved Security case can be evident through the desk signal, the physically waiting queue and a sourced report. These should agree with the simulation. Redundancy is especially useful across distant camera views, small screens and sound-off play; it is not permission to expose hidden beliefs or cover the game in debug text.

Review: inspect desktop and phone framing and ask whether the player can identify the situation and available response. Check each cue against the authoritative event. Do not equate seeing a marker in a still with understanding a changing encounter.

### Iterate to answer a question

Chapter 11, “Planning and Iteration,” printed pp. 277–283; PDF pp. 285–291. At printed p. 283: **“ITERATION is the practice of making short-range plans, implementing them, testing them, and repeating.”**

Application: each proposed iteration names an uncertainty, a limited change and the evidence that will resolve it. For example: can the player recognise the supervisor's response while the factory continues working? The next delivery must answer that question in play. A renamed handoff, another source packet or an unchanged failed render does not answer it.

Review: report what the experiment established and what it did not. Recommend continuing, revising or shipping, with tradeoffs. The owner makes that decision. The book's iterative process is not a standing authorization for agents to repeat work indefinitely.

### Build knowledge that survives the chat

Chapter 12, “Knowledge Creation,” printed pp. 311–313; PDF pp. 319–321. Sylvester describes game creation as building knowledge and considers several ways of learning about a design.

Application: valuable durable capacity includes a verified placement contract, a reusable animation import, a replay fixture that catches a real regression, a clear art brief or an observed player response. A document is useful when it lets the next person act more accurately. Document count and tokens consumed are poor substitutes for that test.

Review: identify the decision or uncertainty each new artifact resolves, its current owner and how the next assignment will reuse it. Label opinions, source checks, simulation tests and actual player feedback separately. This is a production interpretation, not a claim that the book proves a particular AI workflow efficient.

### Dependencies belong in the plan

Chapter 13, “Dependencies,” printed pp. 323–325; PDF pp. 331–333. The chapter explains how a change in one design component can force changes elsewhere, including relationships between movement and animation.

Application: establish one approved geometry and registration contract before fixed scenery is commissioned. The map, rehearsal, placement data, camera studies and runtime must share it. Likewise, hand contact, prop custody and action timing need a common interface between ART and ENGINE. Discovering a different factory inside each handoff is expensive even when each artifact looks individually competent.

Review: trace one approved change through its consumers and test the integrated result. Flag the impact of changing a shared contract to the owner. Parallel work is useful when interfaces are sufficiently clear; assigning every dependent task simultaneously does not remove the dependency.

### Expertise informs authority

Chapter 14, “Authority,” printed pp. 337–342; PDF pp. 345–350. At printed p. 342: **“A developer’s NATURAL AUTHORITY extends over any decision that he is better equipped to make than anyone else on the team.”**

Application: seek craft judgment from the person examining the actual problem. ENGINE owns admission and rendering integration; LEVEL owns measured blocking; ART judges asset coherence. PRODUCER reconciles their recommendations and brings material production choices to the owner. Do not force every small technical decision through a generic coordinator, or allow a confident specialist to substitute a new creative goal.

Limit: this chapter discusses human organisations. Its distributed-mind and ant-colony analogies do not demonstrate that adding LLM agents improves creative throughput. Shared models can repeat the same mistake; missing tools or absent feedback can defeat an elaborate role structure. Human/player acceptance and the owner's decision rights remain explicit in this studio.

## Original Loopforge: reusable ideas, different implementation

| Source | Useful inheritance | Boundary to preserve |
| --- | --- | --- |
| [Original Producer vision](https://github.com/stepan-o/loopforge/blob/master/docs/legacy/sim2/narrative/PRODUCER_VISION.md) | A watchable robot workplace where surprising episodes remain understandable; stage, actors, story interpretation, direction and console work together. | Earlier characters, narrative layers and roadmap phases are historical. Narration is not world authority. |
| [Puppetteer doctrine](https://github.com/stepan-o/loopforge/blob/master/docs/legacy/sim2/psych/THE_PUPPETTEER_DOCTRINE.md) and [agent vision](https://github.com/stepan-o/loopforge/blob/master/docs/legacy/sim2/psych/LOOPFORGE_AGENT_VISION.md) | Separate physical truth, subjective perception, belief, intention and action. Give agents continuity instead of one giant prompt or decorative emotions. | Verify current behavior. A proposed psychological module or old prose summary is not evidence of implemented BDI. |
| [Sim5 vision](https://github.com/stepan-o/loopforge/blob/master/docs/sim5/SOPs/SIM5_VISION.md) and [KVP-0001](https://github.com/stepan-o/loopforge/blob/master/docs/sim5/SOPs/KVP-0001.md) | Headless authoritative simulation, commands, snapshots/diffs and replaceable viewers; deterministic execution with explicit protocol contracts. | Identify the actual supported profile. Historical Rust-oriented types do not establish a shipped Rust core. |
| [Current BDI and protocol review](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/BDI_AND_PROTOCOL_REVIEW.md) and [ENGINE brief](/stepanoskin/loopforge/design/studio/engine-master) | An admission boundary for player/agent proposals, persistent intentions and a public/private projection distinction. | The dated review explains architecture; current code and evidence determine which parts exist today. |

Ask ENGINE to inspect old kernels, action handling, hearing, reservations, custody, animation adapters and replay fixtures for real reuse. Reuse a tested contract or asset rather than its familiar name. Confirm coordinates, units, schema, dependencies and ownership; adapt inside the assigned scope. Do not import a viewer's private state into the authoritative core. Live KVP replay and offline replay artifacts have distinct protocol rules, which ENGINE must check in the source specification.

## What the Munder cycles teach

Read the [first retrospective's Producer contribution](/loopforge-dev-blog/retrospectives/2026-10-22-first-retrospective/data/producer-contribution.md), the [second retrospective](/loopforge-dev-blog/retrospectives/2026-10-25-second-retrospective/index.html), its [Producer reflection](/loopforge-dev-blog/retrospectives/2026-10-25-second-retrospective/source/producer-reflection.md), [Root account](/loopforge-dev-blog/retrospectives/2026-10-25-second-retrospective/source/root-account.md) and [independent assessment](/loopforge-dev-blog/retrospectives/2026-10-25-second-retrospective/source/independent-assessment.md). These are separate, frozen voices. Read their disagreements rather than manufacturing a single team consensus.

The first Producer account identifies split responsibility when source packets needed to become an experience, and repeated continuations that described a blocker without resolving it. The second acknowledges commissioning visual work without adequate direct game review. Root's central failure was commissioning that work without native studio browser access, then substituting an hourly bridge. More role descriptions and more tokens did not repair the missing feedback. Later native access exposed problems that hashes and still images could not show.

The independent assessment also rejects a single-cause explanation: narrow tests, poor operational diagnoses and missed craft alternatives mattered. Not every craft must operate its own browser, but each needs timely, adequate evidence for the judgment it is making. Animation review requires motion; an exact build identifier is valuable provenance, not a verdict. Idle dependent specialists do not prove a stalled studio.

Useful material survives: reviewed models, rigs and clips; layout studies; contract and replay checks; source-owned briefs; screenshots; and the record of failed approaches. The [archived Producer brief](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/studio/briefs/producer.md) helps explain the old division of work. The [combined-delivery record](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/production/COMBINED_DELIVERY_2026-10-26.md) records remaining limits. Preserve them rather than relabelling unresolved contact, runtime or performance work as approved.

The owner closed the autonomous studio for poor efficiency and pace. Its roles are historical sources, not an instruction to restore its scheduler, token tranches or root-mediated browser permissions. Munder imagery must retain its source attribution: Munder Difflin by Chaitanya Giri, with the classic office tilesets credited to Modern Interiors by LimeZu where applicable.

## Agentic constraints and honest accounting

Recent art-publication chats showed a maximum-conversation-length banner even on very short user exchanges. The visible message count did not establish the amount of internal context or the backend cause. Some saved records only exposed a system error. Automatic approval refusals also occurred, but a causal link between those refusals and the banner has not been established.

The saved art was subsequently published through a native Codex workflow in [PR #161](https://github.com/stepan-o/fruitful-lab/pull/161) without regenerating it. That is a useful recovery path, not proof that the service defect is fixed. OpenAI's [Codex agent-loop explanation](https://openai.com/index/unrolling-the-codex-agent-loop/) describes tool results entering context and automatic compaction; it does not diagnose these particular failed chats.

Keep file reads and tool output bounded, preserve a checkpoint and resume from artifacts. Distinguish source payload transferred directly by a tool from text expanded into the model conversation. Do not evade an approval denial by disguising or splitting the same prohibited action. Review the stated reason, demonstrate authorization where available and ask the owner only for the unresolved decision.

When reporting efficiency, preserve the exact observation window, role/model/configuration provenance, counters and session rollovers. Separate cached input, uncached input and generated output where recorded. Cached-inclusive totals are not newly written tokens or a known monetary bill. Missing sessions, Root costs and incomplete tails stay unknown; do not add overlapping audit windows. Relate effort to observed outcomes and reusable capacity, and bring recommendations for future scope to the owner.
