import type { Metadata } from "next";
import FactoryStudy from "@/components/loopforge/factory-study/FactoryStudy";

export const metadata: Metadata = { title: "Factory commissioning — Loopforge", description: "A procedural Security corner and Lattice Forge commissioning study." };

export default function FactoryStudyPage() { return <FactoryStudy />; }
