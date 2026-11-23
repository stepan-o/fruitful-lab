import sharp from 'sharp';
/** Small authored procedural metal maps. No photograph or third-party texture. */
export async function embedSurface(glb,polished=false){
 const n=glb.readUInt32LE(12),json=JSON.parse(glb.subarray(20,20+n)),start=20+n,bin=glb.subarray(start+8,start+8+glb.readUInt32LE(start));let parts=[bin],length=bin.length;
 const size=256,height=new Float32Array(size*size);let seed=739151;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let y=0;y<size;y++)for(let x=0;x<size;x++)height[y*size+x]=.48+random()*.08+.06*Math.sin(x*.12)*Math.cos(y*.08);
 for(let line=0;line<110;line++){const x=Math.floor(random()*size),y=Math.floor(random()*size),len=3+Math.floor(random()*17);for(let k=0;k<len;k++)height[((y+Math.floor(k*.23))%size)*size+(x+k)%size]=line%3?.31:.68;}
 const color=Buffer.alloc(size*size*4),normal=Buffer.alloc(size*size*4),orm=Buffer.alloc(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=y*size+x,k=i*4,h=height[i],dx=height[y*size+(x+1)%size]-height[y*size+(x+size-1)%size],dy=height[((y+1)%size)*size+x]-height[((y+size-1)%size)*size+x],v=218+Math.round((h-.5)*65);color.set([v,v,Math.max(0,v-5),255],k);normal.set([128+Math.round(dx*65),128+Math.round(dy*65),253,255],k);orm.set([255,Math.round((polished?.37:.67)*255+(h-.5)*70),230,255],k);}
 json.images??=[];json.textures??=[];json.samplers??=[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}];
 async function texture(raw){const png=await sharp(raw,{raw:{width:size,height:size,channels:4}}).png().toBuffer(),pad=Buffer.alloc((4-length%4)%4);parts.push(pad);length+=pad.length;const view=json.bufferViews.length;json.bufferViews.push({buffer:0,byteOffset:length,byteLength:png.length});parts.push(png);length+=png.length;const image=json.images.length;json.images.push({bufferView:view,mimeType:'image/png'});const tex=json.textures.length;json.textures.push({source:image,sampler:0});return tex;}
 const base=await texture(color),bump=await texture(normal),metal=await texture(orm);
 for(const material of json.materials)if(material.name==='cast metal'){material.pbrMetallicRoughness.baseColorTexture={index:base};material.pbrMetallicRoughness.metallicRoughnessTexture={index:metal};material.pbrMetallicRoughness.roughnessFactor=1;material.normalTexture={index:bump,scale:polished?.16:.30};}
 json.buffers[0].byteLength=length;parts.push(Buffer.alloc((4-length%4)%4));const binary=Buffer.concat(parts),j=Buffer.from(JSON.stringify(json)),jp=Buffer.alloc((4-j.length%4)%4,32),jb=Buffer.concat([j,jp]),header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(28+jb.length+binary.length,8);header.writeUInt32LE(jb.length,12);header.writeUInt32LE(0x4e4f534a,16);const bh=Buffer.alloc(8);bh.writeUInt32LE(binary.length,0);bh.writeUInt32LE(0x004e4942,4);return Buffer.concat([header,jb,bh,binary]);
}
