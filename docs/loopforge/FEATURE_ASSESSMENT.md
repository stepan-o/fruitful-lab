# Does this belong in Loopforge?

Feature assessment · Proposed review method · 20 October 2026

A feature earns its place by improving the experience of running this particular factory and getting to know its people. The ambition is a world the player wants to watch and remembers through the people who live there. bob provides a continuing protagonist within it; the operator has limited influence and incomplete knowledge. “STILETTO hit bob” is one expression of that ambition. So are “bob finally asked sam for help” and “mae stayed to see whether anyone noticed her work.”

This assessment applies to mechanics, characters, dialogue, rooms, presentation and underlying technology. It follows the [character dramaturgy foundation](CHARACTER_DRAMATURGY.md), the [Producer vision](sources/producer.md) and the [Puppeteer doctrine](sources/puppetteer.md). The owner has established the direction; the review method below is a proposal for putting it into practice. Its purpose is to make design decisions better, not to produce an impressive score for every idea.

## Begin with the encounter

Before specifying the mechanism, describe one encounter the feature would improve. Name the people, what they want and what makes the situation difficult. State what the player should feel, notice or become curious about. Then follow the encounter far enough to show why it matters tomorrow.

For example: bob reaches a handoff and waits. After the morning at Security, moving without permission no longer feels safe. STILETTO sees an idle station and presses him to hurry. sam tries to make the instruction clear. The player recognizes the hesitation, understands some of its cause and has a reason to reconsider the next assignment. This encounter gives memory, dialogue, animation, pacing and player controls a common job.

A feature may serve only one part of that encounter. A quieter floor texture makes bob's hesitation visible; it need not invent another relationship. A memory system supplies continuity; it does not earn credit merely by storing more facts. Assess each contribution against the scene it enables and the existing features it depends on.

## Six questions for the review

For each question, record **strong**, **adequate**, **weak**, **unknown** or **not applicable**, followed by one sentence of evidence. Strong means a clear improvement over the current version; adequate means the feature serves its purpose without a material loss elsewhere. Weak means the intended effect is absent or undermined. Unknown means it has not been demonstrated. Use not applicable only with a reason. Do not add these judgments into a total: beautiful staging cannot compensate for a false choice.

| Question | What earns its place | What weakens the proposal |
| --- | --- | --- |
| **What becomes worth watching?** | A particular tension, pleasure, surprise, achievement or moment of care that the player can anticipate or remember | Activity, spectacle or conflict with no reason to care who is involved |
| **Who becomes more particular?** | Conduct, speech and appearance reinforce a known person; an event changes what that person attempts or whom they trust | Interchangeable workers, personality labels, exposition that never affects action |
| **Can the player follow the relevant change?** | An event is legible live or through credible later traces; the long arc remains understandable while private details can remain unknown | Required context is unavailable; every event demands a camera cut; characters know things they never learned |
| **What is the player’s relationship to it?** | Direct choice, earlier indirect influence, observation, later discovery or a deliberately private encounter is identified; available powers and limits are honest | A cosmetic choice, compulsory intervention everywhere, or blame for a power the player never had |
| **What continues beyond this moment?** | A changed routine, relationship, resource or expectation creates a later problem or possibility | A disposable incident that resets; more content without a new connection to the existing plot |
| **What does the experience have to carry?** | The benefit justifies screen time, reading, decisions, visual noise, production effort and runtime cost | Another meter, interruption, asset or subsystem doing a job an existing element could do better |

The intended emotional range includes amusement, affection, frustration, pride, dread and relief. A proposal does not score better by making every scene harsher. Quiet work and successful cooperation give later disruption something to disturb.

## Conditions a strong feature cannot excuse

**The world must keep its account straight.** Actions need participants, means and an opportunity. Consequences must follow what actually occurred. An agent's belief may be wrong; the game must preserve how that belief was acquired. A beautifully performed scene fails if bob is injured in a version where nobody struck him.

**The player must be able to learn the limits of their power.** Restricted agency is part of Loopforge. The opening can offer only a few assignments, and a supervisor can resist an instruction. The player still needs evidence of what they chose, how it was received and what might be done next. Different choices may converge, but that convergence needs a cause. A conversation can be meaningful without changing the assignment if it changes a commitment, relationship or information available later; the game must show that difference.

**The presentation must survive its intended conditions.** A cue needed on the factory floor must work at that scale and within the target device's performance budget. Essential meaning cannot depend only on a tiny detail, sound, color or optional glow. Use the existing graphics and accessibility acceptance checks. Do not invent a passing performance claim from a design document.

A failed condition means rework before shipping. An unknown condition means a bounded prototype, with the missing evidence named. Technical safeguards can be necessary even when players never notice them; identify the failure they prevent and the experience that failure would damage.

## Review attention and agency separately

An encounter can be valuable without offering an intervention. State whether the player chooses within it, influenced its conditions earlier, can only witness it, may discover it later or is not meant to know it. Then assess whether that relationship is clear and fair. Do not mark an autonomous encounter weak merely because it contains no button.

Also state its place in the longer story. Does it establish bob’s routine, change a relationship, bring another worker forward, deepen a conflict or provide needed relief? A peripheral encounter need not mention bob, but the whole sequence must preserve a protagonist and a manageable foreground of concerns. More activity can make the story harder to follow.

For offstage events, distinguish world fact, witness knowledge and what the player can discover. An empty station is evidence of absence, not proof of injury. A remark from lou needs a source. Essential context for the next consequential decision needs an available route back into view; other details can remain private. Assess the six-room attention problem without demanding six simultaneous detailed renders or compulsory replay of every missed scene.

For pressure-driven features, trace whose demand becomes whose difficulty. Include a credible way to relieve or redirect the pressure. If every player treatment leads to the same deterioration, investigate whether the design is manufacturing an outcome.

## Compare ways to get the effect

Review at least three versions: the proposal, a simpler use of existing elements, and leaving the feature out. Include the strongest competing approach when it changes the experience materially. Keep the desired encounter and camera conditions comparable. Compare the benefit of the next increment, not the total appeal of the game with and without all of its foundations.

A supervisor reaction could be shown with a new anger meter, a change in posture, a pointed line to a colleague, or a later refusal. These are not interchangeable decorations. A meter offers precision; posture gives immediate evidence; dialogue identifies a belief; a refusal turns that belief into a problem the player must address. Choose the combination that serves the encounter. Sometimes one clear refusal will do more than four simultaneous signals.

There are several recurring ways to strengthen a weak proposal: make the participants more particular; give an action a later consequence; make a consequence easier to see; or give the player a difficult but understandable way to respond. Try those changes before adding another system. “More dramatic” is not a sufficient direction for a revision—say which relationship, expectation or decision will become stronger.

## Examples using the current factory

These are assessments of design proposals, not playtest results.

| Proposal | Simpler or stronger alternative | Provisional decision and proof needed |
| --- | --- | --- |
| Put a name over each of ten identical workers | Keep names, but distinguish a few through repeated conduct, silhouette and who reacts to them | **Rework.** Names are useful; establish bob, sam and ed through the opening and a later handoff. Ask whether a viewer recognizes them and expects different reactions. |
| Show a constantly updating stress number above every worker | Show bob waiting, sam checking on him and STILETTO reacting to the delay; keep diagnostic values in author tools | **Prototype the world feedback first.** Check whether players can explain the delay and choose a response. Add a player-facing value only if it solves a remaining information need. |
| Add a memory that the Security treatment affects bob at Conveyor | Reuse the existing wait, injured walk and dialogue cues for one later encounter before building a large memory catalogue | **Prototype.** Run two treatments and compare bob's later conduct. No injury or witness knowledge may appear without its cause. |
| Add a marker whenever bob leaves a room | Let established routines, a changed task and an attributed account support discovery; offer navigation when the player wants it | **Prototype.** Ask whether players notice his absence and can investigate without interpreting every absence as danger. No invented traces or mandatory interruption. |
| Give the player another button that produces the same assignment | Let the conversation establish a promise or disagreement that is remembered, or remove the redundant button | **Rework.** Show a real distinction the player can discover. Do not advertise a branch that the world ignores. |
| Increase every robot's mesh detail | First compare silhouette, paint, scale, lighting and camera distance using the existing models | **Defer the blanket upgrade.** Test identity without labels at the intended room and console sizes, then measure runtime cost. Close-up improvement alone does not justify a crowd-wide cost. |
| Optimize the crowd's animation update cost | First preserve the poses and timing that distinguish workers and carry the interaction; reduce work where it is not perceptible | **Build a measured improvement if profiling supports it.** Compare the same encounter for readability and sustained performance on the target machine. |

## The smallest proof that can change the decision

Begin with a script or storyboard when the uncertainty is about the encounter. Use the existing models for a staged sample when the uncertainty is gesture, composition or timing. Use a playable slice when the claim concerns a player's decision or an agent's response. An authored scene proves a performance is possible; it does not prove autonomous behavior or player agency.

Before the test, write down the observation that would count against the proposal. For the bob handoff, it might be that viewers notice a delay but cannot connect it to the morning, or that changing the player's treatment makes no visible difference. For a new visual cue, it might be that recognition improves only in a close-up. This keeps the review from accepting any result as confirmation.

Let someone encounter the sample without explaining the intended interpretation first. Ask who mattered, what each person was trying to do, what changed, what they think their choice affected and what they want to see next. A different emotional response can still be a success. Confusion about the action, lack of interest and disagreement with a supervisor are different findings and should be recorded separately.

Record the build, scene, setting, device and number of viewers. A creator's inspection is useful evidence of a visible defect; it is not a player comprehension study. Small qualitative reviews guide the next iteration without certifying the whole game. Recheck the feature alongside its neighbors: several individually useful speech bubbles can become a room nobody can follow.

## Make a decision, with a reason

Use **build** when the benefit is supported, the conditions pass and the cost fits the current milestone. Use **prototype** when the promise is strong but one important claim remains unknown; specify the smallest test and stop point. Use **rework** when the need is real but this approach is weak. Use **defer** when the benefit depends on a later arc or would displace a more important piece. Use **cut** when an existing element or a simpler alternative serves the same experience better.

Among eligible proposals, first address failures that prevent the current episode from being understood or enjoyed. Then choose the change most likely to strengthen the next playable arc or resolve its largest uncertainty. Reuse across later Act 1 encounters is a benefit, but an imagined future cannot justify an unbounded system now. Assess a required cluster together when its parts have no sensible value in isolation, and still deliver it through a small end-to-end proof.

Record the decision where the feature is proposed and link it from its implementation work. Reopen it when new evidence changes the judgment. Existing features receive the same review; effort already spent does not establish their value. The questions below are a working record for designers and builders, not a new screen for the player.

## Actual Day 1 evidence and review

24 October 2026 milestone · Demonstrated R10 slice approved by the owner; later integrated corrections await review.

The current [Day 1 scene](/stepanoskin/loopforge/play/scene-studies) carries a connected encounter through admission, Conveyor learning, a growing shift, production, departure and night. This is implemented scene behavior in the demonstrated slice. It does not establish the broader game's later-day economy, autonomous planning, alternative histories or long-term character consequences. Those remain separate design and implementation claims.

The independent review used actual captured screens and sampled frames from published tree `ec757b5e723c9213e66a45fe3fa9d777e6e1a448`. Two videos supplied the frame samples, with a declared diagnostic interruption between recordings. The critic did not watch continuous playback or hear sound. The owner approved the demonstrated slice; the technical findings below preserve that approval rather than asking for a new taste decision.

### What the encounter earns

The opening gives three recognizable kinds of attention to bob. LIMEN enforces his stop, sam attends to the person who has been hurt, and ed takes up the card. STILETTO's demand for an empty line to be filled leads into work. These actions give the factory an immediate social structure. The present opening has LIMEN strike bob; earlier hypothetical examples elsewhere in the design record do not change that chronology.

bob's small frame and paired eyes remain useful anchors among the workers. sam's broader body, LIMEN's mass and STILETTO's long black/red silhouette help identify different roles. Their value depends on the actual view: a readable name cannot compensate for covering the performer with a speech panel. The approved identity stays; the presentation needs to let it work.

The four tutorial controls name concrete operations: Seat the brain, Run the wash, Start the main belt and Compress the brain. Reading holds allow the player to inspect the instruction before committing the next step. Later controls start staffed work and end the shift. These are observed participation points in a guided scene. The other characters' conduct is witnessed; it should not acquire artificial buttons merely to resemble a branching choice.

The terminal evidence records three outputs: one tutorial, one paired and one staffed. All twelve cast members have departed at night. The ending presents completion, the output count and Restart, including in the captured 320-pixel ending view. This demonstrates closure for the scene. It does not prove full mobile gameplay or that an unfamiliar player understands every relationship.

### Apply the six assessment questions to this slice

| Question | Current evidence and limit |
| --- | --- |
| What becomes worth watching? | Coercion, care and procedural attention affect the same person, then lead into work. Sampled images establish the sequence; its emotional timing still needs moving review. |
| Who becomes more particular? | bob, sam, ed, LIMEN and STILETTO have distinguishable conduct and several readable silhouettes. Face-covering panels weaken that distinction in the actual view. Recognition by unfamiliar players has not been tested. |
| Can the player follow the change? | Named station controls, changing crew occupancy, output and night give the day a visible structure. Misleading clock text, cropped action and an obstructed departure are required corrections. |
| What is the player's relationship to it? | The player advances six named work/closure steps and witnesses the intervening conduct. This run does not demonstrate strategic alternatives or a choice changing a later relationship. |
| What continues beyond this moment? | The same people recur during work and departure, and the result carries a count. Persistent consequences in subsequent days remain unproven by this capture. |
| What must the experience carry? | Reading, dialogue, camera changes and automatic work all consume attention. A slow staffed interval and interrupted diagnostics prevent a controlled pacing or performance conclusion. |

These are separate judgments. A complete ending does not cancel a false clock, and an appealing cast does not establish a meaningful branch. Conversely, an autonomous encounter does not fail merely because the player cannot intervene in it.

### Required corrections and preserved decisions

Five observed presentation defects need correction: speech and credential panels covering faces; End of shift appearing before work has finished; bob's body being cropped at tutorial gates; an arms-out travel pose persisting across departure positions; and foreground facade geometry hiding the exit shot. Each has an exact captured view or sampled interval in the independent review. Source causes are not established by the pictures alone.

Keep the approved cast and room direction, the reading holds, the four explicit tutorial verbs, the progression from solo to paired to staffed work, and the distinct night result. A small optional wording improvement can distinguish the first staffed output from the cumulative total. It must preserve the three output categories rather than altering mechanics to fit a label.

The automatic staffed-work slowdown remains a required investigation. Its capture is not a controlled comparison: focus, recording and diagnostic conditions changed. Logical ticks, rendered frames and wall time must be reported separately. Sam's precision polish remains deferred; these findings do not authorize a blanket animation or asset replacement.

### The next proof

Review the corrected integrated build through the ordinary controls to night, with exact build identity, viewport and declared capture conditions. Include the speech-to-action transitions, the worker's move from inspection into travel, and the facade passage. A fixed still can close a static overlap; it cannot close locomotion, weight, grip, continuity or pacing. Continuous playback and sound remain separate evidence needs.

After the presentation corrections, propose one unfamiliar-viewer encounter without an explanation of the intended interpretation. Ask who acted on bob, how sam and ed responded, what the player changed, why the total is three, and what the viewer wants to know next. Record confusion, disagreement with a supervisor and indifference separately. This is a proposed comprehension check, not an additional owner approval ceremony.

A bounded KEEP states what passed, in which version, and what remains unknown. The earlier S4 storyboard findings remain useful design evidence, but they cannot supply a pass for the actual Day 1 game. Engine owns integration, Producer owns reconciliation, and the corrected replay must establish what changed for the person playing.

### Captured evidence

![LIMEN's speech panel hides his face in the captured opening.](/loopforge-dev-blog/media/2026-10-25-day-one/r10-opening-dialogue.png)

Figure 1. Actual R10 capture, factory 08:00:11. The naming and dialogue are readable, but the body delivering them is hidden. This is a composition defect, not a request to redesign LIMEN. Capture: Producer-operated studio browser.

![A departing blue worker holds both arms sideways while crossing the foreground.](/loopforge-dev-blog/media/2026-10-25-day-one/r10-departure-arms-117s.png)

Figure 2. Actual decoded continuation frame at PTS 117. The preceding sampled positions establish persistence; this single image does not prove locomotion timing or diagnose the rig. Capture: Producer-operated studio browser; frame extracted by Animator.

![Facade geometry blocks almost the entire departure view.](/loopforge-dev-blog/media/2026-10-25-day-one/r10-departure-obstruction.png)

Figure 3. Actual decoded continuation frame at PTS 118. The corrected replay must show the exit action rather than the inside of foreground dressing. Capture: Producer-operated studio browser; frame extracted by Animator.

![The night image and completed-shift controls at320pixels wide.](/loopforge-dev-blog/media/2026-10-25-day-one/r10-night-320.png)

Figure 4. Actual approved R10 ending at 320 pixels wide. The image, completion message, three outputs and Restart are visible. This does not establish full mobile gameplay. Capture: Producer-operated studio browser.

## Copyable feature review

1. **Proposal and milestone:** What are we considering, and why does this arc need it now?
2. **Encounter:** Who wants what, what happens, and what should the player feel or become curious about?
3. **Continuity:** What does the player already know about these people, and what changes in a later encounter?
4. **Attention and agency:** Is this chosen, indirectly influenced, witnessed, discovered later or private? What can the player do, what can they know, and what uncertainty is intentional?
5. **Alternatives:** Proposed version, simpler version, no addition, and any stronger competing approach.
6. **Assessment:** A judgment and evidence for each of the six questions. Separate observed effects from expectations.
7. **Conditions and cost:** Causal integrity, fair limits, presentation/accessibility, attention, authoring and maintenance, dependencies and measured runtime where relevant.
8. **Smallest proof:** The scene or slice to test, who will review it, and what finding would make us change course.
9. **Decision:** Build, prototype, rework, defer or cut; reason, owner, next step and the evidence that would reopen it.

[Character foundation](CHARACTER_DRAMATURGY.md) · [Writing Loopforge](EDITORIAL_VOICE.md) · [Reference studies](NARRATIVE_STUDIES.md) · [Back to the Dawn case study](BACK_TO_THE_DAWN_CASE_STUDY.md) · [Opening cast](OPENING_CAST.md) · [Opening episode](OPENING_EPISODE.md)
