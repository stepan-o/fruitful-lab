import type { Metadata, Viewport } from "next";
import CityGame from "@/components/mexico-city/CityGame";
import "@/components/mexico-city/mexico-city.css";

export const metadata: Metadata = {
  title: "Otra Vista · Mexico City discoveries",
  description:
    "A city of small surprises. Explore an illustrated Mexico City, uncover its stories, and keep a field journal with Susy and Stepan.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function MexicoCityPage() {
  return <CityGame />;
}
