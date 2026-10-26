import type {TransformNode} from '@babylonjs/core/Meshes/transformNode';
export type ForgePoseNode={p:number[];q:number[];s:number[]};
export type ForgeHierarchyNode={name:string;parent:number};
export type ForgeControlFrame={point:number[];normal:number[];forward:number[];handContactLocal:number[];handContactNormalLocal?:number[]};
export type ForgeInputs={hierarchy:ForgeHierarchyNode[];quietStart:ForgePoseNode[];quietEnd:ForgePoseNode[];control:ForgeControlFrame};
export type ForgePressResult={pose:ForgePoseNode[];applied:boolean;phase:string;contactExpected:boolean;
 contactPoint?:number[];contactTarget?:number[];wristTarget?:number[];elbowTarget?:number[];
 reach?:number;reachLimit?:number;reachSlack?:number;contactResidual?:number;torsoLeanRadians?:number;support?:string;contact?:string};
export const FORGE_PRESS:Readonly<{preparationStart:number;duration:number;raiseEnd:number;touchAt:number;releaseAt:number;clearAt:number;recoverAt:number;
 maximumTorsoLeanRadians:number;reachReserveMetres:number;hoverMetres:number;raiseMetres:number;approachMetres:number;outwardMetres:number;residualMetres:number}>;
export const FORGE_PRESS_JOINTS:readonly string[];
export function sampleMaxForgePress(input:ForgeInputs&{seconds:number;fittedLeanRadians?:number}):ForgePressResult;
export function prepareMaxForgePress(input:ForgeInputs):{fittedLeanRadians:number|undefined;sample(seconds:number):ForgePressResult};
export type PalmTriangle={id:string|number;points:number[][];handWeights:number[]};
export type ForgeReferenceMesh={space:'RightHand-local-native';complete:true;metresPerHandUnit:number;
 vertices:{id?:string|number;point:number[];influences:{bone:string;weight:number}[]}[];triangles:number[][]};
export function measureMaxPalmContact(triangles:PalmTriangle[],referenceLocal:number[],referenceMesh:ForgeReferenceMesh):{
 triangle:string|number;barycentric:number[];handWeights:number[];point:number[];handContactNormalLocal:number[];
 method:string;candidateFaces:number;limits:string;clearanceFit:{referenceMeshVertices:number;handWristVertices:number;
 forbiddenVertices:number;positiveHandFaces:number;normalTiltDegrees:number;maximumNormalTiltDegrees:number;
 requiredForbiddenGapMetres:number;minimumMeasuredForbiddenGapMetres:number|null}};
type VectorValue={asArray():number[];copyFromFloats(...values:number[]):unknown};

export function createMaxForgePressAdapter(channels:{target:TransformNode;path:string}[],placementRoot:TransformNode):{
 sample(quietStartValues:VectorValue[],quietEndValues:VectorValue[],seconds:number,controlWorld:ForgeControlFrame,result:VectorValue[]):ForgePressResult&{placementWorld:number[];controlFrame:ForgeControlFrame};
};
