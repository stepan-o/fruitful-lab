import type {Scene} from '@babylonjs/core/scene';
import {Mesh} from '@babylonjs/core/Meshes/mesh';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import {DynamicTexture} from '@babylonjs/core/Materials/Textures/dynamicTexture';
import {Color3} from '@babylonjs/core/Maths/math.color';
import {Vector3} from '@babylonjs/core/Maths/math.vector';
import {worldPoint} from '@/lib/loopforge/spatial/floor';

/** Room-local static construction. No new lights, animated props or shadow maps. */
export function roomEnvironmentKit(scene:Scene,name:string,warm:boolean){
 const materials:PBRMaterial[]=[],meshes:Mesh[]=[],sections=new Map<string,Mesh[]>();
 const textures:DynamicTexture[]=[];
 function material(label:string,hex:string,metal:number,glow=0){const m=new PBRMaterial(`${name} / ${label}`,scene);m.albedoColor=Color3.FromHexString(hex).toLinearSpace();m.metallic=metal;m.roughness=.82;m.maxSimultaneousLights=2;if(glow)m.emissiveColor=m.albedoColor.scale(glow);materials.push(m);return m;}
 const iron=material('iron','#263239',.6);
 const palette={wall:material('wall enamel',warm?'#474b43':'#34434a',.22),iron,brass:material('worn brass','#897758',.55),dark:iron,paper:material('paper ivory','#b0ad99',.02),lamp:material('practical glass',warm?'#d2b784':'#adc6ce',.04,.4)};
 function own(m:Mesh,section?:string){m.isPickable=false;m.receiveShadows=true;if(section){if(!sections.has(section))sections.set(section,[]);sections.get(section)!.push(m);}else meshes.push(m);return m;}
 function box(label:string,size:readonly[number,number,number],x:number,y:number,h:number,m:PBRMaterial,section?:string){const mesh=MeshBuilder.CreateBox(`${name} / ${label}`,{width:size[0],height:size[1],depth:size[2]},scene);mesh.position.set(...worldPoint(x,y));mesh.position.y=h;mesh.material=m;return own(mesh,section);}
 function tube(label:string,points:readonly(readonly[number,number,number])[],radius:number,m:PBRMaterial,section?:string){const path=points.map(([x,y,h])=>{const p=new Vector3(...worldPoint(x,y));p.y=h;return p;});const mesh=MeshBuilder.CreateTube(`${name} / ${label}`,{path,radius,tessellation:8,cap:Mesh.CAP_ALL},scene);mesh.material=m;return own(mesh,section);}
 /** One atlas per room; labels are place names, never fabricated admission states. */
 function signs(labels:readonly string[]){const tex=new DynamicTexture(`${name} place labels`,{width:1024,height:labels.length*128},scene,false);textures.push(tex);const c=tex.getContext();c.fillStyle='#263239';c.fillRect(0,0,1024,labels.length*128);labels.forEach((s,i)=>tex.drawText(s,null,i*128+84,'bold 58px sans-serif','#b9b9a7',null,undefined,false));tex.update();const m=material('label atlas','#ffffff',.1);m.albedoTexture=tex;
  return (i:number,x:number,y:number,h:number,width:number,yaw=0,section?:string)=>{const face=MeshBuilder.CreatePlane(`${name} / ${labels[i]}`,{width,height:.38,sideOrientation:Mesh.DOUBLESIDE},scene);face.position.set(...worldPoint(x,y));face.position.y=h;face.rotation.y=yaw;face.material=m;const uv=face.getVerticesData('uv');if(uv){for(let j=1;j<uv.length;j+=2)uv[j]=(uv[j]+labels.length-1-i)/labels.length;face.setVerticesData('uv',uv);}return own(face,section);};
 }
 function finish(){const batches:Mesh[]=[],sectionBatches=new Map<string,Mesh[]>();const merge=(group:Mesh[])=>{const result:Mesh[]=[];for(const mat of materials){const same=group.filter(m=>m.material===mat);if(!same.length)continue;const m=same.length===1?same[0]:Mesh.MergeMeshes(same,true,true)!;m.name=`${name} / ${mat.name} batch`;m.isPickable=false;m.receiveShadows=true;result.push(m);}return result;};batches.push(...merge(meshes));for(const [id,group]of sections)sectionBatches.set(id,merge(group));return {section(id:string,show:boolean){for(const m of sectionBatches.get(id)??[])if(m.isEnabled()!==show)m.setEnabled(show);},dispose(){for(const m of batches)m.dispose();for(const group of sectionBatches.values())for(const m of group)m.dispose();for(const t of textures)t.dispose();for(const m of materials)m.dispose();}};}
 return {palette,box,tube,signs,finish};
}
