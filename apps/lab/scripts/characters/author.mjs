/** Offline authored mechanical kit. Metres, -Z forward. Exported geometry only at runtime. */
import {NullEngine} from '@babylonjs/core/Engines/nullEngine.js';
import {Scene} from '@babylonjs/core/scene.js';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder.js';
import {Mesh} from '@babylonjs/core/Meshes/mesh.js';
import {VertexData} from '@babylonjs/core/Meshes/mesh.vertexData.js';
import {VertexBuffer} from '@babylonjs/core/Buffers/buffer.js';
import {Vector3,Matrix,Quaternion} from '@babylonjs/core/Maths/math.vector.js';
import {Color3} from '@babylonjs/core/Maths/math.color.js';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode.js';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial.js';
import {Skeleton} from '@babylonjs/core/Bones/skeleton.js';
import {Bone} from '@babylonjs/core/Bones/bone.js';
import {Animation} from '@babylonjs/core/Animations/animation.js';
import {AnimationGroup} from '@babylonjs/core/Animations/animationGroup.js';
import {GLTF2Export} from '@babylonjs/serializers/glTF/2.0/glTFSerializer.js';
import {validateBytes} from 'gltf-validator';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {embedSurface} from './surface.mjs';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup,prune,resample,weld} from '@gltf-transform/functions';
async function compact(bytes){const io=new NodeIO().registerExtensions(ALL_EXTENSIONS);const doc=await io.readBinary(new Uint8Array(bytes));await doc.transform(weld(),resample(),dedup(),prune({keepLeaves:true}));return Buffer.from(await io.writeBinary(doc));}
const output=process.argv[2]??'/tmp/loopforge-agent-export';await mkdir(output,{recursive:true});
const engine=new NullEngine(),V=a=>new Vector3(...a),C=h=>Color3.FromHexString(h),add=(a,b)=>a.map((v,i)=>v+b[i]);
const palette={iron:'#58645e',dark:'#202b2c',edge:'#aaaa90',brass:'#917349',enamel:'#405954',steel:'#85958f',rubber:'#232827',copper:'#805640'};
const reports=[];
for(const kind of ['worker','worker-ribbed','worker-plated','limen','stiletto','worker-low','worker-ribbed-low','worker-plated-low']){
 const scene=new Scene(engine),slim=kind==='stiletto',heavy=kind==='limen',worker=!slim&&!heavy,scale=slim?1.17:heavy?1.10:1;
 const sizes={hip:.19*(heavy?1.36:slim?.86:1),shoulder:heavy?.46:slim?.28:.32,upper:slim?.43:heavy?.41:.34,lower:slim?.41:heavy?.39:.34};
 const rest={root:[0,0,0],pelvis:[0,.91*scale,0],chest:[0,1.28*scale,0],neck:[0,1.51*scale,0],head:[0,1.70*scale,0]},parents={root:null,pelvis:'root',chest:'pelvis',neck:'chest',head:'neck'};
 for(const side of [-1,1]){const s=side===-1?'L':'R',x=side*sizes.shoulder,y=1.43*scale;
  for(const [name,p,parent] of [['upper',[x,y,0],'chest'],['lower',[x,y-sizes.upper,0],'upper'+s],['hand',[x,y-sizes.upper-sizes.lower,0],'lower'+s],['thigh',[side*sizes.hip,.86*scale,0],'pelvis'],['shin',[side*sizes.hip,.46*scale,0],'thigh'+s],['foot',[side*sizes.hip,.105,0],'shin'+s]]){rest[name+s]=p;parents[name+s]=parent;}
 }
 const skeleton=new Skeleton(kind+'-rig','loopforge-mechanical-v1',scene),names=Object.keys(rest),bones={},nodes={};
 for(const name of names){const parent=parents[name],local=parent?rest[name].map((v,i)=>v-rest[parent][i]):rest[name],node=new TransformNode(name,scene);node.position.copyFrom(V(local));node.rotationQuaternion=Quaternion.Identity();if(parent)node.parent=nodes[parent];nodes[name]=node;const bone=new Bone(name,skeleton,parent?bones[parent]:null,Matrix.Translation(...local));bone.linkTransformNode(node);bones[name]=bone;}
 const bodyMat=new PBRMaterial('cast metal',scene);bodyMat.albedoColor=Color3.White();bodyMat.metallic=slim?.87:.72;bodyMat.roughness=slim?.37:.66;
 const eyeMat=new PBRMaterial('optics',scene);eyeMat.albedoColor=Color3.Black();eyeMat.emissiveColor=C(slim?'#ff3518':heavy?'#16bdce':'#65bec0');eyeMat.metallic=.1;eyeMat.roughness=.25;
 const parts=[],optics=[];let serial=0;
 function finish(m,bone,color='iron',eye=false){m.computeWorldMatrix(true);m.bakeTransformIntoVertices(m.getWorldMatrix());m.position.setAll(0);m.rotation.setAll(0);m.rotationQuaternion=null;m.scaling.setAll(1);m.material=eye?eyeMat:bodyMat;const n=m.getTotalVertices(),j=names.indexOf(bone),indices=[],weights=[],colors=[],base=C(palette[color]??color).toLinearSpace(),pos=m.getVerticesData(VertexBuffer.PositionKind);
  for(let i=0;i<n;i++){indices.push(j,0,0,0);weights.push(1,0,0,0);const wear=.90+.10*Math.abs(Math.sin(pos[i*3]*47+pos[i*3+1]*63+pos[i*3+2]*21));colors.push(base.r*wear,base.g*wear,base.b*wear,1);}m.setVerticesData(VertexBuffer.UVKind,Array.from({length:n*2},(_,i)=>pos[Math.floor(i/2)*3+(i%2)]*3));m.setVerticesData(VertexBuffer.MatricesIndicesKind,indices);m.setVerticesData(VertexBuffer.MatricesWeightsKind,weights);m.setVerticesData(VertexBuffer.ColorKind,colors);(eye?optics:parts).push(m);return m;}
 function box(bone,size,at,color='iron',rotation=[0,0,0]){
  const h=size.map(v=>v/2),b=Math.min(.018,Math.min(...size)*.17),positions=[],normals=[],indices=[];
  function face(points){const center=points.reduce((a,p)=>a.add(V(p)),Vector3.Zero()).scale(1/points.length);let n=Vector3.Cross(V(points[1]).subtract(V(points[0])),V(points[2]).subtract(V(points[0]))).normalize();if(Vector3.Dot(n,center)<0){points.reverse();n.scaleInPlace(-1);}const start=positions.length/3;points.forEach(p=>{positions.push(...p);normals.push(n.x,n.y,n.z);});for(let i=1;i<points.length-1;i++)indices.push(start,start+i+1,start+i);}
  for(let a=0;a<3;a++)for(const sign of [-1,1]){const axes=[0,1,2].filter(x=>x!==a);face([[-1,-1],[1,-1],[1,1],[-1,1]].map(q=>{const p=[0,0,0];p[a]=h[a]*sign;p[axes[0]]=q[0]*(h[axes[0]]-b);p[axes[1]]=q[1]*(h[axes[1]]-b);return p;}));}
  for(let a=0;a<3;a++)for(let c=a+1;c<3;c++)for(const sa of [-1,1])for(const sc of [-1,1]){const axis=3-a-c;face([[0,-1],[1,-1],[1,1],[0,1]].map(q=>{const p=[0,0,0];p[a]=(h[a]-(q[0]?b:0))*sa;p[c]=(h[c]-(q[0]?0:b))*sc;p[axis]=(h[axis]-b)*q[1];return p;}));}
  for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1])face([[h[0]-b,h[1],h[2]],[h[0],h[1]-b,h[2]],[h[0],h[1],h[2]-b]].map(p=>[p[0]*x,p[1]*y,p[2]*z]));
  const d=new VertexData();d.positions=positions;d.normals=normals;d.indices=indices;const m=new Mesh('bevel-'+serial++,scene);d.applyToMesh(m);m.position.copyFrom(V(at));m.rotation.copyFrom(V(rotation));return finish(m,bone,color);
 }
 function oval(bone,size,at,color='iron',eye=false){const m=MeshBuilder.CreateSphere('shell-'+serial++,{diameter:1,segments:kind.endsWith('-low')?2:worker?6:10},scene);m.scaling.copyFrom(V(size));m.position.copyFrom(V(at));return finish(m,bone,color,eye);}
 function rod(bone,a,b,r,color='brass'){const av=V(a),bv=V(b),m=MeshBuilder.CreateCylinder('actuator-'+serial++,{height:Vector3.Distance(av,bv),diameter:r*2,tessellation:8},scene);m.position.copyFrom(av.add(bv).scale(.5));m.rotationQuaternion=Quaternion.FromUnitVectorsToRef(Vector3.Up(),bv.subtract(av).normalize(),new Quaternion());return finish(m,bone,color);}
 function tube(bone,points,r,color='dark'){return finish(MeshBuilder.CreateTube('conduit-'+serial++,{path:points.map(V),radius:r,tessellation:6,cap:3},scene),bone,color);}
 function plate(bone,points,depth,color='iron',eye=false){const positions=[],indices=[];for(const z of [-depth/2,depth/2])points.forEach(p=>positions.push(p[0],p[1],p[2]+z));const n=points.length;for(let i=1;i<n-1;i++)indices.push(0,i+1,i,n,n+i,n+i+1);for(let i=0;i<n;i++){const j=(i+1)%n;indices.push(i,j,n+j,i,n+j,n+i);}const normals=[];VertexData.ComputeNormals(positions,indices,normals);const d=new VertexData();d.positions=positions;d.indices=indices;d.normals=normals;const m=new Mesh('plate-'+serial++,scene);d.applyToMesh(m);return finish(m,bone,color,eye);}
 const cy=rest.chest[1],hy=rest.head[1],py=rest.pelvis[1],sw=heavy?.68:slim?.39:.45;
 oval('chest',[sw,.39*scale,.30],[0,cy,0],slim?'dark':'enamel');rod('chest',[0,py,0],[0,cy+.18,0],.075,'steel');
 for(let i=0;i<5;i++)oval('chest',[.25+(i/5)*.10,.045,.25],[0,py+.06+i*.061,0],i%2?'dark':'brass');
 for(const s of [-1,1]){tube('chest',[[s*.10,py+.03,.13],[s*.14,cy-.12,.17],[s*.22,cy+.10,.09]],.024);rod('chest',[s*.13,py+.04,-.05],[s*(sw/2-.045),cy+.08,-.10],.025,'steel');
  if(slim){oval('chest',[.23,.23,.18],[s*.125,cy+.065,-.11],'iron');plate('chest',[[s*.19,cy+.02,-.20],[s*.07,cy-.15,-.18],[s*.08,cy-.35,-.12],[s*.14,cy-.22,-.14]],.025,'brass');}}
 if(!slim){box('chest',[sw*.77,.23,.055],[0,cy+.02,-.168],heavy?'dark':'iron');for(let i=0;i<4;i++)box('chest',[sw*.54,.018,.028],[0,cy+.1-i*.044,-.205],i%2?'dark':'edge');for(const s of [-1,1])for(const y of [cy-.07,cy+.13])oval('chest',[.028,.028,.018],[s*sw*.33,y,-.21],'brass');}
 box('pelvis',[sw*.80,.17,.29],[0,py-.06,0],slim?'dark':'iron');
 if(worker){box('chest',[.39,.30,.065],[0,cy+.035,-.20],'enamel');for(let i=0;i<5;i++)box('chest',[.285,.026,.034],[0,cy+.14-i*.05,-.25],i%2?'dark':'brass');}
 if(heavy){for(const s of [-1,1]){box('chest',[.07,.37,.065],[s*.24,cy+.08,-.175],'rubber',[0,0,s*.16]);box('chest',[.105,.075,.075],[s*.21,cy+.23,-.19],'edge');box('pelvis',[.14,.19,.115],[s*.25,py-.01,-.16],'enamel');box('chest',[.15,.18,.07],[s*.255,cy-.13,-.17],'enamel');}box('chest',[.32,.18,.028],[0,cy+.045,-.235],'brass');box('chest',[.285,.146,.014],[0,cy+.045,-.256],'dark');box('chest',[.4,.38,.14],[0,cy,.20],'dark');rod('chest',[.19,cy+.13,.20],[.19,cy+.53,.20],.013,'steel');}
 if(heavy){for(const side of [-1,1]){plate('chest',[[side*.04,cy+.25,-.20],[side*.34,cy+.21,-.16],[side*.30,cy-.07,-.18],[side*.06,cy-.10,-.23]],.065,'enamel');for(const yy of [cy+.19,cy-.02])oval('chest',[.032,.032,.025],[side*.28,yy,-.215],'edge');}}
 rod('neck',[0,rest.neck[1]-.08,0],[0,hy-.05,0],.065,'steel');oval('head',[slim?.245:heavy?.34:.285,slim?.35:.32,.265],[0,hy+.03,0],heavy?'enamel':'iron');
 const ex=heavy?.085:.074;
 for(const s of [-1,1]){oval('head',[.10,.10,.065],[s*.14,hy+.015,.018],'brass');oval('head',[.065,.065,.075],[s*.165,hy+.015,.018],'dark');
  if(slim){plate('head',[[s*.01,hy+.025,-.146],[s*.127,hy+.087,-.116],[s*.09,hy+.009,-.152],[s*.025,hy-.025,-.154]],.008,'#ff4015',true);plate('head',[[s*.11,hy-.005,-.153],[s*.04,hy-.135,-.139],[s*.055,hy-.038,-.172]],.025,'steel');}
  else{oval('head',[.127,.10,.06],[s*ex,hy+.026,-.12],'dark');oval('head',[.078,.041,.04],[s*ex,hy+.033,-.15],'#62cdd4',true);box('head',[.132,.034,.054],[s*ex,hy+.08,-.135],heavy?'enamel':'brass',[0,0,s*-.19]);plate('head',[[s*.13,hy-.015,-.139],[s*.13,hy-.069,-.14],[s*.045,hy-.055,-.178]],.035,'steel');}
  tube('head',[[s*.125,hy+.09,.055],[s*.16,hy-.06,.10],[s*.10,hy-.20,.08]],.017);}
 plate('head',[[-.025,hy+.02,-.16],[.025,hy+.02,-.16],[.035,hy-.07,-.179],[0,hy-.044,-.199],[-.035,hy-.07,-.179]],.025);
 box('head',[slim?.082:.17,.071,.08],[0,hy-.118,-.105],slim?'steel':'iron');
 if(!slim)for(let i=0;i<7;i++){box('head',[.016,.025+(i%2)*.006,.019],[-.063+i*.021,hy-.077,-.165],'edge');box('head',[.014,.017,.017],[-.063+i*.021,hy-.108,-.161],'brass');}
 tube('head',[[-.01,hy+.185,.035],[0,hy+.191,-.015],[0,hy+.156,-.09],[0,hy+.105,-.12]],.009);
 for(const s of [-1,1]){const suffix=s===-1?'L':'R',up='upper'+suffix,low='lower'+suffix,hand='hand'+suffix,th='thigh'+suffix,sh='shin'+suffix,foot='foot'+suffix,a=rest[up],e=rest[low],w=rest[hand],h=rest[th],k=rest[sh],f=rest[foot];
  if(heavy){plate(up,[add(a,[-.20,.08,-.17]),add(a,[.18,.08,-.17]),add(a,[.22,-.09,-.19]),add(a,[-.23,-.09,-.19])],.12,'enamel');box(up,[.27,.13,.05],add(a,[0,.09,-.03]),'iron');}
  oval(up,[heavy?.36:.20,heavy?.29:.20,heavy?.32:.23],a,heavy?'enamel':'iron');rod(up,add(a,[0,-.03,0]),add(e,[0,.02,0]),heavy?.11:slim?.066:.067,'dark');oval(up,[heavy?.26:slim?.115:.13,sizes.upper*.66,heavy?.24:.135],add(a,[0,-sizes.upper*.48,-.045]),heavy?'enamel':'iron');rod(up,add(a,[s*.06,-.06,-.05]),add(e,[s*.06,.02,-.06]),.025,'edge');
  oval(low,[heavy?.20:.15,.14,.15],e,'dark');rod(low,add(e,[-.045,0,0]),add(e,[.045,0,0]),.055);rod(low,add(e,[0,-.04,0]),add(w,[0,.03,0]),heavy?.115:slim?.066:.058,'dark');oval(low,[heavy?.235:slim?.105:.12,sizes.lower*.70,heavy?.22:.135],add(e,[0,-sizes.lower*.49,-.05]),heavy?'enamel':'iron');if(!slim)box(low,[heavy?.21:.12,sizes.lower*.56,.055],add(e,[0,-sizes.lower*.48,-(heavy?.16:.10)]),'enamel');for(const n of [-1,1])rod(low,add(e,[n*.055,-.025,.035]),add(w,[n*.044,.03,.035]),.014,'steel');
  if(slim)plate(low,[add(e,[s*.065,-.05,-.045]),add(e,[s*.11,-.13,-.05]),add(w,[s*.06,-.30,-.09]),add(w,[s*.022,.04,-.08])],.018,'steel');else for(let i=0;i<3;i++)box(low,[heavy?.21:.13,.018,.018],add(e,[0,-.10-i*.058,-(heavy?.16:.12)]),'brass');
  box(hand,[heavy?.14:.10,.12,.08],add(w,[0,-.035,-.01]));for(let i=0;i<4;i++){const x=-.041+i*.028;box(hand,[.018,.064,.025],add(w,[x,-.115,-.01]),'steel');oval(hand,[.023,.023,.03],add(w,[x,-.075,-.02]),'brass');}box(hand,[.032,.082,.032],add(w,[s*.076,-.035,-.027]),'iron',[0,0,-s*.38]);
  oval(th,[heavy?.23:.18,.17,.19],h,'dark');rod(th,add(h,[0,-.04,0]),add(k,[0,.03,0]),heavy?.125:slim?.085:.07,'dark');oval(th,[heavy?.27:slim?.17:.17,(h[1]-k[1])*.76,heavy?.26:.17],[(h[0]+k[0])/2,(h[1]+k[1])/2,-.025],heavy?'enamel':'iron');if(heavy){box(th,[.22,.26,.07],add(h,[0,-.19,-.15]),'enamel');box(sh,[.21,.25,.065],add(k,[0,-.20,-.14]),'enamel');}
  rod(th,add(h,[s*.074,-.065,.075]),add(k,[s*.066,.025,.075]),.022);
  oval(sh,[heavy?.22:.16,.14,.16],k,'dark');box(sh,[heavy?.21:.105,.12,.045],add(k,[0,.005,-.10]),heavy?'enamel':'edge');rod(sh,add(k,[0,-.02,0]),add(f,[0,.025,0]),heavy?.105:.055,'dark');oval(sh,[heavy?.26:slim?.115:.135,(k[1]-f[1])*.8,heavy?.21:.13],[(k[0]+f[0])/2,(k[1]+f[1])/2,-.025],heavy?'enamel':'iron');for(const n of [-1,1])rod(sh,add(k,[n*.061,-.06,.05]),add(f,[n*.049,.025,.045]),.017,'steel');
  box(foot,[heavy?.25:slim?.115:.16,.13,heavy?.39:slim?.265:.30],add(f,[0,-.035,-.07]),'dark');box(foot,[heavy?.235:slim?.11:.15,.056,.13],add(f,[0,-.012,-.16]));for(let i=0;i<3;i++)box(foot,[heavy?.24:slim?.11:.155,.017,.021],add(f,[0,-.061,-.12+i*.07]),'brass');
 }
 if(kind.startsWith('worker-ribbed')){for(let i=0;i<5;i++)box('chest',[.40,.035,.10],[0,cy+.17-i*.065,-.14],i%2?'iron':'brass');tube('chest',[[.19,cy+.17,.05],[.28,cy-.1,.05],[.19,py,.05]],.022,'copper');}
 if(kind.startsWith('worker-plated')){box('chest',[.15,.24,.07],[.10,cy+.01,-.22],'enamel');box('head',[.32,.042,.21],[0,hy+.18,0],'brass');}
 const meshes=[];for(const [group,name] of [[parts,'body'],[optics,'optics']]){const mesh=Mesh.MergeMeshes(group,true,true,undefined,false,false);mesh.name=kind+'-'+name;mesh.skeleton=skeleton;meshes.push(mesh);}
 function pose(clip,t){const q={},p={},wave=Math.sin(t*Math.PI*2);if(clip==='walk'){for(const s of ['L','R']){const phase=t*Math.PI*2+(s==='R'?Math.PI:0);q['thigh'+s]=[Math.sin(phase)*.38,0,0];q['shin'+s]=[Math.max(0,-Math.sin(phase))*.58,0,0];q['foot'+s]=[-Math.max(0,-Math.sin(phase))*.24,0,0];q['upper'+s]=[-Math.sin(phase)*.23,0,0];q['lower'+s]=[.11,0,0];}p.root=[0,Math.abs(wave)*.025,0];q.chest=[0,wave*.035,0];}else if(clip==='wait'){q.head=[wave*.025,wave*.07,0];q.chest=[0,0,wave*.008];}else if(clip==='present'){q.upperR=[1.00,0,-.05];q.lowerR=[.58,0,0];q.handR=[-.3,0,0];q.head=[.12,-.10,0];}else if(clip==='inspect'){q.upperL=[.9,0,.10];q.lowerL=[.8,0,0];q.head=[.22,.15,0];}else if(clip==='carry'){for(const s of ['L','R']){q['upper'+s]=[.57,0,s==='L'?-.08:.08];q['lower'+s]=[1.2,0,0];}q.chest=[.035,0,0];}else if(clip==='urge'){q.upperR=[1.2,0,-.15];q.lowerR=[.3+Math.sin(t*Math.PI)*.25,0,0];q.head=[.06,-.12,0];q.chest=[.05,0,0];}else if(clip==='refuse'){q.head=[-.05,Math.sin(t*Math.PI*4)*.17,0];q.chest=[-.08,0,0];q.upperL=[.2,0,-.12];q.upperR=[.2,0,.12];}return {q,p};}
 const clips=['wait','walk','present','inspect','carry','urge','refuse'];
 for(const clip of clips){const group=new AnimationGroup(clip,scene);for(const name of names){const anim=new Animation(clip+'/'+name,'rotationQuaternion',30,Animation.ANIMATIONTYPE_QUATERNION,Animation.ANIMATIONLOOPMODE_CYCLE);anim.setKeys(Array.from({length:31},(_,i)=>{const a=pose(clip,i/30).q[name]??[0,0,0];return {frame:i,value:Quaternion.RotationYawPitchRoll(a[1],a[0],a[2])};}));group.addTargetedAnimation(anim,nodes[name]);}const anim=new Animation(clip+'/root','position',30,Animation.ANIMATIONTYPE_VECTOR3,Animation.ANIMATIONLOOPMODE_CYCLE);anim.setKeys(Array.from({length:31},(_,i)=>({frame:i,value:V(pose(clip,i/30).p.root??[0,0,0])})));group.addTargetedAnimation(anim,nodes.root);group.normalize(0,30);}
 if(kind==='worker'){
 const rows=[];
 for(const clip of ['wait','walk','carry'])for(let frame=0;frame<60;frame++){
  const sample=pose(clip,frame/60);
  for(const name of names){const a=sample.q[name]??[0,0,0];nodes[name].rotationQuaternion=Quaternion.RotationYawPitchRoll(a[1],a[0],a[2]);nodes[name].computeWorldMatrix(true);}
  nodes.root.position.copyFrom(V(sample.p.root??[0,0,0]));nodes.root.computeWorldMatrix(true);skeleton._markAsDirty();skeleton.prepare();rows.push(...skeleton.getTransformMatrices(meshes[0]));
 }
 const floats=new Float32Array(rows);await writeFile(path.join(output,'worker-baked.json'),JSON.stringify({rig:'loopforge-mechanical-v1',width:(names.length+1)*4,height:180,vertexData:Buffer.from(floats.buffer).toString('base64'),clips:{wait:[0,59],walk:[60,119],carry:[120,179]}}));
 for(const name of names){nodes[name].rotationQuaternion=Quaternion.Identity();}nodes.root.position.setAll(0);
 }
 skeleton.prepare();const data=await GLTF2Export.GLBAsync(scene,kind,{exportWithoutWaitingForScene:true,exportUnusedUVs:true,shouldExportNode:n=>!(n instanceof Mesh)||meshes.includes(n)}),bytes=await compact(await embedSurface(Buffer.from(await data.glTFFiles[kind+'.glb'].arrayBuffer()),slim)),validation=await validateBytes(new Uint8Array(bytes),{uri:kind+'.glb',maxIssues:20});if(validation.issues.numErrors)throw new Error(JSON.stringify(validation.issues));await writeFile(path.join(output,kind+'.glb'),bytes);
 const meta={kind,rig:'loopforge-mechanical-v1',height:Math.max(...meshes.map(m=>{m.refreshBoundingInfo();return m.getBoundingInfo().boundingBox.maximum.y;})),bones:names,rest,parents,sizes,clips,triangles:meshes.reduce((s,m)=>s+m.getTotalIndices()/3,0),bytes:bytes.length,materials:2,validation:validation.issues};await writeFile(path.join(output,kind+'.json'),JSON.stringify(meta,null,2));reports.push(meta);scene.dispose();
}
await writeFile(path.join(output,'report.json'),JSON.stringify(reports,null,2));engine.dispose();console.log(reports.map(({kind,triangles,bytes,height})=>({kind,triangles,bytes,height})));
