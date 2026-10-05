/** Small point-light study for Fig. 02; all geometry and keyframes are emitted
 * on the server. Parallel caster/receiver planes preserve a simple homothety.
 */
export const operatorLamp = { x: 222, y: 200, casterDepth: 50, receiverDepth: 70 };
export const shadowMagnification = operatorLamp.receiverDepth / operatorLamp.casterDepth;
export const candleFrames = [
  { at: 0, x: 0, y: 0, intensity: .86 },
  { at: 13, x: 2.6, y: -1.1, intensity: .97 },
  { at: 29, x: -1.7, y: .8, intensity: .77 },
  { at: 41, x: .9, y: -1.6, intensity: 1 },
  { at: 58, x: -3.2, y: .3, intensity: .83 },
  { at: 73, x: 1.8, y: -1.2, intensity: .94 },
  { at: 87, x: -.6, y: .6, intensity: .8 },
  { at: 100, x: 0, y: 0, intensity: .86 },
];
const n = (value: number) => Math.round(value * 1000) / 1000;
export function shadowDisplacement(x: number, y: number) {
  const response = 1 - shadowMagnification;
  return { x: n(response * x), y: n(response * y) };
}
export function projectOperatorShadow(point: { x: number; y: number }, source: { x: number; y: number } = operatorLamp) {
  return {
    x: source.x + shadowMagnification * (point.x - source.x),
    y: source.y + shadowMagnification * (point.y - source.y),
  };
}
export const operatorShadowTransform = `translate(${n((1-shadowMagnification)*operatorLamp.x)} ${n((1-shadowMagnification)*operatorLamp.y)}) scale(${shadowMagnification})`;
export function operatorLightKeyframes(id: string) {
  const translate = (x: number, y: number) => `translate(${n(x)}px,${n(y)}px)`;
  const frames = (shadow: boolean) => candleFrames.map(frame => {
    const delta = shadow ? shadowDisplacement(frame.x, frame.y) : frame;
    return `${frame.at}%{transform:${translate(delta.x,delta.y)};opacity:${n(shadow ? .3 + (frame.intensity-.77)*.46 : frame.intensity)}}`;
  }).join("");
  // The same times and easing make the inverse source/shadow relation hold
  // between keyframes as well as at them. The flame, pools and silhouette agree.
  return `@keyframes ${id}-candle{${frames(false)}}@keyframes ${id}-shadow{${frames(true)}}`;
}
