# Integrated producer console — review evidence

8 October 2026. Four integrated skins replace the six player-facing equipment options. The old equipment packs remain internal focused-screen material families and historical review assets. This is agent verification, not owner acceptance.

## Implemented and checked

- Foundry desk, Broadcast control, Dispatch office and Obedience organ: distinct wide geometry, original clean runtime plate, original portrait plate and local beacon.
- Console-first opening: answer leadership, inspect handover/quota, acknowledge, then choose an adviser. Early closure leaves gameplay held. Reopening an acknowledged call does not reset it.
- A real browser run on the production build completed STILETTO → briefing → placement desk → production → delegated conveyor response → Security override → permanent dispatch → debrief. Result: 22 produced, 11 retained, 11 delivered, 35 workers, condition 82 → 67, all workers survived.
- Switching Broadcast → Dispatch while a swapped assignment was unconfirmed preserved the revised plan. Escape returned keyboard focus to Settings. Restoring the adviser proposal and approving it continued the same run.
- A stopped local preview exercised Reconnect: the approved adviser/plan was retained and the line could start after reconnection.
- All four wide and portrait skins inspected. 390×844 uses six portrait feeds; 320×740 uses one selected feed and six named channels; 844×390 uses camera-left/controls-right. Selection and acknowledgement survived resize. Page scroll bounds equaled viewport bounds in measured phone and landscape cases. Desktop 1440×900 and hosted 2555×1310 checked; the larger console fit the viewport.
- Effects-off preserved all information and produced `animation-name: none` for recording lamps. CSS and canvas reduced-motion paths use stable emphasis instead of rotational motion; no device-level reduced-motion benchmark is claimed.
- Review caught and fixed mismatched screen/glass calibration, undersized phone room names, rectangular hover highlights, hidden Dispatch operator overlays in compact modes, and decision speech frozen at zero opacity by the background pause.

## Automated checks

Full repository-required app CI: **71 suites / 371 tests / 1 snapshot passed**, immutable asset test/check and production build passed. Targeted ESLint and whitespace checks passed. Final CSS-only fixes also passed the production build. New tests cover early-close/acknowledge/reopen gates, theme preparation and old-preference migration, and actual ResizeObserver-driven changes through wide/narrow/portrait/compact layouts without sending simulation commands or losing the adviser/selected channel.

## Asset and rendering bounds

Only the selected skin's runtime plates are prepared with its focused equipment. Both orientations are decoded before switching to keep resize transitions coherent. The largest wide + portrait variants cost these encoded bytes, excluding existing scenes/equipment:

| Skin | Wide | Portrait | Combined |
| --- | ---: | ---: | ---: |
| Foundry | 193,562 | 258,000 | 451,562 |
| Broadcast | 101,762 | 164,526 | 266,288 |
| Dispatch | 222,950 | 184,450 | 407,400 |
| Organ | 182,156 | 223,550 | 405,706 |

The local light draws only during bounded impulses, caps its raster width at 1280 and targets about 30 draws/second, with no per-frame React state. It clears when hidden, suspended or resized. CSS screen travel uses transforms. These are implementation bounds and encoded sizes, not measured cold-load, FPS or low-end-device results.

## Screenshots and remaining boundaries

[Foundry portrait](foundry-portrait.png) · [Broadcast portrait](broadcast-portrait.png). These captures precede the final Dispatch-label/dialog-speech CSS corrections. Hosted review confirms the final build separately.

Art is an adaptive layered console, not a live 3D factory. Hover/press use registered fragments of the same plate; fully separated handsets/cords/occlusion atlases and a dedicated sampled ring remain future polish. The unchanged deterministic first-day kernel still has two working rooms and two available supervisors. Later weekly progression and owner enjoyment acceptance remain open.

## Hosted publication

Implementation commit `b27fb02` deployed READY to [Vercel preview](https://fruitful-lbbj6q7ua-stepan-oskins-projects.vercel.app/stepanoskin/loopforge/play). The hosted first shift completed STILETTO → Security override → 11 retained / 11 delivered → debrief, matching the local result. Final decision speech was visibly present. Hosted Dispatch portrait at 320×740 and 390×844 restored live/operator labels and retained the mandate gate across resize; 2555×1310 had no page overflow. No browser errors were recorded. The published Producer console gallery exposes all four wide/portrait pairs. PR #99 remains unmerged for owner review.
