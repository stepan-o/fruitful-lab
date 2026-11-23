"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackToolStart, trackToolView } from "@/lib/gtm";

/**
 * Hook for tool pages to fire tool_view once and expose a trackToolStart function.
 */
export function useToolAnalytics({ toolName }: { toolName: string }) {
  const pathname = usePathname();
  const firedRef = useRef(false);

  // Optional safety tweak: if the toolName changes while this hook instance
  // remains mounted, allow tool_view to fire again for the new tool.
  useEffect(() => {
    firedRef.current = false;
  }, [toolName]);

  useEffect(() => {
    if (firedRef.current) return;
    if (!pathname) return;
    firedRef.current = true; // guard against StrictMode double-invoke/re-renders
    trackToolView(toolName, pathname);
  }, [pathname, toolName]);

  const trackStart = useMemo(() => {
    return () => {
      const loc = typeof window !== "undefined" ? window.location.pathname : pathname || "";
      trackToolStart(toolName, loc);
    };
  }, [toolName, pathname]);

  return { trackToolStart: trackStart } as const;
}
