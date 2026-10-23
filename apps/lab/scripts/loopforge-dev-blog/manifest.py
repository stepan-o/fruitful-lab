#!/usr/bin/env python3
from pathlib import Path
import hashlib,json
P=Path(__file__).resolve().parent
root=P.parents[1]/'public/loopforge-dev-blog'
records=[{'path':str(f.relative_to(root)),'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()} for f in sorted(root.rglob('*')) if f.is_file()]
(P/'generated-manifest.json').write_text(json.dumps({'files':records},indent=2)+'\n')
print(json.dumps({'publicFiles':len(records),'manifest':'generated-manifest.json'}))
