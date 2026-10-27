import type {Metadata} from "next";
import {notFound} from "next/navigation";
import Reader,{Cover} from "@/components/agentic-systems/Reader";
import {chapterById} from "@/lib/agentic-systems/content";
type Props={searchParams:Promise<{chapter?:string|string[]}>};
export async function generateMetadata({searchParams}:Props):Promise<Metadata>{const {chapter}=await searchParams;const current=typeof chapter==="string"?chapterById(chapter):undefined;return {title:`${current?.title??"Agentic Systems — Building a game with an AI studio"} | Stepan Oskin`,description:current?.standfirst??"A study of building Loopforge with AI agents: delegation, evaluation, visual design and the cost of turning generated work into a playable game."};}
export default async function Page({searchParams}:Props){const {chapter}=await searchParams;if(chapter===undefined)return <Cover/>;if(typeof chapter!=="string")notFound();const current=chapterById(chapter);if(!current)notFound();return <Reader chapter={current}/>;}
