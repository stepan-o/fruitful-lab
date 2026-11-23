# Loopforge director console artwork

Selected build inputs, 8 October 2026. The runtime uses the immutable
`loopforge-console` pack; these masters are not served directly. Native text,
focus, button semantics and changing game values remain separate from the art.

## Provenance

- `limen-portrait`, `stiletto-portrait`: generated with the built-in ImageGen tool
  against the respective original character sheets from the owner’s Loopforge
  repository (`concept_art/characters/character_sheets/set_1/`). New portraits
  preserve the skull/cyan eyes and closed red T-visor identities respectively.
- `monitor-frame`, `button-*`: generated against the original sim-sim
  `frontend/loopforge-webview/public/assets/ui/chrome/hi-res/topstrip_plate.png`.
  The three button states come from one registered atlas. No outside game art.
- `instrument-plate`, `gunmetal`, `glass`: the original sim-sim chrome assets.
- `grain`: original `ui/fx/hi-res/noise_tile.png`.
- `funds-icon`, `worker-icon`, `condition-icon`, `signal-icon`: original sim-sim
  `ui/icons/hi-res/{cash,workers_dumb,heartbeat,signal}.png`.

Generated originals remain in the task’s generated-images archive. Selected
WebP masters and their hashes are recorded in `inventory.json`. Exact generation
prompts are in `PROMPTS.md`. The original Loopforge art is owner-supplied project
material, not Frostpunk material. No new third-party media licence is introduced.

## Preparation and rendering

Portraits preserve the complete generated image. The 1254×1254 button atlas is
split into top/middle/bottom regions at y=180/480/790, heights=300/310/330, full
width, then alpha-trimmed with threshold 10. This removes gutters only; no
perspective, paint or lighting is synthesized during preparation. CSS uses
nine-slice borders for the bezel and state plates, preserving corner proportions.
The unused center of the frame is never rendered.

Texture masters are reduced to 384px (metal), 640px (glass), 192px (noise).
Original icons are alpha-trimmed and reduced to 144px. Prepared masters use WebP
quality 94 and lossless alpha. The catalog produces 240/480/720px portraits,
768px frame, 600px controls, 1024px instrument plate, and 72/144px icons with
explicit byte limits. `npm run assets:build -- assets/loopforge-console.json`
reproduces runtime files from these committed inputs.

Normal/hover/focus/pressed use the separate authored control images. Selection
and alarm are explicit state lights; disabled controls dim the resting plate.
The skin is presentation-only. It cannot assign workers, resolve incidents or
change simulation state.
