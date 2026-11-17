"""Project the room kit onto both the whole-floor drawing and its room details."""
from html import escape
import json
from urllib.parse import quote

ORIGINAL = ('https://github.com/stepan-o/loopforge/blob/3267ea7b2cc8efd95cd6dc833a1e1c16d1b3ffb9/'
            'frontend/loopforge-webview/public/assets/concept_art/')
STANDING = {
    'lobby': (96, 359), 'dispatch': (278, 359), 'security': (395, 365),
    'forge': (427, 425), 'weaving': (292, 160), 'brewery': (518, 152),
    'cortex': (718, 160), 'theatre': (727, 331), 'logistics': (640, 538), 'pipes': (599, 235),
}
# Normalized plan silhouettes. Bounds and finished height come from each object mark.
SYMBOLS = {
    'desk': '<path d="M4 6H96V86H4ZM12 22H88M16 43H49V71H16ZM67 46H84"/>',
    'screen': '<path d="M3 10H97V90H3ZM34 10V90M66 10V90M3 35H97M3 63H97"/>',
    'door': '<path d="M0 5H12V95H0ZM88 5H100V95H88ZM12 28H88V52H12Z"/>',
    'rails': '<path d="M0 10H100V90H0ZM11 10V90M29 10V90M47 10V90M65 10V90M83 10V90"/>',
    'bridge': '<path d="M1 12H99V88H1ZM2 80 17 18 34 80 50 18 66 80 82 18 98 80"/>',
    'loom': '<path d="M3 8H97V92H3ZM11 20H89M11 80H89M17 20V80M29 20V80M41 20V80M53 20V80M65 20V80M77 20V80"/>',
    'bank': '<rect x="2" y="2" width="96" height="96" rx="8"/><ellipse cx="28" cy="50" rx="20" ry="38"/><ellipse cx="72" cy="50" rx="20" ry="38"/>',
    'vat': '<ellipse cx="50" cy="50" rx="48" ry="47"/><ellipse cx="50" cy="50" rx="35" ry="35"/><path d="M50 3V24M2 50H24M76 50H98"/>',
    'press': '<path d="M2 3H98V97H2ZM16 16H84V82H16ZM28 34H72V68H28Z"/>',
    'dais': '<path d="M10 93H90L84 76H16ZM20 72H80L72 57H28Z"/><ellipse cx="50" cy="32" rx="27" ry="28"/>',
    'seats': ''.join(f'<rect x="{3+24*x}" y="{4+24*y}" width="18" height="15" rx="3"/>'
                      for x in range(4) for y in range(4)),
}
LOCAL = {'entrance':'floor-entrance.b642f399e3fb.webp','security':'floor-security.5d74b6bfd958.webp',
         'cortex-witch':'floor-cortex-witch.b823b884d467.webp'}


def render_proposal(root, out, intro_html):
    rooms = json.loads((root/'factory-room-objects.json').read_text())
    generated = out.parents[1]/'lib/assets/generated'
    media = {'board': json.loads((root/'art.json').read_text())}
    for pack in ('focused', 'supervisors'):
        media[pack] = json.loads((generated/f'loopforge-{pack}.json').read_text())['assets']

    def photo(art):
        pack, key = art['media'].split('/')
        if pack == 'local':
            src = 'reference/' + LOCAL[key]
            if not (out/src).is_file():
                raise FileNotFoundError(src)
        else:
            src = media[pack][key]['variants'][0]['src']
        caption = escape(art['caption'])
        return (f'<figure><a href="{ORIGINAL}{quote(art["source"])}"><img src="{src}" alt="{caption}" '
                f'loading="lazy" decoding="async" width="480" height="320"></a><figcaption>{caption}</figcaption></figure>')

    plan, details, options = [], [], []
    for room in rooms:
        key, name = room['id'], escape(room['name'])
        options.append(f'<option value="{key}">{name}</option>')
        objects, pins, tags, rows = [], [], [], []
        for obj in room['objects']:
            mark, label = obj['id'], escape(obj['name'])
            x, y, width, depth = obj['box']
            cx, cy = x + width/2, y + depth/2
            for ox, oy, ow, od in [obj['box'], *obj.get('instances', [])]:
                objects.append(f'<svg x="{ox}" y="{oy}" width="{ow}" height="{od}" viewBox="0 0 100 100" '
                               f'preserveAspectRatio="none" aria-hidden="true" class="object-shape">{SYMBOLS[obj["form"]]}</svg>')
            pins.append(f'<a class="object-pin" href="#asset-{mark}" aria-label="{mark} · {label}">'
                        f'<title>{mark} · {label}</title><rect x="{cx-10:g}" y="{cy-7:g}" width="20" height="14" rx="3"/>'
                        f'<text x="{cx:g}" y="{cy+3:g}" text-anchor="middle">{mark}</text></a>')
            tags.append(f'<g class="detail-tag"><rect x="{cx-9:g}" y="{cy-6:g}" width="18" height="12" rx="2"/>'
                        f'<text x="{cx:g}" y="{cy+2.8:g}" text-anchor="middle">{mark}</text></g>')
            rows.append(f'<li id="asset-{mark}" tabindex="-1"><strong>{mark} · {label}</strong> '
                        f'<span class="size">{width/4:g} × {depth/4:g} m · {obj["height"]:g} m high</span>'
                        f'<p>{escape(obj["brief"])}</p></li>')
        sx, sy = STANDING[key]
        shapes = ''.join(objects)
        plan.append(f'<g data-room-pins="{key}">{shapes}{"".join(pins)}</g>')
        vx, vy, vw, vh = room['view']
        # Use the same architecture and symbols for the detail. Crop the very long pipe band
        # by leaving its natural aspect ratio; the whole band also appears on the main plan.
        detail = (f'<svg class="room-inset" viewBox="{vx} {vy} {vw} {vh}" role="img" aria-label="{name} object positions">'
                  f'<defs><clipPath id="clip-{key}"><rect x="{vx}" y="{vy}" width="{vw}" height="{vh}"/></clipPath></defs>'
                  f'<g clip-path="url(#clip-{key})"><use href="#shell"/>{shapes}{"".join(tags)}<circle class="work-mark" cx="{sx}" cy="{sy}" r="2"/>'
                  f'</g></svg>')
        atlas_room = 'conveyor' if key == 'forge' else key
        details.append(f'<section class="room-sheet" data-room="{key}"{" hidden" if key!="security" else ""}>'
                       f'<h3>{name}</h3><p>{escape(room["volume"])}</p>{detail}'
                       f'<p class="key">Gold tags locate build objects. The cyan dot marks an operator or actor position.</p>'
                       f'<p>{escape(room["blocking"])}</p><div class="art-strip">{"".join(map(photo,room["art"]))}</div>'
                       f'<p><a href="/stepanoskin/loopforge/design?atlasRoom={atlas_room}#supervisor-rooms">Supervisor interactions in {name} →</a></p>'
                       f'<ol class="asset-list">{"".join(rows)}</ol></section>')
    page = (root/'factory-layout-proposal.html').read_text()
    for tag, value in [('<!--APPROVED_INTRO-->', intro_html), ('<!--OBJECT_MARKS-->', ''.join(plan)),
                       ('<!--ROOM_OPTIONS-->', ''.join(options)), ('<!--ROOM_SHEETS-->', ''.join(details))]:
        page = page.replace(tag, value)
    (out/'factory-layout-proposal.html').write_text(page)
