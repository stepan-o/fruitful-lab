import type {Metadata} from 'next';
import AssetInspectionWorkbench from '@/components/loopforge/agents/AssetInspectionWorkbench';
import bank from '@/lib/loopforge/agents/cathexis-review.json';
import manifest from '@/lib/assets/generated/loopforge-cathexis-review.json';
export const metadata:Metadata={title:'CATHEXIS body and face review — Loopforge',description:'Inspect the accepted CATHEXIS v2 body, compare Grace mask budgets and review three mechanical expressions.'};
export default function CathexisReviewPage(){return <AssetInspectionWorkbench definition={{
 id:'cathexis-intake',name:'CATHEXIS',revision:bank.revision,
 description:'The accepted v2 body with its completed rear skirt. Inspect the A-pose, compare Grace at 3k and 8k, and examine the mechanical expressions before fitting and rigging.',
 brief:'/stepanoskin/loopforge/design?model=cathexis#model-briefs',record:'/loopforge-design/production/CATHEXIS_INTAKE_REVIEW.md',
 portraitAsset:'body',comparison:{ids:['grace-3k','grace-8k'],label:'Grace resolution comparison'},
 assets:bank.assets.map(asset=>({...asset,file:manifest.assets[asset.id as keyof typeof manifest.assets].variants[0]})),
 observations:['The owner accepted the v2 body and completed rear skirt. Only this final body version is available; motion clearance awaits rigging.','The body retains a grinning skull surface. Prepare and fit its face seat before expression swaps.','All eight exports are unrigged: no skeleton, skin weights or animation clips.','Faces are separate objects, enlarged for inspection. Their dimensions and mounting surfaces do not yet match the body.','Mechanical faces use locally reduced 12k inspection copies; these are not the final fitted assets.','No half-shell, other porcelain expressions or grime variants have arrived yet.'],
 }}/>;}
