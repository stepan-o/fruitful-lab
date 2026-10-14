import type { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import type { Vector3 } from '@babylonjs/core/Maths/math.vector';

export type ReviewCameraAction = 'reset' | 'closer' | 'farther';
const defaults = { alpha: -Math.PI / 2, beta: 1.36, distance: 3.8 };
const clamp = (n: number) => Math.max(3.2, Math.min(7, n));

/** Inspection orbit is independent of fixed CCTV presets and animation time. */
export function createReviewOrbit(camera: ArcRotateCamera, canvas: HTMLCanvasElement, invalidate: () => void) {
  let pose = { ...defaults }, active = false, scale = 1;
  function capture() {
    if (active) pose = { alpha: camera.alpha, beta: camera.beta, distance: clamp(camera.radius / scale) };
  }
  function clearInertia() {
    camera.inertialAlphaOffset = camera.inertialBetaOffset = camera.inertialRadiusOffset = 0;
    camera.inertialPanningX = camera.inertialPanningY = 0;
  }
  function apply() {
    clearInertia();
    camera.alpha = pose.alpha; camera.beta = pose.beta; camera.radius = pose.distance * scale;
    invalidate();
  }
  return {
    suspend() {
      capture(); active = false; camera.detachControl(); clearInertia();
      camera.lowerBetaLimit = .52; camera.upperBetaLimit = 1.22;
      camera.lowerRadiusLimit = 3.5; camera.upperRadiusLimit = 1100;
      camera.panningSensibility = 130;
    },
    attach(target: Vector3) {
      scale = Math.max(1, .65 / (canvas.clientWidth / Math.max(1, canvas.clientHeight)));
      camera.lowerBetaLimit = .25; camera.upperBetaLimit = 1.65;
      camera.lowerRadiusLimit = 3.2 * scale; camera.upperRadiusLimit = 7 * scale;
      camera.panningSensibility = 0; // Keep the inspected subject as the orbit centre.
      camera.setTarget(target, false, true, true);
      apply(); camera.attachControl(canvas, false); active = true;
    },
    distance(n: number) { capture(); pose.distance = clamp(n); if (active) apply(); },
    action(action: ReviewCameraAction) {
      if (!active) return;
      capture();
      if (action === 'reset') pose = { ...defaults };
      else pose.distance = clamp(pose.distance * (action === 'closer' ? .88 : 1 / .88));
      apply();
    },
    snapshot() {
      capture();
      return { mode: active ? 'inspection' : 'fixed', alpha: camera.alpha, beta: camera.beta,
        radius: camera.radius, target: camera.target.asArray() };
    },
  };
}
