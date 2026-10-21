#!/usr/bin/env python3
"""Invoke Meshy MCP through the local keyring launcher, with a cumulative credit ledger.
No API key is read by this client or written to its outputs. Unknown paid outcomes
retain their reservation and must be resolved before another submission.
"""
import argparse, asyncio, datetime, fcntl, hashlib, json, os, re, signal
from pathlib import Path

FREE = {'__list_tools','meshy_check_balance','meshy_list_usage','meshy_list_animations','meshy_list_tasks','meshy_list_models','meshy_get_task_status','meshy_download_model'}
ROOT = Path(__file__).resolve().parents[4]
LEDGER = ROOT / 'docs/loopforge/production/model-briefs/opening-workers/meshy-ledger.json'
LAUNCHER = Path.home() / '.local/bin/loopforge-meshy-mcp'
def clean(s): return re.sub(r'msy_[A-Za-z0-9_-]+','[REDACTED]',s)
def save(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp=path.with_suffix(path.suffix+'.tmp');tmp.write_text(json.dumps(data,indent=2)+'\n');tmp.replace(path)
def payload(result):
    if result.get('structuredContent'): return result['structuredContent']
    for c in result.get('content',[]):
        if c.get('type')=='text':
            try:return json.loads(c['text'])
            except (ValueError,TypeError):pass
    return {}
async def run(a):
    args=json.loads(Path(a.args).read_text()) if a.args else {}
    paid=a.tool not in FREE
    if paid and (a.cost is None or a.cost<=0 or not a.label): raise ValueError('Paid jobs require a cost and label')
    LEDGER.parent.mkdir(parents=True,exist_ok=True)
    with open(str(LEDGER)+'.lock','w') as lock:
        fcntl.flock(lock,fcntl.LOCK_EX)
        ledger=json.loads(LEDGER.read_text()) if LEDGER.exists() else {'cap':500,'currency':'Meshy credits','jobs':[]}
        job=None
        if paid:
            if any(j['state']=='unknown' for j in ledger['jobs']): raise ValueError('Resolve unknown paid submission before another job')
            if any(j['label']==a.label for j in ledger['jobs']): raise ValueError('Label already submitted; inspect existing job')
            used=sum(j.get('actual',j['reserved']) for j in ledger['jobs'])
            if used+a.cost>ledger['cap']:raise ValueError('500-credit total cap would be exceeded')
            job={'label':a.label,'tool':a.tool,'reserved':a.cost,'state':'unknown','created_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'arguments':args,'arguments_sha256':hashlib.sha256(json.dumps(args,sort_keys=True).encode()).hexdigest()}
            ledger['jobs'].append(job);save(LEDGER,ledger)
        p=await asyncio.create_subprocess_exec(str(LAUNCHER),stdin=asyncio.subprocess.PIPE,stdout=asyncio.subprocess.PIPE,stderr=asyncio.subprocess.PIPE,start_new_session=True,limit=8*1024*1024,cwd=str(ROOT))
        async def discard():
            while await p.stderr.readline():pass
        drain=asyncio.create_task(discard())
        async def req(method,params,id=None):
            msg={'jsonrpc':'2.0','method':method,'params':params}
            if id is not None:msg['id']=id
            p.stdin.write((json.dumps(msg)+'\n').encode());await p.stdin.drain()
            if id is None:return
            while True:
                line=await asyncio.wait_for(p.stdout.readline(),180)
                if not line:raise RuntimeError('Server ended before responding; do not repeat paid submission')
                try:r=json.loads(line)
                except ValueError:continue
                if r.get('id')==id:
                    if 'error' in r:raise RuntimeError(clean(json.dumps(r['error'])))
                    return r.get('result',{})
        try:
            await req('initialize',{'protocolVersion':'2024-11-05','capabilities':{},'clientInfo':{'name':'loopforge-production','version':'1.0'}},1)
            await req('notifications/initialized',{})
            result=await req('tools/list',{},2) if a.tool=='__list_tools' else await req('tools/call',{'name':a.tool,'arguments':args},2)
            result=json.loads(clean(json.dumps(result)))
            save(Path(a.out),result)
            data=payload(result)
            if job:
                if data.get('task_id'):job.update(task_id=data['task_id'],state='submitted')
                save(LEDGER,ledger)
            if a.tool=='meshy_get_task_status' and data:
                for j in ledger['jobs']:
                    if j.get('task_id')==data.get('task_id'):
                        j['state']=data.get('status',j['state'])
                        if data.get('consumed_credits') is not None:j['actual']=data['consumed_credits']
                save(LEDGER,ledger)
            if data:
                brief={k:v for k,v in data.items() if k in {'task_id','status','progress','outcome','consumed_credits','balance','monthly_credits','permanent_credits','face_count','vertex_count','error_message'}}
                print(json.dumps({'output':a.out,**brief,'budget_committed':sum(j.get('actual',j['reserved']) for j in ledger['jobs'])}))
            else:print(json.dumps({'output':a.out,'result':result}))
            if result.get('isError'):raise RuntimeError('Tool returned an error; saved response for inspection')
        finally:
            try:os.killpg(p.pid,signal.SIGTERM)
            except ProcessLookupError:pass
            await p.wait();await drain

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('tool');ap.add_argument('--args');ap.add_argument('--out',required=True);ap.add_argument('--cost',type=int);ap.add_argument('--label');a=ap.parse_args()
    try:asyncio.run(run(a))
    except Exception as e:raise SystemExit(clean(str(e)))
