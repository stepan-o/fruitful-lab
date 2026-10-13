import type {Metadata} from 'next';
import WorkerModelReview from '@/components/loopforge/agents/WorkerModelReview';
export const metadata:Metadata={title:'Worker motion review — Loopforge',description:'Inspect 19 rigged worker animations, including Hot Walk reserved for Cathexis, under factory lighting.'};
export default function WorkerReviewPage(){return <WorkerModelReview/>;}
