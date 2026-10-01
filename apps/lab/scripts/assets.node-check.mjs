import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { activate, buildPack, checkAll, digest } from './assets.mjs';

test('releases are deterministic, append-only, complete, and safely reversible', async t => {
  const root = await mkdtemp(path.join(tmpdir(), 'lab-assets-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const options = { sourceRoot: root, publicRoot: path.join(root, 'public'), generatedRoot: path.join(root, 'generated') };
  const catalogPath = path.join(root, 'pack.json');
  const imagePath = path.join(root, 'source.png');
  const audio = Buffer.from('original audio bytes');
  await writeFile(path.join(root, 'sound.mp3'), audio);
  await sharp({ create: { width: 80, height: 40, channels: 4, background: '#ff000080' } }).png().toFile(imagePath);
  const catalog = { pack: 'test-pack', assets: {
    picture: { kind: 'image', source: 'source.png', widths: [40, 80, 160] },
    sound: { kind: 'audio', source: 'sound.mp3' },
  } };
  await writeFile(catalogPath, JSON.stringify(catalog));
  const first = await buildPack(catalogPath, options);
  assert.deepEqual(await buildPack(catalogPath, options), first);
  const firstManifest = JSON.parse(await readFile(path.join(options.publicRoot, first.manifest)));
  assert.deepEqual(firstManifest.assets.picture.variants.map(v => v.width), [40, 80]);
  const full = firstManifest.assets.picture.variants[1];
  const metadata = await sharp(path.join(options.publicRoot, full.src)).metadata();
  assert.equal(metadata.hasAlpha, true);
  assert.equal(metadata.width, 80);
  assert.equal(metadata.height, 40);
  assert.equal(firstManifest.assets.sound.variants[0].sha256, digest(audio));
  assert.equal(await checkAll(options), 1);

  await sharp({ create: { width: 80, height: 40, channels: 4, background: '#00ff0080' } }).png().toFile(imagePath);
  const second = await buildPack(catalogPath, options);
  assert.notEqual(first.revision, second.revision);
  assert.equal(await checkAll(options), 2);
  await activate(first.pack, first.revision, options);
  assert.deepEqual(JSON.parse(await readFile(path.join(options.publicRoot, 'media/pointers/test-pack.json'))), first);
  assert.equal(await checkAll(options), 2);

  catalog.assets.picture.maxBytes = 1;
  await writeFile(catalogPath, JSON.stringify(catalog));
  await assert.rejects(buildPack(catalogPath, options), /exceeds/);
  assert.deepEqual(JSON.parse(await readFile(path.join(options.publicRoot, 'media/pointers/test-pack.json'))), first);

  const filename = path.join(options.publicRoot, full.src);
  await writeFile(filename, 'corrupt');
  await assert.rejects(activate(first.pack, first.revision, options), /integrity/);
  await assert.rejects(checkAll(options), /integrity/);
});
