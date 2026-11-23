# Interaction, selection & station feedback — ui-interaction

For the first controllable prototype, distinguish selectable actor, reachable station, occupied slot, unavailable action, jam and successful output. This is a proposed input skin; it does not add new story actions.

## Group

Interface

## Delivery priority

P0

## Quantity

1 icon/state kit

## Parts and source layers

Selection ring, target reticle, reach/contact marker, wait/blocked/confirm icons, four process action glyphs and output counter; vector source plus 1×/2× PNG fallback.

## States and variants

normal/hover/focus/pressed/disabled/selected; shape changes accompany colour. Touch controls minimum 44 CSS px.

## Assembly and sockets

Attach selection to ground pivot; show only public state. Interaction prompt names and key/button bindings come from ENGINE. A click may request a legal action, never skip its contact or result.

## Acceptance

Keyboard and touch operate the same actions; injured bob, jam state and pending action are understandable without debug labels.

## Delivery contract

Read HANDOFF.md and manifest.template.json in the complete pack. Status: briefed; this document does not contain finished sprite art.
