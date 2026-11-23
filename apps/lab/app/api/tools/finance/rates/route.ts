import { getRateSnapshot } from "@/lib/tools/finance/data";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return Response.json(await getRateSnapshot(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Bank of Canada rates could not be loaded. Please try again shortly." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
