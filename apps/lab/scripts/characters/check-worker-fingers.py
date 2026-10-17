from worker_motion import *
import argparse
p=argparse.ArgumentParser(description='Check digit separation through all three exported hand studies.');p.add_argument('asset',type=Path);args=p.parse_args()
b=Worker(args.asset,True);dom=np.array(b.d['sk']['joints'])[b.j[np.arange(len(b.v)),b.w.argmax(1)]];out=[]
for hand in ['Left','Right']:
 for i,digit in enumerate(['Thumb','Index','Middle','Ring','Little']):
  joint=next(n for n,node in enumerate(b.nodes)if node.get('name')==hand+digit);b.reg[hand+str(i)]=np.ascontiguousarray(b.f[np.all((dom==joint)[b.f],axis=1)]);b.region_ids[hand+str(i)]=np.unique(b.reg[hand+str(i)])
pairs=[(h+str(i),h+str(j))for h in ['Left','Right']for i in range(5)for j in range(i+1,5)]
for c in b.g['animations']:
 if not c['name'].startswith('Hand_'):continue
 ts,_,ws=b.sample(c,60);hits=[b.contacts(b.skin(w),pairs)for w in ws];count=np.count_nonzero(np.any(hits,axis=1));print(c['name'],len(ts),'samples',count,'crossings',flush=True);assert count==0
