"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const PINTEREST_TAG_ID = process.env.NEXT_PUBLIC_PINTEREST_TAG_ID || "2612504823331";

declare global {
  interface Window {
    pintrk?: {
      (...args: unknown[]): void;
      queue?: unknown[][];
      version?: string;
    };
  }
}

export function PinterestTag() {
  const pathname = usePathname();
  const isFirstPageView = useRef(true);

  useEffect(() => {
    if (isFirstPageView.current) {
      isFirstPageView.current = false;
      return;
    }

    if (!window.pintrk) {
      return;
    }

    window.pintrk("page");
  }, [pathname]);

  if (!PINTEREST_TAG_ID) {
    return null;
  }

  return (
    <>
      <Script id="fruitful-pin-pinterest-tag" strategy="afterInteractive">
        {`
          !function(e){if(!window.pintrk){window.pintrk = function () {
          window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
          n=window.pintrk;n.queue=[],n.version="3.0";var
          t=document.createElement("script");t.async=!0,t.src=e;var
          r=document.getElementsByTagName("script")[0];
          r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
          pintrk('load', '${PINTEREST_TAG_ID}');
          pintrk('page');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://ct.pinterest.com/v3/?event=init&tid=${PINTEREST_TAG_ID}&noscript=1`}
        />
      </noscript>
    </>
  );
}
