import type {Metadata} from 'next';
import StilettoModelReview from '@/components/loopforge/agents/StilettoModelReview';
export const metadata:Metadata={title:'STILETTO blade and motion review — Loopforge',description:'Compare original and corrected twin-blade motion, sampled clearance checks and remaining gait issues.'};
export default function StilettoReviewPage(){return <StilettoModelReview/>;}
