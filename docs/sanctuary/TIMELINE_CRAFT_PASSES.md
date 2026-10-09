# Chapter 2 timeline: period craft pass

9 October 2026. Implementation: `BusinessHistory.tsx`, `HistoryScenes.tsx`, `business-history.module.css`.

The opening now uses the approved caption: “From the arcade cabinet to the cloud, games have sustained businesses far beyond the studios that make them.” Each study carries its era through silhouette, material, interface and activity. The shared Sanctuary vocabulary is dark teal recesses, warm highlights, etched seams, restrained reflections, contact shadows and readable original geometry.

The reader-facing labels name the business change: **Pay per play**, **One console, many games**, **Games sell consoles**, **Downloads and streaming**, **Subscribe to a catalog**, and **Rent a remote PC**.

## Focused passes

| Milestone | Composition and period cues | Activity |
| --- | --- | --- |
| 1972 · Pong | Yellow sloping control face, woodgrain side/base, inset monochrome CRT, two silver knobs, small metal coin door. No later arcade marquee or joystick. Coins and a power lead anchor the cabinet to the floor. | A rally stays within the screen; both paddles follow the ball’s approach. |
| 1977 · Atari VCS | Woodgrain television, aerial, mechanical dials and speaker slats; six metal console switches, inserted cartridge, ribbed black top and wired single-button joystick. | An original pixel tank shifts in discrete steps; a shot crosses the screen and ends in a short pixel burst. |
| 1990s–2001 · Console ecosystem | Grey CD-era console with circular lid and front ports, wired twin-grip controller, jewel case and chunky CRT. Original polygon scenery distinguishes the screen from the earlier pixel display. | Road stripes advance while the car makes small steering corrections. The console and controller stay grounded. |
| 2003–2007 · Online shelf | Desktop monitor, keyboard and mouse; olive library window overlaps a burgundy instant-watching window. These suggest period software without reproducing an actual Steam or Netflix interface. | A stepped download fills, a cursor moves between controls and the watching pane breathes gently. |
| 2017–2018 · Monthly catalog | Thin TV with feet, compact horizontal console, wireless controller and a library of four original cover studies. The display carries the offer; no physical subscription box metaphor. | A selection frame dwells on each cover before advancing, like browsing a TV catalog. |
| 2020–2026 · Cloud routes | Server trays with intake vents, fan hubs and activity lights; a connected thin laptop, physical cable path and router. Local display and remote compute remain distinct. | Fans rotate, LEDs blink, a packet follows the drawn cable, and clouds move within the laptop’s clipped screen. |

## Visual research and boundaries

Reference photographs were inspected for physical cues only. No reference photograph, logo image, game capture, proprietary cover or copied UI is embedded in this figure. Original screen studies are genre/period cues, not identified as authentic gameplay. These notes are internal production provenance; they are not reader-facing explanations of our own art.

- [Espace Turing: Atari Pong cabinet](https://espaceturing.mathemarium.fr/Atari-lance-sa-borne-d-arcade-PONG.html): cabinet angle, yellow front, woodgrain enclosure, two-knob panel and low coin door.
- [Centre for Computing History: 1977 VCS Heavy Sixer](https://www.computinghistory.org.uk/det/66273/Atari-VCS-%28Heavy-Sixer%29/): six switches, cartridge slot, black ribs and walnut fascia.
- [Computer History Museum: 1995 PlayStation](https://www.computerhistory.org/timeline/1995/): grey disc-lid console, controller silhouette, front ports and wired connection. The drawing represents the broader 1990s–2001 period, not a launch-day configuration.
- Economic claims and dated milestones remain sourced separately in `business-history.ts` and the chapter evidence register. The drawing dates do not claim the invention or replacement of a model.

## Motion, accessibility and performance

A compact six-column row on wide screens (1100px+), three columns on narrower screens and two on small phones keep the studies legible. Illustrations are capped at 160px; chronological order remains in the DOM and numbered labels. Native buttons expose selection, keyboard activation and the associated polite detail panel. Decorative SVGs are hidden from assistive technology.

Activity uses CSS transforms and opacity, with no per-frame React state, timers, canvas loops, animated blur or additional library. `useLivingPlate` gates the figure through viewport visibility, document visibility, the shared motion preference and OS reduced motion. The global pause control supplies a static readable state. All eras remain alive without selection; selection increases contrast and adds a restrained brass/teal frame. Static SVG subtrees are memoized. Clip paths keep game activity and streaming light inside screens. No new image downloads or asset manifests are needed.
