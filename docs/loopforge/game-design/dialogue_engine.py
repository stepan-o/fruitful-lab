"""Publish the linked writing packet and its game-design tab from five sources."""
import re
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

from narrative import E, render, slug

PUBLIC = '/loopforge-design/'
BOARD = '/stepanoskin/loopforge/design#dialogue-engine'
PACKET = 'dialogue-engine-review.zip'
PAGES = {
    'DIALOGUE_ENGINE.md': ('dialogue-engine.html', 'Dialogue Engine'),
    'ROOM_CHAT_BANK.md': ('room-chat-bank.html', 'Chat bank'),
    'DAYS_2_4_TABLE_READ.md': ('days-2-4-table-read.html', 'Table read'),
    'DAYS_2_4_BDI.md': ('days-2-4-decisions.html', 'BDI companion'),
    'DIALOGUE_ENGINE_REVIEW.md': ('dialogue-engine-review.html', 'SYSTEMS review'),
}
COMPANIONS = {
    'DAYS_2_4_TABLE_READ.md': 'DAYS_2_4_BDI.md',
    'DAYS_2_4_BDI.md': 'DAYS_2_4_TABLE_READ.md',
}


def build_dialogue_engine(docs, out):
    sources = {name: (docs / name).read_text() for name in PAGES}
    with ZipFile(out / PACKET, 'w') as archive:
        for name, source in sources.items():
            info = ZipInfo(name, date_time=(2026, 11, 19, 0, 0, 0))
            info.external_attr = 0o644 << 16
            archive.writestr(info, source.encode(), compress_type=ZIP_DEFLATED)

    package_link = f'<a href="{PUBLIC}{PACKET}" download>Download the SYSTEMS review package</a>'
    for name, source in sources.items():
        route, label = PAGES[name]
        linked = source
        for filename, (target, _) in PAGES.items():
            linked = linked.replace(f']({filename})', f']({PUBLIC}{target})')
        title, body, _ = render(linked, {})
        if name == 'DIALOGUE_ENGINE.md':
            panel_body = re.sub(r'<h2 id="([^"]+)">(.*?)</h2>',
                                r'<h3 id="dialogue-engine-\1">\2</h3>', body)
            panel = (f'<header class="section-head"><h2>{E(title)}</h2></header>'
                     f'<div class="narrative-foundation"><p>{package_link}</p>{panel_body}</div>')
        if name in COMPANIONS:
            other = COMPANIONS[name]
            other_route, other_label = PAGES[other]
            shared = set(re.findall(r'^### (.+)$', sources[other], re.M))
            for heading in re.findall(r'^### (.+)$', source, re.M):
                if heading in shared:
                    anchor = slug(heading)
                    body = body.replace(f'<h3 id="{anchor}">{E(heading)}</h3>',
                        f'<h3 id="{anchor}">{E(heading)} <a href="{PUBLIC}{other_route}#{anchor}" '
                        f'aria-label="{other_label} for {E(heading)}">↗</a></h3>')
        toc = ''.join(f'<a href="#{slug(h)}">{E(h)}</a>' for h in re.findall(r'^## (.+)$', source, re.M))
        siblings = ''.join(f'<a href="{PUBLIC}{path}">{E(text)}</a>' for path, text in PAGES.values() if path != route)
        page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{E(title)} · Loopforge</title><link rel="stylesheet" href="{PUBLIC}studio/studio.css"></head>
<body class="studio-document"><a class="studio-skip" href="#content">Skip to {E(label)}</a>
<header class="studio-mast"><a href="{BOARD}">Loopforge / Dialogue Engine</a>{package_link}</header>
<main class="studio-document-grid"><aside><details open><summary>On this page</summary>{toc}</details><a href="{PUBLIC}{name}" download>Download Markdown</a></aside>
<article id="content" class="studio-article"><h1>{E(title)}</h1>{body}</article></main>
<footer class="studio-footer">{siblings}</footer></body></html>'''
        (out / route).write_text(page)
        (out / name).write_text(source)
    return panel
