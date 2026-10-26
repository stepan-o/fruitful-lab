import {worldPoint} from '../spatial/floor';
/** Shared geometry for the Forge cycle control and Max's hand target.
 * The existing stop button and indicator keep their distinct meanings. */
export const MAX_FORGE_CYCLE_CONTROL={
 plan:[148.5,105.30] as const,
 size:[.13,.08,.13] as const,
 centerHeight:.95,
 topHeight:.99,
} as const;
export function maxForgeControlTop():[number,number,number]{
 const [x,,z]=worldPoint(...MAX_FORGE_CYCLE_CONTROL.plan);
 return [x,MAX_FORGE_CYCLE_CONTROL.topHeight,z];
}

/** Shared dimensions for the actual Forge operator furniture. */
export const MAX_FORGE_FURNITURE = [
 {name:'Operator pedestal',size:[.45,.8,.5] as [number,number,number],plan:[148.5,105.05] as const,height:.4,material:'iron'},
 {name:'Control deck',size:[.72,.13,.65] as [number,number,number],plan:[148.5,105.05] as const,height:.86,material:'edge'},
 {name:'Control ready lamp',size:[.16,.035,.12] as [number,number,number],plan:[148.5-.19,105.16] as const,height:.94,material:'glow'},
 {name:'Guarded stop button',size:[.13,.08,.13] as [number,number,number],plan:[148.5+.16,105.16] as const,height:.95,material:'black'},
] as const;
