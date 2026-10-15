/** Stable review identities; binary revisions remain in immutable asset manifests. */
export type ProductionReviewAsset={id:string;title:string;shortName:string;navDetail:string;revision:string;route:string;conceptRoute:string;status:string;description:string;checks:readonly string[]};
export const limenReviewAsset:ProductionReviewAsset={
 id:'limen-assembly',shortName:'LIMEN',navDetail:'Emitter · idle · energy',title:'LIMEN · body & forearm emitter',revision:'body-v2 / emitter-v1 / idle-v1 / energy-v2',route:'/stepanoskin/loopforge/play/agent-test/limen',conceptRoute:'/stepanoskin/loopforge/design#agents',status:'Owner review · new idle and energy pass',description:'The accepted Meshy body and separate emitter, with an authored maintenance idle and procedural cyan current. Review the complete assembly under real factory lighting.',checks:['Silhouette and concept match','Idle / walk / run and attachment','Three CCTV angles','Reduced effects and performance']
};
export const workerReviewAsset:ProductionReviewAsset={
 id:'worker-01-motions',shortName:'Worker 01',navDetail:'19 motions · gait checks',title:'Worker 01 · motion bank',revision:'worker-01 / 19 motions / review-v1',
 route:'/stepanoskin/loopforge/play/asset-review/worker',conceptRoute:'/stepanoskin/loopforge/design#agents',
 status:'Audited · motion corrections pending',
 description:'All 19 exported motions on one rig, including the new Idle and Injured Walk. Hot Walk is reserved for Cathexis, previewed here on the worker stand-in.',
 checks:['Pause, scrub and jump to contact candidates','Idle, locomotion, reactions and gestures','Hot Walk · Cathexis default gait','Factory lighting and three CCTV angles']
};
export const stilettoReviewAsset:ProductionReviewAsset={
 id:'stiletto-blades',shortName:'STILETTO',navDetail:'Blades · welders · red visor',title:'STILETTO · interchangeable forearms',revision:'body-v1 / blades-v4 / welders-v1 / visor-v3',
 route:'/stepanoskin/loopforge/play/asset-review/stiletto',conceptRoute:'/stepanoskin/loopforge/design#agents',status:'Blades accepted · welder/effects review',
 description:'Twin blades, twin welders or mixed forearms on the existing motion bank. Blue-white welder flames and a red visor with its descending centre seam are switchable. Original blade audits remain separate from module review.',
 checks:['Original / corrected at the same timestamp','2,335 corrected poses checked at 120 Hz','Blade, body and flat-floor review','Remaining leg contacts, blends and paired encounters']
};
export const cathexisReviewAsset:ProductionReviewAsset={
 id:'cathexis-intake',shortName:'CATHEXIS',navDetail:'Hot Walk · sway · Grace',title:'CATHEXIS · motion & mask review',revision:'body-v2 / motion-v1 / Grace coverage-v2',
 route:'/stepanoskin/loopforge/play/asset-review/cathexis',conceptRoute:'/stepanoskin/loopforge/design?model=cathexis#model-briefs',status:'Body accepted · motion cleanup candidate',
 description:'Compare original/corrected Hot Walk and Happy Sway with skirt and foot inspection. Switch to static face fitting for full/half Grace over the intact mechanical face.',
 checks:['Original/corrected at the same pose','1,907 corrected skirt/leg samples at 120 Hz','Grounding, loop seam and CCTV readability','Moving Grace, blends and contacts remain open']
};
export const productionReviewAssets:readonly ProductionReviewAsset[]=[limenReviewAsset,workerReviewAsset,stilettoReviewAsset,cathexisReviewAsset];
