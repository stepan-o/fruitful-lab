import type { Metadata } from "next";
import { Playfair_Display_SC, Poppins } from "next/font/google";
import "./globals.css";
import { growthbookAdapter } from "@/lib/growthbook/flags"; // just importing is enough

// Brand fonts
const headingFont = Playfair_Display_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-heading",
  display: "swap",
});

const bodyFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fruitful Lab – Pinterest & Funnel Studio",
  description:
    "Full-funnel Pinterest strategy, ads, and analytics for baby, family, lifestyle, and CPG brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
