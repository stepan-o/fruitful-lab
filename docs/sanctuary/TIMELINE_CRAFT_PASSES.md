# Chapter 2 timeline: period craft pass

9 October 2026. Implementation: `BusinessHistory.tsx`, `HistoryScenes.tsx`, `business-history.module.css`.

The opening now uses the approved caption: “From the arcade cabinet to the cloud, games have sustained businesses far beyond the studios that make them.” Each study carries its era through silhouette, material, interface and activity. The shared Sanctuary vocabulary is dark teal recesses, warm highlights, etched seams, restrained reflections, contact shadows and readable original geometry.

The current reader-facing labels identify a concrete offer within each lane: packaged games, stores, membership libraries and cloud computing. Earlier labels “One console, many games” and “Games sell consoles” are replaced by the distinction between cartridge libraries and competing platforms.

## Three continuing lanes

The 9 October follow-up replaces the single six-step sequence with separate arcade,
PC and console histories. The lanes are ecosystems, not exclusive receiving devices:
PlayStation Now reached Windows through an installed app in 2016. Each lane follows
selected dated examples, with no shared/proportional time axis. Cloud is a stage in
both PC and console ecosystems; it does not erase local play or transfer game rights.

- **Arcades:** Pong in 1972 and present-day card/credit operation. The venue-owned
  machine and paid turn continue; hardware and payment systems are not claimed to
  be unchanged. A long connecting rail makes that persistence visible.
- **PC:** packaged software on home computers; Steam; OnLive’s 2010 PC/Mac launch; PC Game Pass; GeForce NOW.
  The boxed-game explanation distinguishes buying software from renting a turn.
- **Consoles:** interchangeable cartridges; competition around game libraries;
  online stores; membership libraries; cloud play. The platform milestone builds on
  the packaged-game model, rather than inventing a second sales class.

## Focused passes

| Element | Composition and period cues | Activity |
| --- | --- | --- |
| Arcade | Original yellow/woodgrain Pong study; continuing cabinet with a contactless reader | Clipped rally, paddles; reader signal |
| Home cartridges | Woodgrain CRT, six-switch console, cartridge and wired controller | Discrete tank movement and projectile |
| Boxed PC software | Desktop computer with original fantasy screen, illustrated software box and disk | Screen light |
| Console platforms | Grey CD-era hardware, jewel case, wired controller and polygon racer | Road stripes and steering |
| Steam | Olive client, Steam name, unchanged official service symbol, Half-Life and Counter-Strike listings, game/download controls | Download and pointer; logo stays static |
| Console store | Blue PlayStation Store study with individual game offers | Selection light |
| Membership catalog | Three original covers, a visible collection behind them and a single membership band; no TV or computer enclosure | Staggered cover lifts and selection underline |
| Cloud | Server, network and receiving laptop for PC; receiving screen/controller for console ecosystem | Fans, LEDs, cable packet and clipped landscape |

## Visual research and boundaries

Reference photographs were inspected for physical cues only. No reference photograph, game capture or proprietary cover is embedded. The Steam mark is the one official visual citation, served unchanged from the existing immutable asset pack; the surrounding interface is an original simplified period study, not an authentic capture. Original screen studies are genre/period cues, not identified as authentic gameplay. These notes are internal production provenance; they are not reader-facing explanations of our own art.

- [Espace Turing: Atari Pong cabinet](https://espaceturing.mathemarium.fr/Atari-lance-sa-borne-d-arcade-PONG.html): cabinet angle, yellow front, woodgrain enclosure, two-knob panel and low coin door.
- [Centre for Computing History: 1977 VCS Heavy Sixer](https://www.computinghistory.org.uk/det/66273/Atari-VCS-%28Heavy-Sixer%29/): six switches, cartridge slot, black ribs and walnut fascia.
- [Computer History Museum: 1995 PlayStation](https://www.computerhistory.org/timeline/1995/): grey disc-lid console, controller silhouette, front ports and wired connection. The drawing represents the broader 1990s–2001 period, not a launch-day configuration.
- [Steam anniversary](https://store.steampowered.com/sale/steam20) and the [Valve service mark](https://www.valvesoftware.com/en/about) identify the service. The existing `steam-symbol` source/use record now includes this chapter; the image is the 80px, 5,030-byte variant.
- Economic claims and dated milestones remain sourced separately in `business-history.ts` and the chapter evidence register. The drawing dates do not claim the invention or replacement of a model.

## Motion, accessibility and performance

Wide screens show all three lanes with compact illustrations capped at 124px
(76px for the arcade endpoints). At 720px and below, a 44px-high lane selector
shows one history at a time, with two-column milestones and a single-column
reading panel. Selection stays consistent when resizing. The interaction cue is
above all choices; the time-scale qualification stays below the readout. Native
buttons expose selection, keyboard activation and the associated polite detail
panel. Decorative SVGs are hidden from assistive technology.

Activity uses CSS transforms and opacity, with no per-frame React state, timers, canvas loops, animated blur or additional library. `useLivingPlate` gates the figure through viewport visibility, document visibility, the shared motion preference and OS reduced motion. The global pause control supplies a static readable state. Visible eras remain alive without selection; hidden mobile lanes are explicitly paused. Selection increases contrast and adds a restrained brass/teal frame. Static SVG subtrees are memoized. Clip paths keep game activity and streaming light inside screens. The only new image request on this chapter is the existing 5,030-byte Steam mark. Its manifest entry is serialized through the chapter-scoped media contract, not an imported client-side inventory. No new pack or dependency is introduced.
