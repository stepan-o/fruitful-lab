"""Build a portable review player from the board geometry and the approved script."""
import json
import re


def build_rehearsal(root, out, script, intro_html):
    dialogue = []
    for speaker, text in re.findall(r'^\*\*(\w+)\*\*\s+(.+)$', script, re.MULTILINE):
        aside = re.match(r'^\*\((.*?)\)\*\s*', text)
        dialogue.append(dict(speaker=speaker, text=text[aside.end():] if aside else text,
                             aside=aside[1] if aside else ''))
    floor = json.loads((root/'day-one-geometry.json').read_text())
    data = json.dumps(dict(floor=floor, dialogue=dialogue), ensure_ascii=False).replace('<', r'\u003c')
    page = (root/'day-one-rehearsal.html').read_text()
    for tag, source in [
        ('/*REHEARSAL_STYLE*/', (root/'day-one-rehearsal.css').read_text()),
        ('<!--FLOOR_PLATE-->', (root.parent/'maps/factory-floor-plan.svg').read_text()),
        ('REHEARSAL_DATA', data),
        ('/*REHEARSAL_SCORE*/', (root/'day-one-sequence.mjs').read_text()),
        ('/*BUILD_MARKERS*/', (root/'day-one-build-markers.mjs').read_text()),
        ('/*REHEARSAL_PLAYER*/', (root/'day-one-player.mjs').read_text()),
    ]:
        page = page.replace(tag, source)
    (out/'day-one-rehearsal.html').write_text(page)

    proposal = (root/'factory-layout-proposal.html').read_text()
    (out/'factory-layout-proposal.html').write_text(proposal.replace('<!--APPROVED_INTRO-->', intro_html))
