# Day one: the first morning count

20 October 2026 · `morning-count/3` · fixed opening rehearsal, awaiting performance approval.

[Play the opening](/stepanoskin/loopforge/play/scene-studies). [Inspect LIMEN’s source motions](/stepanoskin/loopforge/play/agent-test/limen). [Shared encounter architecture](SCENE_REHEARSALS.md).

## Direction

Ten nervous workers enter the Lobby. LIMEN occupies the Security doorway. Nobody arrives spoiling for a fight: they want to be useful, get the instructions right and avoid attracting attention. Worker 01 is literal and anxious about being late; Worker 02 quietly helps; Worker 03 is afraid of doing even compliance incorrectly. The remaining seven make a listening crowd, with staggered idle phases and three blue paint shades.

LIMEN moves between public command, procedural explanation, dry reassurance and sudden anger. He believes he protects the factory. The cruelty comes from applying that conviction to a tiny misunderstanding, then treating the injured worker’s return as routine administration. This establishes the cost of his order before STILETTO argues about delayed production.

The staging reference is **Back to the Dawn’s morning count**: a visible boundary, an authority addressing a group, and individual reactions that reveal personality inside an institutional ritual. We inspected the [roll-call image in Raider King’s review](https://raiderking.com/back-to-the-dawn-review-a-zootopian-prison-break/) and the [official game listing](https://store.steampowered.com/app/1735700/Back_to_the_Dawn/). That first pass used a still, not a full camera study. The follow-up inspected [Keith Ballard’s opening playthrough](https://www.youtube.com/watch?v=SW3Qpd8F7v4&t=2197s), sampling the morning headcount at 36:37–37:42 and Sam’s cellmate conversation at 28:28–28:48. Observed: the assembly stays in one composition while Billy counts and Bruce addresses it; dark panels have compact coloured speaker tabs; Bruce’s warning highlights a key phrase in red; Sam’s exchange uses short conversational turns and a separate emotion icon. These observations support steady staging, selective emphasis and visible reactions. Our cream industrial balloons, delivery animation and timid worker exchanges are original Loopforge choices, not a reproduction of that UI or dialogue.

## Fixed intro dialogue

The workers walk into a compact group outside the blocked entrance. Worker 02 speaks to Worker 01 while they approach.

**Worker 02:** Keep your number ready. And wait for him to call it.

**LIMEN — command:** STOP AND WAIT HERE!!

**LIMEN — precise explanation:** Ten units. Ten sets of papers. We begin when all ten can follow one instruction.

**Worker 03 — eager compliance:** I'm standing still, sir.

**LIMEN — small approval:** Excellent. Keep doing that.

**LIMEN — his worldview:** The line produces. Security makes sure there's still a factory tomorrow.

**Worker 01 — anxious:** Sir… my shift has already started.

**LIMEN — dry reassurance:** Then let us avoid starting it twice. Once here. Once in an incident report.

**LIMEN — a stamped rule:** Numbers when called. No shortcuts. No exceptions.

**Worker 02 — quietly:** Just wait for your number.

**LIMEN:** One…

Worker 01 hears his number and steps out, preparing to present himself.

**Worker 01:** I've got it, sir.

**LIMEN — sudden anger:** HEY YOU I SAID STOP!!!!

LIMEN swings his cyan forearm blade. Worker 01 falls; the others freeze in the queue.

**Worker 03 — to Worker 02:** Don't move. He said don't move.

**LIMEN — restoring the distinction:** That was a number. Not permission.

Worker 01 gets up.

**Worker 01:** Understood. Sorry, sir.

**LIMEN — administrative calm:** Back behind the line. Take your time.

Worker 01 limps back. Worker 02 makes the welcome explicit without leaving his own place.

**Worker 02:** Here. There's room here.

**LIMEN:** Good. Ten accounted for.

Only after all ten have settled:

**LIMEN — public instruction:** EVERYONE PREPARE YOUR IDs

**LIMEN — conditional promise:** One at a time. We all get through if we do this properly.

Hold on the queue. Paper inspection and release belong to the next encounter.

## Acting and shot plan

Eight LIMEN source clips supply the performance: `Shouting_Angrily` for public commands; `Stand_and_Chat` for explanation and counting; `Idle_02` and `Idle_11` for dry pauses and apparent reassurance; `Shrug` for the incident-report answer; `Angry_Ground_Stomp` for the rule; `Alert` for listening; and `Axe_Spin_Attack` for the cyan strike. The catalog’s axe is not attached: the existing cyan forearm emitter performs the sweep. Each cue records a source offset, rate, loop/hold choice and transition duration. The attack remains a source candidate requiring owner review in the paired scene.

The worker uses accepted walking, listening, idle, `Electrocuted_Fall` and injured walking. `Checkpoint_Get_Up` is a new 4.8-second derivative: LIMEN’s `Arise` retargeted in bind space to Worker 01, with fall/idle transitions and floor normalization against the skinned mesh. It is a provisional recovery, not a new approved Meshy worker take. Its small track file shares the existing worker body and textures. Source banks remain unchanged.

Three held compositions replace the earlier line-by-line alternation: the wide assembly holds through the explanation and counting; a doorway cut begins only when Worker 01 steps forward, stays through the strike, fall and recovery; the wide shot returns when he limps back and holds through the ID instruction. There are two cuts during playback. The imported LIMEN motion rig faces -Z; its presentation applies a half-turn so encounter yaw zero faces the queue. Source articulation, viewers and stored world orientation remain unchanged. **Follow scene cameras** is switchable; choosing a manual Lobby/Doorway view disables automatic cuts until re-enabled. Mouse orbit, Lobby/Doorway presets, time scrubbing, nine beat markers and a clickable full script support review. The player starts paused. PNG export prepares a downloadable frame with dialogue; evidence JSON records the exact tick, camera and consequences. This rehearsal has speech bubbles, not recorded voice audio.


## Speech as performance

The public utterance carries optional delivery cues: plain, command, outburst, aside, hesitant, dry or warm; selected emphasis phrases; and an optional anger, nerves, doubt, relief or care symbol. This describes the audible/visible performance, not the speaker’s private mind. The kernel still hears and records the canonical unformatted text. No effects or beliefs are awarded by typography or emojis.

Speech has an anchored tail and integrated speaker tab. Commands are firm and angular; the strike warning has a brief scale/tilt impulse; asides are quieter dashed panels; hesitant replies are rounded; dry remarks remain still after entry. Only selected words receive weight and colour. Emotion badges supply a quick readable cue without placing an emoji after every sentence. Words reveal within 0.32–1.3 seconds using the encounter clock, with punctuation pauses; layout space is reserved so the bubble does not resize as it speaks. Pause and seek show the complete sentence. Reduced motion disables movement and reveal. An **Expressive speech** checkbox provides a plain comparison. PNG export retains the selected treatment, word emphasis and emotion symbols. There is no new font, image, animation library, model, sound asset or render pass.

LIMEN alternates orders, procedural certainty and cold reassurance. Workers answer in short, personal turns: eagerness to comply, anxiety about lateness, a whispered warning, then a small kindness. Those contrasting voices carry the scene while the camera holds. Later BDI-produced utterances can use the same delivery contract; the fixed intro remains authored.

## Approved appearance and layout

Security floor is `#A7B2D3`; Lobby retains `#666860`. LIMEN uses pale steel, deep cyan and the shared emitter, at 1.3 times worker height. Workers use blue `#3081c0`, `#3d7297` and `#235d86`. CATHEXIS is absent; her accepted treatment remains unchanged.

The compact Lobby–Security layout comes from `arrival-layout.ts`, shared by construction, movement and hearing. A closed admission gate can still carry speech through the open doorway. The cohort occupies three columns with reserved slots; Worker 01 steps out of the front centre and returns along the clear lane. This is authored staging, not general crowd avoidance. Full-floor Dispatch is unchanged.

## Engine boundary

The headless encounter kernel owns fixed 50 ms ticks, admission, actor/station reservations, movement, addressed speech, hearing, cancellation and effects. Injury, stress, trust and remembered treatment commit once at the contact phase. The ID instruction requires every queue-settled fact. Worker 01 remembers the misunderstanding; witnesses remember that a called number is not permission. These are local rehearsal consequences, ready for later authoritative day integration; they do not yet change a saved shift or factory output.

Presentation samples named cues deterministically. Horizontal root travel belongs to the encounter; animation retains pelvis height and articulation. Bounded blends join unrelated poses; contiguous excerpts of one attack continue without restarting the wind-up. Camera cuts cannot change outcomes. Old temporary baton geometry and its arm adapter are removed.

Only the active cast loads. Ten independent worker rigs share geometry and textures, with three shared colour materials. Recovery tracks load only when requested. Hidden/offscreen playback pauses, reduced energy preferences are respected, and the paused stage renders on demand. No device-performance acceptance is claimed.

## Validation and remaining gates

The encounter suite covers deterministic replay, the complete dialogue order, close doorway hearing, blocked admission, injury exactly once, cancellation before contact, all ten settled before IDs, retained event history, source cue selection and projection privacy. The encounter and speech tests cover held shot boundaries, deterministic delivery age, canonical transcript preservation, literal emphasis matching, and complete paused/accessible text. The prior encounter coverage includes no competing speech bubbles and completion with distinct intent/action IDs. The shared sampler regression checks reset of omitted parent channels, seek equivalence, crossfading, hold and loop. Recovery validation checks all 145 exported poses against the skinned worker mesh: minimum floor clearance is 0.001999 m. The production build runs existing immutable source-bank and character checks. The current focused run passes 26 tests across four suites, plus scoped lint and the production build. Desktop inspection covers command/emphasis treatment, nervous and angry badges, paused text, steady scene composition, the corrected facing and playback through the settled ending. Storyboard export offers an explicit Download PNG link. Phone layout and this cast’s device-performance acceptance have not been measured.

Before main-play integration: approve the paired blade sweep, fall/get-up transition and travel/footfall match; supply general queue navigation and interruptions; connect consequences to saved-day authority; and run the occupied-scene performance protocol. The source spin attack and adapted recovery remain candidate animation choices. A camera shot is not a collision certification.

## Next asset requests

No new body is needed to review this take. If the candidate strike or recovery is rejected, request a short right-forearm warning sweep on LIMEN and a deliberate worker get-up from the floor. Export the same rigs, identify actual catalog names and root motion, and retain source motions. Later paper handling needs an ID prop, LIMEN’s protocol clipboard, worker present-ID and supervisor inspect/return-ID contacts. Fit those against the actual station and partner rather than accepting isolated gestures as finished interactions.
