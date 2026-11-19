import type {Metadata} from 'next';
import IntroPlayer from '@/components/loopforge/intro/IntroPlayer';
export const metadata:Metadata={title:'Day One · Loopforge',description:'The first shift, running live on the approved factory floor.'};
export default function Page(){return <IntroPlayer/>;}
