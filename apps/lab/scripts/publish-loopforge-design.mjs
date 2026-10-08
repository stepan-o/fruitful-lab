/** Register already optimized, owner-approved design-board media without re-encoding. */
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const art = JSON.parse(
  await readFile(
    resolve(root, "../../docs/loopforge/game-design/art.json"),
    "utf8",
  ),
);
const assets = {};
for (const [id, entry] of Object.entries(art)) {
  const variants = [];
  for (const item of entry.variants) {
    const bytes = await readFile(resolve(root, "public" + item.src));
    if (
      createHash("sha256").update(bytes).digest("hex") !== item.sha256 ||
      bytes.length !== item.bytes
    )
      throw new Error(`Corrupt design asset: ${id}`);
    variants.push({ ...item, mime: "image/webp" });
  }
  const largest = variants.at(-1);
  assets[id] = {
    kind: "image",
    width: largest.width,
    height: largest.height,
    variants,
  };
}
const manifest = { schemaVersion: 1, pack: "loopforge-design", assets };
const encoded = JSON.stringify(manifest, null, 2) + "\n";
const revision = createHash("sha256").update(encoded).digest("hex");
const path = `/media/manifests/loopforge-design.${revision}.json`;
await writeFile(resolve(root, "public" + path), encoded);
await writeFile(
  resolve(root, "public/media/pointers/loopforge-design.json"),
  JSON.stringify(
    { schemaVersion: 1, pack: "loopforge-design", revision, manifest: path },
    null,
    2,
  ) + "\n",
);
await writeFile(
  resolve(root, "lib/assets/generated/loopforge-design.json"),
  encoded,
);
console.log(
  `Registered ${Object.keys(assets).length} existing design illustrations; ${revision}`,
);
