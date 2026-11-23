# Chapter 2 — dedicated visual/framing review

Reviewed 27 October 2026 in `/home/stpn/.codex/worktrees/agentic-systems-book/fruitful-lab`.

Reviewed the actual chapter, `Reader.tsx` figure composition, the four figure components, shared `WorldBoard`, model functions, figure notes, and relevant responsive/motion styles. No browser used and no application files changed. The chapter hash matches the accepted staged manuscript: `0cc3186f186ab2427aa3b6e2f08342b80247c0f1e399b5531bef4e51932fd934`.

## Verdict

**Source/concept layer: ACCEPTED. No conceptual blocker found. Rendered and interaction gates: PENDING.**

The four graphics justify their preservation. They are not four interchangeable factory illustrations. Each lets the reader expose a different relationship that an AI-driven production system must keep straight. Their teaching roles remain valid after the editorial revision, and their limitations are adequately distinguished from claims about a real service or a general AI planner.

This report does not certify desktop/mobile appearance, touch behavior, keyboard operation, screen-reader behavior, or runtime performance. Root's screenshots and interaction checks are still required.

## 1. Small world — authoritative change and exclusive claims

**Conceptual job.** The scene makes the difference between location, possession, and reservation visible. The reader can move a person without releasing a claim, pass the card without transferring ownership of the press, and receive a refusal from the same rule boundary that permits successful work. That is a useful analogue for an AI caller acting through business rules instead of treating its own description as the product's state.

**Source alignment.** The board renders the model state. Controls create identified intents; the transition function controls custody, reservations, cycles, and credited output. The receipt distinguishes accepted and refused requests. The inspector exposes the actual state instead of a separate explanatory fiction. The duplicate-request behavior is a local in-memory suppression rule; the revised chapter explicitly limits it to one run and disclaims persistence across resets/restarts.

**Layer contributions.** The figure title establishes enforceable rules. The internal task invites the reader to make one workpiece per worker. The caption explains the authored rules and their relationship to Loopforge. The prose interprets the empty-but-reserved press and transfers it to a warehouse-service distinction. The small amount of repetition about separate facts reinforces the interaction rather than introducing a conflicting claim.

**Optional polish.** The title could name the specific tension more vividly. The legacy checkpoint-number sentence belongs more naturally beside the download. The request-ID figure note still says a repeated ID “asks for the existing outcome”; “does not repeat the change within this run” would align more precisely with the newly tightened prose. None of these prevents source/concept acceptance.

## 2. Commit window — validity changes during execution

**Conceptual job.** This is a controlled comparison, whereas the preceding floor is an open experiment. Three paths begin with the same valid situation, then retain or break a precondition. The user can see that admission does not mean output has already been earned. That explains an operational concern with changing permissions, reservations, or task ownership while work is under way.

**Source alignment.** The component replays the same transition function used by the floor. Staying at the control commits a workpiece; leaving or passing the card causes the final tick to discard the cycle. The reserved claim remains Bob's after interruption. The checkpoint note explicitly states that cancellation of unfinished output does not release the reservation. It therefore teaches recovery obligations as well as refusal.

**Layer contributions.** “Acceptance can expire during execution” states the temporal relationship. The caption explains the comparison's construction and the limited role of animation. The staged controls and changing receipts show the event. The prose adds why the earlier acceptance and later refusal can both be correct, then identifies the remaining handoff obligation. These contributions are distinct.

**Important rendered check.** The third displayed stage shows the changed condition; the fourth shows the interrupted cycle. A screenshot of only the intermediate stage must not be treated as the final outcome. The close crop also needs to preserve enough body/card/control context for both interrupted paths to be intelligible.

## 3. Custody room — authoritative fact and observer records

**Conceptual job.** Switching views exposes what the current world says, what Bob last observed, and what Ed observed. A clear/blocked view changes the available evidence, not the single physical card. This provides a concrete model for attributed and potentially stale records in an AI workflow.

**Source alignment.** `custodyAt` keeps physical custody separate from the two belief records. A blocked Bob retains the opening record while the world advances. A clear view updates his record to the current step. The visible source and sequence fields establish why a record has its value. Inspecting a tab does not update either character's knowledge. The component identifies the observation rule as authored rather than computed vision and identifies the scene as a teaching study rather than recovered motion.

**Layer contributions.** “One fact, several views” identifies the comparison. The caption directs attention beyond present agreement to source and sequence. The internal record panel shows the concrete evidence. The following prose introduces BDI as a bounded conceptual reference and explains why maintaining attribution has a cost. The surrounding real screenshot anchors the case but does not pretend to validate the illustrative staging.

**Limit.** The figure demonstrates record divergence, not a downstream autonomous decision or credibility evaluation. The chapter preserves that limit. It is appropriate for a foundation and does not need a new planner interaction to earn its place.

## 4. Hearing room — receipt is separate from truth

**Conceptual job.** Distance, doorway, and voice determine whether the statement arrives. The statement can then change Bob's reported record while physical custody stays fixed. This makes two independent questions available to the reader: did the information reach the recipient, and does it establish the claimed fact? The production-dashboard and attributed-document comparisons are therefore grounded in an actual interaction.

**Source alignment.** The world keeps the card with Ed. A received claim updates Bob's record with a reported mode and speaker; a nonreceipt leaves his earlier observation. Changing a condition resets the trial rather than silently carrying over the previous report. The figure labels room positions and utterances as authored, and it disclaims acoustic simulation. The doorway note correctly states that the doorway condition matters only across rooms.

**Layer contributions.** The title names address versus reception. The caption supplies a useful order of experiments and introduces the false claim. The receipt, Bob-record, and world-record panels keep the outcomes separate. The prose explains why delivery does not supply credibility and why some nonreceipts are intentional. Mark of the Ninja then contributes a player-planning analogy. There is minor reinforcement of receipt versus truth across the caption and panel copy, but not enough redundancy to weaken the lesson.

## Visual coherence and production cost

The two board views share a recognizable world and a single transition model. The custody/hearing pair shares character vocabulary while changing the analytical focus. That reuse reduces the reader's relearning burden. It also avoids representing every new foundation with another unrelated abstract chart.

The controls alter meaningful conditions. No slider pretends to measure production cost, and no animation is offered as evidence of a learned agent or recovered historical performance. The apparent richness serves inspection: the same card, worker, control, and doorway provide stable referents across changing state.

The relevant full-cost obligations are represented: reservations survive interrupted work; request identity must be preserved within its declared scope; personal records need attributed updates; and receipt alone cannot close a factual dispute. The figures help explain why additional state and operational rules cost effort rather than presenting them as free intelligence.

## Pending rendered/interaction evidence

Root can close the rendered gate with the following focused evidence. These are checks, not source-discovered failures.

| Figure | Interaction result to establish | Desktop/mobile visibility to establish |
| --- | --- | --- |
| Small world | A refused claim, a completed workpiece, an interrupted cycle, and a duplicate last ID leaving state/output unchanged. Reset clears history. | Board, brass control, card/reservation facts, commands, and receipt remain distinguishable. The inspector does not create page overflow. |
| Commit window | All three paths reach their final state: one committed output for staying; zero for leaving/passing; interrupted paths retain Bob's reservation. | The close crop retains relevant body/card/control cues, and all choices plus the current receipt can be read. |
| Custody room | At the pickup with view blocked: world/Ed show Ed, Bob retains Bob and the opening source/sequence. With view clear, Bob updates. Selecting a record does not change custody. | The mobile crop retains both people, divider, and card; source, sequence, and record tabs are visible and readable. |
| Hearing room | Far/local fails; near/local receives; far/shout with blocked doorway fails; far/shout with audible doorway receives. A received false floor claim changes Bob's reported record while world stays Ed. Changing setup resets the trial. | Both people and the doorway remain in the mobile crop. Receipt, Bob record, and world record remain distinct when stacked. Sticky mobile controls do not cover required content. |

For the shared rendered gate, confirm keyboard focus, usable touch targets, reduced-motion still states, and no surrounding horizontal overflow. The styles intend to provide these conditions; source review cannot certify the rendered result.

## Acceptance boundary

No source or conceptual change is required before the rendered review. Preserve the manuscript's explicit in-memory retry limit. Do not describe these graphics as production integration proof, a live LLM system, or a lost-acknowledgment simulator. Subject to those limits, all four are purposeful explanatory graphics for the revised foundations chapter.

## Rendered evidence addendum — 27 October 2026

**Selected rendered/framing pass: ACCEPTED. No blocker found in the supplied frames or reported interaction results.** This closes the pending gate for the revised visual argument at the supplied desktop/phone views. It is not an exhaustive retest of the four unchanged runtimes.

Inspected with `view_image`:

- `/tmp/agentic-foundations-visuals/02-commit-desktop.png`
- `/tmp/agentic-foundations-visuals/02-commit-phone.png`
- `/tmp/agentic-foundations-visuals/02-custody-phone.png`
- `/tmp/agentic-foundations-visuals/02-hearing-phone.png`

### What the images establish

**Commit window, desktop.** The title, three route choices, close board view, stage indicator, receipt area, and advance button form a coherent comparison. Both people, Bob's card, the brass control, and the press are legible. The explanatory caption is visually subordinate and adds construction context; the following prose provides the causal interpretation. Nothing in the composition implies that the machine's apparent motion is itself the authoritative output.

**Commit window, phone.** The three controls wrap their labels cleanly inside separate targets, with the selected card-passing route clearly distinguished. The board crop preserves both workers, the card, control, and machine. The receipt continues below the captured viewport through ordinary page scrolling; the image does not show a hidden or overlapping internal result area. The supplied phone frame shows the beginning of that selected sequence, not its final outcome.

**Custody room, phone.** The third step and World record are visibly selected. Both people, the divider, Ed's card, and the actor labels remain inside the crop. The record tabs are distinct, and the light record panel clearly states physical custody with Ed plus the important fact that inspection does not inform the characters. The graphical scene and record panel support one another without requiring the reader to infer custody from a tiny prop alone. This frame establishes the world view, not a fresh verification of Bob's alternate record.

**Hearing room, phone.** The image retains the speaker, listener, doorway, distance, voice setting, and interrupted delivery path. The receipt says “Beyond the selected range,” and Bob's record begins below it with “With Bob.” The false statement remains visibly attributed to Ed. The controls and receipt panels stack without an apparent page-width problem. The world-record panel lies outside this particular captured viewport, so its fixed value was established by source review and earlier runtime coverage, not by these pixels.

### Interaction evidence and its limits

Root reports selecting “Leave before completion” and advancing to the terminal result: the unfinished cycle is discarded because the operator is absent, with no output awarded. That is the expected result and supports the revised causal explanation. Root also reports selecting the card-passing sequence, the third custody step with World record, and speaking to Bob in the default across-room/local-voice setup. The supplied screenshots support those selected states; the hearing image specifically shows the expected range failure.

The terminal interruption was reported by Root rather than captured in these four images. I do not infer an executed terminal card-pass path, clear-view custody comparison, successful false-claim delivery, keyboard check, reduced-motion check, or performance test from this selection.

There is no new small-world screenshot in this set. Its source/concept acceptance stands, and this revision relies on the prior live coverage of its unchanged runtime. The current rendered addendum therefore accepts the revised chapter framing and these selected controls, without relabeling the evidence as a new full four-graphic behavioral certification.

### Final position

The supplied layouts preserve the teaching relationships at desktop and phone sizes. The graphics remain richer than static illustrations because their controls expose relevant counterfactuals, while the new prose now relates those results to AI production systems. No additional visual or wording repair is required by this pass. Optional copy-polish suggestions above remain optional.
