import type { Metadata, Viewport } from "next";
import GameDesign from "@/components/mexico-city/GameDesign";

export const metadata: Metadata = {
  title: "Mexico city discovery game · Diseño del juego",
  description:
    "El juego sucede en la ciudad. Dirección, retos entre dos, mapa, identidad visual y decisiones abiertas de Mexico city discovery game.",
  alternates: {
    canonical: "https://www.fruitfulab.net/mexico-city/game-design",
  },
};
export const viewport: Viewport = { themeColor: "#ffffff" };
export default function GameDesignPage() {
  return <GameDesign />;
}
