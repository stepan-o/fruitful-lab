"""Transfer the existing LIMEN performance bank to a regenerated humanoid body.

Both skeletons are reconstructed from inverse bind matrices. Local rest-pose
axes and units can differ; world-space rotational deltas carry the performance.
The untouched source and the candidate's original rig stay separate.
"""
import argparse,hashlib,json
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation as R,Slerp
from cathexis_motion_math import context,mat
from opening_worker_io import Writer

def rot(m):return m[...,:3,:3]/np.linalg.norm(m[...,:3,:3],axis=-2)[...,None,:]
def hierarchy(nodes):
 p={c:i for i,n in enumerate(nodes)for c in n.get('children',[])};order=[]
 def visit(i):
  order.append(i)
  for c in nodes[i].get('children',[]):visit(c)
 for i in range(len(nodes)):
  if i not in p:visit(i)
 return p,order

def bind(d):
 w=d['world_at']([],0)
 for k,i in enumerate(d['sk']['joints']):w[i]=np.linalg.inv(d['ib'][k])
 return w

def samples(d,a):
 tr=d['tracks'](a);end=max(t[-1]for _,_,t,_ in tr);times=np.linspace(0,end,max(2,round(end*30)+1));nodes=d['g']['nodes']
 local=np.tile(np.array([mat(n)for n in nodes]),(len(times),1,1,1))
 for i,kind,t,v in tr:
  if kind=='rotation':local[:,i,:3,:3]=Slerp(t,R.from_quat(v))(np.clip(times,t[0],t[-1])).as_matrix()*np.linalg.norm(local[:,i,:3,:3],axis=1)[:,None,:]
  elif kind=='translation':local[:,i,:3,3]=np.array([np.interp(times,t,v[:,k])for k in range(3)]).T
  elif kind=='scale':local[:,i,:3,:3]=rot(local[:,i])*np.array([np.interp(times,t,v[:,k])for k in range(3)]).T[:,None,:]
 p,order=hierarchy(nodes);world=local.copy()
 for i in order:
  if i in p:world[:,i]=world[:,p[i]]@local[:,i]
 return times,world

ap=argparse.ArgumentParser();ap.add_argument('source',type=Path);ap.add_argument('rig',type=Path);ap.add_argument('output',type=Path);a=ap.parse_args()
s,d=context(a.source),context(a.rig);sb,tb=bind(s),bind(d);sr,tr=rot(sb),rot(tb);sn={n.get('name'):i for i,n in enumerate(s['g']['nodes'])};tn={n.get('name'):i for i,n in enumerate(d['g']['nodes'])};nodes=d['g']['nodes'];p,order=hierarchy(nodes)
rename={'Spine02':'Spine','Spine01':'Spine1','Spine':'Spine2','neck':'Neck','head_end':'HeadTop_End'}
matched={i:sn['mixamorig:'+rename.get(nodes[i]['name'],nodes[i]['name'])]for i in d['sk']['joints']if 'mixamorig:'+rename.get(nodes[i]['name'],nodes[i]['name'])in sn}
assert len(matched)>=22,f'Only {len(matched)} mapped joints'
localbind=np.array([np.linalg.inv(tb[p[i]])@tb[i]if i in p else tb[i]for i in range(len(nodes))]);jointscales=np.linalg.norm(localbind[:,:3,:3],axis=1)
leg=lambda w,n:sum(np.linalg.norm(w[n[x],:3,3]-w[n[y],:3,3])for x,y in [('LeftUpLeg','LeftLeg'),('LeftLeg','LeftFoot')])
ss={k.replace('mixamorig:',''):v for k,v in sn.items()};sourceleg=leg(sb,ss);targetleg=leg(tb,tn);hip=tn['Hips'];sourcehip=ss['Hips']
writer=Writer(d);writer.g['animations']=[];records=[]
for clip in s['g']['animations']:
 times,sw=samples(s,clip);swr=rot(sw);local=np.tile(localbind,(len(times),1,1,1));world=local.copy();tracks=[]
 animatedleg=np.linalg.norm(sw[:,ss['LeftUpLeg'],:3,3]-sw[:,ss['LeftLeg'],:3,3],axis=1)+np.linalg.norm(sw[:,ss['LeftLeg'],:3,3]-sw[:,ss['LeftFoot'],:3,3],axis=1)
 scale=animatedleg/sourceleg
 for i in order:
  pw=world[:,p[i]]if i in p else np.broadcast_to(np.eye(4),(len(times),4,4))
  if i in matched:
   si=matched[i];desired=swr[:,si]@sr[si].T@tr[i];lr=np.swapaxes(rot(pw),-1,-2)@desired
   local[:,i,:3,:3]=lr*jointscales[i][None,None,:]
   if i==hip:
    position=tb[i,:3,3]+(sw[:,sourcehip,:3,3]-sb[sourcehip,:3,3]*scale[:,None])*(targetleg/animatedleg)[:,None]
    local[:,i,:3,3]=np.linalg.solve(pw[:,:3,:3],(position-pw[:,:3,3])[...,None])[...,0]
    tracks.append((i,'translation',local[:,i,:3,3]))
   tracks.append((i,'rotation',R.from_matrix(lr).as_quat()))
  world[:,i]=pw@local[:,i]
 writer.clip(clip['name'],times,tracks,{'source':'LIMEN existing performance bank','mapping':'inverse-bind world rotation','contactAcceptance':'pending on rebuilt proportions'})
 records.append({'clip':clip['name'],'seconds':float(times[-1]),'frames':len(times),'sourceScaleRange':[float(scale.min()),float(scale.max())]})
 print(clip['name'],flush=True)
writer.g['asset']['extras']={'revision':'limen-landing-body/3','sourceRigSha256':hashlib.sha256(a.rig.read_bytes()).hexdigest(),'sourceMotionSha256':hashlib.sha256(a.source.read_bytes()).hexdigest(),'contactAcceptance':'pending','fingerArticulation':False}
writer.save(a.output)
a.output.with_suffix('.json').write_text(json.dumps({'revision':'limen-landing-body/3','mappedJoints':len(matched),'joints':len(d['sk']['joints']),'legRatio':targetleg/sourceleg,'clips':records,'source':writer.g['asset']['extras']},indent=2)+'\n')
