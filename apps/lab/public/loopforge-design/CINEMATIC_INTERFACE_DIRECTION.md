# Cinematic interfaces — a different surface, the same factory

8 October 2026. Owner correction: weekly leadership calls need not wear the console. The artwork can fill the screen, with captions/results occupying its darker lower area. Console chrome is a job-specific surface, not a universal wrapper.

## Reference and interpretation

[11 bit studios' visual-design account](https://news.xbox.com/en-us/2021/07/21/how-the-visual-identity-of-frostpunk-changed/) describes coal-like dark splashes on story-event and law screens, weathered screen edges and coordinated colour, particles and environmental materials. This is a primary-source description of their visual language. It supports irregular material framing rather than a clean modal rectangle. It does not specify animation durations; the timing below is our own tuning, not measured Frostpunk timing. No reference footage was successfully sampled frame by frame in this pass.

## Choreography implemented for review

1. A weekly call occupies the full viewport; routine instruments, transport, camera housings and rotary beacon recede entirely. The world is paused. Scene identity and return control remain clear.
2. The scene fades in over 650 ms. A single 1.025-to-1 art settle ends after 1.1 seconds. No endless zoom or full-screen shader. Native caption controls remain usable during the entrance.
3. A generated transparent soot vignette adds asymmetric worn edges. A separate dark lower wash supports readable live type. The centre and robot faces remain uncovered. No baked text or Frostpunk assets.
4. Short labelled topics separate leadership's interpretation from confirmed figures and the weekly mandate. First week uses an opening handover, never a fabricated prior-week performance report. Later weeks require real completed-week records before they can be implemented.
5. Topic changes use a 320 ms local fade; no repeated full-art entrance. Return fades out over 240 ms, then restores the console without issuing a simulation command. Reduced motion and effects-off skip travel and exit delay.

Desktop places speech and facts across the lower part of one large image. Phone holds the director's face in the upper area and gives the lower caption region its own bounded scroll. At small heights, readable content takes precedence over showing the entire painting. Persistent factory facts return with the console. Other future story/event screens can use this surface when the job calls for illustration and reflection; routine room inspection still belongs to the console.

## Original overlay asset

Built-in image-generation mode. Source: `apps/lab/assets/sources/loopforge-focused/cinematic-soot.png`; logical ID `cinematic-soot`. Native alpha retained and optimized by the existing media pipeline. Companion scene and its prompt: [leadership concept](LEADERSHIP_CALL_ART.md).

Final generation prompt:

Use case: stylized-concept. Production game overlay asset for Loopforge's full-screen cinematic event artwork: an uneven organic soot-and-ink vignette frame, black and very dark olive charcoal, wispy painted carbon at edges, subtle worn etched industrial grain. Landscape 1536x1024. Actual transparent alpha across the broad central 75 percent of the canvas. Asymmetric dark feathered edges, top corners a little denser, lower edge gently irregular with very small wisps. Gentle gradients into transparency, detailed natural soot fibres, cinematic tasteful almost invisible framing. No rectangles, no hard frame, no metal, no rivets, no objects, no text, no logo, no checkerboard. Only dark organic edge pigment on transparent background. It will overlay another image; keep center fully transparent and unobstructed.
