"""Publish the native sprite atlases, review plates and editable ENGINE handoff."""
from __future__ import annotations

import argparse
import copy
import hashlib
import html
import io
import json
import re
import shutil
import tempfile
from pathlib import Path
from xml.etree import ElementTree
from zipfile import ZIP_DEFLATED, ZIP_STORED, ZipFile, ZipInfo

from PIL import Image

ROOT = Path(__file__).resolve().parent
REPO = next((p for p in ROOT.parents if (p/"apps/lab/public/loopforge-design").is_dir()), None)
PUBLIC = ROOT / "dist-engineering"
LANES = ("security", "floor", "console")
VIEWS = {"desktop": (1280, 720), "phone": (390, 844), "narrow": (320, 844)}
ZIP_NAME = "Loopforge-Days-2-4-Art.zip"


def digest(data):
    return hashlib.sha256(data).hexdigest()


def json_bytes(value):
    return (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode()


def png_bytes(im):
    buf = io.BytesIO()
    im.save(buf, "PNG", optimize=True)
    return buf.getvalue()


def verify_sprite(source, spec):
    data = (source / spec["file"]).read_bytes()
    image = Image.open(io.BytesIO(data)).convert("RGBA")
    assert list(image.size) == spec["size"] and image.getbbox(), spec["id"]
    assert image.getchannel("A").getextrema()[0] == 0, spec["id"]
    assert digest(data) == spec["sha256"], spec["file"]
    with ZipFile(source / spec["master"]) as archive:
        stack = ElementTree.fromstring(archive.read("stack.xml"))
        layers = stack.findall(".//layer")
        assert len(layers) >= 2, spec["master"]
        assert (int(stack.get("w")), int(stack.get("h"))) == image.size, spec["id"]
        merged = Image.new("RGBA", image.size)
        for layer in reversed(layers):
            assert layer.get("composite-op", "svg:src-over") == "svg:src-over", layer.attrib
            if layer.get("visibility") == "hidden":
                continue
            assert float(layer.get("opacity", 1)) == 1
            part = Image.open(io.BytesIO(archive.read(layer.get("src")))).convert("RGBA")
            merged.alpha_composite(part, (int(layer.get("x", 0)), int(layer.get("y", 0))))
        assert merged.tobytes() == image.tobytes(), f"Master differs from native export: {spec['id']}"
    w, h = image.size
    if "insets" in spec:
        l, t, r, b = spec["insets"]
        assert min(l,t,r,b) >= 0 and l+r < w and t+b < h, spec["id"]
    if spec.get("safeText"):
        x,y,rw,rh = spec["safeText"]
        assert x >= 0 and y >= 0 and rw > 0 and rh > 0 and x+rw <= w and y+rh <= h, spec["id"]
    return image


def make_atlas(source, specs, name, dest):
    # Shelf-pack with a clear pixel gutter. The adapter draws source rectangles at native scale.
    width = 512
    x, y, row_height = 1, 1, 0
    cells = []
    for spec in sorted(specs, key=lambda a: (-a["size"][1], a["id"])):
        im = verify_sprite(source, spec)
        if x + im.width >= width:
            x, y, row_height = 1, y + row_height + 2, 0
        assert im.width < width - 2, spec["id"]
        cells.append((spec, im, x, y))
        x += im.width + 2
        row_height = max(row_height, im.height)
    atlas = Image.new("RGBA", (width, y + row_height + 1))
    for _, im, x, y in cells:
        atlas.paste(im, (x,y))
    data = png_bytes(atlas)
    fname = f"atlas/{name}.{digest(data)[:12]}.png"
    (dest / fname).write_bytes(data)
    entries = {}
    for spec, im, x, y in cells:
        rect = [x, y, im.width, im.height]
        assert atlas.crop((x,y,x+im.width,y+im.height)).tobytes() == im.tobytes()
        entry = dict(spec, atlas=fname, rect=rect, lane=name)
        entry["master"] = f"{name}/{spec['master']}"
        entry["file"] = f"{name}/{spec['file']}"
        entries[spec["id"]] = entry
    return entries, {"file":fname, "size":list(atlas.size), "bytes":len(data), "sha256":digest(data)}


def make_gallery(source, dest):
    groups = {
        "desk": ("Security · discover the missing ID", "From the same check, inspect the desk signal and the open intervention."),
        "case": ("Security · pass or detention", "Compare the outcome for bob and the next worker in line."),
        "chat": ("Conveyor · interrupted reply", "Compare what is said at a working line as another station keeps running."),
        "pace": ("Conveyor · handoff and output", "Follow the station signal, operator and cortexes reaching the rack."),
        "clash": ("Security · conflicting orders", "Compare the same crew with public backing for either supervisor or an unassisted decision."),
        "bids": ("Morning · choose a supervisor", "Follow a whole-room proposal through the explicit appointment."),
        "bell": ("Shift close and overnight", "Compare the completed work, custody outcome and next morning."),
        "inspection": ("Review only · actor evidence", "The reviewer can inspect one actor’s testimony and decision."),
    }
    by_group = {key:[] for key in groups}
    shot_groups = {
        "desk-signal":"desk", "desk-open":"desk", "pass-issued":"case", "custody":"case",
        "reply-delivered":"chat", "reply-cut":"chat", "line-clear":"pace", "line-rushed":"pace",
        "back-limen":"clash", "back-stiletto":"clash", "crew-decides":"clash",
        "morning":"bids", "committed":"bids", "close":"bell", "overnight":"bell",
        "pass-expiry":"bell", "inspector":"inspection"
    }
    seen = set()
    originals = {}
    for family, catalog in (("proofs","index.json"), ("console","proof-index.json")):
        base = source / family
        for shot in json.loads((base / catalog).read_text())["shots"]:
            key = shot["id"]
            assert re.fullmatch(r"[\w-]+",key) and key not in seen, key
            seen.add(key)
            images = {}
            for view, size in VIEWS.items():
                name = shot["images"][view]
                p = base / (name if isinstance(name,str) else name["file"])
                assert p.resolve().is_relative_to(base.resolve()), p
                im = Image.open(p)
                assert im.size == size, (p,im.size,size)
                buf = io.BytesIO()
                im.convert("RGB").save(buf, "WEBP", lossless=True, method=4)
                data = buf.getvalue()
                fname = f"review/{key}-{view}.{digest(data)[:10]}.webp"
                (dest / fname).write_bytes(data)
                originals[fname] = (p.relative_to(source).as_posix(), digest(p.read_bytes()))
                images[view] = {"file":fname,"width":im.width,"height":im.height,"sha256":digest(data)}
            by_group[shot_groups[key]].append({"id":key, "title":shot["title"], "description":shot["description"], "images":images})
    assert seen == set(shot_groups), f"Missing scenes: {set(shot_groups) - seen}"
    assert all(by_group.values()), "Missing scene comparison"
    sections = [{"id":k,"title":v[0],"description":v[1],"shots":by_group[k]} for k,v in groups.items()]
    catalog = {"version":1, "provenance":"Composed stills, native-size desktop and emulated phone layouts. Example state and counts are identified in the proof records.", "groups":sections}
    offline = copy.deepcopy(catalog)
    for group in offline["groups"]:
        for shot in group["shots"]:
            for image in shot["images"].values():
                image["file"], image["sha256"] = originals[image["file"]]
    return catalog, offline


def offline_index(gallery):
    """Build a local review index that works after unzipping, with no local server."""
    escape = html.escape
    blocks = [
        '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
        '<title>Loopforge · Days 2–4 art review</title>',
        '<style>body{max-width:76rem;margin:auto;padding:1.2rem;background:#142526;color:#f1e3c1;font:1rem/1.5 system-ui}a{color:#e6bf7d}h2{border-bottom:1px solid #65817a}section{display:flex;flex-wrap:wrap;gap:1.2rem}article{width:min(100%,22rem)}img{max-width:100%;height:auto;image-rendering:pixelated}a:focus-visible{outline:3px solid #f1e3c1}</style>',
        '<h1>Loopforge · Days 2–4 art review</h1><p>19 November 2026 · B, Raking light</p>',
        '<p>Open a plate at its native size. The floor and console are composed from sampled shift states.</p>',
    ]
    for group in gallery["groups"]:
        blocks.extend((f'<h2>{escape(group["title"])}</h2>', f'<p>{escape(group["description"])}</p>', '<section>'))
        for shot in group["shots"]:
            desktop = escape(shot["images"]["desktop"]["file"], quote=True)
            title = escape(shot["title"], quote=True)
            links = []
            for view in VIEWS:
                item = shot["images"][view]
                href = escape(item["file"], quote=True)
                links.append(f'<a href="{href}">{item["width"]} × {item["height"]}</a>')
            blocks.append(f'<article><h3>{title}</h3><a href="{desktop}"><img loading="lazy" width="1280" height="720" src="{desktop}" alt="{title}"></a><p>{escape(shot["description"])}</p><p>{" · ".join(links)}</p></article>')
        blocks.append('</section>')
    blocks.append('</html>')
    return "\n".join(blocks)


def pack_zip(target, members, offline_gallery):
    checks = {name:digest(p.read_bytes()) for name,p in sorted(members.items())}
    gallery_data = json_bytes(offline_gallery)
    checks["gallery.json"] = digest(gallery_data)
    with ZipFile(target, "w") as archive:
        for name, p in sorted(members.items()):
            info = ZipInfo(name, (2026,11,19,0,0,0))
            info.external_attr = 0o644 << 16
            compression = ZIP_STORED if p.suffix in {".png",".webp",".ora"} else ZIP_DEFLATED
            archive.writestr(info,p.read_bytes(),compression,compresslevel=9)
        info = ZipInfo("gallery.json",(2026,11,19,0,0,0))
        info.external_attr = 0o644 << 16
        archive.writestr(info,gallery_data,ZIP_DEFLATED)
        info = ZipInfo("checksums.json",(2026,11,19,0,0,0))
        info.external_attr = 0o644 << 16
        archive.writestr(info,json_bytes(checks),ZIP_DEFLATED)
    with ZipFile(target) as archive:
        assert archive.testzip() is None
        assert all(digest(archive.read(k)) == v for k,v in checks.items())
    return len(checks) + 1


def release(source, dest):
    dest.mkdir(parents=True, exist_ok=True)
    for dir_name in ("atlas","review","binding"):
        (dest / dir_name).mkdir(exist_ok=True)
    entries, atlases, lane_meta = {}, {}, {}
    for lane in LANES:
        register = json.loads((source/lane/"manifest.json").read_text())
        assets, atlas = make_atlas(source/lane,register["assets"],lane,dest)
        assert not entries.keys() & assets.keys()
        entries.update(assets)
        atlases[lane] = atlas
        lane_meta[lane] = {k:v for k,v in register.items() if k != "assets"}
    manifest = {"schema":"loopforge.days-2-4.art/1","version":1,"style":"B / Raking light",
                "floor":"approved-factory/day-one-3","groundPixelsPerMetre":64,
                "coordinateOrder":"rect and safeText: x,y,width,height; insets: left,top,right,bottom; pivot: x,y",
                "atlases":atlases,"assets":dict(sorted(entries.items())),"lanes":lane_meta,
                "integration":"binding/shift-art.mjs","handoff":"ENGINE.md","gallery":"gallery.json",
                "sourceFiles":"The file and master fields are paths inside the editable ZIP."}
    (dest/"manifest.json").write_bytes(json_bytes(manifest))
    gallery, offline_gallery = make_gallery(source,dest)
    (dest/"gallery.json").write_bytes(json_bytes(gallery))
    shutil.copyfile(source/"ENGINE.md",dest/"ENGINE.md")
    shutil.copyfile(source/"binding/shift-art.mjs",dest/"binding/shift-art.mjs")
    members = {}
    for f in dest.rglob("*"):
        if f.is_file() and f.name not in {ZIP_NAME,"release.json","gallery.json"} and "review" not in f.relative_to(dest).parts:
            members[f.relative_to(dest).as_posix()] = f
    # Store original sprite parts, independently editable layers, proof boards and authoring recipes.
    for lane in (*LANES,"proofs","binding"):
        for p in (source/lane).rglob("*"):
            if p.is_file() and "__pycache__" not in p.parts and not p.name.startswith(".") and not p.stem.endswith("-temp"):
                members[p.relative_to(source).as_posix()] = p
    for name in ("REVIEW.md","build_release.py"):
        members[name] = source/name
    offline_file = dest / "review.html"
    offline_file.write_text(offline_index(offline_gallery))
    members["review.html"] = offline_file
    count = pack_zip(dest/ZIP_NAME,members,offline_gallery)
    offline_file.write_text(offline_index(gallery))
    zip_data = (dest/ZIP_NAME).read_bytes()
    (dest/"release.json").write_bytes(json_bytes({"pack":ZIP_NAME,"bytes":len(zip_data),"sha256":digest(zip_data),
                                "files":count,"assets":len(entries),"atlases":len(atlases)}))
    print(f"{len(entries)} verified native sprites and editable masters; {count} pack files; {len(zip_data):,} bytes")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=ROOT)
    parser.add_argument("--out", type=Path, default=PUBLIC)
    args = parser.parse_args()
    # A staged release prevents superseded proof images or interrupted builds from entering the ZIP.
    with tempfile.TemporaryDirectory() as tmp:
        complete = Path(tmp)
        release(args.source.resolve(),complete)
        args.out.mkdir(parents=True,exist_ok=True)
        for p in complete.rglob("*"):
            if p.is_file():
                to = args.out / p.relative_to(complete)
                to.parent.mkdir(parents=True,exist_ok=True)
                shutil.copyfile(p,to)
