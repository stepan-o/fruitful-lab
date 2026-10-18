#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.join(here, "bloom-whispers-content-hq.csv");
const outputPath = path.join(here, "bloom-whispers-content-dashboard.html");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === "\"") {
      if (quoted && next === "\"") {
        cell += "\"";
        i += 1;
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
      if (char === "\r" && next === "\n") i += 1;
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

  const [headers, ...records] = rows;
  return records.map((record) =>
    Object.fromEntries(headers.map((header, index) => [header, record[index] || ""])),
  );
}

function dashboardScript() {
  const items = JSON.parse(document.getElementById("content-data").textContent);
  const state = {
    area: "All",
    priority: "All",
    stage: "All",
    search: "",
  };

  const contentAreas = [
    "Blog",
    "Instagram",
    "Etsy",
    "Pinterest",
    "Podcast / YouTube",
    "Affiliate",
    "Guide",
    "Website",
  ];

  const areaOrder = [
    "All",
    "Blog",
    "Instagram",
    "Etsy",
    "Pinterest",
    "Podcast / YouTube",
    "Affiliate",
    "Guide",
    "Website",
    "Capture",
    "Planning",
    "Measurement",
    "System",
    "Published Baseline",
  ];

  const stageOrder = [
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

  const workflowLanes = [
    {
      label: "Capture",
      stages: ["Captured", "Idea Bank"],
      note: "Curated ideas worth remembering",
    },
    {
      label: "Research",
      stages: ["Needs Research", "Research Complete"],
      note: "Needs source work or has research ready",
    },
    {
      label: "Draft",
      stages: ["Selected", "Drafted"],
      note: "Chosen for production, not yet edited",
    },
    {
      label: "Edit",
      stages: ["Editor Review"],
      note: "Needs editorial approval or revision",
    },
    {
      label: "Assets",
      stages: ["Ready To Produce", "In Production"],
      note: "Visuals, product files, audio, or assembly",
    },
    {
      label: "Schedule",
      stages: ["Ready To Schedule", "Scheduled"],
      note: "Nothing missing, ready to publish",
    },
    {
      label: "Published",
      stages: ["Published"],
      note: "Live, now revision/optimization work",
    },
    {
      label: "Monitor",
      stages: ["Monitoring", "Tracking"],
      note: "Check performance and learn",
    },
    {
      label: "Repurpose",
      stages: ["Repurpose Candidate"],
      note: "Only blogs and podcasts create repurpose tasks",
    },
    {
      label: "Archive",
      stages: ["Hold", "Archived"],
      note: "Paused, parked, or intentionally done",
    },
  ];

  const monitorSpecs = [
    {
      label: "Blog",
      fields: "Published URL, indexed?, page views, traffic, affiliate clicks",
    },
    {
      label: "Pinterest",
      fields: "Saves, impressions, outbound clicks, engagement rate",
    },
    {
      label: "Instagram",
      fields: "Reach, saves, follows, likes",
    },
    {
      label: "Etsy",
      fields: "Views, favorites, sales, conversion",
    },
    {
      label: "Podcast",
      fields: "Episode status, downloads/listens",
    },
  ];

  const doneStages = new Set(["Published", "Archived", "Hold"]);
  const activeProductionStages = new Set([
    "Selected",
    "Drafted",
    "Editor Review",
    "Ready To Produce",
    "In Production",
    "Ready To Schedule",
    "Scheduled",
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\"", "&quot;")
      .replaceAll("'", "&#39;");
  }

  function slug(value) {
    return String(value || "empty").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function parseDate(value) {
    const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }

  function daysUntil(value) {
    const date = parseDate(value);
    if (!date) return null;
    return Math.round((date.getTime() - today.getTime()) / 86400000);
  }

  function daysSince(value) {
    const distance = daysUntil(value);
    return distance === null ? null : -distance;
  }

  function formatDate(value) {
    const date = parseDate(value);
    if (!date) return "";
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function dueLabel(value) {
    const days = daysUntil(value);
    if (days === null) return "No target date";
    if (days < 0) return `${Math.abs(days)}d overdue`;
    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";
    return `Due in ${days}d`;
  }

  function countBy(field, source = items) {
    return source.reduce((counts, item) => {
      const key = item[field] || "Unassigned";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
  }

  function isContentArea(item) {
    return contentAreas.includes(item["Ecosystem Area"]);
  }

  function isActive(item) {
    return !doneStages.has(item.Stage);
  }

  function isPriority(item, prefix) {
    return String(item.Priority || "").startsWith(prefix);
  }

  function priorityShort(item) {
    return (item.Priority || "None").split(" - ")[0];
  }

  function priorityRank(item) {
    if (isPriority(item, "P0")) return 0;
    if (isPriority(item, "P1")) return 1;
    if (isPriority(item, "P2")) return 2;
    if (isPriority(item, "P3")) return 3;
    if (isPriority(item, "Hold")) return 8;
    if (isPriority(item, "Done")) return 9;
    return 5;
  }

  function stageRank(item) {
    const index = stageOrder.indexOf(item.Stage);
    return index === -1 ? stageOrder.length : index;
  }

  function dateRank(item) {
    const target = parseDate(item["Target Publish Date"]);
    if (target) return target.getTime();
    const updated = parseDate(item["Last Updated"]);
    return updated ? updated.getTime() : Number.MAX_SAFE_INTEGER;
  }

  function sortedRows(source) {
    return [...source].sort((a, b) => {
      const targetA = parseDate(a["Target Publish Date"]);
      const targetB = parseDate(b["Target Publish Date"]);
      if (targetA && targetB && targetA.getTime() !== targetB.getTime()) return targetA - targetB;
      if (targetA && !targetB) return -1;
      if (!targetA && targetB) return 1;
      const priorityDiff = priorityRank(a) - priorityRank(b);
      if (priorityDiff !== 0) return priorityDiff;
      const stageDiff = stageRank(a) - stageRank(b);
      if (stageDiff !== 0) return stageDiff;
      return String(a["HQ ID"]).localeCompare(String(b["HQ ID"]));
    });
  }

  function sourceHref(source) {
    const clean = String(source || "").split(";")[0].trim();
    if (!clean) return "";
    if (/^https?:\/\//i.test(clean)) return clean;
    if (!clean.includes("/") && !/\.[a-z0-9]+$/i.test(clean)) return "";
    return encodeURI("../../../../" + clean);
  }

  function sourceLink(item) {
    const href = sourceHref(item["Source / Evidence"]);
    if (!href) return "";
    return `<a class="action-link" href="${href}">Open source</a>`;
  }

  function publishLink(item) {
    const href = item["Publish URL"];
    if (!href) return "";
    return `<a class="action-link" href="${escapeHtml(href)}">Open live</a>`;
  }

  function areaTone(area) {
    const normalized = String(area || "").toLowerCase();
    if (normalized.includes("instagram") || normalized.includes("affiliate")) return "tone-orchid";
    if (normalized.includes("pinterest")) return "tone-gold";
    if (normalized.includes("etsy")) return "tone-plum";
    if (normalized.includes("podcast") || normalized.includes("youtube")) return "tone-night";
    if (normalized.includes("blog") || normalized.includes("guide")) return "tone-sage";
    if (normalized.includes("website") || normalized.includes("measurement")) return "tone-teal";
    return "tone-neutral";
  }

  function stageTone(stage) {
    const lane = workflowLanes.find((candidate) => candidate.stages.includes(stage));
    return lane ? `stage-${slug(lane.label)}` : "stage-neutral";
  }

  function priorityTone(item) {
    if (isPriority(item, "P0")) return "priority-p0";
    if (isPriority(item, "P1")) return "priority-p1";
    if (isPriority(item, "P2")) return "priority-p2";
    if (isPriority(item, "P3")) return "priority-p3";
    if (isPriority(item, "Hold")) return "priority-hold";
    if (isPriority(item, "Done")) return "priority-done";
    return "priority-none";
  }

  function channelMatches(item, channel) {
    const area = item["Ecosystem Area"];
    const primary = item["Primary Channel"];
    const type = item["Asset Type"];
    if (channel === "Blog") {
      return area === "Blog" || area === "Guide" || (area === "Published Baseline" && type === "Article");
    }
    if (channel === "Podcast / YouTube") {
      return area === "Podcast / YouTube" || primary === "Podcast" || primary === "YouTube";
    }
    if (channel === "Website") {
      return area === "Website" || area === "Measurement" || primary === "Website";
    }
    return area === channel || primary === channel;
  }

  function matchesArea(item) {
    return state.area === "All" || item["Ecosystem Area"] === state.area;
  }

  function matchesPriority(item) {
    return state.priority === "All" || String(item.Priority || "").startsWith(state.priority);
  }

  function matchesStage(item) {
    return state.stage === "All" || item.Stage === state.stage;
  }

  function matchesSearch(item) {
    const haystack = Object.values(item).join(" ").toLowerCase();
    return !state.search || haystack.includes(state.search.toLowerCase());
  }

  function matchesAll(item) {
    return matchesArea(item) && matchesPriority(item) && matchesStage(item) && matchesSearch(item);
  }

  function itemDescription(item) {
    return item["Short Description"] || item.Notes || item["Next Action"] || "";
  }

  function itemMeta(item) {
    const values = [
      item["Ecosystem Area"],
      item["Primary Channel"],
      item.Format,
      item.Seasonality,
      item["Planning Month"],
      item["Target Publish Date"] ? formatDate(item["Target Publish Date"]) : "",
    ].filter(Boolean);
    return values.map((value) => `<span>${escapeHtml(value)}</span>`).join("");
  }

  function codexPrompt(item) {
    return [
      `Open Bloom Whispers Content HQ item ${item["HQ ID"]}: ${item["Asset / Idea"]}.`,
      `Channel: ${item["Ecosystem Area"] || item["Primary Channel"]}.`,
      `Current stage: ${item.Stage}.`,
      `Priority: ${item.Priority}.`,
      item["Planning Month"] ? `Planning month: ${item["Planning Month"]}.` : "",
      item["Target Publish Date"] ? `Target publish date: ${item["Target Publish Date"]}.` : "",
      `Next action: ${item["Next Action"] || "clarify the next action"}.`,
      item["Susy Input"] ? `Susy input needed: ${item["Susy Input"]}.` : "",
      item["Blocked By"] ? `Blocked by: ${item["Blocked By"]}.` : "",
      item["Source / Evidence"] ? `Source: ${item["Source / Evidence"]}.` : "",
      "Help me move this one concrete step forward and tell me exactly how to update the tracker afterward.",
    ].filter(Boolean).join(" ");
  }

  function card(item, options = {}) {
    const compact = options.compact ? " card-compact" : "";
    const due = item["Target Publish Date"] ? dueLabel(item["Target Publish Date"]) : "";
    const susy = item["Susy Input"];
    const blocker = item["Blocked By"];
    return `
      <article class="content-card ${areaTone(item["Ecosystem Area"])}${compact}" data-id="${escapeHtml(item["HQ ID"])}">
        <div class="card-top">
          <span class="id">${escapeHtml(item["HQ ID"])}</span>
          <div class="chip-row">
            <span class="status-chip ${priorityTone(item)}">${escapeHtml(priorityShort(item))}</span>
            <span class="status-chip ${stageTone(item.Stage)}">${escapeHtml(item.Stage)}</span>
          </div>
        </div>
        <h3>${escapeHtml(item["Asset / Idea"])}</h3>
        <p class="description">${escapeHtml(itemDescription(item))}</p>
        <div class="meta">${itemMeta(item)}</div>
        ${due ? `<p class="due-line">${escapeHtml(due)}</p>` : ""}
        <dl>
          <div>
            <dt>Next action</dt>
            <dd>${escapeHtml(item["Next Action"] || "Clarify next action")}</dd>
          </div>
          ${susy ? `<div class="needs-susy"><dt>Susy input</dt><dd>${escapeHtml(susy)}</dd></div>` : ""}
          ${blocker ? `<div class="blocked"><dt>Blocked by</dt><dd>${escapeHtml(blocker)}</dd></div>` : ""}
        </dl>
        <div class="card-actions">
          ${publishLink(item)}
          ${sourceLink(item)}
          <button data-copy="${escapeHtml(item["HQ ID"])}" type="button">Copy Codex ask</button>
        </div>
      </article>
    `;
  }

  function miniCard(item) {
    const due = item["Target Publish Date"] ? dueLabel(item["Target Publish Date"]) : "Needs target date";
    return `
      <button class="mini-card ${areaTone(item["Ecosystem Area"])}" data-focus="${escapeHtml(item["HQ ID"])}" type="button">
        <span class="mini-title">${escapeHtml(item["Asset / Idea"])}</span>
        <span class="mini-meta">${escapeHtml(priorityShort(item))} · ${escapeHtml(item["Ecosystem Area"])} · ${escapeHtml(due)}</span>
      </button>
    `;
  }

  function renderAreaTabs() {
    const counts = countBy("Ecosystem Area");
    const extras = Object.keys(counts).filter((area) => !areaOrder.includes(area)).sort();
    const areas = [...areaOrder, ...extras].filter((area, index, list) => list.indexOf(area) === index);
    document.getElementById("area-tabs").innerHTML = areas.map((area) => {
      const count = area === "All" ? items.length : counts[area] || 0;
      if (count === 0 && area !== "All") return "";
      return `
        <button class="area-tab ${state.area === area ? "is-active" : ""}" data-area="${escapeHtml(area)}" type="button">
          <span>${escapeHtml(area)}</span>
          <strong>${count}</strong>
        </button>
      `;
    }).join("");
  }

  function renderHeroStats() {
    const open = items.filter((item) => isActive(item)).length;
    const planned = items.filter((item) => item["Planning Month"] && isActive(item)).length;
    const dateLocked = items.filter((item) => item["Target Publish Date"] && isActive(item)).length;
    const missingDate = items.filter((item) =>
      isActive(item) && isContentArea(item) && (isPriority(item, "P0") || isPriority(item, "P1")) && !item["Target Publish Date"],
    ).length;
    const published = items.filter((item) => item.Stage === "Published").length;
    const stats = [
      ["Tracked", items.length, "Everything visible"],
      ["Open", open, "Not published, held, or archived"],
      ["Planned", planned, "Has planning month"],
      ["Date locked", dateLocked, "Has target publish date"],
      ["Needs date", missingDate, "P0/P1 without target"],
      ["Published", published, "Done, now optimize"],
    ];
    document.getElementById("hero-stats").innerHTML = stats.map(([label, value, note]) => `
      <article class="hero-stat">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
        <small>${escapeHtml(note)}</small>
      </article>
    `).join("");
  }

  function renderToday() {
    const dueSoon = sortedRows(items.filter((item) => {
      const days = daysUntil(item["Target Publish Date"]);
      return isActive(item) && isContentArea(item) && days !== null && days <= 7;
    }));
    const dateMissing = sortedRows(items.filter((item) =>
      isActive(item) &&
      isContentArea(item) &&
      !item["Target Publish Date"] &&
      (isPriority(item, "P0") || isPriority(item, "P1")),
    )).slice(0, 6);

    document.getElementById("today-work").innerHTML = dueSoon.length
      ? dueSoon.slice(0, 6).map((item) => card(item, { compact: true })).join("")
      : `
        <div class="empty-block">
          <strong>No date-locked work is due in the next 7 days.</strong>
          <p>The next useful action is to assign target publish dates to the chosen P0/P1 work.</p>
        </div>
      `;

    document.getElementById("date-missing").innerHTML = dateMissing.length
      ? dateMissing.map(miniCard).join("")
      : `<p class="empty-state">All active P0/P1 content has target dates.</p>`;
  }

  function lastPostedFor(label) {
    const candidates = items.filter((item) => {
      if (!item["Last Posted Date"]) return false;
      if (label === "Instagram") return channelMatches(item, "Instagram");
      if (label === "Blog") return channelMatches(item, "Blog");
      if (label === "Etsy") return channelMatches(item, "Etsy");
      return false;
    });
    return candidates.sort((a, b) => dateRank(b) - dateRank(a))[0] || null;
  }

  function nextForChannel(label) {
    return sortedRows(items.filter((item) =>
      isActive(item) &&
      channelMatches(item, label) &&
      (isPriority(item, "P0") || isPriority(item, "P1")),
    ))[0] || null;
  }

  function renderLastPosted() {
    const channels = ["Instagram", "Blog", "Etsy"];
    document.getElementById("last-posted").innerHTML = channels.map((label) => {
      const posted = lastPostedFor(label);
      const next = nextForChannel(label);
      if (!posted) {
        return `
          <article class="last-card ${areaTone(label)}">
            <span class="section-kicker">${escapeHtml(label)}</span>
            <h3>No posted record in HQ yet</h3>
            <p>${next ? `Next: ${escapeHtml(next["Asset / Idea"])}` : "Add the first posted item when it exists."}</p>
          </article>
        `;
      }
      return `
        <article class="last-card ${areaTone(label)}">
          <span class="section-kicker">${escapeHtml(label)} · ${escapeHtml(formatDate(posted["Last Posted Date"]))}</span>
          <h3>${escapeHtml(posted["Asset / Idea"])}</h3>
          <p>${escapeHtml(posted["Next Action"] || "Monitor and optimize.")}</p>
          <div class="card-actions">${publishLink(posted)}${sourceLink(posted)}</div>
        </article>
      `;
    }).join("");
  }

  function renderActiveQueue() {
    const p0 = sortedRows(items.filter((item) => isActive(item) && isPriority(item, "P0") && matchesArea(item))).slice(0, 3);
    const p1 = sortedRows(items.filter((item) => isActive(item) && isPriority(item, "P1") && matchesArea(item))).slice(0, 5);
    document.getElementById("active-queue").innerHTML = [...p0, ...p1].map((item) => card(item, { compact: true })).join("");
  }

  function renderReady() {
    const ready = sortedRows(items.filter((item) =>
      matchesArea(item) &&
      item.Stage === "Ready To Schedule" &&
      !item["Blocked By"] &&
      !item["Susy Input"],
    ));
    const nearReady = sortedRows(items.filter((item) =>
      matchesArea(item) &&
      ["Editor Review", "Ready To Produce", "In Production"].includes(item.Stage),
    )).slice(0, 4);
    document.getElementById("ready-publish").innerHTML = ready.length
      ? ready.slice(0, 6).map((item) => card(item, { compact: true })).join("")
      : `
        <div class="empty-block">
          <strong>No item is marked ready to publish.</strong>
          <p>Ready means nothing is missing. Closest items are shown below.</p>
          <div class="mini-list">${nearReady.map(miniCard).join("") || `<p class="empty-state">No near-ready items in this filter.</p>`}</div>
        </div>
      `;
  }

  function renderForgotten() {
    const forgotten = sortedRows(items.filter((item) => {
      if (!matchesArea(item) || !isActive(item) || !activeProductionStages.has(item.Stage)) return false;
      const age = daysSince(item["Last Updated"]);
      return age === null || age >= 7;
    })).slice(0, 8);

    document.getElementById("forgotten").innerHTML = forgotten.length
      ? forgotten.map((item) => {
          const age = daysSince(item["Last Updated"]);
          const note = age === null ? "No last update date" : `${age}d since last update`;
          return `
            <article class="forgotten-row ${areaTone(item["Ecosystem Area"])}">
              <div>
                <span class="id">${escapeHtml(item["HQ ID"])} · ${escapeHtml(note)}</span>
                <strong>${escapeHtml(item["Asset / Idea"])}</strong>
                <p>${escapeHtml(item["Next Action"] || "Clarify next action")}</p>
              </div>
              <button data-focus="${escapeHtml(item["HQ ID"])}" type="button">Open</button>
            </article>
          `;
        }).join("")
      : `<p class="empty-state">No stale active-production loops in this filter.</p>`;
  }

  function renderChannelCommand() {
    const channels = ["Blog", "Instagram", "Etsy", "Pinterest", "Podcast / YouTube", "Affiliate", "Website"];
    document.getElementById("channel-command").innerHTML = channels.map((channel) => {
      const scoped = items.filter((item) => channelMatches(item, channel));
      const open = scoped.filter(isActive);
      const p0 = open.filter((item) => isPriority(item, "P0")).length;
      const p1 = open.filter((item) => isPriority(item, "P1")).length;
      const ready = scoped.filter((item) => item.Stage === "Ready To Schedule").length;
      const top = sortedRows(open.filter((item) => isPriority(item, "P0") || isPriority(item, "P1")))[0];
      return `
        <button class="channel-card ${areaTone(channel)} ${state.area === channel ? "is-active" : ""}" data-channel-area="${escapeHtml(channel)}" type="button">
          <div class="channel-top">
            <span>${escapeHtml(channel)}</span>
            <strong>${open.length}</strong>
          </div>
          <div class="channel-stats">
            <span>${p0} P0</span>
            <span>${p1} P1</span>
            <span>${ready} ready</span>
          </div>
          <p>${top ? escapeHtml(top["Asset / Idea"]) : "No active P0/P1 item."}</p>
        </button>
      `;
    }).join("");
  }

  function renderPipeline() {
    const base = sortedRows(items.filter((item) => matchesArea(item) && matchesPriority(item) && matchesSearch(item)));
    document.getElementById("pipeline-board").innerHTML = workflowLanes.map((lane) => {
      const laneItems = base.filter((item) => lane.stages.includes(item.Stage));
      return `
        <section class="lane">
          <div class="lane-head">
            <div>
              <h3>${escapeHtml(lane.label)}</h3>
              <p>${escapeHtml(lane.note)}</p>
            </div>
            <strong>${laneItems.length}</strong>
          </div>
          <div class="lane-list">
            ${laneItems.slice(0, 8).map(miniCard).join("") || `<p class="empty-state">No items.</p>`}
            ${laneItems.length > 8 ? `<span class="more-count">+${laneItems.length - 8} more</span>` : ""}
          </div>
        </section>
      `;
    }).join("");
  }

  function monthValue(label) {
    const date = new Date(`${label} 1`);
    return Number.isNaN(date.getTime()) ? Number.MAX_SAFE_INTEGER : date.getTime();
  }

  function renderMonthlyPlan() {
    const planned = sortedRows(items.filter((item) =>
      isActive(item) &&
      matchesArea(item) &&
      matchesPriority(item) &&
      matchesSearch(item) &&
      (item["Planning Month"] || isPriority(item, "P0") || isPriority(item, "P1")),
    ));
    const months = [...new Set(planned.map((item) => item["Planning Month"] || "Needs planning month"))]
      .sort((a, b) => monthValue(a) - monthValue(b));
    document.getElementById("month-board").innerHTML = months.map((month) => {
      const monthItems = planned.filter((item) => (item["Planning Month"] || "Needs planning month") === month);
      return `
        <section class="month-lane ${month === "Needs planning month" ? "needs-plan" : ""}">
          <div class="month-head">
            <h3>${escapeHtml(month)}</h3>
            <strong>${monthItems.length}</strong>
          </div>
          <div class="lane-list">${monthItems.slice(0, 8).map(miniCard).join("")}</div>
        </section>
      `;
    }).join("") || `<p class="empty-state">No monthly planning items match this filter.</p>`;
  }

  function renderCaptureInbox() {
    const capture = sortedRows(items.filter((item) =>
      matchesArea(item) &&
      matchesPriority(item) &&
      matchesSearch(item) &&
      ["Captured", "Idea Bank"].includes(item.Stage),
    ));
    document.getElementById("capture-inbox").innerHTML = capture.slice(0, 18).map((item) => card(item, { compact: true })).join("");
    document.getElementById("capture-count").textContent = `${capture.length} curated ideas`;
  }

  function monitorItemFor(label) {
    const channel = label === "Podcast" ? "Podcast / YouTube" : label;
    const candidates = items.filter((item) =>
      channelMatches(item, channel) &&
      (item["Metric Snapshot"] || item["Last Checked"] || item.Stage === "Monitoring" || item["Last Posted Date"]),
    );
    return sortedRows(candidates).sort((a, b) => {
      const checkedA = parseDate(a["Last Checked"] || a["Last Posted Date"]);
      const checkedB = parseDate(b["Last Checked"] || b["Last Posted Date"]);
      return (checkedB ? checkedB.getTime() : 0) - (checkedA ? checkedA.getTime() : 0);
    })[0] || null;
  }

  function renderMonitor() {
    document.getElementById("monitor-snapshot").innerHTML = monitorSpecs.map((spec) => {
      const item = monitorItemFor(spec.label);
      if (!item) {
        return `
          <article class="monitor-card ${areaTone(spec.label)}">
            <span class="section-kicker">${escapeHtml(spec.label)}</span>
            <h3>Needs metric capture</h3>
            <p>${escapeHtml(spec.fields)}</p>
          </article>
        `;
      }
      return `
        <article class="monitor-card ${areaTone(spec.label)}">
          <span class="section-kicker">${escapeHtml(spec.label)} · ${escapeHtml(item["Last Checked"] ? formatDate(item["Last Checked"]) : "not checked")}</span>
          <h3>${escapeHtml(item["Asset / Idea"])}</h3>
          <p>${escapeHtml(item["Metric Snapshot"] || spec.fields)}</p>
        </article>
      `;
    }).join("");
  }

  function renderExploreSelectors() {
    const priorities = ["All", "P0", "P1", "P2", "P3", "Hold", "Done"];
    const stages = ["All", ...stageOrder.filter((stage) => items.some((item) => item.Stage === stage))];
    document.getElementById("priority-filter").innerHTML = priorities
      .map((priority) => `<option value="${escapeHtml(priority)}">${escapeHtml(priority)}</option>`)
      .join("");
    document.getElementById("stage-filter").innerHTML = stages
      .map((stage) => `<option value="${escapeHtml(stage)}">${escapeHtml(stage)}</option>`)
      .join("");
  }

  function renderExplore() {
    const filtered = sortedRows(items.filter(matchesAll));
    document.getElementById("visible-count").textContent = `${filtered.length} visible`;
    document.getElementById("items-grid").innerHTML = filtered.map((item) => card(item, { compact: true })).join("");
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function focusItem(id) {
    state.search = id;
    document.getElementById("search").value = id;
    document.getElementById("explore-details").open = true;
    render();
    document.getElementById("explore").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function bindEvents() {
    document.addEventListener("click", async (event) => {
      const tab = event.target.closest("[data-area]");
      if (tab) {
        state.area = tab.dataset.area;
        render();
        return;
      }

      const channel = event.target.closest("[data-channel-area]");
      if (channel) {
        const area = channel.dataset.channelArea;
        state.area = area === "Podcast / YouTube" ? "Podcast / YouTube" : area;
        render();
        document.getElementById("pipeline").scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const focus = event.target.closest("[data-focus]");
      if (focus) {
        focusItem(focus.dataset.focus);
        return;
      }

      const copyButton = event.target.closest("[data-copy]");
      if (copyButton) {
        const item = items.find((candidate) => candidate["HQ ID"] === copyButton.dataset.copy);
        if (!item) return;
        await copyText(codexPrompt(item));
        const original = copyButton.textContent;
        copyButton.textContent = "Copied";
        window.setTimeout(() => {
          copyButton.textContent = original;
        }, 1200);
      }

      const clear = event.target.closest("#clear-filters");
      if (clear) {
        state.area = "All";
        state.priority = "All";
        state.stage = "All";
        state.search = "";
        document.getElementById("search").value = "";
        document.getElementById("priority-filter").value = "All";
        document.getElementById("stage-filter").value = "All";
        render();
      }
    });

    document.getElementById("search").addEventListener("input", (event) => {
      state.search = event.target.value.trim();
      render();
    });

    document.getElementById("priority-filter").addEventListener("change", (event) => {
      state.priority = event.target.value;
      render();
    });

    document.getElementById("stage-filter").addEventListener("change", (event) => {
      state.stage = event.target.value;
      renderExplore();
    });
  }

  function render() {
    renderAreaTabs();
    renderHeroStats();
    renderToday();
    renderLastPosted();
    renderActiveQueue();
    renderReady();
    renderForgotten();
    renderChannelCommand();
    renderPipeline();
    renderMonthlyPlan();
    renderCaptureInbox();
    renderMonitor();
    renderExplore();
  }

  document.getElementById("today-label").textContent = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  document.getElementById("generated-date").textContent = new Date().toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  renderExploreSelectors();
  bindEvents();
  render();
}

const rows = parseCsv(fs.readFileSync(csvPath, "utf8"));
const dataJson = JSON.stringify(rows).replace(/</g, "\\u003c");
const scriptSource = `(${dashboardScript.toString()})();`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Bloom Whispers Content HQ</title>
  <style>
    :root {
      color-scheme: light;
      --night-garden: #014047;
      --moon-cream: #f9f1e4;
      --pollen-gold: #e7a767;
      --leaf-sage: #5c9f82;
      --flower-orchid: #c563b7;
      --deep-plum: #46043c;
      --ink: #261b22;
      --muted: #675a62;
      --paper: #fffaf1;
      --surface: rgba(255, 255, 255, 0.76);
      --surface-strong: #fffdf7;
      --surface-soft: rgba(249, 241, 228, 0.74);
      --line: rgba(70, 4, 60, 0.16);
      --night-line: rgba(249, 241, 228, 0.2);
      --gold-line: rgba(231, 167, 103, 0.48);
      --sage-soft: rgba(92, 159, 130, 0.16);
      --gold-soft: rgba(231, 167, 103, 0.22);
      --orchid-soft: rgba(197, 99, 183, 0.14);
      --plum-soft: rgba(70, 4, 60, 0.11);
      --night-soft: rgba(1, 64, 71, 0.1);
      --shadow: 0 18px 54px rgba(70, 4, 60, 0.11);
    }

    * {
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      background:
        linear-gradient(180deg, rgba(249, 241, 228, 0.92), rgba(255, 250, 241, 1) 40%, rgba(249, 241, 228, 0.96)),
        var(--moon-cream);
      color: var(--ink);
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.45;
    }

    a {
      color: var(--night-garden);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    button,
    input,
    select {
      font: inherit;
    }

    button {
      cursor: pointer;
    }

    .shell {
      width: min(1440px, calc(100vw - 32px));
      margin: 0 auto;
      padding: 22px 0 56px;
    }

    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(260px, 360px);
      overflow: hidden;
      border: 1px solid var(--gold-line);
      border-radius: 8px;
      background:
        linear-gradient(135deg, rgba(1, 64, 71, 0.96), rgba(70, 4, 60, 0.94)),
        url("../../../../apps/bloom-whispers/public/assets/hero-midnight-garden.png") center / cover,
        var(--night-garden);
      box-shadow: var(--shadow);
      color: var(--moon-cream);
    }

    .hero > * {
      min-width: 0;
    }

    .hero-copy {
      padding: 26px;
    }

    .logo-lockup {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      margin-bottom: 12px;
    }

    .logo-lockup img {
      width: 56px;
      height: 56px;
      object-fit: contain;
    }

    .eyebrow {
      display: inline-flex;
      width: fit-content;
      padding: 5px 9px;
      border: 1px solid var(--night-line);
      border-radius: 999px;
      background: rgba(249, 241, 228, 0.1);
      color: var(--pollen-gold);
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0;
      text-transform: uppercase;
    }

    h1,
    h2,
    h3,
    p {
      margin-top: 0;
    }

    h1 {
      max-width: 760px;
      margin-bottom: 10px;
      font-size: 3rem;
      line-height: 1;
      letter-spacing: 0;
      overflow-wrap: break-word;
    }

    .hero p {
      max-width: 780px;
      margin-bottom: 0;
      color: rgba(249, 241, 228, 0.84);
      font-size: 1rem;
      overflow-wrap: break-word;
    }

    .hero-panel {
      display: grid;
      gap: 14px;
      align-content: space-between;
      padding: 22px;
      border-left: 1px solid var(--night-line);
      background: rgba(249, 241, 228, 0.08);
    }

    .hero-panel strong {
      display: block;
      color: var(--moon-cream);
      font-size: 1.15rem;
      line-height: 1.2;
    }

    .hero-panel .section-kicker {
      color: rgba(249, 241, 228, 0.72);
    }

    .hero-panel a,
    .jump-link {
      display: inline-flex;
      width: fit-content;
      min-height: 34px;
      align-items: center;
      padding: 7px 10px;
      border: 1px solid var(--gold-line);
      border-radius: 8px;
      background: rgba(231, 167, 103, 0.14);
      color: var(--moon-cream);
      font-size: 0.85rem;
      font-weight: 800;
      text-decoration: none;
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      margin-top: 18px;
    }

    .hero-stat {
      min-width: 0;
      padding: 10px;
      border: 1px solid var(--night-line);
      border-radius: 8px;
      background: rgba(249, 241, 228, 0.08);
    }

    .section-kicker,
    .hero-stat span,
    .kpi span {
      display: block;
      color: var(--muted);
      font-size: 0.74rem;
      font-weight: 800;
      letter-spacing: 0;
      text-transform: uppercase;
    }

    .hero-stat span {
      color: rgba(249, 241, 228, 0.7);
    }

    .hero-stat strong {
      display: block;
      margin: 4px 0 2px;
      color: var(--moon-cream);
      font-size: 1.45rem;
      line-height: 1;
    }

    .hero-stat small {
      color: rgba(249, 241, 228, 0.72);
      font-size: 0.76rem;
    }

    .nav-row,
    .area-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .nav-row {
      margin: 16px 0 10px;
    }

    .area-tabs {
      margin-bottom: 16px;
    }

    .nav-row a,
    .area-tab,
    .action-link,
    .card-actions button,
    .mini-card,
    .forgotten-row button,
    .filters button,
    .channel-card {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface-strong);
      color: var(--ink);
    }

    .nav-row a {
      display: inline-flex;
      min-height: 34px;
      align-items: center;
      padding: 7px 10px;
      font-weight: 750;
      text-decoration: none;
    }

    .area-tab {
      display: inline-flex;
      gap: 8px;
      align-items: center;
      min-height: 38px;
      padding: 8px 10px;
      font-weight: 800;
    }

    .area-tab strong {
      display: inline-grid;
      min-width: 24px;
      height: 24px;
      place-items: center;
      padding: 0 6px;
      border-radius: 999px;
      background: var(--surface-soft);
      color: var(--muted);
      font-size: 0.78rem;
    }

    .area-tab.is-active,
    .channel-card.is-active {
      border-color: var(--night-garden);
      background: var(--night-garden);
      color: var(--moon-cream);
    }

    .area-tab.is-active strong {
      background: rgba(249, 241, 228, 0.14);
      color: var(--moon-cream);
    }

    .section-panel {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      box-shadow: var(--shadow);
    }

    .section-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: start;
      padding: 16px 16px 0;
    }

    .section-head h2 {
      margin-bottom: 4px;
      font-size: 1.15rem;
      letter-spacing: 0;
    }

    .section-head p {
      margin-bottom: 0;
      color: var(--muted);
      font-size: 0.9rem;
    }

    .top-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.24fr) minmax(320px, 0.76fr);
      gap: 16px;
      align-items: start;
      margin-bottom: 16px;
    }

    .stack {
      display: grid;
      gap: 16px;
    }

    .cards-grid,
    .last-posted-grid,
    .channel-grid,
    .monitor-grid,
    .items-grid {
      display: grid;
      gap: 10px;
      padding: 16px;
    }

    .cards-grid,
    .last-posted-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .channel-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .monitor-grid {
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }

    .items-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .content-card,
    .last-card,
    .monitor-card {
      display: grid;
      gap: 9px;
      min-width: 0;
      padding: 13px;
      border: 1px solid var(--line);
      border-left: 5px solid var(--night-garden);
      border-radius: 8px;
      background: var(--surface-strong);
    }

    .card-compact {
      padding: 12px;
    }

    .content-card h3,
    .last-card h3,
    .monitor-card h3 {
      margin-bottom: 0;
      font-size: 1rem;
      line-height: 1.22;
      letter-spacing: 0;
    }

    .description,
    .last-card p,
    .monitor-card p {
      margin-bottom: 0;
      color: var(--muted);
      font-size: 0.86rem;
    }

    .card-top,
    .chip-row,
    .card-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      align-items: center;
      justify-content: space-between;
    }

    .chip-row {
      justify-content: end;
    }

    .id {
      color: var(--muted);
      font-size: 0.76rem;
      font-weight: 850;
      letter-spacing: 0;
    }

    .status-chip {
      display: inline-flex;
      width: fit-content;
      min-height: 23px;
      align-items: center;
      padding: 3px 7px;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 850;
      white-space: nowrap;
    }

    .priority-p0 {
      background: var(--orchid-soft);
      color: #7d2872;
    }

    .priority-p1 {
      background: var(--gold-soft);
      color: #7f4d14;
    }

    .priority-p2 {
      background: var(--sage-soft);
      color: var(--night-garden);
    }

    .priority-p3 {
      background: var(--surface-soft);
      color: var(--muted);
    }

    .priority-hold,
    .stage-archive {
      background: var(--plum-soft);
      color: var(--deep-plum);
    }

    .priority-done,
    .stage-published,
    .stage-monitor,
    .stage-repurpose {
      background: var(--sage-soft);
      color: #316049;
    }

    .stage-capture {
      background: var(--surface-soft);
      color: var(--muted);
    }

    .stage-research,
    .stage-draft {
      background: var(--night-soft);
      color: var(--night-garden);
    }

    .stage-edit,
    .stage-assets,
    .stage-schedule {
      background: var(--gold-soft);
      color: #7f4d14;
    }

    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }

    .meta span {
      padding: 2px 6px;
      border: 1px solid var(--line);
      border-radius: 999px;
      color: var(--muted);
      background: rgba(249, 241, 228, 0.58);
      font-size: 0.73rem;
      font-weight: 750;
    }

    .due-line {
      width: fit-content;
      margin-bottom: 0;
      padding: 4px 8px;
      border-radius: 999px;
      background: var(--night-soft);
      color: var(--night-garden);
      font-size: 0.78rem;
      font-weight: 850;
    }

    dl {
      display: grid;
      gap: 7px;
      margin: 0;
    }

    dt {
      color: var(--muted);
      font-size: 0.68rem;
      font-weight: 850;
      text-transform: uppercase;
    }

    dd {
      margin: 0;
      color: var(--ink);
      font-size: 0.84rem;
    }

    .needs-susy dd,
    .blocked dd {
      color: var(--deep-plum);
      font-weight: 700;
    }

    .action-link,
    .card-actions button,
    .forgotten-row button,
    .filters button {
      display: inline-flex;
      min-height: 32px;
      align-items: center;
      padding: 6px 9px;
      font-size: 0.78rem;
      font-weight: 800;
    }

    .action-link:hover,
    .card-actions button:hover,
    .mini-card:hover,
    .forgotten-row button:hover,
    .channel-card:hover,
    .filters button:hover {
      border-color: var(--pollen-gold);
      box-shadow: 0 8px 20px rgba(70, 4, 60, 0.1);
      text-decoration: none;
    }

    .empty-block,
    .empty-state {
      color: var(--muted);
      font-size: 0.88rem;
    }

    .empty-block {
      padding: 16px;
    }

    .empty-block strong {
      display: block;
      color: var(--ink);
      margin-bottom: 4px;
    }

    .empty-block p {
      margin-bottom: 0;
    }

    .mini-list {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }

    .mini-card {
      display: grid;
      gap: 3px;
      width: 100%;
      min-width: 0;
      padding: 9px;
      text-align: left;
      border-left-width: 5px;
    }

    .mini-title {
      overflow: hidden;
      font-weight: 800;
      line-height: 1.2;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mini-meta,
    .more-count {
      color: var(--muted);
      font-size: 0.76rem;
    }

    .forgotten-list {
      display: grid;
      gap: 9px;
      padding: 16px;
    }

    .forgotten-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      padding: 11px;
      border: 1px solid var(--line);
      border-left: 5px solid var(--night-garden);
      border-radius: 8px;
      background: var(--surface-strong);
    }

    .forgotten-row strong {
      display: block;
      margin: 2px 0 3px;
      line-height: 1.2;
    }

    .forgotten-row p {
      margin-bottom: 0;
      color: var(--muted);
      font-size: 0.84rem;
    }

    .channel-card {
      display: grid;
      gap: 8px;
      min-width: 0;
      padding: 12px;
      text-align: left;
      border-left-width: 5px;
    }

    .channel-top {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      align-items: center;
    }

    .channel-top span {
      overflow: hidden;
      font-weight: 850;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .channel-top strong {
      color: var(--night-garden);
      font-size: 1.2rem;
    }

    .channel-card.is-active .channel-top strong,
    .channel-card.is-active p,
    .channel-card.is-active .channel-stats span {
      color: var(--moon-cream);
    }

    .channel-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }

    .channel-stats span {
      padding: 2px 6px;
      border-radius: 999px;
      background: var(--surface-soft);
      color: var(--muted);
      font-size: 0.72rem;
      font-weight: 800;
    }

    .channel-card p {
      margin-bottom: 0;
      overflow: hidden;
      color: var(--ink);
      font-size: 0.82rem;
      font-weight: 700;
      line-height: 1.2;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .pipeline-board,
    .month-board {
      display: grid;
      gap: 10px;
      padding: 16px;
    }

    .pipeline-board {
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }

    .month-board {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .lane,
    .month-lane {
      display: grid;
      gap: 10px;
      min-width: 0;
      align-content: start;
      padding: 12px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(249, 241, 228, 0.58);
    }

    .needs-plan {
      background: rgba(231, 167, 103, 0.13);
    }

    .lane-head,
    .month-head {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: start;
    }

    .lane-head h3,
    .month-head h3 {
      margin-bottom: 2px;
      font-size: 0.98rem;
    }

    .lane-head p {
      margin-bottom: 0;
      color: var(--muted);
      font-size: 0.76rem;
    }

    .lane-head strong,
    .month-head strong {
      display: inline-grid;
      min-width: 28px;
      height: 28px;
      place-items: center;
      border-radius: 999px;
      background: var(--surface-strong);
      color: var(--night-garden);
      font-size: 0.78rem;
    }

    .lane-list {
      display: grid;
      gap: 7px;
    }

    .explore {
      margin-top: 16px;
    }

    .explore details {
      padding: 0;
    }

    .explore summary {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 16px;
      cursor: pointer;
      font-weight: 850;
    }

    .filters {
      display: grid;
      grid-template-columns: minmax(220px, 1fr) 180px 220px auto;
      gap: 10px;
      padding: 0 16px 16px;
    }

    .filters label {
      display: grid;
      gap: 6px;
      color: var(--muted);
      font-size: 0.76rem;
      font-weight: 850;
      text-transform: uppercase;
    }

    .filters input,
    .filters select {
      width: 100%;
      height: 40px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface-strong);
      color: var(--ink);
      padding: 0 10px;
      outline: none;
    }

    .filters input:focus,
    .filters select:focus {
      border-color: var(--night-garden);
      box-shadow: 0 0 0 3px rgba(1, 64, 71, 0.14);
    }

    .filters button {
      align-self: end;
      height: 40px;
    }

    .tone-sage {
      border-left-color: var(--leaf-sage);
    }

    .tone-orchid {
      border-left-color: var(--flower-orchid);
    }

    .tone-gold {
      border-left-color: var(--pollen-gold);
    }

    .tone-plum {
      border-left-color: var(--deep-plum);
    }

    .tone-night,
    .tone-teal {
      border-left-color: var(--night-garden);
    }

    .tone-neutral {
      border-left-color: var(--gold-line);
    }

    .footer-note {
      margin: 18px 2px 0;
      color: var(--muted);
      font-size: 0.84rem;
    }

    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      font-size: 0.92em;
    }

    @media (max-width: 1240px) {
      .top-grid,
      .hero {
        grid-template-columns: 1fr;
      }

      .hero-panel {
        border-top: 1px solid var(--night-line);
        border-left: 0;
      }

      .cards-grid,
      .last-posted-grid,
      .items-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .channel-grid,
      .monitor-grid,
      .pipeline-board {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    @media (max-width: 820px) {
      html,
      body {
        overflow-x: clip;
      }

      .shell {
        width: calc(100% - 18px);
        max-width: none;
        margin: 0 auto;
        padding-top: 9px;
      }

      .hero {
        width: 100%;
        max-width: 100%;
      }

      .hero-copy,
      .hero-panel {
        padding: 18px;
      }

      h1 {
        max-width: 100%;
        font-size: 1.72rem;
        line-height: 1.04;
        overflow-wrap: anywhere;
      }

      .hero-stats,
      .cards-grid,
      .last-posted-grid,
      .channel-grid,
      .monitor-grid,
      .pipeline-board,
      .month-board,
      .items-grid,
      .filters {
        grid-template-columns: 1fr;
      }

      .section-head,
      .forgotten-row {
        display: grid;
      }

      .mini-title,
      .channel-card p {
        white-space: normal;
      }
    }
  </style>
</head>
<body>
  <div class="shell">
    <header class="hero">
      <div class="hero-copy">
        <div class="logo-lockup">
          <img src="../../../../apps/bloom-whispers/public/assets/bloom%20whispers%20assets%20logo%20white.png" alt="Bloom Whispers logo">
          <span class="eyebrow">Content HQ</span>
        </div>
        <h1>Bloom Whispers command center.</h1>
        <p>Designed around execution: what to work on today, what is actually ready, what got forgotten mid-production, what needs Susy input, and what was last posted.</p>
        <div class="hero-stats" id="hero-stats" aria-label="Content HQ summary"></div>
      </div>
      <aside class="hero-panel" aria-label="Source of truth">
        <div>
          <span class="section-kicker">Source of truth</span>
          <strong>bloom-whispers-content-hq.csv</strong>
        </div>
        <div>
          <span class="section-kicker">Today</span>
          <strong id="today-label"></strong>
          <span class="section-kicker">Generated <b id="generated-date"></b></span>
        </div>
        <a href="bloom-whispers-content-hq.csv">Open tracker CSV</a>
      </aside>
    </header>

    <nav class="nav-row" aria-label="Dashboard sections">
      <a href="#today">Today</a>
      <a href="#channels">Channels</a>
      <a href="#pipeline">Pipeline</a>
      <a href="#monthly">Monthly planning</a>
      <a href="#capture">Capture inbox</a>
      <a href="#monitor">Monitor</a>
      <a href="#explore">Full tracker</a>
    </nav>

    <nav class="area-tabs" id="area-tabs" aria-label="Area filters"></nav>

    <main>
      <section class="top-grid" id="today">
        <section class="section-panel">
          <div class="section-head">
            <div>
              <span class="section-kicker">What should I work on today?</span>
              <h2>Overdue, due today, and due in the next 7 days</h2>
              <p>This is driven by Target Publish Date. If nothing is date-locked, the planning gap appears beside it.</p>
            </div>
          </div>
          <div class="cards-grid" id="today-work"></div>
        </section>

        <div class="stack">
          <section class="section-panel">
            <div class="section-head">
              <div>
                <span class="section-kicker">Planning gap</span>
                <h2>P0/P1 work missing target dates</h2>
                <p>These must be dated during the monthly planning session.</p>
              </div>
            </div>
            <div class="forgotten-list" id="date-missing"></div>
          </section>

          <section class="section-panel">
            <div class="section-head">
              <div>
                <span class="section-kicker">Last posted</span>
                <h2>Instagram, blog, and Etsy</h2>
              </div>
            </div>
            <div class="last-posted-grid" id="last-posted"></div>
          </section>
        </div>
      </section>

      <section class="top-grid">
        <section class="section-panel">
          <div class="section-head">
            <div>
              <span class="section-kicker">Active queue</span>
              <h2>3 P0 items and 5 P1 items</h2>
              <p>This is the focus cap, not the whole backlog.</p>
            </div>
          </div>
          <div class="cards-grid" id="active-queue"></div>
        </section>

        <div class="stack">
          <section class="section-panel">
            <div class="section-head">
              <div>
                <span class="section-kicker">Ready to publish</span>
                <h2>Nothing missing</h2>
              </div>
            </div>
            <div id="ready-publish"></div>
          </section>

          <section class="section-panel">
            <div class="section-head">
              <div>
                <span class="section-kicker">Forgotten content</span>
                <h2>In pipeline, no update in 7+ days</h2>
              </div>
            </div>
            <div class="forgotten-list" id="forgotten"></div>
          </section>
        </div>
      </section>

      <section class="section-panel" id="channels">
        <div class="section-head">
          <div>
            <span class="section-kicker">Home by channel and priority</span>
            <h2>Channel command cards</h2>
            <p>Each lane shows open work, P0/P1 pressure, ready-to-publish count, and the top next item.</p>
          </div>
        </div>
        <div class="channel-grid" id="channel-command"></div>
      </section>

      <section class="section-panel explore" id="pipeline">
        <div class="section-head">
          <div>
            <span class="section-kicker">Trello-style view</span>
            <h2>Pipeline board</h2>
            <p>Captured, Research, Draft, Edit, Assets, Schedule, Published, Monitor, Repurpose, Archive.</p>
          </div>
        </div>
        <div class="pipeline-board" id="pipeline-board"></div>
      </section>

      <section class="section-panel explore" id="monthly">
        <div class="section-head">
          <div>
            <span class="section-kicker">Monthly planning</span>
            <h2>Plan around the 20th, execute next month</h2>
            <p>Use this to choose what Bloom Whispers will work on across IG, blog, Etsy, and podcast.</p>
          </div>
        </div>
        <div class="month-board" id="month-board"></div>
      </section>

      <section class="section-panel explore" id="capture">
        <div class="section-head">
          <div>
            <span class="section-kicker">Capture inbox</span>
            <h2>Curated ideas worth remembering</h2>
            <p id="capture-count">0 curated ideas</p>
          </div>
        </div>
        <div class="items-grid" id="capture-inbox"></div>
      </section>

      <section class="section-panel explore" id="monitor">
        <div class="section-head">
          <div>
            <span class="section-kicker">Light monitoring snapshot</span>
            <h2>Metrics to capture by channel</h2>
            <p>Keep the deep metrics dashboard separate; this view only shows whether each lane has the right signals.</p>
          </div>
        </div>
        <div class="monitor-grid" id="monitor-snapshot"></div>
      </section>

      <section class="section-panel explore" id="explore">
        <details id="explore-details">
          <summary>
            <span>Open full tracker search</span>
            <span id="visible-count">0 visible</span>
          </summary>
          <div class="filters">
            <label>
              Search
              <input id="search" type="search" placeholder="Try dandelion, Etsy, podcast, Queen Anne">
            </label>
            <label>
              Priority
              <select id="priority-filter"></select>
            </label>
            <label>
              Stage
              <select id="stage-filter"></select>
            </label>
            <button id="clear-filters" type="button">Clear</button>
          </div>
          <div class="items-grid" id="items-grid"></div>
        </details>
      </section>
    </main>

    <p class="footer-note">Generated from the Bloom Whispers Content HQ CSV. Refresh after tracker changes with <code>node docs/brands/bloom-whispers/content-hq/build-dashboard.mjs</code>.</p>
  </div>

  <script id="content-data" type="application/json">${dataJson}</script>
  <script>${scriptSource}</script>
</body>
</html>
`;

fs.writeFileSync(outputPath, html);
console.log(`Wrote ${path.relative(process.cwd(), outputPath)} from ${rows.length} rows.`);
