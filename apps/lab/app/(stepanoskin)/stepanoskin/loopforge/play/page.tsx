import GameClient from "@/components/loopforge/first-shift/GameClient";
import { firstShiftMedia } from "@/lib/loopforge/first-shift/media";
export const viewport = { themeColor: "#070b0b", colorScheme: "dark" };
export const metadata = {
  title: "The first two shifts · Loopforge",
  description:
    "Enter the factory, appoint the supervisors and work the line through the Day 2 bell.",
};
export default async function Page({searchParams}:{searchParams:Promise<{review?:string}>}) {
  const {review}=await searchParams;
  return <GameClient media={firstShiftMedia()} legacyReview={review==="first-turn"} />;
}
