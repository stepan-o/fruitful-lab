import type { Metadata, Viewport } from "next";
import CityGame from "@/components/mexico-city/CityGame";
import "@/components/mexico-city/mexico-city.css";

export const metadata: Metadata = {
  title: "Otra Vista · Descubre la Ciudad de México",
  description:
    "Una ciudad, otra mirada. Descubre la historia, los barrios y las palabras de la Ciudad de México con Susy y Stepan.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function MexicoCityPage() {
  return <CityGame />;
}
