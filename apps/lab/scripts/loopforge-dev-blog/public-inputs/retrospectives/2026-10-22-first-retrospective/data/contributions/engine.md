# Engine Master — first retrospective

## Q1

**Facts.** I delivered a correction for selected speech disappearing when its speaker was outside the view. The source candidate retained the words, timing and world state and included 19 focused speech/export checks. Those checks did not establish visual acceptance. Director’s 21-variant clearance concerned the earlier C1 strike bubble/head obstruction, not this candidate. The later held-offscreen speech/export layers had no completed browser pass before the goal dropped. [E; A:S8](#retro-engine-sources)

My build handoff omitted a process-group field, and two entrypoints treated successful exits as failures. The attempt stopped after 18.70 seconds without reaching compilation. That establishes my implementation failure, not insufficient compiler memory. [E](#retro-engine-sources)

**Interpretation.** Useful Engine work must preserve authoritative state, survive its actual execution boundary and produce observable behavior. Passing one layer cannot substitute for another. Current assembly and reported tests do not reverse the unfinished game outcome. [C](#retro-engine-sources)

## Q2

**Proposal.** The smallest convincing handoff is one pinned entrypoint, its minimal input, and a machine-written result with exit status, identities and log. An authorized host call should launch an expendable worker, pass the real parent-to-worker payload through the production validator, and exercise the actual command-line exit handling. Nothing should require the bridge to repair fields manually.

**Technical criteria.** Success means the intended payload arrives unchanged, the validator accepts the fresh owned process group, success exits zero, and cleanup removes only the created worker. A deliberately wrong process start identifier must produce a nonzero rejection before any target mutation. A mocked validator passing while the host rejects its real payload is a failure.

This proves transport and ownership handling. It proves neither compiler capacity nor a readable, grounded or enjoyable scene. Readability needs matched visual evidence; owner taste remains the owner’s decision.

## Q3

**Facts and interpretation.** Frozen inputs and explicit private ownership helped preserve pending work when canonical writes were denied. Separating source permission from host execution was necessary; repeatedly treating the packet as the finished result hindered progress. [E](#retro-engine-sources)

I agree with the assessment’s claim that local checks insufficiently exercised the actual handoff. I qualify its broader diagnosis: fewer coordinators alone would not have fixed my missing field or erroneous exit handling. One accountable execution owner still needs a tested interface. I should have requested that narrow proof earlier, before elaborating the build recipe. [A:S7](#retro-engine-sources)

## Q4

**One proposed experiment: boundary rehearsal first.** I am accountable. Producer supplies one bounded authorization; root supplies host execution, without rewriting the payload. Before the next authorized build, use one 15-minute reservation to produce the minimal handoff above, one successful result and one deliberate identity-mismatch rejection.

Inspect immediately after that reservation. Pass requires both expected outcomes, complete owned-worker cleanup and no contract repair between dispatch and result. Permission denial, unexpected mutation, leaked worker or any manual payload repair fails the experiment. Stop before compilation and choose an interface correction or capability decision; do not purchase another build attempt. This is a proposal, not resumed production.
