import {Vector3} from '@babylonjs/core/Maths/math.vector';
import {VertexBuffer} from '@babylonjs/core/Buffers/buffer';
import type {AbstractMesh} from '@babylonjs/core/Meshes/abstractMesh';
import type {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {measureMaxPalmContact,type PalmTriangle,type ForgeReferenceMesh} from './max-forge-press.mjs';

/** Actual loaded Quiet surface, including the full mixed hand/wrist volume.
 * Contact candidates remain separate from the unchanged full scene checks. */
export function measureLoadedMaxPalm(root:TransformNode,meshes:AbstractMesh[],referenceLocal:number[]){
 const nodes=[root,...root.getChildTransformNodes(false)];
 const depth=(node:TransformNode)=>{let d=0;for(let n=node.parent;n;n=n.parent)d++;return d;};
 nodes.sort((a,b)=>depth(a)-depth(b));
 for(const node of nodes)node.computeWorldMatrix(true);
 for(const mesh of meshes)mesh.computeWorldMatrix(true);
 for(const skeleton of new Set(meshes.map(m=>m.skeleton).filter(s=>s!==null)))skeleton.prepare(true);
 const hand=nodes.find(n=>n.name==='RightHand');
 if(!hand)throw Error('Max Forge: actual right hand is missing');
 const handWorld=hand.getWorldMatrix(),inverseHand=handWorld.clone().invert(),matrix=handWorld.asArray();
 const columns=[[matrix[0],matrix[1],matrix[2]],[matrix[4],matrix[5],matrix[6]],[matrix[8],matrix[9],matrix[10]]];
 const gram=columns.map(a=>columns.map(b=>a.reduce((sum,v,i)=>sum+v*b[i],0)));
 const axisScales=gram.map((row,i)=>Math.sqrt(row[i])),maximumScale=Math.max(...axisScales);
 if(!Number.isFinite(maximumScale)||maximumScale<=0)throw Error('Max Forge: invalid actual hand scale');
 const relativeSpread=(maximumScale-Math.min(...axisScales))/maximumScale;
 const normalizedShear=Math.max(...gram.flatMap((row,i)=>row.map((v,j)=>i===j?0:Math.abs(v)/(axisScales[i]*axisScales[j]))));
 // Same1e-5 arithmetic representation bound as the authored transform
 // decomposition; it is not a spatial/contact tolerance. Preserve raw matrices.
 if(!Number.isFinite(normalizedShear)||relativeSpread>1e-5||normalizedShear>1e-5)throw Error('Max Forge: unsupported nonuniform or sheared actual hand scale');
 const metresPerHandUnit=Math.min(...axisScales);
 const referenceMesh:ForgeReferenceMesh={space:'RightHand-local-native',complete:true,metresPerHandUnit,vertices:[],triangles:[]};
 const triangles:PalmTriangle[]=[],faces=new Map<string,{mesh:string;meshIndex:number;triangleIndex:number;vertices:number[]}>();
 for(const [meshIndex,mesh]of meshes.entries()){
  if(!mesh.skeleton)continue;
  const positions=mesh.getPositionData(true,false),indices=mesh.getIndices();
  const ids=mesh.getVerticesData(VertexBuffer.MatricesIndicesKind),weights=mesh.getVerticesData(VertexBuffer.MatricesWeightsKind);
  const extraIds=mesh.getVerticesData(VertexBuffer.MatricesIndicesExtraKind),extraWeights=mesh.getVerticesData(VertexBuffer.MatricesWeightsExtraKind);
  if(!positions||!indices||!ids||!weights)throw Error('Max Forge: weighted skin data missing');
  const offset=referenceMesh.vertices.length,toHand=mesh.getWorldMatrix().multiply(inverseHand),handWeights:number[]=[];
  for(let vertex=0;vertex<positions.length/3;vertex++){
   const influences:{bone:string;weight:number}[]=[];
   for(const [boneIds,values]of [[ids,weights],[extraIds,extraWeights]]){
    if(!boneIds||!values)continue;
    for(let lane=0;lane<4;lane++){
     const weight=values[vertex*4+lane];if(weight<=0)continue;
     const bone=mesh.skeleton.bones[Math.round(boneIds[vertex*4+lane])];
     if(!bone)throw Error('Max Forge: missing actual influencing bone');
     influences.push({bone:bone.name,weight});
    }
   }
   if(!influences.length)throw Error('Max Forge: unweighted reference vertex');
   handWeights.push(influences.reduce((sum,x)=>sum+(x.bone==='RightHand'?x.weight:0),0));
   referenceMesh.vertices.push({point:Vector3.TransformCoordinates(new Vector3(positions[vertex*3],positions[vertex*3+1],positions[vertex*3+2]),toHand).asArray(),influences});
  }
  for(let index=0;index<indices.length;index+=3){
   const vertices=[indices[index],indices[index+1],indices[index+2]],selectedWeights=vertices.map(v=>handWeights[v]);
   referenceMesh.triangles.push(vertices.map(v=>v+offset));
   if(selectedWeights.every(w=>w===0))continue;
   const id=`${meshIndex}:${index/3}`;
   triangles.push({id,handWeights:selectedWeights,points:vertices.map(v=>referenceMesh.vertices[v+offset].point)});
   faces.set(id,{mesh:mesh.name,meshIndex,triangleIndex:index/3,vertices});
  }
 }
 const contact=measureMaxPalmContact(triangles,referenceLocal,referenceMesh),face=faces.get(String(contact.triangle));
 if(!face)throw Error('Max Forge: measured contact face is missing');
 return {...contact,...face,referenceLocal:[...referenceLocal],referenceMeshEvidence:{space:referenceMesh.space,vertices:referenceMesh.vertices.length,triangles:referenceMesh.triangles.length,metresPerHandUnit,scaleMethod:'minimum measured uniform Hand basis magnitude; unsupported shear/nonuniform rejected',axisScales,relativeSpread,normalizedShear,scaleRepresentationTolerance:1e-5,handWorldMatrix:Array.from(matrix)}};
}
