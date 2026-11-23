import type {Metadata} from 'next';
import SceneStudies from '@/components/loopforge/agents/SceneStudies';
export const metadata:Metadata={title:'Before the shift — Loopforge',description:'Follow bob through the factory gate and his first Conveyor lesson.'};
export default function Page(){return <SceneStudies player/>;}
