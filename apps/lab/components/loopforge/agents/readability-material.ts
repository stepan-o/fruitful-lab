import {MaterialPluginBase} from '@babylonjs/core/Materials/materialPluginBase';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import type {UniformBuffer} from '@babylonjs/core/Materials/uniformBuffer';
import {LIMEN_PALETTE} from '@/lib/loopforge/agents/limen-palette';
import {Color3} from '@babylonjs/core/Maths/math.color';
/** Shared paint treatment for cast studies and the approved cast palettes: preserves the original texture and normal maps.
 * The shoulder band is a bind-space study, not a production armour UV mask. */
export class ReadabilityMaterial extends MaterialPluginBase {
 colour=Color3.White();accent=Color3.FromHexString(LIMEN_PALETTE.accent).toLinearSpace();strength=0;detail=1;kind=0;minY=0;height=1;
 constructor(material:PBRMaterial){super(material,'Readability study',200,{},true,true);this.doNotSerialize=true;}
 getClassName(){return 'ReadabilityMaterial';}
 bindForSubMesh(u:UniformBuffer){u.updateColor3('readColour',this.colour);u.updateColor3('readAccent',this.accent);u.updateFloat4('readParams',this.strength,this.detail,this.kind,0);u.updateFloat2('readBounds',this.minY,this.height);}
 getUniforms(){return {ubo:[{name:'readAccent',size:3,type:'vec3'},{name:'readColour',size:3,type:'vec3'},{name:'readParams',size:4,type:'vec4'},{name:'readBounds',size:2,type:'vec2'}],vertex:'uniform vec2 readBounds;',fragment:'uniform vec3 readAccent; uniform vec3 readColour; uniform vec4 readParams;'};}
 getCustomCode(type:string):Record<string,string>{return type==='vertex'?{
  CUSTOM_VERTEX_DEFINITIONS:'varying float vReadHeight;',
  CUSTOM_VERTEX_MAIN_BEGIN:'vReadHeight = (position.y - readBounds.x) / max(readBounds.y, 0.001);',
 }:{
  CUSTOM_FRAGMENT_DEFINITIONS:'varying float vReadHeight;',
  // Painted enamel must change the metallic response too; tinted chrome stays almost black.
  CUSTOM_FRAGMENT_UPDATE_METALLICROUGHNESS:`
   if (readParams.z > 1.5 && readParams.z < 2.5) {
    float readEnamel = readParams.x * smoothstep(0.69, 0.76, vReadHeight) * (1.0 - smoothstep(0.85, 0.91, vReadHeight));
    metallicRoughness.r = mix(metallicRoughness.r, 0.05, readEnamel);
    metallicRoughness.g = mix(metallicRoughness.g, 0.6, readEnamel);
   }
  `,
  CUSTOM_FRAGMENT_BEFORE_LIGHTS:`
   float readLum = dot(surfaceAlbedo, vec3(0.2126, 0.7152, 0.0722));
   float readRegion = 1.0;
   if (readParams.z > 1.5 && readParams.z < 2.5) {
    readRegion = smoothstep(0.69, 0.76, vReadHeight) * (1.0 - smoothstep(0.85, 0.91, vReadHeight));
   }
   vec3 readPaint;
   if (readParams.z > 2.5) {
    readPaint = readColour * mix(1.0, clamp(0.6 + 2.0 * sqrt(readLum), 0.25, 1.45), readParams.y);
   } else {
    readRegion *= readParams.z > 1.5 ? (0.35 + 0.65 * smoothstep(0.001, 0.025, readLum)) : smoothstep(0.008, 0.09, readLum);
    readPaint = readColour * (0.45 + 1.25 * sqrt(readLum));
   }
   if (readParams.z > 0.5 && readParams.z < 1.5) {
    // Preserve LIMEN's cyan markings as a deeper accent instead of painting them steel.
    float readCyan = smoothstep(0.015, 0.08, min(surfaceAlbedo.g, surfaceAlbedo.b) - surfaceAlbedo.r);
    readPaint = mix(readPaint, readAccent * (0.75 + 0.5 * sqrt(readLum)), readCyan);
   }
   surfaceAlbedo = mix(surfaceAlbedo, readPaint, readParams.x * readRegion);
  `,
 };}
 set(hex:string,strength:number){this.colour=Color3.FromHexString(hex).toLinearSpace();this.strength=strength/100;}
}
