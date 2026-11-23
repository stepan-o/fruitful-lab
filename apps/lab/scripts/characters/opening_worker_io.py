"""glTF writer for immutable opening-worker animation derivatives."""
import copy,json,struct
import numpy as np

class Writer:
    def __init__(self,d):self.g=copy.deepcopy(d['g']);self.data=bytearray(d['data'])
    def accessor(self,values,kind):
        v=np.asarray(values,dtype='<f4');self.data.extend(b'\0'*((-len(self.data))%4));offset=len(self.data);self.data.extend(v.tobytes())
        self.g['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':v.nbytes})
        a={'bufferView':len(self.g['bufferViews'])-1,'componentType':5126,'count':len(v),'type':kind}
        if kind=='SCALAR':a.update(min=[float(v.min())],max=[float(v.max())])
        self.g['accessors'].append(a);return len(self.g['accessors'])-1
    def clip(self,name,times,tracks,extras):
        out={'name':name,'channels':[],'samplers':[],'extras':extras};time_id=self.accessor(times,'SCALAR')
        for node,kind,v in tracks:
            v=v.copy()
            if kind=='rotation':
                for i in range(1,len(v)):
                    if np.dot(v[i-1],v[i])<0:v[i]*=-1
            if not np.all(np.isfinite(v)):raise ValueError(f'Nonfinite {name}/{node}/{kind}')
            out['channels'].append({'sampler':len(out['samplers']),'target':{'node':node,'path':kind}})
            out['samplers'].append({'input':time_id,'output':self.accessor(v,'VEC4' if kind=='rotation' else 'VEC3'),'interpolation':'LINEAR'})
        self.g.setdefault('animations',[]).append(out)
    def save(self,path):
        self.g['buffers']=[{'byteLength':len(self.data)}]
        j=json.dumps(self.g,separators=(',',':')).encode();j+=b' '*((-len(j))%4);self.data+=b'\0'*((-len(self.data))%4)
        path.write_bytes(struct.pack('<4sII',b'glTF',2,28+len(j)+len(self.data))+struct.pack('<I4s',len(j),b'JSON')+j+struct.pack('<I4s',len(self.data),b'BIN\0')+self.data)

