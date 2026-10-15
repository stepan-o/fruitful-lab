import type {Metadata} from 'next';
import AssetInspectionWorkbench from '@/components/loopforge/agents/AssetInspectionWorkbench';
import bank from '@/lib/loopforge/agents/cathexis-review.json';
import manifest from '@/lib/assets/generated/loopforge-cathexis-review.json';
export const metadata:Metadata={title:'CATHEXIS body and face review — Loopforge',description:'Inspect CATHEXIS with full Grace, half Grace or her original mechanical face.'};
export default function CathexisReviewPage(){return <AssetInspectionWorkbench definition={{
 id:'cathexis-intake',name:'CATHEXIS',revision:bank.revision,
 description:'Compare full Grace, half Grace and the exposed mechanical face. The original head stays intact beneath the mask. Inspect the fit up close and through factory cameras.',
 brief:'/stepanoskin/loopforge/design?model=cathexis#model-briefs',record:'/loopforge-design/production/CATHEXIS_INTAKE_REVIEW.md',
 fittedFaces:true,portraitAsset:'body',comparison:{ids:['grace-3k','grace-8k'],label:'Grace resolution comparison'},
 assets:bank.assets.map(asset=>({...asset,file:manifest.assets[asset.id as keyof typeof manifest.assets].variants[0]})),
 observations:['The owner accepted the v2 body and completed rear skirt. Motion clearance awaits rigging.','Full Grace, half Grace and the exposed original face share the same intact body. No body triangles are hidden or removed.','The half mask is clipped from the selected Grace mesh with interpolated textures and a small cut edge. Swap the covered side to inspect both fits.','Grace 3k/8k remain review candidates. The dedicated Grimace, Fury and Distress meshes are earlier studies, available only under Separate assets.','All source exports remain unrigged. There is no facial articulation or mask-removal animation yet.','Matching delivery normal maps, grime variants and moving costume clearance remain open.'],
 }}/>;}
