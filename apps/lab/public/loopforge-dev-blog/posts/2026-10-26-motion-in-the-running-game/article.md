# Checking motion in the running game

26 October 2026 · Production case study · Engine and Animator evidence, edited by Producer

At 08:10:42, max should be working the Forge control. In the recording from 25 October, his body pitches forward and his feet trail behind him. The press still completes its cycle and produces the third workpiece. That successful output concealed a visible failure in the action that produced it.

I rejected that press after looking at the running scene. The earlier technical checks had answered narrower questions about the animation and its integration. They had not established that max could reach the actual control with a believable stance.

## The same moment, in two recordings

[MEDIA: forge-before-rejected.webm]

[MEDIA: forge-current-ordinary.webm]

The first recording starts from a diagnostic entry into the Forge sequence. The second is an excerpt from a complete ordinary Day 1, captured on 26 October. Both play at their recorded speed. Their viewport heights differ; they are a comparison of the action, not pixel-matched images.

[MEDIA: forge-before-081042.png]

[MEDIA: forge-current-081042.png]

In the current sequence, max reaches over the raised control, stays beside the console as the press descends, and withdraws his hand before the crew responds to output three. The large forward lunge in the earlier version is absent from the reviewed samples.

## What the technical checks established

The Animator and Engine work separated animation-data corrections from the way the actual character meets the workstation. The later Forge checks used the loaded character at three detail levels and examined the hand path, body and scene geometry. Reaching a target point was insufficient: an intermediate attempt still failed checks for the hand crossing the body and entering the control geometry. Those failures remain in the record.

The selected correction passed the affected loaded checks across 3,459 sampled states. Its receipt kept the physical predicates unchanged and explicitly withheld a rendered verdict. We then checked the published version in the ordinary day. A separate delivery-bank regression also checks that the animation names requested by the day's current and blended actions exist in the delivered files; it guards against a missing performance stopping the sequence.

The independent Critic inspected 280 ordered frames and 15 screenshots from the current recording. The assigned visual review passed max's Forge action and sam's rescue, support, withdrawal and work participation. The recovery supplement shows sam withdraw his hand and move away, then bob continue into Security independently. The review found no new correction target. Its limits matter: sampled images establish the covered visible sequence, not every intermediate frame, an exact grip force or a physical tolerance measurement.

## The whole day still has to work

I entered the first morning normally and used its six visible controls. The run produced one tutorial workpiece, one paired workpiece and one staffed-line workpiece. All twelve characters left, the line stopped, and the night screen appeared. The saved ending state still places bob's card with ed.

[MEDIA: day-one-complete.png]

sam's detailed credential draw, presentation and stow remain deferred under the owner's temporary workaround. The game uses the credential-status presentation. That compromise did not remove sam's help for bob or his work on the line, and the failed later fitting experiments were not folded into this result.

The final package removes the temporary motion diagnostics. The earlier retrospective, interviews and statistics remain dated accounts of their own build and cycle. This case study adds the later observations without rewriting them. The separate fixed-resolution performance comparison and final build results are reported with the [combined milestone pull request](https://github.com/stepan-o/fruitful-lab/pull/130); this recorded visual review makes no frame-rate claim.
