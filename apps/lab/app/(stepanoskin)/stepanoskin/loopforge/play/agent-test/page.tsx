import type {Metadata} from 'next';
import AgentProductionTest from '@/components/loopforge/agents/AgentProductionTest';
export const metadata:Metadata={title:'Agent production test — Loopforge',description:'Character, contact and performance review in the prebuilt Loopforge factory.'};
export default function AgentTestPage(){return <AgentProductionTest/>;}
