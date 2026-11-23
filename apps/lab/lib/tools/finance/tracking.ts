"use client";
import { pushEvent } from "@/lib/gtm";
export function trackFinance(action: "scenario_apply" | "view_report" | "view_methodology" | "refresh" | "export_csv" | "print_report" | "save_plan") {
  // Never send transfer amounts, targets, fees, or personal notes to analytics.
  pushEvent("finance_interaction", { tool_name: "finance_exchange", action });
}
