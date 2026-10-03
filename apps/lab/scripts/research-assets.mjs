import { readFile, access } from 'node:fs/promises';
import { checkAll } from './assets.mjs';

const publicRoot = new URL('../assets/research/public/', import.meta.url).pathname;
const read = async file => JSON.parse(await readFile(new URL(file, import.meta.url), 'utf8'));
const archive = await read('../lib/assets/generated/sanctuary.json');
const editorial = await read('../lib/assets/generated/sanctuary-editorial.json');
const decisions = await read('../lib/sanctuary/editorial-media.json');
const published = new Set();
for (const [id, asset] of Object.entries(editorial.assets)) {
  const decision = decisions.assets[id];
  if (decision?.publication !== 'editorial' || !decision.owner || !decision.source || !decision.purpose || !decision.basis || !decision.reviewed || !decision.sourceSha256) throw new Error(`Missing editorial record: ${id}`);
  for (const file of asset.variants) published.add(file.src);
}
for (const [id, decision] of Object.entries(decisions.assets)) {
  if (decision.publication === 'editorial' && !editorial.assets[id]) throw new Error(`Unpublished selection: ${id}`);
}
for (const asset of Object.values(archive.assets)) for (const file of asset.variants) {
  if (published.has(file.src)) continue;
  try { await access(new URL(`../public${file.src}`, import.meta.url)); }
  catch (error) { if (error.code === 'ENOENT') continue; throw error; }
  throw new Error(`Unselected research media in public: ${file.src}`);
}
let installed = true;
try { await access(publicRoot); } catch (error) { if (error.code !== 'ENOENT') throw error; installed = false; }
if (installed) await checkAll({ publicRoot });
else if (process.argv.includes('--required')) throw new Error('Install the optional archive with npm run research:import before starting research:dev.');
console.log(`Public editorial selection verified. Local archive ${installed ? 'verified' : 'not installed (optional)'}.`);
