"""Build a single-file local player and the matching review fixtures."""
import base64
import json
import re
import sys
import zipfile
from pathlib import Path

APP = Path(__file__).resolve().parents[2]
PUBLIC = APP / "public"
FLOOR = PUBLIC / "loopforge-shifts"
OUT = Path(sys.argv[1]).resolve()
OUT.mkdir(parents=True, exist_ok=True)


def encoded(data):
    return base64.b64encode(data).decode("ascii")


def replace_once(text, before, after):
    if text.count(before) != 1:
        raise ValueError(f"Expected one matching entry: {before[:60]}")
    return text.replace(before, after)


def script(data):
    return "<script>" + re.sub(r"</script", r"<\\/script", data, flags=re.I) + "</script>"


def player():
    text = (FLOOR / "index.html").read_text()
    css = (FLOOR / "floor.css").read_text()
    kernel = (FLOOR / "kernel.js").read_bytes()
    viewer = (FLOOR / "viewer.js").read_text()
    # Embed only the shipped sprites that the floor actually requests.
    paint = (APP / "lib/loopforge/shifts/painter.ts").read_text()
    names = re.findall(r"'([^']+)'", paint.split("export const assets=[", 1)[1].split("] as const", 1)[0])
    if not names:
        raise ValueError("No reviewed sprite bank")
    art = {name: "data:image/webp;base64," + encoded((PUBLIC / "loopforge-intro" / (name + ".webp")).read_bytes()) for name in names}

    text = replace_once(text, '<link rel="stylesheet" href="floor.css">', "<style>" + css + "</style>")
    text = replace_once(text, '<script defer src="viewer.js"></script>', '')
    text = replace_once(text, 'href="/stepanoskin/loopforge/design#engine-boundary"', 'href="https://www.fruitfulab.net/stepanoskin/loopforge/design#engine-boundary"')
    # The embedded distribution changes the two asset locators. The simulation
    # and the viewer's transport, hashing and input behavior use the shipped JS.
    viewer = replace_once(viewer, 'new Worker("kernel.js")', 'new Worker(window.floorKernel)')
    expression = re.compile(r'"\.\./loopforge-intro/"\+([a-zA-Z_$][\w$]*)\+"\.webp"')
    viewer, n = expression.subn(lambda m: "window.floorImages[" + m[1] + "]", viewer)
    if n != 1:
        raise ValueError("Unexpected sprite URL in viewer bundle")
    pack = PUBLIC / "loopforge-design/days-2-4-art/v1"
    manifest = json.loads((pack / "manifest.json").read_bytes())
    images = {a["file"]: "data:image/png;base64," + encoded((pack / a["file"]).read_bytes())
              for a in manifest["atlases"].values()}
    boot = ('window.shiftArtOffline=' + json.dumps({"manifest": manifest, "images": images}, separators=(",", ":")) + ';\n'
            + 'window.floorImages=' + json.dumps(art, separators=(",", ":")) + ';\n'
            'window.floorKernel=URL.createObjectURL(new Blob([Uint8Array.from(atob("' + encoded(kernel) +
            '"), c=>c.charCodeAt(0))],{type:"text/javascript"}));')
    return replace_once(text, "</body>", script(boot) + script(viewer) + "</body>")


def archive_entry(archive, name, data):
    entry = zipfile.ZipInfo(name, (2026, 11, 19, 0, 0, 0))
    entry.compress_type = zipfile.ZIP_DEFLATED
    entry.external_attr = 0o644 << 16
    archive.writestr(entry, data)


offline = OUT / "Loopforge-Days-2-4.html"
offline.write_text(player())
with zipfile.ZipFile(OUT / "Loopforge-Days-2-4-review.zip", "w") as archive:
    archive_entry(archive, offline.name, offline.read_bytes())
    archive_entry(archive, "ENGINE-HANDOFF.md", (FLOOR / "ENGINE-HANDOFF.md").read_bytes())
    for fixture in sorted((FLOOR / "fixtures").glob("*.json")):
        archive_entry(archive, "fixtures/" + fixture.name, fixture.read_bytes())
print(offline.name)
