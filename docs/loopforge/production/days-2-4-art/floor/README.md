# Live floor and speech assets

Sixteen native RGBA sprites for the approved Security and Conveyor floor. Load the files in `manifest.json`. Every PNG has an independently editable, layered OpenRaster master and a digest. `draw.py` rebuilds the drawings with Python and Pillow. The source palette comes from the approved Day One B material swatches. All linework was drawn for this pack.

## World registration

Use 64 source pixels per metre and uniform scaling after projecting the floor point. At the Day One phone room-camera limit the factor is 62/64; a wide group view may shrink it further. Use nearest-neighbor sampling. The world indicators are passive: use the separate Security lane signal for the tappable desk report. Presence of an indicator does not spend the intervention.

| Family | Registration and depth | Meaning |
| --- | --- | --- |
| Gate | Place the semaphore at the existing hinge `[124.9, 134.0]` m with foot pivot `[18,36]`. Draw the physical boom, then its semaphore in the same depth group. Keep the opening and route owned by the simulation. | The lens means an inspection is underway, the horizontal striped blade means the line is held, the raised diagonal means it can resume. |
| Handoff and coverage | Derive the two small fixtures from the physical control post in the manifest. Suggested visual offsets in native pixels from that projected post are `[-23,-12]` for the signal foot and `[15,-9]` for the occupancy clip. Sort within the fixture assembly behind actors in front. Keep the acting hand and operator silhouette visible. These offsets move drawn faceplates only. | The suspended billet over a cup means waiting to hand off. The check vane means an all-clear was acted on. Twin arrows identify an active rushed handoff. A hung metal tag indicates actual coverage and the two bare clips indicate a vacancy. |
| Output | The three defined receiving sockets are 0.55 m apart at world y=147. Use ENGINE’s actual piece coordinates in millimetres, projected on the rack plane. Day One draws finished pieces 0.72 m above the floor. For each visible socket, draw the rear cradle, a finished piece if present, and the guard lip, all at the same screen point using their own pivots. | The folded brain is a separate object. One arrival event adds one item to the confirmed shift count. Several historical objects can refer to one socket across shifts. Use the confirmed rack count at close. |

At very wide zoom a worker, gate and rack remain recognizable as world shapes. Let room focus enlarge the scene for close inspection. Expose policy, coverage and counts through live accessible labels independently of color. If two plate positions compete at wide zoom, prioritize the artwork for the actual operation; the details remain available on room focus. A speech mark must never paint an invented operator.

## Speech

Draw the tails behind the bubble, then the parchment, nameplate and live glyphs. Use a fixed CSS-pixel skin scale, independently of world zoom. The two 60 × 40 px parchment templates use [left, top, right, bottom] insets of [8, 7, 11, 7]. Expand the middle and straight edge spans; keep the corners fixed. Add the nameplate above the body text with 5 px horizontal and 3 px vertical padding. Allow it to expand to fit names such as STILETTO. Preserve case. Body ink is #17282A and name ink is #F4E8CD. Use the existing 14 CSS px phone / 16 desktop body and 12 CSS px name defaults, then measure the live strings. Increase the plate height for wrapped content.

Keep simultaneous messages distinct. Place each bubble above its speaker and offset vertically or sideways when the text boxes overlap. Use the corresponding left/right native tail when the actor head is near the panel edge. When avoidance pushes the panel farther away, connect its tail tip to the projected head with the existing screen-space leader. A 4 px viewport gutter and a free space over the character heads help preserve attribution. Use each utterance’s segment order and actual speaker anchor. An interruption changes the edge of the last delivered bubble; if no words were delivered there is no speech bubble to decorate. The interrupted version has a torn folded corner and paired hatch slashes. The new speaker gets a separate intact bubble. Keep private thoughts and hidden hearing history in the reviewer UI.

## Current ENGINE correspondence

The following names were inspected in `apps/lab/lib/loopforge/shifts/{simulation,conveyor,events}.ts` in ENGINE’s concurrent Days 2–4 checkout. Their releases and public projections are maintained by ENGINE. These are observations about in-progress emitters.

| Committed observation | Artwork action |
| --- | --- |
| `queue.called`, then `desk.signal` following discovery | Apply `fl-gate-check` or `fl-gate-held` as appropriate. Keep the held indicator until Security actually resolves the case. |
| `case.resolved` / `queue.advanced` | Show the released blade at confirmed resolution and follow the next worker’s own check. The gate asset does not dispatch anybody. |
| `station.coverage` for `control.<station>` | Use the two post sprites. An empty actor indicates the recorded vacancy. Baseline coverage is needed on a seek or new subscription. |
| `handoff.wait`, `handoff.started`, `handoff.finished` for a workpiece and control | Show the ready cup while awaiting the all-clear. A committed start with pace `all-clear` uses the check; a committed start with pace `rushed` uses the twin arrows. A slow normal start can keep the neutral ready face. Return to the neutral operating state at finish. Match workpiece and station. |
| `rack.arrival` | Show the actual finished item at its reported socket. Rebuild visible occupancy from the recovered snapshot on a seek. Never increment totals merely because a picture redrew. |
| `speech.delivered`, then `chat.interrupted` | Draw the attributed delivered words. In the current chat, the cutoff event names STILETTO as the interrupter and sam as its subject. Apply the cut edge to sam’s last visible fragment. Limit listener-facing evidence to the applicable public projection. |

`floor-review.png` is a pixel material and state contact sheet. The central shape, opening, count or orientation changes in addition to hue. The project’s paired review scenes use these exports with actual cast references. Final visual acceptance occurs in the full live prototype.
