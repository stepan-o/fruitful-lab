/** Stable review identities; binary revisions remain in immutable asset manifests. */
export type ProductionReviewAsset={id:string;title:string;revision:string;route:string;conceptRoute:string;status:string;description:string;checks:readonly string[]};
export const limenReviewAsset:ProductionReviewAsset={
 id:'limen-assembly',title:'LIMEN · body & forearm emitter',revision:'body-v2 / emitter-v1 / idle-v1 / energy-v2',route:'/stepanoskin/loopforge/play/agent-test/limen',conceptRoute:'/stepanoskin/loopforge/design#agents',status:'Owner review · new idle and energy pass',description:'The accepted Meshy body and separate emitter, with an authored maintenance idle and procedural cyan current. Review the complete assembly under real factory lighting.',checks:['Silhouette and concept match','Idle / walk / run and attachment','Three CCTV angles','Reduced effects and performance']
};
export const workerReviewAsset:ProductionReviewAsset={
 id:'worker-01-motions',title:'Worker 01 · motion bank',revision:'worker-01 / 19 motions / review-v1',
 route:'/stepanoskin/loopforge/play/asset-review/worker',conceptRoute:'/stepanoskin/loopforge/design#agents',
 status:'Owner review · motion and clearance candidates',
 description:'All 19 exported motions on one rig, including the new Idle and Injured Walk. Hot Walk is reserved for Cathexis, previewed here on the worker stand-in.',
 checks:['Pause, scrub and jump to contact candidates','Idle, locomotion, reactions and gestures','Hot Walk · Cathexis default gait','Factory lighting and three CCTV angles']
};
export const productionReviewAssets:readonly ProductionReviewAsset[]=[limenReviewAsset,workerReviewAsset];
