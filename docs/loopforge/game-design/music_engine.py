"""Publish the proposal, diagrams and manual observation fixture."""
import hashlib
import html
import re
import shutil
from pathlib import Path

from narrative import render


def build_music(root, out):
    for name in ('MUSIC_ENGINE.md', 'music-inputs.v1.json', 'music-engine.css', 'music-engine.js'):
        shutil.copyfile(root / name, out / name)

    def url(name):
        digest = hashlib.sha256((root / name).read_bytes()).hexdigest()[:12]
        return f'/loopforge-design/{name}?v={digest}'

    source = (root / 'MUSIC_ENGINE.md').read_text()
    notes = []
    for section in source.split('\n## ')[1:]:
        title, body = section.split('\n', 1)
        _, content, _ = render('# Notes\n' + body, {})
        notes.append(f'<details><summary>{html.escape(title)}</summary><div class="ms-copy">{content}</div></details>')

    grid = '<b>Count</b>' + ''.join(f'<small>{beat}</small>' for beat in '1&2&3&4&')
    for name, hits, style in [('Fast hats', range(8), 'hit'), ('Menu snare', [2, 6], 'hit'),
                              ('Conveyor snare', [4], 'heavy')]:
        grid += f'<b>{name}</b>' + ''.join(f'<i class="{style if i in hits else ""}"></i>' for i in range(8))
    body = (root / 'music-layout.html').read_text().replace('<!-- GRID -->', grid)
    body = body.replace('<!-- NOTES -->', '\n'.join(notes))
    return (f'<link rel="stylesheet" href="{url("music-engine.css")}">' + body
            + f'<script defer src="{url("music-engine.js")}"></script>')


if __name__ == '__main__':
    root = Path(__file__).resolve().parent
    out = root.parents[2] / 'apps/lab/public/loopforge-design'
    board = out / 'index.html'
    page = board.read_text()
    button = '<button data-panel="music-engine" aria-current="false">Music engine</button>'
    panel = '<section class="panel" id="music-engine" aria-label="Music engine" hidden>' + build_music(root, out) + '</section>'
    # The full publisher builds the same native tab. This slim path avoids unrelated asset generation.
    page = page.replace(button, '')
    page = re.sub(r'<section class="panel" id="music-engine"[^>]*>.*?</section>', '', page, flags=re.S)
    # Locate the next sibling of Dialogue in the native navigation and content order.
    for pattern, addition in [
        (r'(<button data-panel="dialogue-engine"[^>]*>[^<]*</button>)', button),
        (r'(<section class="panel" id="dialogue-engine"[^>]*>.*?)(?=<section class="panel" id=")', panel),
    ]:
        page, count = re.subn(pattern, lambda match: match[1] + addition, page, flags=re.S)
        if count != 1:
            raise ValueError('Expected one Dialogue engine tab and panel in the board.')
    board.write_text(page)
