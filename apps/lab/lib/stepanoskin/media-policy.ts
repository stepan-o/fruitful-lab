/** Server-owned execution mode. Never controlled by a cookie or URL. */
export function isInternalResearchMode(env: Record<string, string | undefined> = process.env) {
  return env.STEPANOSKIN_RESEARCH_MODE === "1" && env.NODE_ENV === "development" && !env.VERCEL;
}
