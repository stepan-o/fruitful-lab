import {MaterialPluginBase} from '@babylonjs/core/Materials/materialPluginBase';
import type {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import type {UniformBuffer} from '@babylonjs/core/Materials/uniformBuffer';
import {Color3} from '@babylonjs/core/Maths/math.color';
import type {OpeningWorkerId} from '@/lib/loopforge/agents/opening-workers';
const shades:Record<OpeningWorkerId,string>={bob:'#3081c0',sam:'#3d7297',ed:'#235d86',jo:'#477f9f',gus:'#387ca7',max:'#366b8c',mae:'#4f8aa7',kit:'#2b719c',lou:'#487c94',ben:'#387fbb'};
/** Runtime enamel audition. Chroma selects existing blue paint; white eyes,
 * brass and neutral mechanical recesses retain the exported albedo. No new maps. */
export class OpeningWorkerFinish extends MaterialPluginBase {
 enabled=1;private colour:Color3;
 constructor(material:PBRMaterial,worker:OpeningWorkerId){super(material,'Opening worker enamel',205,{},true,true);this.colour=Color3.FromHexString(shades[worker]).toLinearSpace();this.doNotSerialize=true;}
 getClassName(){return 'OpeningWorkerFinish';}
 getUniforms(){return {ubo:[{name:'workerEnamel',size:3,type:'vec3'},{name:'workerFinish',size:1,type:'float'}],fragment:'uniform vec3 workerEnamel; uniform float workerFinish;'};}
 bindForSubMesh(u:UniformBuffer){u.updateColor3('workerEnamel',this.colour);u.updateFloat('workerFinish',this.enabled);}
 getCustomCode(type:string):Record<string,string>|null{return type==='fragment'?{CUSTOM_FRAGMENT_BEFORE_LIGHTS:`
  float workerMax = max(surfaceAlbedo.r, max(surfaceAlbedo.g, surfaceAlbedo.b));
  float workerBlue = (surfaceAlbedo.b - surfaceAlbedo.r) / max(workerMax, 0.001);
  float workerPaint = smoothstep(0.08, 0.30, workerBlue) * smoothstep(0.001, 0.012, workerMax);
  float workerLum = dot(surfaceAlbedo, vec3(0.2126, 0.7152, 0.0722));
  vec3 workerColour = workerEnamel * clamp(0.55 + 2.0 * sqrt(workerLum), 0.55, 1.3);
  surfaceAlbedo = mix(surfaceAlbedo, workerColour, workerFinish * workerPaint);
 `}:null;}
}
