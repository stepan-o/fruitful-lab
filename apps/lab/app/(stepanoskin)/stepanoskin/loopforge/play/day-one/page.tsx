import type {Metadata} from 'next';
import GameClient from '@/components/loopforge/first-shift/GameClient';
import IntroPlayer from '@/components/loopforge/intro/IntroPlayer';
import {firstShiftMedia} from '@/lib/loopforge/first-shift/media';
export const metadata:Metadata={title:'Day One · Loopforge',description:'The first shift, running live on the approved factory floor.'};
export default async function Page({searchParams}:{searchParams:Promise<{review?:string}>}){
  const {review}=await searchParams;
  if(review==='sprites')return <IntroPlayer/>;
  return <GameClient media={firstShiftMedia()} initialIntro/>;
}
