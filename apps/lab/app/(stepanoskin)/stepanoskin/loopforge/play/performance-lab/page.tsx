import type {Metadata} from 'next';
import PerformanceLab from '@/components/loopforge/agents/PerformanceLab';
export const metadata:Metadata={title:'Graphics & performance lab — Loopforge',description:'Controlled graphics comparisons using the approved factory cast.'};
export default function Page(){return <PerformanceLab/>;}
