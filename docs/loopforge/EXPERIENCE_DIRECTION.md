# Loopforge — the interface belongs to the factory

Owner direction, 8 October 2026. Applies to the landing, playable console, camera views, briefings and future live factory. Read alongside the repository’s [design and performance standards](../DESIGN_AND_PERFORMANCE_STANDARDS.md).

## The guiding principle

**Visceral conveyor and factory operations are the foundation of the interface.** The accepted landing conveyor is the reference: weight, uneven momentum, friction, light crossing machinery, stoppage, and a deliberate act that restarts the line. Carry that physical logic through the game UI. It must feel responsive *with* the factory.

Direct artwork, transitions, typography, lighting, motion, SFX and eventually music as one experience. Each layer reinforces the same mechanic and theme: more minds produced, workers consumed by pressure, authority delegated to imperfect supervisors, consequences that remain after the machinery resumes. A satisfying button alone is insufficient if the world ignores the decision.

The player’s central first-day choice is whom to trust with authority. The resulting production line gives that choice tangible meaning. The quota supplies continuing pressure; the workforce and equipment reveal what output costs. Clear information and enjoyable play take priority over exposing the whole simulation.

## Borrow pacing, preserve identity

Frostpunk is a reference for connecting a central machine and survival pressure to emotional decisions; for foregrounding an illustrated account while the world remains behind it; and for coordinating image entrance, sound, pause and commitment. Its lead designer explicitly connects the console interface to the generator’s central spatial role and argues for clearer presentation rather than reducing underlying complexity. [Developer account](https://blog.playstation.com/2019/10/10/adapting-frostpunks-complex-city-building-for-ps4-out-tomorrow/).

Visual study: [convoy decision composition](https://www.gamewatcher.com/reviews/frostpunk-review/13025) and [housing decision screenshot](https://abbysblog.net/blog/frostpunk). The observed composition uses a legible illustrated foreground and compact decisions, with the wider world receding behind it. Fade and audio timing below are our proposed direction, not measured reproductions of Frostpunk’s implementation. No Frostpunk artwork or audio is shipped.

Loopforge retains soot, worn brass, industrial green-black, cyan cognition and Stiletto red. Its character comes from its own painted factory art and mechanical rhythm. Avoid generic dashboard cards, pristine science-fiction glass, cartoon apparatus and unmotivated glitch decoration.

## One event, one directed response

| Factory beat | Visual and interface response | Sound direction | Mechanical meaning |
| --- | --- | --- | --- |
| Arrive | Factory emerges through darkness; type settles after the image establishes the place. | Distant power and room tone; music enters only with permission. | You inherit an operating system with demands already in place. |
| Choose an adviser | The chosen figure comes forward; their competing colleague recedes. Briefing topics appear as readable comic panels. | Intercom relay and a distinct supervisor signature. | One adviser is committed for the day; no placements yet. |
| Approve a plan | Assignments lock into the room labels. The delegated room’s authority is explicit. | A weighted latch, not a celebratory reward sting. | Your order is accepted; a supervisor remembers an override. |
| Start the shift | Contact indicators engage; the same cameras become live. Movement acquires an uneven machine cadence. | Contactor, motor spin-up, low machinery bed. | The accepted plan begins producing outcomes. |
| Complete a batch | Output advances once; a restrained local highlight connects the batch to the ledger. | Outtake latch, capped so production never becomes notification spam. | Real produced units, still awaiting allocation. |
| Accumulate strain | The relevant camera and condition readout show load. Disturbance is localized, not random across the whole UI. | Irregular knocks, electrical chatter, more stressed motor texture. | Exposure and equipment condition have changed. |
| Adviser acts autonomously | Briefly foreground their action and its result; leave a durable record. Do not offer a fake approval button. | Intercom intervention followed by the relevant machinery response. | Authority belongs to the adviser in their actual assigned room. |
| Decision elsewhere | Factory recedes, relevant scene and adviser account come forward. Response options state consequences and whether they override. | Warning cue, machinery ducked; silence creates space for judgment. | Simulation pauses for a consequential decision. |
| Injury or damage | Sharp, localized interruption followed by an uncomfortable stillness. Worker and equipment changes remain visible after the cue. | Impact, power interruption, then a gap. | Loss is not just a transient red flash. |
| Resume | The selected response completes, record updates, then the line resumes. | Mechanical engagement appropriate to the outcome. | An accepted command changed the world. |
| Allocate | Preview two destinations; confirmation visibly seals the split. | Dispatch gate for delivery; activation for retained workers. | Irreversible allocation, not an adjustable resource slider afterward. |
| End the day | Cameras settle; ledger and supervisor reactions remain together. | Motors wind down; ledger feed; score resolves without erasing unease. | Tomorrow inherits machinery, people and memories. |

## Timing and restraint

- Fast controls acknowledge immediately; only a server-confirmed command presents a committed world change. Pending and disconnected states remain honest.
- Proposed choreography: control press 80–140 ms; ledger acknowledgment 160–240 ms; scene/briefing crossfade 350–650 ms; arrival 900–1,600 ms. These are starting ranges for review, not mandatory delays on input.
- The world remains spatially identifiable during a decision. Fade through atmosphere and light; avoid unrelated page wipes, bouncy menus and forced cinematic waits.
- Use the same scene for compatible states, adding restrained effects. Change artwork when the depicted action or consequence changes. Never display a graphic accident plate for a harmless warning.
- New artwork fades in only when ready. No black image-loading hole. Keep the last confirmed camera visible through reconnection.
- No invented warning pulses, arbitrary sensor values or random glitches implying nonexistent accidents. Cosmetic grain is neutral texture; alarm cues require a known event.
- A cue ends; its consequence stays in the readouts and record. The player can inspect who acted, what changed and why.
- At faster playback, coalesce ordinary cues. Never accelerate a warning into a strobe or stack a wall of production sounds.

## Sound and eventual soundtrack

SFX categories: console relays; supervisor intercom signatures; briefing handling; shift contactor/motor; batch outtake; line strain; decision warning/duck; accident impact/silence; override transmission; allocation seal/dispatch/activation; shift-end ledger.

Music is a separate authored layer, not continuous reinforcement of every click. Plan stems for the working pulse, mounting pressure, deliberation space and aftermath. Crossfade from known episode states; duck under intercom and critical signals. Avoid triumphant rewards for output whose human—or robot—cost is still unresolved. The first build has optional original procedural SFX and machinery ambience. It does **not** claim a finished recorded sound library or soundtrack.

Use separate effects and music controls once music exists. Start silent until the player enables sound. Cap concurrent one-shots, normalize source levels, stop hidden-tab work and suspend audio. A future audio asset pack can replace the cue sink without changing the kernel, protocol or decision rules.

## Causality and accessibility

The presentation consumes the knowledge-filtered event stream. It cannot invent simulation outcomes, update hidden state or depend on frame rate. Cue IDs prevent replays/reconnections from duplicating feedback. Timing interpolation belongs to the viewer; committed ticks belong to the engine.

Every important sound has visible text or a readable state change. Reduced motion and the atmosphere toggle preserve complete decision information. Use bounded opacity/transform effects, stable text, restrained contrast changes, clear keyboard focus and 44px touch targets. Mobile must retain the quota, chosen adviser, affected room and current decision without requiring a desktop-sized camera wall.

## Review questions

1. Can the player connect their choice to an action on the line, a measurable consequence and a supervisor’s reaction?
2. Do image, motion, light, sound and text tell the same story at the same moment?
3. Is the physical feeling distinctly the Loopforge conveyor, rather than a generic strategy UI?
4. Does a bad outcome remain legible after the dramatic effect ends?
5. Does it stay clear with sound off, reduced motion, a narrow phone and an interrupted connection?
6. Does the owner enjoy playing it and want to try the other adviser? Visual polish does not answer that playtest question by itself.
