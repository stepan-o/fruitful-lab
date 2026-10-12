import type {Metadata} from 'next';
import LimenModelReview from '@/components/loopforge/agents/LimenModelReview';
export const metadata:Metadata={title:'LIMEN model review — Loopforge',description:'Inspect the new rigged LIMEN model and its supplied animations under factory lighting.'};
export default function LimenReviewPage(){return <LimenModelReview/>;}
