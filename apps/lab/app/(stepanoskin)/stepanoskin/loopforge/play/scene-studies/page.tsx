import type {Metadata} from 'next';
import SceneStudies from '@/components/loopforge/agents/SceneStudies';
export const metadata:Metadata={title:'Scene rehearsals — Loopforge',description:'Engine-backed character encounters, speech and storyboard review.'};
export default function Page(){return <SceneStudies/>;}
