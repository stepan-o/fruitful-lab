/** Approved cast palette; applied at render time without changing the source GLB. */
export const LIMEN_PALETTE = { steel: '#AAB9BD', accent: '#08798B', strength: 100 } as const;
export type LimenPalette = 'approved' | 'source';
