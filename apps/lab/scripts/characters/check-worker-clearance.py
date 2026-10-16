from worker_motion import *
import hashlib,time
import argparse
parser=argparse.ArgumentParser(description='Check source and corrected exported worker meshes at 120 Hz.')
parser.add_argument('asset',type=Path);parser.add_argument('output',type=Path);args=parser.parse_args();path=args.asset
b=Worker(path);fixed=Worker(path,True);report={'revision':'worker-cleanup-v2','sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'sampleRate':120,'method':'Exported skinned mesh checked at 120 Hz across legs, opposite forearms, hands/head, forearms/torso and hands/legs. Interior triangle crossings; not swept-volume, coplanar, prop-contact or transition certification.','clips':[]}
notes={'Hot_Walk':'Preserves the hip-led source reference. CATHEXIS has her own approved gait.','Confused_Scratch':'Preserves the puzzled scratch; separates boots and clears the resting hand from the thigh.','Catching_Breath':'Keeps the running approach and recovery. This is not yet a stationary overheating idle.','Electrocuted_Fall':'Preserves collapse and source travel; one-shot. Floor/prop staging remains a scene integration check.','Carry_Heavy_Object_Walk_inplace':'Preserves the carry gesture with a relaxed holding curl. Actual prop grips still need alignment.'}
for c in b.g['animations']:
 if c['name'].endswith('_Corrected')or c['name'].startswith('Hand_'):continue
 new=next(a for a in fixed.g['animations']if a['name']==c['name']+'_Corrected');ts,_,oldws=b.sample(c,120);_,_,newws=fixed.sample(new,120);old=[];newcounts=[]
 for k,(ow,nw)in enumerate(zip(oldws,newws)):
  old.append(b.contacts(b.skin(ow)));newcounts.append(fixed.contacts(fixed.skin(nw)))
 old=np.array(old);newcounts=np.array(newcounts);bad=np.any(newcounts>0,axis=1);r={'id':c['name'],'samples':len(ts),'sourceContactFrames':int(np.any(old>0,axis=1).sum()),'correctedContactFrames':int(bad.sum()),'note':notes.get(c['name'],'Baked clearance correction with source timing and knee articulation retained; relaxed finger posture on the corrected rig.'),'regions':{a+'/'+z:{'sourceFrames':int((old[:,i]>0).sum()),'correctedFrames':int((newcounts[:,i]>0).sum()),'maxCorrectedTriangles':int(newcounts[:,i].max())}for i,(a,z)in enumerate(b.pairs)},'remainingTimes':[round(float(t),4)for t in ts[bad]]}
 report['clips'].append(r);args.output.write_text(json.dumps(report,indent=2));print(r['id'],r['samples'],r['sourceContactFrames'],r['correctedContactFrames'],r['remainingTimes'][:10],flush=True)
