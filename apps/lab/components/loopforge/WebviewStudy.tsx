import styles from './webview-study.module.css';
import Art from './Art';
import Link from 'next/link';
import manifest from '@/lib/assets/generated/loopforge-webview-references.json';
import { imageAsset, parseManifest } from '@/lib/assets/types';

const referenceAssets = parseManifest(manifest, 'loopforge-webview-references');
const demos = [
  {id:'espilit',title:'Glowing Espilit',by:'Michel Rousseau',url:'https://www.babylonjs.com/Demos/GlowingEspilit/',lesson:'The lighting reference: an interior gains depth from steady illumination and contact shadows. Borrow the baked-lighting approach; keep Loopforge’s own worn industrial palette.'},
  {id:'helmet',title:'Flight Helmet',by:'Patrick Ryan',url:'https://www.babylonjs.com/Demos/FlightHelmet/',lesson:'The material reference: leather, metal, glass and hose read as different surfaces. Our desks need this distinction between enamel, brass, paper and screen glass.'},
  {id:'v8',title:'V8 Engine',by:'Michel Rousseau',url:'https://www.babylonjs.com/Demos/V8/',lesson:'The mechanical reference: connected parts move coherently. Apply that clarity to a stamp or paper feeder. This older demo’s finish is not the lobby’s artistic target.'},
] as const;

const layers = [
  ['01', 'World truth', 'Workers, hours, claims and payments belong to simulation records.'],
  ['02', 'Permitted view', 'Versioned facts and events cross the kernel–viewer boundary.'],
  ['03', 'Visible factory', 'Babylon draws bodies, desks, queues, light and motion. React handles decisions.'],
] as const;
const surfaces = [
  ['Real geometry', 'Desk bodies, stools, lamps, doorway, large pipes and robots.', 'Silhouette, parallax, contact and moving shadows.'],
  ['Painted surfaces', 'Clipped forms, wall wear, fine conduits, floor emblem and scratches.', 'Illustrated density on surfaces fixed in the world.'],
  ['Shallow relief', 'Panel seams, rivets, grille recesses and worn edges.', 'Normal and roughness maps catch light without thousands of parts.'],
  ['Living details', 'Writing hands, feeding paper, CRT response and queue movement.', 'Small animations follow actual task states; payment needs a committed event.'],
] as const;

/** Server-rendered explanation; the reader does not load the factory renderer. */
export default function WebviewStudy() {
  return <section className={styles.study} aria-labelledby="webview-study-title">
    <p className={styles.kicker}>RENDERING DIRECTION · LOBBY CALIBRATION</p>
    <h2 id="webview-study-title">Build depth. Paint character. Animate consequence.</h2>
    <p>The lobby painting above is the reference, not a screenshot of the current 3D study. The proposed hybrid keeps its bureaucratic clutter and pools of dirty gold light while letting workers and furniture occupy real space.</p>
    <ol className={styles.flow}>
      {layers.map(([number,title,body])=><li key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></li>)}
    </ol>
    <div className={styles.materials}>
      {surfaces.map(([title,objects,reason])=><article key={title}><h3>{title}</h3><p>{objects}</p><small>{reason}</small></article>)}
    </div>
    <p className={styles.status}><strong>Current:</strong> shared spatial data, procedural Babylon study, immutable image packs and CDN delivery. <strong>Next:</strong> lobby materials, reusable desk models, baked lighting and a typed model/texture asset extension. Worker wages and pay claims are design direction, not implemented economy.</p>
    <h2>From artwork to a reusable desk</h2>
    <p>Reference sheet → modeled parts → aligned material maps → attachment points and animation → validated export → in-engine inspection → immutable release. The first package should prove two instances of one desk, a seated worker and a swappable attachment.</p>
    <p>The engineering work is a typed model/texture manifest, prefab validation, a compatible Babylon loader, reproducible export tools and an inspection scene. Image generation can supply surface artwork; clean geometry, matching material maps and reliable worker contact need controlled authoring. We can begin with the existing concept art.</p>
    <h2>Babylon in practice</h2>
    <p>Three running-demo screenshots captured on 10 October 2026. Each answers a different production question. They are reference figures, not Loopforge assets or performance benchmarks.</p>
    <div className={styles.gallery}>{demos.map((demo,index)=><article key={demo.id}>
      <Art id={demo.id} asset={imageAsset(referenceAssets,demo.id)} caption={`${demo.title} — ${demo.by} · external Babylon demo screenshot`} sizes={index === 0 ? '(max-width: 800px) 90vw, 900px' : '(max-width: 750px) 90vw, (max-width: 1100px) 38vw, 450px'} />
      <h3>{demo.title}</h3><small>{demo.by}</small><p>{demo.lesson}</p>
      <a href={demo.url} target="_blank" rel="noreferrer">Open live demo ↗</a>
    </article>)}</div>
    <p className={styles.status}>For a richer cinematic example, see <a href="https://editor.babylonjs.com/experiments/mansion" target="_blank" rel="noreferrer">Mansion by Julien Moreau / Babylon.js Editor</a>: staged light, authored surfaces and deliberate framing. Its desktop-oriented 4K textures and advanced effects are not our mobile budget. The <a href="https://www.babylonjs.com/community/" target="_blank" rel="noreferrer">official community gallery</a> provides more examples. Verify each technique in our pinned Babylon version; Loopforge’s concept art remains the artistic authority.</p>
    <nav className={styles.links} aria-label="Webview design records">
      <a href="/loopforge-design/WEBVIEW_RENDERING_AND_ASSETS.md">Rendering & delivery contract ↗</a>
      <a href="/loopforge-design/LOBBY_ART_DIRECTION.md">Lobby art brief ↗</a>
      <a href="/loopforge-design/ASSET_PREFAB_PIPELINE.md">Asset & prefab production plan ↗</a>
      <Link href="/stepanoskin/loopforge/play/factory-study" prefetch={false}>Current factory study ↗</Link>
    </nav>
  </section>;
}
