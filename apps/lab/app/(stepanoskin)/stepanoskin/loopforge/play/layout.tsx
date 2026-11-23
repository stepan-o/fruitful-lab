import { Barlow_Semi_Condensed, Caveat, IBM_Plex_Mono } from "next/font/google";
import type { ReactNode } from "react";
const dialogue = Barlow_Semi_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-console",
  display: "swap",
});
const tape = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-tape",
  display: "swap",
});
const instruments = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-instrument",
  display: "swap",
});
export default function PlayLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${dialogue.variable} ${tape.variable} ${instruments.variable}`}
    >
      {children}
    </div>
  );
}
