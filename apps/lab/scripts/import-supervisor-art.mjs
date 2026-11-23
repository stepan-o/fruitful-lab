/** Import the owner's original Loopforge art without changing composition. */
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = process.argv[2];
if (!sourceRoot) throw new Error('Usage: node scripts/import-supervisor-art.mjs /path/to/loopforge');
const inventory = JSON.parse(await readFile(path.join(appRoot, '../../docs/loopforge/SUPERVISOR_ART_SOURCES.json'), 'utf8'));
const catalog = { pack:'loopforge-supervisors', assets:{} };
await mkdir(path.join(appRoot, 'assets/loopforge-supervisors'), {recursive:true});
for (const image of inventory.images) {
  const bytes = await readFile(path.resolve(sourceRoot, image.source));
  if (createHash('sha256').update(bytes).digest('hex') !== image.sha256) throw new Error(`Source changed: ${image.id}`);
  const destination = `assets/loopforge-supervisors/${image.id}.webp`;
  await sharp(bytes).rotate().webp({quality:94,effort:6}).toFile(path.join(appRoot,destination));
  catalog.assets[image.id] = {kind:'image',source:destination,widths:[480,960,1536],quality:82,maxBytes:650000};
}
await writeFile(path.join(appRoot,'assets/loopforge-supervisors.json'),JSON.stringify(catalog,null,2)+'\n');
console.log(`Prepared ${inventory.images.length} originals. Run assets:build -- assets/loopforge-supervisors.json`);
