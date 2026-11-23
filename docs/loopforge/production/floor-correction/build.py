"""Rebuild the four floor exports and layered OpenRaster masters (Pillow, NumPy)."""
from hashlib import sha256
from io import BytesIO
import json
from pathlib import Path
import random
from xml.etree import ElementTree as ET
from zipfile import ZIP_DEFLATED, ZIP_STORED, ZipFile, ZipInfo

import numpy as np
from PIL import Image, ImageChops, ImageDraw

ROOT = Path(__file__).resolve().parents[4]
PUBLIC = ROOT / "apps/lab/public"
OUT = PUBLIC / "loopforge-design/floor-correction/v1"
CAL = ROOT / "docs/loopforge/production/day-one-sprite-calibration/01-style-B.zip"
PPM = 32  # transparent ground overlay; the plate material retains its native 64 px/m
SETTINGS = {
    "security": {
        "source": "security", "phase": [104.75, 95.5], "origin": [113, 108],
        "extent": [32, 30.25], "ambient": [0.72, 0.85, 0.90],
        "rows": [(16, 91, [22, 164]), (91, 200, [73, 226]), (200, 272, [39, 178])],
        "hardware": [123.38, 130.02], "hardware_name": "Queue grip",
        "wear": [(123.52, 130.45, 0.49, 0.95), (131.57, 130.72, 0.39, 0.55)],
    },
    "conveyor": {
        "source": "forge", "phase": [74.75, 138.25], "origin": [108, 138.25],
        "extent": [38, 23], "ambient": [0.81, 0.78, 0.82],
        "rows": [(8, 82, [64, 201]), (82, 186, [35, 158]), (186, 264, [67, 215])],
        "hardware": [133.72, 144.05], "hardware_name": "Press service louver",
        "wear": [(131.68, 144.37, 0.53, 0.39), (131.06, 144.18, 0.45, 0.30),
                 (119.68, 144.46, 0.28, 0.31)],
    },
}


def png(image):
    out = BytesIO()
    image.save(out, format="PNG", optimize=True)
    return out.getvalue()


def layer_stack(layers):
    merged = Image.new("RGBA", layers[0][1].size)
    for _, layer in layers:
        merged.alpha_composite(layer)
    return merged


def ora(path, layers, merged):
    width, height = merged.size
    xml = ET.Element("image", w=str(width), h=str(height), version="0.0.3", name=path.stem)
    stack = ET.SubElement(xml, "stack")
    with ZipFile(path, "w") as z:
        def put(name, data, method=ZIP_DEFLATED):
            entry = ZipInfo(name, (2026, 11, 19, 0, 0, 0))
            z.writestr(entry, data, compress_type=method)
        put("mimetype", "image/openraster", ZIP_STORED)
        for i, (name, layer) in enumerate(reversed(layers)):
            source = f"data/{i}.png"
            ET.SubElement(stack, "layer", name=name, src=source, x="0", y="0",
                          opacity="1.0", visibility="visible", **{"composite-op": "svg:src-over"})
            put(source, png(layer))
        put("stack.xml", ET.tostring(xml, encoding="utf-8", xml_declaration=True))
        put("mergedimage.png", png(merged))
        thumb = merged.copy()
        thumb.thumbnail((256, 256))
        put("Thumbnails/thumbnail.png", png(thumb))


def source(archive, room, part):
    name = f"png/env-floor-kit-{room}-{part}-r02.png"
    return Image.open(BytesIO(archive.read(name))).convert("RGBA")


def ambient(image, factors):
    array = np.array(image)
    array[:, :, :3] = np.rint(array[:, :, :3] * np.array(factors)).astype(np.uint8)
    return Image.fromarray(array)


def plates(archive, cfg):
    base = source(archive, cfg["source"], "base")
    joints = source(archive, cfg["source"], "joints")
    mask = Image.new("L", base.size)
    draw = ImageDraw.Draw(mask)
    # Lift the calibrated continuous rim and screw pixels from the source.
    # Locations wrap at both texture boundaries, including the last panel row.
    for top, bottom, edges in cfg["rows"]:
        for i, left in enumerate(edges):
            right = edges[(i + 1) % 2] + (256 if i == 1 else 0)
            for dx in (-256, 0, 256):
                for dy in (-256, 0, 256):
                    x, y, r, b = left + dx, top + dy, right + dx, bottom + dy
                    for rect in [(x,y,r-1,y+1), (x,y,x+1,b-1), (x,b-1,r-1,b-1),
                                 (x+7,b-10,x+11,b-6), (r-10,y+7,r-6,y+11)]:
                        draw.rectangle(rect, fill=255)
    rims = Image.new("RGBA", base.size)
    rims.paste(joints, mask=mask)
    # Keep the steel tooth, quiet the broad motif in the old concept grain.
    # Periodic sampling gives the filter the same neighbours at either edge.
    enamel = np.asarray(base, dtype=float)[:, :, :3]
    broad = sum(np.roll(enamel, (dy,dx), (0,1))
                for dy in (-8,-4,0,4,8) for dx in (-8,-4,0,4,8)) / 25
    centre = enamel.mean(axis=(0,1))
    enamel = np.clip(centre + .36*(broad-centre) + .64*(enamel-broad), 0, 255)
    base = Image.fromarray(np.rint(enamel).astype("uint8")).convert("RGBA")
    layers = [("Enamel and mill grain", ambient(base, cfg["ambient"])),
              ("Panel lips and fasteners", ambient(rims, cfg["ambient"]))]
    # Move the Forge tile cut three native pixels away from a screw head.
    # Offset both layers on the torus so the two outer texel rows also match.
    if cfg["source"] == "forge":
        return [(name, ImageChops.offset(image, 0, 3)) for name, image in layers]
    return layers


def smooth(x):
    x = np.clip(x, 0, 1)
    return x*x*(3-2*x)


def tint(size, rgb, field):
    # Ordered sub-byte rounding keeps the long falloff smooth without softening
    # silhouettes. All colour is straight alpha in sRGB.
    bayer = np.array([[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]]) / 16
    dither = np.tile(bayer, (size[1]//4+1, size[0]//4+1))[:size[1], :size[0]]
    a = np.floor(255*np.clip(field, 0, 1) + dither).astype(np.uint8)
    im = Image.new("RGBA", size, rgb)
    im.putalpha(Image.fromarray(a))
    return im


def room_layers(archive, room, cfg):
    ox, oy = cfg["origin"]
    size = tuple(round(v*PPM) for v in cfg["extent"])
    x, y = np.meshgrid(ox+(np.arange(size[0])+.5)/PPM, oy+(np.arange(size[1])+.5)/PPM)
    def pixel(wx, wy):
        return (round((wx-ox)*PPM), round((wy-oy)*PPM))
    def blank():
        return Image.new("RGBA", size)
    # Transparent on all outside edges, including the Forge's north wall.
    dx, dy = cfg["extent"]
    edge = smooth(np.minimum(x-ox, ox+dx-x)/1.2) * smooth(np.minimum(y-oy, oy+dy-y)/1.1)
    wear = blank()
    d = ImageDraw.Draw(wear)
    rng = random.Random(146 if room == "security" else 822)
    for wx, wy, spread_x, spread_y in cfg["wear"]:
        cx, cy = pixel(wx, wy)
        for i in range(60):
            px = cx + round(np.clip(rng.gauss(0, .55), -1.5, 1.5)*spread_x*PPM)
            py = cy + round(np.clip(rng.gauss(0, .55), -1.5, 1.5)*spread_y*PPM)
            length = rng.choice([1, 2, 3, 4, 6])
            col = (110,128,117) if room == "security" else (157,115,75)
            d.line((px,py,px+length,py-rng.choice([0,1,2])), fill=(*col,rng.randint(28,90)))
    hardware = blank()
    joints = source(archive, cfg["source"], "joints")
    cut = (2,112,23,192) if room == "security" else (204,29,256,78)
    detail = joints.crop(cut)
    detail = detail.resize(tuple(round(v*PPM/64) for v in detail.size), Image.Resampling.NEAREST)
    pos = pixel(*cfg["hardware"])
    hardware.alpha_composite(detail, pos)
    if room == "security":
        # North clerestory, aiming SW past the visitor approach. A single
        # mullion separates the main shaft from its narrow companion.
        cross = x - (130.95 - .44*(y-121))
        reach = np.exp(-((y-118.8)/13.2)**2)
        penumbra = .19 * np.exp(-((cross-.05)/3.35)**2) * reach
        shaft = (.43 * np.exp(-((cross+.50)/1.10)**4)
                 + .15 * np.exp(-((cross-1.55)/.39)**2)) * reach
        return [("Desk approach scuffs", wear), ("Queue grip", hardware),
                ("Clerestory bounce", tint(size,(103,156,150),edge*penumbra)),
                ("Glazing and mullion", tint(size,(149,204,191),edge*shaft))]
    # Low press-side practical. Oblique guard shadows cut the fan across the
    # line. The hottest surface sits by the louver, east of the operator.
    along = 134.3-x
    across = y-(144.45-.31*along)
    width = 1.05 + .10*np.clip(along, 0, 20)
    reach = np.exp(-(along/12.5)**2) * smooth((along+2.4)/2.9)
    bounce = .23 * np.exp(-((x-131.9)/8.3)**2-((y-144)/4.8)**2)
    fan = .48 * np.exp(-(across/width)**4) * reach
    for offset, strength in [(-.48,.78), (.58,.32)]:
        fan *= 1-strength*np.exp(-((across/width-offset)/(.105+.009*np.clip(along,0,20)))**2)
    lamp = blank()
    d = ImageDraw.Draw(lamp)
    for row in range(5):
        sx, sy = pos[0]+4, pos[1]+4+round(row*3.5)
        d.line((sx,sy,sx+15,sy), fill=(223,152,79,160))
        d.line((sx+3,sy,sx+11,sy), fill=(247,184,103,178))
    return [("Operator heel marks", wear), ("Press service louver", hardware),
            ("Reflected furnace heat", tint(size,(186,112,55),edge*bounce)),
            ("Raking light through guard", tint(size,(235,150,67),edge*fan)),
            ("Recessed louver light", lamp)]


def main():
    (OUT/"masters").mkdir(parents=True,exist_ok=True)
    manifest = {"version":"raking-floor/1", "date":"2026-11-19",
                "baseline":"73658a934ccf9fab0bfe72657a266ad70d5bb299",
                "geometry":"approved-factory/day-one-3", "coordinates":"factory metres; x east, y south",
                "originCorner":"northwest", "projection":"orthographic ground; use floorView.xy",
                "drawOrder":["material","room","existing rails, fixtures, contact shadows, actors, items, signal and UI"],
                "blend":"source-over", "opacity":1, "smoothing":False, "rooms":{}}
    with ZipFile(CAL) as a:
        for room,cfg in SETTINGS.items():
            assets = {}
            for key,layers in [("material",plates(a,cfg)), ("room",room_layers(a,room,cfg))]:
                name = room+"-"+key
                merged = layer_stack(layers)
                master = "masters/"+name+".ora"
                ora(OUT/master,layers,merged)
                image = merged.convert("RGB") if key == "material" else merged
                file = name+".webp"
                image.save(OUT/file,lossless=True,method=6,exact=True)
                assets[key] = {"file":file, "master":master, "repeat":key=="material",
                               "originM": cfg["phase"] if key=="material" else cfg["origin"],
                               "extentM": [4,4] if key=="material" else cfg["extent"],
                               "pixelsPerMetre":64 if key=="material" else PPM, "sizePx":image.size,
                               "sha256":sha256((OUT/file).read_bytes()).hexdigest()}
            manifest["rooms"][room]=assets
    (OUT/"manifest.json").write_text(json.dumps(manifest,indent=2)+"\n")


if __name__ == "__main__":
    main()
