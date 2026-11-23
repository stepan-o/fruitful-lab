> Historical material-only checkpoint. The completed focused-interface pass and current evidence are in [focused-console](../focused-console/README.md).

# Six equipment themes and overhead beacon — review

8 October 2026. Scope: selectable equipment, menu/session presentation, asset contracts and outcome light. The broader six-camera/focused-interface composition remains in review; this release does not claim that redesign is finished.

## What is implemented

- All six style directions remain available: Factory Original, Field Instrument, Broadcast Desk, Foundry Switchboard, Submarine Watch and Neural Diagnostics.
- Twelve separate generated production masters produce six monitor families and eighteen resting/hover/pressed control assets. Character/scene art, original instrument icons and glass remain shared.
- A game start menu and in-run Settings use the same selector. A design workbench combines monitor/socket and complete control families and supplies a shareable recipe link.
- Local validated preferences persist. The run and uncommitted choices remain mounted across theme changes and menu visits. No cloud save is implied.
- The overhead beacon uses the corrected circular plan view. It is dark between brief cyan, green, red and amber impulses. Signals come from public receipts, with no inferred accident from a generic incident record.
- Gaussian optical falloff is precomputed once per signal colour; runtime draws one bitmap and source-aligned shadow cuts at approximately 30 fps. It stops between impulses. Reduced motion removes the rotating beam; atmosphere-off disables the effect.

## Visual and interaction review

All six presets inspected on the real first-turn console at 1440×900. Native text and decisions remain identical. Frames and controls are visibly different and no page overflow appeared. Mixed Factory Original frames / Foundry Switchboard controls resolved to the expected shareable recipe.

390px mobile briefing and selector checked. An unissued revised assignment survived changing equipment from inside Settings. The 320px selector stays within its dialog width and scrolls vertically. The game also remained within 2560px page bounds. The current broader phone composition still scrolls; this is not a claim of the later one-screen six-camera solution.

Completed an actual seed-7 run: LIMEN adviser, reversed placements, output-preserving conveyor override, automatic Security resolution, 22 produced, 11 retained / 11 delivered, 35 workers and 67% line condition. The dispatch confirmation survived a menu/resume round-trip. This particular trajectory had no worker injury; the red path is covered by receipt tests and explicit author preview, not claimed as an accident in that run.

The local preview was interrupted during server lifecycle changes. Confirmed state remained visible, orders were blocked, and reconnect restored the same revised plan. After restarting the preview in an interactive terminal, the complete flow finished. No captured browser runtime errors in the inspected completed session.

## Delivery cost

The complete active kit includes a frame and all three button states, prepared before it is applied. Inactive full-size kits are not loaded. Settings separately uses small frame previews.

| Kit | Compact kit | Desktop kit |
| --- | ---: | ---: |
| Factory Original | 73 KiB | 205 KiB |
| Field Instrument | 80 KiB | 218 KiB |
| Broadcast Desk | 81 KiB | 200 KiB |
| Foundry Switchboard | 86 KiB | 224 KiB |
| Submarine Watch | 87 KiB | 228 KiB |
| Neural Diagnostics | 98 KiB | 261 KiB |

These are manifest byte sums for the new material family only, not whole-page transferred bytes or field performance measurements. Shared scenes, portraits and existing material assets are additional. No WebGL renderer, theme library or other runtime dependency was added.

## Checks

Required asset release checks, 348 tests in 68 suites, one snapshot and the production build pass. Focused tests cover all six registrations, malformed recipes, failed/superseded preparation, persistence, in-flight selection blocking, retained dispatch edits and menu/resume. Light tests separate warnings from accidents and verify tangent-ray collinearity from all source quadrants. Targeted React/TypeScript lint is clean.

Raw repository-wide standalone TypeScript checking also reports existing unrelated test-fixture errors in Pinterest and GrowthBook tests. The required production TypeScript build passes.

## Evidence

The six `theme-N-desktop.jpg` files show the same unassigned first turn. `mobile-selector.jpg` records the 390px selector. Additional debrief and pulse evidence accompanies the final preview review.

The source contracts are [UI_THEME_ASSET_SYSTEM.md](../../UI_THEME_ASSET_SYSTEM.md) and [CONSOLE_LIGHT_FEEDBACK.md](../../CONSOLE_LIGHT_FEEDBACK.md). Owner review still determines the winning combination and final visual composition.
