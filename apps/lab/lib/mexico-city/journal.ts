import { STORIES, type StoryId } from "./content";

export const PLAYERS = ["Susy", "Stepan"] as const;
export type Player = (typeof PLAYERS)[number];
export type Entry = {
  read: boolean;
  visited: boolean;
  saved: boolean;
  note: string;
  photo: string;
};
export type Journal = {
  version: 1;
  players: Record<Player, Partial<Record<StoryId, Entry>>>;
};
export const STORAGE_KEY = "otra-vista-journal-v1";
export const blankEntry = (): Entry => ({
  read: false,
  visited: false,
  saved: false,
  note: "",
  photo: "",
});
export const blankJournal = (): Journal => ({
  version: 1,
  players: { Susy: {}, Stepan: {} },
});
export function points(entries: Partial<Record<StoryId, Entry>>): number {
  return Object.values(entries).reduce(
    (sum, e) =>
      sum + (e?.read ? 10 : 0) + (e?.visited ? 25 : 0) + (e?.photo ? 15 : 0),
    0,
  );
}

export function parseJournal(input: unknown): Journal {
  if (
    !input ||
    typeof input !== "object" ||
    !("version" in input) ||
    input.version !== 1 ||
    !("players" in input) ||
    !input.players ||
    typeof input.players !== "object"
  )
    throw new Error("Choose an Otra Vista journal file.");
  const result = blankJournal();
  for (const player of PLAYERS) {
    const raw = (input.players as Record<string, unknown>)[player];
    if (!raw || typeof raw !== "object")
      throw new Error("The journal is missing a player.");
    for (const { id } of STORIES) {
      const e = (raw as Record<string, unknown>)[id];
      if (!e) continue;
      if (typeof e !== "object")
        throw new Error("The journal contains an invalid discovery.");
      const r = e as Record<string, unknown>;
      const photo = typeof r.photo === "string" ? r.photo : "";
      if (
        photo.length > 260000 ||
        (photo && !/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(photo))
      )
        throw new Error("The journal contains an unsupported photograph.");
      result.players[player][id] = {
        read: r.read === true,
        visited: r.visited === true,
        saved: r.saved === true,
        note: typeof r.note === "string" ? r.note.slice(0, 500) : "",
        photo,
      };
    }
  }
  return result;
}

export function mergeJournals(a: Journal, b: Journal): Journal {
  const result = blankJournal();
  for (const player of PLAYERS)
    for (const { id } of STORIES) {
      const x = a.players[player][id] ?? blankEntry(),
        y = b.players[player][id] ?? blankEntry();
      result.players[player][id] = {
        read: x.read || y.read,
        visited: x.visited || y.visited,
        saved: x.saved || y.saved,
        note: x.note || y.note,
        photo: x.photo || y.photo,
      };
    }
  return result;
}

export async function preparePhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/") || file.size > 20_000_000)
    throw new Error("Choose a photograph under 20 MB.");
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const ratio = Math.min(
      1,
      960 / Math.max(img.naturalWidth, img.naturalHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * ratio);
    canvas.height = Math.round(img.naturalHeight * ratio);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not prepare this photo.");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let quality = 0.78,
      photo = canvas.toDataURL("image/jpeg", quality);
    while (photo.length > 260000 && quality > 0.2) {
      quality -= 0.12;
      photo = canvas.toDataURL("image/jpeg", quality);
    }
    if (photo.length > 260000)
      throw new Error(
        "This photo is too detailed to save. Try a smaller image.",
      );
    return photo;
  } finally {
    URL.revokeObjectURL(url);
  }
}
