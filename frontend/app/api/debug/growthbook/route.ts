// frontend/app/api/debug/growthbook/route.ts
import { NextResponse } from "next/server";
import { growthbookDebugState } from "@/lib/growthbook/flags";

export async function GET() {
  // Dev-only helper: DO NOT expose sensitive values
  return NextResponse.json({
    envConfigured: growthbookDebugState.envConfigured,
    initialized: growthbookDebugState.initialized,
    lastError: growthbookDebugState.lastError
      ? {
          name: growthbookDebugState.lastError.name,
          message: growthbookDebugState.lastError.message,
        }
      : null,
    nodeEnv: process.env.NODE_ENV,
  });
}
