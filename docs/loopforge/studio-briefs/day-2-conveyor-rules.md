# One line, two supervisors

**Loopforge v2 · Day 2 Conveyor minigames · GAME SYSTEMS DESIGNER · 20 November 2026 · Specification for owner review**

At Forge, a loaded carrier sits under the press. max looks straight at LIMEN, foot beside the treadle. Press **Clear** at Forge and LIMEN gives the call max has learned to wait for. Keep watching and the press stays up while the shift clock runs. On STILETTO’s floor the same press runs as soon as its crew and load are ready. The player’s hands are busy elsewhere, picking a worker portrait and finding the station where that worker will save the most time.

The owner approved the two games, a fixed shift clock, one carrier per station with several in flight, visible worker stats and station needs, and the scope of this handoff. The numbers, colors, interruption schedule and staffing limits below are first-playtest settings. The timed examples are predictions from these settings. The live player is the earlier two-room simulation.

[Play the existing 2D Shifts](/loopforge-shifts/index.html) · [Regular opening, 2P–2G](/loopforge-design/days-2-4-table-read.html#day-2-the-photograph) · [Swapped opening through the second delivery](/loopforge-design/studio/day-2-stiletto-reading.html#table-read) · [WRITER’s entry contract](/loopforge-design/studio/day-2-conveyor-minigame.html)

## What the player does each day

Choose an adviser’s complete room assignment before the crew arrives. Security plays its supervisor’s scene and produces individual passages, failures, absences and an arrival order. Earlier clearances can supply a running Conveyor while the desks are still occupied. A room switch is free and time continues. Day 2’s single exceptional intervention can admit bob on a daily pass. The selected Conveyor supervisor determines the controls for the whole shift.

| Conveyor supervisor | Player input | If the player keeps watching |
| --- | --- | --- |
| LIMEN | Tap a ready station’s Clear button to have LIMEN call that station. Automatic assignments follow the seeded passage order. The crew’s stats have no effect on processing time. | An operation already cleared can finish and its carrier can travel. At the next unchecked operation, the worker waits. A full downstream station can eventually hold up the whole line. |
| STILETTO | Select one available portrait, then a station. Repeat for new arrivals or move someone already working. Production starts automatically at a staffed, supplied control. | Existing assignments persist. A staffed line keeps producing until a physical hold or the bell. An uncovered control can leave a worker upstream holding a finished carrier and a worker downstream waiting for one. |

Clear presses and portrait assignments cost zero interventions. The opportunity cost is real time, including movement between posts. Spending the pass changes which portraits can reach Conveyor. Use one authoritative bell tick per shift. For initial tuning keep the current 2,400-tick (120 s) work window from the end of morning posting. Count time already used in Security and the scripted Conveyor opening. Assign the deadline once, and preserve it on all camera cuts and saves. At the bell, add the shift’s new rack arrivals to the weekly quota. Carry this daily loop through Day 7. Day 1 supplies the established tutorial and its three rack arrivals. The third room opens after week one. Quota target and later-room play belong to their own designs.

## Four stations and one rack

| Station | The player can read | The worker does |
| --- | --- | --- |
| Intake | Brain seated in a carrier, or empty cradle available for the next brain. | Seats the next brain. The completed load can travel into Wash’s empty receiving cradle while its operator is away. Wash still needs a worker before its cycle starts. |
| Wash | Drum running, then stopped with a clean brain. A waiting carrier stays visible here while Belt lacks a receiver. | Runs the wash. Retains the clean carrier until Belt is empty and a worker is there to take it. |
| Belt | Carrier at the clamp, clamp engaged, then the loaded carrier approaching Forge. | Engages the clamp and sends the carrier when Forge has space and a receiver present. |
| Forge | Loaded press, max’s foot off or on the treadle, then the press retracting. | Makes one loaded stroke. After retraction the finished cortex travels to the rack. |
| Rack | New arrival and daily count. Day 1’s three existing cortexes stay in the historical total. | The output tray receives the cortex. Rack helpers handle the load and collect empties when present. The physical tray accepts delivery if both helpers are elsewhere. |

Each station holds one carrier. The source stays occupied during a transfer and reserves the destination exclusively for 10 ticks (0.50 s at 20 Hz). On receipt the destination owns the carrier, the source becomes free and its worker can accept another. A downstream operator who has committed to receive stays through contact. Receipt of a carrier and receipt of a spoken clearance are distinct events. A full receiver leaves the completed carrier at its source, with progress intact. When the obstruction clears, the pending transfer starts automatically. A finished operation needs only one clearance.

An empty Intake stages one new raw carrier automatically when its operator is present and the shift is open. Start with the actual in-flight inventory. Each carrier has a stable ID from staging through delivery. A new load may enter Intake while other carriers occupy Wash, Belt or Forge. On the floor, distinguish **needs worker**, **ready**, **waiting for clearance**, **working**, **waiting for Belt/Forge** and **in transit**. Put the reason at the affected machine. A stopped press can then tell two different stories: on one floor max can see the load and needs a call. On the other his foot is ready and he has nothing to press.

## LIMEN calls every station

On the worked Day 2 swap all ten have passed. sam and ed share Intake and its tray bench, bob is at Wash, jo at Belt, max at Forge, gus and lou at the rack, mae at feed, kit at drive and ben at relief. STILETTO paces the six strides between her desk and the gate. Restore her actual position and direction. For this reading preserve the authored assignment. For a fresh unscripted shift, take the seeded Security passage order, fill Intake, Wash, Belt and Forge first, then tray bench, rack, feed, drive, opposite rack face and relief. For the authored placement, the slot order corresponds to sam, bob, jo, max, ed, gus, mae, kit, lou and ben. The review seed must reproduce that mapping. Posts start contributing on arrival. Never redraw posts on a reload.

Each station has one **Clear** button at its operating position. Display the station and its current reason in its accessible name or description. A ready carrier, an operator at the control and an available call from LIMEN enable it. A finished load can wait at its output even when its receiver is full. Show the hold and disable Clear for that finished load. New raw work at Intake can be ready at the same time as a delivered load at Forge. The player may choose either. Watching another room, tapping a disabled control or repeatedly pressing during a call never banks a clearance.

A valid tap commits LIMEN to that station and carrier. His name and station appear together on the call. Use a 10-tick call to the operator for the timing fixture. A receipt by that operator starts the operation. LIMEN can take his next call after this one finishes while other machines continue. A temporary loss of hearing clears when noise subsides or LIMEN moves within earshot. If the operator misses a call, show **Call missed** at that control, release the call channel, retain the ready load and offer Clear again when the call can reach them. A different receiver or a clearance spent on the previous load cannot authorize the stroke. A worker who has left a machine loses unused permission. Keep already completed work.

| Intake | Wash | Belt | Forge |
| --- | --- | --- | --- |
| 50 work ticks · 2.50 s | 60 · 3.00 s | 30 · 1.50 s | 40 · 2.00 s |

The approved empty stroke is physical business before the minigame. It uses time, stops the crew and produces zero. After that stop, max prefers to wait for his own call. The regular Clear control only admits loaded operations. An explicitly authored early stroke can still animate, record who saw it, and trigger a stop without advancing a carrier. On recovery, retain completed stages, release invalid reservations once the equipment settles and request a fresh call for any operation still awaiting permission.

**Protocol interruptions.** Preserve both approved two-second silences at their positions in the opening. After handoff use a separate seeded interruption stream. Proposed tuning draws the next eligible interval uniformly from 12–20 seconds of running shift time. If it expires during a call, let that call finish, then start the interruption. LIMEN must have an observable subject, such as a worker waiting for clearance or a finished load held at a receiver. Keep an overdue interruption pending until a subject exists. Use the stored shift seed and a dedicated draw cursor, so choosing a worker conversation cannot move the interruption. Select an eligible WRITER-approved Protocol line or silent inspection, then apply its authored duration. Use a 2 s silent inspection for the first tuning fixture. A longer line stays legible for its full reading. Start the next interval when the interruption ends. Protect the first 4 s of player control from a random interruption. The authored opening ends exactly where WRITER left it.

During an interruption all four Clear controls show **LIMEN speaking** or **LIMEN inspecting**. The bell, travel, loads already in motion and cleared operations continue. Return eligible buttons to ready as soon as he finishes. No tap is queued. An urgent safety stop separately freezes the affected equipment and preserves prior progress. Once the obstruction is removed and an operator is present, LIMEN can accept a fresh Clear to resume the remaining work. Under STILETTO a present operator resumes automatically once the stop is released. Idle time by itself cannot generate a new ID clue.

## STILETTO assigns the crew

Keep LIMEN’s two clerks at Security. As each cleared worker physically reaches Conveyor, their portrait becomes assignable. The Day 2 opening can carry prior orders for sam at Intake and max at Forge across the camera cut. The player takes over that live arrangement. In the regular worked reading, choose bob for Wash when he arrives, then jo for Belt. After a pass, these placements are still free. If bob is detained, his portrait shows **In custody until bell**. The player can later move another available worker to Wash. While a missing-ID case is live, STILETTO can inspect the delay but cannot release the shared queue. When the case resolves, her encounter with jo and LIMEN follows their actual positions and the accepted concession rules.

Select a portrait to show its three bars beside the four station needs. Select a station to commit the order. Show **walking to Wash**, for example, until the worker reaches an actual standing place. Show current occupants and whether a carrier is being worked, held or expected. With the player’s hands off, idle arrivals wait for an order at their free support position. They can still do support work and take eligible conversations. At the approved opening, scripted assignments and work already done survive. The player’s first new choice can also be moving max away from his waiting press to cover Wash, with the visible consequence that someone must return to receive at Forge.

### Portrait bars and station needs

Proposed palette on a dark panel: **Force** uses amber #E9AD55 and a vertical stroke icon, **Precision** uses blue #75BFFF and a crosshair, **Timing** uses mint #73D5B4 and a clock face. Keep this order and these colors on every portrait, station and assignment view. Use five fixed-width segments, the name and a numeric value. Label the two groups **Worker stats** and **Station needs**. On a station, a longer bar means more influence on cycle time. Every available Conveyor worker can operate each of the four controls. A low score still permits a legal assignment. The first week uses stable ratings. Temporary absence or a stronger work obligation changes availability separately.

| Worker | Force | Precision | Timing |
| --- | --- | --- | --- |
| sam | Force 4/5 | Precision 3/5 | Timing 3/5 |
| bob | Force 2/5 | Precision 4/5 | Timing 5/5 |
| jo | Force 3/5 | Precision 4/5 | Timing 3/5 |
| max | Force 5/5 | Precision 2/5 | Timing 4/5 |
| kit | Force 2/5 | Precision 5/5 | Timing 4/5 |
| mae | Force 3/5 | Precision 3/5 | Timing 5/5 |
| lou | Force 4/5 | Precision 4/5 | Timing 2/5 |
| ben | Force 3/5 | Precision 3/5 | Timing 4/5 |
| ed | Force 2/5 | Precision 5/5 | Timing 2/5 |
| gus | Force 4/5 | Precision 2/5 | Timing 3/5 |

| Station | Force | Precision | Timing | Work units per carrier |
| --- | --- | --- | --- | --- |
| Intake | Force 4/5 | Precision 1/5 | Timing 1/5 | 4000 |
| Wash | Force 1/5 | Precision 1/5 | Timing 4/5 | 5400 |
| Belt | Force 1/5 | Precision 4/5 | Timing 1/5 | 6400 |
| Forge | Force 2/5 | Precision 1/5 | Timing 3/5 | 4800 |

### What one more worker buys

For each present worker, multiply each stat by the corresponding station need and add the three products. Rank the resulting scores at that station, highest first, with actor ID as the stable tie-break. Up to three people can contribute at distinct reachable working faces: one operator and two assistants. A lone worker always operates. The highest score supplies four times its value in work units per tick, the second supplies twice its value, and the third supplies its value. These coefficients express how much of the task can be shared. The worker already holding a load keeps physical custody until a safe handoff. A better score need not swap the person on the treadle mid-stroke.

With one, two or three present workers, compute rate using only the occupied ranks. Each working tick adds the present team’s rate to that carrier’s progress. A full cycle with constant staffing takes the station’s work units divided by its rate, rounded **up** to the next tick. Empty station gives zero progress. Drop excess units on completion. A new arrival affects only future ticks. A staff change preserves accumulated units. While a receiver is blocked or the equipment stopped, the worker can wait or take an eligible conversation and the station adds zero units.

| Move kit from Forge to Belt | Before | After kit reaches Belt |
| --- | --- | --- |
| Belt | jo scores 22. Rate 88. A fresh carrier takes 73 ticks or 3.65 s. | kit scores 26. With jo, rate is 148. A fresh carrier takes 44 ticks or 2.20 s. |
| Forge | max scores 24, kit 21. Rate 138. A fresh carrier takes 35 ticks or 1.75 s. | max alone gives rate 96. A fresh carrier takes 50 ticks or 2.50 s. |

With bob alone, Wash takes 2.60 s. With sam alone, Intake takes 2.30 s. Moving kit relieves the slow Belt and makes the wash cycle worth watching next. For an in-progress example, move kit from a free assisting face 4 m along the aisle at the calibration walking speed of 2 m/s. During those 40 ticks jo contributes 3,520 of Belt’s 6,400 units. On kit’s arrival the remaining 2,880 take 20 ticks at rate 148. That carrier takes 3.00 s from the start, including the walk. ENGINE should use the actual traversable route and actor’s travel time in play.

Reserve the destination working face when the order is accepted. If all three are occupied or reserved, keep the old assignment and explain **Station full**. An assistant with free hands can leave immediately. Someone holding a transfer or controlling an irreversible contact finishes that contact first. For first tuning, only a transfer and Forge’s final 5 working ticks lock contact. The named operator stays for that lock. Otherwise pause safely at the next tick boundary, hand the control to a present colleague or leave the load in its fixture, then walk. All qualified hands leaving freezes partial progress. Reassigning one en-route portrait replaces its destination from its current position and releases the old reservation. No intermediate order teleports anyone or spends the pass.

## Who acts and who learns

Use the accepted belief–desire–intention rules at the events that matter: receiving an order, arriving within reach, seeing a ready or unsafe load, hearing part of an answer, losing a partner, and hearing the bell. A posted assignment creates an intention to reach and work a station. Being at a different station can change the nearby conversation. The UI can show a portrait in transit without treating the worker as present in either team.

| Person and perceived evidence | Desire and committed action | What can change it |
| --- | --- | --- |
| max saw his own empty stroke and LIMEN’s stop. His second carrier has arrived. | Wants to press and stay in good standing. Under LIMEN he keeps his foot beside the treadle until he receives the Forge call for this load. Under STILETTO a seated load and safe stroke suffice. | A Belt call, an unheard Forge call or a rumour leaves him waiting. Seeing jo arrive tells him she is at work. He missed her exchange at Security. |
| LIMEN has seen max jump a stage. STILETTO saw only one finished cortex on her visit. | LIMEN gives a specific station clearance in response to a legal tap and may occupy his own time explaining the Protocol. STILETTO returned to pace Security on the swap. | A visible fault can provoke a stop. STILETTO cannot learn of later Forge strokes through the wall. On regular posts her desire for five can take her to the desk to find her Belt operator. |
| sam heard ed say he picked up a card during the second Wash. ed holds his own and bob’s originals. bob heard neither line. | sam wants to help and may look for a reachable chance to tell bob what ed said. bob wants a lead and company. ed attends to the tray or collects empties when the work calls for them. | A starting drum, raised tray lip, a reassignment or the bell can break an exchange. sam can report a pickup, never infer whose card it was from that remark alone. A report or promise leaves both cards physically with ed. |
| jo sees whether the clamp has finished and the Forge receiver is ready. kit can see or hear trouble at an adjacent control. | jo holds or moves the loaded carrier. kit may help or speak from a free working face. Under STILETTO sam returns both hands to the high tray when called. | Receipt of an intelligible fragment is individual. bob hearing only an anonymous find can lead him to ben outside. Hearing the desk lead can lead him to ed instead. |
| gus works opposite lou at the swapped rack. ed’s trip for empties can bring two card edges into gus’s sight. | gus may report those edges when lou has reason to ask. lou can later approach bob at departure and name gus as the source. | Check exposed edges, actual sight, legal neighbors, free hands, available slot and phrase receipt. A loaded rack, hidden pocket or missed words can remove the later report. Seeing edges never identifies a face. |

Take the two worker conversation opportunities per Conveyor shift from the accepted ledger. K04 consumed one when ed received sam’s opener. Preserve the remaining Conveyor slot and the independent departure opportunity at the handoff. No worker heard LIMEN’s private desk farewell. The seven alternate running replies and two new rack lines retain their proposal status. The approved seed uses the approved running draw. Preserve the location of every approved line, the first silence before the first Forge clearance and the second between “Where was I...” and “Ah yes. The Protocol.” Playback and restore at the second Forge cannot summon a second K04, replay a silence or give bob sam’s knowledge.

At the bell, workers settle a held load safely, close the feed and stop the drive. The daily pass expires, detention ends and the actual originals stay with their current holder until a real handover. Workers can walk out with whoever actually reaches them. Carry the quota ledger, custody, firsthand or attributed memories, invitations and supervisor observations into the next shift. Reset daily rights, work orders, approvals and social budgets for the new shift. A cortex already scored carries its ID in the ledger. The morning scene can use a witnessed delay or output figure only if the speaker saw it or received a report.

## Three comparisons for ENGINE

**How to read the numbers.** Run the same authoritative 20 Hz clock through both rooms. Times below are simulation seconds relative to the specified snapshot. A difference in camera, read speed or inspector use must give the same events. The existing production checkpoints run an earlier model. The calculations below specify expected results for the proposed one. Only the indicated player decision differs within a matched pair. Run `python docs/loopforge/game-design/check_conveyor_minigames.py` from the review branch to reproduce the staffing arithmetic and regular-route trace directly from the tables above.

### 1 · The second carrier gets its call

Save immediately after jo delivers the second carrier. The shift is live. C1 is the single finished cortex of this shift. C2 is loaded at Forge, max’s foot is up, the first permit is spent and his permit for C2 is absent. No operation or call is in progress. The rest of the room keeps its entry inventory, including any staged raw carrier. Preserve sam’s sourced pickup lead, bob’s nonreceipt, ed’s two IDs, the spent K04 slot and the remaining departure opportunity. Keep the cast and the unspent intervention from the swapped opening. Capture the actual tick, bell and interruption draw from that run. The seed must leave at least 3.05 s before the real bell. Do not restart the clock or extend the shift to meet a test.

At +0.00 tap Forge once and make no other input. LIMEN calls. At +0.50 max receives it. The loaded stroke completes at +2.50. At +3.00 C2 reaches the rack and the daily count changes from one to two. max waited half a second for the call. jo can see the carrier leave and max act from the neighboring control if facing it. The rack pair can see its arrival. There is no new sighting at Security. With no later clears, this run closes on **two** new cortexes for Day 2. The weekly total from the worked Day 1 start is **five**.

### 2 · Same look, no clearance

Restore the identical private state and make no input until the bell. At +0.50, +2.50 and +3.00 max is still watching LIMEN. The second carrier remains loaded, one has finished, the intervention remains available and no worker has witnessed a second stroke. His wait lasts the entire remaining shift. At the bell C2 yields zero quota credit. Day 2 closes on **one** and the weekly total is **four**. ed retains both IDs in both runs. Only meetings and actual receipts in each run may change tomorrow’s leads.

For recovery, restore again and wait 2 s before tapping Forge. The first-call protection keeps this click outside an interruption. If the original bell allows it, max receives at +2.50, the loaded stroke finishes at +4.50 and the same C2 reaches the rack at +5.00. A duplicated command cannot produce a second call or arrival. An exact bell tie closes scoring before an arrival on that tick.

### 3 · Same missing ID, different Wash staffing

Start at the live Missing ID inspection, seed early/3241, authoritative tick 7541. Both desks are held. sam is at Intake, max at Forge. The first carrier already sits in the passive Wash cradle. Rack starts at zero for the day. For this design calculation import the two recorded Security arrival schedules and the fixed bell tick 9264, 86.15 s later. Feed the next raw carrier whenever Intake frees. Use the same portrait policy in both runs: bob to Wash and jo to Belt at their first available work faces, with sam and max kept at their posts. Everyone else remains on support. The pass is the only different player decision. Arrival orders here are matched to actual contact so that no extra portrait-screen delay is being modelled.

| Time after inspection | Issue the pass immediately | Keep watching |
| --- | --- | --- |
| Opening seconds | Pass spends the intervention. jo takes the first step to the desk at +2.30. bob reaches Wash at +6.10 and starts C1. | sam can work at Intake. C1 waits at Wash, max waits for material. LIMEN detains bob at +14.00 and jo steps forward at +14.45. |
| First carrier | C1 finishes Wash at +8.70. It waits 6.55 s until jo reaches Belt at +15.25. Receipt at +15.75. Belt finishes at +19.40, max receives at +19.90, Forge finishes at +22.40 and the first rack arrival is +22.90. | jo reaches Belt at +27.80. Wash remains vacant. There is no clean carrier to send. Changing the camera leaves the loaded Wash cradle and the empty Forge visible. |
| Bell and tomorrow | Fourteen new rack arrivals in this exact proposed tuning. Last arrival +83.35. Weekly total 17 including Day 1. The pass expires. In the early-cut reading bob can take the anonymous lead to ben and remember the boot report if delivered. | Zero new arrivals. C1 waited all 86.15 s. Weekly total remains three. bob is released. He missed the Conveyor exchange. He can seek company after release if a partner is reachable. |

On the pass route bob can report seeing jo draw a card only after his actual glance. max can see jo arrive in either run. The concession at the desk has separate witnesses. On the detention route, the available portrait pool eventually includes kit. Reassign kit to Wash and a new test run should recover from the stopped cradle once kit reaches it. The detained bob and the two clerks stay unavailable. On the pass route the corresponding change is also legal with **Intervention spent** displayed. A five-cortex aspiration is already part of STILETTO’s dialogue. Fourteen on a pipelined line is a tuning result worth checking against that aspiration and week-one quota pacing.

[Current ENGINE fixtures and measured outcomes](/loopforge-shifts/ENGINE-HANDOFF.md) · [Accepted hearing and witness comparisons](/loopforge-design/studio/days-2-4-dialogue-validation.html) · [Source of the Security timings](https://github.com/stepan-o/fruitful-lab/tree/c3101bd/apps/lab/public/loopforge-shifts/fixtures)

## Simulation and save contract

Use the existing simulation owner, clock, public scene projection and command receipt path. Version the minigame state and fixtures. Continue replaying previous saves with their original rule version or an explicit migration that preserves their serial carrier and existing rack ledger. The reviewed entry requires WRITER’s actual opening, including K04. A generic old save with one rack arrival cannot stand in for it.

| Transition | Guard and recorded effect |
| --- | --- |
| Clear requested → called → received | Validate shift, mandate, observed tick/incident, resident carrier ID, stage, operator, available call channel and admissible readiness. Emit one call ID for that attempt. The actual named listener receiving that call starts the work. Losing reach, an interruption before admission, or an obsolete carrier gives an explicit reason. |
| Assignment ordered → walking → contributing | Validate the available worker, STILETTO’s room, open shift and a free destination face. Reserve the face, retain custody of any committed contact, then release and route. Apply the new station rate only on physical arrival. Duplicate order or identical destination has no extra movement or cost. |
| Work → finished → held → in transit → received | Atomic carrier ownership and destination reservation. Track progress in integer units or ticks. Complete the work once. When a receiver is free, emit one transfer and finish it at the destination after 10 ticks. Recovery never runs a completed wash or press again. |
| Rack arrival → shift closed → weekly ledger | Insert each carrier ID once at its actual rack receipt. The bell has priority on an exact tie. Settle unfinished loads safely, record them as uncredited work in progress and clear them from the next day’s starting production in this week-one proposal. Commit the shift subtotal once under its week/day key. |

At a tick boundary before the bell, settle transfers due, then completions and arrivals due. Apply accepted commands in stable sequence, reserve new transfers downstream first, start eligible operations, and accrue the next tick’s work using present staff. A process started at tick T with duration N finishes at T + N. Service already running at the bell yields only the rack arrivals from strictly earlier ticks. The same command ID returns its previous result on retry. A stale target, closed shift, invalid authority or duplicate may never overwrite a later assignment or double-count output.

A save includes the version, absolute tick, day and bell, both mandates, intervention, Security case, pass and custody, workers’ positions and routes, arrival order, seats and reserved work faces. Serialize each carrier, stage, progress, owner, transfer reservation, completion tick, outstanding call ID and receipt. Include LIMEN’s current utterance and remaining silence, next interruption draw and RNG cursor, active phrases and per-listener receipts, conversation opportunities already charged, individual beliefs and intentions, rack ledger, unique command results, event sequence and night settlement status. Publish only camera-visible acts, local speech, ordinary stats, staffing and score. Private belief provenance remains in the inspector.

**Resume test.** From the completed #174 opening, save max’s wait. Fork one uninterrupted continuation and two independent restores. Apply identical tick-stamped inputs to each. Compare ordered public events, listener receipts, private hash, carrier IDs, output and next-morning evidence. Restore on the tick before receipt, during an interruption, mid-transfer, during a portrait reassignment and just before the bell as boundary probes. Restore the original wait again and switch between comparisons 1 and 2. The initial hashes must match and only the admitted choices and ensuing consequences may diverge.

## What ENGINE can reuse

The #173 player already provides four physical controls, named workers, checked all-clears, operator hearing, per-stage handoffs and rack arrivals, dated passes, shared desk holds, cross-room simulation, worker conversations and save/restore. Its production loop admits a new carrier only after the current one racks. Its LIMEN can call automatically. Its Slow and Push orders under STILETTO spend the exceptional intervention. At 1× with the inspector closed, the Missing ID run showed sam and max at their machines and Wash and Belt uncovered. In Conveyor chat the first carrier travelled toward Forge while STILETTO interrupted sam, then the rack counter advanced. The current Missing ID fixtures report six arrivals for the pass and zero for detention. Those counts belong to #173.

ENGINE work after owner review includes the exact #174 entry, player-triggered Clear, seeded Protocol interruptions, several concurrent carriers, receiver reservations, portrait orders independent of intervention, rate changes on physical arrival, and the weekly receipt ledger. Wire the mode to the actual room mandate. Preserve any exceptional Security command that still applies. In the proposed STILETTO game, assigning a worker is the normal operating control. LEVEL and ART need named, nonoverlapping working and walking positions for assistants, legible controls and a visible loaded treadle/receiver at 1×. Bubbles must leave the next actionable station readable. The earlier four-pedestal study and the running two-room player supply the equipment.

**Owner viewing check.** With the inspector closed, identify what max is waiting for on each route, clear a different ready machine while Forge waits, and recognize when LIMEN’s interruption consumes shift time. On STILETTO’s floor, choose a worker from the bars, move them, and point to the carrier that moves sooner and the station that lost their help. Repeat with sound muted and the bar colors removed. The station, person, current hold and count must still be identifiable.

**Design reference.** Tynan Sylvester, *Designing Games* (2013), chapter 4, “Emergent Story,” printed pp. 90–91 (PDF pp. 98–99, one-based). Designing the conditions for a meeting lets the run determine what story the workers take home. Here ed’s trip for empties, gus’s view of his pocket and lou’s shared rack duty make a report possible. Move lou before that exchange and test whether tomorrow’s bob can still identify a real source. The player’s throughput choice can change a witness chain without selecting a line of dialogue.

[Playable baseline, PR #173](https://github.com/stepan-o/fruitful-lab/pull/173) · [Approved writing, PR #174](https://github.com/stepan-o/fruitful-lab/pull/174) · [Earlier four-control study](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/CONVEYOR_MINIGAME_PROPOSAL.md)
