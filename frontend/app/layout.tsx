import type { Metadata } from "next";
import { Playfair_Display_SC, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { growthbookAdapter } from "@/lib/growthbook/flags"; // just importing is enough

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
    const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

    return (
        <html lang="en" suppressHydrationWarning>
        <head />
        <body className={`${headingFont.variable} ${bodyFont.variable} font-body antialiased`}>
        {GTM_ID ? (
            <>
                <Script
                    id="gtm"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
window.dataLayer = window.dataLayer || [];
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
                `.trim(),
                    }}
                />

                <noscript>
                    <iframe
                        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                        height="0"
                        width="0"
                        style={{ display: "none", visibility: "hidden" }}
                    />
                </noscript>
            </>
        ) : null}

        {children}
        </body>
        </html>
    );
}
