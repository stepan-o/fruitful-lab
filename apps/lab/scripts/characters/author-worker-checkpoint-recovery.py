from pathlib import Path
import sys,json,hashlib
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'scripts/characters'))
from worker_motion import Worker,R,Slerp,np,mat,context
wp=ROOT/'public/media/files/f353652a8d3c12020cf3ad2ae10fada37b543f673ae66238e9374bdfa6f52da9.glb'
lp=ROOT/'public/media/files/730fcb9d3bbce10e59ed343d2de4dd34a49e7a1d112d82a078152d74dcd2d2cd.glb'
w=Worker(wp,True);s=context(lp);sn=s['g']['nodes'];sb=s['world_at']([],0);ns={n.get('name'):i for i,n in enumerate(sn)};joints=w.d['sk']['joints'];hips=joints[0]
def rot(m):return R.from_matrix(m[:3,:3]/np.linalg.norm(m[:3,:3],axis=0)).as_matrix()
tr=s['tracks'](next(a for a in s['g']['animations']if a['name']=='Arise'))
fall=w.d['world_at'](w.d['tracks'](next(a for a in w.g['animations']if a['name']=='Electrocuted_Fall_Corrected')),6.333333)
idle=w.d['world_at'](w.d['tracks'](next(a for a in w.g['animations']if a['name']=='idle_Corrected')),0)
def local(world):return np.array([np.linalg.inv(world[w.parent[i]])@world[i]if i in w.parent else world[i]for i in range(len(w.nodes))])
f=local(fall);rest=local(idle)
def retarget(t):
 sw=s['world_at'](tr,t);out=np.array([mat(n)for n in w.nodes]);world=w.world(out)
 for i in w.order:
  if i not in joints:continue
  name=w.nodes[i].get('name','');si=ns.get('mixamorig:'+name)
  if si is None:continue
  desired=rot(sw[si])@rot(sb[si]).T@rot(w.bind[i]);parent=w.parent.get(i)
  out[i,:3,:3]=(rot(world[parent]).T if parent is not None else np.eye(3))@desired*np.linalg.norm(out[i,:3,:3],axis=0)
  world=w.world(out)
 return out

def mix(a,b,t):
 out=a.copy()
 for i in joints:
  out[i,:3,:3]=Slerp([0,1],R.from_matrix([rot(a[i]),rot(b[i])]))([t]).as_matrix()[0]*np.linalg.norm(a[i,:3,:3],axis=0)
  out[i,:3,3]=a[i,:3,3]*(1-t)+b[i,:3,3]*t
 return out
smooth=lambda t:t*t*(3-2*t)
frames=[];floor=[]
for time in np.linspace(0,4.8,145):
 if time<.55:o=mix(f,retarget(0),smooth(time/.55))
 elif time<4.05:o=retarget((time-.55)/3.5*1.8)
 else:o=mix(retarget(1.8),rest,smooth((time-4.05)/.75))
 # Exported recovery resets non-joint source curves; bake their floor displacement into Hips.
 for i,n in enumerate(w.nodes):
  if i not in joints:o[i]=mat(n)
 o[hips,0:2,3]=0
 world=w.world(o);v=w.skin(world);offset=-v[:,1].min()+.002
 # Parent converts local Z centimetres into world Y metres.
 p=world[w.parent[hips],:3,:3];o[hips,:3,3]+=np.linalg.solve(p,[0,offset,0])
 world=w.world(o);floor.append(float(w.skin(world)[:,1].min()));frames.append(o)
a=np.array(frames)
tracks=[{'joint':w.nodes[i]['name'],'rotation':np.round(R.from_matrix(np.array([rot(v[i])for v in a])).as_quat(),6).tolist()}for i in joints]
tracks.append({'joint':w.nodes[hips]['name'],'position':np.round(a[:,hips,:3,3],6).tolist()})
out={'revision':'checkpoint-get-up/1','seconds':4.8,'fps':30,'sources':{'worker':hashlib.sha256(wp.read_bytes()).hexdigest(),'limenArise':hashlib.sha256(lp.read_bytes()).hexdigest()},'method':'Bind-space retarget of LIMEN Arise, floor-normalized on the worker mesh, with fall/idle transitions. Provisional recovery; not a newly captured worker take.','minimumFloor':min(floor),'tracks':tracks}
(ROOT/'lib/loopforge/agents/worker-checkpoint-recovery.json').write_text(json.dumps(out,separators=(',',':'))+'\n')
print('Recovery frames',len(frames),'minimum floor',min(floor))
