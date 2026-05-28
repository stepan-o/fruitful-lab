"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-E0TLX9V17Q";

export function GoogleAnalytics() {
  const pathname = usePathname();
  const isFirstPageView = useRef(true);

  useEffect(() => {
    if (isFirstPageView.current) {
      isFirstPageView.current = false;
      return;
    }

    if (!window.gtag) {
      return;
    }

    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: `${pathname}${window.location.search}`,
    });
  }, [pathname]);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) {
        return;
      }

      const link = event.target.closest("a[href]");

      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }

      const label = link.textContent?.replace(/\s+/g, " ").trim() ?? "";
      const href = link.getAttribute("href") ?? "";
      const normalizedLabel = label.toLowerCase();

      if (!normalizedLabel.includes("book a fit call") && !href.includes("tidycal.com/susycid")) {
        return;
      }

      trackEvent("fit_call_click", {
        link_text: label.slice(0, 100),
        link_url: link.href,
        page_path: `${window.location.pathname}${window.location.search}`,
      });
    }

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="fruitful-pin-ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
