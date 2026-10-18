"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type TrackingProperties = Record<string, string | number | boolean | undefined>;

type TrackedLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | "href" | "onClick"> & {
    children: ReactNode;
    eventName: string;
    eventProperties?: TrackingProperties;
    onClick?: AnchorHTMLAttributes<HTMLAnchorElement>["onClick"];
  };

type TrackingWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  clarity?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

export function TrackedLink({ children, eventName, eventProperties = {}, ...props }: TrackedLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const trackingWindow = window as TrackingWindow;
    const cleanProperties = Object.fromEntries(
      Object.entries(eventProperties).filter(([, value]) => value !== undefined),
    );

    trackingWindow.gtag?.("event", eventName, cleanProperties);
    trackingWindow.clarity?.("event", eventName);
    trackingWindow.dataLayer?.push({ event: eventName, ...cleanProperties });
    props.onClick?.(event);
  }

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}
