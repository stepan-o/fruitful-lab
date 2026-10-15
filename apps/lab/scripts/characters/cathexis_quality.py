"""Export-level arm continuity and standing-foot tests (120 Hz)."""
import numpy as np
from scipy.spatial.transform import Rotation as R
from cathexis_motion_math import cloth_regions


def audit_motion_quality(d):
    g=d['g'];acc=d['acc'];v=d['verts'];f=acc(d['prim']['indices']).astype(int).reshape(-1,3)
    _,legs=cloth_regions(v,f)
    rows=[]
    for clip in g['animations']:
        tr=d['tracks'](clip);duration=max(t[-1]for _,_,t,_ in tr)
        times=np.linspace(0,duration,round(duration*120)+1)
        worlds=np.array([d['world_at'](tr,t)for t in times]);hips=worlds[:,22,:3,3]
        row={'clip':clip['name'],'hipTravelRangeM':np.ptp(hips,axis=0).tolist()}
        if clip['name'].startswith('Hot_Walk'):
            row['rightArmMaxKeyStepDegrees']={d['g']['nodes'][n]['name']:float(np.degrees((R.from_quat(values[1:])*R.from_quat(values[:-1]).inv()).magnitude().max())) for n,kind,_,values in tr if kind=='rotation' and n in (12,13,14)}
        else:
            corrected=clip['name'].endswith('Corrected');skin=g['skins'][int(corrected)];prim=g['meshes'][int(corrected)]['primitives'][0]
            ids=np.flatnonzero(legs&(v[:,1]<.08));vh=np.c_[v[ids],np.ones(len(ids))];js=acc(prim['attributes']['JOINTS_0']).astype(int)[ids];ws=acc(prim['attributes']['WEIGHTS_0'])[ids];ib=acc(skin['inverseBindMatrices']).reshape(-1,4,4).transpose(0,2,1)
            positions=[]
            for world in worlds:
                matrices=world[skin['joints']]@ib
                positions.append(sum(np.einsum('nij,nj->ni',matrices[js[:,k]],vh)*ws[:,k,None]for k in range(4))[:,:3])
            p=np.array(positions);row['soleSamples']=len(times);row['soleVertices']=len(ids)
            row['maxSoleDriftM']=float(np.linalg.norm(p-p[0],axis=2).max());row['soleMinM']=float(p[:,:,1].min());row['soleMaxOfMinM']=float(p[:,:,1].min(axis=1).max())
            row['legacyPelvisCentredFootSlideM']=float(np.linalg.norm((p-p[0])[:,:,[0,2]]-(hips-hips[0])[:,None,[0,2]],axis=2).max())
        rows.append(row)
    return rows
