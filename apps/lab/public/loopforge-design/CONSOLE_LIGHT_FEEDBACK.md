# Console beacon and visual feedback

8 October 2026. Owner direction: a dedicated rotary light belongs above every game interface. Its housing is seen almost flat from directly above. The elevated/isometric first draft was rejected.

## Default: dark

Rotations fire as bounded impulses. Between impulses, no beam or coloured glare remains. The screens and choices hold attention. A sparse cyan idle impulse gives the equipment a little life without implying that a paused simulation is advancing.

| Trigger | Colour | Behaviour |
| --- | --- | --- |
| No click/key input for 12 seconds | Light cyan | One slow 2.8-second revolution. At most once per 18 seconds, at least 6 seconds after another signal. Pointer movement does not continually postpone it. |
| New production confirmed | Green | One 1.15-second sweep. Several units in the same receipt share one impulse. |
| Accident confirmed | Strong red | One 1.35-second sweep; takes priority over lower signals. |
| Choice or event requiring attention | Ember / amber | One 1.6-second sweep when the request arrives. The decision remains labelled after the light extinguishes. Orders accepted also lights the ready-to-start control. |

These timings and intensity values are initial presentation tuning, not simulation constants. Repeated lower-priority signals are coalesced during the current sweep and one second of darkness. Accident outranks attention, which outranks production, which outranks idle. No replay of old lights when reopening a menu, restoring a projection, changing theme or switching interfaces.

In the current first-day slice, new worker losses establish an actual accident. An incident record by itself may be a warning or a paperwork dispute; it is not evidence of physical harm. Later equipment-only accidents should receive an explicit public outcome tag when that mechanic exists. Do not infer an accident from arbitrary prose. Production is currently batched basic-robot completion, so a batch receipt produces one green pulse; a later per-brain completion event can use the same presentation vocabulary.

## Physical construction

The housing, collar and glass are an authored overhead asset. Concentric circular construction replaces the earlier tall side-wall view. A directional light aperture turns through one full circle about the same source used for the beam. The housing stays fixed. The beam moves continuously around that point, not through a mirrored left/right oscillation.

One lightweight Canvas 2D surface draws the stage-wide sweep. Raised corner fittings on visible camera, portrait and menu frames act as screen-space occluders. Their tangent rays originate at the measured beacon centre; those rays remove light behind the obstruction. This is inexpensive planar occlusion, not a claim of full 3D shadow mapping. The background retains the actual asset texture. No fabricated shadows should cut across a beam from an unrelated source.

Geometry is measured once at the start of an impulse. Scroll or resize ends the current effect rather than continuing with stale geometry; the next impulse measures again. Maximum canvas width is 1280 logical pixels, maximum 32 fittings, and drawing is capped around 30 fps. No per-frame React state or simulation work. Between impulses no animation frame is scheduled. Hidden pages stop drawing.

Console workspaces share the mounted source. Full-screen cinematic leadership calls deliberately hide the entire console and source. The menu and modal settings have their own visible mount using the same language. An inactive or covered surface does not draw. Sound and readable text still communicate consequences independently.

## Accessibility and review

Reduced motion replaces the sweeping beam with a brief stationary lens indication. Disabling camera atmosphere disables the light effects. No screen-filling flash, constant strobe, colour-only decision or mandatory sound. Light previews live under the explicitly labelled design workbench and create no game event.

Review cyan, green, red and amber on every material set; bright ivory and dark iron will catch light differently. Check source/obstacle/background alignment at desktop and phone sizes. Inspect both the peak and the dark rest state. The light supports the player's current job; it is not a reason to keep the whole page animated.
