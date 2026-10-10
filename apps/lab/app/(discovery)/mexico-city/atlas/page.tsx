import type { Metadata } from "next";
import CityGame from "@/components/mexico-city/CityGame";
import "@/components/mexico-city/mexico-city.css";
export const metadata: Metadata = { title: "Atlas · Mexico city discovery game" };
export default function Page() { return <CityGame />; }
