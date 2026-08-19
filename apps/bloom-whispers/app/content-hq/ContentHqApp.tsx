"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import styles from "./ContentHqPage.module.css";

export type ContentHqItem = Record<string, string>;

type View = "home" | "planning" | "pipeline" | "monitoring";
type HomeList = "drafts" | "scheduled" | "published";
type ChannelFilter = "All" | "Blog" | "Instagram" | "Etsy" | "Pinterest" | "Podcast" | "Affiliate";
type PlanningStageLabel = "Idea" | "Research" | "Drafted";
type SyncMode = "local" | "loading" | "ready" | "saving" | "saved" | "error";
type SyncState = {
  mode: SyncMode;
  message: string;
  syncedAt?: string;
};

const STORAGE_KEY = "bloom-whispers-content-hq-local-v1";
const SYNC_KEY_STORAGE_KEY = "bloom-whispers-content-hq-sync-key-v1";
const CONTENT_HQ_API_PATH = "/api/content-hq";
const CONTENT_HQ_API_ORIGIN = "https://bloomwhispers.com";
const pageChromeStyles = `
  body.content-hq-mode {
    background: #f9f1e4;
  }

  body.content-hq-mode .site-header,
  body.content-hq-mode .site-footer {
    display: none;
  }
`;

const contentChannels = ["Blog", "Instagram", "Etsy", "Pinterest", "Podcast", "Affiliate"];
const lastPostedChannels = ["Blog", "Instagram", "Etsy", "Pinterest", "Podcast"];
const channelFilterOptions: ChannelFilter[] = ["All", "Blog", "Instagram", "Pinterest", "Etsy", "Podcast", "Affiliate"];
const globalShortcuts = [
  { label: "Canva", url: "https://www.canva.com/" },
  { label: "Bloom site", url: "https://bloomwhispers.com/" },
  { label: "Etsy manager", url: "https://www.etsy.com/your/shops/me/dashboard" },
  { label: "Pinterest", url: "https://www.pinterest.com/" },
  { label: "Metricool", url: "https://app.metricool.com/" },
];
const channelShortcuts: Record<string, { label: string; url: string }[]> = {
  Blog: [{ label: "Open Bloom blog", url: "https://bloomwhispers.com/journal/" }],
  Instagram: [{ label: "Open Instagram", url: "https://www.instagram.com/" }],
  Pinterest: [
    { label: "Open Pinterest", url: "https://www.pinterest.com/" },
    { label: "Open Metricool", url: "https://app.metricool.com/" },
  ],
  Etsy: [{ label: "Open Etsy manager", url: "https://www.etsy.com/your/shops/me/dashboard" }],
  Podcast: [{ label: "Open Spotify creators", url: "https://creators.spotify.com/" }],
  Affiliate: [{ label: "Open Amazon Associates", url: "https://affiliate-program.amazon.com/" }],
};
const priorityOptions = [
  "P0 - active this week",
  "P1 - next best move",
  "P2 - strong backlog",
  "P3 - someday / parking lot",
  "Hold",
  "Done - published or implemented",
];
const stageOptions = [
  "Captured",
  "Idea Bank",
  "Needs Research",
  "Research Complete",
  "Selected",
  "Drafted",
  "Editor Review",
  "Ready To Produce",
  "In Production",
  "Ready To Schedule",
  "Scheduled",
  "Published",
  "Monitoring",
  "Repurpose Candidate",
  "Hold",
  "Archived",
  "Tracking",
];

const pipelineLanes = [
  { label: "Ideas", stages: ["Captured", "Idea Bank"], nextStage: "Idea Bank" },
  { label: "Research", stages: ["Needs Research", "Research Complete"], nextStage: "Needs Research" },
  { label: "Draft", stages: ["Selected", "Drafted", "Editor Review"], nextStage: "Drafted" },
  { label: "Create", stages: ["Ready To Produce", "In Production"], nextStage: "In Production" },
  { label: "Scheduled", stages: ["Ready To Schedule", "Scheduled"], nextStage: "Scheduled" },
  { label: "Published", stages: ["Published", "Monitoring", "Repurpose Candidate"], nextStage: "Published" },
  { label: "Hold", stages: ["Hold", "Archived", "Tracking"], nextStage: "Hold" },
];
const planningStageGroups: { label: PlanningStageLabel; stages: string[] }[] = [
  { label: "Idea", stages: ["Captured", "Idea Bank"] },
  { label: "Research", stages: ["Needs Research", "Research Complete"] },
  { label: "Drafted", stages: ["Selected", "Drafted", "Editor Review"] },
];
const collapsedPlanningBucketLimit = 5;
const collapsedPipelineLaneLimit = 10;
const staticBackfillFields = new Set([
  "Publish URL",
  "Last Posted Date",
  "Last Checked",
  "Metric Snapshot",
  "Last Optimized Date",
]);

const draftStages = new Set(["Selected", "Drafted", "Editor Review", "Ready To Produce", "In Production"]);
const scheduledStages = new Set(["Ready To Schedule", "Scheduled"]);
const publishedStages = new Set(["Published", "Monitoring", "Repurpose Candidate"]);
const activeStages = new Set(["Selected", "Drafted", "Editor Review", "Ready To Produce", "In Production", "Ready To Schedule", "Scheduled"]);

function field(item: ContentHqItem, key: string) {
  return item[key]?.trim() ?? "";
}

function contentHqApiUrl(searchParams?: Record<string, string>) {
  const params = new URLSearchParams(searchParams);

  if (typeof window === "undefined") {
    const query = params.toString();
    return `${CONTENT_HQ_API_PATH}${query ? `?${query}` : ""}`;
  }

  const currentOrigin = window.location.origin;
  const shouldUseCurrentOrigin =
    currentOrigin === "https://bloomwhispers.com" ||
    currentOrigin === "https://www.bloomwhispers.com" ||
    currentOrigin.endsWith(".bloom-whispers.pages.dev");
  const url = new URL(CONTENT_HQ_API_PATH, shouldUseCurrentOrigin ? currentOrigin : CONTENT_HQ_API_ORIGIN);

  for (const [key, value] of params) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}

async function readApiJson<T>(response: Response) {
  const text = await response.text();
  const trimmed = text.trim();

  if (!trimmed) return {} as T;

  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    throw new Error("The Content HQ API returned a web page instead of data. Refresh the dashboard, then try again.");
  }

  try {
    return JSON.parse(trimmed) as T;
  } catch {
    throw new Error("The Content HQ API returned data that the dashboard could not read.");
  }
}

function isUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function titleFor(item: ContentHqItem) {
  return field(item, "Asset / Idea") || "Untitled item";
}

function idFor(item: ContentHqItem) {
  return field(item, "HQ ID") || titleFor(item);
}

function todayDate() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function parseDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(value: string) {
  const date = parseDate(value);
  if (!date) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function monthLabel(monthValue: string) {
  const [year, month] = monthValue.split("-").map(Number);
  if (!year || !month) return "August 2026";
  return new Date(year, month - 1, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function daysBetween(value: string, date = todayDate()) {
  const parsed = parseDate(value);
  if (!parsed) return null;
  return Math.round((parsed.getTime() - date.getTime()) / 86400000);
}

function isActive(item: ContentHqItem) {
  return !["Published", "Archived", "Hold"].includes(field(item, "Stage"));
}

function canonicalChannelName(value: string) {
  const channel = value.toLowerCase();
  if (channel.includes("instagram")) return "Instagram";
  if (channel.includes("pinterest")) return "Pinterest";
  if (channel.includes("etsy")) return "Etsy";
  if (channel.includes("podcast") || channel.includes("youtube")) return "Podcast";
  if (channel.includes("blog") || channel.includes("website") || channel.includes("guide") || channel.includes("article")) return "Blog";
  if (channel.includes("affiliate")) return "Affiliate";
  return "";
}

function itemChannel(item: ContentHqItem) {
  const area = field(item, "Ecosystem Area");
  const candidates =
    area === "Published Baseline"
      ? [field(item, "Primary Channel"), field(item, "Asset Type")]
      : [area, field(item, "Primary Channel"), field(item, "Asset Type")];

  for (const candidate of candidates) {
    const canonical = canonicalChannelName(candidate);
    if (canonical) return canonical;
  }

  return "Unassigned";
}

function isContent(item: ContentHqItem) {
  return itemChannel(item) !== "Unassigned";
}

function isPipelineItem(item: ContentHqItem) {
  const assetType = field(item, "Asset Type");
  return isContent(item) && assetType !== "Shop Operations" && assetType !== "Inventory Constraint";
}

function channelMatches(item: ContentHqItem, channel: string) {
  return itemChannel(item) === channel;
}

function isJournalPostMonitoringItem(item: ContentHqItem) {
  return (
    field(item, "Source / Evidence").includes("journalPosts.ts") &&
    field(item, "Publish URL").includes("bloomwhispers.com") &&
    field(item, "Asset Type") !== "Archive"
  );
}

function monitoringChannel(item: ContentHqItem) {
  if (isJournalPostMonitoringItem(item)) return "Blog";
  return itemChannel(item);
}

function monitoringChannelMatches(item: ContentHqItem, channel: string) {
  return monitoringChannel(item) === channel;
}

function priorityRank(item: ContentHqItem) {
  const priority = field(item, "Priority");
  if (priority.startsWith("P0")) return 0;
  if (priority.startsWith("P1")) return 1;
  if (priority.startsWith("P2")) return 2;
  if (priority.startsWith("P3")) return 3;
  if (priority.startsWith("Hold")) return 8;
  if (priority.startsWith("Done")) return 9;
  return 5;
}

function sortItems(items: ContentHqItem[]) {
  return [...items].sort((a, b) => {
    const workA = parseDate(field(a, "Work Date"));
    const workB = parseDate(field(b, "Work Date"));
    if (workA && workB && workA.getTime() !== workB.getTime()) return workA.getTime() - workB.getTime();
    if (workA && !workB) return -1;
    if (!workA && workB) return 1;
    const priorityDiff = priorityRank(a) - priorityRank(b);
    if (priorityDiff !== 0) return priorityDiff;
    return titleFor(a).localeCompare(titleFor(b));
  });
}

function sortMonitoringItems(items: ContentHqItem[]) {
  return [...items].sort((a, b) => {
    const postedDiff = field(b, "Last Posted Date").localeCompare(field(a, "Last Posted Date"));
    if (postedDiff !== 0) return postedDiff;
    const publishDiff = field(b, "Target Publish Date").localeCompare(field(a, "Target Publish Date"));
    if (publishDiff !== 0) return publishDiff;
    return titleFor(a).localeCompare(titleFor(b));
  });
}

function isMonitoringItem(item: ContentHqItem) {
  const stage = field(item, "Stage");
  return publishedStages.has(stage) && field(item, "Asset Type") !== "Shop Operations";
}

function mergeItemsById(baseItems: ContentHqItem[], incomingItems: ContentHqItem[]) {
  const baseById = new Map(baseItems.map((item) => [idFor(item), item]));
  const incomingIds = new Set(incomingItems.map((item) => idFor(item)));
  const mergedIncomingItems = incomingItems.map((incomingItem) => {
    const baseItem = baseById.get(idFor(incomingItem));
    if (!baseItem) return incomingItem;

    const mergedItem = { ...baseItem, ...incomingItem };
    for (const key of staticBackfillFields) {
      if (!field(mergedItem, key) && field(baseItem, key)) {
        mergedItem[key] = field(baseItem, key);
      }
    }

    return mergedItem;
  });

  return [...mergedIncomingItems, ...baseItems.filter((item) => !incomingIds.has(idFor(item)))];
}

function warningsFor(item: ContentHqItem) {
  const warnings: string[] = [];
  const stage = field(item, "Stage");
  const missing = field(item, "Missing / Incomplete Items");
  const susyInput = field(item, "Susy Input");
  const blocker = field(item, "Blocked By");
  const lastUpdatedAge = daysBetween(field(item, "Last Updated"));

  if (isActive(item) && !field(item, "Work Date") && field(item, "Priority").startsWith("P0")) warnings.push("No work date");
  if (isActive(item) && !field(item, "Target Publish Date") && field(item, "Priority").startsWith("P0")) warnings.push("No publish date");
  if (susyInput) warnings.push("Needs Susy input");
  if (blocker) warnings.push(`Blocked: ${blocker}`);
  if (publishedStages.has(stage) && !field(item, "Publish URL")) warnings.push("Missing URL");
  if (publishedStages.has(stage) && missing) warnings.push("Published incomplete");
  if (publishedStages.has(stage) && !field(item, "Last Optimized Date")) warnings.push("Not optimized");
  if (activeStages.has(stage) && (lastUpdatedAge === null || lastUpdatedAge <= -7)) warnings.push("Stale draft");

  return warnings;
}

function channelClass(channel: string) {
  if (channel === "Instagram") return styles.channelInstagram;
  if (channel === "Pinterest") return styles.channelPinterest;
  if (channel === "Blog") return styles.channelBlog;
  if (channel === "Etsy") return styles.channelEtsy;
  if (channel === "Podcast") return styles.channelPodcast;
  if (channel === "Affiliate") return styles.channelAffiliate;
  return styles.channelNeutral;
}

function statusClass(item: ContentHqItem) {
  return channelClass(itemChannel(item));
}

function planningStageLabel(item: ContentHqItem) {
  const stage = field(item, "Stage");
  return planningStageGroups.find((group) => group.stages.includes(stage))?.label ?? "";
}

function stageLabelFor(item: ContentHqItem) {
  return planningStageLabel(item) || field(item, "Stage") || "No stage";
}

function warningClass(warning: string) {
  if (warning.startsWith("Blocked")) return styles.warnBlocked;
  if (warning === "Needs Susy input") return styles.warnNeedsInput;
  if (warning === "No publish date") return styles.warnNoPublishDate;
  if (warning === "No work date") return styles.warnNoWorkDate;
  if (warning === "Missing URL") return styles.warnMissingUrl;
  if (warning === "Published incomplete") return styles.warnIncomplete;
  if (warning === "Not optimized") return styles.warnNotOptimized;
  if (warning === "Stale draft") return styles.warnStale;
  return styles.warnNeutral;
}

function useContentHqItems(initialItems: ContentHqItem[]) {
  const [items, setItems] = useState(initialItems);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasLocalEdits, setHasLocalEdits] = useState(false);
  const [syncKey, setSyncKeyState] = useState("");
  const [syncState, setSyncState] = useState<SyncState>({
    mode: "local",
    message: "Local browser mode. Add the sync key after Cloudflare is configured.",
  });

  useEffect(() => {
    document.body.classList.add("content-hq-mode");
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const savedSyncKey = window.localStorage.getItem(SYNC_KEY_STORAGE_KEY) ?? "";
    const hydrationTimer = window.setTimeout(() => {
      if (savedSyncKey) {
        setSyncKeyState(savedSyncKey);
        setSyncState({ mode: "ready", message: "Sync key saved in this browser." });
      }
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as ContentHqItem[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            const mergedSavedItems = mergeItemsById(initialItems, parsed);
            setItems(mergedSavedItems);
            setHasLocalEdits(true);
            if (mergedSavedItems.length !== parsed.length) {
              window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedSavedItems));
            }
          }
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
      setIsHydrated(true);
    }, 0);

    return () => {
      window.clearTimeout(hydrationTimer);
      document.body.classList.remove("content-hq-mode");
    };
  }, [initialItems]);

  useEffect(() => {
    if (!isHydrated || !syncKey || hasLocalEdits) return;
    void reloadFromSheet();
    // This intentionally runs when the stored key becomes available after hydration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLocalEdits, isHydrated, syncKey]);

  useEffect(() => {
    if (isHydrated && hasLocalEdits) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [hasLocalEdits, isHydrated, items]);

  function updateItem(id: string, key: string, value: string) {
    setItems((current) => current.map((item) => (idFor(item) === id ? { ...item, [key]: value } : item)));
    setHasLocalEdits(true);

    if (syncKey) {
      void saveFieldToSheet(id, key, value);
    }
  }

  function setSyncKey(value: string) {
    const nextKey = value.trim();
    setSyncKeyState(nextKey);

    if (nextKey) {
      window.localStorage.setItem(SYNC_KEY_STORAGE_KEY, nextKey);
      setSyncState({ mode: "ready", message: hasLocalEdits ? "Sync key saved. Local edits are still in this browser." : "Sync key saved." });
    } else {
      window.localStorage.removeItem(SYNC_KEY_STORAGE_KEY);
      setSyncState({ mode: "local", message: "Local browser mode. Add the sync key after Cloudflare is configured." });
    }
  }

  async function reloadFromSheet() {
    if (!syncKey) {
      setSyncState({ mode: "local", message: "Add the sync key before loading the Google Sheet." });
      return;
    }

    setSyncState({ mode: "loading", message: "Loading from Google Sheet..." });

    try {
      const response = await fetch(contentHqApiUrl(), {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${syncKey}`,
        },
      });
      const body = await readApiJson<{ ok?: boolean; items?: ContentHqItem[]; message?: string; generatedAt?: string }>(response);

      if (!response.ok || !body.ok || !Array.isArray(body.items)) {
        throw new Error(body.message || "Google Sheet sync is not ready yet.");
      }

      const mergedItems = mergeItemsById(initialItems, body.items);
      const staticRows = mergedItems.length - body.items.length;

      setItems(mergedItems);
      window.localStorage.removeItem(STORAGE_KEY);
      setHasLocalEdits(false);
      setSyncState({
        mode: "ready",
        message:
          staticRows > 0
            ? `Loaded ${body.items.length} Sheet rows plus ${staticRows} site archive rows.`
            : `Loaded ${body.items.length} rows from Google Sheet.`,
        syncedAt: body.generatedAt || new Date().toISOString(),
      });
    } catch (error) {
      setSyncState({
        mode: "error",
        message: error instanceof Error ? error.message : "Could not load the Google Sheet.",
      });
    }
  }

  async function saveFieldToSheet(id: string, key: string, value: string) {
    setSyncState({ mode: "saving", message: `Saving ${key}...` });

    try {
      const response = await fetch(contentHqApiUrl(), {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${syncKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ id, key, type: "update-field", value }),
      });
      const body = await readApiJson<{ ok?: boolean; item?: ContentHqItem; message?: string; savedAt?: string }>(response);

      if (!response.ok || !body.ok) {
        throw new Error(body.message || "Could not save to Google Sheet.");
      }

      if (body.item) {
        setItems((current) => current.map((item) => (idFor(item) === id ? { ...item, ...body.item } : item)));
      }

      window.localStorage.removeItem(STORAGE_KEY);
      setHasLocalEdits(false);
      setSyncState({
        mode: "saved",
        message: `Saved ${key} to Google Sheet.`,
        syncedAt: body.savedAt || new Date().toISOString(),
      });
    } catch (error) {
      setSyncState({
        mode: "error",
        message: error instanceof Error ? error.message : "Could not save to Google Sheet.",
      });
    }
  }

  function resetLocalEdits() {
    window.localStorage.removeItem(STORAGE_KEY);
    setItems(initialItems);
    setHasLocalEdits(false);
    setSyncState(syncKey ? { mode: "ready", message: "Local edits discarded. Reload from Sheet when ready." } : { mode: "local", message: "Local edits discarded." });
  }

  return { hasLocalEdits, items, reloadFromSheet, resetLocalEdits, setSyncKey, syncKey, syncState, updateItem };
}

function ChannelBadge({ channel }: { channel: string }) {
  return <span className={`${styles.channelChip} ${channelClass(channel)}`}>{channel}</span>;
}

function StageBadge({ item }: { item: ContentHqItem }) {
  return <span className={styles.stageChip}>{stageLabelFor(item)}</span>;
}

function ChannelFilterButton({
  channel,
  isActive,
  onSelect,
}: {
  channel: ChannelFilter;
  isActive: boolean;
  onSelect: (channel: ChannelFilter) => void;
}) {
  return (
    <button
      aria-pressed={isActive}
      className={`${styles.channelFilterButton} ${isActive ? styles.activeChannelFilter : ""} ${channel === "All" ? "" : channelClass(channel)}`}
      onClick={() => onSelect(channel)}
      type="button"
    >
      {channel === "All" ? "All channels" : <ChannelBadge channel={channel} />}
    </button>
  );
}

function WarningChips({ warnings }: { warnings: string[] }) {
  return (
    <>
      {warnings.map((warning) => (
        <span className={`${styles.warningChip} ${warningClass(warning)}`} key={warning} title={warning}>
          {warning}
        </span>
      ))}
    </>
  );
}

function ShortcutLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function CardButton({ item, onOpen }: { item: ContentHqItem; onOpen: (item: ContentHqItem) => void }) {
  const warnings = warningsFor(item);
  const visibleWarnings = warnings.slice(0, 2);

  return (
    <button
      className={`${styles.itemCard} ${statusClass(item)}`}
      draggable
      onClick={() => onOpen(item)}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", idFor(item));
      }}
      type="button"
    >
      <span className={styles.cardMeta}>
        <span>{idFor(item)}</span>
        <ChannelBadge channel={itemChannel(item)} />
        <StageBadge item={item} />
      </span>
      <strong>{titleFor(item)}</strong>
      <span>{field(item, "Next Action") || field(item, "Short Description") || "Open item details"}</span>
      {warnings.length > 0 ? (
        <span className={styles.warningStrip}>
          <WarningChips warnings={visibleWarnings} />
        </span>
      ) : null}
    </button>
  );
}

function PipelineCardButton({ item, onOpen }: { item: ContentHqItem; onOpen: (item: ContentHqItem) => void }) {
  const warnings = warningsFor(item);
  const visibleWarning = warnings[0];
  const description = field(item, "Next Action") || field(item, "Short Description") || "Open item details";

  return (
    <button
      className={`${styles.pipelineCard} ${statusClass(item)}`}
      draggable
      onClick={() => onOpen(item)}
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", idFor(item));
      }}
      type="button"
    >
      <span className={styles.pipelineCardMeta}>
        <span>{idFor(item)}</span>
        <ChannelBadge channel={itemChannel(item)} />
        <StageBadge item={item} />
      </span>
      <strong>{titleFor(item)}</strong>
      <span className={styles.pipelineCardBody}>{description}</span>
      {visibleWarning ? (
        <span className={styles.pipelineCardWarnings}>
          <span className={`${styles.warningChip} ${warningClass(visibleWarning)}`}>{visibleWarning}</span>
          {warnings.length > 1 ? <span className={styles.pipelineWarningCount}>+{warnings.length - 1}</span> : null}
        </span>
      ) : null}
    </button>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return <div className={styles.emptyState}>{children}</div>;
}

export function ContentHqApp({
  driveFolderUrl,
  generatedAt,
  initialItems,
  sheetUrl,
}: {
  driveFolderUrl: string;
  generatedAt: string;
  initialItems: ContentHqItem[];
  sheetUrl: string;
}) {
  const { hasLocalEdits, items, reloadFromSheet, resetLocalEdits, setSyncKey, syncKey, syncState, updateItem } = useContentHqItems(initialItems);
  const [view, setView] = useState<View>("home");
  const [homeList, setHomeList] = useState<HomeList>("drafts");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("All");
  const [planningMonth, setPlanningMonth] = useState("2026-08");
  const [expandedPlanningBuckets, setExpandedPlanningBuckets] = useState<Record<PlanningStageLabel, boolean>>({
    Drafted: false,
    Idea: false,
    Research: false,
  });
  const [expandedPipelineLanes, setExpandedPipelineLanes] = useState<Record<string, boolean>>({});

  const selectedItem = selectedId ? (items.find((item) => idFor(item) === selectedId) ?? null) : null;
  const today = todayDate();

  const allContentItems = useMemo(() => sortItems(items.filter((item) => isContent(item))), [items]);
  const workingItems = useMemo(
    () => (channelFilter === "All" ? allContentItems : allContentItems.filter((item) => itemChannel(item) === channelFilter)),
    [allContentItems, channelFilter],
  );
  const todayItems = workingItems.filter((item) => field(item, "Work Date") && daysBetween(field(item, "Work Date"), today) === 0);
  const weekItems = workingItems.filter((item) => {
    const distance = daysBetween(field(item, "Work Date"), today);
    return distance !== null && distance >= 0 && distance <= 7;
  });
  const drafts = workingItems.filter((item) => draftStages.has(field(item, "Stage")));
  const scheduled = workingItems.filter((item) => scheduledStages.has(field(item, "Stage")));
  const published = workingItems.filter((item) => publishedStages.has(field(item, "Stage")));
  const pipelineItems = workingItems.filter(isPipelineItem);
  const monitoringItems =
    channelFilter === "All"
      ? allContentItems
      : allContentItems.filter((item) => monitoringChannelMatches(item, channelFilter));
  const selectedMonthLabel = monthLabel(planningMonth);
  const workItemsThisMonth = workingItems.filter((item) => {
    const workDate = parseDate(field(item, "Work Date"));
    return workDate && `${workDate.getFullYear()}-${String(workDate.getMonth() + 1).padStart(2, "0")}` === planningMonth;
  });
  const planningPoolItems = workingItems.filter((item) => planningStageLabel(item) && !field(item, "Work Date"));
  const planningBuckets = planningStageGroups.map((group) => ({
    ...group,
    items: planningPoolItems.filter((item) => planningStageLabel(item) === group.label),
  }));
  const monitoringRows = sortMonitoringItems(monitoringItems.filter(isMonitoringItem));
  const journalMonitoringRows = monitoringRows.filter(isJournalPostMonitoringItem).length;
  const missingMonitoringUrls = monitoringRows.filter((item) => !field(item, "Publish URL")).length;
  const visibleLastPostedChannels = channelFilter === "All" ? lastPostedChannels : lastPostedChannels.filter((channel) => channel === channelFilter);
  const calendarFeedUrl = syncKey ? contentHqApiUrl({ format: "ics", token: syncKey }) : "";

  function openItem(item: ContentHqItem) {
    setSelectedId(idFor(item));
  }

  function selectChannelFilter(nextFilter: ChannelFilter) {
    setChannelFilter(nextFilter);
    if (selectedItem && nextFilter !== "All" && itemChannel(selectedItem) !== nextFilter) {
      setSelectedId(null);
    }
  }

  function droppedItemId(event: React.DragEvent) {
    event.preventDefault();
    return event.dataTransfer.getData("text/plain");
  }

  function updateSelected(key: string, value: string) {
    if (selectedItem) updateItem(idFor(selectedItem), key, value);
  }

  const selectedListItems = homeList === "drafts" ? drafts : homeList === "scheduled" ? scheduled : published;

  return (
    <div className={styles.contentHqApp}>
      <style>{pageChromeStyles}</style>
      <header className={styles.appHeader}>
        <div>
          <p className={styles.eyebrow}>Bloom Whispers Content HQ</p>
          <h1>Content planning app</h1>
          <p>Home, planning calendar, pipeline, monitoring.</p>
        </div>
        <div className={styles.sourcePanel}>
          <span>Source of truth</span>
          <a href={sheetUrl} target="_blank" rel="noreferrer">
            Google Sheet
          </a>
          <a href={driveFolderUrl} target="_blank" rel="noreferrer">
            Bloom Whispers Drive
          </a>
        </div>
      </header>

      <nav className={styles.appNav} aria-label="Content HQ sections">
        {[
          ["home", "Home"],
          ["planning", "Planning"],
          ["pipeline", "Pipeline"],
          ["monitoring", "Monitoring"],
        ].map(([id, label]) => (
          <button
            aria-pressed={view === id}
            className={view === id ? styles.activeNavButton : ""}
            key={id}
            onClick={() => setView(id as View)}
            type="button"
          >
            {label}
          </button>
        ))}
      </nav>

      <div className={styles.shortcutBar} aria-label="Production shortcuts">
        <span>Quick links</span>
        {globalShortcuts.map((shortcut) => (
          <ShortcutLink href={shortcut.url} key={shortcut.label}>
            {shortcut.label}
          </ShortcutLink>
        ))}
      </div>

      <div className={`${styles.syncPanel} ${styles[`sync${syncState.mode[0].toUpperCase()}${syncState.mode.slice(1)}`]}`} aria-label="Sheet sync controls">
        <div className={styles.syncStatus}>
          <span>Sheet sync</span>
          <strong>{syncState.message}</strong>
          {syncState.syncedAt ? <small>Last sync {formatTime(syncState.syncedAt)}</small> : null}
        </div>
        <label className={styles.syncKeyField}>
          Sync key
          <input
            autoComplete="off"
            onChange={(event) => setSyncKey(event.target.value)}
            placeholder="Paste private key"
            type="password"
            value={syncKey}
          />
        </label>
        <button onClick={reloadFromSheet} type="button">
          Reload from Sheet
        </button>
        {calendarFeedUrl ? (
          <a href={calendarFeedUrl} target="_blank" rel="noreferrer">
            Apple work calendar feed
          </a>
        ) : (
          <span className={styles.disabledSyncLink}>Apple work calendar feed needs sync key</span>
        )}
      </div>

      {hasLocalEdits ? (
        <div className={styles.localNotice}>
          <span>Local browser edits are active. With sync configured, field changes save to the Google Sheet after you leave the field.</span>
          <button onClick={resetLocalEdits} type="button">
            Discard dashboard edits
          </button>
        </div>
      ) : null}

      <div className={styles.channelLegend} aria-label="Channel colors">
        {channelFilterOptions.map((channel) => (
          <ChannelFilterButton channel={channel} isActive={channelFilter === channel} key={channel} onSelect={selectChannelFilter} />
        ))}
      </div>

      <main className={`${styles.workspace} ${selectedItem ? "" : styles.workspaceFull}`}>
        <section className={styles.primaryPanel}>
          {view === "home" ? (
            <>
              <div className={styles.homeGrid}>
                <section className={styles.todayPanel}>
                  <div className={styles.sectionTitle}>
                    <span>Today</span>
                    <h2>Content to create</h2>
                  </div>
                  <div className={styles.compactList}>
                    {todayItems.length > 0 ? (
                      todayItems.map((item) => <CardButton item={item} key={idFor(item)} onOpen={openItem} />)
                    ) : (
                      <EmptyState>No work is dated for today.</EmptyState>
                    )}
                  </div>
                </section>

                <section className={styles.weekPanel}>
                  <div className={styles.sectionTitle}>
                    <span>This week</span>
                    <h2>{weekItems.length} work items</h2>
                  </div>
                  <div className={styles.compactList}>
                    {weekItems.length > 0 ? (
                      weekItems.slice(0, 6).map((item) => <CardButton item={item} key={idFor(item)} onOpen={openItem} />)
                    ) : (
                      <EmptyState>Fill `Work Date` during monthly planning.</EmptyState>
                    )}
                  </div>
                </section>
              </div>

              <div className={styles.statusBoxes}>
                {[
                  ["drafts", "In drafts", drafts.length],
                  ["scheduled", "Scheduled", scheduled.length],
                  ["published", "Published", published.length],
                ].map(([id, label, count]) => (
                  <button
                    aria-pressed={homeList === id}
                    className={homeList === id ? styles.activeStatusBox : ""}
                    key={id}
                    onClick={() => setHomeList(id as HomeList)}
                    type="button"
                  >
                    <span>{label}</span>
                    <strong>{count}</strong>
                  </button>
                ))}
              </div>

              <section className={styles.listPanel}>
                <div className={styles.sectionTitle}>
                  <span>{homeList}</span>
                  <h2>{homeList === "drafts" ? "Draft listings" : homeList === "scheduled" ? "Scheduled listings" : "Published listings"}</h2>
                </div>
                <div className={styles.listGrid}>
                  {selectedListItems.length > 0 ? (
                    selectedListItems.slice(0, 12).map((item) => <CardButton item={item} key={idFor(item)} onOpen={openItem} />)
                  ) : (
                    <EmptyState>No items in this box.</EmptyState>
                  )}
                </div>
              </section>

              <section className={styles.lastPosted}>
                <div className={styles.sectionTitle}>
                  <span>Last posted</span>
                  <h2>By channel</h2>
                </div>
                <div className={styles.lastGrid}>
                  {visibleLastPostedChannels.length > 0 ? (
                    visibleLastPostedChannels.map((channel) => {
                      const latest = [...published]
                        .filter((item) => channelMatches(item, channel) && field(item, "Last Posted Date"))
                        .sort((a, b) => field(b, "Last Posted Date").localeCompare(field(a, "Last Posted Date")))[0];
                      return (
                        <button
                          className={`${styles.lastCard} ${latest ? statusClass(latest) : channelClass(channel)}`}
                          key={channel}
                          onClick={() => latest && openItem(latest)}
                          type="button"
                        >
                          <ChannelBadge channel={channel} />
                          <strong>{latest ? titleFor(latest) : "No posted record"}</strong>
                          <small>{latest ? formatDate(field(latest, "Last Posted Date")) : "Add first live item"}</small>
                        </button>
                      );
                    })
                  ) : (
                    <EmptyState>No last-posted card for this channel yet.</EmptyState>
                  )}
                </div>
              </section>
            </>
          ) : null}

          {view === "planning" ? (
            <section className={styles.planningView}>
              <div className={styles.toolbar}>
                <div className={styles.sectionTitle}>
                  <span>Planning</span>
                  <h2>{selectedMonthLabel}</h2>
                </div>
                <label>
                  Month
                  <input value={planningMonth} onChange={(event) => setPlanningMonth(event.target.value)} type="month" />
                </label>
              </div>
              <div className={styles.planningLayout}>
                <Calendar
                  items={workItemsThisMonth}
                  monthValue={planningMonth}
                  onDropItem={(id, date) => updateItem(id, "Work Date", date)}
                  onOpen={openItem}
                />
                <aside className={styles.undatedPanel}>
                  <div className={styles.sectionTitle}>
                    <span>Planning pool</span>
                    <h2>{planningPoolItems.length} candidates</h2>
                  </div>
                  <div
                    className={styles.planningPool}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      const id = droppedItemId(event);
                      if (id) updateItem(id, "Work Date", "");
                    }}
                  >
                    {planningPoolItems.length > 0 ? (
                      planningBuckets.map((bucket) => {
                        const isExpanded = expandedPlanningBuckets[bucket.label];
                        const visibleItems = isExpanded ? bucket.items : bucket.items.slice(0, collapsedPlanningBucketLimit);
                        const hiddenCount = Math.max(bucket.items.length - visibleItems.length, 0);

                        return (
                          <section className={styles.planningPoolSection} key={bucket.label}>
                            <div className={styles.poolHeader}>
                              <div className={styles.poolHeaderTitle}>
                                <h3>{bucket.label}</h3>
                                {bucket.items.length > collapsedPlanningBucketLimit ? (
                                  <span className={styles.poolHint}>
                                    Showing {visibleItems.length} of {bucket.items.length}
                                  </span>
                                ) : null}
                              </div>
                              <div className={styles.poolControls}>
                                <span className={styles.poolCount}>{bucket.items.length}</span>
                                {bucket.items.length > collapsedPlanningBucketLimit ? (
                                  <button
                                    className={styles.poolToggle}
                                    onClick={() =>
                                      setExpandedPlanningBuckets((current) => ({
                                        ...current,
                                        [bucket.label]: !current[bucket.label],
                                      }))
                                    }
                                    type="button"
                                  >
                                    {isExpanded ? "Show fewer" : `Show ${hiddenCount} more`}
                                  </button>
                                ) : null}
                              </div>
                            </div>
                            <div className={styles.compactList}>
                              {visibleItems.length > 0 ? (
                                visibleItems.map((item) => <CardButton item={item} key={idFor(item)} onOpen={openItem} />)
                              ) : (
                                <EmptyState>No unscheduled {bucket.label.toLowerCase()} items.</EmptyState>
                              )}
                            </div>
                          </section>
                        );
                      })
                    ) : (
                      <EmptyState>All Idea, Research, and Drafted candidates already have a work date.</EmptyState>
                    )}
                  </div>
                </aside>
              </div>
            </section>
          ) : null}

          {view === "pipeline" ? (
            <section className={styles.pipelineView}>
              <div className={styles.sectionTitle}>
                <span>Content pipeline</span>
                <h2>Main pipeline view</h2>
              </div>
              <div className={styles.pipelineBoard}>
                {pipelineLanes.map((lane) => {
                  const laneItems = pipelineItems.filter((item) => lane.stages.includes(field(item, "Stage")));
                  const isLaneExpanded = Boolean(expandedPipelineLanes[lane.label]);
                  const visibleLaneItems = isLaneExpanded ? laneItems : laneItems.slice(0, collapsedPipelineLaneLimit);
                  const hiddenLaneItems = Math.max(laneItems.length - visibleLaneItems.length, 0);
                  return (
                    <section
                      className={styles.pipelineLane}
                      key={lane.label}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        const id = droppedItemId(event);
                        if (id) updateItem(id, "Stage", lane.nextStage);
                      }}
                    >
                      <div className={styles.laneHeader}>
                        <h2>{lane.label}</h2>
                        <span>{laneItems.length}</span>
                      </div>
                      <div className={styles.laneCards}>
                        {visibleLaneItems.map((item) => (
                          <PipelineCardButton item={item} key={idFor(item)} onOpen={openItem} />
                        ))}
                        {laneItems.length > collapsedPipelineLaneLimit ? (
                          <div className={styles.laneMore}>
                            <span>
                              Showing {visibleLaneItems.length} of {laneItems.length}.
                            </span>
                            <button
                              onClick={() =>
                                setExpandedPipelineLanes((current) => ({
                                  ...current,
                                  [lane.label]: !current[lane.label],
                                }))
                              }
                              type="button"
                            >
                              {isLaneExpanded ? "Show fewer" : `Show ${hiddenLaneItems} more`}
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </section>
                  );
                })}
              </div>
            </section>
          ) : null}

          {view === "monitoring" ? (
            <section className={styles.monitoringView}>
              <div className={styles.sectionTitle}>
                <span>Monitoring</span>
                <h2>Published content dashboard</h2>
              </div>
              <div className={styles.monitorSummary}>
                <span>
                  <strong>{monitoringRows.length}</strong> live/archive rows
                </span>
                <span>
                  <strong>{journalMonitoringRows}</strong> journal URLs
                </span>
                <span>
                  <strong>{missingMonitoringUrls}</strong> missing URLs
                </span>
              </div>
              <div className={styles.monitorTable} aria-label="Published content">
                <div className={styles.monitorHeader}>
                  <span>Channel</span>
                  <span>Item</span>
                  <span>URL</span>
                  <span>Published</span>
                  <span>Last optimized</span>
                  <span>Warnings</span>
                </div>
                {monitoringRows.length > 0 ? (
                  monitoringRows.map((item) => {
                    const warnings = warningsFor(item);
                    const publishUrl = field(item, "Publish URL");
                    const channel = monitoringChannel(item);
                    return (
                      <button className={`${styles.monitorRow} ${channelClass(channel)}`} key={idFor(item)} onClick={() => openItem(item)} type="button">
                        <span>
                          <ChannelBadge channel={channel} />
                        </span>
                        <strong>{titleFor(item)}</strong>
                        <span className={styles.urlText}>{publishUrl || "Missing URL"}</span>
                        <span>{formatDate(field(item, "Last Posted Date")) || formatDate(field(item, "Target Publish Date")) || "No date"}</span>
                        <span>{formatDate(field(item, "Last Optimized Date")) || "Never"}</span>
                        <span className={styles.rowWarnings}>{warnings.length > 0 ? <WarningChips warnings={warnings} /> : "Clear"}</span>
                      </button>
                    );
                  })
                ) : (
                  <EmptyState>No live or URL-bearing items for this channel yet.</EmptyState>
                )}
              </div>
            </section>
          ) : null}
        </section>

        {selectedItem ? (
          <ItemDrawer
            driveFolderUrl={driveFolderUrl}
            item={selectedItem}
            onChange={updateSelected}
            onClose={() => setSelectedId(null)}
            sheetUrl={sheetUrl}
          />
        ) : null}
      </main>

      <footer className={styles.appFooter}>
        <span>Generated {generatedAt}</span>
        <span>{items.length} tracked items</span>
        <span>{syncKey ? "Google Sheet sync key saved" : hasLocalEdits ? "Local edits active" : "Sheet snapshot"}</span>
      </footer>
    </div>
  );
}

function Calendar({
  items,
  monthValue,
  onDropItem,
  onOpen,
}: {
  items: ContentHqItem[];
  monthValue: string;
  onDropItem: (id: string, date: string) => void;
  onOpen: (item: ContentHqItem) => void;
}) {
  const [year, month] = monthValue.split("-").map(Number);
  const firstDate = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const leadingDays = firstDate.getDay();
  const cells = Array.from({ length: leadingDays + daysInMonth }, (_, index) => {
    if (index < leadingDays) return null;
    return new Date(year, month - 1, index - leadingDays + 1);
  });

  return (
    <div className={styles.calendarGrid}>
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <span className={styles.calendarDayName} key={day}>
          {day}
        </span>
      ))}
      {cells.map((date, index) => {
        const dateValue = date ? toDateInputValue(date) : "";
        const dateItems = date ? items.filter((item) => field(item, "Work Date") === dateValue) : [];
        return (
          <section
            className={styles.calendarCell}
            key={dateValue || `empty-${index}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const id = event.dataTransfer.getData("text/plain");
              if (id && dateValue) onDropItem(id, dateValue);
            }}
          >
            {date ? <span className={styles.dateNumber}>{date.getDate()}</span> : null}
            {dateItems.map((item) => (
              <CardButton item={item} key={idFor(item)} onOpen={onOpen} />
            ))}
          </section>
        );
      })}
    </div>
  );
}

function EditableField({
  item,
  label,
  name,
  onChange,
  options,
  rows = 2,
  type = "text",
}: {
  item: ContentHqItem;
  label: string;
  name: string;
  onChange: (key: string, value: string) => void;
  options?: string[];
  rows?: number;
  type?: "date" | "text" | "textarea";
}) {
  const value = field(item, name);
  const itemId = idFor(item);

  if (options) {
    const selectValue = name === "Ecosystem Area" ? canonicalChannelName(value) || itemChannel(item) : value;
    return (
      <label className={styles.field}>
        <span>{label}</span>
        <select value={selectValue} onChange={(event) => onChange(name, event.target.value)}>
          <option value="">Unassigned</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (type === "textarea") {
    return (
      <label className={styles.field}>
        <span>{label}</span>
        <textarea
          key={`${itemId}-${name}-${value}`}
          rows={rows}
          defaultValue={value}
          onBlur={(event) => {
            if (event.currentTarget.value !== value) onChange(name, event.currentTarget.value);
          }}
        />
      </label>
    );
  }

  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input
        key={`${itemId}-${name}-${value}`}
        type={type}
        defaultValue={value}
        onBlur={(event) => {
          if (event.currentTarget.value !== value) onChange(name, event.currentTarget.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
      />
    </label>
  );
}

function ItemDrawer({
  driveFolderUrl,
  item,
  onChange,
  onClose,
  sheetUrl,
}: {
  driveFolderUrl: string;
  item: ContentHqItem;
  onChange: (key: string, value: string) => void;
  onClose: () => void;
  sheetUrl: string;
}) {
  const warnings = warningsFor(item);
  const canvaDesignUrl = field(item, "Canva Design URL");
  const canvaTemplateUrl = field(item, "Canva Template URL");
  const sourceLink = field(item, "Source / Evidence");
  const shortcuts = channelShortcuts[itemChannel(item)] ?? [];

  return (
    <aside className={styles.drawer}>
      <div className={styles.drawerHeader}>
        <div className={styles.drawerMeta}>
          <span>{idFor(item)}</span>
          <ChannelBadge channel={itemChannel(item)} />
        </div>
        <h2>{titleFor(item)}</h2>
        <div className={styles.drawerActions}>
          {field(item, "Publish URL") ? (
            <ShortcutLink href={field(item, "Publish URL")}>
              Open live URL
            </ShortcutLink>
          ) : null}
          <ShortcutLink href={canvaDesignUrl || "https://www.canva.com/"}>
            {canvaDesignUrl ? "Open Canva design" : "Create in Canva"}
          </ShortcutLink>
          <ShortcutLink href={sheetUrl}>
            Open Sheet
          </ShortcutLink>
          <button onClick={onClose} type="button">
            Close
          </button>
        </div>
      </div>

      {warnings.length > 0 ? (
        <div className={styles.warningPanel}>
          <WarningChips warnings={warnings} />
        </div>
      ) : null}

      <div className={styles.drawerSection}>
        <h3>Production shortcuts</h3>
        <div className={styles.shortcutGrid}>
          <ShortcutLink href={canvaDesignUrl || "https://www.canva.com/"}>
            {canvaDesignUrl ? "Open Canva design" : "Create in Canva"}
          </ShortcutLink>
          {canvaTemplateUrl ? <ShortcutLink href={canvaTemplateUrl}>Open Canva template</ShortcutLink> : null}
          {field(item, "Publish URL") ? <ShortcutLink href={field(item, "Publish URL")}>Open live URL</ShortcutLink> : null}
          {isUrl(sourceLink) ? <ShortcutLink href={sourceLink}>Open source link</ShortcutLink> : null}
          <ShortcutLink href={driveFolderUrl}>Open Drive folder</ShortcutLink>
          <ShortcutLink href={sheetUrl}>Open tracker Sheet</ShortcutLink>
          {shortcuts.map((shortcut) => (
            <ShortcutLink href={shortcut.url} key={shortcut.label}>
              {shortcut.label}
            </ShortcutLink>
          ))}
        </div>
        {!isUrl(sourceLink) && sourceLink ? <p className={styles.localSourcePath}>Source path: {sourceLink}</p> : null}
      </div>

      <div className={styles.drawerSection}>
        <h3>Core</h3>
        <EditableField item={item} label="Title" name="Asset / Idea" onChange={onChange} />
        <div className={styles.fieldGrid}>
          <EditableField item={item} label="Channel" name="Ecosystem Area" onChange={onChange} options={contentChannels} />
          <EditableField item={item} label="Stage" name="Stage" onChange={onChange} options={stageOptions} />
          <EditableField item={item} label="Priority" name="Priority" onChange={onChange} options={priorityOptions} />
          <EditableField item={item} label="Label" name="Seasonality" onChange={onChange} options={["Evergreen", "Seasonal"]} />
          <EditableField item={item} label="Work date" name="Work Date" onChange={onChange} type="date" />
          <EditableField item={item} label="Target publish" name="Target Publish Date" onChange={onChange} type="date" />
        </div>
        <div className={styles.dateActions}>
          {field(item, "Work Date") ? (
            <button className={styles.secondaryAction} onClick={() => onChange("Work Date", "")} type="button">
              Remove work date
            </button>
          ) : null}
          {field(item, "Target Publish Date") ? (
            <button className={styles.secondaryAction} onClick={() => onChange("Target Publish Date", "")} type="button">
              Remove target publish date
            </button>
          ) : null}
        </div>
      </div>

      <div className={styles.drawerSection}>
        <h3>Strategy</h3>
        <div className={styles.fieldGrid}>
          <EditableField item={item} label="Topic" name="Topic / Cluster" onChange={onChange} />
          <EditableField item={item} label="Planning month" name="Planning Month" onChange={onChange} />
          <EditableField item={item} label="Pillar" name="Pillar" onChange={onChange} />
          <EditableField item={item} label="Audience" name="Audience" onChange={onChange} />
        </div>
        <EditableField item={item} label="Short description" name="Short Description" onChange={onChange} rows={3} type="textarea" />
        <EditableField item={item} label="CTA / goal" name="CTA / Goal" onChange={onChange} rows={2} type="textarea" />
      </div>

      <div className={styles.drawerSection}>
        <h3>Copy & captions</h3>
        <EditableField item={item} label="Copy / captions" name="Copy / Captions" onChange={onChange} rows={5} type="textarea" />
        <EditableField item={item} label="Examples" name="Examples" onChange={onChange} rows={3} type="textarea" />
        <EditableField item={item} label="Affiliate angle" name="Affiliate Angle" onChange={onChange} rows={2} type="textarea" />
      </div>

      <div className={styles.drawerSection}>
        <h3>Visual production</h3>
        <EditableField item={item} label="Canva design URL" name="Canva Design URL" onChange={onChange} />
        <EditableField item={item} label="Canva template URL" name="Canva Template URL" onChange={onChange} />
        <EditableField item={item} label="Visual asset status" name="Visual Asset Status" onChange={onChange} />
      </div>

      <div className={styles.drawerSection}>
        <h3>Open loops</h3>
        <EditableField item={item} label="Next action" name="Next Action" onChange={onChange} rows={3} type="textarea" />
        <EditableField item={item} label="Susy input" name="Susy Input" onChange={onChange} rows={2} type="textarea" />
        <EditableField item={item} label="Blocked by" name="Blocked By" onChange={onChange} />
        <EditableField item={item} label="Missing / incomplete" name="Missing / Incomplete Items" onChange={onChange} rows={3} type="textarea" />
      </div>

      <div className={styles.drawerSection}>
        <h3>Published item</h3>
        <EditableField item={item} label="Published URL" name="Publish URL" onChange={onChange} />
        <div className={styles.fieldGrid}>
          <EditableField item={item} label="Published date" name="Last Posted Date" onChange={onChange} type="date" />
          <EditableField item={item} label="Last optimized" name="Last Optimized Date" onChange={onChange} type="date" />
          <EditableField item={item} label="Last updated" name="Last Updated" onChange={onChange} type="date" />
          <EditableField item={item} label="Last checked" name="Last Checked" onChange={onChange} type="date" />
        </div>
        <EditableField item={item} label="Source link" name="Source / Evidence" onChange={onChange} />
        <EditableField item={item} label="Notes" name="Notes" onChange={onChange} rows={4} type="textarea" />
        <EditableField item={item} label="Metric snapshot" name="Metric Snapshot" onChange={onChange} rows={3} type="textarea" />
      </div>
    </aside>
  );
}
