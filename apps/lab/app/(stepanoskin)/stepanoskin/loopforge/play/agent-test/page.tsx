import type {Metadata} from 'next';
import AgentProductionTest from '@/components/loopforge/agents/AgentProductionTest';
export const metadata:Metadata={title:'Legacy agent fixture — Loopforge',description:'Historical action-system experiment using rejected placeholder character models.'};
export default function AgentTestPage(){return <AgentProductionTest/>;}
