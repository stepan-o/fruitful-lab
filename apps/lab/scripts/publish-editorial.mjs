import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { activate, digest, verifyManifest } from './assets.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const archive = path.join(root, 'assets/research/public');
const publicRoot = path.join(root, 'public');
const source = JSON.parse(await readFile(path.join(root, 'lib/assets/generated/sanctuary.json')));
const decisions = JSON.parse(await readFile(path.join(root, 'lib/sanctuary/editorial-media.json')));
const manifest = { schemaVersion: 1, pack: 'sanctuary-editorial', assets: {} };
async function immutable(url, bytes) {
  const file = path.join(publicRoot, url);
  await mkdir(path.dirname(file), { recursive: true });
  try { await writeFile(file, bytes, { flag: 'wx' }); }
  catch (error) {
    if (error.code !== 'EEXIST' || !(await readFile(file)).equals(bytes)) throw error;
  }
}
// Validate the source archive and decisions before making any file public.
const sourceBytes = Buffer.from(JSON.stringify(source, null, 2) + '\n');
await verifyManifest(sourceBytes, 'sanctuary', digest(sourceBytes), { publicRoot: archive });
for (const [id, decision] of Object.entries(decisions.assets)) {
  if (decision.publication !== 'editorial') continue;
  if (!decision.owner || !decision.source || !decision.purpose || !decision.basis || !decision.reviewed || !decision.sourceSha256) throw new Error(`Incomplete editorial decision: ${id}`);
  const entry = structuredClone(source.assets[id]);
  if (entry?.kind !== 'image') throw new Error(`Missing image: ${id}`);
  manifest.assets[id] = entry;
}
for (const entry of Object.values(manifest.assets)) {
  for (const variant of entry.variants) await immutable(variant.src, await readFile(path.join(archive, variant.src)));
  // Preserve the existing inspection master. Add a small-screen derivative only.
  if (entry.variants[0].width > 480) {
    const master = entry.variants.at(-1);
    const { data, info } = await sharp(path.join(archive, master.src)).resize({ width: 480 }).webp({ quality: 84, effort: 4 }).toBuffer({ resolveWithObject: true });
    const sha256 = digest(data);
    const src = `/media/files/${sha256}.webp`;
    await immutable(src, data);
    entry.variants.unshift({ src, mime: 'image/webp', bytes: data.length, sha256, width: info.width, height: info.height });
  }
}
const bytes = Buffer.from(JSON.stringify(manifest, null, 2) + '\n');
const revision = digest(bytes);
await immutable(`/media/manifests/${manifest.pack}.${revision}.json`, bytes);
await activate(manifest.pack, revision);
console.log(`Published ${Object.keys(manifest.assets).length} reviewed editorial images; pointer activated last.`);
