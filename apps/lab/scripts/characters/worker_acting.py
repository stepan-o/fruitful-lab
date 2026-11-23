"""Contact-aware Worker acting. Offline two-bone solves; no per-frame runtime IK.

Targets are anatomical, not collision-avoidance pushes: scalp scratch, thigh brace,
palm-to-palm clap, staggered crossed arms and a supported collapse. The incoming
clearance pass remains the baseline for lower-body motion and source timing.
"""
from worker_motion import *
from worker_correct import swing

ARMS={'L':(18,21,25,1),'R':(19,22,26,-1)}

def unit(v):
 return v/max(np.linalg.norm(v),1e-10)
def smooth(x):
 x=np.clip(x,0,1);return x*x*(3-2*x)
def window(t,a,b,c,d):
 return smooth((t-a)/(b-a))*(1-smooth((t-c)/(d-c)))
def frame(w,b,node=3):
 m=w[node,:3,:3]@np.linalg.inv(b.bind[node,:3,:3]);return R.from_matrix(m/np.linalg.norm(m,axis=0)).as_matrix()
def palm_frame(normal,fingers,side):
 x=-side*unit(normal);y=unit(fingers-x*np.dot(fingers,x));z=unit(np.cross(x,y));y=np.cross(z,x);return np.column_stack([x,y,z])
def mix_rotation(a,z,u):
 return a@R.from_rotvec(R.from_matrix(a.T@z).as_rotvec()*u).as_matrix()
def arm(b,w,side,target,pole,orientation=None,weight=1):
 """Solve the wrist with unchanged bone lengths, then blend local rotations."""
 if weight<1e-6:return
 upper,fore,hand,_=ARMS[side];old=w.copy();q=w.copy();s=q[upper,:3,3];e=q[fore,:3,3];h=q[hand,:3,3]
 l1=np.linalg.norm(e-s);l2=np.linalg.norm(h-e);d=target-s;length=np.clip(np.linalg.norm(d),abs(l1-l2)+.002,l1+l2-.006);axis=unit(d);target=s+axis*length
 lateral=unit(pole-s-axis*np.dot(pole-s,axis));along=(l1*l1-l2*l2+length*length)/(2*length);bend=np.sqrt(max(0,l1*l1-along*along));elbow=s+axis*along+lateral*bend
 b.rotate_chain(q,upper,swing(e-s,elbow-s));b.rotate_chain(q,fore,swing(q[hand,:3,3]-q[fore,:3,3],target-q[fore,:3,3]))
 if orientation is not None:
  cur=q[hand,:3,:3];b.rotate_chain(q,hand,orientation@np.linalg.inv(cur/np.linalg.norm(cur,axis=0)))
 # Blend locally so the elbow cannot stretch or drift away from the upper arm.
 for node in [upper,fore,hand]:
  parent=b.parent[node];lo=np.linalg.inv(old[parent])@old[node];ln=np.linalg.inv(q[parent])@q[node];sc=np.linalg.norm(lo[:3,:3],axis=0)
  lo[:3,:3]=mix_rotation(lo[:3,:3]/sc,ln[:3,:3]/np.linalg.norm(ln[:3,:3],axis=0),weight)*sc
  nw=w[parent]@lo;delta=nw[:3,:3]@np.linalg.inv(w[node,:3,:3]);b.rotate_chain(w,node,delta)
 # Parent rotations already preserve all descendant positions.

def palm_target(b,w,side,center,normal,fingers,pole,weight=1):
 sg=ARMS[side][3];rot=palm_frame(normal,fingers,sg)
 # Palm inner face, eight centimetres below the wrist; mesh is authored in cm.
 offset=np.array([-sg*.036,.10,.005]);wrist=center-rot@offset
 arm(b,w,side,wrist,pole,rot,weight)

def relax(b,w,side,amount=1):
 upper,fore,hand,sg=ARMS[side];basis=frame(w,b);h=w[hand,:3,3];hip=w[3,:3,3];
 low=smooth((.19-(h[1]-hip[1]))/.22)*amount
 if low<1e-5:return
 # A loose hand faces the thigh. Keep the source elbow and wrist trajectory.
 normal=basis@np.array([-sg,.03,.12]);direction=unit(w[hand,:3,3]-w[fore,:3,3]);rot=palm_frame(normal,direction,sg)
 # Distribute pronation into the forearm instead of putting all twist at the wrist.
 cur=w[hand,:3,:3];cur=cur/np.linalg.norm(cur,axis=0);delta=rot@cur.T;rv=R.from_matrix(delta).as_rotvec();axis=unit(h-w[fore,:3,3]);twist=axis*np.clip(np.dot(rv,axis),-.65,.65)*low*.65
 b.rotate_chain(w,fore,R.from_rotvec(twist).as_matrix());cur=w[hand,:3,:3];cur=cur/np.linalg.norm(cur,axis=0);b.rotate_chain(w,hand,mix_rotation(cur,rot,low*.7)@cur.T)

def refine(b,ts,local,name):
 world=b.world(local);source=next(c for c in b.g['animations']if c['name']==name);_,_,original=b.sample(source,round((len(ts)-1)/ts[-1]));assert len(original)==len(ts)
 curls=np.full((len(ts),2),34.);curls[:,0]+=2
 if name in ['Carry_Heavy_Object_Walk_inplace','run_fast_10_inplace']:curls[:]=40
 if name in ['Push_Forward_and_Stop','Victory_Cheer']:curls[:]=20
 for k,t in enumerate(ts):
  w=world[k];src=original[k];basis=frame(w,b);x,y,z=basis.T;hip=w[3,:3,3];
  for side in ARMS:relax(b,w,side)
  if name=='Confused_Scratch':
   u=max(window(t,.5,1.1,2.05,2.65),window(t,2.6,3.05,4.25,4.85),window(t,7.35,7.9,8.65,9.25))
   # Fingers curl around the upper-right scalp; keep the face unobscured.
   hb=frame(w,b,20);head=w[20,:3,3];phase=2*np.pi*3.4*t
   contact=head+hb@np.array([-.125,.12+.008*np.sin(phase),.025+.009*np.cos(phase)])
   normal=hb@np.array([.8,-.6,-.05]);direction=hb@np.array([.45,.75,-.15]);rot=palm_frame(normal,direction,-1)
   # Curled fingertips reach the scalp while the palm stays outside it.
   wrist=contact-rot@np.array([.065,.195,.005]);pole=w[19,:3,3]-x*.3+z*.2+y*.12
   arm(b,w,'R',wrist,pole,rot,u);curls[k,1]=34+u*(12+6*np.sin(phase))
  elif name=='injured_walk':
   # Palm travels with the sore right thigh, not the global character root.
   h=w[5,:3,3];knee=w[8,:3,3];axis=unit(knee-h);out=unit(-x*.4+z);mid=h+(knee-h)*.40
   vertices=b.skin(w)[b.region_ids['legR']];near=vertices[np.abs((vertices-mid)@axis)<.035];radius=float(np.max((near-mid)@out))
   center=mid+out*(radius+.008)
   palm_target(b,w,'R',center,-out,axis,w[19,:3,3]-x*.22+z*.12,1);curls[k,1]=18
  elif name=='Agree_Gesture':
   u=max(window(t,3.8,4.25,5.45,5.95),window(t,8.15,8.6,10.1,10.6))
   # Source wrist distance carries the clap rhythm. Use opposing palms, not fists.
   dist=np.linalg.norm(src[25,:3,3]-src[26,:3,3]);gap=np.clip((dist-.075)*.35,0,.15)
   center=(src[25,:3,3]+src[26,:3,3])/2+z*.02
   center[1]=min(center[1],hip[1]+.35)
   for side,sg,ix in [('L',1,0),('R',-1,1)]:
    palm_target(b,w,side,center+x*sg*(gap/2+.004),-x*sg,unit(y+z*.25),w[ARMS[side][0],:3,3]+x*sg*.15-z*.03,u);curls[k,ix]=34*(1-u)+u*7
  elif name=='Angry_Stomp' and t>3.7:
   chest=w[12,:3,3];x,y,z=frame(w,b,12).T
   # Fold one arm before the other; unfold the front arm first. Interpolating
   # two crossed source arm rotations simultaneously would cut through the body.
   for side,sg,ix,dy,depth,enter,leave in [('R',-1,1,.14,.22,(3.9,4.6),(6.95,7.85)),('L',1,0,-.10,.30,(4.15,4.9),(6.7,7.55))]:
    u=window(t,*enter,*leave);rot=palm_frame(-z,unit(-x*sg-y*.05),sg)
    center=chest-x*sg*.16+y*dy+z*depth
    folded=center-rot@np.array([-sg*.036,.10,.005])
    rest=chest+x*sg*.35-y*.45+z*.05
    target=rest*(1-u)+folded*u+z*(.15 if side=='R'else .20)*np.sin(np.pi*u)
    neutral=palm_frame(-x*sg,-y,sg);orientation=mix_rotation(neutral,rot,u)
    pole=chest+x*sg*.42-y*(.32-.18*u)+z*(-.1*u+.2*np.sin(np.pi*u))
    arm(b,w,side,target,pole,orientation,smooth((t-3.7)/.2));curls[k,ix]=34+u*12
   # Lower the front elbow before uncrossing; its arc passes below the back arm.
   drop=window(t,6.6,6.85,7.08,7.6)*.18
   if drop:
    direction=w[25,:3,3]-w[18,:3,3];b.rotate_chain(w,18,swing(direction,direction-y*drop+z*drop*.3))
  elif name=='Electrocuted_Fall':
   # Preserve the fall trajectory; support the body at its actual collision floor.
   u=window(t,3.85,4.65,ts[-1]+1,ts[-1]+2)
   # A fixed ground plane is established by the first pose, not chased every frame.
   if k==0:floor=0.
   if u>0:
    v=b.skin(w);bodyids=np.setdiff1d(np.arange(len(v)),np.r_[b.region_ids['armL'],b.region_ids['armR']]);lift=max(0,floor-float(v[bodyids,1].min()))
    w[:,:3,3]+=np.array([0,lift,0])
    for side,sg,ix in [('L',1,0),('R',-1,1)]:
     hand=ARMS[side][2];center=w[hand,:3,3].copy();center[1]=floor+.019;center+=z*.04
     palm_target(b,w,side,center,np.array([0,-1,0]),unit(np.array([sg*.3,0,1.])),w[ARMS[side][1],:3,3]+np.array([sg*.08,.14,0]),u);curls[k,ix]=34*(1-u)+u*9
 # Recover local transforms. Finger hinges are emitted separately by the baker.
 out=world.copy()
 for n in b.order:
  if n in b.parent:out[:,n]=np.linalg.inv(world[:,b.parent[n]])@world[:,n]
 return out,curls
