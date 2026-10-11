import type { Metadata } from "next";
import FactoryStudy from "@/components/loopforge/factory-study/FactoryStudy";

export const metadata: Metadata = { title: "Factory floor — Loopforge", description: "The complete Loopforge factory floor, with Security and Lattice Forge unlocked for first-turn commissioning." };

export default function FactoryFloorPage() { return <FactoryStudy />; }
