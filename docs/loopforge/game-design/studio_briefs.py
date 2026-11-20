"""Publish the owner-directed studio's authored briefs and compact board entry."""
import hashlib
import html
import json
from pathlib import Path

from narrative import render

BASE = '/stepanoskin/loopforge/design/studio'
PUBLIC = '/loopforge-design/studio'
E = html.escape
COMPANIONS = ['producer-reading', 'producer-playbook']
ROLE_READINGS = {
    'days-2-4-dialogue-validation': ('game-systems-designer', 'GAME SYSTEMS DESIGNER'),
    'day-2-stiletto-reading': ('writer', 'WRITER'),
}


def kickoff(role):
    producer = ("Read the source reader at https://www.fruitfulab.net" + BASE + "/producer-reading and coordination playbook at https://www.fruitfulab.net" + BASE + "/producer-playbook. "
                "The owner opens specialist chats; you write their task prompts with role-brief links and maintain the briefs with craft contributions. "
                "Check deliveries and advise on whether to continue, iterate or ship; the owner makes those decisions and validates the playable experience. Do not launch chats or restart the former autonomous studio. ") if role['id'] == 'producer' else ''
    return (f"You are {role['name']} for Loopforge. Read the shared studio instructions at "
            f"https://www.fruitfulab.net{BASE} and your maintained brief at "
            f"https://www.fruitfulab.net{BASE}/{role['id']}. "
            + producer +
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
        nav = f'<a href="{BASE}"'+(' aria-current="page"' if slug == 'index' else '')+'>Start here</a>'
        nav += ''.join(f'<a href="{BASE}/{r["id"]}"'+(' aria-current="page"' if slug == r['id'] else '')+f'>{E(r["name"].title())}</a>' for r in roles)
        nav += f'<a href="{BASE}/dev-blog"'+(' aria-current="page"' if slug == 'dev-blog' else '')+'>Journal</a>'
        contents = ''.join(f'<a href="#{ident}">{E(label)}</a>' for ident, label in toc)
        md_name = 'general' if slug == 'index' else slug
        document = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><title>{E(title)} · Loopforge Studio</title><meta name="description" content="Maintained Loopforge specialist briefs, sources and handoffs for an owner-directed Codex studio.">{stylesheet}</head><body class="studio-document"><a class="studio-skip" href="#content">Skip to brief</a>
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
    root = Path(__file__).resolve().parent
    build_studio(root.parent, root.parents[2] / 'apps/lab/public/loopforge-design')
