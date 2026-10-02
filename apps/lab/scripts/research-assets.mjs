import { readFile, access } from 'node:fs/promises';
import { checkAll } from './assets.mjs';
const publicRoot = new URL('../assets/research/public/', import.meta.url).pathname;
const manifest=JSON.parse(await readFile(new URL('../lib/assets/generated/sanctuary.json',import.meta.url),'utf8'));
for(const asset of Object.values(manifest.assets)) for(const file of asset.variants){
  try {await access(new URL(`../public${file.src}`,import.meta.url));}
  catch(error){if(error.code==='ENOENT')continue;throw error;}
  throw new Error(`Research-only media leaked into public: ${file.src}`);
}
let installed=true;
try {await access(publicRoot);} catch(error){if(error.code!=='ENOENT')throw error;installed=false;}
if(installed)await checkAll({publicRoot});
else if(process.argv.includes('--required'))throw new Error('Install the private research archive with npm run research:import before starting research:dev. See docs/sanctuary/README.md.');
console.log(`Publisher media absent from public assets. Local research archive ${installed?'verified':'not installed (optional)'}.`);
