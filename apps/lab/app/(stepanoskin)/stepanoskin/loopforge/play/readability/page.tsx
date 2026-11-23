import type {Metadata} from 'next';
import ReadabilityStudio from '@/components/loopforge/agents/ReadabilityStudio';
export const metadata:Metadata={title:'Cast readability studio — Loopforge',description:'Compare the factory cast in a fixed shot. Adjust room colours, painted armour and supervisor size at room and console scales.'};
export default function Page(){return <ReadabilityStudio/>;}
