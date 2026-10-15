import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import type {Bone} from '@babylonjs/core/Bones/bone';
import {Matrix,Quaternion} from '@babylonjs/core/Maths/math.vector';
/** Fit coordinates come from the static body. Use the skin's inverse bind matrix,
 * never the posed head transform: an import can already be standing in a motion pose. */
export function createHeadFitAnchor(head:TransformNode,bone:Bone,meshHeight:number,fitHeight:number){
 const anchor=new TransformNode('CATHEXIS head fitting coordinates',head.getScene());
 const scale=meshHeight/fitHeight;
 const bind=Matrix.Scaling(scale,scale,scale).multiply(bone.getAbsoluteInverseBindMatrix());
 anchor.rotationQuaternion=Quaternion.Identity();
 bind.decompose(anchor.scaling,anchor.rotationQuaternion,anchor.position);
 anchor.parent=head;
 return anchor;
}
