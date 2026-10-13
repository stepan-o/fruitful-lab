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
    <p>The lobby painting above is the reference, not a screenshot of the current 3D study. The first hybrid kit keeps its bureaucratic clutter and pools of dirty gold light while letting workers and furniture occupy real space.</p>
    <ol className={styles.flow}>
      {layers.map(([number,title,body])=><li key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></li>)}
    </ol>
    <div className={styles.materials}>
      {surfaces.map(([title,objects,reason])=><article key={title}><h3>{title}</h3><p>{objects}</p><small>{reason}</small></article>)}
    </div>
    <p className={styles.status}><strong>Current:</strong> shared spatial data, five native claim desks, authored lobby surfaces, staged clerk animation and a removable feeder. The image pack uses immutable CDN delivery. <strong>Next:</strong> reconcile physical scale, readable work areas, grain and animation before extending the kit. Worker wages and pay claims are design direction, not implemented economy.</p>
    <h2>Before the next build: scale, grain and motion</h2>
    <p>The large halls stay. Default observation goes through the producer console: one selected room, three authored CCTV angles. Focused workspaces let the player adjust flow and commit decisions, then return to see the consequences. One simulation and renderer serve those views within a shared budget. Shape, material wear and camera grain remain separate; visual identity, agency and sustained performance must pass together.</p>
    <p><Link href="/stepanoskin/loopforge/design#floor-scale" prefetch={false}>Review the factory-floor design pass →</Link></p>
    <h2>LIMEN’s blade: identity in the dark</h2>
    <p>The blade must identify LIMEN at normal CCTV size, before a name or portrait does. Keep its asymmetric cyan edge and controlled braid motion; simplify tiny sparks and extra light as the feed gets smaller. Test it beside workers and machinery under ordinary, dark and alarm lighting, with correct occlusion and no hidden-stat cues.</p>
    <p><strong>Production review:</strong> v2 body, 4,994-triangle housing and a 672-triangle core with turquoise/ice-blue braids. An 11-second authored idle lifts the emitter, cuts the current, adjusts it and reignites. Nine joint tracks are baked offline; the browser interpolates poses and drives power from the same seekable clock. No runtime IK or new lights. <strong>Next:</strong> contact poses, action-driven sparks/trails and measured crowd recognition/performance. Two temporary app-hosted GLBs total 5.49 MB; private masters stay in S3.</p>
    <p><Link href="/stepanoskin/loopforge/play/asset-review" prefetch={false}>Open the production asset player →</Link> · <Link href="/stepanoskin/loopforge/design#agents" prefetch={false}>Review the character identity and acceptance gate →</Link> · <a href="/loopforge-design/LIMEN_BLADE_DESIGN.md">Full blade implementation checklist ↗</a></p>
    <h2>From artwork to a reusable desk</h2>
    <p>Reference sheet → modeled parts → aligned material maps → attachment points and animation → validated export → in-engine inspection → immutable release. The first native kit now demonstrates five desks, two seated clerks and a swappable feeder. Inspect the desk close up, orbit it and compare the hall with the original artwork.</p>
    <p>After the scale calibration, the engineering plan covers a typed model/texture manifest, prefab validation, a compatible Babylon loader, reproducible export tools and an inspection scene. Image generation can supply surface artwork; clean geometry, matching material maps and reliable worker contact need controlled authoring. We can begin with the existing concept art.</p>
    <h2>Babylon in practice</h2>
    <p>Three running-demo screenshots captured on 10 October 2026. Each answers a different production question. They are reference figures, not Loopforge assets or performance benchmarks.</p>
    <div className={styles.gallery}>{demos.map((demo,index)=><article key={demo.id}>
      <Art id={demo.id} asset={imageAsset(referenceAssets,demo.id)} caption={`${demo.title} — ${demo.by} · external Babylon demo screenshot`} sizes={index === 0 ? '(max-width: 800px) 90vw, 900px' : '(max-width: 750px) 90vw, (max-width: 1100px) 38vw, 450px'} />
      <h3>{demo.title}</h3><small>{demo.by}</small><p>{demo.lesson}</p>
      <a href={demo.url} target="_blank" rel="noreferrer">Open live demo ↗</a>
    </article>)}</div>
    <p className={styles.status}>For a richer cinematic example, see <a href="https://editor.babylonjs.com/experiments/mansion" target="_blank" rel="noreferrer">Mansion by Julien Moreau / Babylon.js Editor</a>: staged light, authored surfaces and deliberate framing. Its desktop-oriented 4K textures and advanced effects are not our mobile budget. The <a href="https://www.babylonjs.com/community/" target="_blank" rel="noreferrer">official community gallery</a> provides more examples. Verify each technique in our pinned Babylon version; Loopforge’s concept art remains the artistic authority.</p>
    <nav className={styles.links} aria-label="Webview design records">
      <a href="/loopforge-design/FACTORY_FLOOR_VISUAL_SCALE_PLAN.md">Scale, grain & motion build plan ↗</a>
      <a href="/loopforge-design/WEBVIEW_RENDERING_AND_ASSETS.md">Rendering & delivery contract ↗</a>
      <a href="/loopforge-design/LOBBY_ART_DIRECTION.md">Lobby art brief ↗</a>
      <a href="/loopforge-design/ASSET_PREFAB_PIPELINE.md">Asset & prefab production plan ↗</a>
      <Link href="/stepanoskin/loopforge/play/factory-floor" prefetch={false}>Factory floor ↗</Link>
    </nav>
  </section>;
}
