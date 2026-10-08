# Loopforge camera console — art direction

8 October 2026. Current owner direction for the interface rebuild. This supersedes the prior generic gunmetal skin and illustrated locked-room cards. Runtime replacement is not yet complete.

## Physical premise

A working security camera console in the Loopforge factory. It has been used, marked, repaired and kept going. Painted steel, heavy glass, worn brass fasteners, dark rubber, grime in seams and hand-written adhesive tape belong to one physical object. Its character comes from the original factory and supervisors, not an unrelated science-fiction HUD.

Six monitor positions persist. On the first turn two show the available rooms. The four locked rooms show only unpowered glass and their names on tape. No interior, silhouette, static transmission, padlock, commissioning hint or operating readout appears inside a locked monitor. Glare is a reflection of the console environment, not a video feed.

Tape labels look hand-written in dark pen by a hurried security guard: slight baseline drift, uneven pressure, torn fibres, thumb grime and lightly lifted corners. Keep every name immediately readable. Names remain semantic accessible text in the interface even when the visible lettering is baked into the artwork. Mess belongs to the material, not to the information hierarchy.

## Source study

Owner's original repository, `frontend/loopforge-webview/public/assets/`:

- `concept_art/characters/character_sheets/set_1/limen_character_sheet_1.png`: cracked blue-black skull/enamel, weight, seams, cyan optics. Use the weight and construction; do not decorate the whole console with skulls.
- `.../stiletto_character_sheet_1.png`: polished dark metal, sharper edges, localized red-orange emission. Use this for urgent highlights and decisive controls. Her red visor remains character identity, not evidence of an incident.
- `.../cathexis_character_sheet_1.png`: aged pale ceramic and warm brass; offers a restrained light material for readable labels and later character-specific surfaces.
- `.../rivet_witch_character_sheet_1.png`: brass instruments, green-black machinery, visible joinery and repair. Use repair marks sparingly at actual seams.
- `.../thrum_character_sheet_1.png`: optical housings and mechanically credible concentric parts. Useful for supervisor sockets and intercom hardware.
- `concept_art/rooms/04_loopforge_rooms_neural_lattice_converyor_1.png` and the selected Lab `assets/loopforge/forge.webp`: dense mechanical construction, soot, amber work light, oily reflections, paper tags. Do not bake active production or supervisors into new chrome.
- Selected Lab `assets/loopforge/security.webp`: physical status boards, old controls, hanging tags, saturated red lighting and crowded working surfaces. Borrow material specificity, keep operational text compact.
- `ui/chrome/hi-res/{topstrip_plate,gunmetal_tile,glass_glare}.png` and `docs/sim_sim/sim_sim_ui_style_sheet_v1.png`: established steel/glass layering. Their clean generic panel geometry and broad neon palette are not sufficient as the new art direction.

All listed images were inspected. No outside game's artwork is included. Frostpunk/XCOM/IXION/Lobotomy references inform interface responsibilities in `INTERFACE_JOB_STUDY.md`, not the asset style.

## Six directions under review

The owner liked the baseline and requested five additional agent-generated alternatives before selecting or prototyping a direction. The design board's **UI style studies** tab presents Factory Original, Field Instrument (PIP-Boy-inspired equipment), Broadcast Desk, Foundry Switchboard, Submarine Watch and Neural Diagnostics. Each has a full-size view, comparison controls and implementation concerns. No direction has been selected as winner. All six now have separate production monitor frames and complete button state families, selectable in the game Settings. Shared icons, glass and portraits remain the first comparison baseline. Remaining specimens on each sheet are future asset work, not implemented merely because they appear there. The sheets explore material and construction, not new mechanics or finished screen layouts.

Originals and exact generation records are in `apps/lab/assets/sources/loopforge-camera/`. The immutable `loopforge-ui-studies` pack serves only the author-facing review. The playable UI does not load these sheets or change its skin. Alternative palettes in their provenance records are proposals; the table below remains the baseline palette.

## Typography proposal

Use [Barlow Semi Condensed](https://github.com/jpt/barlow) Medium for live speech, in sentence case with short lines; use [IBM Plex Mono](https://github.com/IBM/plex) for instrument readouts. These are proposed, not newly bundled fonts. The selected composition must test actual phrases at phone size before approval. Tape lettering is separately authored messy pen art with a semantic text equivalent. No distressed font for changing numbers, long dialogue or critical consequences. Both font projects publish open font licenses; retain the relevant license when bundling.

## Palette and use

These values are authored rendering tokens, not claimed exact pixel samples from the references. Generated paint should remain within this family; final dynamic text/indicators use these explicit tokens.

| Token | Colour | Role |
| --- | --- | --- |
| Ink | `#0B1110` | Deep recesses and screen black |
| Enamel | `#202B28` | Main painted steel, green-black cast |
| Worn steel | `#50554D` | Small scuffed edges and hardware |
| Old brass | `#8C704B` | Fasteners, contacts, instrument trims |
| Tape | `#CFC3A0` | Aged adhesive room labels |
| Readable light | `#ECE5D2` | Live labels and numbers on dark surfaces |
| Signal | `#91DAD5` | Selected channel, accepted connection; small area |
| Caution | `#E3A04F` | Pending attention, not every live feed |
| Alarm | `#F04437` | Consequential incident; localized bright source and reflected red |

Do not encode state with colour alone. Pair a light with a label, placement or distinct silhouette. Do not add stress/confidence/loyalty indicators to justify a decorative dial. Every invented gauge would imply a mechanic we have not exposed.

## Asset construction

Generate a shared material/style sheet first. Inspect it against the original character sheets and factory. Then generate each production asset separately from that sheet, preserving the same camera angle, top-left key light, edge wear scale and material response.

The monitor frame and glass are separate layers. Frame corners keep their proportions. The picture and all state overlays sit inside the opening. Tape sits on the lower physical bezel, never floats over the room picture. Supervisor tokens dock in purposeful sockets outside the glass. Controls that commit a decision have physical travel/pressed feedback; ordinary navigation does not look like an emergency stop.

Asset order:

1. Shared material/style sheet and palette.
2. Modular monitor bezel, without a baked screen, controls or lettering.
3. Powered-off glass, with subtle soft reflections and dust confined to edges.
4. Six individual room-name tapes: LATTICE FORGE, SECURITY, BURN-IN THEATRE, COGNITIVE SUBSTRATE BREWERY, WEAVING GALLERY, CORTEX ASSEMBLY.
5. Supervisor socket / intercom hardware, blank centre for identity art.
6. Replacement resource symbols: funds, workers, line condition, weekly delivery. They must share relief, lighting and scale. No extra currency or hidden-state symbol.
7. Main control face and consistent interaction states; remaining assets follow the focused screen layouts.

Only selected optimized derivatives enter runtime. Preserve prompt/reference records and originals outside public assets. The style sheet is an authoring reference, never a runtime dependency for the game. Native controls and semantic text remain independent of the paint.

## Composition and feedback gates

Supervisor tokens carry their current short statement in a speech bubble visibly attached to that character. Speech stays live semantic text on an asset-based bubble, rather than being baked into a portrait. The bubble can express indifference, impatience or an objection; it must not imply an available decision when it is only feedback. Portrait/token motion is a bounded entrance, selection response or new-report cue, not continuous competing bobbing. At first choice both advisers receive equal visual prominence; art direction must not recommend one playstyle by making one token glow more.

The next available action is conveyed through local light, physical travel, composition and state: adviser sockets invite the first choice; proposed tokens settle into receiving room sockets; a confirmed plan arms the shift control. Retain readable action labels and keyboard focus. No persistent instructional paragraph on the factory wall. Contextual learning belongs in dismissible help at a relevant action, the briefing, an event notice and a recoverable guide. See `ONBOARDING_DESIGN.md`.

- Review the same six positions in first-turn and full-floor states. First turn has no assignments, two adviser choices and four genuinely black screens. The full-floor authoring fixture must not be presented as a working later-act simulation.
- The room labels must survive phone scale. Long names can occupy two hand-written lines; do not abbreviate into unfamiliar acronyms. All six summaries remain available together.
- A glance finds the day/quota, operating rooms and adviser choice. Scratches, rivets, glare and idling motion rank below these.
- One shared light direction; no independently tilted housing/button layers. Keep the camera nearly front-on for readable equipment.
- No permanently flashing alarm, fake waveform or animated counter. REC belongs only to an available camera. A locked camera has no powered activity.
- Subtle grain/line interference on active feeds; occasional mechanical response to confirmed game events. Respect reduced motion, manual pause and hidden-page lifecycle. No broad animated blur or per-frame React updates.
- Check individual assets at target size and together against the existing landing art. Passing an asset inspection does not clear the complete UI gate.

## Execution checklist

- [x] Inspect five supervisor sheets, factory/security scenes and original chrome/style sheet.
- [x] Record the powered-off room rule and material/colour roles.
- [x] Generate and inspect the baseline plus five agent alternatives.
- [x] Add all six to the design discussion page for comparison.
- [x] Owner requests all six directions remain available as working presets.
- [x] Generate and inspect six separate monitor/control production kits.
- [x] Integrate each kit into the current comparison console; final responsive evidence lives in review/theme-system.
- [ ] Integrate into the focused interface rebuild; verify the complete first-day flow.
- [ ] Clear the complete playable UI gate before marking the rebuild ready. The style-review tab can be published separately on the draft PR; it does not clear that gate.

## Runtime comparison and light

All six presets and the controlled frame/control mixer are implemented. See `UI_THEME_ASSET_SYSTEM.md` for ownership, source records, immutable delivery and composition boundaries. The shared beacon uses a nearly flat overhead asset and is dark between brief triggered rotations; the first elevated/isometric draft was rejected. See `CONSOLE_LIGHT_FEEDBACK.md`. This does not clear the broader gameplay composition gate.
