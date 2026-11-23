import type {Metadata} from "next";
import {notFound} from "next/navigation";
import Reader,{Cover} from "@/components/agentic-systems/Reader";
import {chapterById} from "@/lib/agentic-systems/content";
type Props={searchParams:Promise<{chapter?:string|string[]}>};
export async function generateMetadata({searchParams}:Props):Promise<Metadata>{const {chapter}=await searchParams;const current=typeof chapter==="string"?chapterById(chapter):undefined;return {title:`${current?.title??"Agentic Systems — AI teams in creative production"} | Stepan Oskin`,description:current?.standfirst??"AI teams in creative production, with Loopforge as the case study: context, delegation, evaluation and the tradeoffs between production value and cost."};}
export default async function Page({searchParams}:Props){const {chapter}=await searchParams;if(chapter===undefined)return <Cover/>;if(typeof chapter!=="string")notFound();const current=chapterById(chapter);if(!current)notFound();return <Reader chapter={current}/>;}
