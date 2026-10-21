/** Stable review identities; binary revisions remain in immutable asset manifests. */
export type ProductionReviewAsset={id:string;title:string;shortName:string;navDetail:string;revision:string;route:string;conceptRoute:string;status:string;description:string;checks:readonly string[]};
export const limenReviewAsset:ProductionReviewAsset={
 id:'limen-assembly',shortName:'LIMEN',navDetail:'17 source motions · cyan emitter',title:'LIMEN · character, emitter & motions',revision:'body-v2 / source-motions-2026-10-19 / energy-v2',route:'/stepanoskin/loopforge/play/agent-test/limen',conceptRoute:'/stepanoskin/loopforge/design#agents',status:'Source motion review · approved assembly retained',description:'Compare 17 new source motions and their articulated finger rig with the accepted idle, walk and run assembly. Inspect the cyan emitter under factory lighting before accepting new contacts.',checks:['Body and rig comparison','17 source motions and attachment','Three CCTV angles','Reduced effects and performance']
};
export const workerReviewAsset:ProductionReviewAsset={
 id:'worker-01-motions',shortName:'Workers',navDetail:'10 characters · motion fitting',title:'The opening workers · bodies & motion',revision:'opening-cast / motion-transfer-v1',
 route:'/stepanoskin/loopforge/play/asset-review/worker',conceptRoute:'/loopforge-design/narrative-cast.html',
 status:'Ten rigged candidates · contact fitting underway',
 description:'Inspect bob, sam, ed, jo, gus, max, mae, kit, lou and ben with 22 clips each and three body detail levels. The accepted Worker 01 bank remains available as a separate source reference.',
 checks:['Distinct silhouettes and body materials','All motion clips on each worker','Portrait, floor and console detail','Per-character contacts, transitions and device review']
};
export const stilettoReviewAsset:ProductionReviewAsset={
 id:'stiletto-blades',shortName:'STILETTO',navDetail:'Blades · welders · red visor',title:'STILETTO · interchangeable forearms',revision:'body-v1 / blades-v4 / welders-v1 / visor-v3',
 route:'/stepanoskin/loopforge/play/asset-review/stiletto',conceptRoute:'/stepanoskin/loopforge/design#agents',status:'Blades accepted · welder/effects review',
 description:'Twin blades, twin welders or mixed forearms on the existing motion bank. Blue-white welder flames and a red visor with its descending centre seam are switchable. Original blade audits remain separate from module review.',
 checks:['Original / corrected at the same timestamp','2,335 corrected poses checked at 120 Hz','Blade, body and flat-floor review','Remaining leg contacts, blends and paired encounters']
};
export const cathexisReviewAsset:ProductionReviewAsset={
 id:'cathexis-intake',shortName:'CATHEXIS',navDetail:'4 motions · Grace',title:'CATHEXIS · motion & mask review',revision:'body-v2 / motion-v1 / Grace coverage-v2',
 route:'/stepanoskin/loopforge/play/asset-review/cathexis',conceptRoute:'/stepanoskin/loopforge/design?model=cathexis#model-briefs',status:'4 motions approved',
 description:'Compare four approved corrected motions with their original exports: Hot Walk, Happy Sway, Mirror Viewing and Red Carpet Walk. Inspect full/half Grace over the intact mechanical face.',
 checks:['Original/corrected at the same pose','3,505 corrected skirt/leg samples at 120 Hz','Grounding, loop seam and CCTV readability','Grace fit approved; blends and paired contacts remain open']
};
export const productionReviewAssets:readonly ProductionReviewAsset[]=[workerReviewAsset,limenReviewAsset,stilettoReviewAsset,cathexisReviewAsset];
