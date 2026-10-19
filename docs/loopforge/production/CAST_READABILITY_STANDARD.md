# Cast readability and visual hierarchy

## Static comparison studio — 2026-10-18

Open [Cast readability](/stepanoskin/loopforge/play/readability) from the second design chapter, the model-review navigation or the performance lab. This is the first implementation slice, using 24 approved workers plus LIMEN and STILETTO in fixed poses. CATHEXIS is outside this initial two-room comparison.

- Original / Your treatment switches reversibly without changing the shot or asset files.
- Existing, neutral diagnostic and quieter-room presets; floor/wall colour pickers and texture-contrast slider. Lighting neutralisation is a separate slider, initially zero.
- Worker blue-family, LIMEN steel and STILETTO shoulder-band colour/strength controls. Three stable worker shades share textures and geometry.
- Supervisor height sliders normalize neutral foot-to-skull bounds against worker height. Original restores delivered sizes; proposed defaults remain LIMEN 1.25× and STILETTO 1.20×.
- Front/side/rear cameras, fixed camera-distance slider, security/conveyor rooms, names-and-bubbles toggle, emitter/visor, glow and shadow checks.
- Room output is 1280×720; console output is genuinely rendered at 320×180. Poses, blade energy and machinery are held. One WebGL scene renders on demand and sleeps when hidden/offscreen.
- Pin a clean PNG as a fixed reference, save PNGs and export settings with asset hashes, fixed pose samples and neutral heights. Versioned local settings are separate from gameplay graphics preferences.

The shader treatment retains source textures/normal maps but approximates plate masks from texture brightness and bind-space height. It is an art-direction audition, not finished painted armour. STILETTO's shoulder band needs authored masks if selected. The original performance benchmark is unchanged. A still does not certify motion performance or the three-second recognition target; those remain separate reviews after the visual treatment is selected.


18 October 2026 · design requirement and review protocol. The static audition is implemented;
final material authoring and factory-view acceptance remain pending. Owner-approved models and motions remain
the source assets; this standard adds the occupied-scene gate they still need.
Owner refinement: regenerate character sheets as needed. All supervisors should
be generally larger than workers, with strong small-scale shape, size and body
colour signatures; workers occupy a distinct colour family with multiple shades.

## The requirement

After meeting the cast, the player must be able to locate and distinguish the
supervisors in a room without reading names or speech bubbles. The scene must
also show who acts, who receives the action and what visibly changes. Speech
adds the actor's reasoning, belief, attitude or information; it must not be the
only way to identify the speaker or discover that an interaction occurred.

The owner's 18 October review of the Graphics & performance lab exposed the gap:
the crowd and conveyor were visible, but LIMEN and STILETTO disappeared among the
workers. The fixture loads their real models, with energy/visor features, but its
wide fixed cameras, repeated crowd arrangement and low body/background contrast
do not establish cast recognition. This is a failed visual sample, not a measured
recognition score for every camera. A completed timing comparison is not a visual
acceptance pass. Close-up model and isolated-motion approval remain valid.

## Two hierarchies, serving different jobs

**Persistent identity** answers “who is that?” through body silhouette, relative size, broad body colour/value, equipment and
characteristic posture. Distinctive motion and colour
reinforce it. At least two independent cues should survive the chosen view, and
one must work without colour or movement. A tiny visor cannot carry identity on
its own. Named supervisors need recognition; this first gate does not require
every repeated Worker 01 body to be visually unique.

**Momentary attention** answers “what matters now?” Use this order when composing
a beat:

1. The active cause, recipient and immediate consequence: the held worker, a
   threatening blade, a failed machine, the release of a queue. Give the whole
   relationship enough space; do not illuminate only the speaker.
2. Other participants whose reactions explain the event, including a supervisor
   approaching through the shared doorway.
3. Routine workers and machinery establishing the factory's rhythm.
4. Architectural texture and incidental decoration.

Supervisors stay findable; they are not always the brightest or most animated
object. A worker's collapse can take priority over both. Routine workers must
retain readable faces, hands, posture and work contacts when they become the
subject. Never solve hierarchy by making workers uniformly invisible.

## The initial cast

| Actor | Persistent signature at room distance | Motion and staging | Reinforcement and failure checks |
| --- | --- | --- | --- |
| Worker 01 | Smaller compact industrial body, exposed mechanical joints and a distinct blue painted-armour family in several shades (palette proposal below); simpler outline than supervisors. | Repeated task rhythm establishes routine; hesitation, fatigue, confusion and recoil break that rhythm. A worker receiving attention has a clear local silhouette and contact target. | Eyes and hands remain readable at the appropriate shot size. No supervisor-sized ornaments or pervasive bright cyan effects. Individual identity still persists in the engine and dialogue. |
| LIMEN | Larger, broad armoured upper body and heavy, planted silhouette; broad light-steel armour areas over dark joints. One asymmetric cyan forearm energy blade is the strongest active equipment cue. | Deliberate stance, measured approach, inspection and emitter-maintenance pauses. Queue, desk and worker spacing show his control of the checkpoint. | A coherent cyan core survives without bloom. When the blade powers down, armour mass, asymmetry of the housing and posture carry identity; do not show a powered blade against the actual state. |
| STILETTO | Larger/taller slender black-chrome body, long limbs and two rigid blade forearms with clear negative space. Broad red identification panels are a sheet candidate, distinct from the fine visor. Controlled metallic highlights separate shoulders, torso and tool edges from the room. | Purposeful quick walk, decisive pivots and broad blade-aware threat gestures. Reserve physical clearance and a visible silhouette around her arm sweeps. | Eye-level red horizontal cut and vertical seam are secondary cues. The face may be hidden from a rear camera. With welders fitted, retain body/material/posture identity and show the actual short tool modules; flames mean active welding, not a permanent identity lamp. |
| CATHEXIS | Larger/taller body with pale layered dress, crown, hair and theatrical outline; cracked porcelain against exposed mechanics. The dress and crown carry identity from the back. | Hot Walk is the default travel gait; she never runs and has no alert state. Expressive sway, mirror gestures and Red Carpet performance distinguish her from industrial motion. | Grace full/half coverage and warm eyes reward closer views. The underlying body face supplies grimace. Dirt and distress can change large surface areas and posture but must preserve the costume outline and sufficient value separation. Tiny mask expressions do not carry distant acting alone. |

## Size and body-colour sheet direction

**Required:** all supervisors are generally larger than workers. Express that in
whole-body scale and silhouette: LIMEN through breadth/mass, STILETTO through
height/long limbs, CATHEXIS through height and the dress/crown envelope. A crown
or a long blade alone does not satisfy the body-size hierarchy. Keep worker
cohorts visually subordinate in size without making them unreadable.

**Initial audition values, not approved mesh dimensions:** use Worker 01 standing
body height = 1.00, LIMEN = 1.25, STILETTO = 1.20 and CATHEXIS = 1.22. Measure foot
to skull top in neutral stance, excluding crowns, blades and detached props.
Keep a common floor, projection and scale in the comparison. These ratios need
room/door/station/contact checks; do not blindly scale runtime meshes and assume
their reach, stride and approved contact corrections still work.

**Initial palette proposal, subject to sheet review:** the worker family is
painted industrial blue, separated from the green-brown factory and supervisor
body palettes. Use the following swatches to audition broad colour areas under
neutral light, then actual room lighting. They are sRGB art-reference colours,
not fixed final PBR shader values or promised contrast ratios.

| Actor | Body colour area / proposed swatches | Application and variation |
| --- | --- | --- |
| Workers | Industrial blue: dark #335E8A, standard #467BA4, light #6A94B5; neutral mechanical joints. | Broad torso, upper-back and limb armour areas. Mix shades as persistent per-worker variants, not random per-frame colours. Weathering changes value/roughness locally without erasing the blue family. Avoid full red, ivory, bright steel or emissive cyan variants that borrow supervisor signatures. |
| LIMEN | Light steel #AAB9BD over graphite #39434A; cyan energy #39D8DF. | Readable upper-body armour from front, side and rear; preserve bulk and dark mechanical structure. Keep cyan localized to energy/equipment. A broad blue worker body and a light-steel supervisor with cyan equipment must remain distinct. |
| STILETTO | Black chrome #24292E with proposed signal-red #C5443C identification areas; blade steel #C6D0D3. | Audition coherent red shoulder/upper-arm and upper-back or flank areas visible across views. Keep the black-chrome majority and sleek anatomy. Tiny red stripes or the visor alone are insufficient; colour must occupy a readable area. Blades and welders share the body signature. |
| CATHEXIS | Aged ivory #D8CBAF, antique gold #A98A52 and dark mechanisms #3B3937. | Dress and large porcelain areas carry the pale signature. Grime may be substantial, but retain recognizable ivory regions and the crown/dress outline. Grace coverage changes do not change the body family. |

Names accompany every swatch; colour is never the only identification channel.
Audit value/silhouette in grayscale and later test colour-vision alternatives.
Material wear, shade variation and lighting must preserve the family from the
front, side and back. Broad colour areas and large mechanical shapes matter more
than engraved marks, filigree or additional triangles at console scale. Future
supervisors must extend this hierarchy without absorbing the worker family.

Regenerated sheets are an appropriate next design step. Preserve each character's
recognized anatomy, equipment concept, costume and acting identity while revising
size, large colour areas and small-scale detail. Existing approved assets stay
available as comparison references; a new model is a candidate until it passes
rig, contacts, motion and occupied-scene checks. The [sheet revision brief](CAST_SHEET_REVISION_BRIEF.md)
defines the common-scale lineup, matching A-pose views and console-size tests.

## Three viewing jobs

| View | Must communicate | Appropriate detail |
| --- | --- | --- |
| Supervisor information / character inspection | Individual craft, face and mask state, hand/tool contact and complete acting. | Detailed approved body, textures and motions; portrait and full-body checks. A flattering portrait does not certify a room view. |
| One room, or two connected rooms | Supervisor identity, participant relationships, action and aftermath at normal playback. | Readable body and equipment silhouettes, material contrast, motion timing and selective effects. Use closer room angles when an interaction needs more pixels. |
| Small console / whole-factory overview | Which rooms are active, blocked or disrupted, broad flow, supervisor presence/identity and where attention is needed. | Coarse activity plus larger supervisor silhouettes and distinct body-colour areas among blue workers; a route to the relevant room. Face expressions and precise contacts belong to closer views. Optional labels/icons supplement this view and accessibility. |

Both room and intended operator-console scales need identity checks. The console
should distinguish supervisor presence and which supervisor it is, while the room
adds action/contact detail. If a proposed thumbnail is too small to do that, change
its framing or minimum size; do not silently waive recognition. Overview rendering
is still aspirational. A zoomed character viewer cannot certify either small view.

Measure actor height in both displayed CSS pixels and internal render pixels,
together with canvas size, render scale, camera and occlusion. Establish the
minimum useful actor size from the recognition test rather than claiming a
universal distance or pixel threshold. If the camera cannot support the beat,
change its framing, offer a closer camera or simplify the shot's background.
Keep actual room scale, agent size and world positions consistent.

## Background palette is part of the cast design

Owner refinement, 18 October: the current background colour diminishes the
legibility of all models and animations. Treat the room palette as a first-order
readability variable, not an immutable backdrop that brighter robots must defeat.
The floor dominates high-angle views and is the background for legs, hands, tools
and falls. Walls and machinery become the background as cameras turn. Review all
of them with the occupied cast; an attractive empty room is not sufficient.

**Direction:** quiet, comparatively low-chroma fields behind actors; deliberate
value separation; stronger environmental colour in selected structural elements
and functional accents. Preserve the industrial room art through geometry,
material character, lighting zones and localized patina. Avoid a uniform green
cast across floor, machinery and robots. Do not make the entire world colourless
or replace its concept-art identity with a generic grey box.

| Surface | Readability job | Initial treatment to audition |
| --- | --- | --- |
| Traversable floor / queue and interaction areas | Separate feet, shins, tool tips and grounded bodies. | Broad neutral mid-value grey/stone fields; quiet wear, restrained seams and reflectance. Audition #666860 as a neutral floor reference alongside the current treatment. Do not put black-chrome actors on a near-black floor everywhere. |
| Large walls and distant structure | Hold the room silhouette without competing with acting. | Lower-chroma dark grey-green/charcoal, such as #343D38, with localized industrial green and patina. A dark wall still needs a readable edge behind dark upper bodies. |
| Machinery behind an encounter | Establish function, action targets and failures. | Preserve recognizable machine shapes; simplify busy high-contrast surface detail behind actors. Concentrate colour on functional regions, with most indicator lights subordinate to the active beat. |
| Task lighting and warning sources | Explain the activity and direct attention. | Local pools and restrained warm metal accents. Neutral-enough actor illumination preserves worker blue, LIMEN steel/cyan, STILETTO black/red and CATHEXIS ivory. Warning flashes temporarily lead when the incident is the subject. |

These colours are unlit art-reference proposals, not approved room materials.
Rendered value depends on lights, exposure, tone mapping, roughness and shadows.
Never infer contrast from hexadecimal values alone. Review all cast members
against the same scene; per-character coloured floor patches or camera-dependent
world recolouring would undermine a coherent factory.

Keep floor patterns and grime lower in contrast than critical limb/tool edges at
small scale. Use broad, purposeful light/dark zones instead of fine speckle behind
hands and legs. Check that worker blue and supervisor accents survive room light
tint; a global grade must not collapse them into the same green-brown. Keep
exposure controlled so bright machinery does not leave actors unreadably dark.

**Required comparison:** identical camera, cast positions, motions and graphics
settings under (a) current room, (b) neutral diagnostic backdrop under the same
lighting, and (c) proposed quieter room palette. Change background materials first,
then lighting in a separate comparison, so failures can be attributed. Evaluate
paused silhouettes, walking feet, a hand/tool contact and a floor-level collapse,
in colour and grayscale at room and console sizes. The neutral backdrop is an
authoring diagnostic; it is not a replacement factory design. Measure cost after
selection and retain the actual-room evidence as the acceptance sample.

## Room composition, lighting and movement

- Distribute workers at real stations and queues. Use supervisor routes, stopping
  places and the Security–Conveyor threshold to create readable encounters.
  The regular crowd arrangement remains a diagnostic load, not accepted blocking.
- Keep a clear local background behind important tools and body contours. A
  blade can avoid physical collisions and still vanish against a leg or another
  worker. Review silhouette overlap separately from mesh intersection.
- Orient participants toward their actual task or partner. Camera choices must
  respect that orientation, including side and rear views; do not rotate or
  teleport agents just to face the viewer. Avoid machinery hiding the decisive
  contact or reaction for an entire beat. An alternate camera must be usable.
- Separate material values and reflections deliberately. STILETTO's black chrome
  needs shaped highlights; LIMEN needs readable armour mass; CATHEXIS needs a
  pale dress that retains folds instead of clipping to white. Local environment
  contrast should support them without washing out the factory's atmosphere.
- Use broad room lighting, authored reflections and economical material treatment
  first. A subtle edge/rim treatment is a candidate to evaluate, not an approved
  glowing outline. Do not rely on a shadow-casting lamp per actor.
- Reserve strong emissive accents for meaningful sources. Cyan energy, STILETTO's
  red visor and CATHEXIS's warm eyes occupy distinct locations and shapes.
  Industrial warning red can coexist with the visor; placement, silhouette and
  behaviour must distinguish them. Avoid indiscriminate neon on every machine.
- Let anticipation, action, recipient response and aftermath occupy readable
  time. Do not exaggerate or loop threats merely to make a supervisor noticeable.
  Pauses and reduced motion must preserve identity; motion supplies additional
  meaning when played.

Speech remains attached to the true speaker and follows the interaction's timing.
Position bubbles to avoid covering faces, tools and contact points where feasible.
Use restrained overlap management; do not move actors to make text fit. Bubbles
may explain why a worker was held or how a supervisor interprets a delay, while
the worker, queue and conveyor show what happened. Labels, focus indicators and
optional accessibility outlines are supplements, not a substitute for this gate.

## Graphics quality and reusable architecture

This is a requirement for future implementation, not a new renderer feature.
One actor identity, approved motion library, equipment state and appearance state
serve portrait, floor and eventual overview rendering. Quality can change their
representation; it cannot change BDI decisions, world timing, action outcomes,
visibility permissions or equipment state.

Keep silhouette-defining geometry, equipment shapes, useful material-value
separation and the core of active emitters through every supported quality tier.
Reduce decorative detail, optional halo, reflection precision, shadow cost and
background presentation work first. Colour is redundant with form/value; inspect
in grayscale as a diagnostic and test accessible alternatives separately.

Future LOD derivatives must preserve attachment alignment and the same acting.
Distance-aware cue treatment may modestly broaden a visible emitter or retain a
blade edge after sampling, but it must remain depth-tested, bounded and visually
reviewed. No through-wall glow, oversized persistent halo or secretly enlarged
collision reach. A low setting must not erase a supervisor or falsify a powered-off
tool. Reduced-motion mode need not keep sparks/thrashing to preserve identity.

Use the shared character catalog/adapters for stable visual signatures, equipment
variants and quality rules. Scene/action data supplies actor, recipient, target,
phase and consequence; camera/staging support can consume public data without
revealing hidden beliefs. The renderer does not invent actions to satisfy a shot.
The current catalog and six review gates are extension points, not proof that
these descriptors or a camera director have been implemented.

Measure cost in the actual occupied scene on the older HD 620 machine, then on
other target devices. Material changes and selective effects are not automatically
free. Record draw calls, frame p95/p99 and stalls alongside recognition evidence.
Performance and visual legibility are independent required passes.

## Acceptance: identify the cast with speech hidden

The following is the initial author-review protocol, not a completed audience
study. Its three-second prompt is a working target to refine during playtests.

1. Give the reviewer a brief introduction to the cast. Freeze a candidate build,
   asset hashes, motion versions and scene state. Include both supervisors among
   the full intended worker population; add CATHEXIS when her scene exists.
2. Hide names, speech, selection rings and debug highlights. Randomize presentation
   order so recognition cannot depend on knowing which actor always stands left.
   For each usable room camera, show a paused frame and ask the reviewer to point
   to each visible supervisor within about three seconds and name their visual
   cues. Do not count a fully hidden actor as visible; record the occlusion.
3. Play the action through its result without dialogue. Ask who acted, toward
   whom, what they did and what visibly changed. The reviewer need not infer a
   private motive. Replay with speech to check whether it adds information rather
   than supplying the missing event.
4. Repeat under Performance and Balanced profiles, at the smallest supported room
   canvas, intended operator-console thumbnail size and normal desktop size; include minimum Automatic render scale, bloom
   off, shadows off, and reduced motion. Review a grayscale still. Test all three
   Security and Conveyor cameras, including rear/side orientations, representative
   overlaps and the crowded doorway. Real phone/device performance is a separate
   measurement; resizing a desktop window is only a layout check.
5. Exercise identity-changing states: LIMEN emitter on/off, STILETTO blades/welders,
   CATHEXIS full Grace/half Grace/body face and clean/dirty when available. Missing
   states are Pending, not presumed passes. Keep body scale and asset revisions
   fixed when comparing presentation treatments.
6. Save the actual-size still and full action clip, camera pose, actor pixel
   heights, viewport/render resolution, graphics/effect settings, asset IDs,
   background palette/material revision, light/exposure state, prompt answers,
   wrong identifications, occlusions and performance evidence.
   Close-up crops can explain a fault but cannot replace the original-size image.

**Pass per view/state:** the introduced reviewer identifies each visible
supervisor without text or a fixed screen-position trick; each has two surviving
cues including shape/value; the enacted relationship and visible result are
understood. Identity still reads when paused and with optional glow/shadows off.
A failed important angle or state remains Needs work; do not average it away.
Artwork acceptance by the owner and later newcomer playtests remain explicit.

**Current status:** the reported crowded factory sample Needs work. Existing
single-character approvals do not certify this test. The static studio now provides names/bubbles-off
comparison, fixed poses, camera controls, actual-size console rendering and PNG/settings
exports. Measured recognition results, full-action review and the remaining cast/tool
states are still pending. The performance lab retains its separate timing protocol.

## First implementation slice

1. Start with the existing cast in one crowded Security/Conveyor shot. Add
   reproducible names/bubbles-off review, retaining the frozen timing benchmark
   for historical comparison. Compare current, neutral diagnostic and proposed
   backgrounds with camera, cast and lighting fixed; test lighting separately.
2. Audition relative scale and broad body colours on existing models in that
   same scene. Compare one variable at a time before combining the treatment.
   Keep worker blues, light-steel LIMEN, black/red STILETTO and ivory CATHEXIS
   as proposals until the occupied room and console-size comparisons succeed.
3. Produce revised common-scale character sheets only after that comparison.
   Preserve approved identities and motions; regenerate only the model parts
   whose silhouette or material regions cannot deliver the selected treatment.
   Any change still needs the applicable rig, stride, contact and clearance checks.
4. Author the doorway conflict: empty Conveyor stations, STILETTO's approach,
   LIMEN's checkpoint stance, the waiting worker and the released/held queue.
   The same action data must serve scripted rehearsals and later BDI execution.
5. Promote only treatments that pass the visual gate and the target device's
   performance gate. Add CATHEXIS, alternate equipment and future supervisors
   through the same record; no new isolated presentation implementation per actor.

Related records: [character review gates](CHARACTER_REVIEW_STRUCTURE.md),
[character and action direction](../AGENT_CHARACTER_AND_ANIMATION_DIRECTION.md),
[scene rehearsals](SCENE_REHEARSALS.md),
[graphics settings and measurements](GRAPHICS_AND_PERFORMANCE.md),
[LIMEN energy design](../LIMEN_BLADE_DESIGN.md).
