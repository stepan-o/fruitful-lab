import type {Metadata} from "next";
import {notFound} from "next/navigation";
import Reader,{Cover} from "@/components/agentic-systems/Reader";
import {chapterById} from "@/lib/agentic-systems/content";
type Props={searchParams:Promise<{chapter?:string|string[]}>};
export async function generateMetadata({searchParams}:Props):Promise<Metadata>{const {chapter}=await searchParams;const current=typeof chapter==="string"?chapterById(chapter):undefined;return {title:`${current?.title??"Agentic Systems — What made it out of the factory"} | Stepan Oskin`,description:current?.standfirst??"An illustrated field book about building with AI, making a game, and recognizing useful progress."};}
export default async function Page({searchParams}:Props){const {chapter}=await searchParams;if(chapter===undefined)return <Cover/>;if(typeof chapter!=="string")notFound();const current=chapterById(chapter);if(!current)notFound();return <Reader chapter={current}/>;}
