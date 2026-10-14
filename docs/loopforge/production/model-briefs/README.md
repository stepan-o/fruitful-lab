# Model briefs — Loopforge production archive

14 October 2026. Four reusable character kits: LIMEN body/emitter, Worker 01, STILETTO body/blade/welder and CATHEXIS body/face system/material conditions. Game Design → Model briefs is the maintained visual entry; each current model viewer links back to its brief. Rivet Witch and Thrum are not yet generated and have no completed briefs in this release.

## Source and delivery

Canonical prompts and catalog are in docs/loopforge/production/model-briefs/. The board publisher verifies every optimized image hash and emits per-model versioned JSON and plain-text downloads. Initial navigation loads only catalog metadata and the selected character's data/images. No GLBs are embedded or prefetched. Viewer links open the real production players.

The browser assembles ZIP STORE archives on demand after verifying every file's SHA-256. Kits contain numbered prompts, 1800-pixel-maximum high-quality JPG inputs, a README, image provenance and actual motion audits where available. JPEGs remain single copies in deployment; ZIPs are not duplicated on disk. Original PNGs and source model binaries remain in the private/local source archive. Generated drawings are modeling guides, not dimensionally consistent CAD views.

Use the current briefs for rebuilds. Worker and STILETTO preserve recovered input art and creation requests with updated delivery instructions. LIMEN is explicitly reconstructed from accepted v2 records: the original prompt and isolated upload images were not recovered. CATHEXIS is ready for staged generation, not a finished or approved model. A/B/C grime selection is pending; all image options are labelled.

## Change discipline

Update source prompts, catalog revision, image provenance, viewer/review status and rebuild the board together. Never silently overwrite a published image or claim that Meshy regenerates exact topology, sockets or authored corrections. Main-play bodies, simulation logic and AWS access are unchanged. App hosting remains the previously approved temporary asset path while CloudFront is pending.

## Validation

Run python docs/loopforge/game-design/build_board.py, verify published hashes/download archives, inspect desktop/phone Model briefs and viewer navigation, then run the Lab production build. Record results in MODEL_BRIEF_LIBRARY_VERIFICATION.md. Field performance and physical-phone rendering remain unmeasured.
