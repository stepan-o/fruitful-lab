import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { ContentHqApp, type ContentHqItem } from "./ContentHqApp";

export const metadata: Metadata = {
  title: "Content HQ",
  description: "Hidden Bloom Whispers content planning workspace.",
  robots: {
    index: false,
    follow: false,
  },
};

const TRACKER_PATH = "../../docs/brands/bloom-whispers/content-hq/bloom-whispers-content-hq.csv";
const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1YN2hC9Tap5S5Uk8blyP6NLjYu-FwdQIc8_HtR-FuunI/edit";
const GOOGLE_DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/1cMprLKTUbv8qTnRNYHNO3RN02xl3GsQp";

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === "\"") {
      if (quoted && next === "\"") {
        cell += "\"";
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell);
  if (row.some((value) => value.trim() !== "")) rows.push(row);

  return rows;
}

function loadContentHqItems(): ContentHqItem[] {
  const csvPath = path.resolve(process.cwd(), TRACKER_PATH);
  const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
  const [headers, ...records] = rows;

  return records.map((record) =>
    Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ""])) as ContentHqItem,
  );
}

export default function ContentHqPage() {
  const items = loadContentHqItems();

  return (
    <ContentHqApp
      driveFolderUrl={GOOGLE_DRIVE_FOLDER_URL}
      generatedAt="2026-08-18"
      initialItems={items}
      sheetUrl={GOOGLE_SHEET_URL}
    />
  );
}
