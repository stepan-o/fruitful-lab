import type {Metadata} from 'next';
import PerformanceAcceptance from '@/components/loopforge/agents/PerformanceAcceptance';
export const metadata:Metadata={title:'Factory performance acceptance — Loopforge',description:'Repeatable 26-character browser workload with downloadable evidence.'};
export default function Page(){return <PerformanceAcceptance/>;}
