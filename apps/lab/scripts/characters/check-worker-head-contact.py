"""Validate palm-led contact, bounded elbows/wrists, and a relaxed free arm at 120 Hz."""
from worker_motion import *
from worker_acting import unit
import argparse,hashlib
p=argparse.ArgumentParser(description=__doc__);p.add_argument('asset',type=Path);p.add_argument('output',type=Path);args=p.parse_args()
b=Worker(args.asset,True);clip=next(c for c in b.g['animations']if c['name']=='Confused_Scratch_Corrected')
localhand=np.c_[b.skin(b.bind),np.ones(len(b.skin(b.bind)))]@np.linalg.inv(b.bind[26]).T
ji=b.d['sk']['joints'].index(26);rigid=(b.w*(b.j==ji)).sum(1)>.95
pf=b.f[np.all(rigid[b.f],axis=1)];pv=localhand[:,:3]
origin=np.array([-10,9.5,1.0]);ray=np.array([1.,0,0]);a=pv[pf[:,0]];e1=pv[pf[:,1]]-a;e2=pv[pf[:,2]]-a
q=np.cross(np.broadcast_to(ray,e2.shape),e2);det=np.einsum('ij,ij->i',e1,q);inv=np.divide(1.,det,out=np.zeros_like(det),where=abs(det)>1e-9)
d=origin-a;u=np.einsum('ij,ij->i',d,q)*inv;r=np.cross(d,e1);v=r@ray*inv;depth=np.einsum('ij,ij->i',e2,r)*inv
ids=np.flatnonzero((abs(det)>1e-9)&(u>=0)&(v>=0)&(u+v<=1)&(depth>0));ix=ids[np.argmax(depth[ids])]
palm_ids=pf[ix];palm_weights=np.array([1-u[ix]-v[ix],u[ix],v[ix]]);palm_normal=unit(np.cross(e1[ix],e2[ix]));palm_normal*=np.sign(palm_normal@ray)

# True point-to-triangle distance avoids a sparse-vertex proximity measurement.
def surface_gap(point,triangles):
 a,z,c=triangles.transpose(1,0,2);ab=z-a;ac=c-a;ap=point-a
 n=np.cross(ab,ac);n2=np.einsum('ij,ij->i',n,n);dot=np.einsum('ij,ij->i',ap,n)
 projection=ap-n*np.divide(dot,n2,out=np.zeros_like(dot),where=n2>1e-14)[:,None]
 aa=np.einsum('ij,ij->i',ab,ab);bb=np.einsum('ij,ij->i',ac,ac);cc=np.einsum('ij,ij->i',ab,ac)
 d=np.einsum('ij,ij->i',projection,ab);e=np.einsum('ij,ij->i',projection,ac);den=aa*bb-cc*cc
 u=np.divide(bb*d-cc*e,den,out=np.zeros_like(den),where=abs(den)>1e-14);vv=np.divide(aa*e-cc*d,den,out=np.zeros_like(den),where=abs(den)>1e-14)
 inside=(u>=0)&(vv>=0)&(u+vv<=1)&(n2>1e-14)
 distances=np.where(inside,np.abs(dot)/np.sqrt(np.maximum(n2,1e-14)),np.inf)
 for x,y in [(a,z),(z,c),(c,a)]:
  edge=y-x;alpha=np.clip(np.einsum('ij,ij->i',point-x,edge)/np.maximum(np.einsum('ij,ij->i',edge,edge),1e-14),0,1)
  distances=np.minimum(distances,np.linalg.norm(point-x-edge*alpha[:,None],axis=1))
 return float(distances.min())
ts,l,w=b.sample(clip,120);gaps=[];elbow=[];wrist=[];free=[];vel=[]
for k,t in enumerate(ts):
 q=w[k];v=b.skin(q);gaps.append(surface_gap(palm_weights@v[palm_ids],v[b.reg['head']]))
 s,e,h=q[[19,22,26],:3,3];elbow.append(float(np.degrees(np.arccos(np.clip(unit(e-s)@unit(h-e),-1,1)))))
 wrist.append(float(np.degrees(np.arccos(np.clip(unit(q[26,:3,1])@unit(h-e),-1,1)))))
 free.append(float(np.degrees(np.arccos(np.clip(unit(q[25,:3,1])@unit(q[25,:3,3]-q[21,:3,3]),-1,1)))))
 if k:
  for n in [18,21,25,19,22,26]:
   a=l[k-1,n,:3,:3];z=l[k,n,:3,:3];a=a/np.linalg.norm(a,axis=0);z=z/np.linalg.norm(z,axis=0)
   vel.append(float(np.degrees(R.from_matrix(z@a.T).magnitude())/(ts[k]-ts[k-1])))
beats=[]
for name,start,end in [('first palm scratch',.9,2.22),('palm rest',3.1,4.15),('second palm scratch',7.78,8.9)]:
 mask=(ts>=start)&(ts<=end);d=np.array(gaps)[mask];wr=np.array(wrist)[mask]
 assert d.max()<.015,(name,'palm gap',d.max());assert wr.max()<55,(name,'wrist bend',wr.max())
 beats.append({'name':name,'start':start,'end':end,'samples':len(d),'minimumGapMetres':float(d.min()),'maximumGapMetres':float(d.max()),'maximumWristBendDegrees':float(wr.max())})
assert max(elbow)<130.1,max(elbow)
assert max(wrist)<55,max(wrist)
assert max(free)<20,max(free)
source=next(c for c in b.g['animations']if c['name']=='Confused_Scratch');_,sl,_=b.sample(source,120);source_speed=[]
for n in [18,21,25,19,22,26]:
 r=sl[:,n,:3,:3];r=r/np.linalg.norm(r,axis=1)[:,None,:]
 source_speed.extend(np.degrees(R.from_matrix(r[1:]@r[:-1].transpose(0,2,1)).magnitude())/np.diff(ts))
assert max(vel)<=max(source_speed)*1.05,('New joint-speed spike',max(vel),max(source_speed))
r={'sha256':hashlib.sha256(args.asset.read_bytes()).hexdigest(),'sampleRate':120,'method':'Central palm surface point (a barycentric point on a real hand triangle, fingers excluded), measured against all head triangles within 15 mm during all three holds. Full-clip elbow flexion <=130 degrees, wrist bend <55 degrees, contact-hold wrist bend <55 degrees, free wrist <20 degrees; joint speed may not exceed the original maximum by more than 5% (the source has a fast final arm drop). Skinned collision audit remains separate. These gates do not replace owner visual review.','palmOnlyLandmarks':len(palm_ids),'maximumElbowFlexionDegrees':max(elbow),'maximumWristBendDegrees':max(wrist),'maximumFreeWristBendDegrees':max(free),'maximumSourceArmJointSpeedDegreesPerSecond':float(max(source_speed)),'maximumArmJointSpeedDegreesPerSecond':max(vel),'beats':beats}
args.output.write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))
