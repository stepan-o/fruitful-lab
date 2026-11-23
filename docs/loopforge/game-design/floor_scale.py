"""Render the maintained floor-scale note on the board and in the static readers."""
from html import escape
import re

from narrative import render


def render_floor_scale(source, plan):
    current, archive = source.split('\n## Historical evidence\n')
    media = {
        plan['src']: plan,
        '/loopforge-design/day-one-calibration/08c8db11/contact-poster.webp': {
            'width': 960, 'height': 640,
        },
    }
    title, body, _ = render(current, media)
    _, history, _ = render('# Historical evidence\n' + archive, {})
    # Keep the three original board bookmarks attached to their dated evidence.
    history = history.replace('id="compact-r10-rooms-25-october-2026-retrospective"',
                              'id="the-approved-day-1-rooms"')
    history = history.replace('<p>At factory clock', '<p id="what-the-actual-view-shows">At factory clock')
    history = history.replace('id="large-hall-study-and-cctv-proposal-11-12-october-2026"',
                              'id="observation-work-and-future-camera-coverage"')
    body = re.sub(r'<h2 id="([^"]+)">', r'<h3 id="floor-scale-\1">', body).replace('</h2>', '</h3>')
    return (
        f'<header class="section-head"><h2>{escape(title)}</h2></header>'
        f'<div class="day-one-script scale-guide">{body}'
        '<p class="floor-tools"><a href="/loopforge-design/FACTORY_FLOOR_VISUAL_SCALE_PLAN.md" download>'
        'Download the floor-scale note</a></p>'
        '<details><summary>Historical evidence · October 2026 · compact R10, 3D studies and CCTV</summary>'
        f'{history}</details></div>'
    )
