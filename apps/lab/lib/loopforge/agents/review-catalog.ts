/** Stable review identities; binary revisions remain in immutable asset manifests. */
export type ProductionReviewAsset={id:string;title:string;shortName:string;navDetail:string;revision:string;route:string;conceptRoute:string;status:string;description:string;checks:readonly string[]};
export const limenReviewAsset:ProductionReviewAsset={
 id:'limen-assembly',shortName:'LIMEN',navDetail:'Emitter · idle · energy',title:'LIMEN · body & forearm emitter',revision:'body-v2 / emitter-v1 / idle-v1 / energy-v2',route:'/stepanoskin/loopforge/play/agent-test/limen',conceptRoute:'/stepanoskin/loopforge/design#agents',status:'Owner review · new idle and energy pass',description:'The accepted Meshy body and separate emitter, with an authored maintenance idle and procedural cyan current. Review the complete assembly under real factory lighting.',checks:['Silhouette and concept match','Idle / walk / run and attachment','Three CCTV angles','Reduced effects and performance']
};
export const workerReviewAsset:ProductionReviewAsset={
 id:'worker-01-motions',shortName:'Worker 01',navDetail:'19 motions · gait checks',title:'Worker 01 · motion bank',revision:'worker-01 / 19 motions / review-v1',
 route:'/stepanoskin/loopforge/play/asset-review/worker',conceptRoute:'/stepanoskin/loopforge/design#agents',
 status:'Owner review · motion and clearance candidates',
 description:'All 19 exported motions on one rig, including the new Idle and Injured Walk. Hot Walk is reserved for Cathexis, previewed here on the worker stand-in.',
 checks:['Pause, scrub and jump to contact candidates','Idle, locomotion, reactions and gestures','Hot Walk · Cathexis default gait','Factory lighting and three CCTV angles']
};
export const stilettoReviewAsset:ProductionReviewAsset={
 id:'stiletto-blades',shortName:'STILETTO',navDetail:'Twin blades · clearance checks',title:'STILETTO · twin-blade motion',revision:'body-v1 / twin blades / corrected arms v4',
 route:'/stepanoskin/loopforge/play/asset-review/stiletto',conceptRoute:'/stepanoskin/loopforge/design#agents',status:'Owner review · five corrected candidates',
 description:'18 source motions and five corrected arm alternatives on the same body and rigid blades. Compare the same pose, inspect sampled collisions and keep outstanding gait issues visible.',
 checks:['Original / corrected at the same timestamp','2,335 corrected poses checked at 120 Hz','Blade, body and flat-floor review','Remaining leg contacts and choreography acceptance']
};
export const productionReviewAssets:readonly ProductionReviewAsset[]=[limenReviewAsset,workerReviewAsset,stilettoReviewAsset];
