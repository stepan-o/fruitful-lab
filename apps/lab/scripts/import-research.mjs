import { readFile, mkdir, copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { digest, activate } from './assets.mjs';
const app=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const [gallery,concordFile,bg3File]=process.argv.slice(2);
if(!gallery||!concordFile||!bg3File)throw new Error('Usage: npm run research:import -- /path/to/sanctuary-assets /path/to/concord-reveal.jpg /path/to/bg3-key-art.jpg');
const previous=JSON.parse(await readFile(path.join(app,'lib/assets/generated/sanctuary.json'),'utf8'));
const library=JSON.parse(await readFile(path.join(gallery,'generated/sanctuary.json'),'utf8'));
const ids=[...new Set([...Object.keys(previous.assets),'legacy-d2-heroes','legacy-d2-item','legacy-social','legacy-poe-store','legacy-d4-confirm'])].filter(id=>!['concord-gameplay-reveal-2024','bg3-official-key-art'].includes(id));
const manifest={schemaVersion:1,pack:'sanctuary',assets:{}};
const publicRoot=path.join(app,'assets/research/public');
for(const id of ids){
  const asset=library.assets[id];if(!asset)throw new Error(`Missing research source ${id}`);
  manifest.assets[id]=asset;
  for(const file of asset.variants){const dest=path.join(publicRoot,file.src);await mkdir(path.dirname(dest),{recursive:true});await copyFile(path.join(gallery,'cdn',file.src),dest);}
}
for(const [id,filename,widths] of [['concord-gameplay-reveal-2024',concordFile,[768,1600]],['bg3-official-key-art',bg3File,[480,960,1920]]]){
const original=await readFile(filename);const meta=await sharp(original).metadata();const variants=[];
for(const width of [...new Set(widths.map(width=>Math.min(width,meta.width)))]){
  const {data,info}=await sharp(original).resize({width,withoutEnlargement:true}).webp({quality:86,effort:4}).toBuffer({resolveWithObject:true});
  const hash=digest(data),src=`/media/files/${hash}.webp`;await writeFile(path.join(publicRoot,src),data);
  variants.push({src,mime:'image/webp',bytes:data.length,sha256:hash,width:info.width,height:info.height});
}
manifest.assets[id]={kind:'image',width:meta.width,height:meta.height,variants};
}
const bytes=Buffer.from(JSON.stringify(manifest,null,2)+'\n'),revision=digest(bytes);
await mkdir(path.join(publicRoot,'media/manifests'),{recursive:true});await writeFile(path.join(publicRoot,`media/manifests/sanctuary.${revision}.json`),bytes);
await activate('sanctuary',revision,{publicRoot});
console.log(`Installed ${Object.keys(manifest.assets).length} local-only research images; nothing was added to public/.`);
