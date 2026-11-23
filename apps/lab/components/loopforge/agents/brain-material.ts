import {MaterialPluginBase} from '@babylonjs/core/Materials/materialPluginBase';
import {Texture} from '@babylonjs/core/Materials/Textures/texture';
import type {BaseTexture} from '@babylonjs/core/Materials/Textures/baseTexture';
import type {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import type {UniformBuffer} from '@babylonjs/core/Materials/uniformBuffer';
import type {Scene} from '@babylonjs/core/scene';
import kit from '@/lib/loopforge/rooms/room-kit.json';

/** Two 512px maps share the washed model's verified UVs. One mesh, one draw,
 * continuous cleaning and no texture creation during playback or reading holds. */
class BrainMaterial extends MaterialPluginBase {
 clean=0;compressed=0;
 constructor(material:PBRMaterial,private dirty:Texture,private pressed:Texture){super(material,'Brain processing',200,{},true,true);this.doNotSerialize=true;}
 getClassName(){return 'BrainMaterial';}
 getSamplers(samplers:string[]){samplers.push('brainDirtySampler','brainPressedSampler');}
 getActiveTextures(textures:BaseTexture[]){textures.push(this.dirty,this.pressed);}
 isReadyForSubMesh(){return this.dirty.isReady()&&this.pressed.isReady();}
 bindForSubMesh(u:UniformBuffer){u.updateFloat2('brainState',this.clean,this.compressed);u.setTexture('brainDirtySampler',this.dirty);u.setTexture('brainPressedSampler',this.pressed);}
 getUniforms(){return {ubo:[{name:'brainState',size:2,type:'vec2'}],fragment:'uniform vec2 brainState;'};}
 getCustomCode(type:string):Record<string,string>|null{return type==='fragment'?{
  CUSTOM_FRAGMENT_DEFINITIONS:'uniform sampler2D brainDirtySampler; uniform sampler2D brainPressedSampler;',
  CUSTOM_FRAGMENT_UPDATE_METALLICROUGHNESS:'metallicRoughness.r = 0.0; metallicRoughness.g = mix(mix(0.95, 0.57, brainState.x), 0.88, brainState.y);',
  CUSTOM_FRAGMENT_BEFORE_LIGHTS:`
   #ifdef ALBEDO
    vec3 brainDirty = toLinearSpace(texture2D(brainDirtySampler, vAlbedoUV).rgb);
    vec3 brainPressed = toLinearSpace(texture2D(brainPressedSampler, vAlbedoUV).rgb);
    surfaceAlbedo = mix(mix(brainDirty, surfaceAlbedo, brainState.x), brainPressed, brainState.y);
   #endif
  `,
 }:null;}
}
async function loadMap(scene:Scene,signal:AbortSignal,file:typeof kit.brainStates.dirty){
 const integrity='sha256-'+btoa(String.fromCharCode(...file.sha256.match(/../g)!.map(x=>parseInt(x,16))));
 const response=await fetch(file.src,{signal:AbortSignal.any([signal,AbortSignal.timeout(60000)]),integrity});if(!response.ok)throw Error('Brain material could not be loaded.');
 const url=URL.createObjectURL(await response.blob());
 try{return await new Promise<Texture>((resolve,reject)=>{
  const texture=new Texture(url,scene,false,false,Texture.TRILINEAR_SAMPLINGMODE,()=>{if(signal.aborted||scene.isDisposed){texture.dispose();reject(new DOMException('Material load cancelled','AbortError'));}else resolve(texture);},()=>{texture.dispose();reject(Error('Brain material could not be decoded.'));});texture.name=file.src;
 });}finally{URL.revokeObjectURL(url);}
}
export async function createBrainMaterial(scene:Scene,signal:AbortSignal,materials:PBRMaterial[]){
 const loaded=await Promise.allSettled([loadMap(scene,signal,kit.brainStates.dirty),loadMap(scene,signal,kit.brainStates.pressed)]);
 if(loaded.some(r=>r.status==='rejected')){for(const r of loaded)if(r.status==='fulfilled')r.value.dispose();throw Error('Brain material set is incomplete.');}
 const [dirty,pressed]=loaded.map(r=>(r as PromiseFulfilledResult<Texture>).value);
 const plugins=materials.map(m=>{m.albedoColor.set(1,1,1);m.metallic=0;return new BrainMaterial(m,dirty,pressed);});
 return {present(clean:number,compressed:number){for(const p of plugins){p.clean=clean;p.compressed=compressed;}},dispose(){dirty.dispose();pressed.dispose();}};
}
