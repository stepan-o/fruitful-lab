from worker_motion import *
import hashlib,time
import argparse
parser=argparse.ArgumentParser(description='Check source and corrected exported worker meshes at 120 Hz.')
parser.add_argument('--resume',action='store_true');parser.add_argument('asset',type=Path);parser.add_argument('output',type=Path);args=parser.parse_args();path=args.asset
b=Worker(path);fixed=Worker(path,True);report={'revision':'worker-head-contact-v5','sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'sampleRate':120,'method':'Exported skinned mesh checked at 120 Hz across legs, opposite forearms, hands/head, forearms/torso and hands/legs. Interior triangle crossings; Electrocuted Fall also checks both complete hands against the fixed Y=0 floor. Not swept-volume, coplanar, prop-contact or transition certification.','clips':[]}
if args.resume and args.output.exists():
 prior=json.loads(args.output.read_text());assert prior['sha256']==report['sha256'];report=prior
notes={'injured_walk':'Right palm follows and braces the injured thigh throughout the limp.','Agree_Gesture':'Opposing palms close for two claps; fingers open during the contact beats.','Angry_Stomp':'Arms fold at separate heights and depths; the front elbow lowers before uncrossing.','idle':'Relaxed finger curl and inward-facing palms; forearm twist is shared with the wrist.','Hot_Walk':'Preserves the hip-led source reference. CATHEXIS has her own approved gait.','Confused_Scratch':'Fingertips follow the moving scalp for both scratch beats; the middle gesture rests its palm at the temple. A source-derived elbow hinge and separate contact targets replace fixed wrist offsets.','Catching_Breath':'Keeps the running approach and recovery. This is not yet a stationary overheating idle.','Electrocuted_Fall':'Left arm rebuilt from source elbow/wrist curves; smooth shoulder lift clears the fixed floor without twisting the palm. Right-hand correction and source fall travel retained.','Carry_Heavy_Object_Walk_inplace':'Preserves the carry gesture with a relaxed holding curl. Actual prop grips still need alignment.'}
for c in b.g['animations']:
 if any(r['id']==c['name']for r in report['clips']):continue
 if c['name'].endswith('_Corrected')or c['name'].startswith('Hand_'):continue
 new=next(a for a in fixed.g['animations']if a['name']==c['name']+'_Corrected');ts,_,oldws=b.sample(c,120);_,_,newws=fixed.sample(new,120);old=[];newcounts=[];floor=[]
 for k,(ow,nw)in enumerate(zip(oldws,newws)):
  old.append(b.contacts(b.skin(ow)));v=fixed.skin(nw);newcounts.append(fixed.contacts(v))
  if c['name']=='Electrocuted_Fall':floor.append([float(v[fixed.region_ids[key],1].min())for key in ['handL','handR']])
 old=np.array(old);newcounts=np.array(newcounts);bad=np.any(newcounts>0,axis=1);r={'id':c['name'],'samples':len(ts),'sourceContactFrames':int(np.any(old>0,axis=1).sum()),'correctedContactFrames':int(bad.sum()),'note':notes.get(c['name'],'Baked clearance correction with source timing and knee articulation retained; relaxed finger posture on the corrected rig.'),'regions':{a+'/'+z:{'sourceFrames':int((old[:,i]>0).sum()),'correctedFrames':int((newcounts[:,i]>0).sum()),'maxCorrectedTriangles':int(newcounts[:,i].max())}for i,(a,z)in enumerate(b.pairs)},'remainingTimes':[round(float(t),4)for t in ts[bad]]}
 if floor:r['floor']={'planeY':0,'leftHandMinimumMetres':float(np.array(floor)[:,0].min()),'rightHandMinimumMetres':float(np.array(floor)[:,1].min()),'penetratingFrames':int(np.any(np.array(floor)<-.001,axis=1).sum()),'toleranceMetres':.001}
 report['clips'].append(r);args.output.write_text(json.dumps(report,indent=2));print(r['id'],r['samples'],r['sourceContactFrames'],r['correctedContactFrames'],r['remainingTimes'][:10],flush=True)
