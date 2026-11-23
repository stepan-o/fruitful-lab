import type {Metadata} from 'next';
import LimenModelReview from '@/components/loopforge/agents/LimenModelReview';
export const metadata:Metadata={title:'LIMEN motion review — Loopforge',description:'Review 17 new LIMEN motions, the articulated finger rig and cyan forearm blade alongside the approved assembly.'};
export default function LimenReviewPage(){return <LimenModelReview/>;}
