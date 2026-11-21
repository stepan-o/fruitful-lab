"""Publish the owner-directed studio's authored briefs and compact board entry."""
import hashlib
import argparse
import html
import json
import re
from pathlib import Path

from narrative import render

BASE = '/stepanoskin/loopforge/design/studio'
PUBLIC = '/loopforge-design/studio'
E = html.escape
COMPANIONS = ['producer-reading', 'producer-playbook']
ROLE_READINGS = {
    'ui-reading': ('ui-designer', 'UI DESIGNER'),
    'ui-first-assignment': ('ui-designer', 'UI DESIGNER'),
    'music-study': ('music-director', 'MUSIC DIRECTOR'),
    'music-production': ('music-director', 'MUSIC DIRECTOR'),
    'days-2-4-dialogue-validation': ('game-systems-designer', 'GAME SYSTEMS DESIGNER'),
    'day-2-conveyor-rules': ('game-systems-designer', 'GAME SYSTEMS DESIGNER'),
    'day-2-conveyor-minigame': ('game-systems-designer', 'GAME SYSTEMS DESIGNER'),
    'day-2-stiletto-reading': ('writer', 'WRITER'),
}


def conveyor_rating(match):
    name, level = match.groups()
    icon = {'Force': '↕', 'Precision': '⊕', 'Timing': '◷'}[name]
    segments = ''.join('<i class="filled"></i>' if n < int(level) else '<i></i>'
                       for n in range(5))
    return (f'<td><span class="conveyor-rating {name.lower()}">'
            f'<span><span class="rating-symbol" aria-hidden="true">{icon}</span> {name} {level}/5</span>'
            f'<span class="rating-bar" aria-hidden="true">{segments}</span></span></td>')


def kickoff(role):
    producer = ("Read the source reader at https://www.fruitfulab.net" + BASE + "/producer-reading and coordination playbook at https://www.fruitfulab.net" + BASE + "/producer-playbook. "
                "The owner opens specialist chats; you write their task prompts with role-brief links and maintain the briefs with craft contributions. "
                "Check deliveries and advise on whether to continue, iterate or ship; the owner makes those decisions and validates the playable experience. Do not launch chats or restart the former autonomous studio. ") if role['id'] == 'producer' else ''
    ui = ("Read the UI source reader at https://www.fruitfulab.net" + BASE + "/ui-reading and first assignment at https://www.fruitfulab.net" + BASE + "/ui-first-assignment. Begin with an annotated audit and static visual studies; implementation ownership is undecided. Carry forward the owner's settled direction and design desktop and phone equally. ") if role['id'] == 'ui-designer' else ''
    music = ("Take B’s A–G–F–E–C♯ over low D is the approved direction. Preserve dated Take A. "
             "Start with Main menu curiosity, Options following the drummer’s hands and heavy, patient Conveyor. "
             "Read the session 02 comparison at https://www.fruitfulab.net/stepanoskin/loopforge/design#music-listening "
             "and the music study, production handoff and current ENGINE brief. Continue from the tempo verdict. "
             "Develop native phrase variations and responses to permitted observations for each theme. Keep fixtures separate. "
             "Use labelled local sketches for exploration. ElevenLabs is intended for production; the one-attempt 45-second "
             "Menu pilot needs verified rights, export entitlement and separate all-in spending approval. ") if role['id'] == 'music-director' else ''
    return (f"You are {role['name']} for Loopforge. Read the shared studio instructions at "
            f"https://www.fruitfulab.net{BASE} and your maintained brief at "
            f"https://www.fruitfulab.net{BASE}/{role['id']}. "
            + producer + ui + music +
            "Use the Current handoff and linked design pages to establish the latest approved baseline; verify it against current source and delivered artifacts. "
            "Read the applicable repository instructions. Preserve other specialists' work in an isolated branch/worktree. "
            "Follow Onboard (study and pre-synthesize) → Interview (one question at a time, with suggested answers) → Plan → Build → owner Review for new design; carry out already approved bounded corrections without reopening settled decisions. "
            "Read relevant parts of Tynan Sylvester's Designing Games and cite verified chapter/pages for every concept you apply. "
            "Maintain your role brief, current design handoff and dated dev-blog evidence as part of delivery. Do not merge without owner authorization.\n\n"
            "My task for this chat: [replace this line with the specific outcome and acceptance criteria].")


def build_studio(docs: Path, out: Path):
    source = docs / 'studio-briefs'
    target = out / 'studio'
    target.mkdir(exist_ok=True)
    roles = json.loads((source / 'roles.json').read_text())
    for name in ('studio.css', 'studio.js'):
        (target / name).write_bytes((Path(__file__).parent / name).read_bytes())
    css_hash = hashlib.sha256((target / 'studio.css').read_bytes()).hexdigest()[:12]
    js_hash = hashlib.sha256((target / 'studio.js').read_bytes()).hexdigest()[:12]
    stylesheet = f'<link rel="stylesheet" href="{PUBLIC}/studio.css?v={css_hash}">'
    script = f'<script src="{PUBLIC}/studio.js?v={js_hash}" defer></script>'
    cards = '<div class="studio-role-grid">' + ''.join(
        f'<a class="studio-role-card" href="{BASE}/{E(r["id"])}"><span class="studio-label">{E(r["name"])}</span>'
        f'<h3>{E(r["focus"])}</h3><p>{E(r["description"])}</p><span class="studio-card-foot">{E(r["handoff"])}</span></a>'
        for r in roles) + '</div>'
    workflow = '<ol class="studio-flow" aria-label="Studio workflow">' + ''.join(
        f'<li><strong>{name}</strong><span>{detail}</span></li>' for name, detail in [
            ('Onboard', 'Study, inspect, reconcile.'), ('Interview', 'One question at a time.'),
            ('Plan', 'Approve a concrete scope.'), ('Build', 'Make it work and verify.'),
            ('Review', 'The owner tries the result.')]) + '</ol>'
    overview = f'''<div class="studio-surface"><header class="studio-intro"><span class="studio-label">Owner-directed studio · maintained briefs</span>
<h2>A shared workshop.<br>A clear next task.</h2><p>We build Loopforge in dedicated Codex chats. The owner opens the chats and reviews the game. PRODUCER prepares their prompts, maintains the briefs and coordinates delivery with the specialists.</p>
<div class="studio-actions"><a class="studio-primary" href="{BASE}">Read the shared instructions</a><a href="{BASE}/dev-blog">Open the studio journal</a></div></header>
{workflow}<div class="studio-section-title"><h3>Choose a specialist</h3><p>Read the brief, copy its starting prompt, then add the task.</p></div>{cards}
<div class="studio-note"><strong>The page is the handoff.</strong><p>PRODUCER keeps the briefs coherent with specialist contributions, current design references and review evidence. New chats continue from those artifacts. The owner decides whether to iterate or ship.</p></div>
<div class="studio-reading"><div><span class="studio-label">Standard reading</span><h3>Designing Games</h3><p>Tynan Sylvester · 2013. Apply ideas to concrete decisions and cite verified chapter and page references. The owner’s PDF stays in the local reference library.</p></div><div><span class="studio-label">Earlier studio</span><h3>Keep the history honest</h3><p>The former autonomous studio is closed. Its <a href="/loopforge-dev-blog/index.html">dev blog</a> and <a href="/loopforge-dev-blog/retrospectives/2026-10-25-second-retrospective/index.html">second retrospective</a> remain dated evidence, separate from today’s instructions.</p></div></div></div>'''

    def page(slug, title, content, toc, extra=''):
        page_style = stylesheet
        if slug == 'day-2-conveyor-rules':
            source_css = (Path(__file__).parent / 'conveyor-ratings.css').read_bytes()
            digest = hashlib.sha256(source_css).hexdigest()[:12]
            (target / 'conveyor-ratings.css').write_bytes(source_css)
            page_style += f'<link rel="stylesheet" href="{PUBLIC}/conveyor-ratings.css?v={digest}">'
            content = re.sub(r'<td>(Force|Precision|Timing) ([0-5])/5</td>', conveyor_rating, content)
        nav = f'<a href="{BASE}"'+(' aria-current="page"' if slug == 'index' else '')+'>Start here</a>'
        nav += ''.join(f'<a href="{BASE}/{r["id"]}"'+(' aria-current="page"' if slug == r['id'] else '')+f'>{E(r["name"].title())}</a>' for r in roles)
        nav += f'<a href="{BASE}/dev-blog"'+(' aria-current="page"' if slug == 'dev-blog' else '')+'>Journal</a>'
        contents = ''.join(f'<a href="#{ident}">{E(label)}</a>' for ident, label in toc)
        md_name = 'general' if slug == 'index' else slug
        document = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><title>{E(title)} · Loopforge Studio</title><meta name="description" content="Maintained Loopforge specialist briefs, sources and handoffs for an owner-directed Codex studio.">{page_style}</head><body class="studio-document"><a class="studio-skip" href="#content">Skip to brief</a>
<header class="studio-mast"><a href="/stepanoskin/loopforge/design#studio">LOOPFORGE / STUDIO</a><a href="{BASE}/dev-blog">Development journal</a></header><nav class="studio-role-nav" aria-label="Studio briefs">{nav}</nav>
<main class="studio-document-grid"><aside><details open><summary>On this page</summary>{contents}</details><p class="studio-source">Maintained source<br><code>docs/loopforge/studio-briefs/{md_name}.md</code></p><a href="{PUBLIC}/{md_name}.md" download>Download this brief</a></aside><article id="content" class="studio-article"><p class="studio-label">Loopforge · owner-directed Codex studio</p><h1>{E(title)}</h1>{extra}{content}</article></main><footer class="studio-footer"><a href="/stepanoskin/loopforge/design#studio">Back to the design board</a><p>Current instructions and historical evidence stay separate. PRODUCER maintains the briefs with specialist contributions; the owner directs and reviews the work.</p></footer>{script}</body></html>'''
        (target / f'{slug}.html').write_text(document)

    for slug in ['general', 'dev-blog', *ROLE_READINGS] + [r['id'] for r in roles] + COMPANIONS:
        text = (source / f'{slug}.md').read_text()
        (target / f'{slug}.md').write_text(text)
        title, content, toc = render(text, {})
        extra = ''
        if slug == 'general':
            extra = workflow + '<div class="studio-section-title"><h2>Dedicated specialists</h2></div>' + cards
        elif slug in ROLE_READINGS:
            role_id, role_label = ROLE_READINGS[slug]
            extra = f'<p><a href="{BASE}/{role_id}">{role_label} handoff</a></p>'
        elif slug not in ['dev-blog'] + COMPANIONS:
            role = next(r for r in roles if r['id'] == slug)
            prompt = kickoff(role)
            (target / f'{slug}-start.txt').write_text(prompt + '\n')
            extra = f'''<p class="studio-lead">{E(role['description'])}</p><p class="studio-date">Maintained baseline: {E(role['updated'])} · individual delivery status is recorded below.</p><div class="studio-note"><strong>Read the <a href="{BASE}">shared instructions</a> with this role brief.</strong></div><details class="studio-kickoff"><summary>Starting prompt for a new chat</summary><p>Copy this introduction and replace the last line with the specific task. It does not launch a chat automatically.</p><textarea readonly aria-label="Starting prompt" rows="10">{E(prompt)}</textarea><div class="studio-actions"><button type="button" data-copy-prompt>Copy starting prompt</button><a href="{PUBLIC}/{slug}-start.txt" download>Download prompt</a></div><p class="studio-copy-status" role="status" aria-live="polite"></p></details>'''
        if slug == 'producer' or slug in COMPANIONS:
            extra += '<nav class="studio-package" aria-label="Producer onboarding package">' + ''.join(
                f'<a href="{BASE}/{ident}"' + (' aria-current="page"' if slug == ident else '') + f'>{label}</a>'
                for ident, label in [('producer', 'Role brief'), ('producer-reading', 'Source reader'), ('producer-playbook', 'Coordination playbook')]) + '</nav>'
        page('index' if slug == 'general' else slug, title, content, toc, extra)
    return overview, stylesheet


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--refresh-board', action='store_true',
                        help='Refresh only the existing Studio panel; preserve every other board section.')
    args = parser.parse_args()
    root = Path(__file__).resolve().parent
    out = root.parents[2] / 'apps/lab/public/loopforge-design'
    overview, _ = build_studio(root.parent, out)
    if args.refresh_board:
        board = out / 'index.html'
        text = board.read_text()
        pattern = r'(<section class="panel" id="studio"[^>]*>).*?(</section>)'
        updated, count = re.subn(pattern, lambda m: m[1] + overview + m[2], text, flags=re.S)
        if count != 1:
            raise ValueError('Expected one existing Studio panel; run the full board generator instead.')
        board.write_text(updated)
