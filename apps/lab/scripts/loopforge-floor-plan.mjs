/** Export the actual floor authority as an original, inspectable 2D design plate.
 * TypeScript is already a build dependency; no browser/renderer dependency here. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import ts from 'typescript';
const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const spatial = path.join(app, 'lib/loopforge/spatial');
const cache = new Map();
function load(name) {
  const file = path.resolve(spatial, name + '.ts');
  if (path.dirname(file) !== spatial) throw new Error('Only spatial source modules may be exported.');
  if (cache.has(file)) return cache.get(file);
  const mod = { exports: {} }; cache.set(file, mod.exports);
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  new Function('require', 'module', 'exports', js)(id => load(id), mod, mod.exports);
  return mod.exports;
}
const f = load('floor'), shell = load('envelope'), capacity = load('capacity'), kit = load('equipment');
const opening = load('day-one-floor').DAY_ONE_FLOOR;
const board = path.resolve(app, '../../docs/loopforge/game-design');
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const rect = (r, attrs) => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" ${attrs}/>`;
const points = shell.BUILDING_OUTLINE.map(p => `${p.x},${p.y}`).join(' ');
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1040" viewBox="0 0 1200 1040" role="img" aria-labelledby="title desc">
<title id="title">Loopforge — continuous first-floor plan</title>
<desc id="desc">Top-down measured design plan, north up. Nine repacked zones fill one building with narrow pipe walls around Brewery and Cortex. Every hall has a fifteen-metre structural height. An eight-metre corridor links Security to Theatre. The six managed rooms are Security, Lattice Forge, Burn-in Theatre, Substrate Brewery, Weaving Gallery and Cortex Assembly. Only Security and Lattice Forge are open on turn one. Gold thresholds mark fourteen connections, including the new Security to Theatre corridor. Dashed plots are clear construction reserves; copper marks are prototype machinery. Pipe walls do not grant extra access.</desc>
<defs><pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M8 0H0V8" fill="none" stroke="#70857c" stroke-opacity=".17" stroke-width=".2"/></pattern><pattern id="service" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#34352b"/><path d="M-1 1L1 -1M0 3L3 0M2 4L4 2" stroke="#777151" stroke-width=".18"/></pattern></defs>
<rect width="1200" height="1040" fill="#101b19"/><rect x="24" y="24" width="1152" height="992" fill="none" stroke="#596157"/>
<g font-family="system-ui,sans-serif"><text x="60" y="63" fill="#b5a678" font-size="13" letter-spacing="3">LOOPFORGE / FLOOR 01 / SPATIAL DESIGN</text><text x="60" y="103" fill="#eee2bd" font-size="30" font-weight="650">One factory. Six production rooms.</text><text x="60" y="133" fill="#aab9ad" font-size="15">Repacked rooms · all halls ${f.FIRST_FLOOR_HEIGHT} m high · north up · one design tile ≈ one metre</text>
<path d="M1117 110V65M1110 77L1117 65L1124 77" fill="none" stroke="#dfcf9e" stroke-width="2"/><text x="1117" y="51" fill="#dfcf9e" font-size="13" text-anchor="middle">N</text></g>
<g transform="translate(72 153) scale(3.72)">
<rect width="280" height="200" fill="url(#grid)"/>
<polygon points="${points}" fill="url(#service)" stroke="#d0b675" stroke-width="1" stroke-linejoin="miter"/>
`;
for (const z of f.ZONES) {
  const open = f.accessible(z.id, f.INITIAL_UNLOCKED);
  svg += rect(z.rect, `fill="${z.kind === 'support' ? '#27342f' : open ? '#29453b' : '#1a2928'}" stroke="#8b9d86" stroke-width=".45"`);
}
for (const q of capacity.CONSTRUCTION_RESERVES) svg += rect(q.rect, 'fill="#365b4926" stroke="#6c9b83" stroke-width=".35" stroke-dasharray="1.4 1"');
for (const q of capacity.DELIVERY_AISLES) svg += rect(q.rect, 'fill="#c0a96e16" stroke="#af9c66" stroke-width=".22" stroke-dasharray="2 1"');
for (const q of kit.EQUIPMENT_STUDY.filter(q => !['security','conveyor'].includes(q.room))) svg += `<g><title>${escape(q.name)}</title>${rect(q.footprint, 'fill="#976c40" stroke="#c99f65" stroke-width=".2"')}</g>`;
for (const p of f.PORTALS) svg += `<g><title>${escape(p.id)} — ${f.portalOpen(p, f.INITIAL_UNLOCKED) ? 'open' : 'sealed'}</title>${rect(f.portalRect(p), `fill="${f.portalOpen(p, f.INITIAL_UNLOCKED) ? '#e3c46f' : '#8f7b53'}" stroke="#e3c46f" stroke-width=".2"`)}</g>`;
const corridor=f.PORTALS.find(p=>p.id==='security-theatre');
svg += `<text x="${(corridor.start.x+corridor.end.x)/2}" y="${corridor.start.y+5.1}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="3" fill="#fff1c1">SECURITY ↔ THEATRE</text>`;
// Labels sit clear of equipment and reserve outlines. Units remain in each room.
for (const z of f.ZONES) {
  const r = z.rect;
  const x = r.x + 1.6, y = r.y + 4.3;
  svg += `<g font-family="system-ui,sans-serif" stroke="#11201d" stroke-width=".8" paint-order="stroke" stroke-linejoin="round"><text x="${x}" y="${y}" font-size="2.7" fill="#fff0c9">${escape(z.short.toUpperCase())}</text><text x="${x}" y="${y+3.6}" font-size="2.45" fill="#c3d6c8">${r.w} × ${r.h} m · ${z.kind==='support'?'SUPPORT':f.INITIAL_UNLOCKED.includes(z.id)?'DAY 1':'SEALED'}</text></g>`;
}
for (const q of opening.fixtures) svg += `<g><title>${escape(q.name)}</title>${rect(q.rect,'fill="#f7b274" stroke="#4d382d" stroke-width=".18"')}</g>`;
svg += `<polyline points="${opening.egress.map(p=>p.join(',')).join(' ')}" fill="none" stroke="#8edac3" stroke-width=".65" stroke-dasharray="1.5 1"/><path d="M70 128h5" stroke="#8edac3" stroke-width="1.5"/><text x="69" y="134" text-anchor="end" font-family="system-ui,sans-serif" font-size="3.4" fill="#a3e5cf">STAFF ENTRANCE / EXIT</text>`;
svg += `</g><g font-family="system-ui,sans-serif"><path d="M72 924H221M72 919V929M146.5 919V929M221 919V929" stroke="#d2bf88" stroke-width="2"/><text x="72" y="947" fill="#b9c7b9" font-size="13">0</text><text x="139" y="947" fill="#b9c7b9" font-size="13">20</text><text x="206" y="947" fill="#b9c7b9" font-size="13">40 m</text>
<rect x="310" y="918" width="14" height="14" fill="#29453b" stroke="#8b9d86"/><text x="333" y="930" font-size="14" fill="#c2ccbf">Opening rooms</text><rect x="510" y="918" width="14" height="14" fill="#1a2928" stroke="#8b9d86"/><text x="533" y="930" font-size="14" fill="#c2ccbf">Sealed wing</text><rect x="686" y="918" width="14" height="14" fill="url(#service)"/><text x="709" y="930" font-size="14" fill="#c2ccbf">Pipe walls</text><rect x="880" y="918" width="20" height="10" fill="#b29a62"/><text x="909" y="930" font-size="14" fill="#c2ccbf">Door / passage</text>
<rect x="310" y="952" width="14" height="14" fill="none" stroke="#6c9b83" stroke-dasharray="3 2"/><text x="333" y="964" font-size="14" fill="#c2ccbf">Construction reserve</text><rect x="560" y="952" width="14" height="14" fill="#976c40"/><text x="583" y="964" font-size="14" fill="#c2ccbf">Working footprint</text><text x="835" y="964" font-size="14" fill="#aab9ad">${shell.BUILDING_AREA.toLocaleString('en-US')} m² enclosed footprint</text>
<text x="60" y="996" font-size="12" fill="#879b8f">${escape(f.FLOOR_VERSION)} · ${f.PORTALS.length} connections · Security–Theatre corridor sealed until Theatre opens · staff entrance on the south Lobby wall</text></g></svg>\n`;
const hash = createHash('sha256').update(svg).digest('hex').slice(0,12);
const filename = `factory-floor-plan.${hash}.svg`;
const metadata = { version: f.FLOOR_VERSION, src: '/loopforge-design/'+filename, width:1200, height:1040, buildingArea:shell.BUILDING_AREA, serviceArea:shell.SERVICE_AREA, pipeWallArea:shell.PIPE_WALL_AREA, hallHeight:f.FIRST_FLOOR_HEIGHT, connections:f.PORTALS.length };
const outputs = new Map([
  [path.resolve(app,'../../docs/loopforge/maps/factory-floor-plan.svg'),svg],
  [path.resolve(app,'../../docs/loopforge/game-design/factory-floor-plan.json'),JSON.stringify(metadata,null,2)+'\n'],
  [path.join(app,'public/loopforge-design',filename),svg],
  [path.join(board,'day-one-geometry.json'), JSON.stringify({ ...opening, zones: f.ZONES, portals: f.PORTALS.map(p=>({id:p.id,rect:f.portalRect(p)})), reserves: capacity.CONSTRUCTION_RESERVES, aisles: capacity.DELIVERY_AISLES })+'\n'],
]);
const check = process.argv.includes('--check');
for(const [file,content] of outputs){
  if(check){if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==content) throw new Error(`Stale floor plan: run npm run floor-plan:build (${file})`);}
  else {fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content);}
}
console.log(`${check?'Verified':'Exported'} ${f.FLOOR_VERSION}: ${shell.BUILDING_AREA} m² envelope, ${shell.SERVICE_AREA} m² service infill; ${filename}`);
