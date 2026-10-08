import type { Metadata } from "next";
import ConsoleStudy from "@/components/loopforge/first-shift/ConsoleStudy";
import { firstShiftMedia } from "@/lib/loopforge/first-shift/media";
import { initialState } from "@/lib/loopforge/first-shift/kernel";
import { project } from "@/lib/loopforge/first-shift/projection";
export const metadata: Metadata = {
  title: "Console composition study · Loopforge",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <ConsoleStudy media={firstShiftMedia()} view={project(initialState(7))} />
  );
}
