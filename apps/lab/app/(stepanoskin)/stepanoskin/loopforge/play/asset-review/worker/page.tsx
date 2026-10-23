import type {Metadata} from 'next';
import WorkerModelReview from '@/components/loopforge/agents/WorkerModelReview';
import OpeningWorkerReview from '@/components/loopforge/agents/OpeningWorkerReview';
import {isOpeningWorker} from '@/lib/loopforge/agents/opening-workers';
export const metadata:Metadata={title:'Workers · motion review — Loopforge',description:'Inspect the ten opening workers and their full motion banks under factory lighting, with portrait, floor and console detail levels.'};
export default async function WorkerReviewPage({searchParams}:{searchParams:Promise<{worker?:string}>}){
 const {worker}=await searchParams;
 if(worker==='reference')return <WorkerModelReview/>;
 return <OpeningWorkerReview key={worker??'bob'} worker={worker&&isOpeningWorker(worker)?worker:'bob'}/>;
}
