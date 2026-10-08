import FirstShift from "@/components/loopforge/first-shift/FirstShift";
import { firstShiftMedia } from "@/lib/loopforge/first-shift/media";
export const metadata = {
  title: "The first shift · Loopforge",
  description:
    "Choose your adviser. Release the line. Live with the first consequences.",
};
export default function Page() {
  return <FirstShift media={firstShiftMedia()} />;
}
