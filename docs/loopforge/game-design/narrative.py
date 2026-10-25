"""Build the narrative review readers from their canonical authored Markdown.

The deliberately small renderer supports the prose, links, figures, lists and
comparison tables used here. Raw HTML and scripts in source text stay escaped.
"""
import html
import json
import re
from cast_page import render_cast, STYLE as CAST_STYLE
from episode_page import render_episode, STYLE as EPISODE_STYLE

PAGES = [
    ('CHARACTER_DRAMATURGY.md', 'narrative.html', 'Characters and story'),
    ('NARRATIVE_STUDIES.md', 'narrative-studies.html', 'Reference studies'),
    ('FEATURE_ASSESSMENT.md', 'narrative-assessment.html', 'Feature assessment'),
    ('EDITORIAL_VOICE.md', 'narrative-voice.html', 'Writing Loopforge'),
    ('BACK_TO_THE_DAWN_CASE_STUDY.md', 'narrative-reference.html', 'Back to the Dawn'),
    ('ASTAFIEV_CASE_STUDY.md', 'narrative-astafiev.html', 'Astafiev'),
    ('TARANTINO_CASE_STUDY.md', 'narrative-dialogue.html', 'Dialogue'),
    ('OPENING_CAST.md', 'narrative-cast.html', 'The cast'),
    ('BOB_CARD_ARC.md', 'narrative-card-arc.html', 'bob’s missing card'),
    ('OPENING_EPISODE.md', 'narrative-episode.html', 'The episode'),
]
ROUTES = {source: target for source, target, _ in PAGES}
E = html.escape


def inline(value):
    tokens = []

    def save(markup):
        tokens.append(markup)
        return f'\x00{len(tokens)-1}\x00'

    def link(match):
        label, url = match.groups()
        url = ROUTES.get(url, url)
        if not (url.startswith(('https://', '/')) or re.fullmatch(r'[\w./#-]+', url)):
            raise ValueError(f'Unsupported narrative link: {url}')
        return save(f'<a href="{E(url, quote=True)}">{E(label)}</a>')

    value = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', link, value)
    value = E(value)
    value = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', value)
    value = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<em>\1</em>', value)
    value = re.sub(r'`([^`]+)`', r'<code>\1</code>', value)
    return re.sub(r'\x00(\d+)\x00', lambda m: tokens[int(m[1])], value)


def slug(value):
    return re.sub(r'[^a-z0-9]+', '-', value.lower()).strip('-')


def render(source, media):
    lines = source.splitlines()
    title = lines.pop(0).removeprefix('# ')
    parts, headings, ids = [], [], set()
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue
        if re.match(r'^#{2,3} ', line):
            level = len(line.split(' ', 1)[0])
            label = line[level+1:]; ident = slug(label)
            if ident in ids:
                raise ValueError(f'Duplicate heading: {label}')
            ids.add(ident); headings.append((ident, label))
            parts.append(f'<h{level} id="{ident}">{inline(label)}</h{level}>')
            i += 1
        elif line.startswith('!['):
            match = re.fullmatch(r'!\[([^\]]+)\]\(([^)]+)\)', line)
            if not match:
                raise ValueError(f'Invalid figure: {line}')
            alt, src = match.groups(); image = media[src]
            i += 1
            while i < len(lines) and not lines[i].strip(): i += 1
            caption = lines[i] if i < len(lines) and lines[i].startswith('Figure ') else ''
            if caption: i += 1
            parts.append(f'<figure><a href="{E(src)}" aria-label="Open full reference image"><img src="{E(src)}" alt="{E(alt)}" width="{image["width"]}" height="{image["height"]}" loading="lazy" decoding="async"></a><figcaption>{inline(caption)}</figcaption></figure>')
        elif line.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                cells = [x.strip() for x in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r':?-+:?', x) for x in cells): rows.append(cells)
                i += 1
            parts.append('<div class="table-scroll" tabindex="0" role="region" aria-label="Comparison table"><table><thead><tr>' + ''.join(f'<th scope="col">{inline(c)}</th>' for c in rows[0]) + '</tr></thead><tbody>' + ''.join('<tr>' + ''.join(f'<td>{inline(c)}</td>' for c in row) + '</tr>' for row in rows[1:]) + '</tbody></table></div>')
        elif re.match(r'^(- |\d+\. )', line):
            ordered = not line.startswith('- '); tag = 'ol' if ordered else 'ul'; items = []
            pattern = r'^\d+\. ' if ordered else r'^- '
            while i < len(lines) and re.match(pattern, lines[i]):
                items.append(inline(re.sub(pattern, '', lines[i])))
                i += 1
            parts.append(f'<{tag}>' + ''.join(f'<li>{x}</li>' for x in items) + f'</{tag}>')
        else:
            para = [line]; i += 1
            while i < len(lines) and lines[i].strip():
                para.append(lines[i].strip()); i += 1
            parts.append('<p>' + inline(' '.join(para)) + '</p>')
    return title, ''.join(parts), headings


STYLE = '''
:root{color-scheme:dark;--bg:#0b1411;--panel:#14211c;--ink:#e4e2d2;--muted:#aab9b0;--line:#35483e;--accent:#cfbd80}
*{box-sizing:border-box}html{scroll-padding-top:24px}body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.7 system-ui,sans-serif}a{color:var(--accent);text-underline-offset:4px}a:hover{color:#f4e5b7}a:focus-visible,summary:focus-visible,.table-scroll:focus-visible{outline:2px solid var(--accent);outline-offset:5px}header,main,footer{max-width:1280px;margin:auto;padding:32px}header{padding-bottom:16px}.eyebrow{font:12px/1.5 monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}nav{display:flex;gap:10px;flex-wrap:wrap;margin:24px 0 0}nav a{padding:10px 20px;border:1px solid var(--line);text-decoration:none;color:var(--ink)}nav a[aria-current=page]{background:#38382a;border-color:var(--accent)}main{display:grid;grid-template-columns:220px minmax(0,1fr);gap:40px;padding-top:20px}aside{min-width:0}aside details{position:sticky;top:24px;font-size:13px;line-height:1.5}summary{cursor:pointer;color:var(--muted);margin-bottom:14px}aside a{display:block;color:var(--muted);padding:6px 0;text-decoration:none}aside a:hover{color:var(--ink)}article{min-width:0;max-width:920px}h1{font-size:clamp(30px,4vw,50px);font-weight:500;line-height:1.12;letter-spacing:-.035em;margin:0 0 24px}h2{font-size:25px;font-weight:500;line-height:1.3;border-top:1px solid var(--line);padding-top:30px;margin:48px 0 20px}p{margin:0 0 22px}article>p,article>ul,article>ol{max-width:72ch}article>p:first-of-type{font-size:14px;color:var(--muted)}strong{font-weight:650}li{margin-bottom:12px}ul,ol{padding-left:24px}figure{margin:24px 0 32px}figure img{width:100%;height:auto;display:block;border:1px solid var(--line)}figcaption{font-size:13px;color:var(--muted);line-height:1.6;margin-top:12px}.table-scroll{overflow:auto;margin:24px 0;border:1px solid var(--line)}table{border-collapse:collapse;width:100%;font-size:14px;line-height:1.6;min-width:650px}th,td{text-align:left;vertical-align:top;padding:14px;border-bottom:1px solid var(--line)}th{background:var(--panel);color:var(--accent)}td:first-child{font-weight:600}footer{border-top:1px solid var(--line);font-size:14px;color:var(--muted)}footer a{margin-right:18px}.skip{position:absolute;left:24px;top:-80px;padding:12px;background:var(--bg)}.skip:focus{top:12px}
@media(max-width:850px){header,main,footer{padding:24px}main{grid-template-columns:1fr;gap:28px}aside details{position:static}aside{padding-bottom:16px;border-bottom:1px solid var(--line)}aside a{padding:7px 0}body{font-size:16px}h2{font-size:23px}nav a{padding:10px 14px}figure{margin-left:0;margin-right:0}}
@media print{body{background:white;color:#111}header,aside,footer{display:none}main{display:block;max-width:none;padding:0}article{max-width:none}a{color:#222}h2{break-after:avoid}figure,tr{break-inside:avoid}table{min-width:0}th{color:#222;background:#eee}.table-scroll{overflow:visible}}
'''


def build_narrative(docs, out, *, only=None):
    media = {x['src']: x for x in json.loads((out/'reference/back-to-the-dawn-media.json').read_text())['images']}
    assessment_media = out/'reference/day1-assessment-media.json'
    if assessment_media.is_file():
        media.update({x['src']: x for x in json.loads(assessment_media.read_text())['images']})
    for source, target, label in PAGES:
        if only is not None and source not in only:
            continue
        text = (docs/source).read_text()
        (out/source).write_text(text)
        title, body, headings = render(text, media)
        is_cast = source == 'OPENING_CAST.md'
        is_episode = source == 'OPENING_EPISODE.md'
        if is_cast: body = render_cast(docs, inline)
        if is_episode: body = render_episode(docs, body)
        nav = ''.join(f'<a href="{file}"'+(' aria-current="page"' if file == target else '')+f'>{E(name)}</a>' for _, file, name in PAGES)
        toc = ''.join(f'<a href="#{ident}">{E(name)}</a>' for ident, name in headings)
        document = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{E(title)} — Loopforge design</title><meta name="description" content="Loopforge dramaturgy and character creation: bob, pressure, reference studies, feature assessment, the cast and the opening episode."><style>{STYLE}{CAST_STYLE if is_cast else EPISODE_STYLE if is_episode else ""}</style></head><body class="{'cast-page' if is_cast else 'episode-page' if is_episode else ''}"><a class="skip" href="#content">Skip to content</a><header><a href="/stepanoskin/loopforge/design#dramaturgy">← Game design · Character dramaturgy</a><p class="eyebrow">Loopforge / Character dramaturgy and narrative design</p><nav aria-label="Narrative review">{nav}</nav></header><main>{'' if (is_cast or is_episode) else '<aside><details><summary>On this page</summary>'+toc+'</details></aside>'}<article id="content"><h1>{E(title)}</h1>{body}</article></main><footer><a href="{source}" download>Download this document</a><a href="/stepanoskin/loopforge/design#dramaturgy">Back to game design</a><p>Editorial brief: revision 7. The cast art and bob’s portrait are approved. The owner also approved the demonstrated Day1 slice through night. Historical drafts and later-day proposals are labelled separately; new corrections and unfinished performance details retain their own review requirements.</p></footer></body></html>'''
        (out/target).write_text(document)
