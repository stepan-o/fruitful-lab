# Camera-console style review — 8 October 2026

Review at `/stepanoskin/loopforge/design#ui-styles`. Six directions: Factory Original, Field Instrument, Broadcast Desk, Foundry Switchboard, Submarine Watch and Neural Diagnostics. The baseline plus five requested agents each produced a material sheet grounded in original Loopforge assets. No production direction is selected.

- [Gallery](gallery.jpg)
- [Desktop comparison](comparison.jpg)
- [390px comparison](phone.jpg)

All six sheets opened in the browser. Comparison selectors, full-detail mode, native modal focus and Escape return were exercised. Desktop, 390px and 320px layouts were inspected; no page overflow. The production-built app serves the design route. Generated HTML IDs and local references validate. CI passed: 340 tests / 66 suites / one snapshot, asset-release checks and production build. A subsequent close-button nowrap adjustment was regenerated and checked in the production app.

Sheet derivatives: 30–39 KB at 480px, 98–154 KB at 960px, 195–354 KB at 1536px. Originals and exact prompts live outside public media in `apps/lab/assets/sources/loopforge-camera/`. Existing immutable releases are retained. These are style-study and review-tool checks, not acceptance of the playable interface or a later-act simulation.
