"""Prepare candidate worker motion banks in bind space; never edits source exports.

This is an intake bake, not contact approval. Per-character fitting follows the
first review, especially hands, wide forearms, floor contact and recovery.
"""
import argparse, copy, hashlib, json, struct
from pathlib import Path
import numpy as np
from scipy.spatial.transform import Rotation, Slerp
from cathexis_motion_math import context, mat

APP=Path(__file__).resolve().parents[2]
SOURCE=APP/'public/media/files/f353652a8d3c12020cf3ad2ae10fada37b543f673ae66238e9374bdfa6f52da9.glb'

def rotation(m):
    return m[..., :3, :3]/np.linalg.norm(m[..., :3, :3],axis=-2)[...,None,:]

def hierarchy(nodes):
    parents={c:i for i,n in enumerate(nodes) for c in n.get('children',[])}
    order=[]
    def visit(i):
        order.append(i)
        for c in nodes[i].get('children',[]):visit(c)
    for i in range(len(nodes)):
        if i not in parents:visit(i)
    return parents,order

def sample(d,clip,hz=30):
    tracks=d['tracks'](clip);end=max(t[-1] for _,_,t,_ in tracks)
    times=np.linspace(0,end,max(2,round(end*hz)+1))
    local=np.tile(np.array([mat(n) for n in d['g']['nodes']]),(len(times),1,1,1))
    for node,kind,t,v in tracks:
        if kind=='rotation':
            local[:,node,:3,:3]=Slerp(t,Rotation.from_quat(v))(np.clip(times,t[0],t[-1])).as_matrix()*np.linalg.norm(local[:,node,:3,:3],axis=1)[:,None,:]
        elif kind=='translation':local[:,node,:3,3]=np.array([np.interp(times,t,v[:,k])for k in range(3)]).T
        elif kind=='scale':
            scale=np.array([np.interp(times,t,v[:,k])for k in range(3)]).T
            local[:,node,:3,:3]=rotation(local[:,node])*scale[:,None,:]
    parent,order=hierarchy(d['g']['nodes']);world=local.copy()
    for i in order:
        if i in parent:world[:,i]=world[:,parent[i]]@local[:,i]
    return times,world

from opening_worker_io import Writer

ap=argparse.ArgumentParser();ap.add_argument('directory',type=Path);ap.add_argument('--workers',nargs='+',default='bob sam ed jo gus max mae kit lou ben'.split());args=ap.parse_args()
source=context(SOURCE);sb=source['world_at']([],0);srot=rotation(sb);sn={n.get('name'):i for i,n in enumerate(source['g']['nodes'])};source_hip=sn['Hips']
source_leg=np.linalg.norm(sb[sn['LeftUpLeg'],:3,3]-sb[sn['LeftLeg'],:3,3])+np.linalg.norm(sb[sn['LeftLeg'],:3,3]-sb[sn['LeftFoot'],:3,3])
source_clips=[]
for clip in source['g']['animations']:
    if clip['name'].endswith('_Corrected'):
        times,world=sample(source,clip);source_clips.append((clip['name'].removesuffix('_Corrected'),times,world,rotation(world)))
for name in args.workers:
    directory=args.directory/name;path=directory/(name+'-rig-current-v1.glb');d=context(path);tb=d['world_at']([],0);trot=rotation(tb);nodes=d['g']['nodes'];tn={n.get('name'):i for i,n in enumerate(nodes)};parents,order=hierarchy(nodes)
    joints=d['sk']['joints'];writer=Writer(d);writer.g['animations'][0]['name']='Rig_Source'
    target_leg=np.linalg.norm(tb[tn['LeftUpLeg'],:3,3]-tb[tn['LeftLeg'],:3,3])+np.linalg.norm(tb[tn['LeftLeg'],:3,3]-tb[tn['LeftFoot'],:3,3]);ratio=target_leg/source_leg
    matched={i:sn[nodes[i]['name']] for i in joints if nodes[i].get('name') in sn}
    assert len(matched)==24,f'{name}: unmapped skeleton'
    records=[]
    for clip,times,sw,swr in source_clips:
        # Some accepted source clips animate a uniform skeleton scale. Normalize
        # their actual chain lengths before transferring pelvis displacement.
        animated_leg=np.linalg.norm(sw[:,sn['LeftUpLeg'],:3,3]-sw[:,sn['LeftLeg'],:3,3],axis=1)+np.linalg.norm(sw[:,sn['LeftLeg'],:3,3]-sw[:,sn['LeftFoot'],:3,3],axis=1)
        source_scale=animated_leg/source_leg
        clip_ratio=target_leg/animated_leg
        local=np.tile(np.array([mat(n)for n in nodes]),(len(times),1,1,1));world=local.copy();tracks=[]
        for i in order:
            parent=parents.get(i);pw=world[:,parent] if parent is not None else np.broadcast_to(np.eye(4),(len(times),4,4))
            if i in matched:
                si=matched[i];desired=swr[:,si]@srot[si].T@trot[i]
                lr=np.swapaxes(rotation(pw),-1,-2)@desired
                local[:,i,:3,:3]=lr*np.linalg.norm(local[:,i,:3,:3],axis=1)[:,None,:]
                if i==tn['Hips']:
                    position=tb[i,:3,3]+(sw[:,source_hip,:3,3]-sb[source_hip,:3,3]*source_scale[:,None])*clip_ratio[:,None]
                    local[:,i,:3,3]=np.linalg.solve(pw[:,:3,:3],(position-pw[:,:3,3])[...,None])[...,0]
                    tracks.append((i,'translation',local[:,i,:3,3]))
                tracks.append((i,'rotation',Rotation.from_matrix(lr).as_quat()))
            world[:,i]=pw@local[:,i]
        writer.clip(clip,times,tracks,{'origin':'Worker 01 accepted bank','status':'retarget-candidate','contactValidated':False})
        records.append({'id':clip,'seconds':float(times[-1]),'frames':len(times),'sourceScaleRange':[float(source_scale.min()),float(source_scale.max())]})
    # Preserve both free native animation exports as comparison takes on this rig.
    for kind in ['walking','running']:
        native=context(directory/(name+'-'+kind+'-current-v1.glb'));a=native['g']['animations'][0];tr=native['tracks'](a);end=max(t[-1]for _,_,t,_ in tr);times=np.linspace(0,end,round(end*30)+1);tracks=[]
        for i,channel,t,v in tr:
            dest=tn.get(native['g']['nodes'][i].get('name'))
            if dest is None:continue
            values=Slerp(t,Rotation.from_quat(v))(np.clip(times,t[0],t[-1])).as_quat() if channel=='rotation' else np.array([np.interp(times,t,v[:,k])for k in range(v.shape[1])]).T
            tracks.append((dest,channel,values))
        writer.clip('Meshy_'+kind.title(),times,tracks,{'origin':'Meshy rig companion','status':'source'})
    writer.g['asset']['extras']={'openingCast':name,'revision':'motion-intake/1','sourceSha256':hashlib.sha256(path.read_bytes()).hexdigest(),'motionSourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'fingerArticulation':False,'contactValidation':'pending'}
    writer.save(directory/(name+'-motion-candidate-v1.glb'))
    (directory/'motion-intake-v1.json').write_text(json.dumps({'worker':name,'joints':len(joints),'retargetedClips':records,'nativeClips':['Rig_Source','Meshy_Walking','Meshy_Running'],'legLengthRatio':ratio,'status':'candidate — no per-character contact acceptance','fingers':'rigid at palm; source finger tracks not transferred'},indent=2)+'\n')
    print(name,'baked',len(writer.g['animations']),'clips; contacts pending',flush=True)
