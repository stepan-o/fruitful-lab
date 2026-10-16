"""Offline audition cleanup. Source channels/skin and approved bank are immutable."""
from pathlib import Path
import sys,json,copy,struct,hashlib
import numpy as np
from scipy.spatial.transform import Rotation as R,Slerp
from scipy.ndimage import gaussian_filter1d
from cathexis_motion_math import context,cloth_regions
from cathexis_drape import unit,swing,mix,smooth,drape_matrices
source,approved,output=map(Path,sys.argv[1:4]);d=context(source);a=context(approved)
assert hashlib.sha256(source.read_bytes()).hexdigest()=='b9271a9e10a7f2109782ff33aa0083bcf333ac91be82e344a7df0479a068e891'
assert hashlib.sha256(approved.read_bytes()).hexdigest()=='156f11fff75c4eba27c74d953b5b1c5b9246786aa15785e3e2b0fd9295245cc5'
g=copy.deepcopy(d['g']);data=bytearray(d['data']);v=d['verts'];vh=np.c_[v,np.ones(len(v))];f=d['acc'](d['prim']['indices']).astype(int).reshape(-1,3);cloth,legs=cloth_regions(v,f)
js=np.c_[d['js'],d['acc'](d['prim']['attributes']['JOINTS_1']).astype(int)];ws=np.c_[d['ws'],d['acc'](d['prim']['attributes']['WEIGHTS_1'])]
parents={c:i for i,n in enumerate(g['nodes'])for c in n.get('children',[])}
def add(arr,kind,component=5126):
 arr=np.asarray(arr,dtype={5126:'<f4',5123:'<u2'}[component]);data.extend(b'\0'*((-len(data))%4));off=len(data);data.extend(arr.tobytes());g['bufferViews'].append({'buffer':0,'byteOffset':off,'byteLength':arr.nbytes});ac={'bufferView':len(g['bufferViews'])-1,'componentType':component,'count':len(arr),'type':kind}
 if kind=='SCALAR':ac.update(min=[float(arr.min())],max=[float(arr.max())])
 g['accessors'].append(ac);return len(g['accessors'])-1
levels=np.array([.22,.38,.54,.70,.86,1.02]);newnodes=[]
for y in levels:
 newnodes.append(len(g['nodes']));g['nodes'].append({'name':f'Skirt_Clearance_{y:.2f}','scale':[100,100,100]});g['nodes'][24]['children'].append(newnodes[-1])
ib=np.concatenate([d['ib'],np.tile(np.eye(4),(6,1,1))]);skin=copy.deepcopy(g['skins'][0]);skin['joints']+=newnodes;skin['inverseBindMatrices']=add(ib.transpose(0,2,1).reshape(-1,16),'MAT4');g['skins'].append(skin)
# Use the accepted waist-hung costume weighting on identical vertex positions.
from scipy.spatial import cKDTree
dist,near=cKDTree(a['verts']).query(v);assert dist.max()<2e-7
cp=a['g']['meshes'][1]['primitives'][0];cj=a['acc'](cp['attributes']['JOINTS_0']).astype(int)[near];cw=a['acc'](cp['attributes']['WEIGHTS_0'])[near];cjs=js.copy();cws=ws.copy()
region=cloth|((v[:,1]>=.82)&(v[:,1]<1.02)&(v[:,2]<.025)&(abs(v[:,0])<.26))
cjs[region]=0;cws[region]=0;cjs[region,:4]=cj[region];cws[region,:4]=cw[region]
p=copy.deepcopy(d['prim'])
for k in range(2):p['attributes'][f'JOINTS_{k}']=add(cjs[:,k*4:k*4+4],'VEC4',5123);p['attributes'][f'WEIGHTS_{k}']=add(cws[:,k*4:k*4+4],'VEC4')
g['meshes'].append({'name':'Corrected costume skin','primitives':[p]});g['nodes'].append({'name':'Corrected_Body','mesh':1,'skin':1});g['nodes'][24]['children'].append(len(g['nodes'])-1)
bind=d['world_at']([],0)
def points(world,ids=legs):
 ix=np.flatnonzero(ids);m=world[d['sk']['joints']]@d['ib'];return sum(np.einsum('nij,nj->ni',m[js[ix,k]],vh[ix])*ws[ix,k,None]for k in range(8))[:,:3]
def solve(tr,t,k,rot,chain,goal,pole,footrot=None):
 upper,lower,end=chain;w=d['world_at'](tr,t);h,mid,tip=[w[j,:3,3]for j in chain];a,b=np.linalg.norm(mid-h),np.linalg.norm(tip-mid);direction=unit(goal-h);distance=np.clip(np.linalg.norm(goal-h),abs(a-b)+.003,a+b-.003);goal=h+direction*distance
 along=(a*a-b*b+distance*distance)/(2*distance);bend=unit(pole-h-direction*np.dot(pole-h,direction));target=h+direction*along+bend*np.sqrt(max(0,a*a-along*along))
 ur=swing(mid-h,target-h)*R.from_matrix(w[upper,:3,:3]/.01);rot[upper][k]=(R.from_matrix(w[parents[upper],:3,:3]/.01).inv()*ur).as_quat();w=d['world_at'](tr,t)
 lr=swing(w[end,:3,3]-w[lower,:3,3],goal-w[lower,:3,3])*R.from_matrix(w[lower,:3,:3]/.01);rot[lower][k]=(ur.inv()*lr).as_quat()
 if footrot is not None:rot[end][k]=(lr.inv()*footrot).as_quat()

def mirror_legs_pass(tr,ts,mirror=True):
 rot={i:z for i,p,_,z in tr if p=='rotation'};worlds=[d['world_at'](tr,t)for t in ts];goals=[];poles=[]
 for tloc,w in zip(ts,worlds):
  turn_clearance=max(smooth((tloc-2.8)/.4)*smooth((4.0-tloc)/.4),smooth((tloc-5.35)/.35)*smooth((6.5-tloc)/.4))
  hip=w[22]@np.linalg.inv(bind[22]);yaw=R.from_euler('y',np.arctan2(hip[0,2],hip[2,2]));centre=w[22,:3,3];footgoals=[];knees=[]
  for upper,lower,end,side in [(3,2,1,1),(7,6,5,-1)]:
   q=yaw.inv().apply(w[end,:3,3]-centre);q[0]=side*(.065+(.025*turn_clearance if mirror else 0))+q[0]*.20;footgoals.append(centre+yaw.apply(q))
   knee=yaw.inv().apply(w[lower,:3,3]-centre);knee[0]=side*max(.055+(.040*turn_clearance if mirror else 0),abs(knee[0])*.35);knees.append(knee)
  dz=np.linalg.norm((knees[0]-knees[1])[1:]);need=np.sqrt(max(0,.135**2-dz**2));gap=knees[0][0]-knees[1][0];extra=.005*np.logaddexp(0,(need-gap)/.005)/2;knees[0][0]+=extra;knees[1][0]-=extra
  goals.append(footgoals);poles.append([centre+yaw.apply(q)for q in knees])
 goals=np.array(goals);poles=np.array(poles)
 for k,t in enumerate(ts):
  for i,chain in enumerate([(3,2,1),(7,6,5)]):solve(tr,t,k,rot,chain,goals[k,i],poles[k,i],R.from_matrix(worlds[k][chain[-1],:3,:3]/.01))

def hands_pass(tr,ts):
 # Use the approved Hot Walk waist-contact pose as an actual geometric
 # reference. The neutral joint matrices are identical between both banks.
 reference=next(c for c in a['g']['animations'] if c['name']=='Hot_Walk_Corrected')
 rw=a['world_at'](a['tracks'](reference),2.5);rh=rw[22]@np.linalg.inv(bind[22]);local=np.linalg.inv(rh)@rw[8]
 assert np.allclose(a['world_at']([],0)[:23],bind[:23],atol=1e-8), 'Contact reference bind changed.'
 reflection=np.diag([-1,1,1])

 rot={i:z for i,p,_,z in tr if p=='rotation'}
 for k,t in enumerate(ts):
  w=d['world_at'](tr,t)
  for upper,fore,hand in [(10,9,8),(14,13,12)]:
   # Preserve the original forearm roll and acting; reduce excessive wrist
   # flexion so rigid fingers extend naturally from the forearm.
   hr=R.from_matrix(w[hand,:3,:3]/.01);axis=unit(w[hand,:3,3]-w[fore,:3,3]);fingers=hr.apply([0,1,0]);angle=np.arccos(np.clip(np.dot(axis,fingers),-1,1));limit=np.radians(22)
   amount=max(0,1-limit/max(angle,1e-8));wanted=mix(hr,swing(fingers,axis)*hr,amount)
   rot[hand][k]=(R.from_matrix(w[fore,:3,:3]/.01).inv()*wanted).as_quat()
  # Fit the approved palm orientation lower against the waist ornaments;
  # lower/back elbow poles avoid the previous raised-wing silhouette.
  # The self-admiring pose and turn rest the palms on the waist. Keep the
  # opening/release flourish; smoothly enter/leave a complete arm-chain solve.
  amount=smooth((t-.45)/.65)*smooth((6.75-t)/.65)
  if amount>1e-6:
   for chain,side in [((10,9,8),1),((14,13,12),-1)]:
    w=d['world_at'](tr,t);hip=w[22]@np.linalg.inv(bind[22]);upper,fore,hand=chain
    saved={j:R.from_quat(rot[j][k].copy())for j in chain}
    hand_rotation=local[:3,:3]/.01
    if side<0:hand_rotation=reflection@hand_rotation@reflection
    desired=R.from_matrix(hip[:3,:3]@hand_rotation)
    palm=(hip@np.array([side*.18,1.045,.19,1]))[:3]
    pole=(hip@np.array([side*.30,1.17,-.03,1]))[:3]
    solve(tr,t,k,rot,chain,palm-desired.apply([0,.08,0]),pole,desired)
    for j in chain:rot[j][k]=mix(saved[j],R.from_quat(rot[j][k]),amount).as_quat()

reports=[]
for clip in list(g['animations']):
 tr=copy.deepcopy(d['tracks'](clip));dur=max(x[2][-1]for x in tr);ts=tr[0][2];n=len(ts)
 # Close only the small measured endpoint mismatch, over the final 0.3 seconds.
 ease=smooth((ts-(dur-.3))/.3)
 for node,path,_,z in tr:
  if path=='rotation':delta=R.from_quat(z[0])*R.from_quat(z[-1]).inv();z[:]=(R.from_rotvec(ease[:,None]*delta.as_rotvec())*R.from_quat(z)).as_quat()
  else:z+=ease[:,None]*(z[0]-z[-1])
 gait=None
 if clip['name'].startswith('Mirror'):mirror_legs_pass(tr,ts)
 else:
  from cathexis_red_carpet import rebuild_red_carpet
  gait=rebuild_red_carpet(d,tr,ts)
 if clip['name'].startswith('Mirror'):hands_pass(tr,ts)
 worlds=[d['world_at'](tr,t)for t in ts];ground=np.array([.002-points(w)[:,1].min()for w in worlds]);ground=gaussian_filter1d(ground,1.5,mode='wrap');ground[-1]=ground[0]
 drapes,record=drape_matrices(d,tr,ts,levels,cloth,legs,points,clearance_floor=.10,clearance_padding=.025 if clip['name'].startswith('Mirror') else .100,max_angle=.72)
 for node,path,_,z in tr:
  if node==22 and path=='translation':z[:,1]+=ground*100
 out={'name':clip['name'].replace('_Source','_Corrected'),'channels':[],'samplers':[]};ta=add(ts,'SCALAR')
 def channel(node,path,z):
  z=np.array(z);z[-1]=z[0]
  if path=='rotation':
   for k in range(1,len(z)):
    if np.dot(z[k-1],z[k])<0:z[k]*=-1
  si=len(out['samplers']);out['samplers'].append({'input':ta,'output':add(z,'VEC4'if path=='rotation'else 'VEC3'),'interpolation':'LINEAR'});out['channels'].append({'sampler':si,'target':{'node':node,'path':path}})
 for node,path,_,z in tr:channel(node,path,z)
 for i,node in enumerate(newnodes):
  m=drapes[:,i].copy();m[:,1,3]+=ground
  for path,z in [('rotation',R.from_matrix(m[:,:3,:3]).as_quat()),('translation',m[:,:3,3]*100),('scale',np.tile([100*(1+.24*np.clip((1.02-levels[i])/.65,0,1)),100,100],(n,1)))]:channel(node,path,z)
 g['animations'].append(out);reports.append({'clip':out['name'],'maxGroundAdjustmentM':float(abs(ground).max()),'drape':record,**({'gait':gait}if gait else {})});print(reports[-1],flush=True)
g['buffers']=[{'byteLength':len(data)}];j=json.dumps(g,separators=(',',':')).encode();j+=b' '*((-len(j))%4);data+=b'\0'*((-len(data))%4);output.write_bytes(struct.pack('<4sII',b'glTF',2,28+len(j)+len(data))+struct.pack('<I4s',len(j),b'JSON')+j+struct.pack('<I4s',len(data),b'BIN\0')+data);output.with_suffix('.authoring.json').write_text(json.dumps(reports,indent=2))
