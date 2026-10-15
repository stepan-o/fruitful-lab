import type {Metadata} from 'next';
import AssetInspectionWorkbench from '@/components/loopforge/agents/AssetInspectionWorkbench';
import bank from '@/lib/loopforge/agents/cathexis-review.json';
import manifest from '@/lib/assets/generated/loopforge-cathexis-review.json';
export const metadata:Metadata={title:'CATHEXIS body and face review — Loopforge',description:'Inspect the accepted CATHEXIS v2 body, compare Grace mask budgets and review three mechanical expressions.'};
export default function CathexisReviewPage(){return <AssetInspectionWorkbench definition={{
 id:'cathexis-intake',name:'CATHEXIS',revision:bank.revision,
 description:'Fit Grace or a mechanical expression to the accepted body. Compare the complete character in close-up and factory cameras, or inspect each source separately.',
 brief:'/stepanoskin/loopforge/design?model=cathexis#model-briefs',record:'/loopforge-design/production/CATHEXIS_INTAKE_REVIEW.md',
 fittedFaces:true,portraitAsset:'body',comparison:{ids:['grace-3k','grace-8k'],label:'Grace resolution comparison'},
 assets:bank.assets.map(asset=>({...asset,file:manifest.assets[asset.id as keyof typeof manifest.assets].variants[0]})),
 observations:['The owner accepted the v2 body and completed rear skirt. Only this final body version is available; motion clearance awaits rigging.','The viewer clears a small central face seat only while an insert is fitted; the source body stays unchanged. These are rigid appearance swaps, not articulated facial expressions.','All eight exports are unrigged: no skeleton, skin weights or animation clips.','All five face candidates can be fitted at character scale. Their scale and seat are review calibrations, not accepted production topology.','Mechanical faces use locally reduced 12k inspection copies; these are not the final fitted assets.','No half-shell, other porcelain expressions or grime variants have arrived yet.'],
 }}/>;}
