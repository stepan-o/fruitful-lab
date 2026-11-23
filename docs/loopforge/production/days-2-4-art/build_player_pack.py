"""Assemble the distributable art from the checked local ENGINE handoff."""
from pathlib import Path
import json
import shutil
import sys
import tempfile

from build_release import LANES, ZIP_NAME, digest, json_bytes, offline_index, pack_zip

SOURCE = Path(__file__).resolve().parent


def build(engine, out):
    catalog = json.loads((engine / "gallery.json").read_text())
    catalog["groups"] = [g for g in catalog["groups"] if g["id"] != "inspection"]
    manifest = json.loads((engine / "manifest.json").read_text())
    for meta in manifest["lanes"].values():
        for key in ("documentation", "proofs", "screenRules"):
            meta.pop(key, None)
    with tempfile.TemporaryDirectory() as work:
        staging = Path(work)
        members = {}
        def copy(src, rel):
            p = staging / rel
            p.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(src, p)
            members[rel] = p

        for atlas in manifest["atlases"].values():
            copy(engine / atlas["file"], atlas["file"])
        copy(engine / "binding/shift-art.mjs", "binding/shift-art.mjs")
        copy(SOURCE / "PUBLIC-ENGINE.md", "ENGINE.md")
        for filename, data in (("manifest.json", json_bytes(manifest)), ("review.html", offline_index(catalog).encode())):
            p = staging / filename
            p.write_bytes(data)
            members[filename] = p
        for group in catalog["groups"]:
            for shot in group["shots"]:
                for img in shot["images"].values():
                    filename = img["file"]
                    copy(engine / filename, filename)
                    assert digest(members[filename].read_bytes()) == img["sha256"]
        public_files = dict(members)
        for asset in manifest["assets"].values():
            for field in ("file", "master"):
                path = asset[field]
                assert path.startswith(tuple(lane + "/" for lane in LANES))
                members[path] = SOURCE / path
        zip_path = staging / ZIP_NAME
        count = pack_zip(zip_path, members, catalog)
        art_bytes = zip_path.read_bytes()
        (staging / "gallery.json").write_bytes(json_bytes(catalog))
        (staging / "release.json").write_bytes(json_bytes({
            "pack": ZIP_NAME, "bytes": len(art_bytes), "sha256": digest(art_bytes),
            "files": count, "assets": len(manifest["assets"]), "atlases": len(manifest["atlases"]),
            "proofs": sum(len(s["images"]) for g in catalog["groups"] for s in g["shots"]),
        }))
        for name in ("gallery.json", "release.json", ZIP_NAME):
            public_files[name] = staging / name
        for rel, f in public_files.items():
            target = out / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(f, target)
        print((staging / "release.json").read_text())


if __name__ == "__main__":
    build(Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve())
