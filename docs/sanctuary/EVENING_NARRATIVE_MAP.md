# Sanctuary Economics — the life around the game

Current editorial authority · 3 October 2026 · follows the arcade-first revision.

## The argument

People give a game a place in their lives. Someone must make and maintain the
conditions for that experience, and the work must be funded. A sale happens
inside that relationship; the object or access sold is not a complete account
of the value created. Follow **purpose → provision → payment → consequence**,
then ask what evidence would tell us whether the arrangement works.

The initiating observation is the owner's conversation about arcades: a venue
could value a cabinet as something that made an evening livelier, without
thinking primarily in optimized cents per run. This is an interpretive opening,
not historical testimony about all bar owners. The published essay uses an
explicitly imagined room rather than retelling a family conversation.

The game begins as an attraction in a venue. A purchased copy lets its audience
supply repeated occasions at home. Online, the game can become a gathering
place itself. These arrangements coexist; they are neither an inevitable
sequence nor a hierarchy of creative worth. Single-player and solitary play
remain first-class experiences. Friendship does not require subscriptions;
recurring revenue does not guarantee community.

## Who values and provides what

| Participant or role | What matters | What cannot be inferred from one number |
| --- | --- | --- |
| Player | Challenge, company, expression, discovery, an evening alone | Time played does not identify the purpose or satisfaction |
| Other participants | Companions, opponents, an audience, a populated world | Headcount does not mean friendship or suitable teammates |
| Venue owner | A place worth visiting and a viable business | Cabinet coin income need not capture its whole contribution |
| Machine operator | Working equipment and a viable paid-play offer | A manual setting does not reveal every operator's priorities |
| Manufacturer / creator | Work people value enough for someone to purchase | The buyer of the machine need not be the person inserting coins |
| Online provider | Continuity of connection, activity and service | A finished content library does not guarantee a usable live world |

Roles may overlap or be split among businesses. The illustrations do not invent
revenue shares, drink-sales uplift, session lengths or causality.

## Full chapter impact map

| Chapter | Job in the argument | Implemented editorial action |
| --- | --- | --- |
| Insert coin. Join in. | Establish an evening, then introduce the paid resource and the different businesses | Rebuilt; room/world comparison precedes the retained operator exhibit and manual |
| The next attempt is already paid for | Bring provision home; separate return, purchase and connection | Reframed home setting, free Battle.net, connection costs and transition |
| The business of keeping a world alive | Bring creator and parts of venue operation together; reach BG3/D4 fork | Rebuilt opening/interpretation, added bounded social evidence and world view |
| Concord | Explain the fragility of a promised future that requires other people | Recast commitment and audience dependency; preserved dated timeline |
| What a studio can learn in time | Test what someone understands and intends, not usage alone | Connected observational example to activity around the cabinet |
| The shape of the money | Account for making, operating and maintaining worthwhile experience | Reframed costs and the visibility of non-store work |
| Six games, different promises | Compare desired experience, available activity and purchased package | Rebuilt entry/exit; retained concrete game comparisons |
| Where progress lives | Separate stored character, knowledge, purchase and shared occasion | Reworked seasonal invitation and unsynchronized lives |
| What players want | Distinguish motives, company, social presence and personal context | Expanded distinctions; removed typological shorthand and repaired definition |
| Play beyond the score | Make room for challenging art and value beyond enjoyment or return | Revised difficult-art passage; kept close reading |
| Anatomy of a loop | Explain how repeated rules become an evening with meaning | Reframed mechanism-versus-experience opening |
| The loot table | Show how uncertainty distributes a project's duration | Rebuilt consequence around alternatives and time with others; retained probability model |
| The checklist | Contrast a shared occasion with competing personal deadlines | Rebuilt concluding design question; retained interactive schedule |
| Familiar verbs, changing decisions | Follow what a rule or purchase changes in actual play | Rebuilt bridge to transaction chapters |
| Access | Show remaining prerequisites and whether the buyer can use what they bought | Reviewed and retained: friends/readiness example already carries the frame |
| Identity | Explain authorship, belonging and the earned wardrobe | Rebuilt conclusion; avoids treating all social value as status |
| Time | Compare the whole evening on paid, earned and traded routes | Reviewed and retained: already compares meaningful effort and relief |
| Power | Ask how an efficient acquisition route changes the activity people value | Reviewed and retained: D3 auction-house example already supplies the consequence |
| What things actually cost | Reconnect the internal unit to the actual commitment | Rebuilt conclusion linking arcade units to a distinct modern offer |
| The two-key lock | Explain what a purchase recruits from future evenings | Reviewed and retained: already makes earned requirements and deadlines concrete |
| Abstraction and surface | Test whether someone can explain their commitment before paying | Reviewed and retained: already tests budget/time/ownership together |
| Does any of it work? | Close the account with the person, provision and business together | Rebuilt conclusion and return-screen example; operational outcomes made explicit |

Seventeen chapters receive prose changes. Five retain their existing specific
arguments after review. Stable IDs, 22 chapters, seven parts, original artwork
and the selected public media remain. This pass develops the accepted spine;
it does not claim to add the still-separate Diablo I/franchise-history chapters.

## Visual plan and implementation

- `EveningPlace.tsx`: a wide original room/courtyard study with two explicit
  views. The scene changes alongside three readable accounts: people, the work
  and payment. Introduce it after the opening's historical setting; revisit its
  world view when discussing online places in chapter three.
- `ArcadeExchange.tsx`: keep the documented health controls as a focused second
  instrument, after Gauntlet and its intangible resource have been introduced.
  Player/operator controls are not represented as the entire venue relationship.
- Preserve the cinema/catalog, BG3/D4, purchased-copy history, progression
  diptych and all deeper instruments. Their positions follow their arguments.
- Static memoized SVG geometry; state changes only on explicit view selection.
  No animation loops, timers, raster assets, network requests or dependencies.
  The surrounding established atmosphere supplies motion. Both views are
  complete stills and the explanation is available as HTML, not tiny SVG text.

## Evidence boundaries

- CHM's **50 Years of Fun With Pong** (2022) supplies the prototype's placement
  at Andy Capp's Tavern in 1972. It does not establish the owner's motivation.
  https://computerhistory.org/blog/50-years-of-fun-with-pong/
- Atari's Gauntlet manual and Ed Logg's 2012 GDC retrospective retain their
  earlier roles: paid health, operator guidance, sales chain and ending choice.
- Steinkuehler & Williams (2006) supports the potential of particular online
  worlds as informal social settings, not universal community or welfare.
  https://doi.org/10.1111/j.1083-6101.2006.00300.x
- Ducheneaut, Yee, Nickell & Moore, **Alone Together?** (CHI 2006), distinguishes
  grouping from audience and social presence in an observational WoW study.
  Its account is not a measured claim about Diablo IV players.
  https://www.nickyee.com/pubs/Ducheneaut,%20Yee,%20Nickell,%20Moore%20-%20Alone%20Together%20(2006).pdf
- Original cross-industry comparisons and hypothetical design cases are labeled
  through the prose and chapter evidence notes. Financial viability and player
  value can align or conflict; neither harmony nor exploitation is assumed.

## Acceptance

Read the first three chapters in order: a newcomer should understand the people
and setting before operator math, then understand what changes with the copy and
the maintained online world. Read the conclusion against the opening: its
questions must now close the same argument. Check source indices, no duplicated
inline media, perspective controls, keyboard input, 320/390/768/desktop layout,
image inspection and existing chapter navigation. Record production verification
and limits alongside the implementation in the narrative reconstruction log.

The landing is a single hero and study-entry action. Within chapter three,
“future sales,” “the gap” and “subscription” receive the narrative inscriptions
defined in the design system. The subscription motif joins sales invitation and
recurring payment in one mechanism; the corresponding catalog diagram explains
that relationship at a larger scale.
