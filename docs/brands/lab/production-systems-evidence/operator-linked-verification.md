# Figure 2 — linked chess move and candlelight

5 October 2026 · `codex/profile-operator-composition` · revision of PR #79.
Figure 1 remains the accepted benchmark. This pass changes Figure 2, its source
notes and design/memory documentation; professional facts and other scenes stay
unchanged.

## Visual result

- [Desktop section](operator-linked-desktop.webp)
- [Figure and caption](operator-linked-detail.webp)
- [Phone section](operator-linked-390.webp)
- [Production browser observations](operator-linked-browser-report.json)

A retained front wall with visible section thickness conceals the lower anatomy.
The candle is isolated on a brass bracket, with brighter wax/flame, bounded warm
halos and a source-aligned dancing shadow. A cropped robe and playing arm above
the case make the automaton's presence explicit.

Both boards contain the same sparse position: White king a1/pawn e2 and Black
king h8/pawn c7. A single phase model drives the operator's control hand, input
lever, connecting rod, roof arbor, board hand, Turk arm and both pawns through
e2–e4. The Turk's two rigid sleeve segments meet at a solved elbow; its fingers
grip the lifted pawn. Pieces settle before release, hands withdraw, and the
position holds before a brief dissolve resets the demonstration. No visible
backwards pawn move. Indicators respond to the occupied squares.

The scene is an original interpretation. [HNF's reconstruction](https://www.hnf.de/en/permanent-exhibition/exhibition-areas/the-mechanization-of-information-technology/early-automatons-miracles-of-technology/the-reconstruction-of-the-hnfs-chess-turk.html)
and [its illustrated account](https://blog.hnf.de/zwanzig-jahre-hnf-schachtuerke/)
remain the functional references, with Racknitz credited for engraved likenesses.
The simplified lever transmission is not a blueprint of the museum pantograph.
The repeated pawn move follows [FIDE 3.7.2](https://handbook.fide.com/chapter/e012023),
with e3/e4 unoccupied; it illustrates one decision, not a complete game.

## Geometry and performance contract

The candle is at (222, 200), with caster/receiver depths 50/70. The projected
silhouette is enlarged 1.4× around the source. Source movement ΔL shifts it by
−0.4ΔL. Flame, illumination and shadow share keyframe times/easing. Moving
forearms are reused in the cast silhouette and light clip.

All paths, poses and keyframes are emitted on the server. The 12-second chess
sequence uses 101 shared samples; the candle uses a separate 6.4-second cycle.
There is no new client boundary, timer, observer, frame loop, dependency, raster
asset or SVG filter. The source character's engraving is defined once and reused
for articulated fragments. Existing pause, offscreen, reduced-motion and print
rules apply to every new group. The static state has both pawns on e2 and the
correct origin/destination indicator contrast.

## Validation

Required Lab CI: asset checks, **50 Jest suites / 224 tests**, and production
build pass. Seven new geometry tests cover source/caster/receiver collinearity,
CSS light/shadow coupling, loop continuity, legal/unobstructed chess movement,
matching board coordinates, hand-to-pawn contact, fixed arm lengths and connected
joints. Scoped ESLint passes. The final production build was repeated after the
static destination-indicator opacity was corrected. Those final local build
wrappers received SIGTERM after emitting the complete route table; their produced
artifact was used for the browser review. The PR deployment provides the final
independent build check.

Production Chromium review at **1440, 768, 390 and 320 CSS pixels** found no
horizontal overflow; all eight scenes remain present. The operator contains
**693 SVG descendants and 24 animated groups** at every width. Desktop/detail
and phone captures were inspected at reading size.

The recorded moving frame independently confirms matching file/rank progress
and lift fraction on both boards (within 0.001), hand/pawn alignment and the
inverse candle/shadow offset. All 24 groups freeze with manual pause; transforms
remain identical across observations. The paused preference survives navigation,
keyboard Enter resumes playback, and returning to the visible figure resumes
all 24 groups. References navigation leaves zero operator groups running.
Immediate post-navigation observations can precede the intersection observer;
the settled observation records the final state.

No console errors, duplicate IDs, unresolved SVG references, raster images,
filters, canvas or framework error overlay. The expanded artwork disclosure
contains the HNF and FIDE links. React review confirms server-only geometry,
reused figure paths, fixed-size sampling, bounded precision and existing lifecycle
reuse. No shared primitives or accepted Figure 1 machinery were changed.

## Review limits

Raw repository-wide `tsc --noEmit` also includes test files and reports five
pre-existing test typing errors in pinterestPotentialPage, sanctuary-exhibits and
growthbook/middleware.apply; none is in changed files. The Next production build
and its application type validation pass. Full axe, OS-level media emulation,
print export and low-end-device FPS were not rerun. Existing lifecycle tests cover
reduced motion and document visibility. Static CSS explicitly disables all local
motion for reduced motion and print. Measurements below are local build artifacts,
not network/field Core Web Vitals.

The final static page measures **1,718,718 bytes**, **374,897 bytes at gzip level
6** (earlier Figure 2 pass: 1,433,568 / 306,171). The added arm articulation and
shared CSS pose samples cost about 68.7 KB compressed across the whole document.
The 24 scene animations replace the earlier five; no new runtime JavaScript is
required. These are local artifact measurements, not FPS or field CWV claims.
