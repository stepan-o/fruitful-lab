# World building and the Loopforge connection

Editorial brief · 7 October 2026. Draft implemented in the local reader as
`making-worlds`; this broader brief is retained as research, not as a claim that
every suggested comparison has been included. See WORLD_BUILDING_MANUSCRIPT.md
and WORLD_BUILDING_IMPLEMENTATION.md. No production deployment in this pass.

## Purpose

The owner wants the production/engine discussion to make Loopforge worth the
reader's attention. Build that invitation through a substantive comparison of
world-building approaches, anchored in CD PROJEKT RED and Rockstar. The headings
below are our critical interpretation of selected games, not official categories,
exclusive studio identities or measured rankings.

The question is what a world recognizes about its player, how its responses are
made, and what it costs to keep those responses convincing. Compare authored
content, simulation, player invention and continuing production without treating
them as mutually exclusive. These are different investments in making a place
matter to someone. Map size and graphical fidelity cannot summarize them.

## Comparison headlines

| Editorial heading | Anchors and related examples | Production question |
| --- | --- | --- |
| People whose lives your choices change | CD PROJEKT RED: The Witcher 3, Cyberpunk 2077. Larian's Baldur's Gate 3 supplies a useful related case with different spatial structure and systemic freedom. | Which alternatives must be written, performed, staged and tested? How does the player recognize a consequence? |
| A place with a life around yours | Rockstar: Red Dead Redemption 2 and GTA V. Warhorse's Kingdom Come: Deliverance II is a related historical-life comparison. | How do performances, ambient behavior, physical interactions and environmental detail support the sense of inhabiting a place between missions? |
| Rules you can put to unexpected uses | Nintendo's Tears of the Kingdom; selected Bethesda systems and Minecraft broaden the comparison. | What becomes possible when authored objects obey reusable interaction rules? What new testing burden comes with combinations? |
| A past you reconstruct by exploring | FromSoftware's Elden Ring, with other examples considered only where useful. | How can space, encounters, objects and withheld information carry a history? Do not equate less dialogue with less authorship. |
| Lives that produce stories | Ludeon's RimWorld and Bay 12's Dwarf Fortress. These are especially important to Loopforge's conceptual lineage. | How do motives, needs, events and player interventions produce particular histories? How does the interface make them understandable? |
| A world with another season in production | Blizzard's World of Warcraft and Diablo IV, HoYoverse's Genshin Impact, and Rockstar's GTA Online. | What must be maintained, renewed or sold continually? Separate subscriptions, expansions, currencies and optional items rather than assigning one model to all services. |

Ubisoft's Assassin's Creed provides a further production comparison: coordinated
teams, historical locations and reusable engine/tool development across releases.
Hello Games' No Man's Sky adds procedural scale. Keep these as selected supporting
examples; don't turn the central comparison into a directory of every studio.
Minecraft also makes the player's own construction important, which deserves
recognition beyond the rule-combination comparison.

Do not imply Rockstar lacks authored stories or CDPR lacks systemic responses.
CDPR's own designers describe combining both. Nor should the table imply each
studio has a single business model: GTA V's campaign and GTA Online already make
that simplification untenable. The comparison identifies emphases in particular
works and relates them to production, with design detail reserved for later acts.

## Evidence for the bridge

- [CDPR level-design discussion, episode 30](https://www.cdprojektred.com/en/blog/188/answered-podcast-episode-30-paths-and-possibilities-the-art-of-level-design-transcript-included):
  Miles Tost and Marta Dobińska describe reconciling agency with narrative,
  production cost of possible responses, and the value of consequences players
  notice and remember. This is the clearest bridge to the Loopforge experiment.
- [Rob Nelson's original interview with Everyeye, 2018](https://www.everyeye.it/articoli/intervista-rdr-2-storia-approccio-creativo-nel-nuovo-western-rockstar-38635.html)
  and [Rockstar's RDR2 launch release](https://ir.take2games.com/static-files/d0726ed5-bbff-4949-9da4-99157263e502).
- [Nintendo's developer discussion](https://www.nintendo.com/en-ca/whatsnew/ask-the-developer-vol-9-the-legend-of-zelda-tears-of-the-kingdom-part-3/).
- [Baldur's Gate 3 overview](https://baldursgate3.game/about).
- [Elden Ring's official description](https://www.bandainamcoent.com/games/elden-ring).
- [RimWorld's developer-supplied description](https://store.steampowered.com/app/294100/RimWorld/)
  and [Dwarf Fortress features](https://bay12games.com/dwarves/features.html).
  Their story generation is not evidence of LLM use.
- [Minecraft creative and survival modes](https://www.minecraft.net/en-us/article/creative-vs-survival-mode).
- [Ubisoft's Anvil account](https://www.ubisoft.com/en-us/news/ignt.59546/anvil-die-technologie-hinter-assassin-s-creed-shadows)
  and [No Man's Sky Worlds update](https://www.nomanssky.com/worlds-part-i-update/).
- [World of Warcraft access models](https://us.support.blizzard.com/en/help/article/000369636)
  and [Genshin's 2.1 update](https://genshin.hoyoverse.com/en/news/detail/104025)
  offer concrete dated evidence of ongoing production and different payment
  arrangements. Check each specific current offer before public copy.

## Loopforge: make the consequences speak

Position Loopforge as the author's experimental simulation and narrative engine.
The proposed contribution is a controllable connection between what happened in
play and how characters express a viewpoint about it. A strong reader-facing
question: can a world acknowledge more of what a player does without its writers
having to prewrite every possible response?

The mechanism is the argument. An authoritative simulation resolves a command
and records its consequences. A separate narrative process receives bounded
evidence and a character brief. Generated expression does not gain authority to
change the outcome. The renderer, simulation and narration can run on different
clocks. This describes a specialized layer, not an implemented substitute for
Unreal's general-purpose production tools, rendering or platform support.

Read-only inspection on 7 October:
- The Python `backend/sim_sim/kernel/state.py` contains the config-driven
  deterministic factory model; it is distinct from the hosted teaching model.
- In the Loopforge presentation worktree, `lib/loopforge/engine.ts` implements
  an eight-shift bounded TypeScript simulation with commands, events and replay.
- `narrative.ts` supplies current event evidence and authored character voice,
  selects one speaker and validates structured results. Its checks do not prove
  every sentence true; semantic quality still requires evaluation.
- `docs/loopforge/OPERATIONS_AND_EVALS.md` records protected model narration,
  caching, budget controls and prior live evaluation. This pass did not rerun it.
- Persistent autobiographical character memory, full autonomous BDI planning,
  multiplayer persistence and proven large-scale production savings are not
  demonstrated by that teaching slice. Do not promote roadmap material to fact.

## The invitation needs a demonstration

Use a small factory decision: increase pressure, see output and strain change,
then read a character's response with the event record available beside it.
Allow a replay with a changed policy so the reader sees consequences rather
than just another generated sentence. Multiple witnesses on the same event
would be a useful future comparison, but the current hosted narrator assigns
one speaker; label any expanded exhibit as newly implemented or illustrative.

Retain authored personality, expressive staging and coherent visual direction.
The point is to test a new way of producing responsive dramatic moments, not to
promise unlimited content or claim that prose generation replaces writers.

The economic question is whether useful responsiveness earns its authoring,
integration, inference, latency and review costs. The analytics question is
whether players recognize the consequence, distinguish the character and
remember the moment. No cost reduction, retention lift or quality superiority
has been established. Those are experiments the engine should make possible.

Close with the owner's transparent connection and direct links to the existing
Loopforge architecture and playable prototype. A fitting invitation is:
"Explore the engine. Change a decision. Follow what happens."
Present the broader comparison on its merits before inviting this exploration.


## Local work audit and narrative refinement — 7 October

Checked staged changes, unstaged changes and untracked files before concluding
this research pass. The source Loopforge repository is clean on `master` at
`3267ea7`. Its presentation worktree is clean on
`codex/loopforge-supervisor-atlas` at `54c234b`; clean does not mean identical to
the main branch. Recent committed work includes the supervisor atlas and the
6 October story bible, which were read alongside the current implementation.
The Sanctuary worktree has substantial existing uncommitted reader, diagram,
asset and editorial work. That work is preserved. The older main checkout's
untracked Loopforge planning README is not current implementation authority.

The new story direction gives the engine argument a more specific purpose.
Loopforge's supervisors bring expertise, rivalries and competing loyalties to a
factory under pressure. Assigning a character a job does not, in the intended
game, settle whether they will cooperate or what they will make of its outcome.
Responsive expression matters because these relationships should make decisions
felt. Avoid reducing the project to commentary over a production spreadsheet.

Present that as the authored game ambition. The story bible explicitly does not
claim additional implemented gameplay. Its proposed refusal, discovery and
branching social outcomes must not be attributed to the current eight-shift
teaching model. Likewise, the atlas paintings are concept scenes, not gameplay
captures. Preserve the first-shift story's concealed premise in any public
invitation; introduce the production objective and contested authority without
revealing the planned discovery.

This strengthens the comparison with CDPR's recognizable consequences, Rockstar's
inhabited places and RimWorld/Dwarf Fortress's event-driven histories. The
Loopforge invitation should let readers inspect one concrete connection between
a decision, a simulated consequence and a character's interpretation, then
understand the larger dramatic world that connection is intended to support.
