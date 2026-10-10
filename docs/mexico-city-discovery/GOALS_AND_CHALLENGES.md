# Goals and challenges for city play

Design discussion recorded 10 October 2026. **The private multiplayer game for Susy and Stepan remains the immediate priority.** Goals provide direction, player-issued challenges create changing opportunities and stakes, and wildcards change the available choices. Solo and public community variants remain later roadmap items. These are proposed mechanics; the preview has not implemented them.

The owner introduced timed challenges, point gains and losses, temporary category blocks and shared activities. The timing, limits and counterplay below are recommendations for a first test, not settled owner decisions. The competing preferences about quizzes remain unresolved.

## Goals supply direction and points

Points come from completing or failing a defined objective under its rules. A photo or upload is evidence; it does not automatically create a separate reward. Preserve the current prototype scores as legacy progress rather than importing their story, visit and photo weights into this system.

| Mode | Where objectives come from | Who progresses | Persistence |
| --- | --- | --- | --- |
| Solo, later | The system offers a few achievable objectives for this outing or day. Authored templates can do this without AI generation. | The individual chooses a session and completes its goals. | A guest session must be a complete experience without signup. An account can optionally retain progress. |
| Private multiplayer, first | A round can have an overall theme; the opponent issues specific challenges, either a single task or a choice under a predefined rule. | Each player has a visible battle score; a cooperative task can reward both. | Reuse existing Fruitful Lab accounts. |
| Public community, later | Shared milestones and system-curated quests respond to collective contributions. | The community map and logbook develop together. There need not be a mandatory personal checklist. | Browsing, doing quests and submitting remain possible without an account; the shared logbook persists. |

Treat “play a session now” as a guest entry rather than mandatory account login. Closing a successful guest session does not make it incomplete because nothing was saved. This is a later mode, not extra scope for the first battle.

## Three kinds of play

| Kind | Function | Example |
| --- | --- | --- |
| Goal | Gives the outing or round its direction. | Discover unfamiliar sides of this neighborhood together this week. |
| Challenge | Specifies an action, recipient, reward, possible loss and deadline. | Find a hand-painted sign and record its photo and place: +100 on confirmation, −100 on failure. |
| Wildcard | Temporarily changes what can score or how a challenge can be handled. | Bookstore discoveries cannot advance new scoring objectives for the next day. |

A cooperative challenge is a challenge with both players as participants: visit a place new to both, complete the observation together and receive a joint bonus. It should have its own clear completion rule. One player cannot enroll the other in a penalized joint task without the agreed round rules covering that action.

All figures here illustrate the owner's proposed stakes; values require playtesting. An opponent's loss does not automatically transfer points to the sender. A transfer or sender reward would be a separate rule.

## Timed challenges with counterplay

Surprise and deliberate disruption are part of the proposed fun. Requiring separate acceptance for every card could remove that tension. Instead, test an agreed play window and rule set: within it, an eligible opponent-issued challenge can activate automatically; outside it, it waits as an offer with no running penalty timer. Login or a delivered notification alone should not create a surprise commitment.

Before playing, show the allowed task types, time ranges, maximum stakes and available wildcards. Short challenges belong to a shared live outing; day-long challenges can use an agreed asynchronous window. A ten-minute observation task must not turn into a race across the city. Do not promise push notifications or background delivery before those capabilities exist.

For the first trial, consider one active hostile challenge per recipient, a small fixed number of challenge cards per round and one limited reroll or shield. Spending a card creates an opportunity cost. Normal refusal or letting an active challenge expire incurs its displayed loss; using an available counter follows the counter's rule. This preserves the ability to sacrifice points deliberately without making unlimited impossible assignments the obvious strategy.

Use prepared challenge templates first. A sender chooses a task or offers a defined choice, then selects allowed settings. If the recipient gets a choice, completing one alternative settles the one challenge; it must not award all alternatives. Rules freeze at activation. A task outside the agreed constraints can be disputed, not rewritten by its sender after the attempt.

## Submission and settlement

Recommended lifecycle: **offer → active → evidence submitted → confirmed or unresolved review → settled**. An active challenge without eligible evidence can instead settle as failed or forfeited. Offers carry no penalty. A single challenge has one final scoring outcome for each participant, with correction history.

The card states the activation time, action deadline, evidence cutoff, success reward and failure loss. If uploading is allowed after the action deadline, show that grace period before activation. The server records receipt; the player sees whether the submission actually arrived. An editable journal date alone cannot establish timely submission.

An on-time submission waits for peer review without losing points because the opponent has not responded. A clarification can explain existing evidence; it cannot silently grant more time to perform the task. Approval produces the reward once. No eligible submission produces the specified loss once at the cutoff. A dispute stays visibly unresolved until handled under the round rules; it does not become an automatic loss through reviewer silence. Final standings remain provisional when an unresolved result could change them.

The issuer is also the reviewer in the two-person prototype. Clear criteria and an explicit dispute path are therefore necessary; automated checks do not resolve a disagreement about whether the activity happened. The first version assumes a trusted pair. After settlement, evidence corrections use an explicit reversal or amended outcome, not duplicate rewards or an unannounced second penalty.

## Category blocks

The owner's example is a temporary block intended to interrupt routine. Interpret this as **a block on new scoring opportunities in that category**, while allowing personal records to be saved. A bookstore visit can remain a memory during a bookstore block.

Recommend one active block at a time, a visible expiry and no stacking that eliminates every feasible category. A block costs a limited wildcard. It applies prospectively: it cannot erase earned points, disqualify submitted evidence or make an already active challenge impossible. Prevent issuing a new challenge that conflicts with the active block. Decide the duration and whether it covers one discovery, one outing or a day before the wildcard is played.

## Cooperative challenges

Give the pair a way to turn competition into shared experiences: “Busquen un lugar al que ninguno de los dos haya ido.” Each participant confirms their part; a shared photo or separate records can support the activity without requiring a selfie. A completion bonus can reward both, followed by a brief celebration. In the first test, recommend bonus-only cooperative invitations; penalties should be a separately agreed variant.

## Quizzes and knowledge remain an open decision

Stepan's proposed direction is reading and quizzes before some activities, with increasing score multipliers. Susy expressed dislike of that arrangement. Do not record compulsory reading, a quiz gate or an uncapped multiplier as an agreed feature.

The earlier city-layout and Náhuatl learning material remains useful. Possible tests include an optional knowledge challenge, a clue that helps solve a field challenge, a small capped bonus on a relevant objective, or a recall question after an outing. These are alternatives to compare, not a selected compromise. A mandatory quiz sequence before every outing would conflict with the established aim of making it quick to begin playing outside and needs an explicit joint decision.

If a multiplier is tried, specify its eligible rewards, cap, duration and replay rules; say separately whether it affects losses. Repeated quizzes must not silently compound permanent multipliers or amplify an opponent's penalty. Historical citations and source-aware Náhuatl explanations remain required.

“Atlas” at the end of the discussion is awaiting clarification. Do not invent a mechanic or assume it means either the map/history atlas or Náhuatl.

## Interface and the first test

The multiplayer opening answers: what is our round about, what challenge is active for me, what can I gain or lose, when does it end, and what can I play against or with my opponent? Put the active challenge, pending result and available wildcards within reach of the map. Keep “Registrar hallazgo” prominent. Use short Spanish labels such as “Tu reto”, “Lanzar reto”, “Comodines”, “Reto juntos” and “Por confirmar”, with English equivalents.

Show deadlines clearly without attention-demanding animation. Animate a card arriving, a rule changing or an outcome settling, then return attention to the outing. Preserve keyboard, touch and reduced-motion access.

First test the complete two-person loop with a prepared timed challenge, a deliberate refusal or expiry, one category block, one counter and one shared bonus activity. Confirm that review delay never causes a penalty, retries never duplicate outcomes and a block never invalidates earlier work. Compare whether the surprise led to a memorable discovery or mainly felt like an interruption. Keep solo, public community and unresolved quiz scaling out of that first implementation.
