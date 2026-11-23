import { beltShadowMatrix, cabinetCaster, conveyorCaster, doorCaster, floorShadow, keySamples, planeOffset, polygon, project } from "@/lib/production-systems/turk-lighting";
import motion from "./turk-conveyor.module.css";

/** Small, fixed penumbra samples; no blur, filter, raster or frame-loop work. */
export function GroundShadows() {
  return <g data-lighting="projected-area-key" fill="#574e3e" stroke="none">
    {keySamples.map((ray, i) => <path key={i} d={floorShadow(cabinetCaster, ray) + floorShadow(conveyorCaster, ray) + floorShadow(doorCaster, ray)} opacity=".023" />)}
    {[{ x: 158, depth: 0 }, { x: 559, depth: 0 }, { x: 559, depth: 64 }].map((foot, i) => <g key={i}>
      {[{ r: 10, opacity: .08 }, { r: 7, opacity: .16 }].map(({ r, opacity }) => <path key={r} opacity={opacity} d={polygon(Array.from({ length: 24 }, (_, j) => {
        const a = j * Math.PI / 12;
        return project({ x: foot.x + Math.cos(a)*r, depth: foot.depth + Math.sin(a)*r*.44, height: 0 });
      }))} />)}
    </g>)}
  </g>;
}

/** The overhang shades the face and recessed wall at their actual depths.
 * Each caster projects with the same source; masks only decide which surface
 * receives the result.
 */
export function OverhangShadow({ depth = 0 }: { depth?: number }) {
  return <g data-lighting="overhang" fill="#241f1a" stroke="none">
    {keySamples.map((ray, i) => {
      const p = planeOffset(-3, depth, ray);
      return <path key={i} transform={`translate(${p.x} ${p.y})`} d="M32 314H591.05V350H32Z" opacity=".043" />;
    })}
  </g>;
}

export function BeltHandShadows() {
  return <g clipPath="url(#turk-lit-belt)" fill="#36352a" stroke="none" opacity=".18" data-lighting="hands-on-belt">
    {[{ depth: 54, clip: "left", moving: false }, { depth: 26, clip: "working", moving: true }].map(({ depth, clip, moving }) =>
      <g key={clip} transform={beltShadowMatrix(depth)}>
        <g clipPath={`url(#turk-above-belt-${clip})`}>
          <g transform="translate(168 21) scale(.75)">
            <g className={moving ? motion.hand : undefined} clipPath={`url(#turk-${clip}-hand)`}><use href="#turk-figure-outline" /></g>
          </g>
        </g>
      </g>)}
  </g>;
}
