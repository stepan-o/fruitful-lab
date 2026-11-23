/** Presentation preferences never alter simulation, cast identity or action timing. */
export type GraphicsContext = 'showcase' | 'room' | 'overview';
export type GraphicsPreset = 'auto' | 'performance' | 'balanced' | 'high' | 'custom';
export type GraphicsSettings = Readonly<{
 version: 1; preset: GraphicsPreset; targetFps: 30 | 60;
 resolution: 'auto' | 0.5 | 0.65 | 0.75 | 0.85 | 1;
 shadows: 'off' | 'low' | 'full'; bloom: boolean; antialias: boolean;
}>;
export const DEFAULT_GRAPHICS: GraphicsSettings = {version:1,preset:'auto',targetFps:30,resolution:'auto',shadows:'full',bloom:true,antialias:true};
export const REFERENCE_GRAPHICS: GraphicsSettings = {...DEFAULT_GRAPHICS,preset:'high',targetFps:60,resolution:1};
export function presetSettings(preset:GraphicsPreset,targetFps:30|60=30):GraphicsSettings {
 const base={...DEFAULT_GRAPHICS,preset,targetFps};
 if(preset==='performance')return {...base,resolution:0.65,shadows:'off',bloom:false};
 if(preset==='balanced')return {...base,resolution:0.85,shadows:'low'};
 if(preset==='high')return {...base,resolution:1};
 return base;
}
export function parseGraphics(value:unknown):GraphicsSettings {
 if(!value||typeof value!=='object')return DEFAULT_GRAPHICS;
 const s=value as Partial<GraphicsSettings>;
 if(s.version!==1||!['auto','performance','balanced','high','custom'].includes(String(s.preset))||![30,60].includes(s.targetFps as number)||!['auto',.5,.65,.75,.85,1].includes(s.resolution!)||!['off','low','full'].includes(String(s.shadows))||typeof s.bloom!=='boolean'||typeof s.antialias!=='boolean')return DEFAULT_GRAPHICS;
 return {version:1,preset:s.preset!,targetFps:s.targetFps!,resolution:s.resolution!,shadows:s.shadows!,bloom:s.bloom,antialias:s.antialias};
}
export function resolveGraphics(s:GraphicsSettings,context:GraphicsContext){
 const automatic=s.preset==='auto';
 return {targetFps:s.targetFps,adaptive:s.resolution==='auto',
  scale:s.resolution==='auto'?(context==='showcase'?1:context==='overview'?.65:.85):s.resolution,
  shadows:automatic?(context==='showcase'?'full':context==='overview'?'off':'low'):s.shadows,
  bloom:automatic?context!=='overview':s.bloom,antialias:s.antialias} as const;
}
/** Slow adaptation with headroom before recovery. Fixed resolution is never overridden. */
export function createResolutionGovernor(initial:number,ceiling:number){
 let scale=initial,slow=0,fast=0;
 return {sample(workMs:number,targetFps:number){
  const budget=1000/targetFps;
  slow=workMs>budget*.95?slow+1:0;fast=workMs<budget*.65?fast+1:0;
  if(slow>=3){scale=Math.max(.5,Math.round((scale-.1)*100)/100);slow=fast=0;}
  else if(fast>=10){scale=Math.min(ceiling,Math.round((scale+.05)*100)/100);slow=fast=0;}
  return scale;
 }};
}
