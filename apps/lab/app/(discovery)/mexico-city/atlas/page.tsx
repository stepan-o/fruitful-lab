import type { Metadata, Viewport } from "next";
import AtlasApp from "@/components/mexico-city/atlas/AtlasApp";
import "@/components/mexico-city/mexico-city.css";
import "@/components/mexico-city/atlas/atlas.css";
export const metadata: Metadata = {
  title: "Atlas · Mexico city discovery game",
  description:
    "Una ciudad, muchas capas. Explora las 16 alcaldías, la cuenca, su historia y el náhuatl con mapas ilustrados y retos.",
};
export const viewport: Viewport = {
  themeColor: "#fbfaf6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
export default function Page() {
  return <AtlasApp />;
}
