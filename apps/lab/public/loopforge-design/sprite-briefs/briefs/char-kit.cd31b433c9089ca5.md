# kit — char-kit

Adult wiry Popeye-like robot: tiny squinting skull with heavy jaw, short brass/steel pipe at mouth corner, lean ribbed torso, thin upper arms and enormous blue piston forearms tapering to ordinary hands. Pale forearm stripe, sturdy boots. Preserve pipe and forearm silhouette, not oversized hands or baby head. Wiry torso, piston forearms and pipe. Inspect by touch, not by waving the entire arm through the drive.

## Group

Characters

## Delivery priority

P1

## Quantity

1 unique actor

## Parts and source layers

Layered body: rear arm/tool, lower body, torso/head, front arm/tool; separate shadow and emissive mask. Equipment integral to identity stays attached. Export flattened full-body frames too for actions that cannot cleanly split.

## States and variants

Common seven clip families below, plus the bespoke list. Workers use blue-family shades; supervisors retain their approved palettes. Injury is a persistent appearance/motion state on bob.

## Assembly and sockets

Ground pivot between planted feet. Sockets: hand_l, hand_r, look, prop, foot_l, foot_r; add pocket for bob/ed, blade_tip_l/r for supervisors, and support contact for bob/sam. All socket tracks are in untrimmed frame pixels.

## Acceptance

Recognizable with names hidden against Security and Forge floors. No foot sliding, hand/prop separation, false mirroring, or body/tool penetration. Test bespoke actions against the actual paired actor/fixture.

## Common animation coverage

| Clip | Coverage | Performance |
| --- | --- | --- |
| idle | 8 directions · 4 frames per direction · loop | Quiet breathing/mechanical settling; one neutral held pose per facing. No perpetual comedy. |
| walk | 8 directions · 8 frames per direction · loop | In-place feet; foot-down markers and stride length. World position comes from ENGINE. |
| hurry | 8 directions · 8 frames per direction · loop | A fast purposeful exit, with longer stride; not a sped-up shuffle. Preserve bob’s injured version. |
| start-stop | 8 directions · 3 start + 3 stop frames per direction | Brake on either foot; retain a held mid-step pose, then resume from that planted foot. |
| turn | 16 transitions · 3 frames per adjacent 45° turn | Both turn directions; body follows head. No mirrored asymmetrical equipment. |
| talk | 8 directions · 4 upper-body frames per direction · loop | Subtle head/chest/arm articulation composited over idle or walk. No phoneme lip-sync commission. |
| listen | 8 directions · 2 held poses per direction | Attention and glance-back pose, compatible with walking and tools. |

## Bespoke animation coverage

| Clip | Coverage | Performance |
| --- | --- | --- |
| card-present | S, SE · 6 frames + hold | Show and recover credential. |
| drive-feel | S, SE · 8 frames + hold | Two fingertips contact housing; a small diagnostic lean. |
| drive-off | S, SE · 6 frames | Stop drive on bell, release and turn into the exit lane. |

## Delivery contract

Read HANDOFF.md and manifest.template.json in the complete pack. Status: briefed; this document does not contain finished sprite art.

- [Approved character reference](/media/loopforge-cast/kit-1280.455885256f5671bc.webp)
- [Cast and approved ensemble](/stepanoskin/loopforge/design#narrative-cast)
