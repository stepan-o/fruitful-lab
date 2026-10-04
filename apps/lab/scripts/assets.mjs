import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const namePattern = /^[a-z][a-z0-9-]{0,63}$/;
const hashPattern = /^[a-f0-9]{64}$/;
const mimeTypes = { '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.wav': 'audio/wav', '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json' };
export const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const serialize = (value) => Buffer.from(JSON.stringify(value, null, 2) + '\n');

async function atomicWrite(filename, bytes) {
  await mkdir(path.dirname(filename), { recursive: true });
  const temporary = `${filename}.${process.pid}.tmp`;
  await writeFile(temporary, bytes);
  await rename(temporary, filename);
}

async function immutableWrite(filename, bytes) {
  await mkdir(path.dirname(filename), { recursive: true });
  try {
    await writeFile(filename, bytes, { flag: 'wx' });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    if (!(await readFile(filename)).equals(bytes)) throw new Error(`Immutable file changed: ${filename}`);
  }
}

function roots(options = {}) {
  return { publicRoot: options.publicRoot ?? path.join(appRoot, 'public'), generatedRoot: options.generatedRoot ?? path.join(appRoot, 'lib/assets/generated') };
}

function localFile(publicRoot, url) {
  if (!/^\/media\/files\/[a-f0-9]{64}\.(webp|mp3|ogg|wav|mp4|webm|json)$/.test(url)) throw new Error(`Invalid asset URL: ${url}`);
  return path.join(publicRoot, url);
}

export async function verifyManifest(bytes, pack, revision, options = {}) {
  const { publicRoot } = roots(options);
  if (!namePattern.test(pack) || !hashPattern.test(revision) || digest(bytes) !== revision) throw new Error('Manifest identity mismatch');
  const manifest = JSON.parse(bytes);
  if (manifest.schemaVersion !== 1 || manifest.pack !== pack || !manifest.assets || !Object.keys(manifest.assets).length) throw new Error('Invalid manifest');
  for (const entry of Object.values(manifest.assets)) {
    if (!Array.isArray(entry.variants) || !entry.variants.length) throw new Error('Missing asset variants');
    for (const variant of entry.variants) {
      const file = await readFile(localFile(publicRoot, variant.src));
      if (file.length !== variant.bytes || digest(file) !== variant.sha256 || !variant.src.includes(`/${variant.sha256}.`)) throw new Error(`Asset integrity failure: ${variant.src}`);
    }
  }
  return manifest;
}

export async function activate(pack, revision, options = {}) {
  const { publicRoot, generatedRoot } = roots(options);
  if (!namePattern.test(pack) || !hashPattern.test(revision)) throw new Error('Invalid pack or revision');
  const url = `/media/manifests/${pack}.${revision}.json`;
  const bytes = await readFile(path.join(publicRoot, url));
  await verifyManifest(bytes, pack, revision, options);
  const pointer = { schemaVersion: 1, pack, revision, manifest: url };
  // The pointer is published last. Old releases are never removed by this tool.
  await atomicWrite(path.join(generatedRoot, `${pack}.json`), bytes);
  await atomicWrite(path.join(publicRoot, 'media/pointers', `${pack}.json`), serialize(pointer));
  return pointer;
}

export async function buildPack(catalogPath, options = {}) {
  const { publicRoot } = roots(options);
  const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));
  if (!namePattern.test(catalog.pack) || !catalog.assets || !Object.keys(catalog.assets).length) throw new Error('Invalid asset catalog');
  const manifest = { schemaVersion: 1, pack: catalog.pack, assets: {} };
  for (const id of Object.keys(catalog.assets).sort()) {
    const spec = catalog.assets[id];
    if (!namePattern.test(id) || typeof spec.source !== 'string') throw new Error(`Invalid catalog entry: ${id}`);
    const input = path.resolve(options.sourceRoot ?? appRoot, spec.source);
    const sourceBytes = await readFile(input);
    const variants = [];
    async function save(bytes, ext, mime, dimensions = {}) {
      const budget = spec.maxBytes ?? (spec.kind === 'image' ? 900000 : 5000000);
      if (bytes.length > budget) throw new Error(`${id} exceeds ${budget} byte budget (${bytes.length})`);
      const hash = digest(bytes);
      const src = `/media/files/${hash}${ext}`;
      await immutableWrite(localFile(publicRoot, src), bytes);
      variants.push({ src, mime, bytes: bytes.length, sha256: hash, ...dimensions });
    }
    if (spec.kind === 'image') {
      const metadata = await sharp(sourceBytes).metadata();
      if (!metadata.width || !metadata.height || (metadata.pages ?? 1) !== 1) throw new Error(`${id}: only still images are supported`);
      const sourceWidth = metadata.autoOrient?.width ?? metadata.width;
      const sourceHeight = metadata.autoOrient?.height ?? metadata.height;
      const widths = [...new Set((spec.widths ?? [768, 1536, 2560]).map(w => Math.min(w, sourceWidth)))].sort((a,b) => a-b);
      if (widths.some(w => !Number.isInteger(w) || w < 1 || w > 4096)) throw new Error(`${id}: invalid image widths`);
      for (const width of widths) {
        const { data, info } = await sharp(sourceBytes).rotate().resize({ width, withoutEnlargement: true })
          .webp({ lossless: spec.lossless ?? false, quality: spec.quality ?? 88, alphaQuality: spec.alphaQuality ?? 100, effort: 4 }).toBuffer({ resolveWithObject: true });
        await save(data, '.webp', 'image/webp', { width: info.width, height: info.height });
      }
      manifest.assets[id] = { kind: 'image', width: sourceWidth, height: sourceHeight, variants };
    } else {
      const ext = path.extname(input).toLowerCase();
      const mime = mimeTypes[ext];
      if (!mime || !['audio', 'video', 'data'].includes(spec.kind) ||
          (spec.kind === 'data' ? mime !== 'application/json' : !mime.startsWith(`${spec.kind}/`))) throw new Error(`${id}: unsupported type`);
      if (spec.kind === 'data') JSON.parse(sourceBytes);
      await save(sourceBytes, ext, mime);
      manifest.assets[id] = { kind: spec.kind, variants };
    }
  }
  const bytes = serialize(manifest);
  const revision = digest(bytes);
  await immutableWrite(path.join(publicRoot, `media/manifests/${catalog.pack}.${revision}.json`), bytes);
  return activate(catalog.pack, revision, options);
}

export async function checkAll(options = {}) {
  const { publicRoot, generatedRoot } = roots(options);
  const manifestsDir = path.join(publicRoot, 'media/manifests');
  const filenames = await readdir(manifestsDir);
  for (const filename of filenames) {
    const match = /^([a-z][a-z0-9-]{0,63})\.([a-f0-9]{64})\.json$/.exec(filename);
    if (!match) throw new Error(`Unexpected manifest filename: ${filename}`);
    await verifyManifest(await readFile(path.join(manifestsDir, filename)), match[1], match[2], options);
  }
  const pointersDir = path.join(publicRoot, 'media/pointers');
  for (const filename of await readdir(pointersDir)) {
    const pointer = JSON.parse(await readFile(path.join(pointersDir, filename)));
    if (pointer.schemaVersion !== 1 || !namePattern.test(pointer.pack) || !hashPattern.test(pointer.revision) ||
        filename !== `${pointer.pack}.json` || pointer.manifest !== `/media/manifests/${pointer.pack}.${pointer.revision}.json`) throw new Error('Invalid pointer');
    const bytes = await readFile(path.join(publicRoot, pointer.manifest));
    await verifyManifest(bytes, pointer.pack, pointer.revision, options);
    if (!(await readFile(path.join(generatedRoot, `${pointer.pack}.json`))).equals(bytes)) throw new Error('Build-time manifest and pointer disagree');
  }
  return filenames.length;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [command, arg, revision] = process.argv.slice(2);
  try {
    if (command === 'build') {
      const catalogs = arg ? [path.resolve(arg)] : (await readdir(path.join(appRoot, 'assets'))).filter(f => f.endsWith('.json')).sort().map(f => path.join(appRoot, 'assets', f));
      for (const catalog of catalogs) console.log(await buildPack(catalog));
    } else if (command === 'activate') console.log(await activate(arg, revision));
    else if (command === 'check') console.log(`Verified ${await checkAll()} retained asset release(s).`);
    else throw new Error('Usage: assets.mjs build [catalog] | check | activate <pack> <revision>');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
