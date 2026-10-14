/** Small dependency-free ZIP STORE writer. Inputs are already compressed JPEGs. */
const encoder = new TextEncoder();
const table = Uint32Array.from({length:256},(_,i)=>{let c=i;for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0;});
function crc32(bytes){let c=0xffffffff;for(const b of bytes)c=table[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;}
export function zipStore(files){
 const local=[],central=[];let offset=0,centralBytes=0;const names=new Set();
 if(files.length>65535)throw Error('Too many archive files');
 for(const file of files){
  if(!file.name||file.name.startsWith('/')||file.name.split('/').includes('..')||names.has(file.name))throw Error('Invalid archive path');names.add(file.name);
  const name=encoder.encode(file.name),body=typeof file.data==='string'?encoder.encode(file.data):file.data;
  if(name.length>65535||body.length>0xffffffff)throw Error('Archive entry too large');
  const crc=crc32(body),head=new Uint8Array(30+name.length),h=new DataView(head.buffer);
  h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x800,true);h.setUint16(12,0x5d4e,true);
  h.setUint32(14,crc,true);h.setUint32(18,body.length,true);h.setUint32(22,body.length,true);h.setUint16(26,name.length,true);head.set(name,30);
  const record=new Uint8Array(46+name.length),r=new DataView(record.buffer);
  r.setUint32(0,0x02014b50,true);r.setUint16(4,20,true);r.setUint16(6,20,true);r.setUint16(8,0x800,true);r.setUint16(14,0x5d4e,true);
  r.setUint32(16,crc,true);r.setUint32(20,body.length,true);r.setUint32(24,body.length,true);r.setUint16(28,name.length,true);r.setUint32(42,offset,true);record.set(name,46);
  local.push(head,body);central.push(record);offset+=head.length+body.length;centralBytes+=record.length;
 }
 if(offset+centralBytes>0xffffffff)throw Error('Archive too large');
 const end=new Uint8Array(22),e=new DataView(end.buffer);e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,centralBytes,true);e.setUint32(16,offset,true);
 return new Blob([...local,...central,end],{type:'application/zip'});
}
