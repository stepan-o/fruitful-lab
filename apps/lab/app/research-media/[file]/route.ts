import { readFile } from "node:fs/promises";
import path from "node:path";
import { isInternalResearchMode } from "@/lib/stepanoskin/media-policy";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", "Vercel-CDN-Cache-Control": "no-store", "X-Robots-Tag": "noindex, noarchive" };

export async function GET(_request: Request, {params}: {params: Promise<{file:string}>}) {
  const {file} = await params;
  if (!isInternalResearchMode() || !/^[a-f0-9]{64}\.webp$/.test(file)) return new Response(null, {status:404,headers});
  try {
    const bytes = await readFile(path.join(process.cwd(), "assets/research/public/media/files", file));
    return new Response(bytes, {headers:{...headers,"Content-Type":"image/webp"}});
  } catch { return new Response(null, {status:404,headers}); }
}
