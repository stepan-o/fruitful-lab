"""Show the existing AI Lab proposal as the first design-board tab."""
from pathlib import Path
import hashlib
import re

AI_LAB_PANEL = '''<header class="section-head"><h2>Loopforge AI Lab</h2><p>Architecture proposal for owner review.</p><p><a href="/stepanoskin/loopforge/design/studio/ai-lab">Open the full-page proposal ↗</a> · <a href="/stepanoskin/loopforge/design/studio/ai-lab-notes">Read the technical notes</a></p></header>
<iframe id="ai-lab-frame" title="Loopforge AI Lab architecture proposal" data-src="/stepanoskin/loopforge/design/studio/ai-lab" style="display:block;width:100%;height:900px;border:0"></iframe>
<noscript><p><a href="/stepanoskin/loopforge/design/studio/ai-lab">Read the AI Lab proposal</a></p></noscript>'''


def refresh_board():
    """Refresh this entry and its controller without regenerating other authors' panels."""
    root = Path(__file__).resolve().parent
    out = root.parents[2] / 'apps/lab/public/loopforge-design'
    page = (out / 'index.html').read_text()
    nav = '<nav class="nav" aria-label="Design board sections">'
    main = '<main class="main" id="main">'
    assert page.count(nav) == page.count(main) == 1, 'Expected one design-board navigation and main'
    page = re.sub(r'<button data-panel="ai-lab"[^>]*>.*?</button>', '', page)
    page = re.sub(r'<section class="panel" id="ai-lab"[^>]*>.*?</section>', '', page, flags=re.S)
    page = re.sub(r'(<button data-panel="[^"]+" aria-current=")true', r'\1false', page)
    page = re.sub(r'(<section class="panel"[^>]*)(>)',
                  lambda m: m[0] if re.search(r'\bhidden\b', m[1]) else m[1] + ' hidden>', page)
    page = page.replace(nav, nav + '<button data-panel="ai-lab" aria-current="true">Loopforge AI Lab</button>', 1)
    page = page.replace(main, main + '<section class="panel" id="ai-lab" aria-label="Loopforge AI Lab">' + AI_LAB_PANEL + '</section>', 1)
    script = (root / 'board.js').read_bytes()
    version = hashlib.sha256(script).hexdigest()[:12]
    page, count = re.subn(r'(/loopforge-design/board\.js\?v=)[a-f0-9]+', lambda m: m[1] + version, page)
    assert count == 1, 'Expected one versioned board controller'
    (out / 'index.html').write_text(page)
    (out / 'board.js').write_bytes(script)


if __name__ == '__main__':
    refresh_board()
