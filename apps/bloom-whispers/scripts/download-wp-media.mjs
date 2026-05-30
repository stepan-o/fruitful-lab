import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const exportPath = path.join(appRoot, "content-import", "bloomwhispers.WordPress.2026-05-29.xml");
const publicRoot = path.join(appRoot, "public");

const uploadUrlPattern =
  /https?:\/\/bloomwhispers\.com\/wp-content\/uploads\/[A-Za-z0-9_./%()+,@~:-]+\.(?:jpe?g|png|webp|gif|pdf)/gi;

function localPathForUrl(url) {
  const { pathname } = new URL(url);
  return path.join(publicRoot, decodeURI(pathname));
}

async function downloadFile(url, destination) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const body = Buffer.from(await response.arrayBuffer());
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, body);
}

async function main() {
  const exportXml = await readFile(exportPath, "utf8");
  const urls = [...new Set([...exportXml.matchAll(uploadUrlPattern)].map(([url]) => url.replace(/&amp;/g, "&")))].sort();

  if (urls.length === 0) {
    console.log("No WordPress media URLs found.");
    return;
  }

  let downloaded = 0;
  let skipped = 0;
  const failed = [];

  console.log(`Found ${urls.length} WordPress media files.`);

  for (const [index, url] of urls.entries()) {
    const destination = localPathForUrl(url);
    const relativeDestination = path.relative(appRoot, destination);

    if (existsSync(destination)) {
      skipped += 1;
      console.log(`[${index + 1}/${urls.length}] Exists: ${relativeDestination}`);
      continue;
    }

    try {
      await downloadFile(url, destination);
      downloaded += 1;
      console.log(`[${index + 1}/${urls.length}] Downloaded: ${relativeDestination}`);
    } catch (error) {
      failed.push({ url, error: error instanceof Error ? error.message : String(error) });
      console.log(`[${index + 1}/${urls.length}] Failed: ${url}`);
    }
  }

  console.log("");
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Skipped existing: ${skipped}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log("");
    console.log("Failed URLs:");
    for (const item of failed) {
      console.log(`- ${item.url} (${item.error})`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
